export type Category = 
  | 'Groceries'
  | 'Coffee & Bakery'
  | 'Pizza'
  | 'Parks & Outdoors'
  | 'Restaurants'
  | 'Burgers'
  | 'Sushi'
  | 'Coffee'
  | 'Shopping'
  | 'Drinks'
  | 'Sights'
  | 'Family';

export type Price = '$' | '$$' | '$$$' | '$$$$';
export type DistanceTier = 'Right outside' | 'Neighborhood' | 'Short drive' | 'Across town' | 'Day trip';

export interface Place {
  id: string;
  name: string;
  blurb: string;
  category: Category;
  price?: Price;
  distanceTier: DistanceTier;
  kidFriendly: boolean;
  section: number;
  /** Optional image path served from /public/images/. Convention: /images/<slug>.jpg */
  image?: string;
}

export const places: Place[] = [
  // Section 2
  { id: 'p1', name: 'Safeway', blurb: 'Closest full grocery run. Also has a pharmacy.', category: 'Groceries', distanceTier: 'Neighborhood', kidFriendly: false, section: 2, image: '/images/safeway.jpg' },
  { id: 'p2', name: 'PCC Community Markets', blurb: 'Beloved NW co-op; excellent prepared foods, local produce, good beer/wine.', category: 'Groceries', distanceTier: 'Short drive', kidFriendly: false, section: 2, image: '/images/pcc.jpg' },
  { id: 'p3', name: 'Grateful Bread', blurb: 'Neighborhood bakery; pastries and proper loaves.', category: 'Coffee & Bakery', price: '$', distanceTier: 'Neighborhood', kidFriendly: true, section: 2, image: '/images/gratefulbread.jpg' },
  { id: 'p4', name: 'Top Pot Doughnuts', blurb: 'A Seattle doughnut institution with great coffee.', category: 'Coffee & Bakery', price: '$', distanceTier: 'Neighborhood', kidFriendly: true, section: 2, image: '/images/toppot.jpg' },
  { id: 'p5', name: 'Grand Central Bakery', blurb: 'Rustic breads, pastries, easy breakfast.', category: 'Coffee & Bakery', price: '$', distanceTier: 'Neighborhood', kidFriendly: true, section: 2, image: '/images/grandcentral.jpg' },
  { id: 'p6', name: 'Veraci Pizza', blurb: 'Wood-fired, blistered thin crust.', category: 'Pizza', price: '$$', distanceTier: 'Neighborhood', kidFriendly: true, section: 2, image: '/images/veraci.jpg' },
  { id: 'p7', name: 'Ridge Pizza', blurb: 'The reliable neighborhood slice-and-pie spot.', category: 'Pizza', price: '$$', distanceTier: 'Neighborhood', kidFriendly: true, section: 2, image: '/images/ridge.jpg' },
  { id: 'p8', name: 'Burke-Gilman Trail', blurb: 'The legendary multi-use trail; walk or bike for miles along the lake right from the neighborhood.', category: 'Parks & Outdoors', distanceTier: 'Right outside', kidFriendly: true, section: 2, image: '/images/burkegilmantrail.jpg' },
  { id: 'p9', name: 'Matthews Beach Park', blurb: "The city's biggest Lake Washington swimming beach; prime summer water fun.", category: 'Parks & Outdoors', distanceTier: 'Neighborhood', kidFriendly: true, section: 2, image: '/images/matthewsbeach.jpg' },
  { id: 'p10', name: 'Magnuson Park', blurb: 'Sprawling lakefront park: swimming, sports fields, wetlands and art walk, and Sand Point history. A whole afternoon.', category: 'Parks & Outdoors', distanceTier: 'Neighborhood', kidFriendly: true, section: 2, image: '/images/magnusonpark.jpg' },
  { id: 'p11', name: 'View Ridge Playground', blurb: 'Family playground with a splash pad in summer.', category: 'Parks & Outdoors', distanceTier: 'Neighborhood', kidFriendly: true, section: 2, image: '/images/viewridgeplayground.jpg' },
  { id: 'p12', name: 'Bryant Playground', blurb: 'Quieter neighborhood playground for families.', category: 'Parks & Outdoors', distanceTier: 'Neighborhood', kidFriendly: true, section: 2, image: '/images/bryantplayground.jpg' },
  { id: 'p13', name: 'Green Lake', blurb: "The city's favorite loop for walking, running, and paddling; magical on a sunny day — be ready, every Seattle local has the same idea, so it gets busy.", category: 'Parks & Outdoors', distanceTier: 'Short drive', kidFriendly: true, section: 2, image: '/images/greenlake.jpg' },
  { id: 'p14', name: 'University of Washington', blurb: "One of the most beautiful campuses in the country. The cherry blossom Quad in late March is legendary — rows of Yoshino cherries line the gothic buildings, petals drifting everywhere. Worth a wander any time of year; the campus itself is the attraction.", category: 'Sights', distanceTier: 'Short drive', kidFriendly: true, section: 2, image: '/images/uw.jpg' },

  // Section 3 — Casual
  { id: 'p15', name: 'Un Bien', blurb: 'Unexpectedly transcendent Caribbean sandwiches; the Caribbean Roast is the move.', category: 'Restaurants', price: '$', distanceTier: 'Short drive', kidFriendly: false, section: 3 },
  { id: 'p16', name: "Dick's Drive-In", blurb: 'Classic, cheap Seattle burgers and a genuine rite of passage.', category: 'Burgers', price: '$', distanceTier: 'Short drive', kidFriendly: true, section: 3 },
  { id: 'p17', name: 'Burgermaster', blurb: 'Old-school drive-in burgers; eat in the car.', category: 'Burgers', price: '$', distanceTier: 'Short drive', kidFriendly: true, section: 3 },
  { id: 'p18', name: 'Taurus Ox / Ox Burger', blurb: 'My favorite burger in Seattle. Taurus Ox is the Laotian spot; Ox Burger is its burger offshoot.', category: 'Burgers', price: '$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },

  // Section 3 — Sushi
  { id: 'p19', name: 'Liberty', blurb: 'A favorite local sushi spot with a serious cocktail program to match.', category: 'Sushi', price: '$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p20', name: 'Momiji', blurb: 'Excellent local sushi in a lovely room with a garden.', category: 'Sushi', price: '$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p21', name: 'LTD Edition Sushi', blurb: 'Exceptional, intimate omakase.', category: 'Sushi', price: '$$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p22', name: 'Sushi Kashiba', blurb: 'Exceptional; Shiro Kashiba is a Seattle legend. The splurge omakase.', category: 'Sushi', price: '$$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },

  // Section 3 — Pizza & Fine Dining
  { id: 'p23', name: 'My Friend Derek', blurb: 'My favorite pizza in the city.', category: 'Pizza', price: '$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p24', name: 'Canlis', blurb: "Seattle's iconic fine-dining institution: the view, the service, the occasion.", category: 'Restaurants', price: '$$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p25', name: 'The Herbfarm', blurb: 'A multi-course Pacific-Northwest tasting menu out in Woodinville; block out the whole evening.', category: 'Restaurants', price: '$$$$', distanceTier: 'Day trip', kidFriendly: false, section: 3 },

  // Section 3 — Coffee
  { id: 'p26', name: 'Herkimer Coffee', blurb: "My pick for the best roasters in the city. Worth the trip for the coffee alone — and the Phinney Ridge neighborhood around it is genuinely cute, so factor in a little wander while you're there.", category: 'Coffee', price: '$', distanceTier: 'Across town', kidFriendly: true, section: 3 },
  { id: 'p27', name: 'Milstead & Co.', blurb: 'Meticulous multi-roaster pour-overs in a beautiful room.', category: 'Coffee', price: '$', distanceTier: 'Across town', kidFriendly: true, section: 3 },

  // Section 3 — Shopping
  { id: 'p28', name: 'University Village (U Village)', blurb: "Easy, upscale open-air shopping minutes from the unit. Good anchor stores: Apple, Backcountry, Away Luggage, North Face, Lululemon, and Vuori. For food, Ba Bar (Vietnamese) and Mr. West (café/bar) are both solid picks right in the complex.", category: 'Shopping', distanceTier: 'Short drive', kidFriendly: true, section: 3 },

  // Section 3 — Neighborhood Breweries
  { id: 'p29', name: 'Human People Beer', blurb: "Solid neighborhood brewery with a welcoming taproom. They normally have great pizza, and some nights will have an amazing food pop-up — worth checking their Instagram before you go.", category: 'Drinks', price: '$$', distanceTier: 'Neighborhood', kidFriendly: false, section: 3 },
  { id: 'p30', name: 'Ravenna Brewing', blurb: "Easygoing local taproom with one of the best patios in the neighborhood for a beer outside. They usually have a food truck on-site, so you can make a proper meal of it.", category: 'Drinks', price: '$$', distanceTier: 'Neighborhood', kidFriendly: false, section: 3 },
  { id: 'p31', name: 'Burke-Gilman Brewing', blurb: "Right off the trail — the obvious stop after a bike ride. The El Camion food truck is around the corner, so you can get a burrito and a beer together. Good combo.", category: 'Drinks', price: '$$', distanceTier: 'Neighborhood', kidFriendly: false, section: 3 },

  // Section 3 — Ballard Brewing District
  { id: 'p32', name: 'Stoup Brewing', blurb: 'My usual first stop in the district — dependable across the whole lineup, with a great beer-garden vibe.', category: 'Drinks', price: '$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p33', name: 'Urban Family Brewing', blurb: 'The adventurous one — there\'s always something interesting and a little wild on tap.', category: 'Drinks', price: '$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p34', name: "Reuben's Brews", blurb: 'The trophy case of the bunch — rarely, if ever, a miss.', category: 'Drinks', price: '$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },

  // Section 3 — Standalone favorite brewery
  { id: 'p57', name: 'Holy Mountain Brewing', blurb: 'One of my favorite breweries in the city, renowned for its oak- and barrel-aged and mixed-fermentation beers. This Greenwood taproom is the all-ages location (the original Interbay spot is 21+).', category: 'Drinks', price: '$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },

  // Section 3 — Wine
  { id: 'p35', name: 'Januik Winery', blurb: 'Polished, food-friendly Washington reds; a reliable, classy pour.', category: 'Drinks', price: '$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p36', name: 'Long Shadows Winery', blurb: 'Big, serious reds from a who\'s-who of winemakers — a real standout.', category: 'Drinks', price: '$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p37', name: 'Matthews Winery', blurb: 'Consistently excellent estate reds; it just doesn\'t miss.', category: 'Drinks', price: '$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },

  // Section 3 — Cocktails
  { id: 'p38', name: 'Needle & Thread / Tavern Law', blurb: 'Among the best cocktails in the city; Needle & Thread is the hidden upstairs bar (reservations), Tavern Law below it.', category: 'Drinks', price: '$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p39', name: 'Zig Zag Café', blurb: 'A pilgrimage worth making — unpretentious, impeccable.', category: 'Drinks', price: '$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p40', name: 'Canon', blurb: "Genuinely a top-5 whisk(e)y bar in the nation. For any whisk(e)y lover it's a must-visit; wildly inventive cocktails too.", category: 'Drinks', price: '$$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },

  // Section 4 — Explore Seattle
  { id: 'p41', name: 'Pike Place Market', blurb: 'The original public market; go early to beat the crowds.', category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 4, image: '/images/pike.jpg' },
  { id: 'p42', name: 'Waterfront & Overlook Walk', blurb: 'The new park-deck linking downtown to the water.', category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 4, image: '/images/waterfront.jpg' },
  { id: 'p43', name: 'Seattle Center', blurb: 'Space Needle, Chihuly Garden & Glass, and MoPOP all in one spot.', category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 4, image: '/images/chihuly.jpg' },
  { id: 'p44', name: 'Discovery Park', blurb: "Bluffs, a lighthouse, and beach; the city's wildest big park.", category: 'Parks & Outdoors', distanceTier: 'Across town', kidFriendly: true, section: 4 },
  { id: 'p45', name: 'Bainbridge / Bremerton Ferry', blurb: 'Walk on for the cheapest and best "cruise" in town; spectacular skyline on the way back.', category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 4, image: '/images/bainbridge.jpg' },
  { id: 'p46', name: 'Seattle Underground Tour', blurb: "Explore Pioneer Square's buried storefronts; quirky, genuinely fun local history.", category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 4 },

  // Section 5 — Rainy Day
  { id: 'p47', name: 'Burke Museum & Henry Art Gallery (UW)', blurb: 'Two great museums on one campus.', category: 'Sights', distanceTier: 'Short drive', kidFriendly: true, section: 5, image: '/images/burke-museum.jpg' },
  { id: 'p48', name: 'Museum of Flight', blurb: 'World-class, hands-on — genuinely one of the best of its kind.', category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 5 },
  { id: 'p49', name: 'Pacific Science Center', blurb: 'Great with kids; easy afternoon at Seattle Center.', category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 5 },
  { id: 'p50', name: 'U Village', blurb: "Covered shopping on a rainy afternoon, minutes from the unit. Apple, Backcountry, North Face, Lululemon, Vuori, and Away are all here. Grab food at Ba Bar or Mr. West while you're at it.", category: 'Shopping', distanceTier: 'Short drive', kidFriendly: true, section: 5 },

  // Section 6 — Family & Kids
  { id: 'p51', name: 'View Ridge Playground & Splash Pad', blurb: 'Splash pad in summer, great year-round playground.', category: 'Family', distanceTier: 'Neighborhood', kidFriendly: true, section: 6, image: '/images/viewridgeplayground.jpg' },
  { id: 'p52', name: 'Bryant Playground', blurb: 'Quieter neighborhood park for families.', category: 'Family', distanceTier: 'Neighborhood', kidFriendly: true, section: 6, image: '/images/bryantplayground.jpg' },
  { id: 'p53', name: 'Woodland Park Zoo', blurb: 'A classic Seattle family outing.', category: 'Family', distanceTier: 'Short drive', kidFriendly: true, section: 6 },
  { id: 'p54', name: 'Seattle Aquarium', blurb: 'Right on the waterfront; great for kids of all ages.', category: 'Family', distanceTier: 'Across town', kidFriendly: true, section: 6, image: '/images/aquarium.jpg' },
  { id: 'p55', name: "KidsQuest Children's Museum", blurb: 'In Bellevue; great for younger kids.', category: 'Family', distanceTier: 'Across town', kidFriendly: true, section: 6 },
  { id: 'p56', name: 'U District Farmers Market', blurb: 'Saturdays; close, fun, and very Seattle.', category: 'Family', distanceTier: 'Short drive', kidFriendly: true, section: 6 },
];
