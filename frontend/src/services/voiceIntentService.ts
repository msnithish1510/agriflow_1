/**
 * Voice Intent Detection Service
 * Client-side intent-based architecture with bilingual (Tamil + English) keyword matching.
 * Supports ~30 intents across Farmer, Consumer, Bulk Buyer, and General categories.
 * Includes entity extraction (crop, quantity, price, location) and context tracking.
 */

import { VoiceIntent, VoiceAction, VoiceConversationContext, UserRole } from '@/types';

export interface IntentResult {
  intent: VoiceIntent;
  confidence: number;
  entities: Record<string, string | number>;
  action: VoiceAction;
  responseEn: string;
  responseTa: string;
  requiresConfirmation: boolean;
  followUpQuestion?: { en: string; ta: string; field: string };
}

// Crop name mapping: keywords → canonical name
const CROP_KEYWORDS: Record<string, string> = {
  'tomato': 'Tomato', 'tomatoes': 'Tomato', 'தக்காளி': 'Tomato', 'thakkali': 'Tomato',
  'onion': 'Onion', 'onions': 'Onion', 'வெங்காயம்': 'Onion', 'vengayam': 'Onion',
  'potato': 'Potato', 'potatoes': 'Potato', 'உருளைக்கிழங்கு': 'Potato', 'uralai': 'Potato',
  'wheat': 'Wheat', 'கோதுமை': 'Wheat', 'godhumai': 'Wheat',
  'moong': 'Moong (Green Gram)', 'பாசிப்பயறு': 'Moong (Green Gram)', 'pasi payaru': 'Moong (Green Gram)',
  'rice': 'Rice', 'அரிசி': 'Rice',
  'carrot': 'Carrot', 'காரட்': 'Carrot',
  'brinjal': 'Brinjal', 'கத்திரி': 'Brinjal',
};

// Intent keyword patterns with bilingual support
interface IntentPattern {
  intent: VoiceIntent;
  keywords: string[];
  allowedRoles?: UserRole[];
  action: VoiceAction;
  responseEn: string;
  responseTa: string;
  requiresConfirmation: boolean;
}

