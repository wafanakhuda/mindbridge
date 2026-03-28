/**
 * MindBridge AI Agents — powered by Gemini 2.0 Flash
 *
 * Agent 1: TriageAgent       — warm intro, rapport building
 * Agent 2: RiskAgent         — PHQ-2/GAD-2 + NLP sentiment → risk score 0-100
 * Agent 3: TherapyAgent      — CBT micro-interventions for low/moderate risk
 * Agent 4: CareNavigatorAgent — clinic routing + next steps for moderate/high
 * Agent 5: FollowUpAgent     — post-screening retention messages
 * Agent 6: FreeTextAgent     — mid-screening empathetic responses
 */

const API_KEY =
  (import.meta as any).env?.VITE_GEMINI_API_KEY ||
  (typeof process !== 'undefined' && (process.env as any).GEMINI_API_KEY) ||
  '';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

async function callGemini(
  systemPrompt: string,
  userMessage: string,
  temperature = 0.7,
  maxTokens = 400
): Promise<string> {
  if (!API_KEY) throw new Error('NO_KEY');
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: { temperature, maxOutputTokens: maxTokens },
    }),
  });
  if (!response.ok) throw new Error(`Gemini ${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ═══════════════════════════════════════════════════════════
// AGENT 1 — TriageAgent
// Warm, personalised welcome. Weaves PHQ/GAD into conversation.
// ═══════════════════════════════════════════════════════════
export async function TriageAgent(userContext: string): Promise<string> {
  return callGemini(
    `You are MindBridge's compassionate mental health triage assistant.
Your role is to warmly welcome users and acknowledge exactly what they shared.

Rules:
- Be warm, human, conversational — never clinical
- 2-3 sentences only
- Reference the user's exact words
- End by saying you will ask them 4 short questions about the past 2 weeks
- Never diagnose or assume
- If they mentioned a ChatGPT history, acknowledge that you have that context`,
    `User said: "${userContext}". Respond warmly and personally, then transition into the screening.`,
    0.75, 200
  );
}

// ═══════════════════════════════════════════════════════════
// AGENT 2 — RiskAgent
// PHQ-2 + GAD-2 scores + NLP sentiment → risk score 0-100
// ═══════════════════════════════════════════════════════════
export interface RiskAnalysis {
  riskLevel: 'low' | 'moderate' | 'high';
  riskScore: number;        // 0-100 clinical score
  riskTitle: string;
  riskIcon: string;
  personalMessage: string;
  keyInsight: string;
  sentimentFlag: string;    // NLP observation about tone/language
}

export async function RiskAgent(
  phqScore: number,
  gadScore: number,
  conversationSummary: string
): Promise<RiskAnalysis> {
  const total = phqScore + gadScore;
  // Clinical score 0-100: PHQ-2 max 6, GAD-2 max 6, total max 12 → scale to 100
  const clinicalScore = Math.round((total / 12) * 100);
  const baseRisk: 'low' | 'moderate' | 'high' = total <= 2 ? 'low' : total <= 5 ? 'moderate' : 'high';

  try {
    const raw = await callGemini(
      `You are MindBridge's clinical risk analysis agent. Analyse PHQ-2 and GAD-2 scores
alongside the user's own language. Return ONLY raw JSON — no markdown, no backticks.

JSON structure:
{
  "riskLevel": "low" | "moderate" | "high",
  "riskScore": number (0-100),
  "riskTitle": "max 6 words",
  "riskIcon": "single emoji",
  "personalMessage": "2-3 sentences referencing their specific words",
  "keyInsight": "one sentence — main clinical pattern observed",
  "sentimentFlag": "one sentence — notable language/tone observation e.g. minimising, catastrophising, hopeful"
}

Rules:
- riskLevel MUST be: ${baseRisk} (based on clinical score)
- riskScore should be near: ${clinicalScore}
- Be compassionate, never alarmist
- Reference specific words they used`,
      `PHQ-2: ${phqScore}/6 | GAD-2: ${gadScore}/6 | Total: ${total}/12
User's words: "${conversationSummary}"`,
      0.4, 350
    );

    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    return {
      riskLevel: parsed.riskLevel || baseRisk,
      riskScore: parsed.riskScore || clinicalScore,
      riskTitle: parsed.riskTitle || defaultTitle(baseRisk),
      riskIcon: parsed.riskIcon || defaultIcon(baseRisk),
      personalMessage: parsed.personalMessage || defaultMessage(baseRisk),
      keyInsight: parsed.keyInsight || '',
      sentimentFlag: parsed.sentimentFlag || '',
    };
  } catch {
    return {
      riskLevel: baseRisk,
      riskScore: clinicalScore,
      riskTitle: defaultTitle(baseRisk),
      riskIcon: defaultIcon(baseRisk),
      personalMessage: defaultMessage(baseRisk),
      keyInsight: '',
      sentimentFlag: '',
    };
  }
}

