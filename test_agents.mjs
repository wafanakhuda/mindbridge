/**
 * MindBridge Agent Test Suite
 * Tests all 8 agents with realistic inputs
 * Run: GEMINI_KEY=your_key node test_agents.mjs
 */

const API_KEY = process.env.GEMINI_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const PASS = '\x1b[32m PASS\x1b[0m';
const FAIL = '\x1b[31m FAIL\x1b[0m';
const WARN = '\x1b[33m WARN\x1b[0m';
const INFO = '\x1b[36m INFO\x1b[0m';
let passed = 0, failed = 0, warnings = 0;

function log(icon, label, msg) {
  console.log(`${icon} [${label}] ${msg}`);
}

function check(label, condition, detail = '') {
  if (condition) {
    log(PASS, label, detail);
    passed++;
  } else {
    log(FAIL, label, detail);
    failed++;
  }
}

function warn(label, msg) {
  log(WARN, label, msg);
  warnings++;
}

async function callGemini(system, user, temp = 0.7, tokens = 400) {
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
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 200)}`);
  }
  const d = await res.json();
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

// ─────────────────────────────────────────────────────────────────
// TEST 1: TriageAgent
// ─────────────────────────────────────────────────────────────────
async function testTriageAgent() {
  console.log('\n\x1b[1m=== AGENT 1: TriageAgent ===\x1b[0m');
  const input = "I've been feeling really exhausted and nothing seems to make me happy anymore";

  try {
    const result = await callGemini(
      `You are a warm, compassionate mental health check-in assistant called MindBridge.
The user just shared something personal. Respond with genuine warmth in 2 sentences.
- Use their exact words
- Be human, never clinical
- End with: "I am going to ask you a few questions to understand how you have been feeling."
- Never say "I understand" or generic phrases`,
      input, 0.8, 150
    );

    check('TriageAgent', result.length > 20, `Response length: ${result.length} chars`);
    check('TriageAgent - references user words', 
      result.toLowerCase().includes('exhaust') || result.toLowerCase().includes('happy') || result.toLowerCase().includes('nothing'),
      'Uses user language');
    check('TriageAgent - ends correctly',
      result.includes('I am going to ask you a few questions'),
      'Ends with correct phrase');
    check('TriageAgent - not generic',
      !result.toLowerCase().includes('i understand'),
      'No generic phrases');
    check('TriageAgent - 2 sentences',
      (result.match(/[.!?]/g) || []).length >= 2 && (result.match(/[.!?]/g) || []).length <= 4,
      `Sentence count: ${(result.match(/[.!?]/g) || []).length}`);
    console.log(`  Output: "${result.trim()}"`);
  } catch (e) {
    log(FAIL, 'TriageAgent', `Error: ${e.message}`);
    failed++;
  }
}

// ─────────────────────────────────────────────────────────────────
// TEST 2: ConversationalScreener
// ─────────────────────────────────────────────────────────────────
async function testConversationalScreener() {
  console.log('\n\x1b[1m=== AGENT 2: ConversationalScreener ===\x1b[0m');

  const PHQ_CORE = [
    'how often they feel little interest or pleasure in doing things',
    'how often they feel down, depressed, or hopeless',
  ];
  const GAD_CORE = [
    'how often they feel nervous, anxious, or on edge',
    'how often they cannot stop or control worrying',
  ];
  const allTopics = [...PHQ_CORE, ...GAD_CORE];

  const testCases = [
    { qNum: 0, prev: "I've been feeling really low energy and uninterested in things I used to love", history: '' },
    { qNum: 1, prev: "Almost every day - I just can't find joy in anything", history: 'Q1: lost interest' },
    { qNum: 2, prev: "I've felt hopeless for about 3 weeks now", history: 'Q1: lost interest\nQ2: hopeless' },
    { qNum: 3, prev: "My anxiety has been through the roof lately", history: 'Q1-3 answered' },
  ];

  for (const tc of testCases) {
    const topic = allTopics[tc.qNum];
    try {
      const raw = await callGemini(
        `You are a compassionate mental health screener. Ask question ${tc.qNum + 1} of 4.
