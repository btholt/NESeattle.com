import { Router } from "express";

const router = Router();

// Config flag: "seatgeek" | "ticketmaster" | "fallback"
const EVENTS_SOURCE = process.env.EVENTS_SOURCE ?? "seatgeek";

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
    label: "The Stranger Events",
    url: "https://www.thestranger.com/events/music",
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

  const params = new URLSearchParams({
    apikey: apiKey,
    dmaId: "383",
    startDateTime: now,
    endDateTime: future,
    sort: "date,asc",
    size: "20",
  });

  const res = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?${params}`
  );
  if (!res.ok) throw new Error(`Ticketmaster responded ${res.status}`);

  const json = (await res.json()) as {
    _embedded?: {
      events: Array<{
        id: string;
        name: string;
        url: string;
        dates: { start: { dateTime: string } };
        _embedded: { venues: Array<{ name: string }> };
      }>;
    };
  };

  const events = json._embedded?.events ?? [];
  return events.map((e) => ({
    id: e.id,
    title: e.name,
    venue: e._embedded?.venues?.[0]?.name ?? "Seattle",
    date: e.dates.start.dateTime,
    ticketsUrl: e.url,
  }));
}

router.get("/events", async (req, res) => {
  const source = EVENTS_SOURCE;

  try {
    if (source === "seatgeek") {
      const events = await fetchSeatGeek();
      res.json({ source: "seatgeek", events, fallbackLinks: null });
      return;
    }

    if (source === "ticketmaster") {
      const events = await fetchTicketmaster();
      res.json({ source: "ticketmaster", events, fallbackLinks: null });
      return;
    }
  } catch (err) {
    req.log.warn({ err }, "Primary events source failed, trying secondary");

    if (source === "seatgeek") {
      try {
        const events = await fetchTicketmaster();
        res.json({ source: "ticketmaster", events, fallbackLinks: null });
        return;
      } catch (err2) {
        req.log.warn({ err: err2 }, "Secondary events source failed, using fallback");
      }
    }
  }

  res.json({ source: "fallback", events: [], fallbackLinks: FALLBACK_LINKS });
});

export default router;
