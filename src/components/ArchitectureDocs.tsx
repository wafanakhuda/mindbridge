import { motion } from 'motion/react';
import { Database, Server, Bot, MessageSquare, LayoutTemplate, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function ArchitectureDocs({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState('architecture');

  const tabs = [
    { id: 'architecture', label: 'System Architecture', icon: <LayoutTemplate size={16} /> },
    { id: 'schema',       label: 'Database Schema',     icon: <Database size={16} /> },
    { id: 'api',          label: 'API Endpoints',        icon: <Server size={16} /> },
    { id: 'agents',       label: 'Agent Workflows',      icon: <Bot size={16} /> },
    { id: 'conversations', label: 'Sample Flow',         icon: <MessageSquare size={16} /> },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex items-center gap-4 mb-8">
        {onBack && (
          <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-[#f0ece5] transition-colors border border-[#d8d0c4]">
            <ArrowLeft size={18} className="text-[#2c3028]" />
          </button>
        )}
        <div>
          <h2 className="font-serif text-3xl text-[#2c3028] font-bold">MindBridge System Specs</h2>
          <p className="text-[#6b7265] text-sm mt-0.5">Technical documentation - Hack for Health Equity 2026</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === tab.id ? 'bg-[#4a7c59] text-white shadow-md' : 'bg-white text-[#6b7265] hover:bg-[#e8f5e9] hover:text-[#4a7c59] border border-[#d8d0c4]'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#d8d0c4] rounded-[2rem] p-8 shadow-sm">
        {activeTab === 'architecture'  && <ArchitectureTab />}
        {activeTab === 'schema'        && <SchemaTab />}
        {activeTab === 'api'           && <ApiTab />}
        {activeTab === 'agents'        && <AgentsTab />}
        {activeTab === 'conversations' && <ConversationsTab />}
      </div>
    </motion.div>
  );
}

const ArchitectureTab = () => (
  <div className="space-y-6 text-[#2c3028]">
    <h3 className="text-2xl font-serif font-bold border-b border-[#f0ece5] pb-3">System Architecture</h3>
    <p className="text-[#6b7265]">MindBridge is a hybrid community-primary care mental health system. It connects AI-powered conversational screening with real clinic referrals, structured follow-up, and a 195-country crisis directory - all in one platform.</p>

    <div className="grid md:grid-cols-3 gap-4 mt-4">
      {[
        { title: 'Layer 1 - Community Screening', color: 'bg-[#e8f5e9] border-[#c8e6c9]', accent: 'text-[#2e7d32]', items: ['Conversational PHQ-2 + GAD-2 check-in', '6 interactive widgets (MoodWheel, EnergySlider, MiniBreathing, SleepCheck, ThoughtBubble, ScaleQuestion)', 'ChatGPT history extraction for richer context', '8 Gemini 2.0 Flash AI agents running in sequence'] },
        { title: 'Layer 2 - Primary Care Link', color: 'bg-[#e3f2fd] border-[#bbdefb]', accent: 'text-[#1565c0]', items: ['Risk-based referral to 10 real doctors across 10 countries', 'Crisis cases: auto-confirmed appointment + Jit.si video link generated', 'Clinic portal: live MongoDB dashboard with real aggregations', 'PHQ-9, GAD-7, MDI, PCL-5, DSM-5 clinical tools for practitioners'] },
        { title: 'Layer 3 - Follow-Up Engine', color: 'bg-[#fff8e1] border-[#ffe082]', accent: 'text-[#f57f17]', items: ['FollowUpAgent generates personalised 7-day check-in question', 'Appointments tracked with status (pending / confirmed / completed)', 'Patient health record: screening history + appointment history', 'Overdue follow-up alerts on clinic dashboard'] },
      ].map(s => (
        <div key={s.title} className={`border-2 ${s.color} rounded-2xl p-5`}>
          <h4 className={`font-bold text-sm mb-3 ${s.accent}`}>{s.title}</h4>
          <ul className="space-y-1.5">
            {s.items.map((item, i) => (
              <li key={i} className="flex gap-2 text-xs text-[#2c3028]">
                <span className={`${s.accent} shrink-0 mt-0.5`}>-</span>{item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <h4 className="font-bold text-base mt-6">Tech Stack</h4>
    <div className="flex flex-wrap gap-2">
      {['Frontend: React + Vite + Tailwind v3', 'Backend: Node.js + Express', 'Database: MongoDB Atlas', 'AI: Gemini 2.0 Flash (8 agents)', 'Auth: JWT + bcrypt (12 rounds)', 'Deploy: Railway + GitHub', 'Screening: PHQ-2 / GAD-2 validated', 'Directory: 195 countries', 'Video: Jit.si (crisis appointments)', 'Animations: Framer Motion'].map(tech => (
        <span key={tech} className="bg-[#f0ece5] text-[#2c3028] px-3 py-1 rounded-full text-xs font-medium border border-[#d8d0c4]">{tech}</span>
      ))}
    </div>

    <h4 className="font-bold text-base mt-4">Privacy & Security</h4>
    <div className="grid md:grid-cols-2 gap-3">
      {[
        'No PII stored in screenings - anonymous IDs only',
        'Passwords hashed with bcrypt (12 salt rounds)',
        'JWT tokens expire after 7 days',
        'ChatGPT context truncated to 300 chars before storage',
        'Peer community posts are anonymous - no user IDs linked',
        'Crisis appointments generate unique Jit.si room IDs',
      ].map(p => (
        <div key={p} className="flex gap-2 text-xs text-[#2c3028] bg-[#f0fdf4] border border-[#c8e6c9] rounded-xl px-3 py-2">
          <span className="text-[#4a7c59] font-bold shrink-0">OK</span>{p}
        </div>
      ))}
    </div>
  </div>
);

const SchemaTab = () => (
  <div className="space-y-5 text-[#2c3028]">
    <h3 className="text-2xl font-serif font-bold border-b border-[#f0ece5] pb-3">Database Schema (MongoDB Atlas)</h3>
    <SchemaBlock title="users" code={`{
  _id: ObjectId,
  email: string (unique, lowercase),
  passwordHash: string (bcrypt 12 rounds),
  role: "patient" | "clinic" | "admin",
  name: string,
  createdAt: Date
}`} />
    <SchemaBlock title="screenings" code={`{
  _id: ObjectId,
  anonymousId: string (e.g. "anon-demo-1009"),  // never linked to name
  userId: string (ObjectId ref, optional),
  phqScore: number (0-6),
  gadScore: number (0-6),
  riskLevel: "low" | "moderate" | "high",
  riskScore: number (0-100),
  userContext: string (max 300 chars, no PII),
  channel: "web" | "whatsapp" | "sms",
  isCrisis: boolean,
  followUpDue: Date (default: +7 days),
  followUpDone: boolean,
  createdAt: Date
}`} />
    <SchemaBlock title="appointments" code={`{
  _id: ObjectId,
  patientId: string (userId),
  doctorName: string,
  doctorEmail: string,
  doctorSpeciality: string,
  clinicName: string,
  clinicLocation: string,
  dateTime: Date,
  status: "pending" | "confirmed" | "completed" | "cancelled",
  riskLevel: "moderate" | "high" | "crisis",
  isCritical: boolean,
  notes: string,
  meetingLink: string (Jit.si URL, crisis only),
  createdAt: Date
}`} />
    <SchemaBlock title="doctors" code={`{
  _id: ObjectId,
  name: string,
  email: string (unique),
  speciality: string,
  clinicName: string,
  clinicLocation: string,
  availableSlots: Date[],
  acceptsCritical: boolean,
  languages: string[],
  rating: number (1-5),
  responseTimeMinutes: number
}`} />
  </div>
);

const ApiTab = () => (
  <div className="space-y-5 text-[#2c3028]">
    <h3 className="text-2xl font-serif font-bold border-b border-[#f0ece5] pb-3">Core API Endpoints</h3>
    <div className="space-y-3">
      <ApiBlock method="POST" endpoint="/api/auth/register" desc="Register new user. Body: {email, password, name, role}. Returns JWT token + user object." />
      <ApiBlock method="POST" endpoint="/api/auth/login" desc="Login. Body: {email, password}. Returns JWT token (7d expiry) + user object." />
      <ApiBlock method="GET"  endpoint="/api/auth/me" desc="Get current user from JWT. Returns user object without passwordHash." />
      <ApiBlock method="POST" endpoint="/api/screenings" desc="Save PHQ-2/GAD-2 result. Requires auth. Body: {phqScore, gadScore, riskLevel, riskScore, userContext, channel, isCrisis}." />
      <ApiBlock method="GET"  endpoint="/api/screenings/my" desc="Get current patient's last 10 screenings. Requires auth. Never returns userContext." />
      <ApiBlock method="GET"  endpoint="/api/screenings/stats" desc="Aggregate stats for clinic/admin dashboard. Requires clinic or admin role." />
      <ApiBlock method="GET"  endpoint="/api/appointments/doctors" desc="List available doctors. Pass ?critical=true to filter to crisis-accepting doctors only." />
      <ApiBlock method="POST" endpoint="/api/appointments" desc="Book appointment. Body: {doctorEmail, dateTime, riskLevel, notes, isCritical}. Crisis = auto-confirmed + Jit.si link." />
      <ApiBlock method="GET"  endpoint="/api/appointments/my" desc="Patient's own appointment history sorted by date." />
      <ApiBlock method="PATCH" endpoint="/api/appointments/:id/status" desc="Clinic updates appointment status. Body: {status}." />
      <ApiBlock method="GET"  endpoint="/api/dashboard/clinic" desc="Full clinic dashboard data: KPIs, risk breakdown, channel stats, recent screenings, appointments. Requires clinic role." />
      <ApiBlock method="GET"  endpoint="/api/dashboard/admin" desc="System-wide stats: users, screenings, appointments, crisis events, doctors by count. Requires admin role." />
      <ApiBlock method="GET"  endpoint="/api/health" desc="Health check. Returns {status: 'ok', db: 'connected' | 'disconnected'}." />
    </div>
  </div>
);

const AgentsTab = () => (
  <div className="space-y-5 text-[#2c3028]">
    <h3 className="text-2xl font-serif font-bold border-b border-[#f0ece5] pb-3">8 Gemini 2.0 Flash AI Agents</h3>
    <p className="text-sm text-[#6b7265]">All agents call Gemini 2.0 Flash directly. Every agent has a fallback so the app works even without an API key.</p>
    <div className="grid grid-cols-1 gap-3">
      {[
        { name: 'TriageAgent',            role: 'Warm Opening',        color: 'border-[#c8e6c9] bg-[#e8f5e9]', accent: 'text-[#2e7d32]',  desc: 'Reads the user\'s exact words and responds in 2 warm sentences. References their specific language. If ChatGPT history provided, acknowledges it and weaves it in. Never generic.' },
        { name: 'ConversationalScreener', role: 'Non-Linear Questions', color: 'border-[#bbdefb] bg-[#e3f2fd]', accent: 'text-[#1565c0]',  desc: 'Generates each PHQ-2 / GAD-2 question based on the user\'s PREVIOUS answer. This is what makes screening non-linear - each question references what they just said.' },
        { name: 'BridgeAgent',            role: 'Empathetic Bridge',    color: 'border-[#d1c4e9] bg-[#ede7f6]', accent: 'text-[#7b1fa2]',  desc: 'Between each question, generates a single warm acknowledgment sentence (max 15 words) that validates what the user shared before moving on.' },
        { name: 'RiskAgent',              role: 'Scoring & Sentiment',  color: 'border-[#f8bbd0] bg-[#fce4ec]', accent: 'text-[#c62828]',  desc: 'Analyses PHQ-2 + GAD-2 scores AND the full conversation text. Returns 0-100 risk score, personalised message, key clinical insight, and sentiment flag (e.g. "minimising", "overwhelmed"). JSON output.' },
        { name: 'TherapyAgent',           role: 'CBT Intervention',     color: 'border-[#c8e6c9] bg-[#e8f5e9]', accent: 'text-[#2e7d32]',  desc: 'Picks the single most appropriate CBT technique: box breathing (anxiety), 5-4-3-2-1 grounding (rumination), behavioural activation (depression), thought challenging (beliefs), PMR (tension). Personalises rationale.' },
        { name: 'CareNavigatorAgent',     role: 'Personalised Steps',   color: 'border-[#ffe082] bg-[#fff8e1]', accent: 'text-[#f57f17]',  desc: 'Generates 3 specific, actionable next steps that reference the user\'s situation. HIGH: crisis helpline first. MODERATE: GP visit. LOW: maintain strengths. Never generic advice.' },
        { name: 'FollowUpAgent',          role: 'Retention',            color: 'border-[#bbdefb] bg-[#e3f2fd]', accent: 'text-[#1565c0]',  desc: 'Generates a personalised 7-day check-in question shown at the end of results. In production, used to re-engage patients via automated message with context from their original screening.' },
        { name: 'FreeTextAgent',          role: 'Mid-Screening Support', color: 'border-[#d8d0c4] bg-[#f5f0e8]', accent: 'text-[#6b7265]', desc: 'Handles anything the user types freely during the chat. 2 sentences max. If crisis language detected, directs to Directory tab. Otherwise validates and gently guides back to the screening.' },
      ].map(a => (
        <div key={a.name} className={`p-4 rounded-xl border-2 ${a.color}`}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className={`font-bold ${a.accent}`}>{a.name}</h4>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7265] bg-white px-2 py-0.5 rounded-full border border-[#d8d0c4] shrink-0">{a.role}</span>
          </div>
          <p className="text-xs text-[#2c3028] leading-relaxed">{a.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const ConversationsTab = () => (
  <div className="space-y-6 text-[#2c3028]">
    <h3 className="text-2xl font-serif font-bold border-b border-[#f0ece5] pb-3">Sample Screening Flow</h3>
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-bold text-sm text-[#4a7c59] mb-3 uppercase tracking-wider">Patient Experience</h4>
        <div className="bg-[#f7f3ed] rounded-2xl p-4 space-y-3 text-sm">
          {[
            { step: '1', label: 'ChatGPT Panel', desc: 'Copy prompt, paste into ChatGPT, paste summary back. Adds historical context to all agents.', icon: '🤖' },
            { step: '2', label: 'MoodWheel', desc: 'Tap one of 6 mood options. TriageAgent responds personally referencing this exact choice.', icon: '🎡' },
            { step: '3', label: 'ThoughtBubble', desc: 'Multi-select chips ("I can\'t stop worrying" etc). Adds qualitative context before clinical questions.', icon: '💭' },
            { step: '4', label: 'EnergySlider', desc: 'Drag slider 1-10. Energy captured as additional context for RiskAgent.', icon: '⚡' },
            { step: '5', label: 'PHQ-2 Questions', desc: 'ConversationalScreener generates each question from the previous answer. Non-linear.', icon: '📋' },
            { step: '6', label: 'MiniBreathing', desc: 'Mid-screening breathing exercise with animated circle. Optional (has Skip).', icon: '🌬️' },
            { step: '7', label: 'SleepCheck + GAD-2', desc: 'Sleep duration captured, then final 2 anxiety questions.', icon: '💤' },
            { step: '8', label: 'Results', desc: '4 agents run: RiskAgent, TherapyAgent, CareNavigator, FollowUpAgent. All show as live ticks.', icon: '✅' },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <span className="w-5 h-5 bg-[#4a7c59] text-white rounded-full text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">{s.step}</span>
              <div>
                <span className="font-bold text-[#2c3028]">{s.icon} {s.label}</span>
                <span className="text-[#6b7265] text-xs block">{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-bold text-sm text-[#c62828] mb-3 uppercase tracking-wider">Crisis Pathway</h4>
        <div className="bg-[#fdfaf4] rounded-2xl p-4 space-y-3 text-xs border border-[#d8d0c4]">
          {[
            { from: 'Patient', msg: 'I\'ve been feeling really hopeless lately. Nothing seems worth it anymore.' },
            { from: 'TriageAgent', msg: 'I can hear how exhausted you are, and I want you to know that reaching out right now matters. Let me ask you a few questions so I can understand what you\'ve been going through.' },
            { from: 'Patient (Q1)', msg: 'Nearly every day - I feel no interest in anything.' },
            { from: 'BridgeAgent', msg: 'That sounds genuinely exhausting.' },
            { from: 'Patient (Q2-4)', msg: '[Answers all 4 questions with high scores]' },
            { from: 'RiskAgent', msg: 'Score: 83/100 - High Risk. Insight: User shows signs of anhedonia and hopelessness. Sentiment: Not minimising - expressing genuine distress.' },
            { from: 'CareNavigator', msg: '1. Find your crisis helpline in Directory now. 2. Visit your GP today. 3. Tell one trusted person.' },
            { from: 'System', msg: 'Crisis booking panel appears. User selects Dr Sarah Chen. Jit.si video link auto-generated. Appointment status: CONFIRMED.' },
          ].map((m, i) => (
            <div key={i} className={`rounded-xl p-2.5 ${m.from.startsWith('Patient') ? 'bg-[#4a7c59] text-white ml-4' : m.from === 'System' ? 'bg-[#fce4ec] border border-[#f48fb1]' : 'bg-white border border-[#d8d0c4]'}`}>
              <div className={`text-[9px] font-bold mb-0.5 ${m.from.startsWith('Patient') ? 'text-white/70' : m.from === 'System' ? 'text-[#c62828]' : 'text-[#4a7c59]'}`}>{m.from}</div>
              <div className={m.from.startsWith('Patient') ? 'text-white' : 'text-[#2c3028]'}>{m.msg}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SchemaBlock = ({ title, code }: any) => (
  <div className="bg-gray-900 rounded-xl overflow-hidden">
    <div className="bg-gray-800 text-gray-300 px-4 py-2 text-xs font-mono border-b border-gray-700">{title}</div>
    <pre className="p-4 text-green-400 text-sm font-mono overflow-x-auto leading-relaxed"><code>{code}</code></pre>
  </div>
);

const ApiBlock = ({ method, endpoint, desc }: any) => (
  <div className="flex flex-col gap-2 p-4 border border-[#d8d0c4] rounded-xl bg-[#fdfaf4] hover:border-[#4a7c59]/30 transition-colors">
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white shrink-0 ${method === 'GET' ? 'bg-[#1565c0]' : method === 'POST' ? 'bg-[#2e7d32]' : 'bg-[#f57f17]'}`}>{method}</span>
      <code className="text-xs font-mono font-bold text-[#2c3028] break-all">{endpoint}</code>
    </div>
    <div className="text-xs text-[#6b7265] leading-relaxed">{desc}</div>
  </div>
);
