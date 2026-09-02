export type Language = 'en' | 'ta';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  ruralMode: string;
  urbanMode: string;
  roles: {
    farmer: string;
    fpo: string;
    buyer: string;
    consumer: string;
    logistics: string;
    admin: string;
  };
  farmerTabs: {
    overview: string;
    myCrops: string;
    currentStock: string;
    buyerOpportunities: string;
    orders: string;
    alerts: string;
    suggestedPrice: string;
  };
  quickActions: {
    addCrop: string;
    addCropSub: string;
    viewDemand: string;
    viewDemandSub: string;
    suggestedPrice: string;
    suggestedPriceSub: string;
    findBuyers: string;
    findBuyersSub: string;
    delivery: string;
    deliverySub: string;
    alerts: string;
    alertsSub: string;
  };
  cropForm: {
    title: string;
    step1Title: string;
    step1Subtitle: string;
    step2Title: string;
    step2Subtitle: string;
    step3Title: string;
    step3Subtitle: string;
    step4Title: string;
    step4Subtitle: string;
    step5Title: string;
    step5Subtitle: string;
    cropLabel: string;
    quantityLabel: string;
    quantityPlaceholder: string;
    priceLabel: string;
    pricePlaceholder: string;
    harvestDateLabel: string;
    nextBtn: string;
    backBtn: string;
    saveBtn: string;
    cancelBtn: string;
  };
  demandLevels: {
    high: string;
    moderate: string;
    low: string;
  };
  priceGuidance: {
    title: string;
    disclaimer: string;
    farmerShare: string;
    handlingShare: string;
    deliveryShare: string;
    platformFee: string;
  };
  loadingMessages: {
    syncing: string;
    checkingDemand: string;
    findingBuyers: string;
    calculatingRoute: string;
    savingCrop: string;
  };
  errorMessages: {
    general: string;
    quantityInvalid: string;
    priceInvalid: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "AGRIFlow",
    appTagline: "Direct Farm Market & Crop Coordination",
    welcomeTitle: "🌾 Welcome to AGRIFlow",
    welcomeSubtitle: "Find buyers, understand demand and manage your crop sales easily.",
    ruralMode: "🌾 RURAL (50km)",
    urbanMode: "🏙️ URBAN (150km)",
    roles: {
      farmer: "Farmer / உழவர்",
      fpo: "FPO Group",
      buyer: "Buyer",
      consumer: "Consumer",
      logistics: "Delivery",
      admin: "Admin"
    },
    farmerTabs: {
      overview: "📊 Overview",
      myCrops: "🌾 My Crops",
      currentStock: "📦 Current Stock",
      buyerOpportunities: "🤝 Find Buyers",
      orders: "🚚 Orders",
      alerts: "🔔 Alerts",
      suggestedPrice: "💰 Suggested Price"
    },
    quickActions: {
      addCrop: "🌾 Add Crop",
      addCropSub: "Tell buyers what you are growing",
      viewDemand: "📊 View Demand",
      viewDemandSub: "See what buyers want to buy",
      suggestedPrice: "💰 Suggested Price",
      suggestedPriceSub: "Check current market price range",
      findBuyers: "🤝 Find Buyers",
      findBuyersSub: "Connect with verified buyers",
      delivery: "🚚 Delivery",
      deliverySub: "Track transport and pickup",
      alerts: "🔔 Alerts",
      alertsSub: "View your buyer notifications"
    },
    cropForm: {
      title: "Sell Your Crop (பயிர் விவரங்கள்)",
      step1Title: "STEP 1: What crop are you growing?",
      step1Subtitle: "Select the crop you plan to harvest",
      step2Title: "STEP 2: How much do you expect?",
      step2Subtitle: "Enter the estimated quantity in kilograms (kg)",
      step3Title: "STEP 3: When will you harvest?",
      step3Subtitle: "Pick your estimated harvest date",
      step4Title: "STEP 4: What is your expected price?",
      step4Subtitle: "Suggested guidance is advisory. You decide your minimum selling price.",
      step5Title: "STEP 5: Review and Save",
      step5Subtitle: "Check your details before publishing to buyers",
      cropLabel: "Crop / பயிர்",
      quantityLabel: "Quantity / அளவு (kg)",
      quantityPlaceholder: "e.g. 5,000 kg",
      priceLabel: "Expected Minimum Price (₹/kg) / குறைந்தபட்ச விலை",
      pricePlaceholder: "e.g. 24",
      harvestDateLabel: "Harvest Date / அறுவடை தேதி",
      nextBtn: "Continue →",
      backBtn: "← Back",
      saveBtn: "Save Crop Details ✓",
      cancelBtn: "Cancel"
    },
    demandLevels: {
      high: "🟢 High Demand",
      moderate: "🟡 Moderate Demand",
      low: "🔴 Low Demand"
    },
    priceGuidance: {
      title: "Suggested Price Range",
      disclaimer: "Suggested Price Range: Based on available market, demand and crop information. The farmer and buyer decide the final price.",
      farmerShare: "Farmer Payout",
      handlingShare: "Handling / Sorting",
      deliveryShare: "Delivery Transport",
      platformFee: "Nominal Platform Fee"
    },
    loadingMessages: {
      syncing: "Syncing your crop data...",
      checkingDemand: "Checking current buyer demand...",
      findingBuyers: "Finding suitable buyers near you...",
      calculatingRoute: "Calculating best delivery route...",
      savingCrop: "Saving your crop details..."
    },
    errorMessages: {
      general: "Something went wrong. Please try again.",
      quantityInvalid: "Please enter the quantity in kilograms.",
      priceInvalid: "Please enter a valid price in ₹ per kg."
    }
  },
  ta: {
    appName: "அக்ரிஃப்ளோ (AGRIFlow)",
    appTagline: "விவசாயிகள் மற்றும் வாங்குபவர்களுக்கான நேரடி சந்தை",
    welcomeTitle: "🌾 AGRIFlow-க்கு நல்வரவு",
    welcomeSubtitle: "வாங்குபவர்களைக் கண்டறியவும், சந்தை தேவையைப் புரிந்து கொள்ளவும், உங்கள் பயிர் விற்பனையை நிர்வகிக்கவும்.",
    ruralMode: "🌾 கிராமப்புறம் (50 கி.மீ)",
    urbanMode: "🏙️ நகர்ப்புறம் (150 கி.மீ)",
    roles: {
      farmer: "விவசாயி (Farmer)",
      fpo: "உழவர் உற்பத்தியாளர் குழு",
      buyer: "வாங்குபவர்",
      consumer: "நுகர்வோர்",
      logistics: "போக்குவரத்து",
      admin: "நிர்வாகி"
    },
    farmerTabs: {
      overview: "📊 முகப்பு",
      myCrops: "🌾 என் பயிர்கள்",
      currentStock: "📦 கையிருப்பு",
      buyerOpportunities: "🤝 வாங்குபவர்கள்",
      orders: "🚚 ஆர்டர்கள்",
      alerts: "🔔 அறிவிப்புகள்",
      suggestedPrice: "💰 விலை வழிகாட்டி"
    },
    quickActions: {
      addCrop: "🌾 பயிர் சேர்க்க",
      addCropSub: "உங்கள் பயிர் விவரங்களை உள்ளிடுக",
      viewDemand: "📊 தேவை பார்க்க",
      viewDemandSub: "வாங்குபவர்களின் தேவையை அறியவும்",
      suggestedPrice: "💰 விலை வழிகாட்டி",
      suggestedPriceSub: "பரிந்துரைக்கப்பட்ட சந்தை விலை",
      findBuyers: "🤝 வாங்குபவர்கள்",
      findBuyersSub: "நேரடி வாங்குபவர்களுடன் இணையவும்",
      delivery: "🚚 டெலிவரி",
      deliverySub: "போக்குவரத்து மற்றும் பிக்கப்",
      alerts: "🔔 அறிவிப்புகள்",
      alertsSub: "முக்கிய விழிப்பூட்டல்கள்"
    },
    cropForm: {
      title: "உங்கள் பயிரை விற்க (Sell Your Crop)",
      step1Title: "படி 1: என்ன பயிர் வளர்க்கிறீர்கள்?",
      step1Subtitle: "நீங்கள் அறுவடை செய்யவிருக்கும் பயிரைத் தேர்ந்தெடுக்கவும்",
      step2Title: "படி 2: எதிர்பார்க்கும் அளவு என்ன?",
      step2Subtitle: "எதிர்பார்க்கும் அளவை கிலோகிராமில் (kg) உள்ளிடவும்",
      step3Title: "படி 3: அறுவடை தேதி எப்போது?",
      step3Subtitle: "உங்கள் உத்தேச அறுவடை தேதியைத் தேர்ந்தெடுக்கவும்",
      step4Title: "படி 4: எதிர்பார்க்கும் விலை என்ன?",
      step4Subtitle: "பரிந்துரைக்கப்பட்ட விலை வழிகாட்டுதல் மட்டுமே. இறுதி விலையை நீங்களே தீர்மானிக்கலாம்.",
      step5Title: "படி 5: சரிபார்த்து சேமிக்கவும்",
      step5Subtitle: "விவரங்களைச் சரிபார்த்து வாங்குபவர்களுக்குப் பகிரவும்",
      cropLabel: "பயிர் (Crop)",
      quantityLabel: "அளவு (Quantity in kg)",
      quantityPlaceholder: "எ.கா. 5,000 கிலோ",
      priceLabel: "குறைந்தபட்ச விலை (₹/கிலோ)",
      pricePlaceholder: "எ.கா. 24",
      harvestDateLabel: "அறுவடை தேதி (Harvest Date)",
      nextBtn: "தொடரவும் →",
      backBtn: "← பின்னே",
      saveBtn: "பயிர் விவரங்களைச் சேமிக்கவும் ✓",
      cancelBtn: "ரத்து செய்"
    },
    demandLevels: {
      high: "🟢 அதிக தேவை (High Demand)",
      moderate: "🟡 மிதமான தேவை (Moderate Demand)",
      low: "🔴 குறைந்த தேவை (Low Demand)"
    },
    priceGuidance: {
      title: "பரிந்துரைக்கப்பட்ட விலை வரம்பு",
      disclaimer: "பரிந்துரைக்கப்பட்ட விலை வரம்பு: தற்போதைய சந்தை மற்றும் தேவை தகவல்களின் அடிப்படையில் கணக்கிடப்பட்டது. விவசாயியும் வாங்குபவரும் இறுதி விலையைத் தீர்மானிக்கின்றனர்.",
      farmerShare: "விவசாயிக்கான நேரடித் தொகை",
      handlingShare: "கையாளுதல் / தரம் பிரித்தல்",
      deliveryShare: "போக்குவரத்து செலவு",
      platformFee: "குறைந்தபட்ச தள கட்டணம்"
    },
    loadingMessages: {
      syncing: "பயிர் தகவல்கள் புதுப்பிக்கப்படுகின்றன...",
      checkingDemand: "வாங்குபவர்களின் தேவை சரிபார்க்கப்படுகிறது...",
      findingBuyers: "அருகிலுள்ள வாங்குபவர்களைக் கண்டறிகிறது...",
      calculatingRoute: "சிறந்த டெலிவரி வழித்தடம் கணக்கிடப்படுகிறது...",
      savingCrop: "உங்கள் பயிர் விவரங்கள் சேமிக்கப்படுகின்றன..."
    },
    errorMessages: {
      general: "ஏதோ தவறு நடந்துவிட்டது. மீண்டும் முயற்சிக்கவும்.",
      quantityInvalid: "தயவுசெய்து அளவைக் கிலோகிராமில் உள்ளிடவும்.",
      priceInvalid: "தயவுசெய்து சரியான விலையை உள்ளிடவும்."
    }
  }
};
