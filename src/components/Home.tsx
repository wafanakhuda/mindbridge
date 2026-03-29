import { motion } from 'motion/react';
import Disclaimer from './Disclaimer';
import { ArrowRight, Phone, MessageCircle, ShieldCheck, Users, Activity, Sparkles } from 'lucide-react';

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

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-10 sm:pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="inline-block py-1.5 px-3 sm:px-4 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs sm:text-sm font-medium tracking-wide mb-6 sm:mb-8 backdrop-blur-md shadow-lg max-w-xs sm:max-w-none text-center">
              Hack for Health Equity 2026 - Bridging Communities to Mental Health Care
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-4 sm:mb-6 drop-shadow-2xl">
              Mental health support,<br/>
              <em className="text-[#f0c896] not-italic font-serif relative inline-block">
                within reach.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#d4843a] opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </em>
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
              A hybrid community-primary care mental health system connecting AI screening, clinic referrals, and structured follow-up - for every community, in 195 countries.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setTab('screening')}
                className="group relative overflow-hidden bg-[#d4843a] text-white px-8 py-4 rounded-full font-semibold shadow-[0_0_40px_rgba(212,132,58,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(212,132,58,0.6)] flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Begin Check-In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#c07030] to-[#d4843a] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <button
                onClick={() => setTab('directory')}
                className="group bg-white/10 border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-medium transition-all backdrop-blur-sm flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg"
              >
                <Phone size={18} className="text-white/80" />
                <span>Crisis Helplines</span>
              </button>
              <a href="https://wa.me/2202010001" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-all justify-center mt-1">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span>Or message us on WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* WHO Global Stats Bar */}
      <div className="bg-white border-b border-[#d8d0c4] py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
          {[
            { num: '1 in 7', label: 'people live with mental illness', src: 'WHO, 2025' },
            { num: '1B+',    label: 'people affected globally',        src: 'WHO, 2025' },
            { num: '2 in 3', label: 'receive no care at all',          src: 'WHO, 2025' },
            { num: '195',    label: 'countries in our directory',       src: 'MindBridge' },
          ].map((s) => (
            <div key={s.num}>
              <div className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#4a7c59]">{s.num}</div>
              <div className="text-sm text-[#6b7265] mt-1 font-medium">{s.label}</div>
              <div className="text-xs text-[#a3a89f] mt-0.5">Source: {s.src}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Care Pathway Banner */}
      <div className="bg-[#f7f3ed] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-[#d8d0c4] shadow-lg rounded-3xl overflow-hidden p-8"
          >
            <div className="text-center mb-8">
              <span className="inline-block bg-[#e8f5e9] text-[#4a7c59] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#c8e6c9] mb-3">The MindBridge Care Pathway</span>
              <p className="text-[#2c3028] font-serif text-lg md:text-xl italic max-w-2xl mx-auto">"The mental health treatment gap is not because care does not exist - it is because the pathway to care is broken." - WHO Mental Health Atlas, 2022</p>
            </div>
            <div className="flex flex-col md:flex-row items-stretch justify-center gap-3 md:gap-0 mb-8">
              {[
                { icon: '📱', step: '1', title: 'Community Screening', desc: 'Anonymous PHQ-2 & GAD-2 triage via app', color: 'bg-[#e8f5e9] border-[#c8e6c9]', text: 'text-[#2e7d32]' },
                { icon: '🏥', step: '2', title: 'Primary Care Link',    desc: 'Risk-based referral to local clinics',     color: 'bg-[#e3f2fd] border-[#bbdefb]', text: 'text-[#1565c0]' },
                { icon: '📲', step: '3', title: 'Structured Follow-Up', desc: '7, 30 & 90-day automated check-ins',       color: 'bg-[#fff8e1] border-[#ffe082]', text: 'text-[#f57f17]' },
              ].map((s, i) => (
                <div key={s.step} className="flex md:flex-row items-center gap-3 flex-1">
                  <div className={`flex-1 border-2 ${s.color} rounded-2xl p-5 text-center`}>
                    <div className="text-3xl mb-2">{s.icon}</div>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${s.text}`}>Step {s.step}</div>
                    <div className="font-bold text-[#2c3028] text-sm">{s.title}</div>
                    <div className="text-xs text-[#6b7265] mt-1 leading-relaxed">{s.desc}</div>
                  </div>
                  {i < 2 && <div className="text-xl text-[#d8d0c4] font-bold shrink-0 hidden md:block">→</div>}
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => setTab('screening')}
                className="bg-[#d4843a] text-white px-10 py-3.5 rounded-full font-bold shadow-lg hover:bg-[#c07030] transition-all hover:shadow-xl hover:-translate-y-0.5 text-base"
              >
                Begin Check-In
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2c3028] mb-4 sm:mb-6">How MindBridge Works</h2>
          <p className="text-lg text-[#6b7265] max-w-2xl mx-auto">Five specialist AI agents working together across a complete mental health care pathway.</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          <FeatureCard
            icon={<MessageCircle size={28} className="text-[#4d7a52]" />}
            title="TriageAgent"
            desc="Reads exactly what you share and responds personally. Guides you through validated PHQ-2 and GAD-2 questions."
            imgUrl="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400&h=300"
            onClick={() => setTab('screening')}
          />
          <FeatureCard
            icon={<Activity size={28} className="text-[#d4843a]" />}
            title="RiskAgent"
            desc="Analyses your scores and your language together. Returns a 0-100 risk score, personal insight, and sentiment observation."
            imgUrl="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400&h=300"
            onClick={() => setTab('screening')}
          />
          <FeatureCard
            icon={<ShieldCheck size={28} className="text-[#7baec8]" />}
            title="TherapyAgent"
            desc="Picks the most appropriate CBT exercise for you - box breathing, grounding, behavioural activation, or thought challenging."
            imgUrl="https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&q=80&w=400&h=300"
            onClick={() => setTab('resources')}
          />
          <FeatureCard
            icon={<Users size={28} className="text-[#c4605a]" />}
            title="CareNavigator + FollowUpAgent"
            desc="Routes you to appropriate care with personalised next steps. Schedules 7, 30, and 90-day check-in questions."
            imgUrl="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400&h=300"
            onClick={() => setTab('directory')}
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
          "The mental health treatment gap is not because care does not exist - it is because the pathway to care is broken." - WHO Mental Health Atlas, 2022
        </motion.blockquote>
        
        <a href="https://wa.me/2202010001" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 text-[#2e7d32] px-5 py-2.5 rounded-full text-sm font-bold transition-all mb-8">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Need immediate support? Message us on WhatsApp
        </a>
        <Disclaimer />
      </div>
    </motion.div>
  );
}

const FeatureCard = ({ icon, title, desc, imgUrl, onClick }: any) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    }}
    onClick={onClick}
    className={`group bg-white rounded-[2rem] overflow-hidden border border-[#d8d0c4] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col ${onClick ? 'cursor-pointer' : ''}`}
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
      {onClick && (
        <div className="mt-4 text-xs font-bold text-[#4a7c59] group-hover:text-[#3a6b3e] flex items-center gap-1 transition-colors">
          Try it <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
        </div>
      )}
    </div>
  </motion.div>
);

