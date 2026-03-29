import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Calendar, Clock, Video, RefreshCw, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { api, isOfflineDemo } from '../api';

interface Screening {
  _id: string; anonymousId: string; phqScore: number; gadScore: number;
  riskLevel: 'low' | 'moderate' | 'high'; riskScore: number; channel: string;
  isCrisis: boolean; followUpDue: string; followUpDone: boolean; createdAt: string;
}
interface Appointment {
  _id: string; doctorName: string; doctorSpeciality: string; clinicName: string;
  clinicLocation: string; dateTime: string; status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  riskLevel: string; isCritical: boolean; notes: string; meetingLink?: string; createdAt: string;
}

// Demo data shown when offline
const DEMO_SCREENINGS: Screening[] = [
  { _id: '1', anonymousId: 'anon-demo-1009', phqScore: 4, gadScore: 5, riskLevel: 'high', riskScore: 75, channel: 'web', isCrisis: false, followUpDone: false, followUpDue: new Date(Date.now() + 5 * 86400000).toISOString(), createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { _id: '2', anonymousId: 'anon-demo-1005', phqScore: 2, gadScore: 3, riskLevel: 'moderate', riskScore: 42, channel: 'web', isCrisis: false, followUpDone: true, followUpDue: new Date(Date.now() - 2 * 86400000).toISOString(), createdAt: new Date(Date.now() - 8 * 86400000).toISOString() },
  { _id: '3', anonymousId: 'anon-demo-1001', phqScore: 1, gadScore: 1, riskLevel: 'low', riskScore: 17, channel: 'web', isCrisis: false, followUpDone: true, followUpDue: new Date(Date.now() - 9 * 86400000).toISOString(), createdAt: new Date(Date.now() - 15 * 86400000).toISOString() },
];
const DEMO_APPOINTMENTS: Appointment[] = [
  { _id: '1', doctorName: 'Dr Sarah Chen', doctorSpeciality: 'Psychiatry', clinicName: 'City Mental Health Centre', clinicLocation: 'London, UK', dateTime: new Date(Date.now() + 2 * 3600000).toISOString(), status: 'confirmed', riskLevel: 'high', isCritical: true, notes: '', meetingLink: 'https://meet.jit.si/mindbridge-demo-001', createdAt: new Date().toISOString() },
  { _id: '2', doctorName: 'Dr Priya Sharma', doctorSpeciality: 'General Psychiatry', clinicName: 'NIMHANS Community Clinic', clinicLocation: 'Bangalore, India', dateTime: new Date(Date.now() + 48 * 3600000).toISOString(), status: 'pending', riskLevel: 'moderate', isCritical: false, notes: 'Follow-up from last session', createdAt: new Date().toISOString() },
];

const RISK_STYLE: Record<string, string> = {
  low: 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]',
  moderate: 'bg-[#fff8e1] text-[#f57f17] border-[#ffe082]',
  high: 'bg-[#fce4ec] text-[#c62828] border-[#f48fb1]',
};
const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-[#fff8e1] text-[#f57f17]',
  confirmed: 'bg-[#e8f5e9] text-[#2e7d32]',
  completed: 'bg-[#e3f2fd] text-[#1565c0]',
  cancelled: 'bg-[#fce4ec] text-[#c62828]',
};

