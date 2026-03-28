import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const PHASES = [
  { label: 'Breathe In',  duration: 4, color: '#4d7a52', scale: 1.4 },
  { label: 'Hold',        duration: 4, color: '#7baec8', scale: 1.4 },
  { label: 'Breathe Out', duration: 4, color: '#d4843a', scale: 0.8 },
  { label: 'Hold',        duration: 4, color: '#c4a040', scale: 0.8 },
];

export default function BreathingExercise({ onClose }: { onClose: () => void }) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(PHASES[0].duration);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          setPhase(p => {
            const next = (p + 1) % PHASES.length;
            if (next === 0) setCycles(cy => cy + 1);
            return next;
          });
          return PHASES[(phase + 1) % PHASES.length].duration;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, phase]);

  const current = PHASES[phase];

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setPhase(0);
    setCount(PHASES[0].duration);
    setCycles(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#fdfaf4] rounded-[2rem] p-10 max-w-md w-full text-center shadow-2xl border border-[#d8d0c4]"
      >
        <h3 className="font-serif text-2xl text-[#2c3028] mb-2">Box Breathing</h3>
        <p className="text-[#6b7265] text-sm mb-8">4-4-4-4 technique — used by athletes and medical professionals to reduce anxiety instantly</p>

        {/* Breathing circle */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <motion.div
              animate={{
                scale: running ? current.scale : 1,
                backgroundColor: running ? current.color : '#b8d4ba',
              }}
              transition={{ duration: current.duration * 0.9, ease: 'easeInOut' }}
              className="absolute w-36 h-36 rounded-full opacity-20"
            />
            <motion.div
              animate={{
                scale: running ? current.scale * 0.7 : 0.7,
                backgroundColor: running ? current.color : '#7a9e7e',
              }}
              transition={{ duration: current.duration * 0.9, ease: 'easeInOut' }}
              className="absolute w-36 h-36 rounded-full opacity-40"
            />
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                key={phase + '-' + count}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-4xl font-bold text-[#2c3028]"
              >
                {running ? count : '·'}
              </motion.div>
              <motion.div
                key={phase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-semibold text-[#6b7265] mt-1"
              >
                {running ? current.label : 'Ready'}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Phase indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {PHASES.map((p, i) => (
            <div
              key={p.label + i}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-500"
                style={{ backgroundColor: running && phase === i ? p.color : '#d8d0c4' }}
              >
                {p.duration}s
              </div>
              <div className="text-[10px] text-[#6b7265] max-w-[48px] text-center leading-tight">{p.label}</div>
            </div>
          ))}
        </div>

        {cycles > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-sm text-[#4a7c59] font-semibold">
            ✓ {cycles} cycle{cycles > 1 ? 's' : ''} completed
          </motion.div>
        )}

        <div className="flex gap-3 justify-center">
          {!running ? (
            <button
              onClick={() => setRunning(true)}
              className="bg-[#4a7c59] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#4d7a52] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {cycles > 0 ? '▶ Continue' : '▶ Start'}
            </button>
          ) : (
            <button
              onClick={() => setRunning(false)}
              className="bg-[#d8d0c4] text-[#2c3028] px-8 py-3.5 rounded-full font-bold hover:bg-[#c4bdb4] transition-all"
            >
              ⏸ Pause
            </button>
          )}
          {cycles > 0 && (
            <button onClick={reset} className="border-2 border-[#d8d0c4] text-[#6b7265] px-6 py-3.5 rounded-full font-bold hover:border-[#4a7c59] hover:text-[#4a7c59] transition-all">
              Reset
            </button>
          )}
        </div>

        <button onClick={onClose} className="mt-6 text-sm text-[#6b7265] hover:text-[#2c3028] transition-colors">
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