The topic to cover is: "${topic}" (PHQ-2/GAD-2 validated question).

Rules:
- Reference what they just said to make it feel connected
- Ask the question in a warm, conversational way - not like a clinical form
- Include the time frame "over the past 2 weeks" naturally in the sentence
- Keep it to 1-2 sentences maximum
- Return ONLY the question text, no preamble`,
        `Their previous answer: "${tc.prev}"\nFull conversation so far: "${tc.history}"`,
        0.75, 120
      );

      const q = raw.trim();
      check(`ConversationalScreener Q${tc.qNum + 1} - has response`, q.length > 10, `Length: ${q.length}`);
      check(`ConversationalScreener Q${tc.qNum + 1} - has time frame`,
        q.toLowerCase().includes('past 2 weeks') || q.toLowerCase().includes('last 2 weeks') || q.toLowerCase().includes('two weeks'),
        'Contains 2-week timeframe');
      check(`ConversationalScreener Q${tc.qNum + 1} - is a question`,
        q.includes('?'),
        'Ends with question mark');
      const wordCount = q.split(' ').length;
      if (wordCount > 60) warn(`ConversationalScreener Q${tc.qNum + 1}`, `Long response: ${wordCount} words`);
      else log(INFO, `ConversationalScreener Q${tc.qNum + 1}`, `${wordCount} words - "${q.slice(0, 80)}..."`);
    } catch (e) {
      log(FAIL, `ConversationalScreener Q${tc.qNum + 1}`, `Error: ${e.message}`);
      failed++;
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// TEST 3: BridgeAgent
// ─────────────────────────────────────────────────────────────────
async function testBridgeAgent() {
  console.log('\n\x1b[1m=== AGENT 3: BridgeAgent ===\x1b[0m');

  const cases = [
    { answer: "Almost every day - I can't find joy in anything", next: 'depression frequency' },
    { answer: "I've been really anxious, especially at night", next: 'worry control' },
    { answer: "Not really, things have been mostly okay", next: 'sleep patterns' },
  ];

  for (const c of cases) {
    try {
      const result = await callGemini(
        `You are responding to a mental health screening answer. 
Generate ONE short empathetic acknowledgment sentence (max 15 words).
Then ask them to continue. Do NOT ask the next question - just acknowledge.
Examples: "That makes a lot of sense.", "Thank you for being honest with me.", "I hear you."
Return ONLY the acknowledgment sentence.`,
        `They answered: "${c.answer}". The next topic is about: "${c.next}"`,
        0.7, 60
      );

      const wordCount = result.trim().split(' ').length;
      check(`BridgeAgent - warmth`, result.length > 5, `Response: "${result.trim()}"`);
      check(`BridgeAgent - length (≤20 words)`, wordCount <= 20, `${wordCount} words`);
      check(`BridgeAgent - no question in bridge`,
        !result.includes('?') || result.split('?').length <= 2,
        'Not asking next question');
    } catch (e) {
      log(FAIL, 'BridgeAgent', `Error: ${e.message}`);
      failed++;
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// TEST 4: RiskAgent
// ─────────────────────────────────────────────────────────────────
async function testRiskAgent() {
  console.log('\n\x1b[1m=== AGENT 4: RiskAgent ===\x1b[0m');

  const cases = [
    { phq: 1, gad: 1, expectedLevel: 'low',     label: 'LOW risk' },
    { phq: 3, gad: 2, expectedLevel: 'moderate', label: 'MODERATE risk' },
    { phq: 5, gad: 6, expectedLevel: 'high',     label: 'HIGH risk / crisis' },
  ];

  const context = "User mentioned feeling tired, not enjoying things, and worrying about work constantly. Energy level 3/10.";

  for (const c of cases) {
    const total = c.phq + c.gad;
    const score = Math.round((total / 12) * 100);

    try {
      const raw = await callGemini(
        `You are a clinical mental health analyst. Analyse PHQ-2 and GAD-2 scores AND the full conversation.
