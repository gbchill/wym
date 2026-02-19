import type { CategoryId } from '../../src/types/index.js';

interface Rule {
  category: CategoryId;
  keywords: string[];
}

const rules: Rule[] = [
  {
    category: 'food',
    keywords: [
      'restaurant', 'pizza', 'burger', 'taco', 'sushi', 'cafe', 'coffee',
      'starbucks', 'mcdonald', 'chipotle', 'subway', 'doordash', 'grubhub',
      'uber eats', 'ubereats', 'instacart', 'whole foods', 'trader joe',
      'safeway', 'kroger', 'walmart grocery', 'target grocery', 'food',
      'dining', 'kitchen', 'bakery', 'deli', 'bbq', 'grill', 'sushi',
      'thai', 'chinese', 'indian', 'italian', 'mexican', 'wing', 'chicken',
      'panda express', 'in-n-out', 'chick-fil-a', 'wendy', 'taco bell',
      'jack in the box', 'dutch bros', 'panera', 'olive garden', 'chili',
      'frys', 'fry\'s', 'sprouts', 'aldi', 'costco', 'sam\'s club',
      'market', 'grocery', 'supermarket', 'liquor', 'wine', 'beer',
      'bar ', ' bar', 'pub', 'brewery', 'cheesecake factory', 'applebee',
      'ihop', 'denny', 'waffle', 'cracker barrel', 'red lobster',
      'stlr news', 'news market', 'cvs', 'walgreen', 'rite aid',
    ],
  },
  {
    category: 'transport',
    keywords: [
      'uber', 'lyft', 'waymo', 'taxi', 'gas station', 'shell', 'chevron',
      'exxon', 'mobil', 'bp gas', 'arco', 'circle k', 'speedway',
      'parking', 'toll', 'clipper', 'bart', 'muni', 'metro', 'transit',
      'amtrak', 'airline', 'delta', 'united', 'american airlines',
      'southwest', 'jetblue', 'spirit', 'frontier', 'alaska air',
      'car rental', 'enterprise', 'hertz', 'avis', 'budget rent',
      'jiffy lube', 'auto repair', 'mechanic', 'autozone', 'o\'reilly auto',
      'advance auto', 'carwash', 'car wash', 'zipcar', 'bird', 'lime',
      'scooter', 'vehicle', 'dmv', 'registration', 'insurance auto',
      'geico', 'progressive', 'state farm auto',
    ],
  },
  {
    category: 'entertainment',
    keywords: [
      'netflix', 'spotify', 'hulu', 'disney', 'amazon prime', 'hbo',
      'apple tv', 'youtube', 'twitch', 'steam', 'playstation', 'xbox',
      'nintendo', 'movie', 'cinema', 'amc theatre', 'regal', 'fandango',
      'ticketmaster', 'eventbrite', 'concert', 'museum', 'zoo', 'aquarium',
      'park', 'arcade', 'bowling', 'golf', 'gym', 'fitness', 'yoga',
      'peloton', 'planet fitness', 'anytime fitness', 'la fitness',
      'crunch gym', 'orange theory', 'crossfit', 'game', 'sport',
      'amazon.com', 'amazon mktpl', 'audible', 'kindle', 'book',
      'apple.com', 'apple com bill', 'google play', 'itunes',
    ],
  },
  {
    category: 'shopping',
    keywords: [
      'amazon', 'walmart', 'target', 'best buy', 'home depot', 'lowe\'s',
      'ikea', 'costco', 'tj maxx', 'marshalls', 'ross', 'nordstrom',
      'macy\'s', 'gap', 'old navy', 'h&m', 'zara', 'uniqlo', 'forever 21',
      'express', 'victoria\'s secret', 'bath & body', 'lush', 'sephora',
      'ulta', 'cvs pharmacy', 'walgreens pharmacy', 'rite aid pharmacy',
      'ebay', 'etsy', 'wayfair', 'overstock', 'chewy', 'petco', 'petsmart',
      'apple store', 'microsoft store', 'staples', 'office depot',
      'dollar tree', 'dollar general', 'five below', 'big lots',
      'lululemon', 'nike', 'adidas', 'under armour', 'rei', 'patagonia',
      'wal-mart',
    ],
  },
  {
    category: 'bills',
    keywords: [
      'electric', 'electricity', 'pg&e', 'sdge', 'water bill', 'gas bill',
      'internet', 'comcast', 'att ', 'at&t', 'verizon', 't-mobile', 'tmobile',
      'sprint', 'charter', 'spectrum', 'cox cable', 'dish network',
      'phone bill', 'insurance', 'allstate', 'geico', 'progressive',
      'health insurance', 'dental', 'vision', 'rent', 'mortgage',
      'loan payment', 'student loan', 'credit card payment',
      'online banking payment', 'keep the change',
      'transfer', 'subscription', 'hostinger', 'godaddy', 'namecheap',
      'aws', 'google cloud', 'digitalocean', 'github',
    ],
  },
];

export function categorize(description: string): CategoryId {
  const lower = description.toLowerCase();

  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword)) {
        return rule.category;
      }
    }
  }

  return 'other';
}
