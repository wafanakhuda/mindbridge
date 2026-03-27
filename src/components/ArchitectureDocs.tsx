import { motion } from 'motion/react';
import { Database, Server, Bot, MessageSquare, LayoutTemplate, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function ArchitectureDocs({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState('architecture');

  const tabs = [
    { id: 'architecture', label: 'System Architecture', icon: <LayoutTemplate size={18} /> },
    { id: 'schema', label: 'Database Schema', icon: <Database size={18} /> },
    { id: 'api', label: 'API Endpoints', icon: <Server size={18} /> },
    { id: 'agents', label: 'Agent Workflows', icon: <Bot size={18} /> },
    { id: 'conversations', label: 'Sample Conversations', icon: <MessageSquare size={18} /> },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        {onBack && (
          <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} className="text-[#2c3028]" />
          </button>
        )}
        <div>
          <h2 className="font-serif text-4xl text-[#2c3028] font-bold">MindBridge 2.0 System Specs</h2>
          <p className="text-[#6b7265] mt-2">Technical documentation, architecture, and AI workflows.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              activeTab === tab.id 
                ? 'bg-[#2d5a30] text-white shadow-md' 
                : 'bg-white text-[#6b7265] hover:bg-[#e8f5e9] hover:text-[#2d5a30] border border-[#d8d0c4]'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#d8d0c4] rounded-[2rem] p-8 shadow-sm">
        {activeTab === 'architecture' && <ArchitectureTab />}
        {activeTab === 'schema' && <SchemaTab />}
        {activeTab === 'api' && <ApiTab />}
        {activeTab === 'agents' && <AgentsTab />}
        {activeTab === 'conversations' && <ConversationsTab />}
      </div>
    </motion.div>
  );
}

const ArchitectureTab = () => (
  <div className="space-y-6 text-[#2c3028]">
    <h3 className="text-2xl font-serif font-bold border-b pb-2">System Architecture</h3>
    <p>MindBridge 2.0 is a two-layer mental health access system connecting community digital screening with primary healthcare.</p>
    
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <div className="bg-[#f5f0e8] p-6 rounded-2xl">
        <h4 className="font-bold text-lg mb-4 text-[#2d5a30]">1. Community Digital Entry (Layer 1)</h4>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li><strong>WhatsApp Business API:</strong> Primary interface for low-bandwidth, accessible entry.</li>
          <li><strong>Multi-Agent AI System:</strong> Handles triage, risk scoring, and micro-interventions.</li>
          <li><strong>Multilingual NLP:</strong> Processes English, Hindi, Kannada via Gemini/OpenAI.</li>
        </ul>
      </div>
      <div className="bg-[#e3f2fd] p-6 rounded-2xl">
        <h4 className="font-bold text-lg mb-4 text-[#1565c0]">2. Primary Care Integration (Layer 2)</h4>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li><strong>Clinic Dashboard:</strong> React/Next.js frontend for healthcare workers.</li>
          <li><strong>Clinical Tools:</strong> PHQ-9 / GAD-7 digital forms and decision-tree protocols.</li>
          <li><strong>Follow-up Engine:</strong> Automated SMS/WhatsApp check-ins and adherence nudges.</li>
        </ul>
      </div>
    </div>

    <h4 className="font-bold text-lg mt-8">Tech Stack</h4>
    <div className="flex flex-wrap gap-2">
      {['Frontend: React / Next.js', 'Backend: Node.js / Python', 'Database: Firebase / Supabase', 'AI: Gemini API', 'Messaging: WhatsApp Business API', 'Maps: Google Maps API'].map(tech => (
        <span key={tech} className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">{tech}</span>
      ))}
    </div>
  </div>
);

const SchemaTab = () => (
  <div className="space-y-6 text-[#2c3028]">
    <h3 className="text-2xl font-serif font-bold border-b pb-2">Database Schema (Firebase/Supabase)</h3>
    <div className="space-y-4">
      <SchemaBlock title="Users (Patients)" code={`{
  id: string (UUID),
  phone_hash: string (Anonymized WhatsApp ID),
  language_pref: string ('en', 'hi', 'kn'),
  risk_score: number (0-100),
  risk_level: enum ('LOW', 'MODERATE', 'HIGH', 'CRISIS'),
  assigned_clinic_id: string (UUID, nullable),
  recovery_streak: number,
  created_at: timestamp
}`} />
      <SchemaBlock title="Screenings" code={`{
  id: string (UUID),
  user_id: string (UUID),
  type: enum ('PHQ-2', 'GAD-2', 'PHQ-9', 'GAD-7'),
  responses: jsonb,
  calculated_score: number,
  ai_sentiment_flag: boolean,
  conducted_by: enum ('BOT', 'CLINICIAN'),
  timestamp: timestamp
}`} />
      <SchemaBlock title="Referrals & Follow-ups" code={`{
  id: string (UUID),
  user_id: string (UUID),
  clinic_id: string (UUID),
  status: enum ('PENDING', 'VISITED', 'MISSED'),
  next_checkin_date: timestamp,
  treatment_plan: text,
  adherence_score: number (0-100)
}`} />
    </div>
  </div>
);

const ApiTab = () => (
  <div className="space-y-6 text-[#2c3028]">
    <h3 className="text-2xl font-serif font-bold border-b pb-2">Core API Endpoints</h3>
    <div className="space-y-4">
      <ApiBlock method="POST" endpoint="/api/webhook/whatsapp" desc="Receives incoming messages from WhatsApp Business API. Routes to Multi-Agent system." />
      <ApiBlock method="POST" endpoint="/api/ai/triage" desc="Processes user input, runs PHQ-2/GAD-2, returns Risk Score (0-100) and next action." />
      <ApiBlock method="GET" endpoint="/api/clinics/nearby" desc="Takes lat/lng, returns nearest primary care centers using Google Maps API." />
      <ApiBlock method="POST" endpoint="/api/patients/:id/referral" desc="Creates a referral record linking a high/moderate risk patient to a clinic." />
      <ApiBlock method="POST" endpoint="/api/cron/followup" desc="Triggered daily. Sends SMS/WhatsApp check-ins based on 'next_checkin_date'." />
      <ApiBlock method="GET" endpoint="/api/analytics/heatmaps" desc="Aggregates anonymized risk scores by geographic region for the Community Dashboard." />
    </div>
  </div>
);

const AgentsTab = () => (
  <div className="space-y-6 text-[#2c3028]">
    <h3 className="text-2xl font-serif font-bold border-b pb-2">Multi-Agent AI Workflows</h3>
    <div className="grid gap-4">
      <AgentCard name="TriageAgent" role="Initial Screening" desc="Greets user, establishes rapport, and seamlessly weaves PHQ-2 / GAD-2 questions into natural conversation." color="border-blue-200 bg-blue-50" />
      <AgentCard name="RiskAgent" role="Scoring & Safety" desc="Analyzes TriageAgent's output + NLP sentiment. Assigns a score (0-100). If crisis keywords detected, immediately overrides flow to trigger emergency protocols." color="border-red-200 bg-red-50" />
      <AgentCard name="TherapyAgent" role="Micro-Interventions" desc="For Low/Moderate risk. Delivers bite-sized CBT exercises, breathing techniques, and 'Instant Calm Mode' content." color="border-green-200 bg-green-50" />
      <AgentCard name="CareNavigator" role="Logistics & Routing" desc="For Moderate/High risk. Uses location data to suggest nearby primary care clinics, explains what to expect, and books appointments." color="border-purple-200 bg-purple-50" />
      <AgentCard name="FollowUpAgent" role="Retention" desc="Initiates contact post-clinic visit. Sends mood tracking surveys and adherence nudges. Alerts clinic dashboard if user misses follow-ups." color="border-amber-200 bg-amber-50" />
    </div>
  </div>
);

const ConversationsTab = () => (
  <div className="space-y-6 text-[#2c3028]">
    <h3 className="text-2xl font-serif font-bold border-b pb-2">Sample WhatsApp Conversation</h3>
    <div className="bg-[#e5ddd0] p-4 rounded-2xl max-w-md mx-auto space-y-4 font-sans text-sm">
      <ChatBubble sender="user" text="Hi, I've been feeling really overwhelmed lately. I can't sleep." />
      <ChatBubble sender="bot" text="Hi there. I'm the MindBridge assistant. I'm sorry you're feeling overwhelmed. To help me understand better, over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?" agent="TriageAgent" />
      <ChatBubble sender="user" text="Almost every day. It's exhausting." />
      <ChatBubble sender="bot" text="I hear you, that sounds really difficult. And how often have you felt down, depressed, or hopeless?" agent="TriageAgent" />
      <ChatBubble sender="user" text="Maybe a few days a week." />
      <ChatBubble sender="bot" text="Thank you for sharing that with me. Based on what you've told me, it might be helpful to speak with a healthcare professional who can support you. I can help you find a primary care clinic nearby that is trained to help. Would you like me to look up the closest one?" agent="RiskAgent -> CareNavigator" />
      <ChatBubble sender="user" text="Yes, please. I live in South District." />
      <ChatBubble sender="bot" text="I found 'South District Community Health Centre' about 2km away. They have walk-in hours tomorrow morning. I've sent a secure, anonymous referral. In the meantime, would you like to try a 3-minute guided breathing exercise to help with the overwhelm right now?" agent="CareNavigator -> TherapyAgent" />
    </div>
  </div>
);

const SchemaBlock = ({ title, code }: any) => (
  <div className="bg-gray-900 rounded-xl overflow-hidden">
    <div className="bg-gray-800 text-gray-300 px-4 py-2 text-xs font-mono border-b border-gray-700">{title}</div>
    <pre className="p-4 text-green-400 text-sm font-mono overflow-x-auto"><code>{code}</code></pre>
  </div>
);

const ApiBlock = ({ method, endpoint, desc }: any) => (
  <div className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
    <div className="flex items-center gap-2 md:w-1/3">
      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${method === 'GET' ? 'bg-blue-500' : 'bg-green-500'}`}>{method}</span>
      <code className="text-sm font-mono font-bold text-gray-800">{endpoint}</code>
    </div>
    <div className="md:w-2/3 text-sm text-gray-600">{desc}</div>
  </div>
);

const AgentCard = ({ name, role, desc, color }: any) => (
  <div className={`p-4 rounded-xl border ${color}`}>
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-bold text-lg">{name}</h4>
      <span className="text-xs font-bold uppercase tracking-wider opacity-70">{role}</span>
    </div>
    <p className="text-sm opacity-90">{desc}</p>
  </div>
);

const ChatBubble = ({ sender, text, agent }: any) => (
  <div className={`flex flex-col ${sender === 'user' ? 'items-end' : 'items-start'}`}>
    {agent && <span className="text-[10px] text-gray-500 mb-1 ml-1">{agent}</span>}
    <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${
      sender === 'user' 
        ? 'bg-[#2d5a30] text-white rounded-tr-sm' 
        : 'bg-white text-[#2c3028] rounded-tl-sm shadow-sm'
    }`}>
      {text}
    </div>
  </div>
);
