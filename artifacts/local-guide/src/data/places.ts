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
}

export const places: Place[] = [
  // Section 2
  { id: 'p1', name: 'Safeway', blurb: 'closest full grocery run', category: 'Groceries', distanceTier: 'Neighborhood', kidFriendly: false, section: 2 },
  { id: 'p2', name: 'PCC Community Markets', blurb: 'beloved NW co-op; excellent prepared foods, local produce, good beer/wine', category: 'Groceries', distanceTier: 'Short drive', kidFriendly: false, section: 2 },
  { id: 'p3', name: 'Grateful Bread', blurb: 'neighborhood bakery; pastries and proper loaves', category: 'Coffee & Bakery', price: '$', distanceTier: 'Neighborhood', kidFriendly: true, section: 2 },
  { id: 'p4', name: 'Top Pot Doughnuts', blurb: 'a Seattle doughnut institution with great coffee', category: 'Coffee & Bakery', price: '$', distanceTier: 'Neighborhood', kidFriendly: true, section: 2 },
  { id: 'p5', name: 'Grand Central Bakery', blurb: 'rustic breads, pastries, easy breakfast', category: 'Coffee & Bakery', price: '$', distanceTier: 'Neighborhood', kidFriendly: true, section: 2 },
  { id: 'p6', name: 'Veraci Pizza', blurb: 'wood-fired, blistered thin crust', category: 'Pizza', price: '$$', distanceTier: 'Neighborhood', kidFriendly: true, section: 2 },
  { id: 'p7', name: 'Ridge Pizza', blurb: 'the reliable neighborhood slice-and-pie spot', category: 'Pizza', price: '$$', distanceTier: 'Neighborhood', kidFriendly: true, section: 2 },
  { id: 'p8', name: 'Burke-Gilman Trail', blurb: 'the legendary multi-use trail; walk or bike for miles along the lake right from the neighborhood', category: 'Parks & Outdoors', distanceTier: 'Right outside', kidFriendly: true, section: 2 },
  { id: 'p9', name: 'Matthews Beach Park', blurb: "the city's biggest Lake Washington swimming beach; prime summer water fun", category: 'Parks & Outdoors', distanceTier: 'Neighborhood', kidFriendly: true, section: 2 },
  { id: 'p10', name: 'Magnuson Park', blurb: 'sprawling lakefront park: swimming, sports fields, wetlands and art walk, and Sand Point history. A whole afternoon', category: 'Parks & Outdoors', distanceTier: 'Neighborhood', kidFriendly: true, section: 2 },
  { id: 'p11', name: 'View Ridge Playground', blurb: 'family playground with a splash pad (summer)', category: 'Parks & Outdoors', distanceTier: 'Neighborhood', kidFriendly: true, section: 2 },
  { id: 'p12', name: 'Bryant Playground', blurb: 'quieter neighborhood playground for families', category: 'Parks & Outdoors', distanceTier: 'Neighborhood', kidFriendly: true, section: 2 },
  { id: 'p13', name: 'Green Lake', blurb: "the city's favorite loop for walking, running, and paddling; magical on a sunny day — be ready, every Seattle local has the same idea, so it gets busy", category: 'Parks & Outdoors', distanceTier: 'Short drive', kidFriendly: true, section: 2 },
  { id: 'p14', name: 'UW Campus & Burke Museum', blurb: 'wander the gothic Quad (unreal cherry blossoms in late March), see natural history at the Burke and contemporary art at the Henry', category: 'Sights', distanceTier: 'Short drive', kidFriendly: true, section: 2 },

  // Section 3
  { id: 'p15', name: 'Un Bien / Paseo', blurb: 'unexpectedly transcendent Caribbean sandwiches; the Caribbean Roast is the move', category: 'Restaurants', price: '$', distanceTier: 'Short drive', kidFriendly: false, section: 3 },
  { id: 'p16', name: "Dick's Drive-In", blurb: 'classic, cheap Seattle burgers and a genuine rite of passage', category: 'Burgers', price: '$', distanceTier: 'Short drive', kidFriendly: true, section: 3 },
  { id: 'p17', name: 'Burgermaster', blurb: 'old-school drive-in burgers, eat in the car', category: 'Burgers', price: '$', distanceTier: 'Short drive', kidFriendly: true, section: 3 },
  { id: 'p18', name: 'Taurus Ox / Ox Burger', blurb: 'my favorite burger in Seattle. (Taurus Ox is the Laotian spot; Ox Burger is its burger offshoot.)', category: 'Burgers', price: '$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p19', name: 'Liberty', blurb: 'a favorite local sushi spot (and a serious cocktail bar)', category: 'Sushi', price: '$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p20', name: 'Momiji', blurb: 'favorite local sushi; lovely room and garden', category: 'Sushi', price: '$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p21', name: 'LTD Edition Sushi', blurb: 'exceptional, intimate omakase', category: 'Sushi', price: '$$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p22', name: 'Sushi Kashiba', blurb: 'exceptional; Shiro Kashiba is a Seattle legend. Splurge omakase', category: 'Sushi', price: '$$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p23', name: 'My Friend Derek', blurb: 'my favorite pizza in the city', category: 'Pizza', price: '$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p24', name: 'Canlis', blurb: "Seattle's iconic fine-dining institution: the view, the service, the occasion", category: 'Restaurants', price: '$$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p25', name: 'The Herbfarm', blurb: 'a multi-course Pacific-Northwest tasting menu out in Woodinville; block out the whole evening', category: 'Restaurants', price: '$$$$', distanceTier: 'Day trip', kidFriendly: false, section: 3 },
  { id: 'p26', name: 'Herkimer Coffee', blurb: 'excellent roaster/café', category: 'Coffee', price: '$', distanceTier: 'Across town', kidFriendly: true, section: 3 },
  { id: 'p27', name: 'Milstead & Co.', blurb: 'meticulous multi-roaster pour-overs', category: 'Coffee', price: '$', distanceTier: 'Across town', kidFriendly: true, section: 3 },
  { id: 'p28', name: 'University Village (U Village)', blurb: 'easy, upscale open-air shopping minutes from the unit', category: 'Shopping', distanceTier: 'Short drive', kidFriendly: true, section: 3 },
  { id: 'p29', name: 'Human People Beer', blurb: 'neighborhood brewery', category: 'Drinks', price: '$$', distanceTier: 'Neighborhood', kidFriendly: false, section: 3 },
  { id: 'p30', name: 'Ravenna Brewing', blurb: 'easygoing local taproom', category: 'Drinks', price: '$$', distanceTier: 'Neighborhood', kidFriendly: false, section: 3 },
  { id: 'p31', name: 'Burke-Gilman Brewing', blurb: 'right off the trail', category: 'Drinks', price: '$$', distanceTier: 'Neighborhood', kidFriendly: false, section: 3 },
  { id: 'p32', name: 'Stoup Brewing', blurb: 'a personal favorite — part of the legendary Ballard brewing district', category: 'Drinks', price: '$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p33', name: 'Urban Family Brewing', blurb: "a personal favorite — you really can't go wrong over here", category: 'Drinks', price: '$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p34', name: "Reuben's Brews", blurb: 'a personal favorite — part of a world-class cluster of breweries', category: 'Drinks', price: '$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p35', name: 'Januik', blurb: 'a personal favorite in one of the best places in the USA to taste wine', category: 'Drinks', price: '$$$', distanceTier: 'Day trip', kidFriendly: false, section: 3 },
  { id: 'p36', name: 'Long Shadows', blurb: 'a personal favorite — dozens of great wineries nearby too', category: 'Drinks', price: '$$$', distanceTier: 'Day trip', kidFriendly: false, section: 3 },
  { id: 'p37', name: 'Matthews', blurb: 'a personal favorite', category: 'Drinks', price: '$$$', distanceTier: 'Day trip', kidFriendly: false, section: 3 },
  { id: 'p38', name: 'Needle & Thread / Tavern Law', blurb: 'among the best cocktails in the city; Needle & Thread is the hidden upstairs bar (reservations), Tavern Law below it', category: 'Drinks', price: '$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p39', name: 'Zig Zag Café', blurb: 'a pilgrimage worth making', category: 'Drinks', price: '$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },
  { id: 'p40', name: 'Canon', blurb: "genuinely a top-5 whisk(e)y bar in the nation. For any whisk(e)y lover it's a must-visit; wildly inventive cocktails too", category: 'Drinks', price: '$$$$', distanceTier: 'Across town', kidFriendly: false, section: 3 },

  // Section 4
  { id: 'p41', name: 'Pike Place Market', blurb: 'the original public market; go early to beat the crowds', category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 4 },
  { id: 'p42', name: 'Waterfront & Overlook Walk', blurb: 'the new park-deck linking downtown to the water', category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 4 },
  { id: 'p43', name: 'Seattle Center', blurb: 'Space Needle, Chihuly Garden & Glass, and MoPOP all in one spot', category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 4 },
  { id: 'p44', name: 'Discovery Park', blurb: "bluffs, a lighthouse, and beach; the city's wildest big park", category: 'Parks & Outdoors', distanceTier: 'Across town', kidFriendly: true, section: 4 },
  { id: 'p45', name: 'Bainbridge / Bremerton Ferry', blurb: 'walk on for the cheapest and best "cruise" in town; spectacular skyline on the way back', category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 4 },
  { id: 'p46', name: 'Seattle Underground Tour', blurb: "explore Pioneer Square's buried storefronts; quirky, genuinely fun local history", category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 4 },

  // Section 5
  { id: 'p47', name: 'Burke Museum & Henry Art Gallery (UW)', blurb: 'two great museums on one campus', category: 'Sights', distanceTier: 'Short drive', kidFriendly: true, section: 5 },
  { id: 'p48', name: 'Museum of Flight', blurb: 'world-class, hands-on', category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 5 },
  { id: 'p49', name: 'Pacific Science Center', blurb: 'great with kids', category: 'Sights', distanceTier: 'Across town', kidFriendly: true, section: 5 },
  { id: 'p50', name: 'U Village', blurb: 'covered shopping on a rainy afternoon', category: 'Shopping', distanceTier: 'Short drive', kidFriendly: true, section: 5 },

  // Section 6
  { id: 'p51', name: 'View Ridge Playground & Splash Pad', blurb: 'splash pad in summer, great year-round playground', category: 'Family', distanceTier: 'Neighborhood', kidFriendly: true, section: 6 },
  { id: 'p52', name: 'Bryant Playground', blurb: 'quieter neighborhood park for families', category: 'Family', distanceTier: 'Neighborhood', kidFriendly: true, section: 6 },
  { id: 'p53', name: 'Woodland Park Zoo', blurb: 'a classic Seattle family outing', category: 'Family', distanceTier: 'Short drive', kidFriendly: true, section: 6 },
  { id: 'p54', name: 'Seattle Aquarium', blurb: 'right on the waterfront', category: 'Family', distanceTier: 'Across town', kidFriendly: true, section: 6 },
  { id: 'p55', name: 'KidsQuest Children\'s Museum', blurb: 'in Bellevue; great for younger kids', category: 'Family', distanceTier: 'Across town', kidFriendly: true, section: 6 },
  { id: 'p56', name: 'U District Farmers Market', blurb: 'Saturdays; close, fun, and very Seattle', category: 'Family', distanceTier: 'Short drive', kidFriendly: true, section: 6 },
];