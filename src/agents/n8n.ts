/**
 * MindBridge — n8n Integration Layer
 *
 * When N8N_WEBHOOK_URL is set, ALL agent calls go through n8n
 * which orchestrates Gemini + DB + follow-up automatically.
 *
 * When not set, falls back to direct Gemini calls (gemini.ts)
 * so the app always works.
 */

const N8N_URL = (import.meta as any).env?.VITE_N8N_WEBHOOK_URL || '';

export const usingN8n = !!N8N_URL;

// ─────────────────────────────────────────────────────────
// Call n8n triage webhook — used on first user message
// ─────────────────────────────────────────────────────────
export async function n8nTriage(message: string, userId = 'anon'): Promise<string> {
  const res = await fetch(N8N_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      message,
      channel: 'web',
      intent: 'triage_intro'
    })
  });
  if (!res.ok) throw new Error('n8n triage failed');
  const data = await res.json();
  return data.triageResponse || data.message || '';
}

// ─────────────────────────────────────────────────────────
// Call n8n results webhook — after all 4 questions answered
// Returns full risk analysis + personalised steps
// ─────────────────────────────────────────────────────────
export async function n8nAnalyse(payload: {
  phqScore: number;
  gadScore: number;
  userContext: string;
  riskLevel: 'low' | 'moderate' | 'high';
  userId?: string;
}): Promise<{
  riskLevel: 'low' | 'moderate' | 'high';
  riskTitle: string;
  riskIcon: string;
  personalMessage: string;
  keyInsight: string;
  nextSteps: string[];
}> {
  const res = await fetch(N8N_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      channel: 'web',
      intent: 'analyse_results'
    })
  });
  if (!res.ok) throw new Error('n8n analyse failed');
  return res.json();
}

// ─────────────────────────────────────────────────────────
// Call n8n free text webhook — for mid-screening messages
// ─────────────────────────────────────────────────────────
export async function n8nFreeText(message: string, context: string): Promise<string> {
  const res = await fetch(N8N_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      context,
      channel: 'web',
      intent: 'free_text'
    })
  });
  if (!res.ok) throw new Error('n8n free text failed');
  const data = await res.json();
  return data.response || data.message || '';
}