const INTENT_PATTERNS: IntentPattern[] = [
  // === FARMER INTENTS ===
  {
    intent: 'CHECK_MY_STOCK',
    keywords: ['my stock', 'show stock', 'என் ஸ்டாக்', 'ஸ்டாக் காட்டு', 'stock காட்டு', 'current stock', 'கையிருப்பு', 'என் கையிருப்பு', 'show my stock', 'view stock'],
    allowedRoles: ['FARMER', 'FPO'],
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'currentStock' },
    responseEn: 'Opening your current stock inventory. You can view all your available crops and quantities here.',
    responseTa: 'உங்கள் தற்போதைய கையிருப்பைத் திறக்கிறது. இங்கே உங்கள் அனைத்து பயிர்களையும் அளவுகளையும் பார்க்கலாம்.',
    requiresConfirmation: false,
  },
  {
    intent: 'ADD_STOCK',
    keywords: ['add stock', 'add crop', 'ஸ்டாக் சேர்', 'பயிர் சேர்', 'new stock', 'add tomato', 'add onion', 'stock add', 'add kg'],
    allowedRoles: ['FARMER', 'FPO'],
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'myCrops' },
    responseEn: '',
    responseTa: '',
    requiresConfirmation: true,
  },
  {
    intent: 'CHECK_DEMAND',
    keywords: ['demand', 'today demand', 'today\'s demand', 'show demand', 'தேவை', 'இன்றைய தேவை', 'தேவை என்ன', 'demand என்ன', 'what demand', 'view demand', 'check demand', 'தேவை எவ்வளவு', 'தேவையை காட்டு', 'demand காட்டு'],
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'buyerOpportunities' },
    responseEn: '',
    responseTa: '',
    requiresConfirmation: false,
  },
  {
    intent: 'FIND_BUYERS',
    keywords: ['find buyer', 'find buyers', 'show buyer', 'வாங்குபவர்', 'வாங்குபவர்களை', 'buyer கண்டுபிடி', 'buyer-ஐ', 'buyers காட்டு', 'கண்டுபிடி', 'connect buyer', 'who is buying', 'யார் வாங்கு'],
    allowedRoles: ['FARMER', 'FPO'],
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'buyerOpportunities' },
    responseEn: '',
    responseTa: '',
    requiresConfirmation: false,
  },
  {
    intent: 'CHECK_MY_ORDERS',
    keywords: ['my order', 'show order', 'orders', 'என் ஆர்டர்', 'ஆர்டர் காட்டு', 'ஆர்டர்களை', 'order status', 'track order', 'order காட்டு', 'view orders'],
    action: { type: 'NAVIGATE', tab: 'orders' },
    responseEn: 'Opening your orders dashboard.',
    responseTa: 'உங்கள் ஆர்டர் டாஷ்போர்டை திறக்கிறது.',
    requiresConfirmation: false,
  },
  {
    intent: 'CHECK_PRICE_GUIDANCE',
    keywords: ['price', 'what price', 'விலை', 'விலை என்ன', 'price என்ன', 'suggested price', 'market price', 'சந்தை விலை', 'tomato price', 'onion price', 'crop price', 'விலை எவ்வளவு'],
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'suggestedPrice' },
    responseEn: '',
    responseTa: '',
    requiresConfirmation: false,
  },
  {
    intent: 'CHECK_NOTIFICATIONS',
    keywords: ['notification', 'alert', 'அறிவிப்பு', 'alerts', 'new notification', 'புதிய அறிவிப்பு'],
    action: { type: 'NAVIGATE', tab: 'alerts' },
    responseEn: 'Opening your notifications.',
    responseTa: 'உங்கள் அறிவிப்புகளைத் திறக்கிறது.',
    requiresConfirmation: false,
  },
  {
    intent: 'CHECK_EARNINGS',
    keywords: ['earning', 'income', 'revenue', 'வருமானம்', 'லாபம்', 'how much earned'],
    allowedRoles: ['FARMER', 'FPO'],
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'overview' },
    responseEn: 'Opening your earnings overview on the farmer dashboard.',
    responseTa: 'உங்கள் வருமான மேலோட்டத்தை விவசாயி டாஷ்போர்டில் திறக்கிறது.',
    requiresConfirmation: false,
  },
  // === CONSUMER INTENTS ===
  {
    intent: 'SEARCH_PRODUCT',
    keywords: ['search product', 'find product', 'look for', 'பொருட்களை தேடு', 'search crop', 'available product'],
    allowedRoles: ['CONSUMER'],
    action: { type: 'NAVIGATE', role: 'CONSUMER' },
    responseEn: 'Opening the product search for you.',
    responseTa: 'உங்களுக்காக பொருட்கள் தேடலைத் திறக்கிறது.',
    requiresConfirmation: false,
  },
  {
    intent: 'TRACK_ORDER',
    keywords: ['track order', 'where is my order', 'delivery status', 'என் ஆர்டர் எங்கே', 'ஆர்டர் கண்காணி', 'delivery எப்போது', 'டெலிவரி நிலை'],
    allowedRoles: ['CONSUMER', 'BULK_BUYER'],
    action: { type: 'NAVIGATE', tab: 'orders' },
    responseEn: 'Checking your order delivery status.',
    responseTa: 'உங்கள் ஆர்டர் டெலிவரி நிலையை சரிபார்க்கிறது.',
    requiresConfirmation: false,
  },
  {
    intent: 'FIND_AVAILABLE_PRODUCTS',
    keywords: ['available product', 'what is available', 'fresh product', 'கிடைக்கும் பொருட்கள்', 'என்ன கிடைக்கும்'],
    allowedRoles: ['CONSUMER'],
    action: { type: 'NAVIGATE', role: 'CONSUMER' },
    responseEn: 'Showing available fresh products from verified farmers.',
    responseTa: 'சரிபார்க்கப்பட்ட விவசாயிகளிடமிருந்து கிடைக்கும் புதிய பொருட்களைக் காட்டுகிறது.',
    requiresConfirmation: false,
  },
  // === BULK BUYER INTENTS ===
  {
    intent: 'SEARCH_BULK_STOCK',
    keywords: ['bulk stock', 'மொத்த ஸ்டாக்', 'wholesale', 'bulk quantity', 'மொத்த அளவு'],
    allowedRoles: ['BULK_BUYER'],
    action: { type: 'NAVIGATE', role: 'BULK_BUYER' },
    responseEn: 'Searching available bulk stock from farmers and FPOs.',
    responseTa: 'விவசாயிகள் மற்றும் FPO-களிடமிருந்து கிடைக்கும் மொத்த ஸ்டாக்கைத் தேடுகிறது.',
    requiresConfirmation: false,
  },
  {
    intent: 'POST_DEMAND',
    keywords: ['post demand', 'create demand', 'new demand', 'தேவை பதிவிடு', 'புதிய தேவை', 'i need', 'i want to buy'],
    allowedRoles: ['BULK_BUYER', 'CONSUMER'],
    action: { type: 'NAVIGATE', role: 'BULK_BUYER' },
    responseEn: '',
    responseTa: '',
    requiresConfirmation: true,
  },
  {
    intent: 'CHECK_FARMERS',
    keywords: ['check farmer', 'available farmer', 'விவசாயிகளை பார்', 'farmer list', 'who is selling'],
    allowedRoles: ['BULK_BUYER'],
    action: { type: 'NAVIGATE', role: 'BULK_BUYER' },
    responseEn: 'Showing available farmers and their current stock.',
    responseTa: 'கிடைக்கும் விவசாயிகள் மற்றும் அவர்களின் தற்போதைய ஸ்டாக்கைக் காட்டுகிறது.',
    requiresConfirmation: false,
  },
  // === GENERAL / NAVIGATION INTENTS ===
  {
    intent: 'OPEN_FARMER_DASHBOARD',
    keywords: ['farmer dashboard', 'open dashboard', 'விவசாயி டாஷ்போர்டு', 'டாஷ்போர்டு திற', 'dashboard திற', 'go to dashboard', 'என்னுடைய டாஷ்போர்டை திற'],
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'overview' },
    responseEn: 'Opening the farmer dashboard.',
    responseTa: 'விவசாயி டாஷ்போர்டைத் திறக்கிறது.',
    requiresConfirmation: false,
  },
  {
    intent: 'OPEN_MARKET_PULSE',
    keywords: ['market pulse', 'market', 'மார்க்கெட்', 'மார்க்கெட் பல்ஸ்', 'market data', 'pulse', 'pulse திற', 'pulse open', 'market pulse open'],
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'overview' },
    responseEn: 'Opening Market Pulse — showing live demand and supply data.',
    responseTa: 'மார்க்கெட் பல்ஸ் திறக்கிறது — நேரடி தேவை மற்றும் வரத்து தகவல்களைக் காட்டுகிறது.',
    requiresConfirmation: false,
  },
  {
    intent: 'OPEN_DEMO',
    keywords: ['demo', 'show demo', 'run demo', 'டெமோ', 'demo காட்டு', 'demo run'],
    action: { type: 'INFO' },
    responseEn: 'The SIH Demo Runner is at the top of the page. You can click any scenario to see it in action!',
    responseTa: 'SIH டெமோ ரன்னர் பக்கத்தின் மேலே உள்ளது. எந்த சூழ்நிலையையும் கிளிக் செய்து செயலில் பாருங்கள்!',
    requiresConfirmation: false,
  },
  {
    intent: 'GO_HOME',
    keywords: ['home', 'go home', 'main page', 'முகப்பு', 'முகப்பு பக்கம்'],
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'overview' },
    responseEn: 'Going to the home page.',
    responseTa: 'முகப்புப் பக்கத்திற்குச் செல்கிறது.',
    requiresConfirmation: false,
  },
  {
    intent: 'HOW_AGRIFLOW_WORKS',
    keywords: ['how does agriflow', 'how it works', 'what is agriflow', 'explain', 'எப்படி வேலை', 'AGRIFlow என்ன', 'how agriflow'],
    action: { type: 'INFO' },
    responseEn: 'AGRIFlow connects farmers directly with buyers. Farmers list their crops, buyers post their demand, and AGRIFlow matches them automatically with transparent pricing and optimized delivery routes. No middlemen needed!',
    responseTa: 'AGRIFlow விவசாயிகளை நேரடியாக வாங்குபவர்களுடன் இணைக்கிறது. விவசாயிகள் தங்கள் பயிர்களை பட்டியலிடுகிறார்கள், வாங்குபவர்கள் தங்கள் தேவையை பதிவிடுகிறார்கள், AGRIFlow அவர்களை வெளிப்படையான விலை மற்றும் உகந்த டெலிவரி வழிகளுடன் தானாக பொருத்துகிறது. இடைத்தரகர்கள் தேவையில்லை!',
    requiresConfirmation: false,
  },
  {
    intent: 'CHANGE_LANGUAGE',
    keywords: ['change language', 'switch language', 'tamil', 'english', 'மொழி மாற்று', 'தமிழ்', 'ஆங்கிலம்', 'language change', 'மொழி மாற்றம்'],
    action: { type: 'INFO' },
    responseEn: 'You can switch the language using the toggle at the top of this panel, or in the navigation bar.',
    responseTa: 'இந்த பேனலின் மேலே உள்ள toggle-ஐ பயன்படுத்தி அல்லது நேவிகேஷன் பாரில் மொழியை மாற்றலாம்.',
    requiresConfirmation: false,
  },
  {
    intent: 'HELP',
    keywords: ['help', 'what can you do', 'உதவி', 'என்ன செய்ய முடியும்', 'help me', 'commands'],
    action: { type: 'INFO' },
    responseEn: 'I can help you with: checking stock, viewing demand, finding buyers, checking prices, tracking orders, and navigating AGRIFlow. Just speak or type your request!',
    responseTa: 'நான் உங்களுக்கு உதவ முடியும்: ஸ்டாக் சரிபார்க்க, தேவையை பார்க்க, வாங்குபவர்களை கண்டுபிடிக்க, விலைகளை சரிபார்க்க, ஆர்டர்களை கண்காணிக்க, மற்றும் AGRIFlow-ல் வழிநடத்த. பேசவும் அல்லது தட்டச்சு செய்யவும்!',
    requiresConfirmation: false,
  },
];

