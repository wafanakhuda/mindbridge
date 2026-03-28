import { Info } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="bg-[#e2eff7] border border-[#7baec8] rounded-xl p-4 text-sm text-[#2c3028] flex gap-3 items-start my-6">
      <Info className="text-[#7baec8] shrink-0 mt-0.5" size={20} />
      <p>
        <strong>Disclaimer:</strong> While MindBridge uses validated mental health screening tools, this is a hackathon prototype for educational purposes and not a substitute for professional medical advice. Please consult a qualified healthcare provider for a full assessment and personalised care plan.
      </p>
    </div>
  );
}