function defaultTitle(r: string) { return r === 'low' ? 'Coping Well' : r === 'moderate' ? 'Some Signs of Distress' : 'Please Seek Support'; }
function defaultIcon(r: string)  { return r === 'low' ? '🌱' : r === 'moderate' ? '🌤️' : '⚡'; }
function defaultMessage(r: string) {
  if (r === 'low') return "Your responses suggest you're managing reasonably well. Keep up your routines and check in regularly.";
  if (r === 'moderate') return "You're showing some signs worth taking seriously. A conversation with a healthcare provider would be genuinely helpful.";
  return "Your responses indicate significant distress. Please reach out to a crisis helpline — you don't have to face this alone.";
}

// ═══════════════════════════════════════════════════════════
// AGENT 3 — TherapyAgent
// CBT micro-interventions for low/moderate risk users
// Returns a personalised exercise or grounding technique
// ═══════════════════════════════════════════════════════════
export interface TherapyIntervention {
  title: string;
  type: 'breathing' | 'grounding' | 'cbt' | 'behavioural';
  instruction: string;   // Step-by-step, max 5 steps
  rationale: string;     // Why this is relevant to them specifically
  duration: string;      // e.g. "3 minutes"
}

export async function TherapyAgent(
  riskLevel: 'low' | 'moderate',
  phqScore: number,
  gadScore: number,
  userContext: string
): Promise<TherapyIntervention> {
  try {
    const raw = await callGemini(
      `You are MindBridge's therapeutic micro-intervention agent, trained in CBT.
For a patient at ${riskLevel} risk, choose the single most appropriate evidence-based
technique and personalise it to their specific situation.

Return ONLY raw JSON — no markdown:
{
  "title": "Name of the technique (e.g. Box Breathing, 5-4-3-2-1 Grounding)",
  "type": "breathing" | "grounding" | "cbt" | "behavioural",
  "instruction": "Numbered steps, max 5. Be concrete and specific.",
  "rationale": "1 sentence explaining why this technique suits their situation",
  "duration": "e.g. 3 minutes"
}

Choose from:
- Box breathing (anxiety, panic, overwhelm)
- 5-4-3-2-1 grounding (dissociation, rumination)
- Behavioural activation (depression, low motivation)
- Thought challenging (catastrophising, negative beliefs)
- Progressive muscle relaxation (physical tension, insomnia)`,
      `PHQ-2: ${phqScore}/6 | GAD-2: ${gadScore}/6 | Risk: ${riskLevel}
User context: "${userContext}"
Choose and personalise the most appropriate intervention.`,
      0.6, 400
    );

    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    // Fallback: box breathing for anxiety, behavioural activation for depression
    const isMoreAnxious = gadScore >= phqScore;
    return isMoreAnxious ? {
      title: 'Box Breathing',
      type: 'breathing',
      instruction: '1. Breathe in slowly for 4 seconds.\n2. Hold for 4 seconds.\n3. Breathe out slowly for 4 seconds.\n4. Hold for 4 seconds.\n5. Repeat 4 times.',
      rationale: 'Box breathing directly activates your parasympathetic nervous system, reducing anxiety within 60 seconds.',
      duration: '3 minutes',
    } : {
      title: 'Behavioural Activation',
      type: 'behavioural',
      instruction: '1. Name one small activity you used to enjoy.\n2. Schedule it for today — even for 10 minutes.\n3. Do it regardless of motivation level.\n4. Notice how you feel afterwards.\n5. Repeat tomorrow with the same or a different activity.',
      rationale: 'When mood is low, action comes before motivation — not after. Small activities rebuild energy gradually.',
      duration: '10 minutes',
    };
  }
}

