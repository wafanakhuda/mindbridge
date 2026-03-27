/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Home as HomeIcon, MessageCircle, Users, Phone, BookOpen, BarChart3, LogOut, ShieldCheck } from 'lucide-react';
import Home from './components/Home';
import Screening from './components/Screening';
import Community from './components/Community';
import Directory from './components/Directory';
import Resources from './components/Resources';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [userRole, setUserRole] = useState<string | null>(null); // 'patient', 'clinic', 'admin'
  const [currentTab, setCurrentTab] = useState('home');

  const handleSignIn = (role: string) => {
    setUserRole(role);
    if (role === 'patient') setCurrentTab('home');
    if (role === 'clinic') setCurrentTab('dashboard');
    if (role === 'admin') setCurrentTab('admin');
  };

  const handleSignOut = () => {
    setUserRole(null);
    setCurrentTab('home');
  };

  const renderTab = () => {
    switch (currentTab) {
      case 'home': return <Home setTab={setCurrentTab} />;
      case 'screening': return <Screening />;
      case 'community': return <Community />;
      case 'directory': return <Directory />;
      case 'resources': return <Resources />;
      case 'dashboard': return <Dashboard />;
      case 'admin': return <AdminDashboard />;
      default: return <Home setTab={setCurrentTab} />;
    }
  };

  if (!userRole) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#2c3028] font-sans">
      {/* Crisis Strip - Only show for patients */}
      {userRole === 'patient' && (
        <div className="bg-[#c4605a] text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2">
          <span>🆘 If you're in crisis, please reach out for help immediately.</span>
          <button onClick={() => setCurrentTab('directory')} className="underline font-bold">Find a helpline in your country</button>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-[#2d5a30] px-6 py-4 sticky top-0 z-50 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-serif text-2xl font-bold cursor-pointer" onClick={() => setCurrentTab(userRole === 'patient' ? 'home' : userRole === 'clinic' ? 'dashboard' : 'admin')}>
          <span>🌿</span> MindBridge
          <span className="text-xs font-sans bg-white/20 px-2 py-1 rounded-full ml-2 uppercase tracking-wider">
            {userRole}
          </span>
        </div>
        
        <div className="hidden md:flex gap-2 items-center">
          {userRole === 'patient' && (
            <>
              <NavButton active={currentTab === 'home'} onClick={() => setCurrentTab('home')} icon={<HomeIcon size={18} />} label="Home" />
              <NavButton active={currentTab === 'screening'} onClick={() => setCurrentTab('screening')} icon={<MessageCircle size={18} />} label="Screening" />
              <NavButton active={currentTab === 'community'} onClick={() => setCurrentTab('community')} icon={<Users size={18} />} label="Community" />
              <NavButton active={currentTab === 'directory'} onClick={() => setCurrentTab('directory')} icon={<Phone size={18} />} label="Directory" />
              <NavButton active={currentTab === 'resources'} onClick={() => setCurrentTab('resources')} icon={<BookOpen size={18} />} label="Resources" />
            </>
          )}

          {userRole === 'clinic' && (
            <>
              <NavButton active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} icon={<BarChart3 size={18} />} label="Clinic Dashboard" />
              <NavButton active={currentTab === 'resources'} onClick={() => setCurrentTab('resources')} icon={<BookOpen size={18} />} label="Patient Resources" />
            </>
          )}

          {userRole === 'admin' && (
            <>
              <NavButton active={currentTab === 'admin'} onClick={() => setCurrentTab('admin')} icon={<ShieldCheck size={18} />} label="System Admin" />
              <NavButton active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} icon={<BarChart3 size={18} />} label="Clinic View" />
            </>
          )}

          <div className="w-px h-6 bg-white/20 mx-2"></div>
          <button onClick={handleSignOut} className="text-white/75 hover:text-white flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        {renderTab()}
      </main>
      
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#2d5a30] text-white flex justify-around py-3 pb-safe z-50">
        {userRole === 'patient' && (
          <>
            <MobileNavButton active={currentTab === 'home'} onClick={() => setCurrentTab('home')} icon={<HomeIcon size={20} />} label="Home" />
            <MobileNavButton active={currentTab === 'screening'} onClick={() => setCurrentTab('screening')} icon={<MessageCircle size={20} />} label="Screening" />
            <MobileNavButton active={currentTab === 'community'} onClick={() => setCurrentTab('community')} icon={<Users size={20} />} label="Community" />
            <MobileNavButton active={currentTab === 'directory'} onClick={() => setCurrentTab('directory')} icon={<Phone size={20} />} label="Directory" />
          </>
        )}
        {userRole === 'clinic' && (
          <>
            <MobileNavButton active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} icon={<BarChart3 size={20} />} label="Dashboard" />
            <MobileNavButton active={currentTab === 'resources'} onClick={() => setCurrentTab('resources')} icon={<BookOpen size={20} />} label="Resources" />
          </>
        )}
        {userRole === 'admin' && (
          <>
            <MobileNavButton active={currentTab === 'admin'} onClick={() => setCurrentTab('admin')} icon={<ShieldCheck size={20} />} label="Admin" />
            <MobileNavButton active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} icon={<BarChart3 size={20} />} label="Clinic" />
          </>
        )}
        <MobileNavButton active={false} onClick={handleSignOut} icon={<LogOut size={20} />} label="Sign Out" />
      </div>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      active ? 'bg-white/20 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'
    }`}
  >
    {icon}
    {label}
  </button>
);

const MobileNavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 ${
      active ? 'text-white' : 'text-white/60'
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);
