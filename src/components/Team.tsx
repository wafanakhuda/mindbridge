import { useState } from 'react';
import { motion } from 'motion/react';

const TEAM = [
  {
    name: 'Dr Victoria M. Thomas',
    role: 'Founder & Clinical Strategy Lead',
    location: 'Nigeria',
    photo: '/team/victoria-thomas.png',
    bio: 'Medical doctor and mental health advocate with a strong interest in community and public mental health. Leads the clinical strategy and design of MindBridge, focusing on structured screening systems, primary care integration, and community-integrated mental health models. Also Founder of Safeguard Mental Health Initiative (SMHI), leading grassroots mental health awareness and community engagement to reduce stigma and improve early access to support.',
    emoji: '👩🏾‍⚕️',
    bg: 'bg-[#e8f5e9]', border: 'border-[#c8e6c9]', accent: 'text-[#2e7d32]',
    tags: ['Clinical Strategy', 'Primary Care Integration', 'SMHI Founder', 'Stigma Reduction'],
  },
  {
    name: 'Dr Chidinma Ndiagwalu',
    role: 'Community Engagement Lead',
    location: 'Nigeria',
    photo: '/team/chidinma-ndiagwalu.png',
    bio: 'Medical doctor and public health advocate with a strong focus on mental health and community-based interventions. Advancing grassroots health communication and stigma reduction through culturally competent outreach campaigns targeting underserved communities.',
    emoji: '👩🏿‍💼',
    bg: 'bg-[#fff8e1]', border: 'border-[#ffe082]', accent: 'text-[#f57f17]',
    tags: ['Community Outreach', 'Stigma Reduction', 'Public Health', 'Underserved Communities'],
  },
  {
    name: 'Dr Nameera Banu',
    role: 'Research Lead',
    location: 'India',
    photo: '/team/nameera-banu.png',
    bio: 'Physician and global health leader with expertise in medical education, health equity, and community-based interventions. Experienced in evidence-based clinical practice and capacity building across underserved regions including Sub-Saharan Africa. Currently advancing expertise in pain management and neurological research. Passionate about bridging healthcare gaps through technology and accessible, community-driven solutions.',
    emoji: '👩🏽‍🔬',
    bg: 'bg-[#e3f2fd]', border: 'border-[#bbdefb]', accent: 'text-[#1565c0]',
    tags: ['Global Health', 'Health Equity', 'Evidence-Based Practice', 'Capacity Building'],
  },
  {
    name: 'Wafa Thamanna Nakhuda',
    role: 'Technology & AI Systems Lead',
    location: 'India',
    photo: '/team/wafa-nakhuda.png',
    bio: 'AI systems engineer and full-stack developer, currently pursuing research in agentic AI. Leads the technology and platform development for MindBridge, designing multi-agent AI systems, real-time screening tools, and digital infrastructure for community-based mental health support. Experienced in AI-driven applications and automation frameworks with a strong emphasis on practical deployment and scalability.',
    emoji: '👩🏽‍💻',
    bg: 'bg-[#f3e5f5]', border: 'border-[#e1bee7]', accent: 'text-[#7b1fa2]',
    tags: ['Agentic AI', 'Full-Stack Development', 'Multi-Agent Systems', 'Scalable Deployment'],
  },
];

function TeamAvatar({ member }: { member: typeof TEAM[0] }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl ${member.bg} flex items-center justify-center text-4xl flex-shrink-0 shadow-inner border-2 ${member.border}`}>
        {member.emoji}
      </div>
    );
  }

  return (
    <img
      src={member.photo}
      alt={member.name}
      onError={() => setImgFailed(true)}
      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl object-cover flex-shrink-0 shadow-md border-2 ${member.border}`}
    />
  );
}

export default function Team() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#e8f5e9] text-[#4a7c59] px-4 py-1.5 rounded-full text-sm font-bold mb-4">
          🌿 Hack for Health Equity 2026
        </div>
        <h2 className="font-serif text-4xl md:text-5xl text-[#2c3028] mb-4">Meet the Team</h2>
        <p className="text-lg text-[#6b7265] max-w-xl mx-auto">
          Four specialists united by one mission - making mental health care accessible to every community, everywhere.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-14">
        {TEAM.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 22 }}
            whileHover={{ y: -4 }}
            className={`bg-white border-2 ${member.border} rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-all`}
          >
            <div className="flex items-start gap-4">
              <TeamAvatar member={member} />
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2c3028]">{member.name}</h3>
                <p className={`text-xs sm:text-sm font-bold mt-0.5 ${member.accent}`}>{member.role}</p>
                <p className="text-xs text-[#a3a89f] mb-2">📍 {member.location}</p>
                <p className="text-[#6b7265] text-xs sm:text-sm leading-relaxed">{member.bio}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {member.tags.map(tag => (
                    <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${member.bg} ${member.accent} border ${member.border}`}>
                      {tag}
                    </span>
                  ))}
                </div>
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
        className="bg-gradient-to-br from-[#4a7c59] to-[#4d7a52] rounded-[2rem] p-8 sm:p-10 text-center text-white shadow-xl"
      >
        <div className="text-4xl mb-4">🌿</div>
        <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          "Mental Health Should Not Be a Privilege."
        </h3>
        <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
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