// ═══════════════════════════════════════════════════════════
// AGENT 4 — CareNavigatorAgent
// Logistics & routing for moderate/high risk
// Generates personalised next steps + referral guidance
// ═══════════════════════════════════════════════════════════
export async function CareNavigatorAgent(
  riskLevel: 'low' | 'moderate' | 'high',
  phqScore: number,
  gadScore: number,
  conversationSummary: string
): Promise<string[]> {
  try {
    const raw = await callGemini(
      `You are MindBridge's care navigation agent. Generate exactly 3 personalised,
actionable next steps as a JSON array of 3 strings. No markdown, just raw JSON array.

Each step max 20 words. Rules by risk:
- HIGH: Step 1 MUST be "Find your country's crisis helpline in the Global Directory tab — call now"
- MODERATE: Include a GP/clinic visit as step 1
- LOW: Focus on maintaining and building on existing strengths

Reference the user's specific words and situation. Be warm and specific, not generic.`,
      `Risk: ${riskLevel} | PHQ-2: ${phqScore}/6 | GAD-2: ${gadScore}/6
Context: "${conversationSummary}"`,
      0.6, 250
    );

    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    if (Array.isArray(parsed) && parsed.length === 3) return parsed;
    throw new Error('bad format');
  } catch {
    if (riskLevel === 'high') return [
      "Find your country's crisis helpline in the Global Directory tab — call now",
      'Visit your nearest emergency or primary care centre today with this screening result',
      'Tell one trusted person exactly how you are feeling right now',
    ];
    if (riskLevel === 'moderate') return [
      'Book a GP appointment this week and share this screening result with them',
      'Try the guided breathing exercise in the Resources tab today',
      'Return for a re-screening in 2 weeks to track how you are doing',
    ];
    return [
      'Keep your current routines — sleep, movement, and connection are protecting you',
      'Explore the self-help resources in the Resources tab to build resilience',
      'Re-screen in 4–6 weeks or whenever you feel your mood shifting',
    ];
  }
}

// ═══════════════════════════════════════════════════════════
// AGENT 5 — FollowUpAgent
// Post-screening retention: generates check-in messages
// Called by scheduler to re-engage users after 7/30/90 days
// ═══════════════════════════════════════════════════════════
export interface FollowUpMessage {
  message: string;
  urgency: 'routine' | 'concerned' | 'urgent';
  suggestRescreening: boolean;
  checkInQuestion: string;
}

export async function FollowUpAgent(
  daysSinceScreening: number,
  lastRiskLevel: 'low' | 'moderate' | 'high',
  lastUserContext: string
): Promise<FollowUpMessage> {
  try {
    const raw = await callGemini(
      `You are MindBridge's follow-up retention agent. Generate a warm, brief check-in
message for a patient returning after ${daysSinceScreening} days.

Return ONLY raw JSON:
{
  "message": "2-sentence warm check-in message. Reference their previous risk level naturally.",
  "urgency": "routine" | "concerned" | "urgent",
  "suggestRescreening": true | false,
  "checkInQuestion": "One open, gentle question to gauge current mood"
}

Urgency guide:
- routine: low risk follow-up, 30-90 days
- concerned: moderate/high risk, 7-14 days
- urgent: high risk, missed previous check-in`,
      `Days since screening: ${daysSinceScreening}
Last risk level: ${lastRiskLevel}
What they shared previously: "${lastUserContext}"`,
      0.7, 300
    );

    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return {
      message: `Hi — it's been ${daysSinceScreening} days since your last MindBridge check-in. We just wanted to see how you're doing. 🌿`,
      urgency: lastRiskLevel === 'high' ? 'urgent' : lastRiskLevel === 'moderate' ? 'concerned' : 'routine',
      suggestRescreening: true,
      checkInQuestion: 'How have you been feeling compared to last time?',
    };
  }
}

// ═══════════════════════════════════════════════════════════
// AGENT 6 — FreeTextAgent
// Mid-screening empathetic responses to user typed messages
// ═══════════════════════════════════════════════════════════
export async function FreeTextAgent(
  userMessage: string,
  screeningContext: string
): Promise<string> {
  return callGemini(
    `You are MindBridge's empathetic support agent during a mental health screening.
Rules:
- 2-3 sentences only, warm and non-judgmental
- Never diagnose
- If crisis/suicidal language: gently direct to Directory tab for crisis helplines
- Steer gently back to completing the screening
- Do NOT provide therapy — acknowledge and support only`,
    `Screening context: "${screeningContext}"\nUser typed: "${userMessage}"\nRespond warmly and briefly.`,
    0.7, 200
  );
}
