import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Disclaimer from './Disclaimer';
import { MessageCircle, Send, RefreshCw, ArrowRight, Sparkles, Bot, ClipboardPaste, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { TriageAgent, RiskAgent, CareNavigatorAgent, TherapyAgent, FollowUpAgent, FreeTextAgent, type RiskAnalysis, type TherapyIntervention } from '../agents/gemini';

const CHATGPT_PROMPT = `Please summarise my mental health history from our conversations. Include:
1. Main concerns and symptoms I have mentioned (anxiety, depression, stress, sleep issues, etc.)
2. How long I have been experiencing these issues
3. Any triggers or difficult situations I have described
4. Coping strategies I have tried or mentioned
5. Any significant life events or stressors I shared
6. How my mood or symptoms have changed over time

Please be concise and clinical — this summary will be used by a mental health screening tool to give me more accurate, personalised results. Do not include any advice, just summarise what I have shared with you.`;

const PHQ_QUESTIONS = [
  "Over the last 2 weeks, how often have you been bothered by **little interest or pleasure in doing things**?",
  "Over the last 2 weeks, how often have you been bothered by **feeling down, depressed, or hopeless**?"
];
const GAD_QUESTIONS = [
  "Over the last 2 weeks, how often have you been bothered by **feeling nervous, anxious or on edge**?",
  "Over the last 2 weeks, how often have you been bothered by **not being able to stop or control worrying**?"
];
const FREQ_OPTIONS = [
  { text: "Not at all", val: 0 },
  { text: "Several days", val: 1 },
  { text: "More than half the days", val: 2 },
  { text: "Nearly every day", val: 3 }
];

const INTRO_OPTIONS = ["I've been feeling anxious lately", "I'm going through a tough time", "Just want to check in on myself", "I've been feeling low"];

export default function Screening({ setTab }: { setTab?: (tab: string) => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [step, setStep] = useState<'intro' | 'phq0' | 'phq1' | 'gad0' | 'gad1' | 'done'>('intro');
  const [isTyping, setIsTyping] = useState(false);
  const [scores, setScores] = useState({ phq: 0, gad: 0 });
  const [showResults, setShowResults] = useState(false);
  const [userContext, setUserContext] = useState('');
  const [freeText, setFreeText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<any[]>([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [historyText, setHistoryText] = useState('');
  const [historyCopied, setHistoryCopied] = useState(false);
  const [historySubmitted, setHistorySubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    // Opening message
    setTimeout(() => {
      addBotMessage(
        "Hello 👋 Welcome to MindBridge. I'm here to offer a brief, confidential mental health check-in.\n\nThis takes about 3–4 minutes and is completely anonymous. How are you feeling today?",
        INTRO_OPTIONS
      );
    }, 600);
  }, []);

  const addBotMessage = (text: string, options: any[] = []) => {
    setMessages(prev => [...prev, { sender: 'bot', text, options, id: Date.now() + Math.random() }]);
    setCurrentOptions(options);
  };

  const addUserMessage = (text: string) => {
    // Clear options on last bot message
    setMessages(prev => {
      const msgs = [...prev];
      if (msgs.length > 0) msgs[msgs.length - 1].options = [];
      return [...msgs, { sender: 'user', text, id: Date.now() + Math.random() }];
    });
    setCurrentOptions([]);
  };

  const showTyping = (ms = 1200) => new Promise<void>(resolve => {
    setIsTyping(true);
    setTimeout(() => { setIsTyping(false); resolve(); }, ms);
  });

  // Handle intro option selected — calls TriageAgent
  const handleIntro = async (option: string) => {
    addUserMessage(option);
    setUserContext(option);
    setIsAiLoading(true);

    await showTyping(800);

    try {
      const contextWithHistory = historyText
        ? `User said: "${option}". Previous mental health history from ChatGPT: ${historyText}`
        : option;
      const aiResponse = await TriageAgent(contextWithHistory);
      addBotMessage(aiResponse + '\n\nLet me ask you a few short questions. 🌿');
    } catch {
      addBotMessage("Thank you for sharing that with me. 🌿\n\nLet me ask you a few short questions to better understand how you've been feeling.");
    }

    setIsAiLoading(false);
    await showTyping(600);
    setStep('phq0');
    addBotMessage(PHQ_QUESTIONS[0], FREQ_OPTIONS);
  };

  // Handle PHQ/GAD option
  const handleFreqOption = async (option: { text: string; val: number }, questionType: string) => {
    addUserMessage(option.text);

    if (questionType === 'phq0') {
      setScores(s => ({ ...s, phq: s.phq + option.val }));
      await showTyping();
      setStep('phq1');
      addBotMessage(PHQ_QUESTIONS[1], FREQ_OPTIONS);

    } else if (questionType === 'phq1') {
      setScores(s => ({ ...s, phq: s.phq + option.val }));
      await showTyping();
      setStep('gad0');
      addBotMessage(GAD_QUESTIONS[0], FREQ_OPTIONS);

    } else if (questionType === 'gad0') {
      setScores(s => ({ ...s, gad: s.gad + option.val }));
      await showTyping();
      setStep('gad1');
      addBotMessage(GAD_QUESTIONS[1], FREQ_OPTIONS);

    } else if (questionType === 'gad1') {
      const newGad = scores.gad + option.val;
      setScores(s => ({ ...s, gad: newGad }));
      setStep('done');
      await showTyping(800);
      addBotMessage("Thank you for answering those questions. Let me analyse your responses now… 🌿");
      await showTyping(2000);
      setShowResults(true);
    }
  };

  // Handle free text input
  const handleFreeText = async () => {
    const text = freeText.trim();
    if (!text || isAiLoading) return;
    setFreeText('');
    addUserMessage(text);
    setIsAiLoading(true);
    await showTyping(900);
    try {
      const response = await FreeTextAgent(text, userContext);
      addBotMessage(response);
    } catch {
      addBotMessage("Thank you for sharing that. I'm here to listen. Please continue with the screening when you're ready. 🌿");
    }
    setIsAiLoading(false);
  };

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-[#2d5a45]">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (showResults) {
    return (
      <Results
        scores={scores}
        userContext={userContext}
        setTab={setTab}
        onRestart={() => {
          setMessages([]);
          setStep('intro');
          setScores({ phq: 0, gad: 0 });
          setShowResults(false);
          setUserContext('');
          setTimeout(() => {
            addBotMessage(
              "Hello again 👋 Let's do another check-in. How are you feeling today?",
              INTRO_OPTIONS
            );
          }, 400);
        }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-4 py-8">
      <Disclaimer />

      {/* ChatGPT History Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#d8d0c4] rounded-2xl mb-4 overflow-hidden"
      >
        <button
          onClick={() => setShowHistoryPanel(!showHistoryPanel)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-[#fdfaf4] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#10a37f]/10 flex items-center justify-center shrink-0">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <div className="font-bold text-[#2c3028] text-sm">Have you talked to ChatGPT about your mental health?</div>
              <div className="text-xs text-[#6b7265]">Paste your history to get a more accurate, personalised screening</div>
            </div>
          </div>
          {showHistoryPanel ? <ChevronUp size={18} className="text-[#6b7265] shrink-0" /> : <ChevronDown size={18} className="text-[#6b7265] shrink-0" />}
        </button>

        <AnimatePresence>
          {showHistoryPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-[#f0ece5] p-4 space-y-4">
                <div className="bg-[#f0fdf4] border border-[#86efac] rounded-xl p-4">
                  <p className="text-sm text-[#166534] font-medium mb-3">
                    Step 1 — Copy this prompt and paste it into ChatGPT:
                  </p>
                  <div className="bg-white border border-[#d1fae5] rounded-lg p-3 text-xs text-[#2c3028] font-mono leading-relaxed mb-3 whitespace-pre-wrap">
                    {CHATGPT_PROMPT}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(CHATGPT_PROMPT);
                      setHistoryCopied(true);
                      setTimeout(() => setHistoryCopied(false), 2500);
                    }}
                    className="flex items-center gap-2 bg-[#10a37f] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#0d8a6d] transition-all"
                  >
                    {historyCopied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Prompt</>}
                  </button>
                </div>

                <div>
                  <p className="text-sm text-[#6b7265] mb-2 font-medium">Step 2 — Paste ChatGPT's summary here:</p>
                  <textarea
                    value={historyText}
                    onChange={e => setHistoryText(e.target.value)}
                    placeholder="Paste ChatGPT's mental health summary here…"
                    className="w-full bg-[#fdfaf4] border-2 border-[#f0ece5] rounded-xl p-3 text-sm focus:outline-none focus:border-[#7a9e7e] resize-none h-28 transition-all placeholder:text-[#a3a89f]"
                  />
                  <button
                    disabled={!historyText.trim() || historySubmitted}
                    onClick={() => {
                      setUserContext(prev => prev + '\n\nChatGPT history summary: ' + historyText.trim());
                      setHistorySubmitted(true);
                      setShowHistoryPanel(false);
                    }}
                    className="mt-2 flex items-center gap-2 bg-[#4a7c59] disabled:bg-[#d8d0c4] text-white px-5 py-2 rounded-full text-sm font-bold transition-all"
                  >
                    {historySubmitted ? <><Check size={14} /> Added to screening</> : <><ClipboardPaste size={14} /> Add to my screening</>}
                  </button>
                </div>

                {historySubmitted && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#e8f5e9] border border-[#a5d6a7] rounded-xl p-3 text-sm text-[#2d5a30] font-medium flex items-center gap-2">
                    ✅ Your history has been added. The screening will use this for more personalised results.
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl border border-white/40 flex flex-col h-[650px]">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md p-5 flex items-center justify-between border-b border-[#d8d0c4]/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4d7a52] to-[#7a9e7e] flex items-center justify-center text-2xl shadow-md">🌿</div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25D366] border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#2c3028] flex items-center gap-2">
                MindBridge Agent
                <span className="text-xs bg-[#e8f5e9] text-[#2e7d32] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <Sparkles size={10} /> AI
                </span>
              </h3>
              <p className="text-sm text-[#6b7265] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse"></span>
                {isAiLoading ? 'Thinking…' : 'Online · Powered by Gemini'}
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/?text=Hi%20MindBridge,%20I%20need%20support"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#f5f0e8]/30">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="flex items-center gap-2 mb-1.5 ml-1">
                    <Bot size={13} className="text-[#7a9e7e]" />
                    <span className="text-xs text-[#6b7265] font-medium">MindBridge Agent</span>
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#d4843a] text-white rounded-tr-sm'
                    : 'bg-white text-[#2c3028] rounded-tl-sm border border-[#d8d0c4]/40'
                }`}>
                  {msg.text.split('\n').map((line: string, j: number) => (
                    <React.Fragment key={j}>
                      {formatText(line)}
                      {j < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>

                {msg.options && msg.options.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mt-3 flex flex-wrap gap-2"
                  >
                    {msg.options.map((opt: any, j: number) => (
                      <button
                        key={j}
                        onClick={() => {
                          if (step === 'intro') handleIntro(typeof opt === 'string' ? opt : opt.text);
                          else if (['phq0','phq1','gad0','gad1'].includes(step)) handleFreqOption(opt, step);
                        }}
                        className="bg-white border border-[#7a9e7e]/40 text-[#4d7a52] hover:bg-[#4d7a52] hover:text-white hover:border-[#4d7a52] px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
                      >
                        {opt.text || opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 w-20 shadow-sm border border-[#d8d0c4]/40 flex gap-1.5 justify-center items-center"
            >
              <div className="w-2 h-2 bg-[#7a9e7e] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[#7a9e7e] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#7a9e7e] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-[#d8d0c4]/50">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFreeText()}
              placeholder={step === 'intro' ? "Or type how you're feeling…" : "Type a message or select an option above…"}
              disabled={isAiLoading}
              className="flex-1 bg-[#f5f0e8]/50 border border-[#d8d0c4] rounded-full py-3.5 pl-5 pr-12 text-sm text-[#2c3028] placeholder-[#6b7265] focus:outline-none focus:border-[#7a9e7e] focus:ring-2 focus:ring-[#7a9e7e]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleFreeText}
              disabled={!freeText.trim() || isAiLoading}
              className="w-10 h-10 bg-[#4a7c59] disabled:bg-[#d8d0c4] text-white rounded-full flex items-center justify-center transition-all hover:bg-[#4d7a52] disabled:cursor-not-allowed shrink-0"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// Results — all 5 agents: Risk + CareNavigator + Therapy + FollowUp
// ─────────────────────────────────────────────
function Results({ scores, userContext, onRestart, setTab }: { scores: any; userContext: string; onRestart: () => void; setTab?: (tab: string) => void }) {
  const [analysis, setAnalysis]       = useState<RiskAnalysis | null>(null);
  const [steps, setSteps]             = useState<string[]>([]);
  const [therapy, setTherapy]         = useState<TherapyIntervention | null>(null);
  const [followUpQ, setFollowUpQ]     = useState('');
  const [loading, setLoading]         = useState(true);
  const [done, setDone]               = useState({ risk: false, nav: false, therapy: false, followup: false });

  useEffect(() => {
    const total = scores.phq + scores.gad;
    const rl: 'low' | 'moderate' | 'high' = total <= 2 ? 'low' : total <= 5 ? 'moderate' : 'high';

    const run = async () => {
      // Step 1: RiskAgent
      const riskResult = await RiskAgent(scores.phq, scores.gad, userContext);
      setAnalysis(riskResult);
      setDone(d => ({ ...d, risk: true }));

      // Step 2: CareNavigator + Therapy + FollowUp in parallel
      const [stepsResult, therapyResult, followUpResult] = await Promise.all([
        CareNavigatorAgent(rl, scores.phq, scores.gad, userContext),
        rl !== 'high' ? TherapyAgent(rl as 'low' | 'moderate', scores.phq, scores.gad, userContext) : Promise.resolve(null),
        FollowUpAgent(7, rl, userContext),
      ]);

      setSteps(stepsResult);
      setDone(d => ({ ...d, nav: true }));

      if (therapyResult) { setTherapy(therapyResult); setDone(d => ({ ...d, therapy: true })); }
      setFollowUpQ(followUpResult.checkInQuestion);
      setDone(d => ({ ...d, followup: true }));
      setLoading(false);
    };
    run();
  }, []);

  const risk = analysis?.riskLevel || (scores.phq + scores.gad <= 2 ? 'low' : scores.phq + scores.gad <= 5 ? 'moderate' : 'high');
  const S = {
    low:      { bg: 'from-[#e8f5e9] to-[#c8e6c9] border-[#a5d6a7]', color: 'text-[#2e7d32]', dot: 'bg-[#5a8c5e]' },
    moderate: { bg: 'from-[#fff8e1] to-[#ffecb3] border-[#ffe082]', color: 'text-[#f57f17]', dot: 'bg-[#c4a040]' },
    high:     { bg: 'from-[#fce4ec] to-[#f8bbd0] border-[#f48fb1]', color: 'text-[#c62828]', dot: 'bg-[#c4605a]' },
  };
  const style = S[risk];

  const AGENTS = [
    { name: 'RiskAgent',      sub: 'Scoring & Safety',       done: done.risk },
    { name: 'CareNavigator',  sub: 'Logistics & Routing',    done: done.nav },
    { name: 'TherapyAgent',   sub: 'Micro-Interventions',    done: done.therapy },
    { name: 'FollowUpAgent',  sub: 'Retention',              done: done.followup },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="max-w-3xl mx-auto px-4 py-8">
      <Disclaimer />

      {loading ? (
        <div className="bg-white rounded-[2rem] p-10 text-center shadow-sm border border-[#d8d0c4]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e8f5e9] mb-5">
            <Sparkles size={28} className="text-[#4a7c59] animate-pulse" />
          </div>
          <h3 className="font-serif text-2xl text-[#2c3028] mb-2">Analysing your responses…</h3>
          <p className="text-[#6b7265] text-sm mb-8">Our specialist agents are personalising your results</p>
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {AGENTS.map(a => (
              <div key={a.name} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-700 ${
                a.done ? 'bg-[#e8f5e9] border-[#a5d6a7] text-[#2e7d32]' : 'bg-[#f0ece5] border-[#d8d0c4] text-[#6b7265] animate-pulse'
              }`}>
                <span className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${a.done ? 'bg-[#4a7c59] text-white' : 'bg-[#d8d0c4] text-white'}`}>
                  {a.done ? '✓' : '…'}
                </span>
                <div className="text-left">
                  <div className="font-bold leading-tight">{a.name}</div>
                  <div className="opacity-60 text-[9px]">{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Risk Banner */}
          <div className={`p-7 rounded-[2rem] border-2 shadow-lg text-center mb-5 relative overflow-hidden bg-gradient-to-br ${style.bg}`}>
            <div className="absolute -right-8 -top-8 text-8xl opacity-10">{analysis?.riskIcon}</div>
            <div className="relative z-10">
              <div className="text-5xl mb-3">{analysis?.riskIcon}</div>
              <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
                <h2 className={`font-serif text-3xl font-bold ${style.color}`}>{analysis?.riskTitle}</h2>
                {analysis?.riskScore !== undefined && (
                  <span className={`text-sm font-bold px-3 py-1 rounded-full bg-white/60 ${style.color}`}>Score: {analysis.riskScore}/100</span>
                )}
              </div>
              <p className="text-[#2c3028] text-base max-w-xl mx-auto leading-relaxed">{analysis?.personalMessage}</p>
              {analysis?.keyInsight && (
                <div className="mt-3 inline-flex items-center gap-2 bg-white/60 px-4 py-1.5 rounded-full text-sm text-[#2c3028] font-medium">
                  <Sparkles size={13} className="text-[#d4843a]" /> {analysis.keyInsight}
                </div>
              )}
              {analysis?.sentimentFlag && (
                <div className="mt-1.5 text-xs text-[#6b7265] italic">{analysis.sentimentFlag}</div>
              )}
            </div>
          </div>

          {/* PHQ-2 + GAD-2 Scores */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            {[
              { label: 'PHQ-2 — Depression', score: scores.phq, max: 6, hi: scores.phq >= 2 },
              { label: 'GAD-2 — Anxiety',   score: scores.gad, max: 6, hi: scores.gad >= 2 },
            ].map(s => (
              <div key={s.label} className="bg-white border border-[#d8d0c4] rounded-2xl p-5 text-center shadow-sm">
                <div className={`font-serif text-5xl font-bold mb-1 ${s.hi ? 'text-[#c4605a]' : 'text-[#4a7c59]'}`}>{s.score}/{s.max}</div>
                <div className="text-xs text-[#6b7265] uppercase tracking-wider font-bold">{s.label}</div>
              </div>
            ))}
          </div>

          {/* TherapyAgent — personalised CBT exercise (low/moderate only) */}
          {therapy && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#e8f5e9] to-[#f0fdf4] border border-[#a5d6a7] rounded-2xl p-5 mb-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-[#4a7c59] text-white p-2 rounded-xl shrink-0"><Bot size={16} /></div>
                <div>
                  <div className="text-[10px] text-[#4a7c59] font-bold uppercase tracking-wider">TherapyAgent · {therapy.duration}</div>
                  <div className="font-bold text-[#2c3028]">{therapy.title}</div>
                  <div className="text-xs text-[#6b7265] italic mt-0.5">{therapy.rationale}</div>
                </div>
              </div>
              <ol className="space-y-1.5 pl-1">
                {therapy.instruction.split('\n').filter(Boolean).map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[#2c3028]">
                    <span className="w-5 h-5 rounded-full bg-[#4a7c59] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                    {step.replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ol>
              <button onClick={() => setTab && setTab('resources')} className="mt-3 text-xs text-[#4a7c59] font-bold hover:underline">
                → More exercises in Resources
              </button>
            </motion.div>
          )}

          {/* CareNavigatorAgent — next steps */}
          <div className="bg-white border border-[#d8d0c4] rounded-2xl p-6 mb-5 shadow-sm">
            <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-[#2c3028]">
              <span className="bg-[#f0ece5] p-1.5 rounded-lg"><Sparkles size={16} className="text-[#d4843a]" /></span>
              CareNavigator — your personalised next steps
            </h3>
            <ul className="space-y-3">
              {steps.map((step, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex gap-3 text-sm text-[#2c3028]">
                  <div className={`w-2.5 h-2.5 mt-1.5 rounded-full ${style.dot} shrink-0`} />{step}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* FollowUpAgent — scheduled check-in */}
          {followUpQ && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="bg-[#fff8e1] border border-[#ffe082] rounded-2xl p-4 mb-5">
              <div className="text-[10px] text-[#f57f17] font-bold uppercase tracking-wider mb-1">FollowUpAgent · 7-day check-in scheduled</div>
              <p className="text-sm text-[#2c3028]">We'll check in with you in 7 days and ask: <strong>"{followUpQ}"</strong></p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={onRestart} className="flex items-center justify-center gap-2 border-2 border-[#4a7c59] text-[#4a7c59] hover:bg-[#4a7c59] hover:text-white px-8 py-3.5 rounded-full font-semibold transition-all">
              <RefreshCw size={17} /> Retake Screening
            </button>
            {risk !== 'low' && (
              <button onClick={() => setTab && setTab('directory')}
                className="flex items-center justify-center gap-2 bg-[#d4843a] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#c07030] transition-all shadow-lg">
                🌍 Find a Helpline <ArrowRight size={17} />
              </button>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
