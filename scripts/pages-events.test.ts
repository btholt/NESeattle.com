import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

process.env.EVENTS_SOURCE = "ticketmaster";
const { getEventsResponse } = await import("../artifacts/api-server/src/routes/events.ts");
const originalFetch = globalThis.fetch;
const log = { info() {}, warn() {} };

afterEach(() => {
  globalThis.fetch = originalFetch;
  delete process.env.TICKETMASTER_API_KEY;
  delete process.env.SEATGEEK_CLIENT_ID;
});

test("missing credentials produce the existing calendar links without a network request", async () => {
  delete process.env.TICKETMASTER_API_KEY;
  delete process.env.SEATGEEK_CLIENT_ID;
  globalThis.fetch = async () => {
    throw new Error("No network request expected");
  };

  const response = await getEventsResponse(log);
  assert.equal(response.source, "fallback");
  assert.deepEqual(response.events, []);
  assert.deepEqual(response.fallbackLinks?.map((link) => link.label), [
    "SeatGeek Seattle",
    "Bandsintown Seattle",
    "EverOut Top Events",
  ]);
});

const ticketmasterEvent = {
  id: "event-1",
  name: "Seattle concert",
  url: "https://example.com/tickets",
  dates: { start: { localDate: "2026-12-01", localTime: "19:00:00" } },
  _embedded: { venues: [{ name: "Seattle venue" }] },
};

test("Ticketmaster events retain the API response shape", async () => {
  process.env.TICKETMASTER_API_KEY = "test-key";
  globalThis.fetch = async () =>
    Response.json({ _embedded: { events: [ticketmasterEvent] } });

  assert.deepEqual(await getEventsResponse(log), {
    source: "ticketmaster",
    events: [{
      id: "event-1",
      title: "Seattle concert",
      venue: "Seattle venue",
      date: "2026-12-01T19:00:00",
      ticketsUrl: "https://example.com/tickets",
    }],
    fallbackLinks: null,
  });
});

test("an empty city search retries Ticketmaster by coordinates", async () => {
  process.env.TICKETMASTER_API_KEY = "test-key";
  const requests: URL[] = [];
  globalThis.fetch = async (input) => {
    requests.push(new URL(String(input)));
    return Response.json(requests.length === 1
      ? {}
      : { _embedded: { events: [ticketmasterEvent] } });
  };

  const response = await getEventsResponse(log);
  assert.equal(response.events.length, 1);
  assert.equal(requests.length, 2);
  assert.equal(requests[0].searchParams.get("city"), "Seattle");
  assert.equal(requests[1].searchParams.get("latlong"), "47.6062,-122.3321");
});

test("a failed primary provider uses SeatGeek before the calendar fallback", async () => {
  process.env.TICKETMASTER_API_KEY = "test-key";
  process.env.SEATGEEK_CLIENT_ID = "test-client";
  globalThis.fetch = async (input) => {
    if (String(input).startsWith("https://app.ticketmaster.com/")) {
      return new Response(null, { status: 503 });
    }
    return Response.json({ events: [{
      id: 123,
      title: "SeatGeek concert",
      datetime_local: "2026-12-01T19:00:00",
      url: "https://example.com/tickets",
      venue: { name: "Seattle venue" },
    }] });
  };

  const response = await getEventsResponse(log);
  assert.equal(response.source, "seatgeek");
  assert.equal(response.events[0].id, "123");
  assert.equal(response.fallbackLinks, null);
});

test("both providers failing return calendar links and log both failures", async () => {
  process.env.TICKETMASTER_API_KEY = "test-key";
  process.env.SEATGEEK_CLIENT_ID = "test-client";
  globalThis.fetch = async () => new Response(null, { status: 503 });
  let warnings = 0;

  const response = await getEventsResponse({
    info() {},
    warn() { warnings += 1; },
  });
  assert.equal(response.source, "fallback");
  assert.equal(response.fallbackLinks?.length, 3);
  assert.equal(warnings, 2);
});
