import { motion } from 'motion/react';
import { Activity, Users, TrendingUp, AlertTriangle, CheckCircle2, FileText, Smartphone, Building2, UserPlus, MessageSquare, Bot, CalendarClock } from 'lucide-react';

export default function Dashboard() {
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#4a7c59] text-white p-2 rounded-xl shadow-md">
               <Activity size={24} />
            </div>
            <h2 className="font-serif text-4xl text-[#2c3028]">Primary Care Dashboard</h2>
          </div>
          <p className="text-lg text-[#6b7265] flex items-center gap-2">
            <Building2 size={18} /> Community Health Centre · March 2026
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-full border border-[#d8d0c4] shadow-sm text-sm font-medium text-[#6b7265] flex items-center gap-2">
            Last updated: Just now
          </div>
          <span className="bg-[#e8f5e9] text-[#2e7d32] px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm border border-[#c8e6c9]">
            <div className="w-2.5 h-2.5 bg-[#2e7d32] rounded-full animate-pulse shadow-[0_0_8px_rgba(46,125,50,0.6)]"></div> Live System
          </span>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12"
      >
        <KpiCard icon={<Smartphone size={20} />} num="348" label="WhatsApp Triage" delta="↑ 24%" up color="bg-[#e3f2fd]" textColor="text-[#1565c0]" />
        <KpiCard icon={<UserPlus size={20} />} num="127" label="Clinic Referrals" delta="↑ 38%" up color="bg-[#f3e5f5]" textColor="text-[#7b1fa2]" />
        <KpiCard icon={<CheckCircle2 size={20} />} num="89%" label="Follow-Up Comp." delta="↑ 11 pts" up color="bg-[#e8f5e9]" textColor="text-[#2e7d32]" />
        <KpiCard icon={<TrendingUp size={20} />} num="72%" label="3M Retention" delta="↑ 18 pts" up color="bg-[#fff8e1]" textColor="text-[#f57f17]" />
        <KpiCard icon={<AlertTriangle size={20} />} num="14" label="Crisis Flags" delta="↓ 3" up={false} color="bg-[#ffebee]" textColor="text-[#c62828]" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white border border-[#d8d0c4] rounded-[2rem] p-8 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#f0ece5] to-transparent rounded-bl-full pointer-events-none opacity-50"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h4 className="font-bold text-2xl text-[#2c3028] flex items-center gap-3">
              <Users className="text-[#4a7c59]" size={28} /> Patient Triage & Follow-up
            </h4>
            <button className="text-[#4a7c59] text-sm font-bold hover:underline">View All Patients</button>
          </div>
          <div className="space-y-4 relative z-10">
            <PatientRow 
              initials="P1" name="Patient #8492" age="34" gender="F" 
              riskScore={85} risk="High Risk" riskClass="bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]" 
              assessments="PHQ-9: 18 | GAD-7: 15" 
              aiRec="Immediate psychiatric evaluation. Crisis protocol initiated." 
              followUp="Missed 2 days ago" followUpClass="text-[#c62828]"
            />
            <PatientRow 
              initials="P2" name="Patient #1023" age="28" gender="M" 
              riskScore={62} risk="Moderate" riskClass="bg-[#fff8e1] text-[#f57f17] border border-[#ffe082]" 
              assessments="PHQ-9: 12 | GAD-7: 8" 
              aiRec="Schedule therapy session. Continue CBT micro-interventions." 
              followUp="Due tomorrow" followUpClass="text-[#f57f17]"
            />
            <PatientRow 
              initials="P3" name="Patient #5521" age="45" gender="F" 
              riskScore={58} risk="Moderate" riskClass="bg-[#fff8e1] text-[#f57f17] border border-[#ffe082]" 
              assessments="PHQ-9: 10 | GAD-7: 11" 
              aiRec="Review medication adherence. Send mood tracking survey." 
              followUp="Completed" followUpClass="text-[#2e7d32]"
            />
            <PatientRow 
              initials="P4" name="Patient #9920" age="22" gender="M" 
              riskScore={24} risk="Low Risk" riskClass="bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]" 
              assessments="PHQ-2: 2 | GAD-2: 1" 
              aiRec="Maintain self-help tools. No clinical action required." 
              followUp="Completed" followUpClass="text-[#2e7d32]"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-[#d8d0c4] rounded-[2rem] p-8 shadow-sm flex flex-col"
        >
          <h4 className="font-bold text-2xl text-[#2c3028] mb-8 flex items-center gap-3">
            <FileText className="text-[#c4a040]" size={28} /> Screenings by Channel
          </h4>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <BarRow icon={<MessageSquare size={16} />} label="WhatsApp" count={176} pct={100} color="bg-[#25D366]" />
            <BarRow icon={<Building2 size={16} />} label="Walk-in" count={98} pct={56} color="bg-[#7baec8]" />
            <BarRow icon={<UserPlus size={16} />} label="Referred" count={54} pct={31} color="bg-[#c4a040]" />
            <BarRow icon={<Smartphone size={16} />} label="SMS" count={20} pct={11} color="bg-[#c4605a]" />
          </div>
          <div className="mt-8 pt-6 border-t border-[#f0ece5] text-center">
            <p className="text-sm text-[#6b7265]">Total screenings this month: <strong className="text-[#2c3028] text-lg">348</strong></p>
          </div>
        </motion.div>
      </div>

      {/* Outcomes Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
      >
        {[
          { label: 'Follow-Up Completion', pct: 89, color: '#2d5a30', bg: 'bg-[#e8f5e9]', text: 'text-[#2e7d32]', desc: 'of referred patients completed their 7-day follow-up' },
          { label: '3-Month Retention',    pct: 72, color: '#d4843a', bg: 'bg-[#fff8e1]', text: 'text-[#f57f17]', desc: 'still engaged with care at 3 months post-screening' },
          { label: 'Referral Attended',    pct: 65, color: '#7baec8', bg: 'bg-[#e3f2fd]', text: 'text-[#1565c0]', desc: 'of clinic referrals resulted in attended appointments' },
        ].map(m => (
          <div key={m.label} className={`${m.bg} border border-[#d8d0c4] rounded-[1.5rem] p-6 flex items-center gap-5`}>
            <div className="relative w-16 h-16 shrink-0">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e0e0e0" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={m.color} strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${m.pct} 100`}
                  initial={{ strokeDasharray: '0 100' }}
                  animate={{ strokeDasharray: `${m.pct} 100` }}
                  transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                />
              </svg>
              <div className={`absolute inset-0 flex items-center justify-center font-serif font-bold text-sm ${m.text}`}>
                {m.pct}%
              </div>
            </div>
            <div>
              <div className={`font-bold text-sm ${m.text}`}>{m.label}</div>
              <div className="text-xs text-[#6b7265] mt-1 leading-relaxed">{m.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

const KpiCard = ({ icon, num, label, delta, up, color, textColor }: any) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 }
    }}
    className="bg-white border border-[#d8d0c4] rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
  >
    <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full ${color} opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
    <div className={`w-10 h-10 rounded-xl ${color} ${textColor} flex items-center justify-center mb-4 relative z-10 shadow-sm`}>
      {icon}
    </div>
    <div className="font-serif text-4xl font-bold text-[#2c3028] mb-2 relative z-10">{num}</div>
    <div className="text-xs text-[#6b7265] uppercase tracking-wider font-bold mb-3 relative z-10">{label}</div>
    <div className={`text-sm font-bold flex items-center gap-1 relative z-10 ${up ? 'text-[#2e7d32]' : 'text-[#c62828]'}`}>
      <span className={`px-2 py-0.5 rounded-md ${up ? 'bg-[#e8f5e9]' : 'bg-[#ffebee]'}`}>{delta}</span> vs last month
    </div>
  </motion.div>
);

const PatientRow = ({ initials, name, age, gender, riskScore, risk, riskClass, assessments, aiRec, followUp, followUpClass }: any) => (
  <motion.div 
    whileHover={{ x: 5, backgroundColor: "#fdfaf4" }}
    className="flex flex-col gap-3 p-4 rounded-2xl border border-transparent hover:border-[#d8d0c4] transition-all cursor-pointer"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b8d4ba] to-[#7a9e7e] text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
        {initials}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="font-bold text-lg text-[#2c3028]">{name}</div>
          <div className={`text-xs font-bold px-2 py-0.5 rounded-full shadow-sm ${riskClass}`}>Score: {riskScore} - {risk}</div>
        </div>
        <div className="text-sm text-[#6b7265] flex items-center gap-2">
          <span>{age} yrs</span> • <span>{gender}</span> • <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{assessments}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className={`text-sm font-bold flex items-center justify-end gap-1 ${followUpClass}`}>
          <CalendarClock size={14} /> {followUp}
        </div>
      </div>
    </div>
    <div className="bg-[#f5f0e8] p-3 rounded-xl text-sm text-[#2c3028] flex items-start gap-2 border border-[#e5ddd0]">
      <Bot size={16} className="text-[#4a7c59] shrink-0 mt-0.5" />
      <div>
        <span className="font-bold text-[#4a7c59]">AI CareNavigator:</span> {aiRec}
      </div>
    </div>
  </motion.div>
);

const BarRow = ({ icon, label, count, pct, color }: any) => (
  <div className="flex items-center gap-4 text-sm group">
    <div className="w-28 flex items-center gap-2 text-[#6b7265] font-medium group-hover:text-[#2c3028] transition-colors">
      <span className="text-gray-400 group-hover:text-current transition-colors">{icon}</span> {label}
    </div>
    <div className="flex-1 bg-[#f0ece5] h-4 rounded-full overflow-hidden shadow-inner">
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: `${pct}%` }} 
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }} 
        className={`h-full ${color} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </motion.div>
    </div>
    <div className="w-12 text-right font-bold text-lg text-[#2c3028]">{count}</div>
  </div>
);
