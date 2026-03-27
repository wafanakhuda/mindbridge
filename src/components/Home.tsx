import { motion } from 'motion/react';
import Disclaimer from './Disclaimer';
import { ArrowRight, MessageCircle, ShieldCheck, Users, Activity, Flame, Wind, Sparkles } from 'lucide-react';

export default function Home({ setTab }: { setTab: (tab: string) => void }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1920&h=1080" 
            alt="Calm nature background" 
            className="w-full h-full object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a361d]/90 via-[#2d5a30]/80 to-[#f5f0e8] mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#f5f0e8] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium tracking-wide mb-8 backdrop-blur-md shadow-lg">
              MindBridge 2.0 • Hybrid AI-Primary Care System
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-6 drop-shadow-2xl">
              Mental health support,<br/>
              <em className="text-[#f0c896] not-italic font-serif relative inline-block">
                within reach.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#d4843a] opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </em>
            </h1>
            <p className="text-white/90 text-lg md:text-2xl mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
              A two-layer system connecting WhatsApp AI triage with primary healthcare clinics — anonymously, gently, and without stigma.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setTab('screening')} 
                className="group relative overflow-hidden bg-[#d4843a] text-white px-8 py-4 rounded-full font-semibold shadow-[0_0_40px_rgba(212,132,58,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(212,132,58,0.6)] flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start AI Triage <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#c07030] to-[#d4843a] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
              <a 
                href="https://wa.me/1234567890?text=Hi%20MindBridge,%20I%20need%20support" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366] hover:border-[#25D366] text-white px-8 py-4 rounded-full font-medium transition-all backdrop-blur-sm flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg"
              >
                <MessageCircle size={20} className="group-hover:text-white text-[#25D366] transition-colors" />
                <span>WhatsApp Bot</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Engagement Layer (Patient Dashboard) */}
      <div className="relative z-20 -mt-16 max-w-6xl mx-auto px-6 mb-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[100px] shadow-sm border border-orange-200/50">
                <Flame size={32} className="mb-1" />
                <span className="font-bold text-xl">5 Days</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Streak</span>
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#2c3028] mb-1 flex items-center gap-2">
                  Welcome back, Friend <Sparkles size={20} className="text-[#d4843a]" />
                </h3>
                <p className="text-[#6b7265]">You're doing great. Your next check-in is due tomorrow.</p>
                <div className="mt-3 w-full bg-[#f0ece5] rounded-full h-2.5 shadow-inner overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="bg-gradient-to-r from-[#4d7a52] to-[#2d5a30] h-2.5 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </motion.div>
                </div>
                <p className="text-xs text-[#6b7265] mt-2 font-medium">Recovery Progress: Level 2</p>
              </div>
            </div>
            
            <button 
              onClick={() => setTab('resources')}
              className="group bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] hover:from-[#c8e6c9] hover:to-[#a5d6a7] text-[#2e7d32] border border-[#a5d6a7] px-6 py-4 rounded-2xl font-bold flex items-center gap-4 transition-all w-full md:w-auto justify-center shadow-sm hover:shadow-md"
            >
              <div className="bg-white/50 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Wind size={24} />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium opacity-80">Feeling overwhelmed?</div>
                <div className="text-lg">Instant Calm Mode</div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-[#2c3028] mb-6">How MindBridge 2.0 Works</h2>
          <p className="text-lg text-[#6b7265] max-w-2xl mx-auto">A seamless, hybrid system bridging the gap between community isolation and primary care.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <FeatureCard 
            icon={<MessageCircle size={28} className="text-[#4d7a52]" />}
            title="Multi-Agent Triage"
            desc="WhatsApp bot uses TriageAgent & RiskAgent for PHQ-2/GAD-2 screening and crisis detection."
            imgUrl="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400&h=300"
          />
          <FeatureCard 
            icon={<Activity size={28} className="text-[#d4843a]" />}
            title="Primary Care Link"
            desc="CareNavigator routes high-risk users to nearby clinics. Clinics use PHQ-9/GAD-7 dashboards."
            imgUrl="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400&h=300"
          />
          <FeatureCard 
            icon={<ShieldCheck size={28} className="text-[#7baec8]" />}
            title="Follow-Up Engine"
            desc="FollowUpAgent sends automated SMS check-ins, mood surveys, and adherence nudges."
            imgUrl="https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&q=80&w=400&h=300"
          />
          <FeatureCard 
            icon={<Users size={28} className="text-[#c4605a]" />}
            title="Community Intel"
            desc="Aggregated, anonymized data creates risk heatmaps for public health monitoring."
            imgUrl="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400&h=300"
          />
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <motion.blockquote 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-serif text-[#4d7a52] italic mb-12 leading-relaxed"
        >
          "This is not because care does not exist. It is because the pathway to care is broken."
        </motion.blockquote>
        
        <Disclaimer />
      </div>
    </motion.div>
  );
}

const FeatureCard = ({ icon, title, desc, imgUrl }: any) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 30 },
      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    }}
    className="group bg-white rounded-[2rem] overflow-hidden border border-[#d8d0c4] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
  >
    <div className="h-48 overflow-hidden relative">
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10 duration-500"></div>
      <img 
        src={imgUrl} 
        alt={title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="p-6 relative flex-1 flex flex-col">
      <div className="absolute -top-8 right-6 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center z-20 rotate-3 group-hover:-rotate-3 transition-transform duration-300 border-4 border-white">
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-3 text-[#2c3028] mt-2">{title}</h3>
      <p className="text-[#6b7265] leading-relaxed text-sm flex-1">{desc}</p>
    </div>
  </motion.div>
);

