import { Info } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="bg-[#e2eff7] border border-[#7baec8] rounded-xl p-4 text-sm text-[#2c3028] flex gap-3 items-start my-6">
      <Info className="text-[#7baec8] shrink-0 mt-0.5" size={20} />
      <p>
        <strong>Disclaimer:</strong> Mindbridge uses validated mental health screening tools to help identify symptoms of conditions such as anxiety or depression. These screenings are informative and for guidance only. They do not replace professional medical evaluation or diagnosis. We recommend consulting a qualified healthcare provider for a full assessment and personalized care plan.
      </p>
    </div>
  );
}
