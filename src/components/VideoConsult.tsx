import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Video, Phone, Clock, Shield, Copy, Check, ExternalLink, AlertTriangle } from 'lucide-react';

const FREE_DOCTORS = [
  {
    name: 'Dr Sarah Chen',
    speciality: 'Psychiatry',
    location: 'London, UK',
    languages: ['English', 'Mandarin'],
    responseTime: '~15 minutes',
    rating: 4.9,
    available: true,
    emoji: '👩🏻‍⚕️',
    bio: 'Specialist in anxiety, depression and crisis intervention. 12 years experience in community mental health.',
  },
  {
    name: 'Dr James Okafor',
    speciality: 'Clinical Psychology',
    location: 'Lagos, Nigeria',
    languages: ['English', 'Yoruba'],
    responseTime: '~20 minutes',
    rating: 4.8,
    available: true,
    emoji: '👨🏿‍⚕️',
    bio: 'CBT specialist focusing on anxiety disorders and trauma recovery. Fluent in English and Yoruba.',
  },
  {
    name: 'Dr Priya Sharma',
    speciality: 'General Psychiatry',
    location: 'Bangalore, India',
    languages: ['English', 'Hindi', 'Kannada'],
    responseTime: '~30 minutes',
    rating: 4.7,
    available: true,
    emoji: '👩🏽‍⚕️',
    bio: 'Community psychiatry expert with experience in low-resource settings. Speaks 3 languages.',
  },
  {
    name: 'Dr Ahmed Al-Rashid',
    speciality: 'Psychiatry',
    location: 'Dubai, UAE',
    languages: ['Arabic', 'English'],
    responseTime: '~10 minutes',
    rating: 4.9,
    available: true,
    emoji: '👨🏽‍⚕️',
    bio: 'Emergency psychiatry and crisis intervention. Fastest response times. Arabic and English.',
  },
  {
    name: 'Dr Fatima Al-Hassan',
    speciality: 'Child & Adolescent Psychiatry',
    location: 'Nairobi, Kenya',
    languages: ['English', 'Swahili'],
    responseTime: '~25 minutes',
    rating: 4.8,
    available: false,
    emoji: '👩🏿‍⚕️',
    bio: 'Specialist in young people and families. Available for both children and adult consultations.',
  },
  {
    name: 'Dr Lisa Nguyen',
    speciality: 'Trauma & PTSD',
    location: 'Melbourne, Australia',
    languages: ['English', 'Vietnamese'],
    responseTime: '~20 minutes',
    rating: 4.9,
    available: true,
    emoji: '👩🏻‍⚕️',
    bio: 'EMDR certified trauma therapist. Specialises in PTSD, grief, and complex trauma recovery.',
  },
];

function generateRoomId(doctorName: string) {
  const clean = doctorName.replace(/[^a-z0-9]/gi, '').toLowerCase();
  const rand = Math.random().toString(36).slice(2, 8);
  return `mindbridge-${clean}-${rand}`;
}

