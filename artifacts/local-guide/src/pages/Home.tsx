import { useState, useMemo } from "react";
import { places, Place } from "@/data/places";
import { useGetEvents } from "@workspace/api-client-react";
import logoPath from "@assets/logo-removebg-preview_1782171480209.png";
import {
  ExternalLink,
  Navigation2,
  Baby,
  TreePine,
  Map,
  Calendar as CalendarIcon,
  Info,
  Car,
  Mountain,
  Sun,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

// IDs of the three Ballard district breweries that get the featured callout
const BALLARD_BREWERY_IDS = ["p32", "p33", "p34", "p60", "p61", "p62"];

function encodePlaceQuery(name: string) {
  return encodeURIComponent(`${name} Seattle`);
}

function PlaceCardImage({ place }: { place: Place }) {
  if (place.image) {
    return (
      <div className="relative w-full overflow-hidden rounded-t-xl" style={{ aspectRatio: "4/3" }}>
        <img
          src={place.image}
          alt={place.name}
          loading="lazy"
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Fallback: soft PNW-toned gradient with first initial
  const gradientByCategory: Record<string, string> = {
    "Parks & Outdoors": "from-emerald-50 via-green-100 to-teal-100",
    "Coffee & Bakery": "from-amber-50 via-orange-100 to-stone-100",
    "Coffee": "from-amber-50 via-stone-100 to-orange-50",
    "Brewery": "from-amber-50 via-orange-50 to-amber-100",
    "Winery": "from-purple-50 via-rose-50 to-purple-100",
    "Cocktails": "from-slate-100 via-blue-50 to-indigo-100",
    "Sushi": "from-sky-50 via-blue-100 to-cyan-50",
    "Restaurants": "from-rose-50 via-orange-50 to-amber-50",
    "Burgers": "from-orange-50 via-amber-100 to-yellow-50",
    "Pizza": "from-red-50 via-orange-100 to-amber-50",
    "Sights": "from-violet-50 via-purple-50 to-indigo-100",
    "Shopping": "from-pink-50 via-rose-50 to-red-50",
    "Groceries": "from-green-50 via-emerald-50 to-teal-50",
    "Family": "from-yellow-50 via-amber-50 to-orange-50",
  };

  const gradient = gradientByCategory[place.category] ?? "from-stone-100 via-slate-50 to-stone-100";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-t-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
      style={{ aspectRatio: "4/3" }}
      aria-hidden
    >
      <span className="text-5xl font-serif font-medium text-primary/20 select-none">
        {place.name[0]}
      </span>
    </div>
  );
}

function PlaceCard({ place }: { place: Place }) {
  return (
    <div
      className="bg-card rounded-xl shadow-sm border border-border flex flex-col h-full hover:shadow-md transition-shadow overflow-hidden"
      data-testid={`card-place-${place.id}`}
    >
      <PlaceCardImage place={place} />
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start gap-3 mb-2">
            <h4 className="font-serif text-lg font-medium text-foreground leading-tight">{place.name}</h4>
            {place.price && (
              <span className="text-muted-foreground text-sm font-medium tracking-wide shrink-0">{place.price}</span>
            )}
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
    </div>
  );
}

function EventsSection() {
  const { data: eventsRes, isLoading } = useGetEvents();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map((i) => (
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
        <p className="text-muted-foreground mb-6">
          Seattle has an incredible live music and events scene. Check these calendars for tickets:
        </p>
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
      {eventsRes.events.map((event) => (
        <div
          key={event.id}
          className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
        >
          <div>
            <h4 className="font-serif text-lg font-medium leading-tight mb-2 line-clamp-2">{event.title}</h4>
            <p className="text-muted-foreground text-sm mb-1">{event.venue}</p>
            <p className="text-muted-foreground text-sm mb-4">
              {new Date(event.date).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
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

function EmptyState() {
  return (
    <div className="bg-muted/50 rounded-xl p-8 text-center text-muted-foreground border border-dashed border-border">
      No places match your current filters.
    </div>
  );
}

export default function Home() {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterPrice, setFilterPrice] = useState<string>("All");
  const [filterDistance, setFilterDistance] = useState<string>("All");
  const [kidFriendlyOnly, setKidFriendlyOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = [
    filterCategory !== "All",
    filterPrice !== "All",
    filterDistance !== "All",
    kidFriendlyOnly,
  ].filter(Boolean).length;

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      if (filterCategory !== "All" && p.category !== filterCategory) return false;
      if (filterPrice !== "All" && p.price !== filterPrice) return false;
      if (filterDistance !== "All" && p.distanceTier !== filterDistance) return false;
      if (kidFriendlyOnly && !p.kidFriendly) return false;
      return true;
    });
  }, [filterCategory, filterPrice, filterDistance, kidFriendlyOnly]);

  const placesBySection = useMemo(() => ({
    2: filteredPlaces.filter((p) => p.section === 2),
    3: filteredPlaces.filter((p) => p.section === 3),
    4: filteredPlaces.filter((p) => p.section === 4),
    5: filteredPlaces.filter((p) => p.section === 5),
    6: filteredPlaces.filter((p) => p.section === 6),
  }), [filteredPlaces]);

  // Split section 3 into Ballard breweries (featured) and everything else
  const ballardBreweries = useMemo(
    () => placesBySection[3].filter((p) => BALLARD_BREWERY_IDS.includes(p.id)),
    [placesBySection]
  );
  const nonBallardSection3 = useMemo(
    () => placesBySection[3].filter((p) => !BALLARD_BREWERY_IDS.includes(p.id)),
    [placesBySection]
  );

  const categories = Array.from(new Set(places.map((p) => p.category))).sort();
  const prices = ["$", "$$", "$$$", "$$$$"];
  const distances = ["Right outside", "Neighborhood", "Short drive", "Across town", "Day trip"];

  const clearFilters = () => {
    setFilterCategory("All");
    setFilterPrice("All");
    setFilterDistance("All");
    setKidFriendlyOnly(false);
  };

  const FilterPanel = () => (
    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
      <div className="space-y-1.5 flex-1">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</Label>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger data-testid="filter-category" className="bg-background">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
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
            {distances.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
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
            {prices.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
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
  );

  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/20">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-3 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logoPath} alt="NE Seattle Guide" className="h-9 w-auto" />
            <span className="font-serif font-medium text-lg text-primary tracking-tight leading-none">NE Seattle Guide</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground overflow-x-auto no-scrollbar">
            <a href="#essentials" className="hover:text-primary transition-colors whitespace-nowrap">Essentials</a>
            <a href="#food" className="hover:text-primary transition-colors whitespace-nowrap">Food & Drink</a>
            <a href="#explore" className="hover:text-primary transition-colors whitespace-nowrap">Explore</a>
            <a href="#events" className="hover:text-primary transition-colors whitespace-nowrap">Events</a>
            <a href="#practical" className="hover:text-primary transition-colors whitespace-nowrap">Practical</a>
          </div>
        </div>
      </nav>

      {/* Hero — full width with optional banner image */}
      <div className="relative overflow-hidden">
        {/* Fallback gradient — always rendered underneath */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        {/* Banner image — shown when /images/hero.jpg exists */}
        <img
          src="/images/hero.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        {/* Dark gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-14 md:pt-24 pb-16 md:pb-28">
          <Badge variant="outline" className="mb-6 font-normal tracking-wide uppercase bg-muted/50 border-border text-secondary">
            Northeast Seattle
          </Badge>
          <h1 className="font-serif text-4xl md:text-6xl text-primary leading-[1.1] mb-6 max-w-3xl">
            Welcome to the neighborhood.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            You're staying at the crossroads of five Northeast Seattle neighborhoods — View Ridge, Wedgwood, Ravenna, the U District, and Bryant — which means you're minutes from the best of each: parks and beaches one way, great coffee and bakeries another, and the U District's energy, dining, and light rail close by.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-4 italic font-serif max-w-3xl">
            This is everything I'd tell a friend visiting for the first time.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pb-24">

        {/* Table of Contents */}
        <nav className="mb-12 mt-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Jump to</p>
          <ul className="flex flex-wrap gap-2">
            {[
              { label: "Right Outside Your Door", href: "#essentials", icon: "🌿" },
              { label: "Food & Drink", href: "#food", icon: "🍽️" },
              { label: "Explore Seattle", href: "#explore", icon: "🌆" },
              { label: "Rainy-Day Plan", href: "#rainy-day", icon: "🌧️" },
              { label: "Family & Kids", href: "#kids", icon: "👨‍👩‍👧" },
              { label: "Live Music & Events", href: "#events", icon: "🎵" },
              { label: "Neighborhoods", href: "#neighborhoods", icon: "🏘️" },
              { label: "Practical Info", href: "#practical", icon: "ℹ️" },
              { label: "Skiing", href: "#skiing", icon: "⛷️" },
              { label: "Day Trips", href: "#day-trips", icon: "🚗" },
            ].map(({ label, href, icon }) => (
              <li key={href}>
                <a
                  href={href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-muted hover:bg-primary/10 hover:text-primary text-foreground/80 transition-colors border border-transparent hover:border-primary/20"
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Filter bar */}
        <div className="mb-16 sticky top-16 z-40">
          {/* Mobile: compact toggle bar */}
          <div className="md:hidden bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium"
              data-testid="button-toggle-filters"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {filtersOpen ? (
                <X className="w-4 h-4 text-muted-foreground" />
              ) : (
                <span className="text-xs text-muted-foreground">
                  {activeFilterCount > 0 ? `${activeFilterCount} active` : "Tap to filter"}
                </span>
              )}
            </button>
            {filtersOpen && (
              <div className="px-5 pb-5 border-t border-border pt-4">
                <FilterPanel />
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm text-primary hover:text-primary/70 transition-colors"
                    data-testid="button-clear-filters"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Desktop: always visible */}
          <div className="hidden md:block bg-card p-6 rounded-2xl border border-border shadow-sm">
            <FilterPanel />
            {activeFilterCount > 0 && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/70 transition-colors"
                  data-testid="button-clear-filters-desktop"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Right Outside Your Door */}
        <section id="essentials" className="mb-20 scroll-mt-40">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Map className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Right Outside Your Door</h2>
          </div>
          <p className="text-muted-foreground mb-8 text-lg">The neighborhood essentials: coffee, groceries, and green space.</p>
          {placesBySection[2].length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {placesBySection[2].map((p) => <PlaceCard key={p.id} place={p} />)}
            </div>
          ) : <EmptyState />}
        </section>

        {/* Section 3: Food & Drink */}
        <section id="food" className="mb-20 scroll-mt-40">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Food & Drink</h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl">Curated picks across the city — from transcendent Caribbean sandwiches to splurge omakase.</p>

          {placesBySection[3].length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* All non-Ballard section 3 places */}
              {nonBallardSection3.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {nonBallardSection3.map((p) => <PlaceCard key={p.id} place={p} />)}
                </div>
              )}

              {/* Ballard Brewing District — featured callout */}
              {ballardBreweries.length > 0 && (
                <div className="mb-8">
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <TreePine className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground mb-2">
                          The Ballard Brewing District
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          An attraction unto itself: over a dozen breweries in a few walkable blocks, with a legendary pub crawl between them. Start with these six — they're my picks — then wander freely. You genuinely can't go wrong with any of them over there.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {ballardBreweries.map((p) => <PlaceCard key={p.id} place={p} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Section 4: Explore Seattle */}
        <section id="explore" className="mb-20 scroll-mt-40">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Explore Seattle</h2>
          <p className="text-muted-foreground mb-8 text-lg">The first-timer hit list.</p>
          {placesBySection[4].length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {placesBySection[4].map((p) => <PlaceCard key={p.id} place={p} />)}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-xl p-6 text-center text-muted-foreground text-sm border border-dashed border-border">
              Adjust filters to see recommendations.
            </div>
          )}
        </section>

        {/* Section 5: Rainy Day */}
        <section id="rainy-day" className="mb-20 scroll-mt-40">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Rainy-Day Plan</h2>
          <p className="text-muted-foreground mb-8 text-lg">When the weather turns, head inside.</p>
          {placesBySection[5].length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {placesBySection[5].map((p) => <PlaceCard key={p.id} place={p} />)}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-xl p-6 text-center text-muted-foreground text-sm border border-dashed border-border">
              Adjust filters to see recommendations.
            </div>
          )}
        </section>

        {/* Section 6: Family & Kids */}
        <section id="kids" className="mb-20 scroll-mt-40">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Family & Kids</h2>
          {placesBySection[6].length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {placesBySection[6].map((p) => <PlaceCard key={p.id} place={p} />)}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-xl p-6 text-center text-muted-foreground text-sm border border-dashed border-border">
              Adjust filters to see recommendations.
            </div>
          )}
        </section>

        {/* Section 7: Live Music & Events */}
        <section
          id="events"
          className="mb-24 scroll-mt-40 bg-muted/30 -mx-4 md:-mx-8 px-4 md:px-8 py-16 border-y border-border"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Live Music & Events</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
              Seattle has deep musical roots and a packed calendar of touring acts and local shows. It's always worth a glance at who's in town.
            </p>

            <EventsSection />

            <div className="mt-16">
              <h3 className="font-serif text-2xl mb-6">Sports & Venues</h3>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8 flex gap-4 items-start">
                <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">
                  <strong className="font-semibold block mb-1">Heads-up on bag policy at Lumen Field, Climate Pledge Arena, T-Mobile Park, Husky Stadium & Alaska Airlines Arena:</strong>
                  All five venues enforce a strict clear-bag-only policy (diaper bags are the main exception). The real move is to bring no bag at all — the bag-check line runs roughly 10× longer than the no-bag entry.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "UW Huskies", detail: "Husky Stadium (football) · Alaska Airlines Arena (basketball) — both right next door. The college game atmosphere here is legitimately great.", logo: "/images/uw.png" },
                  { name: "Seattle Mariners", detail: "T-Mobile Park — one of the best baseball experiences in the league; catch a summer game with the roof open if the weather holds.", logo: "/images/mariners.png" },
                  { name: "Seattle Kraken", detail: "Climate Pledge Arena — Seattle's NHL franchise, playing in one of the greenest arenas in the world. Great atmosphere even for casual fans.", logo: "/images/kraken.png" },
                  { name: "Seattle Seahawks", detail: "Lumen Field — one of the loudest stadiums in the NFL. The 12s make it a genuine home-field advantage; the noise is real.", logo: "/images/seahawk.png" },
                  { name: "Seattle Sounders FC", detail: "Lumen Field — the most decorated MLS club in history, with a passionate supporter section and a World Cup-level atmosphere on big nights.", logo: "/images/sounders.png" },
                  { name: "Seattle Storm", detail: "Climate Pledge Arena — four-time WNBA champions and one of the most storied franchises in women's basketball. Worth going.", logo: "/images/storm.png" },
                  { name: "Seattle Reign FC", detail: "Lumen Field — consistent NWSL contenders playing elite women's soccer in front of a loud, knowledgeable crowd.", logo: "/images/reign.png" },
                  { name: "Seattle Torrent", detail: "Climate Pledge Arena — Seattle's PWHL expansion team, joining one of the fastest-growing leagues in professional sports.", logo: "/images/torrent.png" },
                  { name: "Chateau Ste. Michelle", detail: "Outdoor amphitheater in Woodinville — the best summer concert setting in the region. Bring a blanket and arrive early for the lawn.", emoji: "🍷" },
                  { name: "Showbox", detail: "The legendary mid-size room where Nirvana and Pearl Jam played their way up. Cramped, loud, and perfect for any touring act.", emoji: "🎵" },
                  { name: "Paramount Theatre", detail: "Historic 1928 downtown theater for major touring acts and Broadway shows — great sightlines from nearly every seat.", emoji: "🎵" },
                  { name: "The 5th Avenue Theatre", detail: "Gorgeous 1926 Chinese-inspired theater; world-class musicals including many pre-Broadway tryouts that debut here first.", emoji: "🎭" },
                ].map((venue, i) => (
                  <div key={i} className="bg-card p-4 rounded-lg border border-border shadow-sm flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-serif font-medium text-foreground">{venue.name}</h4>
                      {'logo' in venue && venue.logo ? (
                        <img src={venue.logo} alt={venue.name} className="h-7 w-auto object-contain shrink-0" />
                      ) : (
                        <span className="text-xl leading-none shrink-0">{'emoji' in venue ? venue.emoji : ''}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{venue.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Neighborhoods */}
        <section id="neighborhoods" className="mb-20 scroll-mt-40">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">Neighborhoods to Explore</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Ballard", desc: "The brewing district, a great Sunday farmers market, and the Ballard Locks." },
              { name: "Fremont", desc: "The Troll under the bridge, quirky shops, and the Sunday market." },
              { name: "Wallingford", desc: "Laid-back, good eats, with Gas Works Park nearby." },
              { name: "Capitol Hill", desc: "The city's nightlife, dining, and live-music core." },
              { name: "U District", desc: "Student energy, cheap eats, and 'the Ave'." },
              { name: "Greenwood", desc: "Low-key, deeply local neighborhood with great bars, coffee, and some of the best casual dining in the city." },
            ].map((hood) => (
              <div key={hood.name} className="bg-secondary/5 border border-secondary/20 p-6 rounded-xl">
                <h3 className="font-serif text-xl font-medium text-secondary mb-2">{hood.name}</h3>
                <p className="text-foreground/80 text-sm leading-relaxed">{hood.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sections 9 & 10: Practical & Getting Around */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 mb-20 scroll-mt-40" id="practical">
          <section>
            <h2 className="font-serif text-3xl text-foreground mb-6">Practical / Good to Know</h2>
            <ul className="space-y-5">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Urgent care & ER</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    UW Medical Center and Northwest Hospital are both close; Seattle Children's is right in the neighborhood.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Pharmacy</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The Safeway pharmacy is the nearest. Note that Seattle no longer has a true 24-hour pharmacy, so plan prescription pickups during normal hours.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Car prowls</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Don't leave anything visible in a parked car — car prowls are the one local annoyance visitors get caught by. This especially means luggage: a bag in the back seat is an invitation. Take valuables with you and leave the trunk empty and visible.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-foreground mb-6">Getting Around</h2>
            <div className="space-y-4">
              {[
                {
                  title: "ORCA cards & buses",
                  desc: "Tap to pay with contactless card or phone when you board. Several bus stops within a short walk. Android users can add ORCA to their phone.",
                  icon: <Map className="w-5 h-5" />,
                },
                {
                  title: "Link light rail",
                  desc: "The easiest, most reliable way to/from SEA airport, and quick to downtown.",
                  icon: <Car className="w-5 h-5" />,
                },
                {
                  title: "Lyft & Uber",
                  desc: "Both work everywhere; note the extra airport pickup/dropoff fee.",
                  icon: <Car className="w-5 h-5" />,
                },
                {
                  title: "Lime",
                  desc: "E-bikes and scooters dotted around the city for short hops.",
                  icon: <Sun className="w-5 h-5" />,
                },
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

        {/* Sections 11 & 12: Skiing & Day Trips */}
        <section id="beyond" className="mb-24 scroll-mt-40">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
              <Mountain className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">Beyond the City</h2>
          </div>

          <div className="grid gap-12">
            <div id="skiing" className="scroll-mt-40">
              <h3 className="font-serif text-2xl mb-6 text-foreground/90">Skiing & Winter Sports</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    name: "The Summit at Snoqualmie",
                    drive: "~1 hr east on I-90",
                    desc: "Closest resort and a great default. It's actually four areas in one — Alpental, Summit Central, Summit East, and Summit West. Alpental has the best terrain of the bunch but can get crowded, especially on powder days. Otherwise a chill, lovely resort — particularly good for kids and families.",
                    map: "/images/snoqualmie.jpg",
                    passes: ["ikon"],
                  },
                  {
                    name: "Stevens Pass",
                    drive: "~1.5–2 hrs north on US-2",
                    desc: "Great terrain and a genuinely fun resort. One key tip: leave early. You want to secure a parking spot at the resort itself — if you don't, they make you shuttle in from fairly far away. Aim to arrive 30–60 minutes before first chair.",
                    map: "/images/stevens.jpg",
                    passes: ["epic"],
                  },
                  {
                    name: "Crystal Mountain",
                    drive: "~2 hrs southeast",
                    desc: "Washington's largest ski area, and probably the best resort in the state if you have the time for the drive. Gondola at the top with jaw-dropping views of Mt. Rainier. The spring skiing here is particularly amazing.",
                    map: "/images/crystal.jpg",
                    passes: ["ikon"],
                  },
                  {
                    name: "Mt. Baker",
                    drive: "~2.5–3 hrs north",
                    desc: "Wild terrain and massive powder days — holds the world record for most snowfall in a single season (1,140 inches in 1998–99). If you're an advanced skier looking for challenging terrain, this is among the best in the world. Note: Baker is independent and not on Epic, Ikon, or Indy passes.",
                    map: "/images/mtbaker.jpg",
                    passes: [],
                  },
                ].map((mountain) => (
                  <div key={mountain.name} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <a href={mountain.map} target="_blank" rel="noopener noreferrer" className="block">
                      <img src={mountain.map} alt={`${mountain.name} trail map`} className="w-full h-64 object-cover object-top hover:opacity-90 transition-opacity" />
                    </a>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-serif font-medium text-lg">{mountain.name}</h4>
                        {mountain.passes.length > 0 && (
                          <div className="flex gap-1.5 shrink-0">
                            {mountain.passes.includes("ikon") && (
                              <img src="/images/ikon.jpg" alt="Ikon Pass" className="h-5 w-auto rounded object-contain" />
                            )}
                            {mountain.passes.includes("epic") && (
                              <img src="/images/epic.jpg" alt="Epic Pass" className="h-5 w-auto rounded object-contain" />
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-primary/70 font-medium mb-2">{mountain.drive}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{mountain.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-muted p-5 rounded-xl border border-border">
                <h4 className="font-medium mb-1">Need gear?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Head to <strong>evo</strong> (flagship in Fremont, plus a rental shop right at Snoqualmie Pass) or the{" "}
                  <strong>REI Flagship</strong> in South Lake Union — an 80,000 sq ft "timbered cathedral" with a 65-foot indoor
                  climbing pinnacle; a Seattle attraction in its own right.
                </p>
              </div>
            </div>

            <div id="day-trips" className="scroll-mt-40">
              <h3 className="font-serif text-2xl mb-6 text-foreground/90">Day Trips</h3>
              <div className="grid gap-4">
                {[
                  {
                    name: "Mount Rainier National Park",
                    drive: "~2–2.5 hrs southeast",
                    image: "/images/rainier.jpg",
                    desc: "The mountain up close — and it's staggering. The Paradise area is my favorite hike, with wildflower meadows and glacier views that don't feel real. Fair warning: Paradise is popular and can get crowded with backed-up traffic on summer weekends. Reservations required during peak season. Still completely worth it.",
                  },
                  {
                    name: "Snoqualmie Falls + Salish Lodge",
                    drive: "~40 min east on I-90",
                    image: "/images/salish-lodge.jpg",
                    desc: "A 268-foot waterfall with a gorgeous old lodge perched right above it — the Salish Lodge is genuinely beautiful and worth stopping to admire even if you're not staying. If you've ever seen Twin Peaks, you've already seen it.",
                  },
                  {
                    name: "Leavenworth",
                    drive: "~2.5 hrs east on US-2",
                    image: "/images/leavenworth.jpg",
                    desc: "A small Bavarian-themed town tucked into the Cascades that sounds kitschy but is genuinely charming. My move: grab a pretzel from one of the bakeries, walk the main street, and finish with a pint at Icicle Brewing at the end of the block.",
                  },
                  {
                    name: "Woodinville Wine Country",
                    drive: "~30–40 min northeast",
                    image: "/images/woodinville.jpg",
                    desc: "One of the best wine-tasting destinations in the country — over 100 tasting rooms packed into a small area. I've already called out my favorite wineries elsewhere in this guide. If you're making a full day of it, booking a wine tour bus is genuinely fun and takes the driving off your hands.",
                  },
                ].map((trip) => (
                  <div key={trip.name} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <img src={trip.image} alt={trip.name} className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <h4 className="font-serif font-medium text-lg mb-0.5">{trip.name}</h4>
                      <p className="text-xs text-primary/70 font-medium mb-2">{trip.drive}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{trip.desc}</p>
                    </div>
                  </div>
                ))}

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                  <img src="/images/eastsound.jpg" alt="Eastsound, Orcas Island" className="w-full h-64 object-cover" />
                  <div className="p-4">
                    <h4 className="font-serif font-medium text-lg mb-0.5">San Juan Islands</h4>
                    <p className="text-xs text-primary/70 font-medium mb-2">~1.5 hrs to Anacortes ferry terminal</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      Whales, slow island time, and some of the prettiest scenery in the state. Strong recommendation to make the trip. Drive to Anacortes and catch the Washington State Ferry — if you're bringing a car, make a reservation well in advance as sailings sell out. My absolute favorites: <strong>Eastsound</strong> on Orcas Island and <strong>Friday Harbor</strong> on San Juan Island. You must eat oysters when you're out there. And don't miss <strong>Island Hoppin' Brewery</strong> on Orcas for a well-earned pint.
                    </p>
                    <div className="bg-primary/5 text-primary text-xs p-3 rounded border border-primary/10">
                      <strong>Insider trick:</strong> Walk on as a foot passenger without a reservation and get around by bike, shuttle, or rental car on the island — no ferry wait anxiety required.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted/50 border-t border-border py-12 text-center text-muted-foreground mt-8">
        <p className="font-serif italic">Have a wonderful stay in Seattle.</p>
      </footer>
    </div>
  );
}
