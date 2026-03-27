import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Disclaimer from './Disclaimer';
import { MessageCircle, Send, RefreshCw, ArrowRight } from 'lucide-react';

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

const FLOW = [
  { type: 'bot', text: "Hello 👋 Welcome to MindBridge. I'm here to offer a brief, confidential mental health check-in.\n\nThis takes about 3–4 minutes and is completely anonymous. Your responses are private.", options: ["Let's begin", "Tell me more"] },
  { type: 'bot', text: "Great! I'll ask you 4 short questions about how you've been feeling lately. There are no right or wrong answers — just be honest with yourself. 🌿", options: ["Okay, I'm ready"] },
  { type: 'phq', qIndex: 0 },
  { type: 'phq', qIndex: 1 },
  { type: 'gad', qIndex: 0 },
  { type: 'gad', qIndex: 1 },
  { type: 'results' }
];

export default function Screening() {
  const [messages, setMessages] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [scores, setScores] = useState({ phq: 0, gad: 0 });
  const [showResults, setShowResults] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showResults]);

  useEffect(() => {
    if (step === 0 && messages.length === 0) {
      advanceChat(0);
    }
  }, []);

  const advanceChat = (currentStep: number) => {
    const flowStep = FLOW[currentStep] as any;
    if (!flowStep) return;

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      if (flowStep.type === 'bot') {
        addBotMessage(flowStep.text, flowStep.options);
      } else if (flowStep.type === 'phq') {
        addBotMessage(PHQ_QUESTIONS[flowStep.qIndex], FREQ_OPTIONS);
      } else if (flowStep.type === 'gad') {
        addBotMessage(GAD_QUESTIONS[flowStep.qIndex], FREQ_OPTIONS);
      } else if (flowStep.type === 'results') {
        addBotMessage("Thank you for sharing that. Let me look at your responses…");
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addBotMessage("I've calculated your results. Showing your personalised summary now 📋");
            setTimeout(() => setShowResults(true), 1500);
          }, 1500);
        }, 1000);
      }
    }, 1200);
  };

  const addBotMessage = (text: string, options: any = null) => {
    setMessages(prev => [...prev, { sender: 'bot', text, options, id: Date.now() + Math.random() }]);
  };

  const handleOptionClick = (option: any) => {
    const text = option.text || option;
    const val = option.val;
    
    setMessages(prev => {
      const newMsgs = [...prev];
      newMsgs[newMsgs.length - 1].options = null;
      return newMsgs;
    });

    setMessages(prev => [...prev, { sender: 'user', text, id: Date.now() + Math.random() }]);

    const flowStep = FLOW[step] as any;
    if (flowStep.type === 'phq') {
      setScores(s => ({ ...s, phq: s.phq + val }));
    } else if (flowStep.type === 'gad') {
      setScores(s => ({ ...s, gad: s.gad + val }));
    }

    setStep(s => {
      const next = s + 1;
      advanceChat(next);
      return next;
    });
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
    return <Results scores={scores} onRestart={() => {
      setMessages([]);
      setStep(0);
      setScores({ phq: 0, gad: 0 });
      setShowResults(false);
      advanceChat(0);
    }} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto px-4 py-8">
      <Disclaimer />
      
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl border border-white/40 flex flex-col h-[650px] relative">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md p-5 flex items-center justify-between border-b border-[#d8d0c4]/50 z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4d7a52] to-[#7a9e7e] flex items-center justify-center text-2xl shadow-md">🌿</div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25D366] border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#2c3028]">MindBridge Agent</h3>
              <p className="text-sm text-[#6b7265] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse"></span> Online
              </p>
            </div>
          </div>
          
          <a 
            href="https://wa.me/1234567890?text=Hi%20MindBridge" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            <MessageCircle size={16} /> Open in WhatsApp
          </a>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f5f0e8]/30">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
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
                
                {msg.options && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-3 flex flex-wrap gap-2"
                  >
                    {msg.options.map((opt: any, j: number) => (
                      <button 
                        key={j}
                        onClick={() => handleOptionClick(opt)}
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
        
        {/* Input Area (Visual only for this demo) */}
        <div className="p-4 bg-white border-t border-[#d8d0c4]/50">
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Select an option above..." 
              disabled
              className="w-full bg-[#f5f0e8]/50 border border-[#d8d0c4] rounded-full py-3.5 pl-5 pr-12 text-sm text-[#6b7265] focus:outline-none cursor-not-allowed"
            />
            <button disabled className="absolute right-2 w-10 h-10 bg-[#d8d0c4] text-white rounded-full flex items-center justify-center cursor-not-allowed">
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const Results = ({ scores, onRestart }: any) => {
  const total = scores.phq + scores.gad;
  let risk, riskTitle, riskDesc, riskColor, riskBg, riskIcon;

  if (total <= 2) {
    risk = 'low'; riskTitle = 'Low Risk'; riskIcon = '🌱';
    riskDesc = "Your responses suggest you're coping reasonably well right now. That's positive! Keep using self-care strategies and check in regularly.";
    riskColor = "text-[#2e7d32]"; riskBg = "bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] border-[#a5d6a7]";
  } else if (total <= 5) {
    risk = 'moderate'; riskTitle = 'Moderate Risk'; riskIcon = '🌤️';
    riskDesc = "You're showing some signs of anxiety or low mood. A conversation with a healthcare provider would be helpful and is worth taking seriously.";
    riskColor = "text-[#f57f17]"; riskBg = "bg-gradient-to-br from-[#fff8e1] to-[#ffecb3] border-[#ffe082]";
  } else {
    risk = 'high'; riskTitle = 'High Risk — Please Seek Support'; riskIcon = '⚡';
    riskDesc = "Your responses indicate significant distress. Please reach out to a healthcare provider or crisis support line. You don't have to face this alone.";
    riskColor = "text-[#c62828]"; riskBg = "bg-gradient-to-br from-[#fce4ec] to-[#f8bbd0] border-[#f48fb1]";
  }

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="max-w-3xl mx-auto px-4 py-8">
      <Disclaimer />
      
      <div className={`p-8 rounded-[2rem] border shadow-lg text-center mb-8 relative overflow-hidden ${riskBg}`}>
        <div className="absolute -right-10 -top-10 text-9xl opacity-10">{riskIcon}</div>
        <div className="text-5xl mb-4 relative z-10">{riskIcon}</div>
        <h2 className={`font-serif text-3xl font-bold mb-4 relative z-10 ${riskColor}`}>{riskTitle}</h2>
        <p className="text-[#2c3028] text-lg max-w-xl mx-auto relative z-10">{riskDesc}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <motion.div whileHover={{ y: -5 }} className="bg-white border border-[#d8d0c4] rounded-[2rem] p-8 text-center shadow-sm hover:shadow-md transition-all">
          <div className={`font-serif text-6xl font-bold mb-2 ${scores.phq >= 2 ? 'text-[#c4605a]' : 'text-[#2d5a30]'}`}>
            {scores.phq}/6
          </div>
          <div className="text-sm text-[#6b7265] uppercase tracking-widest font-bold">PHQ-2 — Depression</div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="bg-white border border-[#d8d0c4] rounded-[2rem] p-8 text-center shadow-sm hover:shadow-md transition-all">
          <div className={`font-serif text-6xl font-bold mb-2 ${scores.gad >= 2 ? 'text-[#c4a040]' : 'text-[#2d5a30]'}`}>
            {scores.gad}/6
          </div>
          <div className="text-sm text-[#6b7265] uppercase tracking-widest font-bold">GAD-2 — Anxiety</div>
        </motion.div>
      </div>

      <div className="bg-white border border-[#d8d0c4] rounded-[2rem] p-8 mb-10 shadow-sm">
        <h3 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3 text-[#2c3028]">
          <span className="bg-[#f0ece5] p-2 rounded-xl">📋</span> Recommended next steps
        </h3>
        <ul className="space-y-4">
          {risk === 'low' && (
            <>
              <li className="flex gap-4 text-lg text-[#2c3028]"><div className="w-3 h-3 mt-2.5 rounded-full bg-[#5a8c5e] shrink-0 shadow-[0_0_10px_rgba(90,140,94,0.5)]" /> Continue your current routines — sleep, exercise, and social connection.</li>
              <li className="flex gap-4 text-lg text-[#2c3028]"><div className="w-3 h-3 mt-2.5 rounded-full bg-[#5a8c5e] shrink-0 shadow-[0_0_10px_rgba(90,140,94,0.5)]" /> Use the self-help resources in our Resources section.</li>
            </>
          )}
          {risk === 'moderate' && (
            <>
              <li className="flex gap-4 text-lg text-[#2c3028]"><div className="w-3 h-3 mt-2.5 rounded-full bg-[#c4a040] shrink-0 shadow-[0_0_10px_rgba(196,160,64,0.5)]" /> Visit your nearest primary healthcare centre and mention this screening result.</li>
              <li className="flex gap-4 text-lg text-[#2c3028]"><div className="w-3 h-3 mt-2.5 rounded-full bg-[#c4a040] shrink-0 shadow-[0_0_10px_rgba(196,160,64,0.5)]" /> Try the breathing and mood journal resources while you wait for an appointment.</li>
            </>
          )}
          {risk === 'high' && (
            <>
              <li className="flex gap-4 text-lg text-[#2c3028]"><div className="w-3 h-3 mt-2.5 rounded-full bg-[#c4605a] shrink-0 shadow-[0_0_10px_rgba(196,96,90,0.5)]" /> Please contact a crisis helpline now. Check the Directory tab for numbers in your country.</li>
              <li className="flex gap-4 text-lg text-[#2c3028]"><div className="w-3 h-3 mt-2.5 rounded-full bg-[#c4605a] shrink-0 shadow-[0_0_10px_rgba(196,96,90,0.5)]" /> Visit your nearest primary care centre today and show them this result.</li>
              <li className="flex gap-4 text-lg text-[#2c3028]"><div className="w-3 h-3 mt-2.5 rounded-full bg-[#c4605a] shrink-0 shadow-[0_0_10px_rgba(196,96,90,0.5)]" /> Tell someone you trust how you're feeling.</li>
            </>
          )}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={onRestart} className="flex items-center justify-center gap-2 bg-transparent border-2 border-[#2d5a30] text-[#2d5a30] hover:bg-[#2d5a30] hover:text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-lg">
          <RefreshCw size={18} /> Retake Screening
        </button>
        {risk !== 'low' && (
          <button className="flex items-center justify-center gap-2 bg-[#d4843a] text-white px-8 py-4 rounded-full font-semibold transition-all hover:bg-[#c07030] hover:shadow-lg shadow-[0_0_20px_rgba(212,132,58,0.3)]">
            Find Nearest Clinic <ArrowRight size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
