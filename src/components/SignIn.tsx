import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Building2, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { api, saveAuth } from '../api';

type Mode = 'choose' | 'login' | 'register';

export default function SignIn({ onSignIn }: { onSignIn: (role: string, user: any) => void }) {
  const [mode, setMode] = useState<Mode>('choose');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePortalSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setMode('login');
    setError('');
    // Prefill demo credentials
    setEmail(`${selectedRole}@mindbridge.demo`);
    setPassword('Demo1234!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (mode === 'login') {
        res = await api.auth.login(email, password);
      } else {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        res = await api.auth.register(email, password, name, role);
      }
      saveAuth(res.token, res.user);
      onSignIn(res.user.role, res.user);
    } catch (err: any) {
      // Offline demo bypass - lets judges use the app without a backend
      const demoMap: Record<string, { role: string; name: string }> = {
        'patient@mindbridge.demo':  { role: 'patient', name: 'Demo Patient' },
        'patient2@mindbridge.demo': { role: 'patient', name: 'Test Patient' },
        'clinic@mindbridge.demo':   { role: 'clinic',  name: 'City Clinic Staff' },
        'clinic2@mindbridge.demo':  { role: 'clinic',  name: 'Wellness Hub Staff' },
        'admin@mindbridge.demo':    { role: 'admin',   name: 'System Administrator' },
      };
      if (demoMap[email] && password === 'Demo1234!') {
        const demoUser = { id: 'demo-' + demoMap[email].role, email, name: demoMap[email].name, role: demoMap[email].role };
        saveAuth('demo-token-offline', demoUser);
        onSignIn(demoUser.role, demoUser);
        return;
      }
      setError('Could not connect to server. Use demo credentials (pre-filled) to access the app offline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ed] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#b8d4ba] rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#e8c4b4] rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#4a7c59] text-white mb-5 shadow-xl">
          <span className="text-4xl">🌿</span>
        </div>
        <h1 className="font-serif text-5xl font-bold text-[#2c3028] mb-3">MindBridge</h1>
        <p className="text-[#6b7265] text-base max-w-md mx-auto">
          Hack for Health Equity 2026 - Young AI Leaders
        </p>
        <p className="text-xs text-[#a3a89f] mt-1">
          Dr Victoria Thomas, Dr Nameera Banu, Dr Chidinma Ndiagwalu, Wafa Nakhuda
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === 'choose' && (
          <motion.div key="choose" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl w-full relative z-10">
            <PersonaCard icon={<User size={30} />} title="Patient Portal" description="Screen for anxiety and depression, access peer support, find crisis helplines, and book appointments with doctors."
              color="bg-[#e8f5e9]" iconColor="text-[#2e7d32]" borderColor="border-[#c8e6c9]" onClick={() => handlePortalSelect('patient')} />
            <PersonaCard icon={<Building2 size={30} />} title="Clinic Portal" description="View live patient triage data, manage referrals, track outcomes, and access clinical screening tools."
              color="bg-[#e3f2fd]" iconColor="text-[#1565c0]" borderColor="border-[#bbdefb]" onClick={() => handlePortalSelect('clinic')} />
            <PersonaCard icon={<ShieldCheck size={30} />} title="Admin Portal" description="System-wide analytics, user management, crisis event logs, and platform health monitoring."
              color="bg-[#f3e5f5]" iconColor="text-[#7b1fa2]" borderColor="border-[#e1bee7]" onClick={() => handlePortalSelect('admin')} />
          </motion.div>
        )}

        {(mode === 'login' || mode === 'register') && (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2rem] border border-[#d8d0c4] shadow-xl p-8 max-w-md w-full relative z-10">

            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setMode('choose')} className="text-[#6b7265] hover:text-[#2c3028] text-sm font-medium">
                Back
              </button>
              <div className="h-4 w-px bg-[#d8d0c4]" />
              <h2 className="font-serif text-2xl text-[#2c3028] capitalize">
                {mode === 'login' ? 'Sign In' : 'Create Account'} - {role}
              </h2>
            </div>

            {/* Demo credentials hint */}
            <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl p-3 mb-5 text-xs text-[#2e7d32]">
              <strong>Demo credentials pre-filled.</strong> Click Sign In to access the {role} portal with sample data.
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-[#2c3028] mb-1">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Your full name"
                    className="w-full border border-[#d8d0c4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/20" required />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#2c3028] mb-1">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com"
                  className="w-full border border-[#d8d0c4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/20" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c3028] mb-1">Password</label>
                <div className="relative">
                  <input value={password} onChange={e => setPassword(e.target.value)} type={showPw ? 'text' : 'password'} placeholder="Your password"
                    className="w-full border border-[#d8d0c4] rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/20" required />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-[#6b7265] hover:text-[#2c3028]">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-[#fce4ec] border border-[#f48fb1] rounded-xl p-3 text-sm text-[#c62828]">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-[#4a7c59] hover:bg-[#3a6b3e] disabled:bg-[#d8d0c4] text-white py-3.5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-md">
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                {!loading && <ArrowRight size={18} />}
              </button>

              <div className="text-center text-sm text-[#6b7265]">
                {mode === 'login' ? (
                  <span>No account? <button type="button" onClick={() => setMode('register')} className="text-[#4a7c59] font-bold hover:underline">Create one</button></span>
                ) : (
                  <span>Have an account? <button type="button" onClick={() => setMode('login')} className="text-[#4a7c59] font-bold hover:underline">Sign in</button></span>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-[#a3a89f] mt-8 text-center max-w-md relative z-10">
        While MindBridge uses validated mental health screening tools, this is a hackathon prototype for educational purposes and not a substitute for professional medical advice.
      </p>
    </div>
  );
}

const PersonaCard = ({ icon, title, description, color, iconColor, borderColor, onClick }: any) => (
  <motion.div whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick}
    className={`bg-white border-2 ${borderColor} rounded-[2rem] p-7 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center group`}>
    <div className={`w-18 h-18 w-[72px] h-[72px] rounded-full ${color} ${iconColor} flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="font-serif text-xl font-bold text-[#2c3028] mb-2">{title}</h3>
    <p className="text-[#6b7265] text-sm mb-6 flex-1 leading-relaxed">{description}</p>
    <div className={`flex items-center gap-2 font-bold text-sm ${iconColor} group-hover:translate-x-1 transition-transform`}>
      Enter Portal <ArrowRight size={16} />
    </div>
  </motion.div>
);