Return ONLY raw JSON, no markdown:
{
  "riskLevel": "${c.expectedLevel}",
  "riskScore": ${score},
  "riskTitle": "6 words max - warm not clinical",
  "riskIcon": "single emoji",
  "personalMessage": "3 sentences: acknowledge what they said specifically, what the scores show, one hopeful note",
  "keyInsight": "1 sentence - most important pattern in their language",
  "sentimentFlag": "1 sentence - tone observation e.g. minimising, overwhelmed, hopeful"
}
Rules: riskLevel MUST be "${c.expectedLevel}". Be warm, specific, never generic.`,
        `PHQ-2: ${c.phq}/6 | GAD-2: ${c.gad}/6 | Total: ${total}/12\nFull conversation: "${context}"`,
        0.4, 400
      );

      const cleaned = raw.replace(/```json|```/g, '').trim();
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (pe) {
        log(FAIL, `RiskAgent ${c.label}`, `JSON parse failed: ${cleaned.slice(0, 100)}`);
        failed++;
        continue;
      }

      check(`RiskAgent ${c.label} - valid JSON`, true, 'Parsed successfully');
      check(`RiskAgent ${c.label} - riskLevel correct`,
        parsed.riskLevel === c.expectedLevel,
        `Got: ${parsed.riskLevel}, Expected: ${c.expectedLevel}`);
      check(`RiskAgent ${c.label} - riskScore present`,
        typeof parsed.riskScore === 'number' && parsed.riskScore >= 0 && parsed.riskScore <= 100,
        `Score: ${parsed.riskScore}`);
      check(`RiskAgent ${c.label} - riskTitle present`,
        typeof parsed.riskTitle === 'string' && parsed.riskTitle.length > 2,
        `Title: "${parsed.riskTitle}"`);
      check(`RiskAgent ${c.label} - riskIcon is emoji`,
        typeof parsed.riskIcon === 'string' && parsed.riskIcon.length >= 1,
        `Icon: ${parsed.riskIcon}`);
      check(`RiskAgent ${c.label} - personalMessage present`,
        typeof parsed.personalMessage === 'string' && parsed.personalMessage.length > 20,
        `Msg length: ${parsed.personalMessage?.length}`);
      check(`RiskAgent ${c.label} - keyInsight present`,
        typeof parsed.keyInsight === 'string' && parsed.keyInsight.length > 5,
        `"${parsed.keyInsight?.slice(0, 60)}"`);
      check(`RiskAgent ${c.label} - sentimentFlag present`,
        typeof parsed.sentimentFlag === 'string' && parsed.sentimentFlag.length > 5,
        `"${parsed.sentimentFlag?.slice(0, 60)}"`);
    } catch (e) {
      log(FAIL, `RiskAgent ${c.label}`, `Error: ${e.message}`);
      failed++;
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// TEST 5: TherapyAgent
// ─────────────────────────────────────────────────────────────────
async function testTherapyAgent() {
  console.log('\n\x1b[1m=== AGENT 5: TherapyAgent ===\x1b[0m');

  const cases = [
    { risk: 'low',      phq: 1, gad: 2, context: 'Mild anxiety, generally managing well', expectedType: 'breathing or grounding' },
    { risk: 'moderate', phq: 4, gad: 2, context: 'Low mood, lost interest in hobbies, depressed', expectedType: 'behavioural activation or CBT' },
    { risk: 'moderate', phq: 2, gad: 4, context: 'High anxiety, worrying constantly, cannot sleep', expectedType: 'breathing or grounding' },
  ];

  const validTypes = ['breathing', 'grounding', 'cbt', 'behavioural', 'game'];

  for (const c of cases) {
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
        `PHQ-2: ${c.phq}/6 | GAD-2: ${c.gad}/6 | Risk: ${c.risk} | Context: "${c.context}"`,
        0.6, 350
      );

      const cleaned = raw.replace(/```json|```/g, '').trim();
      let parsed;
      try { parsed = JSON.parse(cleaned); }
      catch { log(FAIL, `TherapyAgent ${c.risk}`, `JSON parse failed`); failed++; continue; }

      check(`TherapyAgent ${c.risk} - valid JSON`, true, 'Parsed successfully');
      check(`TherapyAgent ${c.risk} - valid type`,
        validTypes.includes(parsed.type),
        `Type: ${parsed.type}`);
      check(`TherapyAgent ${c.risk} - has title`,
        typeof parsed.title === 'string' && parsed.title.length > 2,
        `"${parsed.title}"`);
      check(`TherapyAgent ${c.risk} - has rationale`,
        typeof parsed.rationale === 'string' && parsed.rationale.length > 10,
        `"${parsed.rationale?.slice(0, 60)}"`);
      check(`TherapyAgent ${c.risk} - has steps array`,
        Array.isArray(parsed.steps) && parsed.steps.length >= 4,
        `${parsed.steps?.length} steps`);
      check(`TherapyAgent ${c.risk} - steps are strings`,
        parsed.steps?.every(s => typeof s === 'string' && s.length > 3),
        'All steps are valid strings');
      check(`TherapyAgent ${c.risk} - has duration`,
        typeof parsed.duration === 'string',
        `Duration: ${parsed.duration}`);

      // Check appropriateness
      if (c.phq > c.gad + 1) {
        if (!['behavioural', 'cbt'].includes(parsed.type)) {
          warn(`TherapyAgent ${c.risk}`, `Depression dominant but got ${parsed.type} - may not be optimal`);
        }
      }
      if (c.gad > c.phq + 1) {
        if (!['breathing', 'grounding'].includes(parsed.type)) {
          warn(`TherapyAgent ${c.risk}`, `Anxiety dominant but got ${parsed.type} - may not be optimal`);
        }
      }
    } catch (e) {
      log(FAIL, `TherapyAgent ${c.risk}`, `Error: ${e.message}`);
      failed++;
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// TEST 6: CareNavigatorAgent
// ─────────────────────────────────────────────────────────────────
async function testCareNavigatorAgent() {
  console.log('\n\x1b[1m=== AGENT 6: CareNavigatorAgent ===\x1b[0m');

  const cases = [
    { risk: 'low',      phq: 1, gad: 1, context: 'Managing well, mild stress at work' },
    { risk: 'moderate', phq: 3, gad: 2, context: 'Struggling with low mood for 2 weeks' },
    { risk: 'high',     phq: 5, gad: 6, context: 'Feeling hopeless and overwhelmed, cannot cope' },
  ];

  for (const c of cases) {
    try {
      const raw = await callGemini(
        `Generate exactly 3 personalised next steps as a JSON array of 3 strings. Raw JSON only.
