import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, MessageCircle, Phone, BookOpen, BarChart3, LogOut, ShieldCheck, Stethoscope, Activity, LayoutGrid, X, Video, Users, Globe2, Heart } from 'lucide-react';
import Home from './components/Home';
import Screening from './components/Screening';
import Community from './components/Community';
import PeerCommunity from './components/PeerCommunity';
import Directory from './components/Directory';
import Resources from './components/Resources';
import ClinicalResources from './components/ClinicalResources';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import AdminDashboard from './components/AdminDashboard';
import MyHealth from './components/MyHealth';
import Team from './components/Team';
import VideoConsult from './components/VideoConsult';
import { clearAuth, getStoredUser } from './api';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Route map — URL path to tab id
  const ROUTES: Record<string, string> = {
    '/': 'home', '/home': 'home',
    '/screening': 'screening', '/check-in': 'screening',
    '/community': 'community',
    '/peer': 'peer', '/peer-space': 'peer',
    '/directory': 'directory', '/helplines': 'directory',
    '/resources': 'resources',
    '/clinical': 'clinical', '/clinical-tools': 'clinical',
    '/dashboard': 'dashboard',
    '/my-health': 'myhealth', '/myhealth': 'myhealth',
    '/team': 'team', '/our-team': 'team',
    '/video': 'video', '/video-consult': 'video',
    '/admin': 'admin',
  };
  const TAB_TO_PATH: Record<string, string> = {
    home: '/', screening: '/screening', community: '/community',
    peer: '/peer', directory: '/helplines', resources: '/resources',
    clinical: '/clinical', dashboard: '/dashboard',
    myhealth: '/my-health', team: '/our-team',
    video: '/video', admin: '/admin',
  };

  const [userRole, setUserRole]               = useState<string | null>(null);
  const [currentUser, setCurrentUser]         = useState<any>(null);
  const [showCrisisStrip, setShowCrisisStrip] = useState(true);
  const [showMoreMenu, setShowMoreMenu]       = useState(false);

  // Derive current tab from URL
  const currentTab = ROUTES[location.pathname] || 'home';

  // Navigate to tab → update URL
  const setCurrentTab = (tab: string) => {
    const path = TAB_TO_PATH[tab] || '/';
    navigate(path);
    setShowMoreMenu(false);
  };

  // Restore session on mount
  useEffect(() => {
    const u = getStoredUser();
    if (u) { setCurrentUser(u); setUserRole(u.role); }
  }, []);

  const handleSignIn = (role: string, user: any) => {
    setUserRole(role);
    setCurrentUser(user);
    setCurrentTab(role === 'admin' ? 'admin' : role === 'clinic' ? 'dashboard' : 'home');
  };

  const handleSignOut = () => {
    clearAuth();
    setUserRole(null);
    setCurrentUser(null);
    setShowCrisisStrip(true);
    navigate('/');
  };

  if (!userRole) return <SignIn onSignIn={handleSignIn} />;

  const renderTab = () => {
    const titles: Record<string, string> = {
      home: 'MindBridge', screening: 'MindBridge - Check-In',
      community: 'MindBridge - Community', peer: 'MindBridge - Peer Space',
      directory: 'MindBridge - Helplines', resources: 'MindBridge - Resources',
      clinical: 'MindBridge - Clinical Tools', dashboard: 'MindBridge - Dashboard',
      myhealth: 'MindBridge - My Health', team: 'MindBridge - Our Team',
      admin: 'MindBridge - Admin', video: 'MindBridge - Video Consult',
    };
    document.title = titles[currentTab] || 'MindBridge';

    switch (currentTab) {
      case 'home':       return <Home setTab={setCurrentTab} />;
      case 'screening':  return <Screening setTab={setCurrentTab} currentUser={currentUser} />;
      case 'community':  return <Community setTab={setCurrentTab} />;
      case 'peer':       return <PeerCommunity setTab={setCurrentTab} />;
      case 'directory':  return <Directory />;
      case 'resources':  return <Resources />;
      case 'clinical':   return <ClinicalResources />;
      case 'dashboard':  return <Dashboard />;
      case 'myhealth':   return <MyHealth setTab={setCurrentTab} />;
      case 'team':       return <Team />;
      case 'video':      return <VideoConsult />;
      case 'admin':      return <AdminDashboard />;
      default:           return <Home setTab={setCurrentTab} />;
    }
  };

  // ── NAV CONFIG ─────────────────────────────────────────────────
  // Patient: 5 primary tabs + "More" dropdown for secondary screens
  const patientPrimary = [
    { id: 'home',      icon: <HomeIcon size={16} />,      label: 'Home' },
    { id: 'screening', icon: <MessageCircle size={16} />, label: 'Screening' },
    { id: 'myhealth',  icon: <Activity size={16} />,      label: 'My Health' },
    { id: 'resources', icon: <BookOpen size={16} />,      label: 'Resources' },
    { id: 'directory', icon: <Phone size={16} />,         label: 'Helplines' },
  ];
  const patientMore = [
    { id: 'video',     icon: <Video size={16} />,   label: 'Video Consult' },
    { id: 'community', icon: <Globe2 size={16} />,  label: 'Community' },
    { id: 'peer',      icon: <Users size={16} />,   label: 'Peer Space' },
    { id: 'team',      icon: <Heart size={16} />,   label: 'Our Team' },
  ];
  const patientMobile = [
    { id: 'home',      icon: <HomeIcon size={20} />,      label: 'Home' },
    { id: 'screening', icon: <MessageCircle size={20} />, label: 'Screen' },
    { id: 'myhealth',  icon: <Activity size={20} />,      label: 'Health' },
    { id: 'resources', icon: <BookOpen size={20} />,      label: 'Resources' },
    { id: 'directory', icon: <Phone size={20} />,         label: 'Helplines' },
  ];

  const clinicPrimary = [
    { id: 'dashboard', icon: <BarChart3 size={16} />,    label: 'Dashboard' },
    { id: 'clinical',  icon: <Stethoscope size={16} />,  label: 'Clinical Tools' },
    { id: 'directory', icon: <Phone size={16} />,         label: 'Helplines' },
  ];

  const adminPrimary = [
    { id: 'admin',     icon: <ShieldCheck size={16} />,  label: 'Admin' },
    { id: 'dashboard', icon: <BarChart3 size={16} />,    label: 'Dashboard' },
  ];

  const primaryTabs = userRole === 'patient' ? patientPrimary
    : userRole === 'clinic' ? clinicPrimary : adminPrimary;

  const isMoreTabActive = patientMore.some(t => t.id === currentTab);

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#2c3028] font-sans">

      {/* Crisis Strip */}
      {userRole === 'patient' && showCrisisStrip && (
        <div className="bg-[#c4605a] text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2 flex-wrap">
          <span>If you are in crisis, help is available right now.</span>
          <button onClick={() => setCurrentTab('directory')} className="underline font-bold">Find your helpline</button>
          <span className="opacity-60">|</span>
          <a href="https://wa.me/2202010001" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 font-bold underline">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Message us now
          </a>
          <button onClick={() => setShowCrisisStrip(false)} className="ml-2 opacity-60 hover:opacity-100 font-bold text-lg leading-none" aria-label="Dismiss">×</button>
        </div>
      )}

      {/* Nav */}
      <nav className="bg-[#4a7c59] px-4 py-3 sticky top-0 z-50 shadow-md flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => setCurrentTab(userRole === 'patient' ? 'home' : userRole === 'clinic' ? 'dashboard' : 'admin')}
          className="flex items-center gap-2 text-white font-serif text-xl font-bold shrink-0">
          <span>🌿</span> MindBridge
          {currentUser && (
            <span className="text-xs font-sans bg-white/20 px-2 py-0.5 rounded-full ml-1 hidden sm:inline truncate max-w-[120px]">
              {currentUser?.name}
            </span>
          )}
        </button>

        {/* Desktop tabs */}
        <div className="hidden md:flex items-center gap-1">
          {primaryTabs.map(t => (
            <NavButton key={t.id} active={currentTab === t.id} onClick={() => setCurrentTab(t.id)} icon={t.icon} label={t.label} />
          ))}

          {/* More dropdown - patient only */}
          {userRole === 'patient' && (
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(m => !m)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isMoreTabActive ? 'bg-white/25 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}>
                <LayoutGrid size={15} /> More {isMoreTabActive && '•'}
              </button>
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-[#d8d0c4] py-2 min-w-[160px] z-50">
                    {patientMore.map(t => (
                      <button key={t.id} onClick={() => { setCurrentTab(t.id); setShowMoreMenu(false); }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                          currentTab === t.id ? 'bg-[#e8f5e9] text-[#4a7c59] font-bold' : 'text-[#2c3028] hover:bg-[#f0ece5]'
                        }`}>
                        <span className="text-[#4a7c59]">{t.icon}</span> {t.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* WhatsApp */}
          <a href="https://wa.me/+2202010001" target="_blank" rel="noopener noreferrer"
            title="Contact us on WhatsApp"
            className="flex items-center gap-1.5 text-white/70 hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>

          {/* Sign out */}
          <button onClick={handleSignOut}
            className="flex items-center gap-1.5 text-white/70 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ml-1">
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Mobile: sign out only */}
        {/* Mobile: WhatsApp + sign out */}
        <div className="md:hidden flex items-center gap-1">
          <a href="https://wa.me/+2202010001" target="_blank" rel="noopener noreferrer"
            className="text-white/70 hover:text-white p-2">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          <button onClick={handleSignOut} className="text-white/70 hover:text-white p-2">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="pb-28 md:pb-8">{renderTab()}</main>

      {/* Desktop footer disclaimer */}
      <div className="hidden md:block bg-white border-t border-[#d8d0c4] py-5 px-6 text-center">
        <p className="text-xs text-[#a3a89f] max-w-3xl mx-auto">
          MindBridge is a hackathon prototype for Hack for Health Equity 2026. Not a substitute for professional medical advice. If you are in crisis, please contact emergency services or a crisis helpline immediately.
        </p>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden mobile-nav fixed bottom-0 left-0 right-0 bg-[#4a7c59] text-white z-50 shadow-[0_-2px_12px_rgba(0,0,0,0.15)]">
        <div className="flex justify-around py-1">
          {userRole === 'patient' && (
            <>
              {patientMobile.map(t => (
                <MobileNavButton key={t.id} active={currentTab === t.id} onClick={() => setCurrentTab(t.id)} icon={t.icon} label={t.label} />
              ))}
              {/* More button for mobile */}
              <div className="relative">
                <MobileNavButton
                  active={isMoreTabActive || showMoreMenu}
                  onClick={() => setShowMoreMenu(m => !m)}
                  icon={<LayoutGrid size={20} />}
                  label="More"
                />
                {showMoreMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                    <div className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-xl border border-[#d8d0c4] py-2 min-w-[160px] z-50">
                      {patientMore.map(t => (
                        <button key={t.id} onClick={() => { setCurrentTab(t.id); setShowMoreMenu(false); }}
                          className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors ${
                            currentTab === t.id ? 'bg-[#e8f5e9] text-[#4a7c59] font-bold' : 'text-[#2c3028] hover:bg-[#f0ece5]'
                          }`}>
                          <span className="text-[#4a7c59]">{t.icon}</span> {t.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {userRole === 'clinic' && (
            <>
              <MobileNavButton active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} icon={<BarChart3 size={20} />}   label="Dashboard" />
              <MobileNavButton active={currentTab === 'clinical'}  onClick={() => setCurrentTab('clinical')}  icon={<Stethoscope size={20} />} label="Tools" />
              <MobileNavButton active={currentTab === 'directory'} onClick={() => setCurrentTab('directory')} icon={<Phone size={20} />}        label="Helplines" />
              <MobileNavButton active={false} onClick={handleSignOut} icon={<LogOut size={20} />} label="Sign Out" />
            </>
          )}
          {userRole === 'admin' && (
            <>
              <MobileNavButton active={currentTab === 'admin'}     onClick={() => setCurrentTab('admin')}     icon={<ShieldCheck size={20} />} label="Admin" />
              <MobileNavButton active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} icon={<BarChart3 size={20} />}   label="Dashboard" />
              <MobileNavButton active={false} onClick={handleSignOut} icon={<LogOut size={20} />} label="Sign Out" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
      active ? 'bg-white/25 text-white shadow-inner' : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`}>
    {icon} {label}
  </button>
);

const MobileNavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick}
    className={`flex flex-col items-center gap-0.5 py-1.5 px-2 min-w-[52px] min-h-[48px] justify-center transition-all ${
      active ? 'text-white' : 'text-white/50 hover:text-white/75'
    }`}>
    <div className={`transition-transform ${active ? 'scale-110' : 'scale-100'}`}>{icon}</div>
    <span className={`text-[9px] font-medium leading-tight tracking-wide ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
  </button>
);
