import { motion } from 'motion/react';
import { ShieldCheck, Server, Users, Activity, Building2, AlertTriangle, CheckCircle2, Globe2, Download, Map, LayoutTemplate } from 'lucide-react';
import { useState } from 'react';
import ArchitectureDocs from './ArchitectureDocs';

export default function AdminDashboard() {
  const [showDocs, setShowDocs] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  if (showDocs) {
    return <ArchitectureDocs onBack={() => setShowDocs(false)} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#7b1fa2] text-white p-2 rounded-xl shadow-md">
              <ShieldCheck size={24} />
            </div>
            <h2 className="font-serif text-4xl text-[#2c3028]">Community Intelligence Dashboard</h2>
          </div>
          <p className="text-lg text-[#6b7265] flex items-center gap-2">
            <Server size={18} /> MindBridge Global Platform · March 2026
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowDocs(true)}
            className="bg-white text-[#2c3028] px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm border border-[#d8d0c4] hover:bg-gray-50 transition-colors"
          >
            <LayoutTemplate size={16} /> System Specs & Docs
          </button>
          <button className="bg-[#2d5a30] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm hover:bg-[#234726] transition-colors">
            <Download size={16} /> Export Reports
          </button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
      >
        <KpiCard icon={<Users size={20} />} num="12,492" label="Total Active Users" delta="↑ 1,204" up color="bg-[#e3f2fd]" textColor="text-[#1565c0]" />
        <KpiCard icon={<Building2 size={20} />} num="84" label="Partner Clinics" delta="↑ 3" up color="bg-[#f3e5f5]" textColor="text-[#7b1fa2]" />
        <KpiCard icon={<Activity size={20} />} num="45,921" label="Total Screenings" delta="↑ 8,402" up color="bg-[#e8f5e9]" textColor="text-[#2e7d32]" />
        <KpiCard icon={<AlertTriangle size={20} />} num="2" label="System Alerts" delta="↓ 1" up={false} color="bg-[#ffebee]" textColor="text-[#c62828]" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-[#d8d0c4] rounded-[2rem] p-8 shadow-sm relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#f0ece5] to-transparent rounded-bl-full pointer-events-none opacity-50"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h4 className="font-bold text-2xl text-[#2c3028] flex items-center gap-3">
              <Map className="text-[#c62828]" size={28} /> Regional Risk Heatmap
            </h4>
          </div>
          <div className="flex-1 relative z-10 bg-[#f5f0e8] rounded-xl border border-[#e5ddd0] p-4 flex items-center justify-center min-h-[300px] overflow-hidden group">
             {/* Simulated Map / Heatmap Graphic */}
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <div className="relative w-full h-full">
                <HeatmapNode top="20%" left="30%" size="w-16 h-16" color="bg-red-500" label="High Risk Cluster" />
                <HeatmapNode top="50%" left="60%" size="w-24 h-24" color="bg-amber-500" label="Moderate Trend" />
                <HeatmapNode top="70%" left="20%" size="w-12 h-12" color="bg-green-500" label="Low Risk" />
                <HeatmapNode top="30%" left="80%" size="w-20 h-20" color="bg-red-500" label="Emerging Hotspot" />
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-[#d8d0c4] rounded-[2rem] p-8 shadow-sm flex flex-col"
        >
          <h4 className="font-bold text-2xl text-[#2c3028] mb-8 flex items-center gap-3">
            <Globe2 className="text-[#1565c0]" size={28} /> Platform Usage by Region
          </h4>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <BarRow label="North America" count="18,402" pct={100} color="bg-[#1565c0]" />
            <BarRow label="Europe" count="12,104" pct={65} color="bg-[#7baec8]" />
            <BarRow label="Asia Pacific" count="8,492" pct={45} color="bg-[#2e7d32]" />
            <BarRow label="Africa" count="4,201" pct={22} color="bg-[#f57f17]" />
            <BarRow label="South America" count="2,722" pct={15} color="bg-[#c62828]" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

const HeatmapNode = ({ top, left, size, color, label }: any) => (
  <div className="absolute flex flex-col items-center justify-center group/node" style={{ top, left, transform: 'translate(-50%, -50%)' }}>
    <div className={`${size} ${color} rounded-full opacity-40 animate-pulse absolute`}></div>
    <div className={`w-4 h-4 ${color} rounded-full border-2 border-white shadow-md relative z-10`}></div>
    <div className="absolute top-full mt-2 bg-white px-2 py-1 rounded shadow-sm text-xs font-bold whitespace-nowrap opacity-0 group-hover/node:opacity-100 transition-opacity z-20">
      {label}
    </div>
  </div>
);

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

const BarRow = ({ label, count, pct, color }: any) => (
  <div className="flex items-center gap-4 text-sm group">
    <div className="w-32 flex items-center gap-2 text-[#6b7265] font-medium group-hover:text-[#2c3028] transition-colors">
      {label}
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
    <div className="w-16 text-right font-bold text-lg text-[#2c3028]">{count}</div>
  </div>
);
