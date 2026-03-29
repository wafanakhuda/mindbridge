/**
 * MindBridge AI Agents - Gemini 2.0 Flash
 * All agents call Gemini directly. Fallbacks ensure the app always works.
 */

const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
export const hasApiKey = !!API_KEY;

async function callGemini(system: string, user: string, temp = 0.7, tokens = 400): Promise<string> {
  if (!API_KEY) throw new Error('NO_KEY');
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { temperature: temp, maxOutputTokens: tokens },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const d = await res.json();
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response');
  return text;
}

// Robust JSON extractor - handles markdown fences, trailing text, single quotes
function extractJSON(raw: string): any {
  // Strip markdown fences
  let s = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  // Find first { or [ and last } or ]
  const start = s.search(/[{[]/);
  if (start === -1) throw new Error('No JSON found');
  s = s.slice(start);
  // Find matching close bracket
  const opener = s[0];
  const closer = opener === '{' ? '}' : ']';
  let depth = 0;
  let end = -1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === opener) depth++;
    else if (s[i] === closer) { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) throw new Error('Unclosed JSON');
  return JSON.parse(s.slice(0, end + 1));
}

// ── AGENT 1: TriageAgent ─────────────────────────────────────────
// Warm, personalised opening. References their exact words.
export async function TriageAgent(input: string): Promise<string> {
  try {
    return await callGemini(
      `You are a warm, compassionate mental health check-in assistant called MindBridge.
The user just shared something personal. Respond with genuine warmth in 2 sentences.
- Use their exact words
- Be human, never clinical
- End with: "I am going to ask you a few questions to understand how you have been feeling."
- Never say "I understand" or generic phrases`,
      input, 0.8, 150
    );
  } catch { return ''; }
}

// ── AGENT 2: ConversationalScreener ─────────────────────────────
// Takes the user's previous answer and generates a personalised follow-up question.
// This is what makes screening NON-LINEAR - each question is based on the last answer.
export async function ConversationalScreener(
  questionNumber: number,
  previousAnswer: string,
  conversationHistory: string,
  chatGptContext: string
): Promise<{ question: string; followUp?: string }> {
  const PHQ_CORE = [
    'how often they feel little interest or pleasure in doing things',
    'how often they feel down, depressed, or hopeless',
  ];
  const GAD_CORE = [
    'how often they feel nervous, anxious, or on edge',
    'how often they cannot stop or control worrying',
  ];

  const allTopics = [...PHQ_CORE, ...GAD_CORE];
  const topic = allTopics[questionNumber] || allTopics[3];

  try {
    const raw = await callGemini(
      `You are a compassionate mental health screener. Ask question ${questionNumber + 1} of 4.
The topic to cover is: "${topic}" (PHQ-2/GAD-2 validated question).

Rules:
- Reference what they just said to make it feel connected
- Ask the question in a warm, conversational way - not like a clinical form
- Include the time frame "over the past 2 weeks" naturally in the sentence
- Keep it to 1-2 sentences maximum
- Return ONLY the question text, no preamble`,
      `Their previous answer: "${previousAnswer}"
Full conversation so far: "${conversationHistory}"
${chatGptContext ? `Background context: "${chatGptContext}"` : ''}`,
      0.75, 120
    );
    return { question: raw.trim() };
  } catch {
    const fallbacks = [
      'Over the past 2 weeks, how often have you noticed little interest or pleasure in the things you usually enjoy?',
      'Over the past 2 weeks, how often have you been feeling down, depressed, or hopeless?',
      'How often over the past 2 weeks have you been feeling nervous, anxious, or on edge?',
      'Finally, how often over the past 2 weeks have you found it hard to stop or control your worrying?',
    ];
    return { question: fallbacks[questionNumber] || fallbacks[3] };
  }
}

// ── AGENT 3: BridgeAgent ─────────────────────────────────────────
// Generates a warm, empathetic bridge between answers - keeps it human.
export async function BridgeAgent(answer: string, nextTopic: string): Promise<string> {
  try {
    return await callGemini(
      `You are responding to a mental health screening answer. 
Generate ONE short empathetic acknowledgment sentence (max 15 words).
Then ask them to continue. Do NOT ask the next question - just acknowledge.
Examples: "That makes a lot of sense.", "Thank you for being honest with me.", "I hear you."
Return ONLY the acknowledgment sentence.`,
      `They answered: "${answer}". The next topic is about: "${nextTopic}"`,
      0.7, 60
    );
  } catch { return ''; }
}

// ── AGENT 4: RiskAgent ───────────────────────────────────────────
// Full analysis: scores + language + sentiment -> structured JSON
export interface RiskAnalysis {
  riskLevel: 'low' | 'moderate' | 'high';
  riskScore: number;
  riskTitle: string;
  riskIcon: string;
  personalMessage: string;
  keyInsight: string;
  sentimentFlag: string;
  primaryConcern: 'depression' | 'anxiety' | 'mixed' | 'low';
}

export async function RiskAgent(
  phq: number, gad: number, fullConversation: string, chatGptContext: string
): Promise<RiskAnalysis> {
  const total = phq + gad;
  const score = Math.round((total / 12) * 100);
  const base: 'low' | 'moderate' | 'high' = total <= 2 ? 'low' : total <= 5 ? 'moderate' : 'high';
  const concern: 'depression' | 'anxiety' | 'mixed' | 'low' =
    base === 'low' ? 'low' : gad > phq + 1 ? 'anxiety' : phq > gad + 1 ? 'depression' : 'mixed';

  try {
    const raw = await callGemini(
      `You are a clinical mental health analyst. Analyse PHQ-2 and GAD-2 scores AND the full conversation.
Return ONLY raw JSON, no markdown:
{
  "riskLevel": "${base}",
  "riskScore": ${score},
  "riskTitle": "6 words max - warm not clinical",
  "riskIcon": "single emoji",
  "personalMessage": "3 sentences: acknowledge what they said specifically, what the scores show, one hopeful note",
  "keyInsight": "1 sentence - most important pattern in their language",
  "sentimentFlag": "1 sentence - tone observation e.g. minimising, overwhelmed, hopeful"
}
Rules: riskLevel MUST be "${base}". Be warm, specific, never generic.`,
      `PHQ-2: ${phq}/6 | GAD-2: ${gad}/6 | Total: ${total}/12
Full conversation: "${fullConversation}"
${chatGptContext ? `Prior context: "${chatGptContext}"` : ''}`,
      0.4, 400
    );
    const p = extractJSON(raw);
    return { riskLevel: p.riskLevel || base, riskScore: p.riskScore ?? score, riskTitle: p.riskTitle || fallbackTitle(base), riskIcon: p.riskIcon || fallbackIcon(base), personalMessage: p.personalMessage || fallbackMsg(base), keyInsight: p.keyInsight || '', sentimentFlag: p.sentimentFlag || '', primaryConcern: concern };
  } catch {
    return { riskLevel: base, riskScore: score, riskTitle: fallbackTitle(base), riskIcon: fallbackIcon(base), personalMessage: fallbackMsg(base), keyInsight: '', sentimentFlag: '', primaryConcern: concern };
  }
}

function fallbackTitle(r: string) { return r === 'low' ? 'You are doing well' : r === 'moderate' ? 'Some things to address' : 'You need support now'; }
function fallbackIcon(r: string) { return r === 'low' ? '🌱' : r === 'moderate' ? '🌤️' : '⚡'; }
function fallbackMsg(r: string) {
  if (r === 'low') return 'Your responses suggest you are managing well. Keep doing what is working for you.';
  if (r === 'moderate') return 'You are showing some signs of stress. Speaking with a professional would genuinely help.';
  return 'Your responses show significant distress. Please reach out - you do not have to face this alone.';
}

// ── AGENT 5: TherapyAgent ────────────────────────────────────────
export interface TherapyIntervention {
  title: string;
  type: 'breathing' | 'grounding' | 'cbt' | 'behavioural' | 'game';
  instruction: string;
  rationale: string;
  duration: string;
  steps: string[];
}

export async function TherapyAgent(
  risk: 'low' | 'moderate', phq: number, gad: number, context: string
): Promise<TherapyIntervention> {
  try {
    const raw = await callGemini(
      `You are a CBT therapist. Choose and personalise the best technique for this person.
Return ONLY raw JSON:
{
  "title": "technique name",
  "type": "breathing|grounding|cbt|behavioural|game",
  "rationale": "1 sentence why this fits them specifically - reference their words",
  "duration": "X minutes",
  "steps": ["step 1", "step 2", "step 3", "step 4", "step 5"]
}
Choose from: box breathing (anxiety), 5-4-3-2-1 grounding (racing thoughts), behavioural activation (low mood/depression), thought record (negative beliefs), worry postponement (chronic worrying), body scan (physical tension).`,
      `PHQ-2: ${phq}/6 | GAD-2: ${gad}/6 | Risk: ${risk} | Context: "${context}"`,
      0.6, 350
    );
    const p = extractJSON(raw);
    return { title: p.title, type: p.type, instruction: p.steps?.join('\n') || '', rationale: p.rationale, duration: p.duration, steps: p.steps || [] };
  } catch {
    return gad >= phq ? {
      title: 'Box Breathing', type: 'breathing', rationale: 'Box breathing directly calms your nervous system.',
      duration: '3 minutes', instruction: '', steps: ['Breathe in for 4 seconds', 'Hold for 4 seconds', 'Breathe out for 4 seconds', 'Hold for 4 seconds', 'Repeat 4 times']
    } : {
      title: 'Behavioural Activation', type: 'behavioural', rationale: 'Small actions rebuild mood before motivation returns.',
      duration: '10 minutes', instruction: '', steps: ['Name one small thing you used to enjoy', 'Schedule it for today - even 10 minutes', 'Do it without waiting to feel like it', 'Notice any shift in how you feel', 'Plan one for tomorrow too']
    };
  }
}

// ── AGENT 6: CareNavigatorAgent ──────────────────────────────────
export async function CareNavigatorAgent(
  risk: 'low' | 'moderate' | 'high', phq: number, gad: number, context: string
): Promise<string[]> {
  try {
    const raw = await callGemini(
      `Generate exactly 3 personalised next steps as a JSON array of 3 plain strings. Raw JSON only, no markdown. Each string max 20 words. Example: ["Step one here","Step two here","Step three here"]
HIGH: step 1 = "Find your country crisis helpline in the Global Directory - call now"
MODERATE: step 1 = GP visit this week
LOW: focus on maintaining strengths`,
      `Risk: ${risk} | PHQ: ${phq} | GAD: ${gad} | Context: "${context}"`,
      0.6, 200
    );
    const p = extractJSON(raw);
    const arr = Array.isArray(p) ? p : (p.steps || p.nextSteps || p.recommendations || Object.values(p));
    return Array.isArray(arr) && arr.length >= 3 ? arr.slice(0, 3).map(String) : fallbackSteps(risk);
  } catch { return fallbackSteps(risk); }
}

function fallbackSteps(r: string): string[] {
  if (r === 'high') return ["Find your country crisis helpline in the Global Directory and call now", "Visit your nearest primary care centre today with this screening result", "Tell one trusted person how you are feeling right now"];
  if (r === 'moderate') return ["Book a GP appointment this week and share this result", "Try the guided breathing exercise in the Resources tab today", "Re-screen in 2 weeks to track your progress"];
  return ["Keep your current routines - they are protecting your mental health", "Explore self-help tools in the Resources tab", "Re-screen in 4 to 6 weeks or when your mood shifts"];
}

// ── AGENT 7: FollowUpAgent ───────────────────────────────────────
export interface FollowUpMessage {
  message: string; urgency: 'routine' | 'concerned' | 'urgent';
  suggestRescreening: boolean; checkInQuestion: string;
}

export async function FollowUpAgent(days: number, risk: 'low' | 'moderate' | 'high', context: string): Promise<FollowUpMessage> {
  try {
    const raw = await callGemini(
      `Generate a follow-up check-in for a mental health patient. Return ONLY raw JSON:
{"message":"2 warm sentences","urgency":"routine|concerned|urgent","suggestRescreening":true|false,"checkInQuestion":"one gentle open question"}`,
      `Days since screening: ${days} | Risk: ${risk} | Context: "${context}"`, 0.7, 200
    );
    return extractJSON(raw);
  } catch {
    return { message: `It has been ${days} days since your last check-in. We hope you are doing okay.`, urgency: risk === 'high' ? 'urgent' : risk === 'moderate' ? 'concerned' : 'routine', suggestRescreening: true, checkInQuestion: 'How have you been feeling compared to when we last spoke?' };
  }
}

// ── AGENT 8: FreeTextAgent ───────────────────────────────────────
export async function FreeTextAgent(msg: string, context: string): Promise<string> {
  try {
    return await callGemini(
      `Empathetic mid-screening support. 2 sentences max. Warm, non-clinical. Never diagnose.
If crisis words: direct to Directory tab. Otherwise acknowledge and invite to continue.`,
      `Context: "${context}" | User said: "${msg}"`, 0.7, 120
    );
  } catch { return 'Thank you for sharing that. Please continue when you are ready.'; }
}