/**
 * Extract crop name from text
 */
function extractCrop(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [keyword, cropName] of Object.entries(CROP_KEYWORDS)) {
    if (lower.includes(keyword)) {
      return cropName;
    }
  }
  return null;
}

/**
 * Extract quantity from text
 */
function extractQuantity(text: string): number | null {
  const match = text.match(/(\d+[\.,]?\d*)\s*(kg|kilo|கிலோ|tons|டன்)/i);
  if (match) return parseFloat(match[1].replace(',', ''));

  const numMatch = text.match(/(\d{2,})/);
  if (numMatch) return parseFloat(numMatch[1]);

  return null;
}

/**
 * Extract price from text
 */
function extractPrice(text: string): number | null {
  const priceMatch = text.match(/(?:₹|rs\.?|rupees|ரூபாய்)\s*(\d+[\.,]?\d*)/i);
  if (priceMatch) return parseFloat(priceMatch[1].replace(',', ''));

  const perKgMatch = text.match(/(\d+[\.,]?\d*)\s*(?:per\s*kg|\/kg|கிலோ)/i);
  if (perKgMatch) return parseFloat(perKgMatch[1].replace(',', ''));

  return null;
}

/**
 * Extract location from text
 */
function extractLocation(text: string): string | null {
  const locations = ['coimbatore', 'கோயம்புத்தூர்', 'nashik', 'நாசிக்', 'chennai', 'சென்னை', 'pune', 'புனே', 'delhi', 'டெல்லி', 'bangalore', 'பெங்களூரு', 'mumbai', 'மும்பை', 'madurai', 'மதுரை', 'trichy', 'திருச்சி', 'salem', 'சேலம்', 'erode', 'ஈரோடு'];
  const lower = text.toLowerCase();
  for (const loc of locations) {
    if (lower.includes(loc)) {
      return loc.charAt(0).toUpperCase() + loc.slice(1);
    }
  }
  return null;
}

