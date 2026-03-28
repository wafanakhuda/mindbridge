import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Building2, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle, UserX, Stethoscope } from 'lucide-react';
import { api, saveAuth } from '../api';

type Mode = 'choose' | 'login' | 'register';

const DEMO_MAP: Record<string, { role: string; name: string }> = {
  'patient@mindbridge.demo':  { role: 'patient', name: 'Demo Patient' },
  'patient2@mindbridge.demo': { role: 'patient', name: 'Test Patient' },
  'clinic@mindbridge.demo':   { role: 'clinic',  name: 'City Clinic Staff' },
  'clinic2@mindbridge.demo':  { role: 'clinic',  name: 'Wellness Hub Staff' },
  'admin@mindbridge.demo':    { role: 'admin',   name: 'System Administrator' },
};

export default function SignIn({ onSignIn }: { onSignIn: (role: string, user: any) => void }) {
  const [mode, setMode] = useState<Mode>('choose');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);

  const handlePortalSelect = (selectedRole: string, doctor = false) => {
    setRole(selectedRole);
    setIsDoctor(doctor);
    setMode('login');
    setError('');
    // Prefill demo credentials
    setEmail(`${selectedRole}@mindbridge.demo`);
    setPassword('Demo1234!');
    setName('');
  };

  const handleAnonymous = () => {
    const anonUser = {
      id: 'anon-' + Date.now(),
      email: 'anonymous@mindbridge.local',
      name: 'Anonymous User',
      role: 'patient',
      isAnonymous: true,
    };
    saveAuth('demo-token-offline', anonUser);
    onSignIn('patient', anonUser);
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
        if (password.length < 8) { setError('Password must be at least 8 characters'); setLoading(false); return; }
        res = await api.auth.register(email, password, name, role);
      }
      saveAuth(res.token, res.user);
      onSignIn(res.user.role, res.user);
    } catch (err: any) {
      // Offline demo bypass
      if (DEMO_MAP[email] && password === 'Demo1234!') {
        const demoUser = { id: 'demo-' + DEMO_MAP[email].role, email, name: DEMO_MAP[email].name, role: DEMO_MAP[email].role };
        saveAuth('demo-token-offline', demoUser);
        onSignIn(demoUser.role, demoUser);
        return;
      }
      setError(err.message?.includes('fetch') || err.message?.includes('Failed')
        ? 'Cannot reach server. Use the demo credentials to explore offline.'
        : err.message || 'Something went wrong.');
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
            className="w-full max-w-4xl relative z-10 space-y-4">

            {/* Portal cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PersonaCard icon={<User size={28} />} title="Patient Portal"
                description="Screen for anxiety and depression, access peer support, find crisis helplines, and book appointments."
                color="bg-[#e8f5e9]" iconColor="text-[#2e7d32]" borderColor="border-[#c8e6c9]"
                onClick={() => handlePortalSelect('patient')} />
              <PersonaCard icon={<Stethoscope size={28} />} title="Doctor Portal"
                description="Manage patient referrals, accept appointments, join video consultations, and track patient outcomes."
                color="bg-[#e3f2fd]" iconColor="text-[#1565c0]" borderColor="border-[#bbdefb]"
                onClick={() => handlePortalSelect('clinic', true)} />
              <PersonaCard icon={<ShieldCheck size={28} />} title="Admin Portal"
                description="System-wide analytics, user management, crisis event logs, and platform health monitoring."
                color="bg-[#f3e5f5]" iconColor="text-[#7b1fa2]" borderColor="border-[#e1bee7]"
                onClick={() => handlePortalSelect('admin')} />
            </div>

            {/* Anonymous option */}
            <div className="bg-white border border-[#d8d0c4] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f0ece5] flex items-center justify-center">
                  <UserX size={20} className="text-[#6b7265]" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#2c3028]">Continue anonymously</div>
                  <div className="text-xs text-[#6b7265]">No account needed. Your data is never stored or linked to you.</div>
                </div>
              </div>
              <button onClick={handleAnonymous}
                className="shrink-0 bg-[#f0ece5] hover:bg-[#d8d0c4] text-[#2c3028] px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2">
                <UserX size={14} /> Browse Anonymously
              </button>
            </div>
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
                {mode === 'login' ? 'Sign In' : 'Create Account'} - {isDoctor ? 'Doctor' : role}
              </h2>
            </div>

            {/* Demo hint */}
            <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl p-3 mb-5 text-xs text-[#2e7d32]">
              <strong>Demo ready.</strong> Credentials are pre-filled - just click Sign In to explore.
              {mode === 'login' && (
                <button onClick={() => setMode('register')} className="ml-2 underline font-bold">
                  Or create a real account
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-[#2c3028] mb-1">
                    {isDoctor ? 'Full Name (Dr ...)' : 'Full Name'}
                  </label>
                  <input value={name} onChange={e => setName(e.target.value)} type="text"
                    placeholder={isDoctor ? 'Dr Your Name' : 'Your full name'}
                    className="w-full border border-[#d8d0c4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/20" required />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#2c3028] mb-1">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                  placeholder="you@example.com"
                  className="w-full border border-[#d8d0c4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/20" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2c3028] mb-1">Password</label>
                <div className="relative">
                  <input value={password} onChange={e => setPassword(e.target.value)} type={showPw ? 'text' : 'password'}
                    placeholder={mode === 'register' ? 'Minimum 8 characters' : 'Your password'}
                    className="w-full border border-[#d8d0c4] rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#4a7c59] focus:ring-2 focus:ring-[#4a7c59]/20" required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-3 text-[#6b7265] hover:text-[#2c3028]">
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
                  <span>No account? <button type="button" onClick={() => { setMode('register'); setEmail(''); setPassword(''); }}
                    className="text-[#4a7c59] font-bold hover:underline">Create one free</button></span>
                ) : (
                  <span>Have an account? <button type="button" onClick={() => setMode('login')}
                    className="text-[#4a7c59] font-bold hover:underline">Sign in</button></span>
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
  <motion.div whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick}
    className={`bg-white border-2 ${borderColor} rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center group`}>
    <div className={`w-16 h-16 rounded-full ${color} ${iconColor} flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="font-serif text-lg font-bold text-[#2c3028] mb-2">{title}</h3>
    <p className="text-[#6b7265] text-xs mb-4 flex-1 leading-relaxed">{description}</p>
    <div className={`flex items-center gap-1.5 font-bold text-xs ${iconColor} group-hover:translate-x-1 transition-transform`}>
      Enter Portal <ArrowRight size={14} />
    </div>
  </motion.div>
);
