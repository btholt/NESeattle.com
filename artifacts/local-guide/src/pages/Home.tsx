import { useState, useMemo } from "react";
import { places, Category, Price, DistanceTier, Place } from "@/data/places";
import { useGetEvents } from "@workspace/api-client-react";
import { ExternalLink, Navigation2, Baby, TreePine, Map, Calendar as CalendarIcon, Info, Car, Mountain, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

function encodePlaceQuery(name: string) {
  return encodeURIComponent(`${name} Seattle`);
}

function PlaceCard({ place }: { place: Place }) {
  return (
    <div className="bg-card rounded-xl p-5 shadow-sm border border-border flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-start gap-3 mb-2">
          <h4 className="font-serif text-lg font-medium text-foreground leading-tight">{place.name}</h4>
          {place.price && <span className="text-muted-foreground text-sm font-medium tracking-wide">{place.price}</span>}
        </div>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{place.blurb}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-muted text-foreground hover:bg-muted/80">{place.category}</Badge>
          <Badge variant="outline" className="border-border text-muted-foreground">{place.distanceTier}</Badge>
          {place.kidFriendly && (
            <Badge variant="outline" className="border-border text-muted-foreground flex items-center gap-1">
              <Baby className="w-3 h-3" /> Kid-friendly
            </Badge>
          )}
        </div>
      </div>
      <a 
        href={`https://www.google.com/maps/search/?api=1&query=${encodePlaceQuery(place.name)}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-auto w-fit"
        data-testid={`link-directions-${place.id}`}
      >
        <Navigation2 className="w-4 h-4" />
        Directions
      </a>
    </div>
  );
}

function EventsSection() {
  const { data: eventsRes, isLoading } = useGetEvents();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card rounded-xl p-5 border border-border">
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-4" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!eventsRes) return null;

  if (eventsRes.source === "fallback" && eventsRes.fallbackLinks) {
    return (
      <div className="bg-card rounded-xl p-6 md:p-8 border border-border mt-8 text-center max-w-2xl mx-auto shadow-sm">
        <CalendarIcon className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-serif text-xl md:text-2xl font-medium mb-3">Check what's on this week</h3>
        <p className="text-muted-foreground mb-6">Seattle has an incredible live music and events scene. Check these calendars for tickets:</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {eventsRes.fallbackLinks.map((link, i) => (
            <a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto justify-center"
            >
              {link.label}
              <ExternalLink className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {eventsRes.events.map(event => (
        <div key={event.id} className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h4 className="font-serif text-lg font-medium leading-tight mb-2 line-clamp-2">{event.title}</h4>
            <p className="text-muted-foreground text-sm mb-1">{event.venue}</p>
            <p className="text-muted-foreground text-sm mb-4">
              {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </p>
          </div>
          <a 
            href={event.ticketsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors justify-center w-full mt-auto"
          >
            Tickets
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterPrice, setFilterPrice] = useState<string>("All");
  const [filterDistance, setFilterDistance] = useState<string>("All");
  const [kidFriendlyOnly, setKidFriendlyOnly] = useState(false);

  const filteredPlaces = useMemo(() => {
    return places.filter(p => {
      if (filterCategory !== "All" && p.category !== filterCategory) return false;
      if (filterPrice !== "All" && p.price !== filterPrice) return false;
      if (filterDistance !== "All" && p.distanceTier !== filterDistance) return false;
      if (kidFriendlyOnly && !p.kidFriendly) return false;
      return true;
    });
  }, [filterCategory, filterPrice, filterDistance, kidFriendlyOnly]);

  const placesBySection = useMemo(() => {
    const grouped = {
      2: filteredPlaces.filter(p => p.section === 2),
      3: filteredPlaces.filter(p => p.section === 3),
      4: filteredPlaces.filter(p => p.section === 4),
      5: filteredPlaces.filter(p => p.section === 5),
      6: filteredPlaces.filter(p => p.section === 6),
    };
    return grouped;
  }, [filteredPlaces]);

  const categories = Array.from(new Set(places.map(p => p.category))).sort();
  const prices = ["$", "$$", "$$$", "$$$$"];
  const distances = ["Right outside", "Neighborhood", "Short drive", "Across town", "Day trip"];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/20 pb-24">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-3 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-serif font-medium text-lg text-primary tracking-tight">View Ridge Guide</div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground overflow-x-auto no-scrollbar">
            <a href="#essentials" className="hover:text-primary transition-colors whitespace-nowrap">Essentials</a>
            <a href="#food" className="hover:text-primary transition-colors whitespace-nowrap">Food & Drink</a>
            <a href="#explore" className="hover:text-primary transition-colors whitespace-nowrap">Explore</a>
            <a href="#events" className="hover:text-primary transition-colors whitespace-nowrap">Events</a>
            <a href="#practical" className="hover:text-primary transition-colors whitespace-nowrap">Practical</a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-12 md:pt-20">
        
        {/* Hero */}
        <section className="max-w-3xl mb-16 md:mb-24">
          <Badge variant="outline" className="mb-6 font-normal tracking-wide uppercase bg-muted/50 border-border text-secondary">
            Northeast Seattle
          </Badge>
          <h1 className="font-serif text-4xl md:text-6xl text-primary leading-[1.1] mb-6">
            Welcome to the neighborhood.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            You're staying at the crossroads of five Northeast Seattle neighborhoods — View Ridge, Wedgwood, Ravenna, the U District, and Bryant — which means you're minutes from the best of each: parks and beaches one way, great coffee and bakeries another, and the U District's energy, dining, and light rail close by.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-4 italic font-serif">
            This is everything I'd tell a friend visiting for the first time.
          </p>
        </section>

        {/* Global Filters */}
        <div className="bg-card p-4 md:p-6 rounded-2xl border border-border shadow-sm mb-16 sticky top-16 z-40">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div className="space-y-1.5 flex-1">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger data-testid="filter-category" className="bg-background">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5 flex-1">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Distance</Label>
              <Select value={filterDistance} onValueChange={setFilterDistance}>
                <SelectTrigger data-testid="filter-distance" className="bg-background">
                  <SelectValue placeholder="Any Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Any Distance</SelectItem>
                  {distances.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 flex-1">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</Label>
              <Select value={filterPrice} onValueChange={setFilterPrice}>
                <SelectTrigger data-testid="filter-price" className="bg-background">
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Any Price</SelectItem>
                  {prices.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 pt-2 md:pt-0 md:pb-2 flex-1">
              <Switch 
                id="kid-friendly" 
                checked={kidFriendlyOnly}
                onCheckedChange={setKidFriendlyOnly}
                data-testid="filter-kid-friendly"
              />
              <Label htmlFor="kid-friendly" className="cursor-pointer font-medium">Kid-friendly only</Label>
            </div>
          </div>
        </div>

        {/* Section 2: Essentials */}
        <section id="essentials" className="mb-20 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Map className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Right Outside Your Door</h2>
          </div>
          <p className="text-muted-foreground mb-8 text-lg">The neighborhood essentials: coffee, groceries, and green space.</p>
          
          {placesBySection[2].length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {placesBySection[2].map(p => <PlaceCard key={p.id} place={p} />)}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-xl p-8 text-center text-muted-foreground border border-dashed border-border">
              No places match your current filters.
            </div>
          )}
        </section>

        {/* Section 3: Food & Drink */}
        <section id="food" className="mb-20 scroll-mt-24">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Food & Drink</h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl">Curated picks across the city — from transcendent Caribbean sandwiches to splurge omakase.</p>
          
          {placesBySection[3].length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {placesBySection[3].map(p => <PlaceCard key={p.id} place={p} />)}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-xl p-8 text-center text-muted-foreground border border-dashed border-border">
              No places match your current filters.
            </div>
          )}
        </section>

        {/* Section 4 & 5: Explore & Rainy Day */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20 scroll-mt-24" id="explore">
          <section>
            <h2 className="font-serif text-3xl text-foreground mb-4">Explore Seattle</h2>
            <p className="text-muted-foreground mb-8">The first-timer hit list.</p>
            {placesBySection[4].length > 0 ? (
              <div className="space-y-4">
                {placesBySection[4].map(p => <PlaceCard key={p.id} place={p} />)}
              </div>
            ) : (
              <div className="bg-muted/50 rounded-xl p-6 text-center text-muted-foreground text-sm border border-dashed border-border">
                Adjust filters to see recommendations.
              </div>
            )}
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground mb-4">Rainy-Day Plan</h2>
            <p className="text-muted-foreground mb-8">When the weather turns, head inside.</p>
            {placesBySection[5].length > 0 ? (
              <div className="space-y-4">
                {placesBySection[5].map(p => <PlaceCard key={p.id} place={p} />)}
              </div>
            ) : (
              <div className="bg-muted/50 rounded-xl p-6 text-center text-muted-foreground text-sm border border-dashed border-border">
                Adjust filters to see recommendations.
              </div>
            )}
          </section>
        </div>

        {/* Section 6: Family & Kids */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Family & Kids</h2>
          {placesBySection[6].length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {placesBySection[6].map(p => <PlaceCard key={p.id} place={p} />)}
            </div>
          ) : (
             <div className="bg-muted/50 rounded-xl p-6 text-center text-muted-foreground text-sm border border-dashed border-border">
              Adjust filters to see recommendations.
            </div>
          )}
        </section>

        {/* Section 7: Live Music & Events */}
        <section id="events" className="mb-24 scroll-mt-24 bg-muted/30 -mx-4 md:-mx-8 px-4 md:px-8 py-16 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Live Music & Events</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl">Seattle has deep musical roots and world-class sports. Here is what is happening soon.</p>
            
            <EventsSection />

            <div className="mt-16">
              <h3 className="font-serif text-2xl mb-6">Sports & Venues</h3>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8 flex gap-4 items-start">
                <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">
                  <strong className="font-semibold block mb-1">Heads-up on bag policy at Lumen Field & Climate Pledge Arena:</strong> 
                  Both venues enforce a strict clear-bag-only policy (diaper bags are the main exception). The real move is to bring no bag at all — the bag-check line runs roughly 10× longer than the no-bag entry.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "UW Huskies", detail: "Husky Stadium — right next door" },
                  { name: "Seattle Mariners", detail: "T-Mobile Park" },
                  { name: "Seattle Kraken", detail: "Climate Pledge Arena" },
                  { name: "Seahawks / Sounders", detail: "Lumen Field" },
                  { name: "Chateau Ste. Michelle", detail: "Outdoor concerts in Woodinville" },
                  { name: "Seattle Storm (WNBA)", detail: "Climate Pledge Arena — beloved franchise" },
                  { name: "Seattle Reign FC", detail: "Lumen Field — world-class women's soccer" },
                  { name: "Seattle Torrent (PWHL)", detail: "Climate Pledge Arena — brand-new expansion" },
                ].map((venue, i) => (
                  <div key={i} className="bg-card p-4 rounded-lg border border-border shadow-sm">
                    <h4 className="font-serif font-medium mb-1 text-foreground">{venue.name}</h4>
                    <p className="text-xs text-muted-foreground leading-snug">{venue.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Neighborhoods */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">Neighborhoods to Explore</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Ballard", desc: "The brewing district, a great Sunday farmers market, and the Ballard Locks." },
              { name: "Fremont", desc: "The Troll under the bridge, quirky shops, and the Sunday market." },
              { name: "Wallingford", desc: "Laid-back, good eats, with Gas Works Park nearby." },
              { name: "Capitol Hill", desc: "The city's nightlife, dining, and live-music core." },
              { name: "U District", desc: "Student energy, cheap eats, and 'the Ave'." },
            ].map(hood => (
              <div key={hood.name} className="bg-secondary/5 border border-secondary/20 p-6 rounded-xl">
                <h3 className="font-serif text-xl font-medium text-secondary mb-2">{hood.name}</h3>
                <p className="text-foreground/80 text-sm leading-relaxed">{hood.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sections 9 & 10: Practical & Getting Around */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 mb-20 scroll-mt-24" id="practical">
          <section>
            <h2 className="font-serif text-3xl text-foreground mb-6">Practical / Good to Know</h2>
            <ul className="space-y-5">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Urgent care & ER</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">UW Medical Center and Northwest Hospital are both close; Seattle Children's is right in the neighborhood.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Pharmacy</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">The Safeway pharmacy is the nearest. Note that Seattle no longer has a true 24-hour pharmacy, so plan prescription pickups during normal hours.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Car Prowls</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Friendly heads-up: don't leave anything visible in a parked car — car prowls are the one local annoyance visitors get caught by. Take valuables with you.</p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground mb-6">Getting Around</h2>
            <div className="space-y-4">
              {[
                { title: "ORCA cards & buses", desc: "Tap to pay with contactless card or phone when you board. Several bus stops within a short walk of the unit. Android users can add ORCA to their phone.", icon: <Map className="w-5 h-5"/> },
                { title: "Link light rail", desc: "The easiest, most reliable way to/from SEA airport, and quick to downtown.", icon: <Car className="w-5 h-5"/> },
                { title: "Lyft & Uber", desc: "Both work everywhere; note the extra airport pickup/dropoff fee.", icon: <Car className="w-5 h-5"/> },
                { title: "Lime", desc: "E-bikes and scooters dotted around the city for short hops.", icon: <Sun className="w-5 h-5"/> },
              ].map((item, i) => (
                <div key={i} className="bg-card border border-border p-4 rounded-xl flex gap-4 items-start shadow-sm">
                  <div className="text-primary mt-0.5">{item.icon}</div>
                  <div>
                    <h4 className="font-medium mb-1 text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Section 11 & 12: Day Trips & Winter */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
              <Mountain className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Beyond the City</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="font-serif text-2xl mb-6 text-foreground/90">Skiing & Winter Sports</h3>
              <div className="space-y-4 mb-6">
                {[
                  { name: "The Summit at Snoqualmie", desc: "Closest, ~1 hr east on I-90. Mellow family groomers and night skiing, serious steep terrain at Alpental. (Ikon Pass)" },
                  { name: "Stevens Pass", desc: "~1.5–2 hrs north on US-2. Bigger-mountain feel, great variety, legendary tree skiing. (Epic Pass)" },
                  { name: "Crystal Mountain", desc: "~1.5–2 hrs southeast. Washington's largest ski area; gondola with jaw-dropping Rainier views. (Ikon Pass)" },
                  { name: "Mt Baker", desc: "~2.5–3 hrs north. No-frills powder mecca; holds the world record for most snowfall in a single season." }
                ].map(mountain => (
                  <div key={mountain.name} className="bg-card border border-border p-5 rounded-xl shadow-sm">
                    <h4 className="font-serif font-medium text-lg mb-2">{mountain.name}</h4>
                    <p className="text-sm text-muted-foreground">{mountain.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-muted p-5 rounded-xl border border-border">
                <h4 className="font-medium mb-1">Need Gear?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Head to <strong>evo</strong> (flagship in Fremont, plus a rental shop right at Snoqualmie Pass) or the <strong>REI Flagship</strong> in South Lake Union — an 80,000 sq ft "timbered cathedral" with a 65-foot indoor climbing pinnacle; a Seattle attraction in its own right.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl mb-6 text-foreground/90">Day Trips</h3>
              <div className="grid gap-4">
                {[
                  { name: "Mount Rainier National Park", desc: "The mountain up close." },
                  { name: "Snoqualmie Falls + Salish Lodge", desc: "A dramatic waterfall, ~40 min out." },
                  { name: "Leavenworth", desc: "The Bavarian-themed mountain town." },
                  { name: "Woodinville Wine Country", desc: "One of the best places in the USA to taste wine." },
                ].map(trip => (
                  <div key={trip.name} className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center justify-between group">
                    <div>
                      <h4 className="font-serif font-medium text-lg mb-1">{trip.name}</h4>
                      <p className="text-sm text-muted-foreground">{trip.desc}</p>
                    </div>
                    <TreePine className="w-6 h-6 text-secondary/40 group-hover:text-secondary transition-colors" />
                  </div>
                ))}
                
                <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
                  <h4 className="font-serif font-medium text-lg mb-2">San Juan Islands</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Whales, slow island time, some of the prettiest scenery in the state. Drive to Anacortes (~1.5 hrs north) for the Washington State Ferry. If bringing a car, make a reservation.
                  </p>
                  <div className="bg-primary/5 text-primary text-xs p-3 rounded border border-primary/10">
                    <strong>Insider trick:</strong> Walk on without a reservation and get around by bike/shuttle/rental. Favorites: Orcas Island and San Juan Island.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-muted/50 border-t border-border py-12 text-center text-muted-foreground mt-24">
        <p className="font-serif italic">Have a wonderful stay in Seattle.</p>
      </footer>
    </div>
  );
}
