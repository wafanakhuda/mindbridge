/**
 * MindBridge AI Agents — powered by Gemini
 * Three agents: TriageAgent, RiskAgent, CareNavigatorAgent
 */

const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY
  || (typeof process !== 'undefined' && (process.env as any).GEMINI_API_KEY)
  || '';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  if (!API_KEY) {
    console.warn('No Gemini API key found — using fallback response');
    throw new Error('NO_KEY');
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
      },
    }),
  });

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ─────────────────────────────────────────────
// AGENT 1: TriageAgent
// Provides warm, empathetic, personalised intro
// ─────────────────────────────────────────────
export async function TriageAgent(userContext: string): Promise<string> {
  const system = `You are MindBridge's compassionate mental health triage assistant.
Your role is to warmly welcome users, acknowledge what they've shared, and gently 
prepare them for a brief 4-question mental health screening (PHQ-2 and GAD-2).

Rules:
- Be warm, human, and never clinical
- Keep response to 2-3 sentences maximum
- Never diagnose or make assumptions
- Always end by saying you'll ask them a few short questions
- Use gentle, supportive language`;

  const user = `The user said: "${userContext}". 
Generate a warm, personalised response acknowledging what they shared and 
transitioning them into the screening.`;

  return callGemini(system, user);
}

// ─────────────────────────────────────────────
// AGENT 2: RiskAgent
// Analyses PHQ-2 + GAD-2 scores and user context
// Returns personalised risk analysis
// ─────────────────────────────────────────────
export interface RiskAnalysis {
  riskLevel: 'low' | 'moderate' | 'high';
  riskTitle: string;
  riskIcon: string;
  personalMessage: string;
  keyInsight: string;
}

export async function RiskAgent(
  phqScore: number,
  gadScore: number,
  conversationSummary: string
): Promise<RiskAnalysis> {
  const total = phqScore + gadScore;
  const baseRisk = total <= 2 ? 'low' : total <= 5 ? 'moderate' : 'high';

  const system = `You are MindBridge's clinical risk analysis agent.
You analyse PHQ-2 (depression) and GAD-2 (anxiety) screening scores alongside 
the user's own words to produce a personalised, compassionate risk summary.

Respond ONLY with valid JSON in this exact format:
{
  "riskLevel": "low" | "moderate" | "high",
  "riskTitle": "short title (max 6 words)",
  "riskIcon": "single emoji",
  "personalMessage": "2-3 sentence personalised message referencing their specific answers",
  "keyInsight": "one sentence insight about the main pattern you noticed"
}

Rules:
- Never be alarmist or cold
- Always be compassionate and validating  
- Reference specific things the user shared
- The riskLevel MUST match the clinical score: ${baseRisk}`;

  const user = `PHQ-2 score: ${phqScore}/6 (depression indicators)
GAD-2 score: ${gadScore}/6 (anxiety indicators)  
Total: ${total}/12
What they shared during screening: "${conversationSummary}"

Analyse this and return the JSON risk assessment.`;

  try {
    const raw = await callGemini(system, user);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      riskLevel: parsed.riskLevel || baseRisk,
      riskTitle: parsed.riskTitle || (baseRisk === 'low' ? 'Coping Well' : baseRisk === 'moderate' ? 'Some Signs of Distress' : 'Please Seek Support'),
      riskIcon: parsed.riskIcon || (baseRisk === 'low' ? '🌱' : baseRisk === 'moderate' ? '🌤️' : '⚡'),
      personalMessage: parsed.personalMessage || '',
      keyInsight: parsed.keyInsight || '',
    };
  } catch {
    // Fallback if AI fails
    return {
      riskLevel: baseRisk,
      riskTitle: baseRisk === 'low' ? 'Coping Well' : baseRisk === 'moderate' ? 'Some Signs of Distress' : 'Please Seek Support',
      riskIcon: baseRisk === 'low' ? '🌱' : baseRisk === 'moderate' ? '🌤️' : '⚡',
      personalMessage: baseRisk === 'low'
        ? "Your responses suggest you're managing reasonably well right now. Keep up with your current routines and check in regularly."
        : baseRisk === 'moderate'
        ? "You're showing some signs of anxiety or low mood. A conversation with a healthcare provider would be genuinely helpful."
        : "Your responses indicate significant distress. Please reach out to a crisis helpline or healthcare provider — you don't have to face this alone.",
      keyInsight: '',
    };
  }
}

// ─────────────────────────────────────────────
// AGENT 3: CareNavigatorAgent
// Generates personalised, actionable next steps
// ─────────────────────────────────────────────
export async function CareNavigatorAgent(
  riskLevel: 'low' | 'moderate' | 'high',
  phqScore: number,
  gadScore: number,
  conversationSummary: string
): Promise<string[]> {
  const system = `You are MindBridge's care navigation agent.
Based on a user's mental health screening results and their personal context,
generate exactly 3 personalised, actionable next steps.

Respond ONLY with a JSON array of exactly 3 strings.
Example: ["Step one text", "Step two text", "Step three text"]

Rules:
- Each step should be specific and actionable (not generic)
- Reference the user's specific situation where possible
- For high risk: always include crisis helpline as step 1
- For moderate: include a primary care visit
- For low: focus on maintaining and strengthening wellbeing
- Each step max 20 words
- Be warm and encouraging, not clinical`;

  const user = `Risk level: ${riskLevel}
PHQ-2 (depression): ${phqScore}/6
GAD-2 (anxiety): ${gadScore}/6
User context: "${conversationSummary}"

Generate 3 personalised next steps as a JSON array.`;

  try {
    const raw = await callGemini(system, user);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length === 3) return parsed;
    throw new Error('Invalid format');
  } catch {
    // Fallbacks
    if (riskLevel === 'high') return [
      'Contact a crisis helpline now — find your country\'s number in our Global Directory',
      'Visit your nearest primary care centre today and show them this screening result',
      'Tell one trusted person how you\'re feeling right now — you deserve support',
    ];
    if (riskLevel === 'moderate') return [
      'Book an appointment with your GP this week and share this screening result',
      'Try the guided breathing exercise in our Resources section today',
      'Check in again in 2 weeks to track whether things are improving',
    ];
    return [
      'Keep your current healthy routines — they are clearly making a difference',
      'Explore the self-help resources to build on your existing resilience',
      'Schedule a re-screening in 4–6 weeks to maintain awareness of your wellbeing',
    ];
  }
}

// ─────────────────────────────────────────────
// AGENT 4: FreeTextAgent  
// Responds to free text typed by the user
// ─────────────────────────────────────────────
export async function FreeTextAgent(
  userMessage: string,
  screeningContext: string
): Promise<string> {
  const system = `You are MindBridge's compassionate mental health support chat agent.
A user is going through a mental health screening and has typed a free-form message.

Rules:
- Be warm, empathetic and non-judgmental
- Keep responses to 2-3 sentences maximum
- Never diagnose
- If they express crisis or suicidal thoughts, gently direct them to the Directory tab for crisis lines
- Gently steer them back to completing the screening if appropriate
- Do NOT provide therapy — just acknowledge and support`;

  const user = `Screening context so far: "${screeningContext}"
User typed: "${userMessage}"
Respond warmly and briefly.`;

  return callGemini(system, user);
}