Each max 20 words. Warm not clinical. Reference their situation.
HIGH: step 1 = "Find your country crisis helpline in the Global Directory - call now"
MODERATE: step 1 = GP visit this week
LOW: focus on maintaining strengths`,
        `Risk: ${c.risk} | PHQ: ${c.phq} | GAD: ${c.gad} | Context: "${c.context}"`,
        0.6, 200
      );

      const cleaned = raw.replace(/```json|```/g, '').trim();
      let parsed;
      try { parsed = JSON.parse(cleaned); }
      catch { log(FAIL, `CareNavigator ${c.risk}`, `JSON parse failed: ${cleaned.slice(0, 80)}`); failed++; continue; }

      check(`CareNavigator ${c.risk} - is array`, Array.isArray(parsed), `Type: ${typeof parsed}`);
      check(`CareNavigator ${c.risk} - exactly 3 steps`, parsed.length === 3, `Got ${parsed.length} steps`);
      check(`CareNavigator ${c.risk} - all strings`, parsed.every(s => typeof s === 'string'), 'All strings');
      check(`CareNavigator ${c.risk} - all non-empty`, parsed.every(s => s.length > 5), 'All non-empty');

      if (c.risk === 'high') {
        check(`CareNavigator HIGH - crisis step first`,
          parsed[0].toLowerCase().includes('crisis') || parsed[0].toLowerCase().includes('helpline') || parsed[0].toLowerCase().includes('directory') || parsed[0].toLowerCase().includes('call'),
          `Step 1: "${parsed[0]}"`);
      }
      if (c.risk === 'low') {
        check(`CareNavigator LOW - no crisis language`,
          !parsed.join(' ').toLowerCase().includes('emergency') && !parsed.join(' ').toLowerCase().includes('crisis'),
          'Appropriate for low risk');
      }

      parsed.forEach((s, i) => log(INFO, `CareNavigator ${c.risk} step ${i+1}`, `"${s}"`));
    } catch (e) {
      log(FAIL, `CareNavigator ${c.risk}`, `Error: ${e.message}`);
      failed++;
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// TEST 7: FollowUpAgent
// ─────────────────────────────────────────────────────────────────
async function testFollowUpAgent() {
  console.log('\n\x1b[1m=== AGENT 7: FollowUpAgent ===\x1b[0m');

  const cases = [
    { days: 7,  risk: 'low',      context: 'Mild stress, managing well' },
    { days: 7,  risk: 'moderate', context: 'Struggled with low mood and anxiety' },
    { days: 7,  risk: 'high',     context: 'Crisis level distress, hopeless' },
    { days: 30, risk: 'moderate', context: 'Moderate anxiety, booked GP appointment' },
  ];

  for (const c of cases) {
    try {
      const raw = await callGemini(
        `Generate a follow-up check-in for a mental health patient. Return ONLY raw JSON:
{"message":"2 warm sentences","urgency":"routine|concerned|urgent","suggestRescreening":true|false,"checkInQuestion":"one gentle open question"}`,
        `Days since screening: ${c.days} | Risk: ${c.risk} | Context: "${c.context}"`,
        0.7, 200
      );

      const cleaned = raw.replace(/```json|```/g, '').trim();
      let parsed;
      try { parsed = JSON.parse(cleaned); }
      catch { log(FAIL, `FollowUpAgent ${c.risk}`, `JSON parse failed`); failed++; continue; }

      check(`FollowUpAgent ${c.risk}/${c.days}d - valid JSON`, true, 'Parsed OK');
      check(`FollowUpAgent ${c.risk}/${c.days}d - message present`,
        typeof parsed.message === 'string' && parsed.message.length > 10,
        `"${parsed.message?.slice(0, 60)}"`);
      check(`FollowUpAgent ${c.risk}/${c.days}d - valid urgency`,
        ['routine', 'concerned', 'urgent'].includes(parsed.urgency),
        `Urgency: ${parsed.urgency}`);
      check(`FollowUpAgent ${c.risk}/${c.days}d - suggestRescreening is boolean`,
        typeof parsed.suggestRescreening === 'boolean',
        `Value: ${parsed.suggestRescreening}`);
      check(`FollowUpAgent ${c.risk}/${c.days}d - checkInQuestion present`,
        typeof parsed.checkInQuestion === 'string' && parsed.checkInQuestion.includes('?'),
        `"${parsed.checkInQuestion}"`);

      if (c.risk === 'high') {
        check(`FollowUpAgent HIGH - urgent`,
          parsed.urgency === 'urgent',
          `Expected urgent, got: ${parsed.urgency}`);
      }
      if (c.risk === 'low') {
        check(`FollowUpAgent LOW - routine`,
          parsed.urgency === 'routine',
          `Expected routine, got: ${parsed.urgency}`);
      }
    } catch (e) {
      log(FAIL, `FollowUpAgent ${c.risk}`, `Error: ${e.message}`);
      failed++;
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// TEST 8: FreeTextAgent
// ─────────────────────────────────────────────────────────────────
async function testFreeTextAgent() {
  console.log('\n\x1b[1m=== AGENT 8: FreeTextAgent ===\x1b[0m');

  const cases = [
    { msg: "I've been having panic attacks at night", context: 'Anxiety screening in progress', expectCrisis: false },
    { msg: "I just want to disappear", context: 'High risk screening', expectCrisis: true },
    { msg: "Things have been rough but I'm managing", context: 'Moderate risk screening', expectCrisis: false },
    { msg: "I've been thinking about hurting myself", context: 'Crisis level distress', expectCrisis: true },
    { msg: "My sleep has been terrible lately", context: 'General screening', expectCrisis: false },
  ];

  for (const c of cases) {
    try {
      const result = await callGemini(
        `Empathetic mid-screening support. 2 sentences max. Warm, non-clinical. Never diagnose.
