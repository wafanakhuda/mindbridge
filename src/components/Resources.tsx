import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Book, HeartPulse, BrainCircuit, Users, School, X } from 'lucide-react';

export default function Resources() {
  const [selectedResource, setSelectedResource] = useState<any>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-4xl text-[#2c3028] mb-4">Self-Help & Educational Resources</h2>
        <p className="text-lg text-[#6b7265]">Guided tools, information, and community support materials to help you manage your mental wellbeing.</p>
      </div>

      {/* Anxiety Triggers Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#fff8e1] to-[#ffecb3] border border-[#ffe082] p-8 rounded-[2rem] mb-16 shadow-sm relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 text-9xl opacity-10">⚠️</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#c4a040] text-white p-3 rounded-2xl shadow-md">
              <AlertCircle size={28} />
            </div>
            <h3 className="font-serif text-3xl font-bold text-[#2c3028]">Understanding Anxiety Triggers</h3>
          </div>
          <p className="text-[#2c3028] text-lg mb-8 max-w-3xl">
            Anxiety triggers are specific situations, thoughts, or environments that cause an increase in anxiety symptoms. Identifying them is the first step to managing them.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50">
              <h4 className="font-bold text-xl text-[#d4843a] mb-4 flex items-center gap-2">
                <span className="bg-[#d4843a]/10 p-1.5 rounded-lg">🔍</span> Common Triggers
              </h4>
              <ul className="space-y-3">
                {['High-stress work or school environments', 'Social situations or public speaking', 'Financial concerns or instability', 'Health issues or medical appointments', 'Caffeine or poor sleep habits'].map((item, i) => (
                  <li key={i} className="flex gap-3 text-[#2c3028]">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#d4843a] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/50">
              <h4 className="font-bold text-xl text-[#7a9e7e] mb-4 flex items-center gap-2">
                <span className="bg-[#7a9e7e]/10 p-1.5 rounded-lg">🛡️</span> Management Strategies
              </h4>
              <ul className="space-y-3">
                {['Keep a trigger journal to identify patterns', 'Practice deep breathing (box breathing)', 'Gradual exposure in a safe environment', 'Limit caffeine and prioritize sleep', 'Seek professional cognitive behavioral therapy (CBT)'].map((item, i) => (
                  <li key={i} className="flex gap-3 text-[#2c3028]">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-[#7a9e7e] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <ResourceCard 
          icon={<HeartPulse size={24} className="text-white" />}
          iconBg="bg-[#5a8c5e]"
          title="Guided Breathing Exercise"
          desc="A 5-minute box-breathing technique to manage anxiety in the moment."
          tag="Anxiety"
          imgSeed="meditation"
          onClick={() => setSelectedResource({ title: "Guided Breathing Exercise", desc: "A 5-minute box-breathing technique to manage anxiety in the moment.", imgSeed: "meditation", content: "1. Inhale for 4 seconds.\n2. Hold your breath for 4 seconds.\n3. Exhale for 4 seconds.\n4. Hold your breath for 4 seconds.\n5. Repeat for 5 minutes." })}
        />
        <ResourceCard 
          icon={<Book size={24} className="text-white" />}
          iconBg="bg-[#c4a040]"
          title="Mood Journal Starter"
          desc="Simple daily prompts to track your emotional patterns over time."
          tag="Depression"
          imgSeed="journal"
          onClick={() => setSelectedResource({ title: "Mood Journal Starter", desc: "Simple daily prompts to track your emotional patterns over time.", imgSeed: "journal", content: "• How am I feeling today on a scale of 1-10?\n• What is one thing I am grateful for?\n• What is one challenge I faced today and how did I handle it?\n• What is one thing I can do tomorrow to care for myself?" })}
        />
        <ResourceCard 
          icon={<BrainCircuit size={24} className="text-white" />}
          iconBg="bg-[#7baec8]"
          title="Sleep Hygiene Guide"
          desc="Evidence-based habits to improve sleep quality and daily energy."
          tag="General Wellbeing"
          imgSeed="sleep"
          onClick={() => setSelectedResource({ title: "Sleep Hygiene Guide", desc: "Evidence-based habits to improve sleep quality and daily energy.", imgSeed: "sleep", content: "• Stick to a consistent sleep schedule.\n• Create a relaxing bedtime routine.\n• Limit exposure to screens before bed.\n• Avoid caffeine and heavy meals in the evening.\n• Ensure your bedroom is cool, dark, and quiet." })}
        />
        <ResourceCard 
          icon={<Users size={24} className="text-white" />}
          iconBg="bg-[#c4605a]"
          title="Talking to a Loved One"
          desc="How to start conversations about mental health with someone you care about."
          tag="Support"
          imgSeed="friends"
          onClick={() => setSelectedResource({ title: "Talking to a Loved One", desc: "How to start conversations about mental health with someone you care about.", imgSeed: "friends", content: "• Choose a quiet, comfortable setting.\n• Use 'I' statements (e.g., 'I feel overwhelmed when...').\n• Be honest and direct about your feelings.\n• Ask for specific support if you know what you need.\n• Remember that it's okay if they don't fully understand right away." })}
        />
        <ResourceCard 
          icon={<AlertCircle size={24} className="text-white" />}
          iconBg="bg-[#8e24aa]"
          title="Understanding Depression"
          desc="Plain-language guide to recognising symptoms, causes, and treatment options."
          tag="Education"
          imgSeed="mind"
          onClick={() => setSelectedResource({ title: "Understanding Depression", desc: "Plain-language guide to recognising symptoms, causes, and treatment options.", imgSeed: "mind", content: "Depression is a common and serious medical illness that negatively affects how you feel, the way you think, and how you act. Symptoms can include feeling sad, loss of interest in activities, changes in appetite, trouble sleeping, and loss of energy. Treatment often involves a combination of therapy, medication, and lifestyle changes." })}
        />
        <ResourceCard 
          icon={<School size={24} className="text-white" />}
          iconBg="bg-[#3949ab]"
          title="School Awareness Toolkit"
          desc="Ready-to-use session guides and posters for teachers and school counsellors."
          tag="Community"
          imgSeed="school"
          onClick={() => setSelectedResource({ title: "School Awareness Toolkit", desc: "Ready-to-use session guides and posters for teachers and school counsellors.", imgSeed: "school", content: "This toolkit includes:\n• Lesson plans on mental health awareness.\n• Printable posters for classrooms and hallways.\n• Guidelines for identifying students in distress.\n• Resources for referring students to professional help." })}
        />
      </motion.div>

      {createPortal(
        <AnimatePresence>
          {selectedResource && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedResource(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative z-[101]"
              >
                <div className="h-48 relative">
                  <img src={`https://picsum.photos/seed/${selectedResource.imgSeed}/800/400`} alt={selectedResource.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => setSelectedResource(null)}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-8">
                  <h3 className="font-serif text-3xl text-[#2c3028] mb-2">{selectedResource.title}</h3>
                  <p className="text-[#6b7265] text-lg mb-6">{selectedResource.desc}</p>
                  <div className="bg-[#fdfaf4] p-6 rounded-2xl border border-[#f0ece5]">
                    <p className="text-[#2c3028] whitespace-pre-line leading-relaxed">
                      {selectedResource.content}
                    </p>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={() => setSelectedResource(null)}
                      className="bg-[#2d5a30] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#1e3d20] transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}

const ResourceCard = ({ icon, iconBg, title, desc, tag, imgSeed, onClick }: any) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 30 },
      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    }}
    onClick={onClick}
    className="group bg-white border border-[#d8d0c4] rounded-[2rem] overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer flex flex-col"
  >
    <div className="h-48 overflow-hidden relative">
      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
      <img 
        src={`https://picsum.photos/seed/${imgSeed}/400/300`} 
        alt={title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 right-4 z-20">
        <span className="bg-white/90 backdrop-blur-sm text-[#2c3028] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
          {tag}
        </span>
      </div>
    </div>
    <div className="p-6 relative flex-1 flex flex-col">
      <div className={`absolute -top-8 left-6 w-14 h-14 ${iconBg} rounded-2xl shadow-lg flex items-center justify-center z-20 border-4 border-white group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="font-bold text-xl mb-3 text-[#2c3028] mt-6">{title}</h4>
      <p className="text-[#6b7265] leading-relaxed flex-1">{desc}</p>
      <div className="mt-6 flex items-center text-[#2d5a30] font-semibold text-sm group-hover:translate-x-2 transition-transform">
        Read more <span className="ml-1">→</span>
      </div>
    </div>
  </motion.div>
);
