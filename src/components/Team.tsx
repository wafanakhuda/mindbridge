import { motion } from 'motion/react';

const TEAM = [
  {
    name: 'Dr Victoria Thomas',
    role: 'Founder & Clinical Strategy Lead',
    bio: 'Physician and public health specialist. Leads clinical design, validated screening protocols, and primary care integration strategy for MindBridge.',
    emoji: '👩🏾‍⚕️',
    bg: 'bg-[#e8f5e9]', border: 'border-[#c8e6c9]', accent: 'text-[#2e7d32]',
    tags: ['Clinical Design', 'PHQ-2/GAD-2', 'Care Pathways', 'DSM-5 Criteria'],
  },
  {
    name: 'Dr Nameera Banu',
    role: 'Research Lead',
    bio: 'Mental health researcher specialising in PHQ/GAD validated tools, epidemiology of untreated illness, and evidence-based community interventions.',
    emoji: '👩🏽‍🔬',
    bg: 'bg-[#e3f2fd]', border: 'border-[#bbdefb]', accent: 'text-[#1565c0]',
    tags: ['Research', 'WHO Data', 'Validated Tools', 'Evidence Base'],
  },
  {
    name: 'Dr Chidinma Ndiagwalu',
    role: 'Community Engagement Lead',
    bio: 'Specialist in grassroots health communication, stigma reduction, and designing culturally competent outreach campaigns for underserved communities.',
    emoji: '👩🏿‍💼',
    bg: 'bg-[#fff8e1]', border: 'border-[#ffe082]', accent: 'text-[#f57f17]',
    tags: ['Community', 'Stigma Reduction', 'NGO Partnerships', 'Awareness'],
  },
  {
    name: 'Wafa Nakhuda',
    role: 'Technical & Software Lead',
    bio: 'Full-stack developer and AI integration specialist. Architected the MindBridge platform, 8 Gemini AI agents, real-time screening, and global crisis directory.',
    emoji: '👩🏽‍💻',
    bg: 'bg-[#f3e5f5]', border: 'border-[#e1bee7]', accent: 'text-[#7b1fa2]',
    tags: ['React + Vite', 'Gemini AI Agents', 'MongoDB', 'Railway'],
  },
];

export default function Team() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-[#e8f5e9] text-[#4a7c59] px-4 py-1.5 rounded-full text-sm font-bold mb-4">
          🌿 Hack for Health Equity 2026
        </div>
        <h2 className="font-serif text-4xl md:text-5xl text-[#2c3028] mb-4">Meet the Team</h2>
        <p className="text-lg text-[#6b7265] max-w-xl mx-auto">
          Four specialists united by one mission - making mental health care accessible to every community, everywhere.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 mb-14">
        {TEAM.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 22 }}
            whileHover={{ y: -4 }}
            className={`bg-white border-2 ${member.border} rounded-[2rem] p-8 shadow-sm hover:shadow-lg transition-all`}
          >
            <div className="flex items-start gap-3 sm:gap-5">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl ${member.bg} flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-inner`}>
                {member.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-xl font-bold text-[#2c3028]">{member.name}</h3>
                <p className={`text-sm font-bold mt-0.5 mb-3 ${member.accent}`}>{member.role}</p>
                <p className="text-[#6b7265] text-sm leading-relaxed">{member.bio}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mission statement */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-[#4a7c59] to-[#4d7a52] rounded-[2rem] p-10 text-center text-white shadow-xl"
      >
        <div className="text-4xl mb-4">🌿</div>
        <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4">
          "Mental Health Should Not Be a Privilege."
        </h3>
        <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
          MindBridge is a hybrid community-primary care mental health system. Not just a chatbot - a connected pathway from screening to care to follow-up, for 195 countries.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
          {['End-to-end care pathway', 'AI-powered screening', '195 countries', 'Anonymised & private', 'Free for everyone'].map(tag => (
            <span key={tag} className="bg-white/15 border border-white/25 px-4 py-1.5 rounded-full">
              ✓ {tag}
            </span>
          ))}
        </div>
        <div className="mt-8 text-white/60 text-sm">
          Hack for Health Equity 2026 - Young AI Leaders Madrid & Linz Hub - AI for Good - United Nations
        </div>
      </motion.div>
    </motion.div>
  );
}
