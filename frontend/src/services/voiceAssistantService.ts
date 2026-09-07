/**
 * Voice Assistant Orchestrator Service
 * Ties together intent detection, speech services, and demo mode.
 * Manages conversation context for multi-turn dialogues.
 */

import { VoiceIntent, VoiceAction, VoiceConversationContext, VoiceMessage, UserRole } from '@/types';
import { detectIntent, IntentResult } from './voiceIntentService';
import { Language } from './translations';

// ============================================================
// Demo Mode Scenarios
// ============================================================

export interface DemoScenario {
  id: number;
  inputEn: string;
  inputTa: string;
  intent: VoiceIntent;
  responseEn: string;
  responseTa: string;
  action: VoiceAction;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 1,
    inputEn: "Show today's tomato demand",
    inputTa: "இன்றைய தக்காளி தேவை காட்டு",
    intent: 'CHECK_DEMAND',
    responseEn: "Today's tomato demand is high. There are 5 active buyer requests totaling 8,500 kg in your region. Top buyer offering ₹30/kg.",
    responseTa: "இன்று தக்காளிக்கு அதிக தேவை உள்ளது. உங்கள் பகுதியில் 8,500 கிலோவுக்கு 5 வாங்குபவர் கோரிக்கைகள் உள்ளன. அதிகபட்ச விலை ₹30/கிலோ.",
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'buyerOpportunities' },
  },
  {
    id: 2,
    inputEn: "Find buyers for my tomatoes",
    inputTa: "என் தக்காளிக்கு வாங்குபவர்களை கண்டுபிடி",
    intent: 'FIND_BUYERS',
    responseEn: "Found 3 verified buyers for Tomato in your region: Reliance Retail DC (₹30/kg, 2000kg), DeHaat Hub (₹28/kg, 1500kg), Local FPO Aggregator (₹27/kg, 1000kg).",
    responseTa: "உங்கள் பகுதியில் தக்காளிக்கு 3 சரிபார்க்கப்பட்ட வாங்குபவர்கள்: Reliance Retail DC (₹30/கிலோ, 2000கிலோ), DeHaat Hub (₹28/கிலோ, 1500கிலோ), Local FPO (₹27/கிலோ, 1000கிலோ).",
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'buyerOpportunities' },
  },
  {
    id: 3,
    inputEn: "Show my stock",
    inputTa: "என் ஸ்டாக் காட்டு",
    intent: 'CHECK_MY_STOCK',
    responseEn: "Your current stock: Tomato — 500 kg (Grade A, ₹28/kg), Onion — 300 kg (Grade A, ₹22/kg). Total available: 800 kg across 2 crops.",
    responseTa: "உங்கள் தற்போதைய கையிருப்பு: தக்காளி — 500 கிலோ (தரம் A, ₹28/கிலோ), வெங்காயம் — 300 கிலோ (தரம் A, ₹22/கிலோ). மொத்தம்: 2 பயிர்களில் 800 கிலோ.",
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'currentStock' },
  },
  {
    id: 4,
    inputEn: "What is the tomato price?",
    inputTa: "தக்காளி விலை என்ன?",
    intent: 'CHECK_PRICE_GUIDANCE',
    responseEn: "Today's average tomato price is ₹28/kg. Suggested range: ₹24-₹32/kg. Farmer net realization after deductions: ₹25.70/kg (91.8% payout).",
    responseTa: "இன்றைய சராசரி தக்காளி விலை ₹28/கிலோ. பரிந்துரை: ₹24-₹32/கிலோ. கழிவுகளுக்குப் பிறகு விவசாயி நிகர வருமானம்: ₹25.70/கிலோ (91.8% நேரடி பணம்).",
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'suggestedPrice' },
  },
  {
    id: 5,
    inputEn: "Open market pulse",
    inputTa: "மார்க்கெட் பல்ஸ் திற",
    intent: 'OPEN_MARKET_PULSE',
    responseEn: "Opening Market Pulse — showing live demand trends, supply data, and price movements across all crops in your region.",
    responseTa: "மார்க்கெட் பல்ஸ் திறக்கிறது — உங்கள் பகுதியில் அனைத்து பயிர்களுக்கான நேரடி தேவை போக்குகள், வரத்து தகவல்கள், விலை மாற்றங்கள்.",
    action: { type: 'NAVIGATE', role: 'FARMER', tab: 'overview' },
  },
];

// ============================================================
// Orchestrator Class
// ============================================================

class VoiceAssistantOrchestratorService {
  private context: VoiceConversationContext = { turnCount: 0 };

  /**
   * Process user text input and return a response
   */
  processCommand(
    text: string,
    language: Language,
    userRole: UserRole,
  ): {
    intent: VoiceIntent;
    response: string;
    action: VoiceAction;
    requiresConfirmation: boolean;
    entities: Record<string, string | number>;
    followUpField?: string;
  } {
    const result: IntentResult = detectIntent(text, userRole, this.context);

    // Update context
    this.context.turnCount++;
    this.context.previousIntent = result.intent;
    this.context.previousEntities = result.entities;

    // Set follow-up if needed
    if (result.followUpQuestion) {
      this.context.awaitingFollowUp = result.followUpQuestion.field;
    } else {
      this.context.awaitingFollowUp = undefined;
    }

    // Pick response by language
    let response: string;
    if (result.intent === 'UNKNOWN') {
      response = language === 'ta'
        ? 'மன்னிக்கவும், உங்கள் கோரிக்கையை புரிந்துகொள்ள முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது கீழே உள்ள பரிந்துரையைத் தட்டவும்.'
        : "Sorry, I couldn't understand that. Could you try again or tap a suggestion below?";
    } else if (result.followUpQuestion) {
      response = language === 'ta' ? result.responseTa || result.followUpQuestion.ta : result.responseEn || result.followUpQuestion.en;
    } else {
      response = language === 'ta' ? result.responseTa : result.responseEn;
    }

    return {
      intent: result.intent,
      response,
      action: result.action,
      requiresConfirmation: result.requiresConfirmation,
      entities: result.entities,
      followUpField: result.followUpQuestion?.field,
    };
  }

  /**
   * Get demo scenario by index
   */
  getDemoScenario(index: number): DemoScenario | null {
    return DEMO_SCENARIOS[index] || null;
  }

  /**
   * Get all demo scenarios
   */
  getAllDemoScenarios(): DemoScenario[] {
    return DEMO_SCENARIOS;
  }

  /**
   * Reset conversation context
   */
  resetContext(): void {
    this.context = { turnCount: 0 };
  }

  /**
   * Get current context
   */
  getContext(): VoiceConversationContext {
    return { ...this.context };
  }
}

export const voiceAssistantService = new VoiceAssistantOrchestratorService();
