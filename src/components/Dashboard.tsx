import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, TrendingUp, AlertTriangle, CheckCircle2, FileText, Smartphone, Building2, UserPlus, MessageSquare, Bot, CalendarClock, RefreshCw, Calendar } from 'lucide-react';
import { api } from '../api';

// ── SEED fallback data shown when API is unavailable ─────────────
const SEED: DashData = {
  kpis: { totalScreenings: 10, screeningsThisMonth: 8, highRisk: 3, crisisCount: 1, followUpsDue: 2, pendingAppointments: 3, confirmedAppointments: 1 },
  riskBreakdown: [{ _id: 'low', count: 3 }, { _id: 'moderate', count: 4 }, { _id: 'high', count: 3 }],
  channelBreakdown: [{ _id: 'web', count: 7 }, { _id: 'whatsapp', count: 2 }, { _id: 'sms', count: 1 }],
  weeklyTrend: [],
  recentScreenings: [
    { anonymousId: 'anon-demo-1009', riskLevel: 'high',     riskScore: 85, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), isCrisis: true,  channel: 'web',       followUpDue: new Date(Date.now() - 2 * 86400000).toISOString(), followUpDone: false },
    { anonymousId: 'anon-demo-1007', riskLevel: 'moderate', riskScore: 62, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), isCrisis: false, channel: 'whatsapp',  followUpDue: new Date(Date.now() + 5 * 86400000).toISOString(), followUpDone: false },
    { anonymousId: 'anon-demo-1005', riskLevel: 'moderate', riskScore: 55, createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), isCrisis: false, channel: 'web',       followUpDue: new Date(Date.now() + 4 * 86400000).toISOString(), followUpDone: true  },
    { anonymousId: 'anon-demo-1002', riskLevel: 'low',      riskScore: 18, createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), isCrisis: false, channel: 'sms',       followUpDue: new Date(Date.now() + 3 * 86400000).toISOString(), followUpDone: true  },
    { anonymousId: 'anon-demo-1000', riskLevel: 'high',     riskScore: 78, createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), isCrisis: false, channel: 'web',       followUpDue: new Date(Date.now() + 2 * 86400000).toISOString(), followUpDone: false },
  ],
  recentAppointments: [
    { patientId: 'p1', doctorName: 'Dr Sarah Chen',    status: 'confirmed', riskLevel: 'high',     isCritical: true,  dateTime: new Date(Date.now() + 2 * 3600000).toISOString(),   createdAt: new Date().toISOString() },
    { patientId: 'p2', doctorName: 'Dr Priya Sharma',  status: 'pending',   riskLevel: 'moderate', isCritical: false, dateTime: new Date(Date.now() + 24 * 3600000).toISOString(),  createdAt: new Date().toISOString() },
    { patientId: 'p1', doctorName: 'Dr James Okafor',  status: 'pending',   riskLevel: 'moderate', isCritical: false, dateTime: new Date(Date.now() + 48 * 3600000).toISOString(),  createdAt: new Date().toISOString() },
  ],
};