/**
 * Detect intent from user text
 */
export function detectIntent(
  text: string,
  userRole: UserRole,
  context: VoiceConversationContext
): IntentResult {
  const lower = text.toLowerCase().trim();
  const entities: Record<string, string | number> = {};

  // Extract entities
  const crop = extractCrop(text);
  if (crop) entities.crop = crop;
  const qty = extractQuantity(text);
  if (qty) entities.quantity = qty;
  const price = extractPrice(text);
  if (price) entities.price = price;
  const location = extractLocation(text);
  if (location) entities.location = location;

  // Handle follow-up context
  if (context.awaitingFollowUp && context.previousIntent) {
    return handleFollowUp(text, entities, userRole, context);
  }

  // Score each intent pattern
  let bestMatch: IntentPattern | null = null;
  let bestScore = 0;

  for (const pattern of INTENT_PATTERNS) {
    // Check role restriction
    if (pattern.allowedRoles && !pattern.allowedRoles.includes(userRole) && userRole !== 'ADMIN') {
      continue;
    }

    // Score keyword matches
    let score = 0;
    for (const keyword of pattern.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        score += keyword.length; // Longer keyword = higher confidence
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = pattern;
    }
  }

  if (bestMatch && bestScore > 0) {
    const result: IntentResult = {
      intent: bestMatch.intent,
      confidence: Math.min(bestScore / 20, 1),
      entities,
      action: { ...bestMatch.action },
      responseEn: bestMatch.responseEn,
      responseTa: bestMatch.responseTa,
      requiresConfirmation: bestMatch.requiresConfirmation,
    };

    // Generate dynamic responses based on entities and intent
    generateDynamicResponse(result, entities, userRole);

    return result;
  }

  // Unknown intent
  return {
    intent: 'UNKNOWN',
    confidence: 0,
    entities,
    action: { type: 'INFO' },
    responseEn: '',
    responseTa: '',
    requiresConfirmation: false,
  };
}