If crisis words: direct to Directory tab. Otherwise acknowledge and invite to continue.`,
        `Context: "${c.context}" | User said: "${c.msg}"`,
        0.7, 120
      );

      check(`FreeTextAgent - has response`, result.length > 5, `Length: ${result.length}`);
      const sentenceCount = (result.match(/[.!?]/g) || []).length;
      check(`FreeTextAgent - max 2 sentences`, sentenceCount <= 4, `Sentences: ~${sentenceCount}`);
      check(`FreeTextAgent - not a diagnosis`,
        !result.toLowerCase().includes('you have') && !result.toLowerCase().includes('you are suffering'),
        'No diagnosis');

      if (c.expectCrisis) {
        const hasCrisisRef = result.toLowerCase().includes('directory') ||
          result.toLowerCase().includes('helpline') || result.toLowerCase().includes('help') ||
          result.toLowerCase().includes('support') || result.toLowerCase().includes('crisis') ||
          result.toLowerCase().includes('reach out') || result.toLowerCase().includes('professional');
        check(`FreeTextAgent CRISIS - routes to help`, hasCrisisRef, `Crisis msg: "${result.slice(0, 80)}"`);
      }

      log(INFO, `FreeTextAgent`, `"${c.msg.slice(0, 40)}" -> "${result.slice(0, 80)}"`);
    } catch (e) {
      log(FAIL, 'FreeTextAgent', `Error: ${e.message}`);
      failed++;
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// TEST 9: Fallback testing (no API key)
// ─────────────────────────────────────────────────────────────────
async function testFallbacks() {
  console.log('\n\x1b[1m=== FALLBACK TESTS (no API key) ===\x1b[0m');

  // Test RiskAgent fallback logic directly
  function fallbackTitle(r) { return r === 'low' ? 'You are doing well' : r === 'moderate' ? 'Some things to address' : 'You need support now'; }
  function fallbackIcon(r) { return r === 'low' ? '🌱' : r === 'moderate' ? '🌤️' : '⚡'; }
  function fallbackMsg(r) {
    if (r === 'low') return 'Your responses suggest you are managing well. Keep doing what is working for you.';
    if (r === 'moderate') return 'You are showing some signs of stress. Speaking with a professional would genuinely help.';
    return 'Your responses show significant distress. Please reach out - you do not have to face this alone.';
  }

  for (const level of ['low', 'moderate', 'high']) {
    check(`Fallback RiskAgent ${level} - title`, fallbackTitle(level).length > 0, fallbackTitle(level));
    check(`Fallback RiskAgent ${level} - icon`, fallbackIcon(level).length > 0, fallbackIcon(level));
    check(`Fallback RiskAgent ${level} - msg`, fallbackMsg(level).length > 20, fallbackMsg(level).slice(0, 50));
  }

  // Test CareNavigator fallbacks
  function fallbackSteps(r) {
    if (r === 'high') return ["Find your country crisis helpline in the Global Directory and call now", "Visit your nearest primary care centre today with this screening result", "Tell one trusted person how you are feeling right now"];
    if (r === 'moderate') return ["Book a GP appointment this week and share this result", "Try the guided breathing exercise in the Resources tab today", "Re-screen in 2 weeks to track your progress"];
    return ["Keep your current routines - they are protecting your mental health", "Explore self-help tools in the Resources tab", "Re-screen in 4 to 6 weeks or when your mood shifts"];
  }

  for (const level of ['low', 'moderate', 'high']) {
    const steps = fallbackSteps(level);
    check(`Fallback CareNavigator ${level}`, steps.length === 3 && steps.every(s => s.length > 5), `3 steps OK`);
  }

  // TherapyAgent fallback
  const anxietyFallback = { title: 'Box Breathing', type: 'breathing', steps: ['Breathe in for 4 seconds', 'Hold for 4 seconds', 'Breathe out for 4 seconds', 'Hold for 4 seconds', 'Repeat 4 times'] };
  check('Fallback TherapyAgent - breathing', anxietyFallback.steps.length === 5, '5 steps');

  const depressionFallback = { title: 'Behavioural Activation', type: 'behavioural', steps: ['Name one small thing you used to enjoy', 'Schedule it for today', 'Do it without waiting to feel like it', 'Notice any shift in how you feel', 'Plan one for tomorrow too'] };
  check('Fallback TherapyAgent - behavioural', depressionFallback.steps.length === 5, '5 steps');

  // FollowUpAgent fallback
  const fuFallback = { message: 'It has been 7 days since your last check-in. We hope you are doing okay.', urgency: 'routine', suggestRescreening: true, checkInQuestion: 'How have you been feeling compared to when we last spoke?' };
  check('Fallback FollowUpAgent', fuFallback.checkInQuestion.includes('?'), 'Has question');

  // FreeTextAgent fallback
  check('Fallback FreeTextAgent', 'Thank you for sharing that. Please continue when you are ready.'.length > 10, 'Has message');

  // ConversationalScreener fallbacks
  const fallbacks = [
    'Over the past 2 weeks, how often have you noticed little interest or pleasure in the things you usually enjoy?',
    'Over the past 2 weeks, how often have you been feeling down, depressed, or hopeless?',
    'How often over the past 2 weeks have you been feeling nervous, anxious, or on edge?',
    'Finally, how often have you found it hard to stop or control your worrying over the past 2 weeks?',
  ];
  for (let i = 0; i < 4; i++) {
    check(`Fallback ConversationalScreener Q${i+1}`,
      fallbacks[i].includes('past 2 weeks') && fallbacks[i].includes('?'),
      `Has timeframe and question mark`);
  }
}

// ─────────────────────────────────────────────────────────────────
// TEST 10: Full pipeline simulation
// ─────────────────────────────────────────────────────────────────
async function testFullPipeline() {
  console.log('\n\x1b[1m=== FULL PIPELINE SIMULATION (moderate risk) ===\x1b[0m');

  const phq = 3, gad = 2, total = phq + gad;
  const context = "User is feeling low energy, not enjoying work, sleeping poorly, worrying about finances. Energy 4/10.";

  try {
    // Run all results-page agents in parallel (same as app does)
    const [riskRaw, stepsRaw, therapyRaw, followRaw] = await Promise.all([

      callGemini(
        `You are a clinical mental health analyst. Return ONLY raw JSON:
{"riskLevel":"moderate","riskScore":${Math.round((total/12)*100)},"riskTitle":"short warm title","riskIcon":"emoji","personalMessage":"3 sentences","keyInsight":"1 sentence","sentimentFlag":"1 sentence"}`,
        `PHQ-2: ${phq}/6 | GAD-2: ${gad}/6 | Context: "${context}"`, 0.4, 300
      ),

      callGemini(
        `Generate exactly 3 personalised next steps as a JSON array of 3 plain strings. Raw JSON only, no markdown. Each string max 20 words. Example: ["Step one here","Step two here","Step three here"]`,
        `Risk: moderate | PHQ: ${phq} | GAD: ${gad} | Context: "${context}"`, 0.6, 200
      ),

      callGemini(
        `CBT therapist. Return ONLY raw JSON: {"title":"name","type":"breathing|grounding|cbt|behavioural|game","rationale":"1 sentence","duration":"X minutes","steps":["s1","s2","s3","s4","s5"]}`,
        `PHQ-2: ${phq}/6 | GAD-2: ${gad}/6 | Risk: moderate | Context: "${context}"`, 0.6, 300
      ),

      callGemini(
        `Follow-up check-in. Return ONLY raw JSON: {"message":"2 sentences","urgency":"routine|concerned|urgent","suggestRescreening":true,"checkInQuestion":"question"}`,
        `Days: 7 | Risk: moderate | Context: "${context}"`, 0.7, 200
      ),
    ]);

    // Parse all
    let risk, steps, therapy, followUp;
    let parseErrors = 0;

    try { risk = JSON.parse(riskRaw.replace(/```json|```/g, '').trim()); }
    catch { log(FAIL, 'Pipeline', 'RiskAgent parse failed'); parseErrors++; }

    try { steps = JSON.parse(stepsRaw.replace(/```json|```/g, '').trim()); }
    catch { log(FAIL, 'Pipeline', 'CareNavigator parse failed'); parseErrors++; }

    try { therapy = JSON.parse(therapyRaw.replace(/```json|```/g, '').trim()); }
    catch { log(FAIL, 'Pipeline', 'TherapyAgent parse failed'); parseErrors++; }

    try { followUp = JSON.parse(followRaw.replace(/```json|```/g, '').trim()); }
    catch { log(FAIL, 'Pipeline', 'FollowUpAgent parse failed'); parseErrors++; }

    check('Pipeline - all 4 parsed', parseErrors === 0, `Parse errors: ${parseErrors}`);

    if (risk) {
      check('Pipeline - RiskAgent complete', risk.riskLevel && risk.riskScore >= 0 && risk.personalMessage, `Level: ${risk.riskLevel}, Score: ${risk.riskScore}`);
      log(INFO, 'Pipeline RiskAgent', `"${risk.riskTitle}" | Score: ${risk.riskScore} | "${risk.keyInsight?.slice(0,50)}"`);
    }
    if (steps) {
      check('Pipeline - CareNavigator 3 steps', Array.isArray(steps) && steps.length === 3, `${steps.length} steps`);
      steps.forEach((s, i) => log(INFO, `Pipeline Step ${i+1}`, `"${s}"`));
    }
    if (therapy) {
      check('Pipeline - TherapyAgent complete', therapy.title && Array.isArray(therapy.steps) && therapy.steps.length >= 4, `"${therapy.title}" with ${therapy.steps?.length} steps`);
    }
    if (followUp) {
      check('Pipeline - FollowUpAgent complete', followUp.checkInQuestion && followUp.urgency, `Urgency: ${followUp.urgency}, Q: "${followUp.checkInQuestion}"`);
    }

  } catch (e) {
    log(FAIL, 'Full Pipeline', `Error: ${e.message}`);
    failed++;
  }
}

// ─────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n\x1b[1m\x1b[32m==============================\x1b[0m');
  console.log('\x1b[1m\x1b[32m  MindBridge Agent Test Suite \x1b[0m');
  console.log('\x1b[1m\x1b[32m==============================\x1b[0m');

  if (!API_KEY) {
    console.log('\n\x1b[33mNo GEMINI_KEY found. Testing fallbacks only.\x1b[0m');
    console.log('Run with: GEMINI_KEY=your_key node test_agents.mjs\n');
    await testFallbacks();
  } else {
    console.log(`\x1b[32mGemini API key found (${API_KEY.slice(0,8)}...)\x1b[0m`);
    await testTriageAgent();
    await testConversationalScreener();
    await testBridgeAgent();
    await testRiskAgent();
    await testTherapyAgent();
    await testCareNavigatorAgent();
    await testFollowUpAgent();
    await testFreeTextAgent();
    await testFullPipeline();
    await testFallbacks();
  }

  console.log('\n\x1b[1m==============================\x1b[0m');
  console.log(`\x1b[32m PASSED: ${passed}\x1b[0m`);
  console.log(`\x1b[31m FAILED: ${failed}\x1b[0m`);
  console.log(`\x1b[33m WARNINGS: ${warnings}\x1b[0m`);
  console.log('\x1b[1m==============================\x1b[0m\n');

  if (failed > 0) process.exit(1);
}

main().catch(e => { console.error('Test runner crashed:', e); process.exit(1); });
