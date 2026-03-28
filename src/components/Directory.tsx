import { useState, useMemo } from 'react';
import { Search, Phone, Globe2, Filter } from 'lucide-react';
import { directoryData } from '../data/directory';
import { motion, AnimatePresence } from 'motion/react';

export default function Directory() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'hotline' | 'emergency-only'>('all');

  const filtered = useMemo(() => {
    return directoryData.filter(d => {
      const matchSearch = d.country.toLowerCase().includes(search.toLowerCase());
      const hasHotline = d.mentalHealth !== 'No national hotline listed';
      if (filter === 'hotline') return matchSearch && hasHotline;
      if (filter === 'emergency-only') return matchSearch && !hasHotline;
      return matchSearch;
    });
  }, [search, filter]);

  const hotlineCount = directoryData.filter(d => d.mentalHealth !== 'No national hotline listed').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c4605a]/10 text-[#c4605a] mb-6">
          <Globe2 size={32} />
        </div>
        <h2 className="font-serif text-4xl text-[#2c3028] mb-4">Global Emergency Directory</h2>
        <p className="text-lg text-[#6b7265]">Emergency and mental health hotline numbers for all 195 countries. Help is available worldwide.</p>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm font-medium">
          <span className="bg-[#e8f5e9] text-[#2e7d32] px-3 py-1.5 rounded-full border border-[#c8e6c9]">✅ {hotlineCount} countries with hotlines</span>
          <span className="bg-[#fff8e1] text-[#c4a040] px-3 py-1.5 rounded-full border border-[#ffe082]">🆘 195 emergency numbers</span>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="text-[#6b7265]" size={20} />
          </div>
          <input
            type="text"
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border-2 border-[#d8d0c4] rounded-full py-3.5 pl-12 pr-5 text-base shadow-sm focus:outline-none focus:border-[#7a9e7e] focus:ring-4 focus:ring-[#7a9e7e]/20 transition-all"
          />
        </div>
        <div className="flex gap-2 items-center bg-white border-2 border-[#d8d0c4] rounded-full px-4 py-1 shadow-sm">
          <Filter size={16} className="text-[#6b7265]" />
          {(['all', 'hotline', 'emergency-only'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === f ? 'bg-[#4a7c59] text-white shadow-sm' : 'text-[#6b7265] hover:text-[#2c3028]'
              }`}
            >
              {f === 'all' ? 'All' : f === 'hotline' ? '✅ Hotline' : '🆘 Emergency'}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-[#6b7265] mb-8">Showing <strong>{filtered.length}</strong> of 195 countries</p>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode='popLayout'>
          {filtered.map((item) => {
            const hasHotline = item.mentalHealth !== 'No national hotline listed';
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                key={item.country}
                className="bg-white p-6 rounded-[1.5rem] border border-[#d8d0c4] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#f0ece5] rounded-full opacity-40 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="font-serif text-xl text-[#2c3028] flex items-center gap-2">
                    <span className="text-2xl">{item.flag}</span> {item.country}
                  </h3>
                  {hasHotline && (
                    <span className="text-xs bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] px-2 py-0.5 rounded-full font-bold shrink-0">✅ Hotline</span>
                  )}
                </div>

                <div className="space-y-3 relative z-10">
                  <a href={`tel:${item.emergency.split('/')[0].trim()}`} className="flex items-center gap-3 bg-[#fff8e1] p-3.5 rounded-xl border border-[#ffe082] hover:bg-[#fff3cd] transition-colors group/link">
                    <div className="bg-white p-1.5 rounded-full shadow-sm shrink-0">
                      <Phone size={16} className="text-[#c4a040]" />
                    </div>
                    <div>
                      <div className="text-[10px] text-[#c4a040] uppercase tracking-wider font-bold">Emergency</div>
                      <div className="font-mono text-base font-semibold text-[#2c3028]">{item.emergency}</div>
                    </div>
                  </a>

                  {hasHotline ? (
                    <a href={`tel:${item.mentalHealth.split(' ')[0]}`} className="flex items-center gap-3 bg-[#e3f2fd] p-3.5 rounded-xl border border-[#bbdefb] hover:bg-[#d4ebfb] transition-colors">
                      <div className="bg-white p-1.5 rounded-full shadow-sm shrink-0">
                        <Phone size={16} className="text-[#7baec8]" />
                      </div>
                      <div>
                        <div className="text-[10px] text-[#7baec8] uppercase tracking-wider font-bold">Mental Health Hotline</div>
                        <div className="font-mono text-base font-semibold text-[#2c3028]">{item.mentalHealth}</div>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 bg-[#f5f5f5] p-3.5 rounded-xl border border-[#e0e0e0]">
                      <div className="bg-white p-1.5 rounded-full shadow-sm shrink-0">
                        <Phone size={16} className="text-[#bdbdbd]" />
                      </div>
                      <div>
                        <div className="text-[10px] text-[#9e9e9e] uppercase tracking-wider font-bold">Mental Health Hotline</div>
                        <div className="text-sm text-[#9e9e9e] italic">No national hotline listed</div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#f0ece5] text-[#6b7265] mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-serif text-[#2c3028] mb-2">No results found</h3>
            <p className="text-[#6b7265] text-lg">Try a different country name or change the filter.</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