export default function MyHealth({ setTab }: { setTab?: (tab: string) => void }) {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'appointments' | 'screenings'>('appointments');
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');

    // Offline demo mode - show sample data
    if (isOfflineDemo()) {
      setScreenings(DEMO_SCREENINGS);
      setAppointments(DEMO_APPOINTMENTS);
      setLoading(false);
      return;
    }

    try {
      const [sRes, aRes] = await Promise.all([
        api.screenings.myHistory(),
        api.appointments.myAppointments(),
      ]);
      setScreenings(sRes.screenings || []);
      setAppointments(aRes.appointments || []);
    } catch (e: any) {
      if (e.message === 'OFFLINE_MODE') {
        setScreenings(DEMO_SCREENINGS);
        setAppointments(DEMO_APPOINTMENTS);
        } else {
        setError('Could not load your health record. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const upcoming = appointments.filter(a => new Date(a.dateTime) > new Date() && a.status !== 'cancelled');
  const past = appointments.filter(a => new Date(a.dateTime) <= new Date() || a.status === 'cancelled');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-4 py-8">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-3xl text-[#2c3028]">My Health Record</h2>
          <p className="text-sm text-[#6b7265] mt-0.5">Your screening history and appointments</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 bg-white border border-[#d8d0c4] text-[#2c3028] px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#f0ece5] transition-all">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>


      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
        {[
          { num: screenings.length, label: 'Screenings' },
          { num: upcoming.length, label: 'Upcoming Appts' },
          { num: screenings.filter(s => s.followUpDone).length, label: 'Follow-ups Done' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#d8d0c4] rounded-2xl p-4 text-center shadow-sm">
            <div className="font-serif text-3xl font-bold text-[#4a7c59]">{s.num}</div>
            <div className="text-xs text-[#6b7265] uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'appointments' ? 'bg-[#4a7c59] text-white' : 'bg-white border border-[#d8d0c4] text-[#6b7265] hover:border-[#4a7c59]'}`}>
          <Calendar size={14} /> Appointments
        </button>
        <button onClick={() => setActiveTab('screenings')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'screenings' ? 'bg-[#4a7c59] text-white' : 'bg-white border border-[#d8d0c4] text-[#6b7265] hover:border-[#4a7c59]'}`}>
          <Activity size={14} /> Screening History
        </button>
      </div>

      {error && (
        <div className="bg-[#fce4ec] border border-[#f48fb1] rounded-xl p-4 mb-4 flex items-start gap-2 text-sm text-[#c62828]">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <div>{error} <button onClick={load} className="underline font-bold ml-1">Retry</button></div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-[#6b7265]">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-[#4a7c59]" />
          Loading your health record...
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'appointments' && (
            <motion.div key="appts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {appointments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#d8d0c4]">
                  <Calendar size={32} className="mx-auto mb-3 text-[#d8d0c4]" />
                  <p className="text-[#6b7265] font-medium">No appointments yet</p>
                  <button onClick={() => setTab && setTab('screening')}
                    className="mt-3 text-sm text-[#4a7c59] font-bold hover:underline">
                    Take a screening to get matched with a doctor
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcoming.length > 0 && (
                    <>
                      <h3 className="text-xs font-bold text-[#6b7265] uppercase tracking-widest">Upcoming</h3>
                      {upcoming.map(a => <AppointmentCard key={a._id} appt={a} expanded={expanded === a._id} onToggle={() => setExpanded(expanded === a._id ? null : a._id)} />)}
                    </>
                  )}
                  {past.length > 0 && (
                    <>
                      <h3 className="text-xs font-bold text-[#6b7265] uppercase tracking-widest mt-4">Past</h3>
                      {past.map(a => <AppointmentCard key={a._id} appt={a} expanded={expanded === a._id} onToggle={() => setExpanded(expanded === a._id ? null : a._id)} />)}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'screenings' && (
            <motion.div key="screens" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {screenings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#d8d0c4]">
                  <Activity size={32} className="mx-auto mb-3 text-[#d8d0c4]" />
                  <p className="text-[#6b7265] font-medium">No screenings recorded yet</p>
                  <button onClick={() => setTab && setTab('screening')}
                    className="mt-3 text-sm text-[#4a7c59] font-bold hover:underline">
                    Take your first screening
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {screenings.map((s, i) => {
                    const isOverdue = !s.followUpDone && new Date(s.followUpDue) < new Date();
                    return (
                      <motion.div key={s._id || i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="bg-white border border-[#d8d0c4] rounded-2xl p-4 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold border-2 ${RISK_STYLE[s.riskLevel]}`}>
                              {s.riskScore}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${RISK_STYLE[s.riskLevel]}`}>
                                  {s.riskLevel.charAt(0).toUpperCase() + s.riskLevel.slice(1)} Risk {s.isCrisis && '🆘'}
                                </span>
                              </div>
                              <div className="flex gap-3 mt-1 text-xs text-[#6b7265]">
                                <span>PHQ-2: {s.phqScore}/6</span>
                                <span>GAD-2: {s.gadScore}/6</span>
                                <span className="capitalize">{s.channel}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs text-[#6b7265]">{new Date(s.createdAt).toLocaleDateString()}</div>
                            <div className={`text-xs font-bold mt-1 ${isOverdue ? 'text-[#c62828]' : s.followUpDone ? 'text-[#4a7c59]' : 'text-[#f57f17]'}`}>
                              {s.followUpDone ? 'Follow-up done' : isOverdue ? 'Follow-up overdue' : `Due ${new Date(s.followUpDue).toLocaleDateString()}`}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

function AppointmentCard({ appt, expanded, onToggle }: { appt: Appointment; expanded: boolean; onToggle: () => void }) {
  const isUpcoming = new Date(appt.dateTime) > new Date() && appt.status !== 'cancelled';
  return (
    <motion.div layout className={`bg-white border-2 rounded-2xl overflow-hidden transition-all ${appt.isCritical ? 'border-[#f48fb1]' : 'border-[#d8d0c4]'}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left hover:bg-[#fdfaf4] transition-colors">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${isUpcoming ? 'bg-[#e8f5e9]' : 'bg-[#f0ece5]'} flex items-center justify-center`}>
            <Calendar size={18} className={isUpcoming ? 'text-[#4a7c59]' : 'text-[#6b7265]'} />
          </div>
          <div>
            <div className="font-bold text-sm text-[#2c3028]">
              {appt.doctorName}
              {appt.isCritical && <span className="text-xs text-[#c62828] font-bold ml-1">EMERGENCY</span>}
            </div>
            <div className="text-xs text-[#6b7265]">{appt.doctorSpeciality} - {appt.clinicLocation}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[appt.status]}`}>{appt.status}</span>
          {expanded ? <ChevronUp size={16} className="text-[#6b7265]" /> : <ChevronDown size={16} className="text-[#6b7265]" />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#f0ece5] px-4 pb-4 pt-3 space-y-2.5">
            <div className="flex items-center gap-2 text-sm text-[#2c3028]">
              <Clock size={14} className="text-[#4a7c59]" />
              {new Date(appt.dateTime).toLocaleString([], { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-[#6b7265]">{appt.clinicName}</div>
            {appt.notes && <div className="text-xs text-[#6b7265] bg-[#f0ece5] rounded-lg px-3 py-2">Notes: {appt.notes}</div>}
            {appt.meetingLink && (
              <a href={appt.meetingLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#4a7c59] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#3a6b3e] transition-all w-full justify-center">
                <Video size={15} /> Join Video Call
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
