import { motion } from 'motion/react';
import { Globe2, ExternalLink, BookOpen, Megaphone } from 'lucide-react';

const NGOS = [
  { name: 'Mental Health Innovation Network', region: 'Global', focus: 'Connecting innovators working on mental health solutions in low-resource settings', link: 'https://www.mhinnovation.net', tag: 'Innovation', color: 'bg-[#e3f2fd] border-[#bbdefb] text-[#1565c0]' },
  { name: 'WHO Mental Health Action Plan', region: 'Global', focus: 'Global framework for mental health policy, service delivery, and research 2013-2030', link: 'https://www.who.int/publications/i/item/9789241506021', tag: 'Policy', color: 'bg-[#e8f5e9] border-[#c8e6c9] text-[#2e7d32]' },
  { name: 'Befrienders Worldwide', region: 'Global', focus: 'Emotional support to people in distress. Volunteer crisis lines in 32 countries', link: 'https://www.befrienders.org', tag: 'Crisis Support', color: 'bg-[#fce4ec] border-[#f8bbd0] text-[#c62828]' },
  { name: 'BasicNeeds', region: 'Africa & Asia', focus: 'Community-based mental health and development for underserved populations', link: 'https://www.basicneeds.org', tag: 'Community', color: 'bg-[#fff8e1] border-[#ffe082] text-[#f57f17]' },
  { name: 'CBM Global', region: 'Low-income countries', focus: 'Inclusive development and disability-inclusive mental health in fragile contexts', link: 'https://www.cbm.org', tag: 'Inclusion', color: 'bg-[#f3e5f5] border-[#e1bee7] text-[#7b1fa2]' },
  { name: 'Africa Mental Health Foundation', region: 'Africa', focus: 'Research and capacity building for mental health in sub-Saharan Africa', link: 'https://www.amhf.or.ke', tag: 'Research', color: 'bg-[#e8f5e9] border-[#c8e6c9] text-[#2e7d32]' },
  { name: 'iCall - Tata Institute', region: 'South Asia', focus: 'Psychosocial helpline and counselling services for India and South Asia', link: 'https://icallhelpline.org', tag: 'Helpline', color: 'bg-[#e3f2fd] border-[#bbdefb] text-[#1565c0]' },
  { name: 'HealthRight International', region: 'Global', focus: 'Mental health and human rights for marginalised communities in conflict zones', link: 'https://healthright.org', tag: 'Human Rights', color: 'bg-[#fce4ec] border-[#f8bbd0] text-[#c62828]' },
];

const TOOLKITS = [
  { icon: '📋', title: 'WHO mhGAP Intervention Guide', desc: 'Clinical decision tool for non-specialist health workers to manage mental, neurological, and substance use conditions.', link: 'https://www.who.int/publications/i/item/9789241548069', tag: 'Clinical' },
  { icon: '🏫', title: 'School Mental Health Toolkit', desc: 'UNESCO toolkit for teachers and school counsellors to identify and support students with mental health challenges.', link: 'https://www.who.int/mental_health/school_mental_health/en/', tag: 'Education' },
  { icon: '📱', title: 'Digital Mental Health Toolkit', desc: 'WHO guide to integrating digital tools into mental health service delivery in low-resource settings.', link: 'https://www.who.int/teams/mental-health-and-substance-use/treatment-care/digital-mental-health', tag: 'Digital' },
  { icon: '🤱', title: 'Perinatal Mental Health Toolkit', desc: 'Resources for screening and supporting maternal mental health during pregnancy and the postpartum period.', link: 'https://apps.who.int/iris/handle/10665/254617', tag: 'Maternal' },
  { icon: '🌍', title: 'Mental Health in Emergencies', desc: 'IASC guidelines for mental health and psychosocial support in emergency settings and humanitarian crises.', link: 'https://www.who.int/publications/i/item/9789240004948', tag: 'Emergency' },
  { icon: '🧑‍⚕️', title: 'Community Health Worker Guide', desc: 'Training materials to equip frontline health workers with mental health first aid and basic counselling skills.', link: 'https://www.who.int/publications/i/item/9789240007949', tag: 'Training' },
];

