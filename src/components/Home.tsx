import { motion } from 'motion/react';
import Disclaimer from './Disclaimer';
import { ArrowRight, MessageCircle, ShieldCheck, Users, Activity, Sparkles } from 'lucide-react';

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
          <div className="absolute inset-0 bg-gradient-to-b from-[#2d5a45]/90 via-[#4a7c59]/80 to-[#f5f0e8] mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#f5f0e8] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium tracking-wide mb-8 backdrop-blur-md shadow-lg">
              Hack for Health Equity 2026 · Bridging Communities to Mental Health Care
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
              A hybrid community–primary care mental health system connecting AI screening, clinic referrals, and structured follow-up — for every community, in 195 countries.
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
                href="https://wa.me/?text=Hi%20MindBridge,%20I%20need%20mental%20health%20support" 
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

      {/* WHO Global Stats Bar */}
      <div className="bg-white border-b border-[#d8d0c4] py-6 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '1 in 7', label: 'people live with mental illness', src: 'WHO, 2025' },
            { num: '1B+', label: 'people affected globally', src: 'WHO, 2025' },
            { num: '2 in 3', label: 'receive no care at all', src: 'WHO, 2025' },
            { num: '195', label: 'countries in our directory', src: 'MindBridge' },
          ].map((s) => (
            <div key={s.num}>
              <div className="font-serif text-3xl md:text-4xl font-bold text-[#4a7c59]">{s.num}</div>
              <div className="text-sm text-[#6b7265] mt-1 font-medium">{s.label}</div>
              <div className="text-xs text-[#a3a89f] mt-0.5">Source: {s.src}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Care Pathway Banner */}
      <div className="relative z-20 -mt-16 max-w-6xl mx-auto px-6 mb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden p-6 md:p-8"
        >
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-[#6b7265] uppercase tracking-widest mb-2">The MindBridge Care Pathway</p>
            <p className="text-[#2c3028] font-serif text-xl italic">"This is not because care does not exist. It is because the pathway to care is broken." — WHO, 2025</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
            {[
              { icon: '📱', step: '1', title: 'Community Screening', desc: 'Anonymous AI triage via app or WhatsApp', color: 'bg-[#e8f5e9] border-[#c8e6c9] text-[#2e7d32]' },
              { icon: '🏥', step: '2', title: 'Primary Care Link', desc: 'Risk-based referral to local clinics', color: 'bg-[#e3f2fd] border-[#bbdefb] text-[#1565c0]' },
              { icon: '📲', step: '3', title: 'Structured Follow-Up', desc: '7, 30 & 90-day automated check-ins', color: 'bg-[#fff8e1] border-[#ffe082] text-[#f57f17]' },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-2 w-full md:w-auto">
                <div className={`flex-1 md:w-56 border-2 ${s.color} rounded-2xl p-4 text-center`}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${s.color.split(' ')[2]}`}>Step {s.step}</div>
                  <div className="font-bold text-[#2c3028] text-sm">{s.title}</div>
                  <div className="text-xs text-[#6b7265] mt-1">{s.desc}</div>
                </div>
                {i < 2 && <div className="text-2xl text-[#d8d0c4] font-bold hidden md:block mx-2">→</div>}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={() => setTab('screening')}
              className="bg-[#d4843a] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#c07030] transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Free Screening →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-[#2c3028] mb-6">How MindBridge Works</h2>
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