export default function VideoConsult() {
  const [selected, setSelected] = useState<typeof FREE_DOCTORS[0] | null>(null);
  const [roomId, setRoomId] = useState('');
  const [copied, setCopied] = useState(false);
  const [inCall, setInCall] = useState(false);

  useEffect(() => {
    if (selected) {
      setRoomId(generateRoomId(selected.name));
      setInCall(false);
    }
  }, [selected]);

  const meetUrl = `https://meet.jit.si/${roomId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(meetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto px-4 py-6 sm:py-8">

      <div className="text-center mb-8">
        <h2 className="font-serif text-4xl text-[#2c3028] mb-3">Real-Time Consultation</h2>
        <p className="text-[#6b7265] max-w-xl mx-auto">Connect with a mental health professional instantly via secure video call. Free of charge.</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-[#e8f5e9] border border-[#c8e6c9] text-[#2e7d32] px-4 py-2 rounded-full text-sm font-bold">
          <Shield size={14} /> End-to-end encrypted via Jit.si - no account needed
        </div>
      </div>

      {!selected ? (
        <>
          <div className="bg-[#fff8e1] border border-[#ffe082] rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle size={16} className="text-[#f57f17] shrink-0 mt-0.5" />
            <p className="text-sm text-[#2c3028]">
              <strong>For demonstration purposes</strong> - in production, doctors would be verified and scheduled. This shows how instant video consultation would work using free, open-source Jit.si technology.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FREE_DOCTORS.map((doc) => (
              <motion.div key={doc.name} whileHover={{ y: -4 }}
                onClick={() => doc.available && setSelected(doc)}
                className={`bg-white border-2 rounded-2xl p-5 transition-all ${doc.available ? 'border-[#d8d0c4] hover:border-[#4a7c59] cursor-pointer hover:shadow-lg' : 'border-[#d8d0c4] opacity-60 cursor-not-allowed'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{doc.emoji}</span>
                    <div>
                      <div className="font-bold text-sm text-[#2c3028]">{doc.name}</div>
                      <div className="text-xs text-[#4a7c59] font-medium">{doc.speciality}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${doc.available ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#f0ece5] text-[#6b7265]'}`}>
                    {doc.available ? 'Available' : 'Offline'}
                  </span>
                </div>

                <p className="text-xs text-[#6b7265] leading-relaxed mb-3">{doc.bio}</p>

                <div className="space-y-1.5 text-xs text-[#6b7265]">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} /> {doc.responseTime}
                  </div>
                  <div>📍 {doc.location}</div>
                  <div>🗣 {doc.languages.join(', ')}</div>
                  <div>⭐ {doc.rating}/5.0</div>
                </div>

                {doc.available && (
                  <div className="mt-3 text-xs font-bold text-[#4a7c59] flex items-center gap-1">
                    <Video size={12} /> Start video call
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">

          <button onClick={() => { setSelected(null); setInCall(false); }}
            className="mb-5 text-sm text-[#6b7265] hover:text-[#2c3028] flex items-center gap-1.5 transition-colors">
            Back to doctors
          </button>

          {/* Doctor card */}
          <div className="bg-white border-2 border-[#4a7c59] rounded-2xl p-5 mb-5">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{selected.emoji}</span>
              <div className="flex-1">
                <div className="font-bold text-[#2c3028]">{selected.name}</div>
                <div className="text-sm text-[#4a7c59] font-medium">{selected.speciality}</div>
                <div className="text-xs text-[#6b7265] mt-0.5">{selected.location} - Responds in {selected.responseTime}</div>
              </div>
              <span className="bg-[#e8f5e9] text-[#2e7d32] text-xs font-bold px-2 py-1 rounded-full">Available</span>
            </div>
          </div>

          {/* Meeting room */}
          <div className="bg-[#f0fdf4] border-2 border-[#4a7c59]/30 rounded-2xl p-6 mb-5 space-y-4">
            <h3 className="font-bold text-[#2c3028]">Your private meeting room is ready</h3>
            <p className="text-sm text-[#6b7265]">This is a secure, encrypted room. Share the link with your doctor or join directly.</p>

            <div className="flex items-center gap-2 bg-white rounded-xl border border-[#d8d0c4] p-3">
              <span className="text-xs font-mono text-[#2c3028] flex-1 truncate min-w-0">{meetUrl}</span>
              <button onClick={copyLink}
                className="flex items-center gap-1.5 bg-[#f0ece5] hover:bg-[#d8d0c4] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0">
                {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href={meetUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#4a7c59] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#3a6b3e] transition-all shadow-md">
                <Video size={16} /> Join Video Call
              </a>
              <a href={`tel:${meetUrl}`}
                className="flex items-center justify-center gap-2 bg-white border-2 border-[#4a7c59] text-[#4a7c59] py-3.5 rounded-xl font-bold text-sm hover:bg-[#e8f5e9] transition-all">
                <Phone size={16} /> Audio Only
              </a>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white border border-[#d8d0c4] rounded-2xl p-5">
            <h4 className="font-bold text-[#2c3028] text-sm mb-3">How this works</h4>
            <div className="space-y-2.5">
              {[
                { step: '1', text: 'Click "Join Video Call" - your camera and microphone will be requested', icon: '📹' },
                { step: '2', text: 'Share the meeting link with your doctor via WhatsApp, email or SMS', icon: '🔗' },
                { step: '3', text: 'Doctor joins the same room - no app download needed on either side', icon: '👩‍⚕️' },
                { step: '4', text: 'Call is end-to-end encrypted. No recording. No data stored by Jit.si.', icon: '🔒' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3 text-sm text-[#2c3028]">
                  <span className="w-5 h-5 bg-[#4a7c59] text-white rounded-full text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">{s.step}</span>
                  <span>{s.icon} {s.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#6b7265]">
              <ExternalLink size={11} />
              <a href="https://jitsi.org" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Powered by Jit.si - 100% free, open source, no account required
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
