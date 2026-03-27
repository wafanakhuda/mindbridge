import { motion } from 'motion/react';
import { User, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function SignIn({ onSignIn }: { onSignIn: (role: string) => void }) {
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
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#b8d4ba] rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fce4ec] rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#2d5a30] text-white mb-6 shadow-xl">
          <span className="text-4xl">🌿</span>
        </div>
        <h1 className="font-serif text-5xl font-bold text-[#2c3028] mb-4">MindBridge</h1>
        <p className="text-xl text-[#6b7265] max-w-md mx-auto">
          Select your portal to access the platform.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full relative z-10"
      >
        <PersonaCard 
          icon={<User size={32} />}
          title="Patient Portal"
          description="Access mental health screenings, peer community, and self-help resources."
          color="bg-[#e8f5e9]"
          iconColor="text-[#2e7d32]"
          borderColor="border-[#c8e6c9]"
          onClick={() => onSignIn('patient')}
        />
        <PersonaCard 
          icon={<Building2 size={32} />}
          title="Clinic Portal"
          description="Manage patient referrals, view screening analytics, and track outcomes."
          color="bg-[#e3f2fd]"
          iconColor="text-[#1565c0]"
          borderColor="border-[#bbdefb]"
          onClick={() => onSignIn('clinic')}
        />
        <PersonaCard 
          icon={<ShieldCheck size={32} />}
          title="Admin Portal"
          description="System-wide analytics, clinic management, and platform health."
          color="bg-[#f3e5f5]"
          iconColor="text-[#7b1fa2]"
          borderColor="border-[#e1bee7]"
          onClick={() => onSignIn('admin')}
        />
      </motion.div>
    </div>
  );
}

const PersonaCard = ({ icon, title, description, color, iconColor, borderColor, onClick }: any) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 30 },
      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    }}
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`bg-white border-2 ${borderColor} rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center group`}
  >
    <div className={`w-20 h-20 rounded-full ${color} ${iconColor} flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="font-serif text-2xl font-bold text-[#2c3028] mb-3">{title}</h3>
    <p className="text-[#6b7265] mb-8 flex-1">{description}</p>
    <div className={`flex items-center gap-2 font-bold ${iconColor} group-hover:translate-x-2 transition-transform`}>
      Enter Portal <ArrowRight size={18} />
    </div>
  </motion.div>
);