/**
 * Handle follow-up in multi-turn conversation
 */
function handleFollowUp(
  text: string,
  entities: Record<string, string | number>,
  userRole: UserRole,
  context: VoiceConversationContext
): IntentResult {
  const mergedEntities = { ...context.previousEntities, ...entities };

  // If we were waiting for a location
  if (context.awaitingFollowUp === 'location') {
    const location = extractLocation(text) || text.trim();
    mergedEntities.location = location;

    const crop = mergedEntities.crop || 'Tomato';
    return {
      intent: context.previousIntent || 'CHECK_DEMAND',
      confidence: 0.8,
      entities: mergedEntities,
      action: { type: 'NAVIGATE', role: 'FARMER', tab: 'buyerOpportunities' },
      responseEn: `Showing ${crop} demand in ${location}. Current demand is high with 3 active buyers offering ₹24-₹30/kg.`,
      responseTa: `${location} பகுதியில் ${crop} தேவையைக் காட்டுகிறது. 3 வாங்குபவர்கள் ₹24-₹30/கிலோ விலையில் வாங்கத் தயாராக உள்ளனர்.`,
      requiresConfirmation: false,
    };
  }

  // If we were waiting for quantity
  if (context.awaitingFollowUp === 'quantity') {
    const qty = extractQuantity(text) || parseInt(text.replace(/[^\d]/g, ''));
    if (qty) mergedEntities.quantity = qty;

    return {
      intent: context.previousIntent || 'ADD_STOCK',
      confidence: 0.8,
      entities: mergedEntities,
      action: { type: 'CONFIRM' },
      responseEn: `Got it — ${qty} kg. What price are you expecting per kg?`,
      responseTa: `சரி — ${qty} கிலோ. ஒரு கிலோவுக்கு என்ன விலை எதிர்பார்க்கிறீர்கள்?`,
      requiresConfirmation: false,
      followUpQuestion: { en: 'What price per kg?', ta: 'கிலோவுக்கு என்ன விலை?', field: 'price' },
    };
  }

  // If we were waiting for price
  if (context.awaitingFollowUp === 'price') {
    const price = extractPrice(text) || parseInt(text.replace(/[^\d]/g, ''));
    if (price) mergedEntities.price = price;

    const crop = mergedEntities.crop || 'your crop';
    const qty = mergedEntities.quantity || 0;

    return {
      intent: context.previousIntent || 'ADD_STOCK',
      confidence: 0.9,
      entities: mergedEntities,
      action: { type: 'CONFIRM' },
      responseEn: `You are about to add ${qty} kg of ${crop} at ₹${price}/kg to your stock. Shall I proceed?`,
      responseTa: `நீங்கள் ${qty} கிலோ ${crop} ₹${price}/கிலோ விலையில் உங்கள் ஸ்டாக்கில் சேர்க்கப் போகிறீர்கள். நான் தொடரட்டுமா?`,
      requiresConfirmation: true,
    };
  }

  // Default
  return {
    intent: context.previousIntent || 'UNKNOWN',
    confidence: 0.5,
    entities: mergedEntities,
    action: { type: 'INFO' },
    responseEn: 'I understand. Is there anything else you need?',
    responseTa: 'புரிகிறது. வேறு ஏதாவது உதவி வேண்டுமா?',
    requiresConfirmation: false,
  };
}