const CAMPAIGNS = [
  { emoji: '🟢', name: 'World Mental Health Day', date: '10 October', org: 'WHO', desc: 'Annual awareness day. Free campaign materials, social media assets, and event guides available.' },
  { emoji: '🔵', name: 'Time to Change', date: 'Year-round', org: 'Mind UK', desc: 'Anti-stigma campaign toolkit for workplaces, schools, and communities.' },
  { emoji: '🟡', name: "Bell Let's Talk", date: 'January', org: 'Bell Canada', desc: 'Framework for starting mental health conversations - adaptable for any community.' },
  { emoji: '🟣', name: 'Heads Together', date: 'Year-round', org: 'Royal Foundation UK', desc: 'Campaign normalising mental health conversations. Free assets and ambassador guides.' },
];

export default function Community({ setTab }: { setTab?: (tab: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-6 py-12">

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#e8f5e9] text-[#4a7c59] px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-[#c8e6c9]">
          🌍 Global Community Resources
        </div>
        <h2 className="font-serif text-4xl text-[#2c3028] mb-4">NGOs, Toolkits & Campaigns</h2>
        <p className="text-lg text-[#6b7265] max-w-2xl mx-auto">Connect with global mental health organisations, access free clinical toolkits, and find awareness campaign materials for your community.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button onClick={() => setTab && setTab('peer')} className="bg-[#4a7c59] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#3a6b3e] transition-all shadow-sm">
            💬 Peer Community →
          </button>
          <button onClick={() => setTab && setTab('directory')} className="bg-white border-2 border-[#4a7c59] text-[#4a7c59] px-5 py-2 rounded-full text-sm font-bold hover:bg-[#e8f5e9] transition-all">
            🌍 Crisis Directory →
          </button>
        </div>
      </div>

      {/* NGOs */}
      <section className="mb-14">
        <h3 className="font-serif text-2xl text-[#2c3028] mb-2 flex items-center gap-2">
          <Globe2 size={22} className="text-[#4a7c59]" /> Global Mental Health Organisations
        </h3>
        <p className="text-[#6b7265] text-sm mb-6">Vetted NGOs working on mental health access in underserved communities worldwide.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NGOS.map((ngo, i) => (
            <motion.a key={ngo.name} href={ngo.link} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }} className="bg-white border border-[#d8d0c4] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all group block">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-[#2c3028] text-sm">{ngo.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ngo.color}`}>{ngo.tag}</span>
                  </div>
                  <div className="text-xs text-[#6b7265] mb-2 font-medium">📍 {ngo.region}</div>
                  <p className="text-xs text-[#6b7265] leading-relaxed">{ngo.focus}</p>
                </div>
                <ExternalLink size={16} className="text-[#d8d0c4] group-hover:text-[#4a7c59] transition-colors shrink-0 mt-1" />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Toolkits */}
      <section className="mb-14">
        <h3 className="font-serif text-2xl text-[#2c3028] mb-2 flex items-center gap-2">
          <BookOpen size={22} className="text-[#4a7c59]" /> Free Clinical & Community Toolkits
        </h3>
        <p className="text-[#6b7265] text-sm mb-6">Open-access toolkits from WHO and global health organisations - free to use, share, and adapt.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLKITS.map((t, i) => (
            <motion.a key={t.title} href={t.link} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3 }} className="bg-white border border-[#d8d0c4] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all group block">
              <div className="text-2xl mb-3">{t.icon}</div>
              <div className="font-bold text-sm text-[#2c3028] mb-1">{t.title}</div>
              <p className="text-xs text-[#6b7265] leading-relaxed mb-3">{t.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-[#f0ece5] text-[#6b7265] px-2 py-0.5 rounded-full">{t.tag}</span>
                <span className="text-xs text-[#4a7c59] font-bold group-hover:underline flex items-center gap-1">Open <ExternalLink size={11} /></span>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Campaigns */}
      <section>
        <h3 className="font-serif text-2xl text-[#2c3028] mb-2 flex items-center gap-2">
          <Megaphone size={22} className="text-[#4a7c59]" /> Awareness Campaigns
        </h3>
        <p className="text-[#6b7265] text-sm mb-6">Plug-and-play campaign materials you can use in your school, workplace, or community.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CAMPAIGNS.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white border border-[#d8d0c4] rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{c.emoji}</div>
                <div>
                  <div className="font-bold text-[#2c3028] text-sm">{c.name}</div>
                  <div className="text-xs text-[#6b7265] mb-1">{c.org} - {c.date}</div>
                  <p className="text-xs text-[#6b7265] leading-relaxed">{c.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </motion.div>
  );
}