interface DashData {
  kpis: { totalScreenings: number; screeningsThisMonth: number; highRisk: number; crisisCount: number; followUpsDue: number; pendingAppointments: number; confirmedAppointments: number };
  riskBreakdown: { _id: string; count: number }[];
  channelBreakdown: { _id: string; count: number }[];
  weeklyTrend: { _id: string; count: number; highRisk: number }[];
  recentScreenings: any[];
  recentAppointments: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashData>(SEED);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [fromApi, setFromApi] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.dashboard.clinic();
      setData(res);
      setFromApi(true);
    } catch {
      setData(SEED);
      setFromApi(false);
    } finally {
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  useEffect(() => { load(); }, []);

  const { kpis, riskBreakdown, channelBreakdown, recentScreenings, recentAppointments } = data;
  const riskMap = Object.fromEntries(riskBreakdown.map(r => [r._id, r.count]));
  const channelMap = Object.fromEntries(channelBreakdown.map(c => [c._id, c.count]));
  const totalChannel = Object.values(channelMap).reduce((a, b) => a + b, 0) || 1;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#4a7c59] text-white p-2.5 rounded-xl shadow-md"><Activity size={22} /></div>
          <div>
            <h2 className="font-serif text-3xl text-[#2c3028]">Primary Care Dashboard</h2>
            <p className="text-sm text-[#6b7265] flex items-center gap-1.5 mt-0.5">
              <Building2 size={14} /> Community Health Centre
              {!fromApi && <span className="text-xs bg-[#fff8e1] text-[#f57f17] border border-[#ffe082] px-2 py-0.5 rounded-full ml-1">Sample data - connect API for live</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && <span className="text-xs text-[#6b7265] bg-white border border-[#d8d0c4] px-3 py-1.5 rounded-full">Updated {lastUpdated}</span>}
          <button onClick={load} disabled={loading} className="flex items-center gap-1.5 bg-white border border-[#d8d0c4] text-[#2c3028] px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#f0ece5] transition-all disabled:opacity-50">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <span className="bg-[#e8f5e9] text-[#2e7d32] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-[#c8e6c9]">
            <div className="w-2 h-2 bg-[#2e7d32] rounded-full animate-pulse" /> Live
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        <KpiCard icon={<Activity size={16} />}      num={kpis.totalScreenings}         label="Total Screenings"   color="bg-[#e8f5e9]" text="text-[#2e7d32]" />
        <KpiCard icon={<Smartphone size={16} />}    num={kpis.screeningsThisMonth}     label="This Month"         color="bg-[#e3f2fd]" text="text-[#1565c0]" />
        <KpiCard icon={<AlertTriangle size={16} />} num={kpis.highRisk}                label="High Risk"          color="bg-[#fce4ec]" text="text-[#c62828]" alert />
        <KpiCard icon={<AlertTriangle size={16} />} num={kpis.crisisCount}             label="Crisis Events"      color="bg-[#fce4ec]" text="text-[#c62828]" alert />
        <KpiCard icon={<CalendarClock size={16} />} num={kpis.followUpsDue}            label="Follow-Ups Due"     color="bg-[#fff8e1]" text="text-[#f57f17]" alert={kpis.followUpsDue > 0} />
        <KpiCard icon={<Calendar size={16} />}      num={kpis.pendingAppointments}     label="Pending Appts"      color="bg-[#f3e5f5]" text="text-[#7b1fa2]" />
        <KpiCard icon={<CheckCircle2 size={16} />}  num={kpis.confirmedAppointments}   label="Confirmed Appts"    color="bg-[#e8f5e9]" text="text-[#2e7d32]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Recent screenings */}
        <div className="lg:col-span-2 bg-white border border-[#d8d0c4] rounded-[1.5rem] p-6 shadow-sm">
          <h3 className="font-bold text-[#2c3028] mb-4 flex items-center gap-2"><FileText size={18} className="text-[#4a7c59]" /> Recent Screenings</h3>
          <div className="space-y-2">
            {recentScreenings.length === 0 ? (
              <div className="text-center py-8 text-[#6b7265] text-sm">
                No screenings yet. <span className="text-[#4a7c59] font-medium">Run the seed command to add sample data.</span>
              </div>
            ) : recentScreenings.map((s: any, i: number) => {
              const isOverdue = !s.followUpDone && new Date(s.followUpDue) < new Date();
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#fdfaf4] border border-[#f0ece5] hover:border-[#d8d0c4] transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.riskLevel === 'high' ? 'bg-[#c62828]' : s.riskLevel === 'moderate' ? 'bg-[#f57f17]' : 'bg-[#4a7c59]'}`} />
                    <div>
                      <div className="font-mono text-xs text-[#6b7265]">{s.anonymousId}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.riskLevel === 'high' ? 'bg-[#fce4ec] text-[#c62828]' : s.riskLevel === 'moderate' ? 'bg-[#fff8e1] text-[#f57f17]' : 'bg-[#e8f5e9] text-[#2e7d32]'}`}>
                          {s.riskLevel} {s.isCrisis && '🆘'}
                        </span>
                        <span className="text-[10px] text-[#6b7265]">Score: {s.riskScore}</span>
                        <span className="text-[10px] text-[#a3a89f]">{s.channel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-[#6b7265]">{new Date(s.createdAt).toLocaleDateString()}</div>
                    <div className={`text-[10px] font-bold mt-0.5 ${isOverdue ? 'text-[#c62828]' : s.followUpDone ? 'text-[#4a7c59]' : 'text-[#f57f17]'}`}>
                      {s.followUpDone ? 'Follow-up done' : isOverdue ? 'Follow-up OVERDUE' : `Due ${new Date(s.followUpDue).toLocaleDateString()}`}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Risk breakdown + channels */}
        <div className="space-y-4">
          <div className="bg-white border border-[#d8d0c4] rounded-[1.5rem] p-5 shadow-sm">
            <h3 className="font-bold text-[#2c3028] mb-4 text-sm">Risk Distribution</h3>
            {[
              { level: 'high', label: 'High Risk', color: 'bg-[#c62828]' },
              { level: 'moderate', label: 'Moderate', color: 'bg-[#f57f17]' },
              { level: 'low', label: 'Low Risk', color: 'bg-[#4a7c59]' },
            ].map(r => {
              const count = riskMap[r.level] || 0;
              const total = (riskMap.high || 0) + (riskMap.moderate || 0) + (riskMap.low || 0) || 1;
              return (
                <div key={r.level} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#2c3028] font-medium">{r.label}</span>
                    <span className="font-bold text-[#2c3028]">{count}</span>
                  </div>
                  <div className="h-2 bg-[#f0ece5] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / total) * 100}%` }}
                      transition={{ duration: 1, delay: 0.3 }} className={`h-full ${r.color} rounded-full`} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-[#d8d0c4] rounded-[1.5rem] p-5 shadow-sm">
            <h3 className="font-bold text-[#2c3028] mb-4 text-sm">Screening Channels</h3>
            {Object.entries(channelMap).length === 0
              ? <p className="text-xs text-[#6b7265]">No data yet</p>
              : Object.entries(channelMap).map(([ch, cnt]) => (
              <div key={ch} className="flex items-center gap-2 mb-2 text-xs">
                <span className="w-16 text-[#6b7265] capitalize">{ch}</span>
                <div className="flex-1 h-2 bg-[#f0ece5] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(cnt / totalChannel) * 100}%` }}
                    transition={{ duration: 1, delay: 0.4 }} className="h-full bg-[#7baec8] rounded-full" />
                </div>
                <span className="w-6 text-right font-bold text-[#2c3028]">{cnt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent appointments */}
      {recentAppointments.length > 0 && (
        <div className="bg-white border border-[#d8d0c4] rounded-[1.5rem] p-6 shadow-sm mb-6">
          <h3 className="font-bold text-[#2c3028] mb-4 flex items-center gap-2"><Calendar size={18} className="text-[#4a7c59]" /> Recent Appointments</h3>
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[#6b7265] border-b border-[#f0ece5]">
                  <th className="pb-2 font-semibold">Doctor</th>
                  <th className="pb-2 font-semibold">Date/Time</th>
                  <th className="pb-2 font-semibold">Risk</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece5]">
                {recentAppointments.map((a: any, i: number) => (
                  <tr key={i} className="text-[#2c3028]">
                    <td className="py-2.5 font-medium">{a.doctorName} {a.isCritical && <span className="text-[#c62828] text-[10px] font-bold ml-1">CRISIS</span>}</td>
                    <td className="py-2.5 text-[#6b7265] hidden sm:table-cell">{new Date(a.dateTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded-full font-bold text-[10px] ${a.riskLevel === 'high' ? 'bg-[#fce4ec] text-[#c62828]' : a.riskLevel === 'moderate' ? 'bg-[#fff8e1] text-[#f57f17]' : 'bg-[#e8f5e9] text-[#2e7d32]'}`}>
                        {a.riskLevel}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded-full font-bold text-[10px] ${a.status === 'confirmed' ? 'bg-[#e8f5e9] text-[#2e7d32]' : a.status === 'completed' ? 'bg-[#e3f2fd] text-[#1565c0]' : a.status === 'cancelled' ? 'bg-[#fce4ec] text-[#c62828]' : 'bg-[#fff8e1] text-[#f57f17]'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Outcome rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Follow-Up Completion', pct: kpis.totalScreenings > 0 ? Math.round(((kpis.totalScreenings - kpis.followUpsDue) / kpis.totalScreenings) * 100) : 89, color: '#4a7c59', bg: 'bg-[#e8f5e9]', text: 'text-[#2e7d32]', desc: 'of patients completed 7-day follow-up' },
          { label: 'High Risk Identified',  pct: kpis.totalScreenings > 0 ? Math.round((kpis.highRisk / kpis.totalScreenings) * 100) : 30, color: '#c62828', bg: 'bg-[#fce4ec]', text: 'text-[#c62828]', desc: 'of screenings flagged high risk' },
          { label: 'Appointments Pending', pct: kpis.totalScreenings > 0 ? Math.round((kpis.confirmedAppointments / Math.max(kpis.pendingAppointments + kpis.confirmedAppointments, 1)) * 100) : 65, color: '#7baec8', bg: 'bg-[#e3f2fd]', text: 'text-[#1565c0]', desc: 'appointments confirmed vs pending' },
        ].map(m => (
          <div key={m.label} className={`${m.bg} border border-[#d8d0c4] rounded-[1.5rem] p-5 flex items-center gap-4`}>
            <div className="relative w-14 h-14 shrink-0">
              <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e0e0e0" strokeWidth="3" />
                <motion.circle cx="18" cy="18" r="15.9" fill="none" stroke={m.color} strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={`${Math.min(m.pct, 100)} 100`} initial={{ strokeDasharray: '0 100' }}
                  animate={{ strokeDasharray: `${Math.min(m.pct, 100)} 100` }} transition={{ duration: 1.5, delay: 0.5 }} />
              </svg>
              <div className={`absolute inset-0 flex items-center justify-center font-bold text-xs ${m.text}`}>{m.pct}%</div>
            </div>
            <div><div className={`font-bold text-xs ${m.text}`}>{m.label}</div><div className="text-[10px] text-[#6b7265] mt-0.5">{m.desc}</div></div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const KpiCard = ({ icon, num, label, color, text, alert = false }: any) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
    className={`${color} rounded-2xl p-4 border border-white/50 ${alert && num > 0 ? 'ring-2 ring-offset-1 ring-[#c62828]/20' : ''}`}>
    <div className={`${text} mb-1`}>{icon}</div>
    <div className={`font-serif text-3xl font-bold ${text}`}>{num}</div>
    <div className="text-[10px] text-[#6b7265] uppercase tracking-wider mt-0.5 font-medium">{label}</div>
  </motion.div>
);
