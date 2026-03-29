import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Book, HeartPulse, BrainCircuit, Users, School, X, Wind } from 'lucide-react';
import BreathingExercise from './BreathingExercise';

const TRIGGERS = [
  { emoji: '😰', name: 'Social situations',   tips: ['Practice slow deep breathing before entering social settings', 'Prepare 2-3 conversation starters to reduce uncertainty', 'Challenge negative thoughts - most people are too busy thinking about themselves', 'Try gradual exposure: start with smaller social settings and build up'] },
  { emoji: '💼', name: 'Work & performance',  tips: ['Break big tasks into small timed steps (Pomodoro technique)', 'Communicate early when overwhelmed - silence grows anxiety', 'Set clear boundaries around working hours', 'Use a worry journal - write concerns down, then close the book'] },
  { emoji: '💸', name: 'Financial stress',    tips: ['List your expenses - uncertainty is often worse than reality', 'Talk to a free financial counsellor if available', 'Focus on one small actionable step per day', 'Community support groups reduce shame and isolation'] },
  { emoji: '❤️', name: 'Relationships',       tips: ['Use "I feel…" statements instead of blame', 'Identify your attachment style to understand your patterns', 'Set and communicate boundaries clearly and calmly', 'Seek counselling if patterns keep repeating'] },
  { emoji: '🏥', name: 'Health worries',      tips: ['Limit health searches online - they amplify worst-case fears', 'Trust your doctor\'s reassurance rather than seeking endless opinions', 'Notice when checking symptoms becomes compulsive', 'CBT has strong evidence for health anxiety'] },
  { emoji: '🌙', name: 'Sleep & insomnia',    tips: ['Keep consistent sleep/wake times - even weekends', 'Avoid screens 1 hour before bed', 'Use the 4-7-8 breathing technique', 'Write a worry dump an hour before sleep to clear your mind'] },
  { emoji: '🌍', name: 'World events',        tips: ['Schedule news time - limit to 20 minutes per day', 'Choose reliable sources; avoid social media doomscrolling', 'Balance with positive local action: volunteer, connect', 'Turn off breaking news notifications at night'] },
  { emoji: '😔', name: 'Loneliness',          tips: ['Reach out to one person per day - even a brief message counts', 'Join a group based on an interest, not just to find friends', 'Consider volunteering - purpose and connection come together', 'Professional counselling can help process the pain of loneliness'] },
];

