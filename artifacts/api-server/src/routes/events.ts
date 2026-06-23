import { Router } from "express";

const router = Router();

// Config flag: "seatgeek" | "ticketmaster" | "fallback"
// Default is ticketmaster — set EVENTS_SOURCE env var to override
const EVENTS_SOURCE = process.env.EVENTS_SOURCE ?? "ticketmaster";

interface Event {
  id: string;
  title: string;
  venue: string;
  date: string;
  ticketsUrl: string;
}

interface FallbackLink {
  label: string;
  url: string;
}

const FALLBACK_LINKS: FallbackLink[] = [
  { label: "SeatGeek Seattle", url: "https://seatgeek.com/cities/seattle" },
  {
    label: "Bandsintown Seattle",
    url: "https://www.bandsintown.com/c/seattle-wa",
  },
  {
    label: "EverOut Top Events",
    url: "https://everout.com/seattle/top-events/",
  },
];

async function fetchSeatGeek(): Promise<Event[]> {
  const clientId = process.env.SEATGEEK_CLIENT_ID;
  if (!clientId) throw new Error("No SEATGEEK_CLIENT_ID");

  const now = new Date().toISOString();
  const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const params = new URLSearchParams({
    "taxonomies.name": "concert",
    lat: "47.6062",
    lon: "-122.3321",
    range: "30mi",
    "datetime_local.gte": now,
    "datetime_local.lte": future,
    sort: "datetime_local.asc",
    per_page: "15",
    client_id: clientId,
  });

  const res = await fetch(`https://api.seatgeek.com/2/events?${params}`);
  if (!res.ok) throw new Error(`SeatGeek responded ${res.status}`);

  const json = (await res.json()) as {
    events: Array<{
      id: number;
      title: string;
      datetime_local: string;
      url: string;
      venue: { name: string };
    }>;
  };

  return json.events.map((e) => ({
    id: String(e.id),
    title: e.title,
    venue: e.venue?.name ?? "Seattle",
    date: e.datetime_local,
    ticketsUrl: e.url,
  }));
}

async function fetchTicketmaster(): Promise<Event[]> {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) throw new Error("No TICKETMASTER_API_KEY");

  const now = new Date().toISOString().split(".")[0] + "Z";
  const future =
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split(".")[0] + "Z";

  type TMEvent = {
    id: string;
    name: string;
    url: string;
    dates: { start: { localDate: string; localTime?: string } };
    _embedded: { venues: Array<{ name: string }> };
  };

  type TMResponse = { _embedded?: { events: TMEvent[] } };

  // Try city=Seattle first
  const cityParams = new URLSearchParams({
    apikey: apiKey,
    classificationName: "Music",
    city: "Seattle",
    stateCode: "WA",
    startDateTime: now,
    endDateTime: future,
    sort: "date,asc",
    size: "15",
  });

  let res = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?${cityParams}`
  );
  if (!res.ok) throw new Error(`Ticketmaster responded ${res.status}`);

  let json = (await res.json()) as TMResponse;
  let events = json._embedded?.events ?? [];

  // Fallback to latlong if city query returns nothing
  if (events.length === 0) {
    const geoParams = new URLSearchParams({
      apikey: apiKey,
      classificationName: "Music",
      latlong: "47.6062,-122.3321",
      radius: "30",
      unit: "miles",
      startDateTime: now,
      endDateTime: future,
      sort: "date,asc",
      size: "15",
    });

    res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?${geoParams}`
    );
    if (!res.ok) throw new Error(`Ticketmaster latlong responded ${res.status}`);
    json = (await res.json()) as TMResponse;
    events = json._embedded?.events ?? [];
  }

  return events.map((e) => ({
    id: e.id,
    title: e.name,
    venue: e._embedded?.venues?.[0]?.name ?? "Seattle",
    date: e.dates.start.localDate +
      (e.dates.start.localTime ? `T${e.dates.start.localTime}` : ""),
    ticketsUrl: e.url,
  }));
}

router.get("/events", async (req, res) => {
  const source = EVENTS_SOURCE;

  const tmKeyPresent = !!process.env.TICKETMASTER_API_KEY;
  const sgKeyPresent = !!process.env.SEATGEEK_CLIENT_ID;
  req.log.info(
    { source, tmKeyPresent, sgKeyPresent },
    "Events endpoint called"
  );

  try {
    if (source === "seatgeek") {
      const events = await fetchSeatGeek();
      req.log.info({ eventsCount: events.length }, "SeatGeek events fetched");
      res.json({ source: "seatgeek", events, fallbackLinks: null });
      return;
    }

    if (source === "ticketmaster") {
      const events = await fetchTicketmaster();
      req.log.info({ eventsCount: events.length }, "Ticketmaster events fetched");
      res.json({ source: "ticketmaster", events, fallbackLinks: null });
      return;
    }
  } catch (err) {
    req.log.warn({ err, source }, "Primary events source failed, trying secondary");

    if (source === "seatgeek") {
      try {
        const events = await fetchTicketmaster();
        req.log.info({ eventsCount: events.length }, "Ticketmaster fallback events fetched");
        res.json({ source: "ticketmaster", events, fallbackLinks: null });
        return;
      } catch (err2) {
        req.log.warn({ err: err2 }, "Secondary events source also failed, using static fallback");
      }
    }

    if (source === "ticketmaster") {
      try {
        const events = await fetchSeatGeek();
        req.log.info({ eventsCount: events.length }, "SeatGeek fallback events fetched");
        res.json({ source: "seatgeek", events, fallbackLinks: null });
        return;
      } catch (err2) {
        req.log.warn({ err: err2 }, "SeatGeek fallback also failed, using static fallback");
      }
    }
  }

  req.log.info("Returning static fallback links");
  res.json({ source: "fallback", events: [], fallbackLinks: FALLBACK_LINKS });
});

export default router;
