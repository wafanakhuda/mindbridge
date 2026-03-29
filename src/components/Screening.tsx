import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Copy, Check, BookOpen, Calendar, Sparkles, Bot, RefreshCw, Phone } from 'lucide-react';
import Disclaimer from './Disclaimer';
import {
  TriageAgent, ConversationalScreener, BridgeAgent,
  RiskAgent, TherapyAgent, CareNavigatorAgent, FollowUpAgent, FreeTextAgent,
  hasApiKey, type RiskAnalysis, type TherapyIntervention,
} from '../agents/gemini';
import AppointmentBooking from './AppointmentBooking';

// ─────────────────────────────────────────────────────────────────
// CHATGPT HISTORY PROMPT
// ─────────────────────────────────────────────────────────────────
const CHATGPT_PROMPT = `Please summarise my mental health history from our conversations. Include:
1. Main concerns and symptoms I mentioned (anxiety, depression, sleep, stress, mood)
2. How long I have been experiencing these
3. Triggers or difficult situations I described
4. Coping strategies I mentioned trying
5. Significant life events or stressors I shared
6. How my mood or symptoms changed over time

Be concise and clinical. This will be used by a mental health screening tool to personalise my results. Do not give advice, just summarise what I told you.`;

// ─────────────────────────────────────────────────────────────────
// WIDGETS
// ─────────────────────────────────────────────────────────────────
function MoodWheel({ onSelect, disabled }: { onSelect: (m: string, v: number) => void; disabled: boolean }) {
  const moods = [
    { label: 'Great', emoji: '😄', val: 0 },
    { label: 'Okay', emoji: '🙂', val: 1 },
    { label: 'Meh', emoji: '😐', val: 2 },
    { label: 'Low', emoji: '😟', val: 3 },
    { label: 'Struggling', emoji: '😔', val: 4 },
    { label: 'Not coping', emoji: '😢', val: 5 },
  ];
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="w-full mt-2">
      <p className="text-xs text-[#6b7265] mb-2 text-center">Tap the one that fits right now</p>
      <div className="grid grid-cols-3 gap-2">
        {moods.map(m => (
          <motion.button key={m.label} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            disabled={disabled || picked !== null}
            onClick={() => { setPicked(m.label); onSelect(m.label, m.val); }}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all
              ${picked === m.label ? 'border-[#4a7c59] bg-[#e8f5e9]' : 'border-[#d8d0c4] bg-white hover:border-[#4a7c59]/60'}
              ${(disabled || (picked && picked !== m.label)) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-xs font-semibold text-[#2c3028]">{m.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ThoughtBubble({ onSelect, disabled }: { onSelect: (v: string) => void; disabled: boolean }) {
  const thoughts = [
    "I can't stop worrying", "I feel empty inside", "I'm exhausted all the time",
    "I feel disconnected", "I can't concentrate", "I feel hopeless",
    "I'm more irritable", "I feel physically tense", "I'm managing okay", "None of these"
  ];
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const toggle = (t: string) => {
    if (submitted || disabled) return;
    setSelected(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);
  };
  const submit = () => {
    if (submitted) return;
    setSubmitted(true);
    onSelect(selected.length > 0 ? selected.join(', ') : 'None of these apply to me');
  };
  return (
    <div className="w-full mt-2">
      <p className="text-xs text-[#6b7265] mb-2 text-center">Select all that feel true for you (pick as many as you like)</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {thoughts.map(t => (
          <motion.button key={t} whileTap={{ scale: 0.96 }}
            disabled={submitted || disabled}
            onClick={() => toggle(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all
              ${selected.includes(t) ? 'bg-[#4a7c59] border-[#4a7c59] text-white' : 'bg-white border-[#d8d0c4] text-[#2c3028] hover:border-[#4a7c59]'}
              ${(submitted || disabled) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
            {t}
          </motion.button>
        ))}
      </div>
      {!submitted && (
        <motion.button whileTap={{ scale: 0.97 }} onClick={submit}
          className="w-full bg-[#4a7c59] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#3a6b3e] transition-all">
          {selected.length > 0 ? `These ${selected.length} resonate with me` : 'None of these apply'}
        </motion.button>
      )}
    </div>
  );
}

function EnergySlider({ onSelect, disabled }: { onSelect: (v: string) => void; disabled: boolean }) {
  const [val, setVal] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const labels = ['', 'Completely drained', 'Very low', 'Low', 'Below average', 'Average', 'Okay', 'Good', 'Very good', 'Energised', 'Full of energy'];
  return (
    <div className="w-full mt-2 bg-white rounded-2xl p-4 border border-[#d8d0c4]">
      <p className="text-xs text-[#6b7265] mb-3 text-center">Slide to show your energy level this past week</p>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">😴</span>
        <input type="range" min="1" max="10" value={val} disabled={submitted || disabled}
          onChange={e => setVal(+e.target.value)}
          className="flex-1 accent-[#4a7c59] cursor-pointer" />
        <span className="text-lg">⚡</span>
      </div>
      <p className="text-center text-sm font-bold text-[#2c3028] mb-3">{val}/10 - {labels[val]}</p>
      {!submitted && (
        <motion.button whileTap={{ scale: 0.97 }}
          onClick={() => { setSubmitted(true); onSelect(`${val}/10 (${labels[val]})`); }}
          className="w-full bg-[#4a7c59] text-white py-2 rounded-xl text-sm font-bold hover:bg-[#3a6b3e] transition-all">
          That is my energy level
        </motion.button>
      )}
    </div>
  );
}

function SleepCheck({ onSelect, disabled }: { onSelect: (v: string) => void; disabled: boolean }) {
  const opts = ['Less than 4 hrs', '4 to 5 hrs', '5 to 6 hrs', '6 to 7 hrs', '7 to 8 hrs', '8 or more hrs'];
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="w-full mt-2">
      <p className="text-xs text-[#6b7265] mb-2 text-center">How many hours are you sleeping most nights?</p>
      <div className="grid grid-cols-2 gap-2">
        {opts.map(o => (
          <motion.button key={o} whileTap={{ scale: 0.97 }}
            disabled={disabled || picked !== null}
            onClick={() => { setPicked(o); onSelect(o); }}
            className={`py-2.5 rounded-xl border-2 text-xs font-semibold transition-all text-center
              ${picked === o ? 'bg-[#4a7c59] border-[#4a7c59] text-white' : 'bg-white border-[#d8d0c4] text-[#2c3028] hover:border-[#4a7c59]'}
              ${(disabled || (picked && picked !== o)) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
            {o}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ChatGptOptional({ copied, setCopied, chatGptText, setChatGptText, chatGptAdded, onSkip, onAdd, disabled }: any) {
  const [expanded, setExpanded] = useState(false);
  const [done, setDone] = useState(chatGptAdded);

  if (done) return null;

  return (
    <div className="w-full mt-2 space-y-2">
      {!expanded ? (
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.97 }} disabled={disabled}
            onClick={() => setExpanded(true)}
            className="flex-1 py-2.5 rounded-xl border-2 border-[#10a37f]/40 bg-[#f0fdf9] text-[#059669] text-xs font-bold hover:border-[#10a37f] transition-all flex items-center justify-center gap-1.5">
            🤖 Add ChatGPT history
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} disabled={disabled}
            onClick={() => { setDone(true); onSkip(); }}
            className="flex-1 py-2.5 rounded-xl border-2 border-[#d8d0c4] bg-white text-[#6b7265] text-xs font-bold hover:border-[#4a7c59] hover:text-[#4a7c59] transition-all">
            Skip
          </motion.button>
        </div>
      ) : (
        <div className="bg-[#f0fdf9] border-2 border-[#10a37f]/30 rounded-2xl p-3 space-y-3">
          <div className="text-xs font-bold text-[#059669]">Step 1 - Copy this prompt into ChatGPT:</div>
          <div className="bg-white rounded-xl border border-[#bbf7d0] p-2.5">
            <pre className="text-[10px] text-[#2c3028] whitespace-pre-wrap font-mono leading-relaxed">{`Please summarise my mental health history from our conversations. Include:
1. Main concerns and symptoms I mentioned
2. How long I have been experiencing these
3. Triggers or difficult situations I described
4. Coping strategies I mentioned trying
5. Significant life events or stressors I shared

Be concise and clinical. Do not give advice, just summarise.`}</pre>
          </div>
          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => { navigator.clipboard.writeText(`Please summarise my mental health history from our conversations. Include:\n1. Main concerns and symptoms I mentioned\n2. How long I have been experiencing these\n3. Triggers or difficult situations I described\n4. Coping strategies I mentioned trying\n5. Significant life events or stressors I shared\n\nBe concise and clinical. Do not give advice, just summarise.`); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
            className="w-full flex items-center justify-center gap-2 bg-[#10a37f] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#059669] transition-all">
            {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Prompt</>}
          </motion.button>
          <div className="text-xs font-bold text-[#6b7265]">Step 2 - Paste ChatGPT's summary here:</div>
          <textarea value={chatGptText} onChange={e => setChatGptText(e.target.value)}
            placeholder="Paste ChatGPT's summary here..."
            rows={3}
            className="w-full bg-white border-2 border-[#bbf7d0] rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#10a37f] resize-none placeholder:text-[#a3a89f] transition-all" />
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.97 }} disabled={!chatGptText.trim() || disabled}
              onClick={() => { setDone(true); onAdd(); }}
              className="flex-1 py-2.5 rounded-xl bg-[#4a7c59] disabled:bg-[#d8d0c4] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5">
              <Check size={12} /> Add to screening
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} disabled={disabled}
              onClick={() => { setDone(true); onSkip(); }}
              className="flex-1 py-2.5 rounded-xl border-2 border-[#d8d0c4] bg-white text-[#6b7265] text-xs font-bold hover:border-[#4a7c59] transition-all">
              Skip
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

function ScaleQuestion({ onSelect, disabled }: { onSelect: (o: { text: string; val: number }) => void; disabled: boolean }) {
  const opts = [
    { text: 'Not at all', emoji: '😊', val: 0, color: 'border-[#4a7c59] hover:bg-[#e8f5e9]' },
    { text: 'Several days', emoji: '😐', val: 1, color: 'border-[#c4a040] hover:bg-[#fff8e1]' },
    { text: 'More than half the days', emoji: '😟', val: 2, color: 'border-[#d4843a] hover:bg-[#fff3e0]' },
    { text: 'Nearly every day', emoji: '😔', val: 3, color: 'border-[#c4605a] hover:bg-[#fce4ec]' },
  ];
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="w-full mt-2 space-y-2">
      {opts.map(o => (
        <motion.button key={o.text} whileTap={{ scale: 0.98 }}
          disabled={disabled || picked !== null}
          onClick={() => { setPicked(o.val); onSelect(o); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 bg-white transition-all text-left
            ${picked === o.val ? 'border-[#4a7c59] bg-[#e8f5e9]' : o.color}
            ${(disabled || (picked !== null && picked !== o.val)) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
          <span className="text-xl">{o.emoji}</span>
          <span className="font-semibold text-sm text-[#2c3028]">{o.text}</span>
        </motion.button>
      ))}
    </div>
  );
}

// Breathing mini-game during mid-screening break
function MiniBreathing({ onDone, disabled }: { onDone: () => void; disabled: boolean }) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);
  const phases = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
  const colors = ['#4a7c59', '#7baec8', '#d4843a', '#c4a040'];
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          setPhase(p => {
            const next = (p + 1) % 4;
            if (next === 0) setCycles(cy => cy + 1);
            return next;
          });
          return 4;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, phase]);

  if (cycles >= 2) {
    return (
      <div className="w-full mt-2 bg-white rounded-2xl p-4 border border-[#d8d0c4] text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-bold text-[#4a7c59] text-sm mb-3">Well done - 2 cycles complete!</p>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onDone}
          className="bg-[#4a7c59] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#3a6b3e] transition-all">
          Continue the check-in
        </motion.button>
      </div>
    );
  }

  return (
    <div className="w-full mt-2 bg-white rounded-2xl p-4 border border-[#d8d0c4] text-center">
      <p className="text-xs text-[#6b7265] mb-3">Box breathing - a quick 4-4-4-4 technique to ground yourself</p>
      <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
        <motion.div className="absolute inset-0 rounded-full opacity-20"
          animate={{ scale: running ? (phase % 2 === 0 ? 1.4 : 0.8) : 1 }}
          transition={{ duration: 3.5, ease: 'easeInOut' }}
          style={{ backgroundColor: colors[phase] }} />
        <motion.div className="absolute w-16 h-16 rounded-full opacity-40"
          animate={{ scale: running ? (phase % 2 === 0 ? 1.3 : 0.7) : 1 }}
          transition={{ duration: 3.5, ease: 'easeInOut' }}
          style={{ backgroundColor: colors[phase] }} />
        <div className="relative z-10 text-center">
          <div className="font-serif text-2xl font-bold text-[#2c3028]">{running ? count : '·'}</div>
          <div className="text-xs text-[#6b7265]">{running ? phases[phase] : 'Ready'}</div>
        </div>
      </div>
      <p className="text-xs text-[#6b7265] mb-3">Cycles: {cycles}/2</p>
      {!running ? (
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setRunning(true)}
          className="bg-[#4a7c59] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#3a6b3e] transition-all">
          Start breathing
        </motion.button>
      ) : (
        <button onClick={() => { clearInterval(intervalRef.current); setRunning(false); }}
          className="text-xs text-[#6b7265] hover:text-[#2c3028] underline">Pause</button>
      )}
      <div className="mt-2">
        <button onClick={onDone} className="text-xs text-[#6b7265] hover:underline">Skip - continue check-in</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN SCREENING COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function Screening({ setTab, currentUser }: { setTab?: (tab: string) => void; currentUser?: any }) {
  const [phase, setPhase]         = useState<'start' | 'chat' | 'results'>('start');
  const [messages, setMessages]   = useState<any[]>([]);
  const [isTyping, setIsTyping]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [freeText, setFreeText]   = useState('');

  // ChatGPT panel
  const [chatGptText, setChatGptText]         = useState('');
  const [chatGptAdded, setChatGptAdded]       = useState(false);
  const [copied, setCopied]                   = useState(false);

  // Use refs for values needed inside async handlers to avoid stale closure
  const qIdxRef    = useRef(0);  // Current question 0-3
  const phqRef     = useRef(0);  // Running PHQ score
  const gadRef     = useRef(0);  // Running GAD score
  const logRef     = useRef(''); // Full conversation log
  const contextRef = useRef(''); // User context summary
  const chatGptRef = useRef(''); // ChatGPT history text

  // Final scores for Results
  const [finalScores, setFinalScores] = useState({ phq: 0, gad: 0 });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Keep chatGptRef in sync
  useEffect(() => { chatGptRef.current = chatGptText; }, [chatGptText]);

  const addBot = useCallback((text: string, widget?: string) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'bot', text, widget }]);
  }, []);

  const addUser = useCallback((text: string) => {
    setMessages(prev => {
      const m = [...prev];
      // Disable any active widgets in previous messages
      if (m.length > 0) m[m.length - 1] = { ...m[m.length - 1], widgetDone: true };
      return [...m, { id: Date.now() + Math.random(), sender: 'user', text }];
    });
    logRef.current += `\nUser: ${text}`;
  }, []);

  const typing = (ms = 900) => new Promise<void>(res => {
    setIsTyping(true);
    setTimeout(() => { setIsTyping(false); res(); }, ms);
  });

  // ── PHASE: start chat ────────────────────────────────────────
  const startChat = async () => {
    contextRef.current = chatGptRef.current ? `ChatGPT history: ${chatGptRef.current}` : '';
    setPhase('chat');
    await typing(600);
    addBot("Hello 👋 I am glad you are here. Let me check in with you. How are you feeling today?", 'moodwheel');
  };

  // ── WIDGET: mood wheel ───────────────────────────────────────
  const handleMood = async (mood: string, val: number) => {
    addUser(`I am feeling ${mood}`);
    contextRef.current += `. Mood: ${mood} (${val}/5)`;

    // TriageAgent - Agent 1
    setIsLoading(true);
    await typing(600);
    const ctx = chatGptRef.current
      ? `User feels "${mood}". Background: ${chatGptRef.current}`
      : `User feels "${mood}"`;
    const triage = await TriageAgent(ctx);
    setIsLoading(false);

    if (triage) {
      addBot(triage);
      await typing(500);
    }

    addBot("To help me understand you better, which of these thoughts feel true for you right now?", 'thoughtbubble');
  };

  // ── WIDGET: thought bubble ───────────────────────────────────
  const handleThoughts = async (thoughts: string) => {
    addUser(thoughts);
    contextRef.current += `. Thoughts: ${thoughts}`;

    await typing(600);
    // Offer optional ChatGPT history here - mid-screening, not at the start
    addBot(
      "Thank you for sharing that. One optional step before the questions - if you have spoken to ChatGPT about your mental health before, you can add that history to make your results more personalised. Or just skip and continue.",
      'chatgpt-optional'
    );
  };

  // ── WIDGET: ChatGPT optional (skip or add) ───────────────────
  const handleChatGptSkip = async () => {
    addUser('Skip - continue to questions');
    await typing(400);
    addBot("No problem at all. Let me ask you a few questions - first, how has your energy been lately?", 'energyslider');
  };

  const handleChatGptAdd = async () => {
    setChatGptAdded(true);
    contextRef.current = `ChatGPT history: ${chatGptRef.current}. ` + contextRef.current;
    addUser('I have added my ChatGPT history');
    await typing(400);
    addBot("Thank you - I will use that context to personalise your results. Now, how has your energy been lately?", 'energyslider');
  };

  // ── WIDGET: energy slider ────────────────────────────────────
  const handleEnergy = async (energy: string) => {
    addUser(`Energy: ${energy}`);
    contextRef.current += `. Energy: ${energy}`;
    await typing(400);
    await askQuestion(0);
  };

  // ── ASK NEXT QUESTION (non-linear via ConversationalScreener) ─
  const askQuestion = async (idx: number) => {
    qIdxRef.current = idx;
    setIsLoading(true);

    const lastUserLine = logRef.current.split('\n').filter(l => l.startsWith('User:')).slice(-1)[0] || '';
    // Agent 2: ConversationalScreener generates personalised question based on previous answer
    const result = await ConversationalScreener(idx, lastUserLine, logRef.current, chatGptRef.current);
    setIsLoading(false);

    await typing(500);
    addBot(result.question, 'scale');
  };

  // ── WIDGET: scale answer ─────────────────────────────────────
  const handleScale = async (option: { text: string; val: number }) => {
    const idx = qIdxRef.current; // read from ref - no stale closure
    addUser(option.text);

    // Update running scores via refs (no stale closure)
    if (idx < 2) phqRef.current += option.val;
    else gadRef.current += option.val;

    logRef.current += `\nQ${idx + 1} (${idx < 2 ? 'PHQ' : 'GAD'}): ${option.text} (${option.val})`;

    const next = idx + 1;

    if (next < 4) {
      const topics = ['feelings of low mood', 'feelings of anxiety', 'ability to stop worrying'];

      // Agent 3: BridgeAgent - empathetic acknowledgment
      setIsLoading(true);
      const bridge = await BridgeAgent(option.text, topics[idx] || 'wellbeing');
      setIsLoading(false);

      if (bridge) {
        await typing(400);
        addBot(bridge);
      }

      // Mid-way break: mini breathing game + sleep check after Q2
      if (next === 2) {
        await typing(400);
        addBot("You are doing great. Before the final two questions, would you like to try a quick breathing exercise?", 'breathing');
      } else {
        await askQuestion(next);
      }
    } else {
      // All 4 done
      await typing(800);
      addBot("Thank you for sharing all of that. It takes courage to be honest about how you are feeling. Let me look at everything you told me...");
      await typing(2200);
      setFinalScores({ phq: phqRef.current, gad: gadRef.current });
      setPhase('results');
    }
  };

  // ── WIDGET: breathing done ───────────────────────────────────
  const handleBreathingDone = async () => {
    addUser("Done with breathing");
    await typing(300);
    addBot("How many hours are you sleeping most nights?", 'sleep');
  };

  // ── WIDGET: sleep ────────────────────────────────────────────
  const handleSleep = async (sleep: string) => {
    addUser(`Sleeping about ${sleep}`);
    contextRef.current += `. Sleep: ${sleep}`;
    await typing(300);
    await askQuestion(2);
  };

  // ── FREE TEXT ────────────────────────────────────────────────
  const handleFreeText = async () => {
    const text = freeText.trim();
    if (!text || isLoading) return;
    setFreeText('');
    addUser(text);
    setIsLoading(true);
    await typing(700);

    // Empathetic response with gentle redirect
    const reply = await FreeTextAgent(text, contextRef.current + ' ' + logRef.current);
    setIsLoading(false);
    addBot(reply);

    // Resume screening after response - only if mid-questions (not before Q1 or after all 4 done)
    if (qIdxRef.current > 0 && qIdxRef.current < 4) {
      await typing(1400);
      addBot('Let me continue where we left off.');
      await typing(500);
      await askQuestion(qIdxRef.current);
    } else if (qIdxRef.current === 0) {
      // Before questions started - gently prompt to continue with widgets
      await typing(1400);
      addBot('Whenever you are ready, please continue with the check-in above.');
    }
    // If qIdxRef.current === 4, all done - no redirect needed
  };

  const formatText = (text: string) =>
    text.split(/(\*\*.*?\*\*)/g).map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} className="font-bold text-[#2d5a45]">{p.slice(2, -2)}</strong>
        : <span key={i}>{p}</span>
    );

  // ─────────────────────────────────────────────────────────────
  // PHASE: CHATGPT PANEL
  // ─────────────────────────────────────────────────────────────
  if (phase === 'start') {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <Disclaimer />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] border border-[#d8d0c4] shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-br from-[#4a7c59] to-[#3a6b3e] p-8 text-white text-center">
            <div className="text-5xl mb-3">🌿</div>
            <h2 className="font-serif text-2xl font-bold mb-2">Mental Health Check-In</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              A warm, conversational check-in using validated PHQ-2 and GAD-2 screening tools.
              Each question adapts to your previous answer.
            </p>
          </div>

          <div className="p-6 space-y-4">
            {!hasApiKey && (
              <div className="bg-[#fff8e1] border-2 border-[#ffe082] rounded-xl p-3 flex gap-2.5 items-start">
                <span className="text-lg shrink-0">⚠️</span>
                <div className="text-xs text-[#2c3028]">
                  <strong className="text-[#f57f17] block mb-0.5">AI running in fallback mode</strong>
                  Add <code className="bg-[#f0ece5] px-1 rounded">VITE_GEMINI_API_KEY</code> to Railway env vars for live AI.
                  Free key at <strong>aistudio.google.com/app/apikey</strong>
                </div>
              </div>
            )}

            {/* What to expect */}
            <div className="space-y-2">
              {[
                { icon: '🎡', text: 'Start with how you are feeling today' },
                { icon: '💭', text: 'Share some thoughts that feel true for you' },
                { icon: '📋', text: '4 short questions about the past 2 weeks' },
                { icon: '✨', text: 'Personalised results with next steps and a CBT exercise' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-[#2c3028]">
                  <span className="text-base w-6 text-center">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={startChat}
              className="w-full bg-[#4a7c59] hover:bg-[#3a6b3e] text-white py-4 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2">
              🌿 Begin Check-In
            </motion.button>
            <p className="text-center text-xs text-[#a3a89f]">4-5 minutes - anonymous and confidential</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE: RESULTS
  // ─────────────────────────────────────────────────────────────
  if (phase === 'results') {
    return (
      <Results
        scores={finalScores}
        conversationLog={logRef.current}
        userContext={contextRef.current}
        chatGptContext={chatGptRef.current}
        setTab={setTab}
        currentUser={currentUser}
        onRestart={() => {
          setPhase('start');
          setMessages([]);
          setFinalScores({ phq: 0, gad: 0 });
          phqRef.current = 0;
          gadRef.current = 0;
          qIdxRef.current = 0;
          logRef.current = '';
          contextRef.current = '';
          setChatGptText('');
          setChatGptAdded(false);
        }}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE: CHAT
  // ─────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto px-4 py-4">
      <div className="flex flex-col bg-white rounded-[2rem] shadow-2xl border border-[#d8d0c4] overflow-hidden"
        style={{ height: 'calc(100dvh - 180px)', minHeight: '400px', maxHeight: '800px' }}>

        {/* Chat Header */}
        <div className="bg-[#4a7c59] px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🌿</div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border-2 border-white rounded-full" />
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-sm">MindBridge</div>
            <div className="text-white/65 text-xs">{isLoading ? 'Thinking...' : hasApiKey ? 'AI-powered check-in' : 'Confidential check-in'}</div>
          </div>
          <div className="flex items-center gap-1.5">
            {qIdxRef.current > 0 && (
              <>
                {[0,1,2,3].map(i => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i < qIdxRef.current ? 'bg-white' : 'bg-white/30'}`} />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="h-0.5 bg-[#e8f5e9] shrink-0">
          <motion.div className="h-full bg-[#4a7c59]"
            animate={{ width: `${(qIdxRef.current / 4) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }} />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'linear-gradient(180deg, #f7f3ed 0%, #fdfaf4 100%)' }}>
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>

                {msg.sender === 'bot' && (
                  <div className="flex items-center gap-1 mb-1 ml-1">
                    <Bot size={10} className="text-[#4a7c59]" />
                    <span className="text-[10px] text-[#6b7265] font-medium">MindBridge</span>
                  </div>
                )}

                {msg.text && (
                  <div className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm
                    ${msg.sender === 'user'
                      ? 'bg-[#4a7c59] text-white rounded-tr-sm'
                      : 'bg-white text-[#2c3028] rounded-tl-sm border border-[#d8d0c4]/60'}`}>
                    {msg.text.split('\n').map((line: string, i: number) => (
                      <React.Fragment key={i}>{formatText(line)}{i < msg.text.split('\n').length - 1 && <br />}</React.Fragment>
                    ))}
                  </div>
                )}

                {/* Render widgets only if not done */}
                {!msg.widgetDone && (
                  <>
                    {msg.widget === 'moodwheel'      && <MoodWheel onSelect={handleMood} disabled={isLoading} />}
                    {msg.widget === 'thoughtbubble'  && <ThoughtBubble onSelect={handleThoughts} disabled={isLoading} />}
                    {msg.widget === 'chatgpt-optional' && (
                      <ChatGptOptional
                        copied={copied} setCopied={setCopied}
                        chatGptText={chatGptText} setChatGptText={setChatGptText}
                        chatGptAdded={chatGptAdded}
                        onSkip={handleChatGptSkip}
                        onAdd={handleChatGptAdd}
                        disabled={isLoading}
                      />
                    )}
                    {msg.widget === 'energyslider' && <EnergySlider onSelect={handleEnergy} disabled={isLoading} />}
                    {msg.widget === 'scale'        && <ScaleQuestion onSelect={handleScale} disabled={isLoading} />}
                    {msg.widget === 'breathing'    && <MiniBreathing onDone={handleBreathingDone} disabled={isLoading} />}
                    {msg.widget === 'sleep'        && <SleepCheck onSelect={handleSleep} disabled={isLoading} />}
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-1">
              <Bot size={10} className="text-[#4a7c59] mt-2" />
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2.5 flex gap-1 shadow-sm border border-[#d8d0c4]/60">
                {[0, 140, 280].map(d => (
                  <div key={d} className="w-1.5 h-1.5 bg-[#4a7c59] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input */}
        <div className="px-3 py-2.5 bg-white border-t border-[#d8d0c4]/50 shrink-0">
          <div className="flex gap-2 items-center">
            <input value={freeText} onChange={e => setFreeText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFreeText()}
              placeholder="Or type something..."
              disabled={isLoading || isTyping}
              className="flex-1 bg-[#f7f3ed] border border-[#d8d0c4] rounded-full py-2.5 px-4 text-base focus:outline-none focus:border-[#4a7c59] disabled:opacity-40 transition-all"
              style={{ fontSize: '16px' }} />
            <motion.button whileTap={{ scale: 0.88 }} onClick={handleFreeText}
              disabled={!freeText.trim() || isLoading || isTyping}
              className="w-10 h-10 bg-[#4a7c59] disabled:bg-[#d8d0c4] text-white rounded-full flex items-center justify-center transition-all shrink-0">
              <Send size={15} className="ml-0.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// RESULTS - all 4 agents running in sequence
// ─────────────────────────────────────────────────────────────────
function Results({ scores, conversationLog, userContext, chatGptContext, onRestart, setTab, currentUser }: {
  scores: { phq: number; gad: number };
  conversationLog: string; userContext: string; chatGptContext: string;
  onRestart: () => void; setTab?: (tab: string) => void; currentUser?: any;
}) {
  const [analysis, setAnalysis]     = useState<RiskAnalysis | null>(null);
  const [steps, setSteps]           = useState<string[]>([]);
  const [therapy, setTherapy]       = useState<TherapyIntervention | null>(null);
  const [followUpQ, setFollowUpQ]   = useState('');
  const [loading, setLoading]       = useState(true);
  const [done, setDone]             = useState({ risk: false, nav: false, therapy: false, followup: false });
  const [showBooking, setShowBooking] = useState(false);
  const [appointment, setAppointment] = useState<any>(null);
  const [savedToDb, setSavedToDb]   = useState(false);

  const fullContext = [userContext, conversationLog, chatGptContext ? `Prior context: ${chatGptContext}` : ''].filter(Boolean).join('\n');

  useEffect(() => {
    const total = scores.phq + scores.gad;
    const rl: 'low' | 'moderate' | 'high' = total <= 2 ? 'low' : total <= 5 ? 'moderate' : 'high';

    const run = async () => {
      try {
        // Step 1: RiskAgent
        const risk = await RiskAgent(scores.phq, scores.gad, fullContext, chatGptContext);
        setAnalysis(risk);
        setDone(d => ({ ...d, risk: true }));

        // Step 2: All others in parallel
        const [stepsR, therapyR, followR] = await Promise.all([
          CareNavigatorAgent(rl, scores.phq, scores.gad, fullContext),
          rl !== 'high' ? TherapyAgent(rl as 'low' | 'moderate', scores.phq, scores.gad, fullContext) : Promise.resolve(null),
          FollowUpAgent(7, rl, fullContext),
        ]);

        setSteps(stepsR);
        setDone(d => ({ ...d, nav: true }));
        if (therapyR) { setTherapy(therapyR); }
        setDone(d => ({ ...d, therapy: true }));
        setFollowUpQ(followR.checkInQuestion);
        setDone(d => ({ ...d, followup: true }));

        // Save to DB
        if (currentUser) {
          try {
            const { api: a } = await import('../api');
            await a.screenings.save({ phqScore: scores.phq, gadScore: scores.gad, riskLevel: rl, riskScore: risk.riskScore, userContext: fullContext.slice(0, 300), channel: 'web', isCrisis: rl === 'high' && total >= 10 });
            setSavedToDb(true);
          } catch { /* silently fail if offline */ }
        }
      } catch (e) {
        // Agents failed completely - show fallback results anyway
        setDone({ risk: true, nav: true, therapy: true, followup: true });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const risk = analysis?.riskLevel ?? (scores.phq + scores.gad <= 2 ? 'low' : scores.phq + scores.gad <= 5 ? 'moderate' : 'high');
  const S = {
    low:      { grad: 'from-[#e8f5e9] to-[#c8e6c9]', border: 'border-[#a5d6a7]', color: 'text-[#2e7d32]', dot: 'bg-[#4a7c59]' },
    moderate: { grad: 'from-[#fff8e1] to-[#ffecb3]', border: 'border-[#ffe082]', color: 'text-[#f57f17]', dot: 'bg-[#c4a040]' },
    high:     { grad: 'from-[#fce4ec] to-[#f8bbd0]', border: 'border-[#f48fb1]', color: 'text-[#c62828]', dot: 'bg-[#c4605a]' },
  };
  const st = S[risk];

  const AGENTS = [
    { name: 'RiskAgent',      sub: 'Scoring + NLP sentiment', done: done.risk },
    { name: 'CareNavigator',  sub: 'Personalised next steps', done: done.nav },
    { name: 'TherapyAgent',   sub: 'CBT intervention',        done: done.therapy },
    { name: 'FollowUpAgent',  sub: '7-day check-in',          done: done.followup },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto px-4 py-5">
      <Disclaimer />

      {loading ? (
        <div className="bg-white rounded-[2rem] p-8 text-center shadow-sm border border-[#d8d0c4]">
          <div className="w-12 h-12 bg-[#e8f5e9] rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles size={22} className="text-[#4a7c59] animate-pulse" />
          </div>
          <h3 className="font-serif text-lg text-[#2c3028] mb-1">Analysing everything you shared...</h3>
          <p className="text-[#6b7265] text-xs mb-5">4 specialist agents are personalising your results</p>
          <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
            {AGENTS.map(a => (
              <motion.div key={a.name}
                animate={a.done ? { scale: [1, 1.03, 1] } : {}}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs border-2 transition-all duration-700
                  ${a.done ? 'bg-[#e8f5e9] border-[#a5d6a7] text-[#2e7d32]' : 'bg-[#f0ece5] border-[#d8d0c4] text-[#6b7265] animate-pulse'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${a.done ? 'bg-[#4a7c59] text-white' : 'bg-[#d8d0c4] text-white'}`}>
                  {a.done ? '✓' : '·'}
                </span>
                <div>
                  <div className="font-bold leading-tight">{a.name}</div>
                  <div className="opacity-60 text-[9px]">{a.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Risk Banner */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className={`bg-gradient-to-br ${st.grad} border-2 ${st.border} rounded-[2rem] p-6 text-center relative overflow-hidden shadow-lg`}>
            <div className="absolute -right-4 -top-4 text-7xl opacity-10">{analysis?.riskIcon}</div>
            <div className="relative z-10">
              <div className="text-4xl mb-2">{analysis?.riskIcon}</div>
              <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
                <h2 className={`font-serif text-2xl font-bold ${st.color}`}>{analysis?.riskTitle}</h2>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/60 backdrop-blur-sm ${st.color}`}>
                  Score: {analysis?.riskScore}/100
                </span>
              </div>
              <p className="text-[#2c3028] text-sm leading-relaxed max-w-md mx-auto">{analysis?.personalMessage}</p>
              {analysis?.keyInsight && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-[#2c3028] font-medium">
                  <Sparkles size={11} className="text-[#d4843a]" />{analysis.keyInsight}
                </div>
              )}
              {analysis?.sentimentFlag && <p className="mt-1.5 text-xs text-[#6b7265] italic">{analysis.sentimentFlag}</p>}
            </div>
          </motion.div>

          {/* Score Cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'PHQ-2', sub: 'Depression', score: scores.phq, hi: scores.phq >= 2 },
              { label: 'GAD-2', sub: 'Anxiety',    score: scores.gad, hi: scores.gad >= 2 },
            ].map(s => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#d8d0c4] rounded-2xl p-4 text-center shadow-sm">
                <div className={`font-serif text-4xl font-bold mb-0.5 ${s.hi ? 'text-[#c4605a]' : 'text-[#4a7c59]'}`}>
                  {s.score}<span className="text-lg">/6</span>
                </div>
                <div className="text-xs font-bold text-[#2c3028]">{s.label}</div>
                <div className="text-[10px] text-[#6b7265]">{s.sub}</div>
                <div className="text-[10px] text-[#6b7265] mt-0.5">
                  {s.score === 0 ? 'Minimal' : s.score === 1 ? 'Mild' : s.score <= 3 ? 'Moderate' : 'Significant'}
                </div>
              </motion.div>
            ))}
          </div>

          {/* TherapyAgent output */}
          {therapy && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-[#e8f5e9] to-[#f0fdf4] border border-[#a5d6a7] rounded-2xl p-4">
              <div className="flex items-start gap-2 mb-3">
                <div className="bg-[#4a7c59] text-white p-1.5 rounded-lg shrink-0"><Bot size={13} /></div>
                <div>
                  <div className="text-[10px] text-[#4a7c59] font-bold uppercase tracking-wider">TherapyAgent - {therapy.duration}</div>
                  <div className="font-bold text-sm text-[#2c3028]">{therapy.title}</div>
                  <div className="text-xs text-[#6b7265] italic mt-0.5">{therapy.rationale}</div>
                </div>
              </div>
              <ol className="space-y-1.5">
                {(therapy.steps || []).map((step, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
                    className="flex gap-2 text-xs text-[#2c3028]">
                    <span className="w-4 h-4 rounded-full bg-[#4a7c59] text-white text-[9px] flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                    {String(step).replace(/^\d+\.\s*/, '')}
                  </motion.li>
                ))}
              </ol>
              <button onClick={() => setTab?.('resources')} className="mt-2.5 text-xs text-[#4a7c59] font-bold hover:underline">
                More techniques in Resources
              </button>
            </motion.div>
          )}

          {/* CareNavigatorAgent steps */}
          <div className="bg-white border border-[#d8d0c4] rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-[#2c3028]">
              <Sparkles size={13} className="text-[#d4843a]" /> CareNavigator - your personalised next steps
            </h3>
            <ul className="space-y-2.5">
              {steps.map((step, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex gap-2.5 text-xs text-[#2c3028] leading-relaxed">
                  <div className={`w-2 h-2 mt-1 rounded-full shrink-0 ${st.dot}`} />
                  {step}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* FollowUpAgent */}
          {followUpQ && (
            <div className="bg-[#fff8e1] border border-[#ffe082] rounded-xl p-3 text-xs text-[#2c3028]">
              <div className="font-bold text-[#f57f17] text-[10px] uppercase tracking-wider mb-1">FollowUpAgent - 7-day check-in scheduled</div>
              In 7 days we will ask: <strong>"{followUpQ}"</strong>
            </div>
          )}

          {savedToDb && (
            <div className="flex items-center gap-2 text-xs text-[#2e7d32] font-medium bg-[#e8f5e9] border border-[#a5d6a7] rounded-xl p-2.5">
              <Check size={12} /> Saved to your health record
            </div>
          )}

          {/* Crisis appointment */}
          {risk === 'high' && !appointment && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-gradient-to-r from-[#fce4ec] to-[#f8bbd0] border-2 border-[#f48fb1] rounded-2xl p-4">
              <div className="font-bold text-[#c62828] text-sm mb-1">Crisis level detected - connect to a doctor now</div>
              <p className="text-xs text-[#2c3028] mb-3">A secure video call with a mental health professional can be set up immediately. Or message our team on WhatsApp right now.</p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setShowBooking(true)} className="flex items-center gap-1.5 bg-[#c62828] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#b71c1c] transition-all">
                  <Calendar size={12} /> Connect to Doctor
                </button>
                <button onClick={() => setTab?.('directory')} className="flex items-center gap-1.5 bg-white border border-[#f48fb1] text-[#c62828] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#fce4ec] transition-all">
                  <Phone size={12} /> Crisis Helplines
                </button>
                <a href="https://wa.me/2202010001" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#1da851] transition-all">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Message Us Now
                </a>
              </div>
            </motion.div>
          )}

          {risk === 'moderate' && !appointment && (
            <div className="bg-[#fff8e1] border border-[#ffe082] rounded-2xl p-4">
              <div className="font-bold text-[#f57f17] text-xs mb-0.5">Book with a mental health professional</div>
              <p className="text-xs text-[#2c3028] mb-2">Speaking with a doctor this week is recommended based on your results.</p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setShowBooking(true)} className="flex items-center gap-1 bg-[#f57f17] text-white px-3 py-2 rounded-full text-xs font-bold hover:bg-[#e65100] transition-all">
                  <Calendar size={11} /> Book Appointment
                </button>
                <a href="https://wa.me/2202010001" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#25D366] text-white px-3 py-2 rounded-full text-xs font-bold hover:bg-[#1da851] transition-all">
                  <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Message Us
                </a>
              </div>
            </div>
          )}

          {appointment && (
            <div className="bg-[#e8f5e9] border-2 border-[#a5d6a7] rounded-2xl p-4">
              <div className="flex items-center gap-2 font-bold text-[#2e7d32] text-sm mb-1"><Check size={14} /> Appointment confirmed</div>
              <div className="text-xs text-[#2c3028]">{appointment.doctorName} - {new Date(appointment.dateTime).toLocaleString()}</div>
              {appointment.meetingLink && (
                <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 bg-[#4a7c59] text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#3a6b3e] transition-all">
                  Join Video Call
                </a>
              )}
            </div>
          )}

          {/* WhatsApp floating help */}
          <a href="https://wa.me/2202010001" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-[#6b7265] hover:text-[#25D366] text-xs font-medium transition-all py-1">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Need to talk to someone? Message us on WhatsApp +220 201 0001
          </a>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button onClick={() => setTab?.('home')} className="flex items-center justify-center gap-1.5 border-2 border-[#d8d0c4] text-[#6b7265] hover:border-[#4a7c59] hover:text-[#4a7c59] py-3 px-5 rounded-full text-sm font-semibold transition-all">
              Home
            </button>
            <button onClick={onRestart} className="flex-1 flex items-center justify-center gap-1.5 border-2 border-[#4a7c59] text-[#4a7c59] hover:bg-[#4a7c59] hover:text-white py-3 rounded-full text-sm font-semibold transition-all">
              <RefreshCw size={14} /> Retake
            </button>
            <button onClick={() => setTab?.('resources')} className="flex-1 flex items-center justify-center gap-1.5 bg-[#4a7c59] text-white py-3 rounded-full text-sm font-semibold hover:bg-[#3a6b3e] transition-all">
              <BookOpen size={14} /> Resources
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showBooking && (
          <AppointmentBooking riskLevel={risk === 'high' ? 'high' : 'moderate'} isCritical={risk === 'high'}
            onClose={() => setShowBooking(false)}
            onBooked={apt => { setAppointment(apt); setShowBooking(false); }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
