import { useState, useEffect } from 'react';
import { Home as HomeIcon, MessageCircle, Users, Phone, BookOpen, BarChart3, LogOut, ShieldCheck, Heart, Globe2, Stethoscope, Activity, Video } from 'lucide-react';
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [showCrisisStrip, setShowCrisisStrip] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUserRole(stored.role);
      setCurrentUser(stored);
      setCurrentTab(stored.role === 'patient' ? 'home' : stored.role === 'clinic' ? 'dashboard' : 'admin');
    }
  }, []);

  const handleSignIn = (role: string, user: any) => {
    setUserRole(role);
    setCurrentUser(user);
    setCurrentTab(role === 'patient' ? 'home' : role === 'clinic' ? 'dashboard' : 'admin');
  };

  const handleSignOut = () => {
    clearAuth();
    setUserRole(null);
    setCurrentUser(null);
    setCurrentTab('home');
  };

  const renderTab = () => {
    const titles: Record<string, string> = {
      home: 'MindBridge - Home', screening: 'MindBridge - Check-In',
      community: 'MindBridge - Community', peer: 'MindBridge - Peer Space',
      directory: 'MindBridge - Global Directory', resources: 'MindBridge - Resources',
      clinical: 'MindBridge - Clinical Tools', dashboard: 'MindBridge - Dashboard',
      myhealth: 'MindBridge - My Health', team: 'MindBridge - Our Team',
      admin: 'MindBridge - Administration', video: 'MindBridge - Video Consult',
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
      case 'video':      return <VideoConsult />;
      case 'team':       return <Team />;
      case 'admin':      return <AdminDashboard />;
      default:           return <Home setTab={setCurrentTab} />;
    }
  };

  if (!userRole) return <SignIn onSignIn={handleSignIn} />;

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#2c3028] font-sans">
      {/* Crisis Strip - dismissible */}
      {userRole === 'patient' && showCrisisStrip && (
        <div className="bg-[#c4605a] text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2 flex-wrap">
          <span>If you are in crisis, help is available right now.</span>
          <button onClick={() => setCurrentTab('directory')} className="underline font-bold">Find your country helpline</button>
          <button onClick={() => setShowCrisisStrip(false)} className="ml-2 opacity-60 hover:opacity-100 text-white font-bold text-base leading-none" aria-label="Dismiss">×</button>
        </div>
      )}

      {/* Nav */}
      <nav className="bg-[#4a7c59] px-4 md:px-6 py-3 sticky top-0 z-50 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-serif text-xl font-bold cursor-pointer shrink-0"
          onClick={() => setCurrentTab(userRole === 'patient' ? 'home' : userRole === 'clinic' ? 'dashboard' : 'admin')}>
          <span>🌿</span> MindBridge
          {currentUser && (
            <span className="text-xs font-sans bg-white/20 px-2 py-0.5 rounded-full ml-1 hidden sm:inline">
              {currentUser?.isAnonymous ? 'Anonymous' : currentUser?.name}
            </span>
          )}
        </div>

        <div className="hidden md:flex gap-1 items-center flex-wrap">
          {userRole === 'patient' && (
            <>
              <NavButton active={currentTab === 'home'}      onClick={() => setCurrentTab('home')}      icon={<HomeIcon size={16} />}    label="Home" />
              <NavButton active={currentTab === 'screening'} onClick={() => setCurrentTab('screening')} icon={<MessageCircle size={16} />} label="Screening" />
              <NavButton active={currentTab === 'community'} onClick={() => setCurrentTab('community')} icon={<Globe2 size={16} />}      label="Community" />
              <NavButton active={currentTab === 'peer'}      onClick={() => setCurrentTab('peer')}      icon={<Users size={16} />}       label="Peer Space" />
              <NavButton active={currentTab === 'directory'} onClick={() => setCurrentTab('directory')} icon={<Phone size={16} />}       label="Directory" />
              <NavButton active={currentTab === 'resources'} onClick={() => setCurrentTab('resources')} icon={<BookOpen size={16} />}    label="Resources" />
              <NavButton active={currentTab === 'video'}     onClick={() => setCurrentTab('video')}     icon={<Video size={16} />}       label="Video Call" />
              <NavButton active={currentTab === 'myhealth'}  onClick={() => setCurrentTab('myhealth')}  icon={<Activity size={16} />}    label="My Health" />
              <NavButton active={currentTab === 'team'}      onClick={() => setCurrentTab('team')}      icon={<Heart size={16} />}       label="Our Team" />
            </>
          )}
          {userRole === 'clinic' && (
            <>
              <NavButton active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} icon={<BarChart3 size={16} />}     label="Dashboard" />
              <NavButton active={currentTab === 'clinical'}  onClick={() => setCurrentTab('clinical')}  icon={<Stethoscope size={16} />}   label="Clinical Tools" />
              <NavButton active={currentTab === 'directory'} onClick={() => setCurrentTab('directory')} icon={<Phone size={16} />}          label="Directory" />
            </>
          )}
          {userRole === 'admin' && (
            <>
              <NavButton active={currentTab === 'admin'}     onClick={() => setCurrentTab('admin')}     icon={<ShieldCheck size={16} />}  label="System Admin" />
              <NavButton active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} icon={<BarChart3 size={16} />}    label="Clinic View" />
            </>
          )}
          <div className="w-px h-5 bg-white/20 mx-1" />
          <button onClick={handleSignOut} className="text-white/75 hover:text-white flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors rounded-full hover:bg-white/10">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      <main className="pb-24 md:pb-8">{renderTab()}</main>

      {/* Footer */}
      {userRole === 'patient' && (
        <div className="hidden md:block bg-white border-t border-[#d8d0c4] py-5 px-6 text-center">
          <p className="text-xs text-[#a3a89f] max-w-3xl mx-auto">
            <strong className="text-[#6b7265]">MindBridge</strong> - Hack for Health Equity 2026 - Young AI Leaders Madrid and Linz Hub, part of the United Nations AI for Good initiative. While MindBridge uses validated mental health screening tools, this is a hackathon prototype for educational purposes and not a substitute for professional medical advice.
          </p>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#4a7c59] text-white flex justify-around py-2 z-50">
        {userRole === 'patient' && (
          <>
            <MobileNavButton active={currentTab === 'home'}      onClick={() => setCurrentTab('home')}      icon={<HomeIcon size={20} />}      label="Home" />
            <MobileNavButton active={currentTab === 'screening'} onClick={() => setCurrentTab('screening')} icon={<MessageCircle size={20} />} label="Screen" />
            <MobileNavButton active={currentTab === 'video'}     onClick={() => setCurrentTab('video')}     icon={<Video size={20} />}         label="Video" />
            <MobileNavButton active={currentTab === 'myhealth'}  onClick={() => setCurrentTab('myhealth')}  icon={<Activity size={20} />}      label="My Health" />
            <MobileNavButton active={currentTab === 'directory'} onClick={() => setCurrentTab('directory')} icon={<Phone size={20} />}         label="Helplines" />
            <MobileNavButton active={currentTab === 'resources'} onClick={() => setCurrentTab('resources')} icon={<BookOpen size={20} />}      label="Resources" />
          </>
        )}
        {userRole === 'clinic' && (
          <>
            <MobileNavButton active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} icon={<BarChart3 size={20} />}    label="Dashboard" />
            <MobileNavButton active={currentTab === 'clinical'}  onClick={() => setCurrentTab('clinical')}  icon={<Stethoscope size={20} />}  label="Tools" />
            <MobileNavButton active={currentTab === 'directory'} onClick={() => setCurrentTab('directory')} icon={<Phone size={20} />}         label="Directory" />
          </>
        )}
        {userRole === 'admin' && (
          <>
            <MobileNavButton active={currentTab === 'admin'}     onClick={() => setCurrentTab('admin')}     icon={<ShieldCheck size={20} />}  label="Admin" />
            <MobileNavButton active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} icon={<BarChart3 size={20} />}    label="Clinic" />
          </>
        )}
        <MobileNavButton active={false} onClick={handleSignOut} icon={<LogOut size={20} />} label="Sign Out" />
      </div>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${active ? 'bg-white/20 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}>
    {icon}{label}
  </button>
);

const MobileNavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick}
    className={`flex flex-col items-center gap-0.5 p-2 min-w-[52px] ${active ? 'text-white' : 'text-white/55'}`}>
    {icon}
    <span className="text-[9px] font-medium leading-tight">{label}</span>
  </button>
);
