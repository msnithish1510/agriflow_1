export const en = {
  common: {
    appName: "AGRIFlow",
    tagline: "Connecting Demand Before Harvest",
    taglineSub: "Direct Farmer-to-Buyer Coordination & Price Transparency",
    ruralScope: "Rural Model (50km)",
    urbanScope: "Urban Model (150km)",
    changeRole: "Switch Persona",
    currentView: "Current View",
    kg: "kg",
    perKg: "₹/kg",
    inr: "₹",
    km: "km",
    days: "days",
    loading: "Loading information...",
    success: "Success",
    error: "An error occurred. Please try again.",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
    continue: "Continue",
    close: "Close",
    viewDetails: "View Details",
    status: {
      pending: "Pending",
      matched: "Matched",
      confirmed: "Confirmed",
      inTransit: "In Transit",
      delivered: "Delivered",
      completed: "Completed",
      cancelled: "Cancelled",
      open: "Open",
      highDemand: "High Demand",
      moderateDemand: "Moderate Demand",
      lowDemand: "Low Demand"
    },
    roles: {
      FARMER: "Farmer",
      FPO: "FPO Group",
      BULK_BUYER: "Bulk Buyer",
      CONSUMER: "Consumer",
      LOGISTICS_PARTNER: "Logistics Partner",
      ADMIN: "Administrator"
    },
    roleDescriptions: {
      FARMER: "Declare harvest, get direct buyer matches & guaranteed fair payouts",
      FPO: "Pool member crop yields to fulfill institutional buyer contracts",
      BULK_BUYER: "Post crop requirements in advance with scheduled delivery",
      CONSUMER: "Purchase fresh produce directly with transparent price breakdown",
      LOGISTICS_PARTNER: "Accept multi-farm pickup jobs with route optimization",
      ADMIN: "Monitor platform metrics, demand-supply health & transactions"
    },
    badges: {
      actual: "ACTUAL",
      estimated: "ESTIMATED",
      guaranteed: "100% Direct Payout",
      transparent: "Transparent Audit",
      aiPowered: "AI Powered"
    },
    emptyState: {
      noData: "No data available at this time.",
      noDemands: "No active buyer demands found for your location.",
      noSupplies: "No harvest declarations posted yet.",
      noOrders: "No active orders currently placed.",
      noNotifications: "You're all caught up! No new notifications."
    }
  },

  nav: {
    home: "Home",
    howItWorks: "How It Works",
    marketPulse: "Market Pulse",
    priceTransparency: "Price Transparency",
    interactiveDemo: "Interactive Demo",
    farmerPortal: "Farmer Portal",
    dashboards: "Dashboards",
    activeScope: "Scope",
    language: "Language",
    loginDemo: "Demo Profile"
  },

  home: {
    heroBadge: "Smart India Hackathon 2026 • SIH26033 Solution",
    heroTitle: "Connect Demand Before Harvest.",
    heroHighlight: "Reduce Waste. Improve Farmer Earnings.",
    heroSubtitle: "AGRIFlow is the demand-driven agricultural platform connecting smallholder farmers directly with bulk buyers, institutions, and consumers before harvesting begins.",
    getStartedBtn: "Enter Farmer Portal",
    exploreDemoBtn: "Try Interactive Demo",
    marketPulseBtn: "Explore Market Pulse",
    howItWorksBtn: "How AGRIFlow Works",

    keyMetrics: {
      farmerShare: "93.8%",
      farmerShareLabel: "Direct Farmer Payout (Rural)",
      zeroMiddlemen: "0%",
      zeroMiddlemenLabel: "Unnecessary Middleman Fees",
      priceStack: "100%",
      priceStackLabel: "Price Stack Transparency (Urban)",
      spoilageCut: "40%",
      spoilageCutLabel: "Reduction in Post-Harvest Loss"
    },

    modelsSection: {
      tag: "Dual-Engine Architecture",
      title: "How AGRIFlow Works for Rural & Urban Markets",
      subtitle: "Tailored supply-chain coordination designed for the real needs of local villages and modern urban distribution.",
      
      ruralTitle: "Rural Direct Model (Within 50 km)",
      ruralSubtitle: "Zero unnecessary middlemen. Connecting smallholder farmers directly with local institutional buyers & village consumers.",
      ruralStep1: "Pre-Harvest Demand",
      ruralStep1Desc: "Buyers post requirements before planting or harvest.",
      ruralStep2: "Farmer Planning",
      ruralStep2Desc: "Farmers declare expected harvest date & minimum fair price.",
      ruralStep3: "Direct Coordinated Sale",
      ruralStep3Desc: "Yields pooled locally and dispatched directly to buyers.",
      ruralBenefit: "Guarantees 90-95% direct realization payout to the farmer.",

      urbanTitle: "Urban Transparent Supply Chain (Up to 150 km)",
      urbanSubtitle: "Transparent price stack auditing. Intermediaries provide necessary cold logistics, with every rupee clearly audited.",
      urbanStep1: "Farmer Payout",
      urbanStep1Desc: "Fair minimum price guaranteed directly to farmer.",
      urbanStep2: "Collection & Grading",
      urbanStep2Desc: "Standardized sorting, washing, and quality grading.",
      urbanStep3: "Refrigerated Transport",
      urbanStep3Desc: "Temperature-controlled freight preserving shelf life.",
      urbanStep4: "Retail & Consumer",
      urbanStep4Desc: "Transparent shelf price with complete price stack breakdown.",
      urbanBenefit: "Consumers see exact margin breakdown: Farmer + Handling + Freight + Margin."
    },

    howItWorksSection: {
      tag: "Streamlined Workflow",
      title: "From Demand Posting to Delivery in 4 Simple Steps",
      subtitle: "Eliminating market uncertainty before crops are harvested.",
      step1Title: "1. Post Demand & Declare Crop",
      step1Desc: "Bulk buyers and consumers specify quantity, target delivery date, and quality requirements. Farmers declare expected harvest with advisory guidance.",
      step2Title: "2. AI Matching & Yield Pooling",
      step2Desc: "Our algorithm matches buyer requirements with nearby smallholders, automatically pooling 3-5 farmers' yields to fulfill large bulk orders.",
      step3Title: "3. Transparent Price Agreement",
      step3Desc: "Farmers receive direct payout guarantees with zero hidden cuts. Urban orders display an audited itemized cost breakdown with ESTIMATED vs ACTUAL tags.",
      step4Title: "4. Optimized Fleet Pickup & Delivery",
      step4Desc: "Google OR-Tools VRPTW engine sequences multi-farm pickups into one fuel-efficient trip, reducing logistics cost and spoilage."
    },

    comparisonSection: {
      tag: "The Traditional Gap",
      title: "Traditional Mandi System vs. AGRIFlow Pre-Market Model",
      subtitle: "Why distress sales happen today and how AGRIFlow fixes agricultural supply chains.",
      headers: {
        factor: "Supply Chain Factor",
        traditional: "Traditional Mandi System",
        agriflow: "AGRIFlow Pre-Market Platform"
      },
      rows: [
        {
          factor: "Market Timing",
          traditional: "Post-harvest distress: produce rushed to mandi with no guaranteed buyer.",
          agriflow: "Pre-harvest coordination: buyers and prices locked in before harvest begins."
        },
        {
          factor: "Farmer Payout",
          traditional: "Farmer receives only 25% - 40% of final consumer price after multiple cuts.",
          agriflow: "Farmer receives 85% - 94% direct payout with zero hidden commissions."
        },
        {
          factor: "Price Transparency",
          traditional: "Opaque auction cartels and unaccounted deductions.",
          agriflow: "Itemized audit stack with clear ESTIMATED vs. ACTUAL component tags."
        },
        {
          factor: "Smallholder Inclusion",
          traditional: "Small farmers with 500kg cannot access bulk corporate buyers.",
          agriflow: "Smart yield pooling groups multiple farmers to fulfill institutional orders."
        },
        {
          factor: "Logistics Coordination",
          traditional: "Each farmer pays high individual freight charges for unorganized transport.",
          agriflow: "Optimized route sequencing with shared multi-farm pickup fleets."
        }
      ]
    },

    aiSection: {
      tag: "Technology Stack",
      title: "Intelligent Features Built for Rural Reliability",
      subtitle: "Advanced machine learning and optimization simplified for intuitive farmer usage.",
      feature1Title: "AI Demand Forecasting",
      feature1Desc: "15-day district demand forecasts using XGBoost regression, giving farmers visibility into upcoming crop requirements.",
      feature2Title: "Multi-Farmer Yield Pooling",
      feature2Desc: "Constraint-aware aggregation that matches bulk buyer orders with multiple smallholder harvest declarations.",
      feature3Title: "VRPTW Route Optimization",
      feature3Desc: "Google OR-Tools solver computing multi-farm pickup waypoints, vehicle capacity, time windows, and transit duration.",
      feature4Title: "Bilingual Voice Assistant",
      feature4Desc: "Voice entity extraction in English and Tamil, allowing farmers to declare stock or query market prices simply by speaking."
    },

    benefitsSection: {
      tag: "Stakeholder Impact",
      title: "Designed for Every Participant in the Agricultural Chain",
      subtitle: "Fairness, transparency, and operational efficiency for everyone.",
      farmersTitle: "For Farmers & FPOs",
      farmersPoints: [
        "Guaranteed buyers before harvest begins",
        "Advisory price guidance with full pricing autonomy",
        "Higher net earnings without middleman exploitation",
        "Simple 5-step wizard and voice-enabled entry"
      ],
      buyersTitle: "For Bulk Buyers & Retailers",
      buyersPoints: [
        "Reliable contracted volume sourced directly from verified farms",
        "Full traceability from farm gate to distribution center",
        "Quality grade enforcement and predictable scheduling",
        "Reduced procurement overhead via automated pooling"
      ],
      consumersTitle: "For Family Consumers",
      consumersPoints: [
        "Fresh farm produce harvested on-demand",
        "Transparent price breakdown showing where every rupee goes",
        "Direct support for local rural farming families",
        "No hidden middleman markups"
      ]
    },

    finalCta: {
      title: "Ready to Transform Agricultural Trade?",
      subtitle: "Join thousands of farmers, bulk buyers, and consumers building a fairer, waste-free food system.",
      farmerAction: "Join as Farmer",
      buyerAction: "Post Buyer Requirement",
      demoAction: "Test Interactive Demo"
    }
  },

  marketPulse: {
    title: "Market Pulse",
    subtitle: "Real-time crop demand, supply predictions, and price trends across your district",
    districtSelect: "Select District",
    cropSelect: "Select Crop",
    timeframe: "Next 15 Days Forecast",
    demandSupplyGap: "Demand vs. Expected Supply Gap",
    currentDemand: "Current Buyer Demand",
    expectedSupply: "Declared Expected Supply",
    supplyDeficit: "Supply Deficit (High Selling Opportunity)",
    supplySurplus: "Supply Surplus (Pre-booking Recommended)",
    trendingCrops: "Trending Crops This Week",
    confidenceInterval: "95% Model Confidence Bounds",
    validationAccuracy: "Model Evaluation: MAE 600.4 kg | RMSE 784.8 kg | MAPE 1.87%",
    aiInsightTitle: "AI Market Intelligence",
    aiInsightText: "Tomato demand is expected to rise by 18% over the next 10 days due to bulk institutional orders in Pune and Nashik. Farmers with harvests scheduled between Sept 18-25 can secure optimal pre-market rates.",
    aiRecommendations: [
      "Tomato: Peak demand window opening in 5 days. Consider locking in buyer contracts now.",
      "Onion: Stable demand curve across Maharashtra distribution centers with low price volatility.",
      "Moong: High procurement interest from organic grain processors at ₹75/kg baseline."
    ]
  },

  priceTransparency: {
    title: "Urban Price Stack Transparency",
    subtitle: "Complete visibility into agricultural pricing from farm gate to consumer kitchen",
    guidanceNotice: "Advisory Guidance: Suggested price ranges are computed from market supply, buyer demand, and logistics cost. Farmers retain 100% pricing autonomy.",
    farmerAskPrice: "Farmer Minimum Price",
    cropPerishability: "Perishability Tier",
    transitDistance: "Distance to Market",
    waterfallTitle: "Visual Price Movement Waterfall",
    farmerPayout: "Farmer Direct Payout",
    collectionHandling: "Collection & Sorting",
    transportLogistics: "Cold Freight Transport",
    retailMargin: "Wholesale & Retail Margin",
    platformFee: "Platform Coordination Fee",
    finalConsumerPrice: "Final Consumer Price",
    farmerShareStatement: "Farmer receives {percentage}% of the final retail price.",
    calculatorTitle: "Interactive Price Realization Calculator",
    matrixTitle: "Competing Buyer Procurement Offers Matrix",
    bestOffer: "★ HIGHEST NET PAYOUT",
    breakdownHeaders: {
      component: "Cost Component",
      type: "Audit Type",
      amount: "Amount (₹/kg)",
      share: "% Share"
    }
  },

  demo: {
    title: "Interactive SIH 2026 Product Demo",
    subtitle: "Experience end-to-end pre-market coordination flows designed for Smart India Hackathon judges",
    selectScenario: "Select a Demonstration Scenario",
    scenario1Title: "Scenario 1: Bulk Buyer Demand Flow",
    scenario1Desc: "Bulk Buyer posts demand for 1,000 kg Tomato → AI matches nearby farmers → Multi-farmer yield pooled → Route scheduled → Order confirmed.",
    scenario2Title: "Scenario 2: Unsold Harvest Stock Discovery",
    scenario2Desc: "Farmer lists 500 kg harvested stock with no immediate buyer → AI discovers regional buyer demand → Direct match proposed → Stock sold before spoilage.",
    scenario3Title: "Scenario 3: Price Stack Transparency Audit",
    scenario3Desc: "Inspect the complete itemized breakdown from farm gate to household consumer with ESTIMATED vs ACTUAL tags.",
    scenario4Title: "Scenario 4: Multilingual Voice Assistant",
    scenario4Desc: "Simulate voice input in English or Tamil, parse crop entities, and publish an instant harvest declaration.",
    runButton: "Run This Scenario",
    runningText: "Executing simulation...",
    simulationLogs: "Live Execution Sequence",
    completedBadge: "FLOW COMPLETED SUCCESSFULLY",
    nextStepBtn: "Proceed to Next Step"
  },

  farmer: {
    greeting: "Good morning, Farmer 👋",
    greetingSub: "Manage your harvest declarations, review buyer opportunities, and track payouts.",
    addCropBtn: "+ Post Crop or Stock",
    summary: {
      declaredHarvest: "Declared Harvest",
      activeDemands: "Buyer Requirements",
      availableStock: "Available Stock",
      pendingOrders: "Active Orders",
      estimatedPayout: "Estimated Direct Payout"
    },
    quickActionsTitle: "Priority Actions",
    quickActions: {
      postStock: "Post Crop / Stock",
      postStockSub: "Tell buyers what you plan to harvest",
      viewDemand: "View Buyer Demand",
      viewDemandSub: "See verified buyer requirements near you",
      priceGuidance: "Suggested Price",
      priceGuidanceSub: "Check advisory market price range",
      trackOrders: "Track Orders",
      trackOrdersSub: "Monitor pickup and payment milestones"
    },
    wizard: {
      title: "Declare Crop or Available Stock",
      subtitle: "Simple 5-step form to connect your produce with verified buyers",
      step1: "1. Crop",
      step2: "2. Quantity",
      step3: "3. Price",
      step4: "4. Date & Location",
      step5: "5. Review",
      step1Title: "🌾 What crop are you growing?",
      step1Sub: "Select the crop you plan to harvest or currently have in stock",
      step2Title: "📦 How much quantity do you expect?",
      step2Sub: "Enter estimated harvest quantity in kilograms (kg)",
      step2Presets: "Quick Presets:",
      step3Title: "💰 What is your minimum expected price?",
      step3Sub: "Suggested price is advisory. You decide your minimum selling price.",
      step4Title: "📅 When will it be ready & where?",
      step4Sub: "Select expected harvest date and farm location",
      step5Title: "✅ Review and Publish",
      step5Sub: "Check your harvest details before publishing to verified buyers",
      cropLabel: "Selected Crop",
      quantityLabel: "Quantity (kg)",
      priceLabel: "Minimum Expected Price (₹/kg)",
      dateLabel: "Estimated Harvest Date",
      gradeLabel: "Quality Grade",
      districtLabel: "District / Location",
      publishExpectedBtn: "Post Expected Harvest ✓",
      publishStockBtn: "Post Available Stock ✓",
      validationQty: "Please enter a valid quantity greater than 0 kg.",
      validationPrice: "Please enter a valid price greater than ₹0/kg.",
      successMsg: "Your harvest declaration has been published successfully! Nearby buyers are being notified."
    },
    tabs: {
      overview: "📊 Overview",
      myCrops: "🌾 Expected Supplies",
      currentStock: "📦 Available Stock",
      demands: "🤝 Buyer Opportunities",
      orders: "🚚 Orders & Dispatches",
      alerts: "🔔 Notifications",
      guidance: "💰 Price Guidance"
    }
  },

  consumer: {
    title: "Consumer Farm Direct Portal",
    subtitle: "Order fresh seasonal produce directly from verified local smallholders",
    postRequirementBtn: "+ Post Family Requirement",
    catalogTitle: "Available Farm-Fresh Stock Near You",
    directOrderBtn: "Order Directly from Farmer",
    priceBreakdownBtn: "View Price Breakdown",
    householdModalTitle: "Post Household Produce Requirement",
    householdModalSub: "Tell local farmers what your family needs this week"
  },

  buyer: {
    title: "Bulk Buyer Procurement Dashboard",
    subtitle: "Contract agricultural volumes before harvest with automated multi-farmer pooling",
    postDemandBtn: "+ Post Bulk Requirement",
    activeDemandsTitle: "Your Active Sourcing Requirements",
    runMatchBtn: "Execute Matching Engine",
    pooledFarmersTitle: "Pooled Participating Farmers",
    confirmOrderBtn: "Confirm Purchase Order"
  },

  logistics: {
    title: "Logistics & Fleet Dispatch Center",
    subtitle: "Google OR-Tools VRPTW multi-farm collection and dropoff sequencing",
    activeJobsTitle: "Assigned Delivery & Collection Queue",
    pickupStopsTitle: "Multi-Farm Pickup Sequence",
    acceptJobBtn: "Accept Transport Job",
    updateStatusBtn: "Update Status to Dispatched",
    completedStatusBtn: "Mark Delivered"
  },

  fpo: {
    title: "FPO Aggregation Hub",
    subtitle: "Combine smallholder member yields to fulfill large institutional purchase contracts",
    combinedYieldTitle: "FPO Member Pooled Harvest",
    memberDirectoryTitle: "Member Crop Details & Harvest Directory"
  },

  admin: {
    title: "Platform Administration & System Health",
    subtitle: "High-level overview of network trade volume, fee sustainability, and ML engines",
    tradeVolumeTitle: "Total Trade Volume",
    platformRevenueTitle: "Platform Fee Revenue (1.5%)",
    activeNetworkTitle: "Active Demands & Harvest Declarations"
  },

  footer: {
    aboutTitle: "About AGRIFlow",
    aboutText: "AGRIFlow connects agricultural demand with expected supply before harvest, reducing unsold food waste and maximizing direct smallholder farmer earnings.",
    sihBadge: "Built for Smart India Hackathon 2026 • Problem SIH26033",
    quickLinks: "Quick Navigation",
    stakeholders: "User Portals",
    transparencyNotice: "Advisory Notice: Price suggestions are calculated from market indicators and logistical benchmarks. Farmers and buyers retain complete autonomy in negotiating final transaction values.",
    copyright: "© 2026 AGRIFlow Agricultural Technology Platform. All rights reserved.",
    accessibility: "Accessibility & Multilingual Support (English / தமிழ்)"
  }
};