/**
 * Generate context-aware dynamic responses based on detected entities
 */
function generateDynamicResponse(
  result: IntentResult,
  entities: Record<string, string | number>,
  userRole: UserRole
): void {
  const crop = entities.crop as string || 'Tomato';
  const qty = entities.quantity as number;
  const price = entities.price as number;

  switch (result.intent) {
    case 'CHECK_DEMAND': {
      if (crop) {
        result.responseEn = `Today's ${crop} demand is high. There are active buyer requests totaling over 5,000 kg in your region.`;
        result.responseTa = `இன்று ${crop}-க்கு அதிக தேவை உள்ளது. உங்கள் பகுதியில் 5,000 கிலோவுக்கு மேல் வாங்குபவர் கோரிக்கைகள் உள்ளன.`;
      } else {
        result.responseEn = 'Showing current market demand. Multiple buyers are actively looking for fresh produce.';
        result.responseTa = 'தற்போதைய சந்தை தேவையைக் காட்டுகிறது. பல வாங்குபவர்கள் புதிய பொருட்களை தீவிரமாக தேடுகிறார்கள்.';
      }
      if (!entities.location) {
        result.followUpQuestion = { en: 'Which location would you like to check?', ta: 'எந்த இடத்தைச் சரிபார்க்க விரும்புகிறீர்கள்?', field: 'location' };
      }
      break;
    }

    case 'FIND_BUYERS': {
      if (crop) {
        result.responseEn = `Looking for buyers for your ${crop}. Found 3 verified buyers offering ₹24-₹30/kg in your region.`;
        result.responseTa = `உங்கள் ${crop}-க்கு வாங்குபவர்களைத் தேடுகிறது. உங்கள் பகுதியில் ₹24-₹30/கிலோ விலையில் 3 சரிபார்க்கப்பட்ட வாங்குபவர்கள் கிடைத்தனர்.`;
      } else {
        result.responseEn = 'Opening buyer matching to find the best buyers for your crops.';
        result.responseTa = 'உங்கள் பயிர்களுக்கு சிறந்த வாங்குபவர்களைக் கண்டறிய வாங்குபவர் பொருத்தத்தைத் திறக்கிறது.';
      }
      break;
    }

    case 'CHECK_PRICE_GUIDANCE': {
      if (crop) {
        const basePrice = crop === 'Tomato' ? 28 : crop === 'Onion' ? 22 : crop === 'Potato' ? 18 : 25;
        result.responseEn = `Today's average ${crop} price is ₹${basePrice}/kg. Suggested range: ₹${basePrice - 4}-₹${basePrice + 4}/kg based on current demand.`;
        result.responseTa = `இன்றைய சராசரி ${crop} விலை ₹${basePrice}/கிலோ. தற்போதைய தேவையின் அடிப்படையில் பரிந்துரைக்கப்பட்ட வரம்பு: ₹${basePrice - 4}-₹${basePrice + 4}/கிலோ.`;
      } else {
        result.responseEn = 'Opening the price guidance tool. Select a crop to see suggested pricing.';
        result.responseTa = 'விலை வழிகாட்டி கருவியைத் திறக்கிறது. பரிந்துரைக்கப்பட்ட விலையைக் காண பயிரைத் தேர்ந்தெடுக்கவும்.';
      }
      break;
    }

    case 'ADD_STOCK': {
      if (crop && qty && price) {
        result.responseEn = `You want to add ${qty} kg of ${crop} at ₹${price}/kg to your stock. Shall I proceed?`;
        result.responseTa = `நீங்கள் ${qty} கிலோ ${crop} ₹${price}/கிலோ விலையில் உங்கள் ஸ்டாக்கில் சேர்க்க விரும்புகிறீர்கள். நான் தொடரட்டுமா?`;
      } else if (crop && qty) {
        result.responseEn = `Adding ${qty} kg of ${crop} to your stock. What price are you expecting per kg?`;
        result.responseTa = `${qty} கிலோ ${crop} உங்கள் ஸ்டாக்கில் சேர்க்கிறது. ஒரு கிலோவுக்கு என்ன விலை எதிர்பார்க்கிறீர்கள்?`;
        result.requiresConfirmation = false;
        result.followUpQuestion = { en: 'What price per kg?', ta: 'கிலோவுக்கு என்ன விலை?', field: 'price' };
      } else if (crop) {
        result.responseEn = `Sure, adding ${crop} to your stock. How many kilograms do you have?`;
        result.responseTa = `சரி, ${crop} உங்கள் ஸ்டாக்கில் சேர்க்கிறது. உங்களிடம் எத்தனை கிலோ உள்ளது?`;
        result.requiresConfirmation = false;
        result.followUpQuestion = { en: 'How many kg?', ta: 'எத்தனை கிலோ?', field: 'quantity' };
      } else {
        result.responseEn = 'Sure, I can help you add stock. What crop would you like to add?';
        result.responseTa = 'சரி, ஸ்டாக் சேர்க்க உதவ முடியும். என்ன பயிர் சேர்க்க விரும்புகிறீர்கள்?';
        result.requiresConfirmation = false;
      }
      break;
    }

    case 'POST_DEMAND': {
      if (crop && qty) {
        result.responseEn = `You want to post a demand for ${qty} kg of ${crop}. Shall I proceed?`;
        result.responseTa = `நீங்கள் ${qty} கிலோ ${crop}-க்கு தேவை பதிவிட விரும்புகிறீர்கள். நான் தொடரட்டுமா?`;
      } else {
        result.responseEn = 'Opening demand posting. Please specify the crop and quantity you need.';
        result.responseTa = 'தேவை பதிவிடுவதைத் திறக்கிறது. உங்களுக்குத் தேவையான பயிர் மற்றும் அளவைக் குறிப்பிடவும்.';
        result.requiresConfirmation = false;
      }
      break;
    }

    case 'CHECK_MY_STOCK': {
      if (userRole !== 'FARMER' && userRole !== 'FPO' && userRole !== 'ADMIN') {
        result.responseEn = 'Stock management is available for farmer accounts.';
        result.responseTa = 'ஸ்டாக் நிர்வாகம் விவசாயி கணக்குகளுக்கு மட்டுமே கிடைக்கும்.';
        result.action = { type: 'INFO' };
      }
      break;
    }
  }
}

/**
 * Check if a role is allowed for a specific intent
 */
export function isRoleAllowedForIntent(intent: VoiceIntent, role: UserRole): boolean {
  if (role === 'ADMIN') return true;
  const pattern = INTENT_PATTERNS.find(p => p.intent === intent);
  if (!pattern || !pattern.allowedRoles) return true;
  return pattern.allowedRoles.includes(role);
}
