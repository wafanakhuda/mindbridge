import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Disclaimer from './Disclaimer';
import { MessageCircle, Send, RefreshCw, ArrowRight, Sparkles, Bot } from 'lucide-react';
import { TriageAgent, RiskAgent, CareNavigatorAgent, FreeTextAgent, type RiskAnalysis } from '../agents/gemini';

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

export default function Screening() {
  const [messages, setMessages] = useState<any[]>([]);
  const [step, setStep] = useState<'intro' | 'phq0' | 'phq1' | 'gad0' | 'gad1' | 'done'>('intro');
  const [isTyping, setIsTyping] = useState(false);
  const [scores, setScores] = useState({ phq: 0, gad: 0 });
  const [showResults, setShowResults] = useState(false);
  const [userContext, setUserContext] = useState('');
  const [freeText, setFreeText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<any[]>([]);
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
      const aiResponse = await TriageAgent(option);
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
        return <strong key={i} className="font-semibold text-[#1a361d]">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (showResults) {
    return (
      <Results
        scores={scores}
        userContext={userContext}
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
            href="https://wa.me/1234567890?text=Hi%20MindBridge"
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
              className="w-10 h-10 bg-[#2d5a30] disabled:bg-[#d8d0c4] text-white rounded-full flex items-center justify-center transition-all hover:bg-[#4d7a52] disabled:cursor-not-allowed shrink-0"
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
// Results — calls RiskAgent + CareNavigatorAgent
// ─────────────────────────────────────────────
function Results({ scores, userContext, onRestart }: { scores: any; userContext: string; onRestart: () => void }) {
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const [riskResult, stepsResult] = await Promise.all([
        RiskAgent(scores.phq, scores.gad, userContext),
        CareNavigatorAgent(
          scores.phq + scores.gad <= 2 ? 'low' : scores.phq + scores.gad <= 5 ? 'moderate' : 'high',
          scores.phq, scores.gad, userContext
        )
      ]);
      setAnalysis(riskResult);
      setSteps(stepsResult);
      setLoading(false);
    };
    run();
  }, []);

  const risk = analysis?.riskLevel || (scores.phq + scores.gad <= 2 ? 'low' : scores.phq + scores.gad <= 5 ? 'moderate' : 'high');

  const riskStyles = {
    low: { bg: 'from-[#e8f5e9] to-[#c8e6c9] border-[#a5d6a7]', color: 'text-[#2e7d32]', dot: 'bg-[#5a8c5e]' },
    moderate: { bg: 'from-[#fff8e1] to-[#ffecb3] border-[#ffe082]', color: 'text-[#f57f17]', dot: 'bg-[#c4a040]' },
    high: { bg: 'from-[#fce4ec] to-[#f8bbd0] border-[#f48fb1]', color: 'text-[#c62828]', dot: 'bg-[#c4605a]' },
  };
  const style = riskStyles[risk];

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="max-w-3xl mx-auto px-4 py-8">
      <Disclaimer />

      {loading ? (
        <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-[#d8d0c4]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e8f5e9] mb-6">
            <Sparkles size={28} className="text-[#2d5a30] animate-pulse" />
          </div>
          <h3 className="font-serif text-2xl text-[#2c3028] mb-3">AI is analysing your responses…</h3>
          <p className="text-[#6b7265]">Our Gemini-powered agents are personalising your results</p>
          <div className="flex justify-center gap-2 mt-6">
            {['TriageAgent', 'RiskAgent', 'CareNavigatorAgent'].map((a, i) => (
              <span key={a} className="text-xs bg-[#f0ece5] text-[#6b7265] px-3 py-1 rounded-full animate-pulse" style={{ animationDelay: `${i * 300}ms` }}>
                {a}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Risk Banner */}
          <div className={`p-8 rounded-[2rem] border-2 shadow-lg text-center mb-8 relative overflow-hidden bg-gradient-to-br ${style.bg}`}>
            <div className="absolute -right-10 -top-10 text-9xl opacity-10">{analysis?.riskIcon}</div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">{analysis?.riskIcon}</div>
              <h2 className={`font-serif text-3xl font-bold mb-4 ${style.color}`}>{analysis?.riskTitle}</h2>
              <p className="text-[#2c3028] text-lg max-w-xl mx-auto leading-relaxed">{analysis?.personalMessage}</p>
              {analysis?.keyInsight && (
                <div className="mt-4 inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-[#2c3028] font-medium">
                  <Sparkles size={14} className="text-[#d4843a]" />
                  {analysis.keyInsight}
                </div>
              )}
            </div>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              { label: 'PHQ-2 — Depression', score: scores.phq, max: 6, isHigh: scores.phq >= 2 },
              { label: 'GAD-2 — Anxiety', score: scores.gad, max: 6, isHigh: scores.gad >= 2 },
            ].map(s => (
              <motion.div whileHover={{ y: -4 }} key={s.label} className="bg-white border border-[#d8d0c4] rounded-[2rem] p-8 text-center shadow-sm">
                <div className={`font-serif text-6xl font-bold mb-2 ${s.isHigh ? 'text-[#c4605a]' : 'text-[#2d5a30]'}`}>
                  {s.score}/{s.max}
                </div>
                <div className="text-sm text-[#6b7265] uppercase tracking-widest font-bold">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* AI-Generated Steps */}
          <div className="bg-white border border-[#d8d0c4] rounded-[2rem] p-8 mb-8 shadow-sm">
            <h3 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3 text-[#2c3028]">
              <span className="bg-[#e8f5e9] p-2 rounded-xl"><Sparkles size={20} className="text-[#2d5a30]" /></span>
              Your personalised next steps
            </h3>
            <ul className="space-y-4">
              {steps.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-4 text-[#2c3028] text-base"
                >
                  <div className={`w-3 h-3 mt-1.5 rounded-full ${style.dot} shrink-0 shadow-lg`} />
                  {step}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={onRestart} className="flex items-center justify-center gap-2 bg-transparent border-2 border-[#2d5a30] text-[#2d5a30] hover:bg-[#2d5a30] hover:text-white px-8 py-4 rounded-full font-semibold transition-all">
              <RefreshCw size={18} /> Retake Screening
            </button>
            {risk !== 'low' && (
              <button className="flex items-center justify-center gap-2 bg-[#d4843a] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#c07030] transition-all shadow-[0_0_20px_rgba(212,132,58,0.3)]">
                Find Support <ArrowRight size={18} />
              </button>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