export default function Resources() {
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [activeTrigger, setActiveTrigger] = useState<number | null>(null);
  const [showBreathing, setShowBreathing] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

      {/* Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-4xl text-[#2c3028] mb-4">Self-Help & Resources</h2>
        <p className="text-lg text-[#6b7265]">Guided tools, evidence-based strategies, and community support materials.</p>
      </div>

      {/* ── QUICK ACTION: Breathing Exercise ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#4a7c59] to-[#4d7a52] rounded-[2rem] p-8 mb-12 text-white relative overflow-hidden shadow-xl"
      >
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/15 p-2 rounded-xl"><Wind size={24} /></div>
              <span className="text-sm font-bold uppercase tracking-widest text-white/80">Instant Calm</span>
            </div>
            <h3 className="font-serif text-3xl font-bold mb-2">Box Breathing Exercise</h3>
            <p className="text-white/80 max-w-md">The 4-4-4-4 technique used by emergency responders and athletes. Activates your parasympathetic nervous system within 60 seconds.</p>
          </div>
          <button
            onClick={() => setShowBreathing(true)}
            className="shrink-0 bg-white text-[#4a7c59] px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            ▶ Start Now
          </button>
        </div>
      </motion.div>

      {/* ── ANXIETY TRIGGERS ── */}
      <div className="mb-14">
        <h3 className="font-serif text-2xl text-[#2c3028] mb-2">Common Anxiety Triggers</h3>
        <p className="text-[#6b7265] mb-6 text-sm">Tap a trigger to see evidence-based coping strategies.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {TRIGGERS.map((t, i) => (
            <motion.button
              key={t.name}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTrigger(activeTrigger === i ? null : i)}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                activeTrigger === i
                  ? 'bg-[#e8f5e9] border-[#4a7c59] shadow-md'
                  : 'bg-white border-[#d8d0c4] hover:border-[#7a9e7e]'
              }`}
            >
              <div className="text-2xl mb-1.5">{t.emoji}</div>
              <div className="text-xs font-bold text-[#2c3028] leading-tight">{t.name}</div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {activeTrigger !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#e8f5e9] border border-[#a5d6a7] rounded-2xl p-6">
                <h4 className="font-bold text-[#4a7c59] mb-4 text-lg flex items-center gap-2">
                  {TRIGGERS[activeTrigger].emoji} Coping strategies for {TRIGGERS[activeTrigger].name.toLowerCase()}
                </h4>
                <ul className="space-y-3">
                  {TRIGGERS[activeTrigger].tips.map((tip, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3 text-[#2c3028] text-sm"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#4a7c59] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── RESOURCE CARDS ── */}
      <h3 className="font-serif text-2xl text-[#2c3028] mb-6">Guides & Tools</h3>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ResourceCard
          variants={itemVariants}
          icon={<HeartPulse size={28} />} iconBg="bg-[#e8f5e9]" iconColor="text-[#2e7d32]"
          title="Mood Journal Starter"
          desc="Simple daily prompts to track your emotional patterns over time."
          tag="Depression"
          onClick={() => setSelectedResource({ title: 'Mood Journal Starter', desc: 'Simple daily prompts to track your emotional patterns.', content: '• How am I feeling today on a scale of 1-10?\n• What is one thing I am grateful for right now?\n• What challenged me today and how did I handle it?\n• What is one kind thing I can do for myself tomorrow?\n• Who did I connect with today - even briefly?\n\nTip: Write for 5 minutes each morning before checking your phone.' })}
        />
        <ResourceCard
          variants={itemVariants}
          icon={<Book size={28} />} iconBg="bg-[#e3f2fd]" iconColor="text-[#1565c0]"
          title="Sleep Hygiene Guide"
          desc="Evidence-based habits to improve sleep quality and daily energy."
          tag="Wellbeing"
          onClick={() => setSelectedResource({ title: 'Sleep Hygiene Guide', desc: 'Evidence-based habits for better sleep.', content: '1. Keep consistent sleep & wake times - even weekends.\n2. Create a 20-min wind-down routine: dim lights, no screens.\n3. Keep your room cool (16-18°C / 60-65°F), dark, and quiet.\n4. Avoid caffeine after 2pm and alcohol within 3 hours of sleep.\n5. If you can\'t sleep after 20 mins, get up and do something calm until sleepy.\n6. Use the 4-7-8 method: inhale 4s, hold 7s, exhale 8s.\n\nConsistency matters more than duration - same times every day.' })}
        />
        <ResourceCard
          variants={itemVariants}
          icon={<BrainCircuit size={28} />} iconBg="bg-[#f3e5f5]" iconColor="text-[#7b1fa2]"
          title="Understanding Depression"
          desc="Plain-language guide to recognising symptoms, causes, and treatment options."
          tag="Education"
          onClick={() => setSelectedResource({ title: 'Understanding Depression', desc: 'Plain-language guide to depression.', content: 'Depression is a common medical condition - not a character flaw or weakness.\n\nKey symptoms:\n• Persistent low mood or emptiness for 2+ weeks\n• Loss of interest in things you used to enjoy\n• Changes in sleep, appetite, or energy\n• Difficulty concentrating or making decisions\n• Feelings of worthlessness or guilt\n\nWhat helps:\n• Talking therapy (CBT is most evidence-based)\n• Medication (antidepressants) - often combined with therapy\n• Regular movement - even 20 mins walking has strong evidence\n• Social connection - isolation makes depression worse\n• Structured routine - even a basic one helps\n\nImportant: Depression is highly treatable. 80% of people improve with treatment.' })}
        />
        <ResourceCard
          variants={itemVariants}
          icon={<Users size={28} />} iconBg="bg-[#fff8e1]" iconColor="text-[#f57f17]"
          title="Talking to a Loved One"
          desc="How to start difficult conversations about mental health."
          tag="Support"
          onClick={() => setSelectedResource({ title: 'Talking to a Loved One', desc: 'How to start mental health conversations.', content: 'Starting the conversation:\n• Choose a quiet, private setting with no time pressure\n• Start with "I\'ve been feeling..." rather than waiting for the perfect moment\n• Use "I" statements: "I feel overwhelmed when..." not "You make me feel..."\n\nDuring the conversation:\n• Be honest and specific about what you\'re experiencing\n• Ask for exactly what you need: "I just need someone to listen"\n• It\'s okay if they don\'t fully understand - their presence matters\n\nIf someone comes to you:\n• Listen without interrupting or immediately problem-solving\n• Say: "Thank you for telling me. That sounds really hard."\n• Ask: "What would be most helpful right now?"\n• Never say: "Just cheer up" or "Others have it worse"' })}
        />
        <ResourceCard
          variants={itemVariants}
          icon={<AlertCircle size={28} />} iconBg="bg-[#fce4ec]" iconColor="text-[#c62828]"
          title="Understanding Anxiety"
          desc="What anxiety is, why it happens, and what actually helps."
          tag="Anxiety"
          onClick={() => setSelectedResource({ title: 'Understanding Anxiety', desc: 'What anxiety is and what helps.', content: 'Anxiety is your brain\'s threat-detection system - it evolved to protect you. But sometimes it misfires.\n\nPhysical symptoms:\n• Racing heart, shallow breathing, tight chest\n• Sweating, shaking, dizziness\n• Stomach upset, nausea\n\nThought patterns:\n• Catastrophising ("This will be a disaster")\n• Mind-reading ("They must think I\'m stupid")\n• All-or-nothing thinking\n\nWhat actually helps (evidence-based):\n1. Diaphragmatic breathing - directly activates your calm system\n2. Cognitive reframing - challenge anxious thoughts with evidence\n3. Gradual exposure - avoiding things makes anxiety stronger\n4. Regular exercise - reduces baseline anxiety over time\n5. Reducing caffeine and alcohol\n6. CBT therapy - most effective long-term treatment\n\nWhat doesn\'t help long-term: avoidance, reassurance-seeking, constant checking.' })}
        />
        <ResourceCard
          variants={itemVariants}
          icon={<School size={28} />} iconBg="bg-[#e8eaf6]" iconColor="text-[#3949ab]"
          title="School Awareness Toolkit"
          desc="Session guides and resources for teachers and school counsellors."
          tag="Community"
          onClick={() => setSelectedResource({ title: 'School Awareness Toolkit', desc: 'Resources for teachers and counsellors.', content: 'For Teachers:\n• Lesson plan: "What is mental health?" (45 mins, ages 13+)\n• Warning signs to look for in students: withdrawal, grade changes, irritability\n• How to approach a student you\'re concerned about: private, non-judgmental, ask directly\n• Referral pathway: when and how to involve school counsellor or parents\n\nFor Counsellors:\n• PHQ-A (adolescent version) screening tool\n• How to conduct a safe conversation about self-harm\n• Crisis protocol: when to call parents, when to call emergency services\n• Building a school-wide culture of help-seeking\n\nFor Students:\n• It\'s okay to not be okay\n• How to talk to a trusted adult\n• Anonymous helplines available to young people\n• Looking out for friends - what to do if you\'re worried about someone' })}
        />
      </motion.div>

      {/* Resource Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedResource && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedResource(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-[2rem] max-w-lg w-full shadow-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-br from-[#4a7c59] to-[#4d7a52] p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-2xl text-white font-bold">{selectedResource.title}</h3>
                      <p className="text-white/70 text-sm mt-1">{selectedResource.desc}</p>
                    </div>
                    <button onClick={() => setSelectedResource(null)} className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors ml-4 shrink-0">
                      <X size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-[#2c3028] text-sm leading-relaxed">{selectedResource.content}</pre>
                </div>
                <div className="p-4 border-t border-[#f0ece5]">
                  <p className="text-xs text-[#6b7265] text-center">This information is for educational purposes only. Please consult a qualified healthcare professional for personalised advice.</p>
                </div>
              </motion.div>
            </motion.div>
          )}
          {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
        </AnimatePresence>,
        document.body
      )}

    </motion.div>
  );
}

const ResourceCard = ({ icon, iconBg, iconColor, title, desc, tag, onClick, variants }: any) => (
  <motion.div
    variants={variants}
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="bg-white rounded-[1.5rem] border border-[#d8d0c4] p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
  >
    <div className={`w-14 h-14 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
      {icon}
    </div>
    <h4 className="font-bold text-lg text-[#2c3028] mb-2">{title}</h4>
    <p className="text-[#6b7265] text-sm leading-relaxed mb-4">{desc}</p>
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold bg-[#e8f5e9] text-[#4a7c59] px-3 py-1 rounded-full border border-[#c8e6c9]">{tag}</span>
      <span className="text-xs text-[#6b7265] group-hover:text-[#4a7c59] transition-colors font-medium">Read more →</span>
    </div>
  </motion.div>
);
