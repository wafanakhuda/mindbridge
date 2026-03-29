import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Server, Users, Activity, Building2, AlertTriangle, Globe2, LayoutTemplate, RefreshCw, Download } from 'lucide-react';
import ArchitectureDocs from './ArchitectureDocs';
import { api } from '../api';

const SEED_ADMIN = { totalUsers: 5, totalScreenings: 10, totalAppointments: 10, crisisEvents: 1, doctors: 10, usersByRole: [{ _id: 'patient', count: 2 }, { _id: 'clinic', count: 2 }, { _id: 'admin', count: 1 }] };

export default function AdminDashboard() {
  const [showDocs, setShowDocs] = useState(false);
  const [data, setData] = useState(SEED_ADMIN);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.dashboard.admin();
      setData(res);
      setFromApi(true);
    } catch {
      setData(SEED_ADMIN);
      setFromApi(false);
    } finally {
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  useEffect(() => { load(); }, []);

  if (showDocs) return <ArchitectureDocs onBack={() => setShowDocs(false)} />;

  const roleMap = Object.fromEntries((data.usersByRole || []).map((r: any) => [r._id, r.count]));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#7b1fa2] text-white p-2.5 rounded-xl shadow-md"><ShieldCheck size={22} /></div>
          <div>
            <h2 className="font-serif text-3xl text-[#2c3028]">System Administration</h2>
            <p className="text-sm text-[#6b7265] flex items-center gap-1.5 mt-0.5">
              <Server size={14} /> MindBridge Global Platform
              {!fromApi && <span className="text-xs bg-[#fff8e1] text-[#f57f17] border border-[#ffe082] px-2 py-0.5 rounded-full ml-1">Sample data</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && <span className="text-xs text-[#6b7265] bg-white border border-[#d8d0c4] px-3 py-1.5 rounded-full">Updated {lastUpdated}</span>}
          <button onClick={load} disabled={loading} className="flex items-center gap-1.5 bg-white border border-[#d8d0c4] text-[#2c3028] px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#f0ece5] transition-all">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={() => setShowDocs(true)} className="flex items-center gap-1.5 bg-white border border-[#d8d0c4] text-[#2c3028] px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#f0ece5] transition-all">
            <LayoutTemplate size={13} /> System Docs
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6 sm:mb-8">
        <KpiCard icon={<Users size={16} />}         label="Total Users"        num={data.totalUsers}         color="bg-[#e3f2fd]" text="text-[#1565c0]" />
        <KpiCard icon={<Activity size={16} />}      label="Total Screenings"   num={data.totalScreenings}    color="bg-[#e8f5e9]" text="text-[#2e7d32]" />
        <KpiCard icon={<Building2 size={16} />}     label="Doctors"            num={data.doctors}            color="bg-[#f3e5f5]" text="text-[#7b1fa2]" />
        <KpiCard icon={<Globe2 size={16} />}        label="Appointments"       num={data.totalAppointments}  color="bg-[#fff8e1]" text="text-[#f57f17]" />
        <KpiCard icon={<AlertTriangle size={16} />} label="Crisis Events"      num={data.crisisEvents}       color="bg-[#fce4ec]" text="text-[#c62828]" alert />
        <KpiCard icon={<ShieldCheck size={16} />}   label="System Alerts"      num={0}                       color="bg-[#e8f5e9]" text="text-[#2e7d32]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

        {/* Users by role */}
        <div className="bg-white border border-[#d8d0c4] rounded-[1.5rem] p-6 shadow-sm">
          <h3 className="font-bold text-[#2c3028] mb-4 flex items-center gap-2"><Users size={16} className="text-[#4a7c59]" /> Users by Role</h3>
          <div className="space-y-3">
            {[
              { role: 'patient', label: 'Patients', color: 'bg-[#4a7c59]' },
              { role: 'clinic',  label: 'Clinic Staff', color: 'bg-[#1565c0]' },
              { role: 'admin',   label: 'Administrators', color: 'bg-[#7b1fa2]' },
            ].map(r => {
              const count = roleMap[r.role] || 0;
              const total = data.totalUsers || 1;
              return (
                <div key={r.role}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#2c3028] font-medium">{r.label}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="h-2.5 bg-[#f0ece5] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / total) * 100}%` }}
                      transition={{ duration: 1 }} className={`h-full ${r.color} rounded-full`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System health */}
        <div className="bg-white border border-[#d8d0c4] rounded-[1.5rem] p-6 shadow-sm">
          <h3 className="font-bold text-[#2c3028] mb-4 flex items-center gap-2"><Server size={16} className="text-[#4a7c59]" /> System Health</h3>
          <div className="space-y-2">
            {[
              { label: 'Frontend (React + Vite)', status: 'Operational', ok: true },
              { label: 'API Server (Express)',     status: fromApi ? 'Connected' : 'Offline - using seed data', ok: fromApi },
              { label: 'MongoDB Atlas',            status: fromApi ? 'Connected' : 'Check MONGODB_URI env var', ok: fromApi },
              { label: 'Gemini AI Agents',         status: 'Check VITE_GEMINI_API_KEY', ok: true },
              { label: 'Global Directory',         status: '195 countries loaded', ok: true },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-[#f0ece5] last:border-0">
                <span className="text-xs text-[#2c3028]">{s.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.ok ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#fce4ec] text-[#c62828]'}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deploy checklist */}
      <div className="bg-gradient-to-br from-[#2c3028] to-[#3a4035] rounded-[1.5rem] p-6 text-white">
        <h3 className="font-bold mb-4 flex items-center gap-2"><ShieldCheck size={16} /> Production Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {[
            { label: 'VITE_GEMINI_API_KEY set in Railway',        done: false, note: 'aistudio.google.com/app/apikey (free)' },
            { label: 'MONGODB_URI set in Railway',                done: fromApi, note: 'cloud.mongodb.com (free cluster)' },
            { label: 'JWT_SECRET set to long random string',      done: fromApi, note: 'Any 32+ char random string' },
            { label: 'VITE_API_URL set to Railway backend URL',   done: fromApi, note: 'https://your-app.railway.app/api' },
            { label: 'Run npm run seed after first deploy',       done: fromApi, note: 'Creates demo accounts + 10 sample records' },
            { label: 'Frontend deployed and accessible',          done: true,    note: 'Railway/Netlify/Vercel' },
          ].map(item => (
            <div key={item.label} className={`flex items-start gap-2 p-2.5 rounded-xl ${item.done ? 'bg-white/10' : 'bg-white/5'}`}>
              <span className={`text-base shrink-0 ${item.done ? 'text-[#4a7c59]' : 'text-white/40'}`}>{item.done ? '✓' : '○'}</span>
              <div>
                <div className={`font-medium ${item.done ? 'text-white' : 'text-white/60'}`}>{item.label}</div>
                <div className="text-white/40 text-[10px]">{item.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const KpiCard = ({ icon, num, label, color, text, alert = false }: any) => (
  <div className={`${color} rounded-2xl p-4 ${alert && num > 0 ? 'ring-2 ring-offset-1 ring-[#c62828]/30' : ''}`}>
    <div className={`${text} mb-1`}>{icon}</div>
    <div className={`font-serif text-3xl font-bold ${text}`}>{num}</div>
    <div className="text-[10px] text-[#6b7265] uppercase tracking-wider mt-0.5 font-medium leading-tight">{label}</div>
  </div>
);
