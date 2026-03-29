import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, BookOpen, Brain, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const SCREENING_TOOLS = [
  {
    name: 'PHQ-9',
    full: 'Patient Health Questionnaire-9',
    condition: 'Depression',
    color: 'bg-[#e3f2fd] border-[#bbdefb] text-[#1565c0]',
    scoring: 'Score 0-4: Minimal - 5-9: Mild - 10-14: Moderate - 15-19: Moderately severe - 20-27: Severe',
    cutoff: '≥10 suggests moderate depression requiring treatment',
    questions: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself - or that you are a failure',
      'Trouble concentrating on things (reading, TV)',
      'Moving or speaking slowly / being fidgety or restless',
      'Thoughts that you would be better off dead or hurting yourself',
    ],
    options: 'Not at all (0) - Several days (1) - More than half the days (2) - Nearly every day (3)',
    link: 'https://www.phqscreeners.com/',
  },
  {
    name: 'GAD-7',
    full: 'Generalised Anxiety Disorder-7',
    condition: 'Anxiety',
    color: 'bg-[#fff8e1] border-[#ffe082] text-[#f57f17]',
    scoring: 'Score 0-4: Minimal - 5-9: Mild - 10-14: Moderate - 15-21: Severe',
    cutoff: '≥10 suggests moderate anxiety requiring further evaluation',
    questions: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid as if something awful might happen',
    ],
    options: 'Not at all (0) - Several days (1) - More than half the days (2) - Nearly every day (3)',
    link: 'https://www.phqscreeners.com/',
  },
  {
    name: 'MDI',
    full: 'Major Depression Inventory',
    condition: 'Depression (ICD-10)',
    color: 'bg-[#f3e5f5] border-[#e1bee7] text-[#7b1fa2]',
    scoring: 'Score 0-25: No/minimal - 26-43: Mild - 44-53: Moderate - 54-62: Severe - 63+: Very severe',
    cutoff: '≥26 suggests mild depression; ≥44 indicates clinically significant depressive episode',
    questions: [
      'Have you felt low in spirits or sad?',
      'Have you lost interest in your daily activities?',
      'Have you felt lacking in energy and strength?',
      'Have you felt less self-confident?',
      'Have you had a bad conscience or feelings of guilt?',
      'Have you felt that life wasn\'t worth living?',
      'Have you had difficulty concentrating?',
      'Have you felt restless?',
      'Have you felt subdued or slowed down?',
      'Have you had trouble sleeping at night?',
      'Have you suffered from reduced appetite?',
      'Have you suffered from increased appetite?',
    ],
    options: 'At no time (0) - Some of the time (1) - Slightly less than half the time (2) - Slightly more than half the time (3) - Most of the time (4) - All the time (5)',
    link: 'https://www.psykiatri-regionh.dk/who-5/Documents/MDI%20English.pdf',
  },
  {
    name: 'PCL-5',
    full: 'PTSD Checklist (DSM-5)',
    condition: 'PTSD',
    color: 'bg-[#fce4ec] border-[#f8bbd0] text-[#c62828]',
    scoring: 'Score 0-80. Provisional PTSD diagnosis threshold: ≥33',
    cutoff: '≥33 warrants full PTSD assessment by a clinician',
    questions: [
      'Repeated, disturbing memories, thoughts, or images of a stressful experience',
      'Repeated, disturbing dreams of a stressful experience',
      'Suddenly feeling or acting as if a stressful experience were happening again',
      'Feeling very upset when something reminded you of a stressful experience',
      'Having strong physical reactions when reminded of a stressful experience',
      'Avoiding memories, thoughts, or feelings related to a stressful experience',
      'Avoiding external reminders of a stressful experience',
      'Trouble remembering important parts of a stressful experience',
      'Having strong negative beliefs about yourself, other people, or the world',
      'Blaming yourself or someone else for a stressful experience or what happened after',
    ],
    options: 'Not at all (0) - A little bit (1) - Moderately (2) - Quite a bit (3) - Extremely (4)',
    link: 'https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp',
  },
];

const DSM_CRITERIA = [
  {
    condition: 'Major Depressive Episode (DSM-5)',
    icon: '🧠',
    color: 'border-[#bbdefb] bg-[#e3f2fd]',
    duration: '≥2 weeks, most of the day, nearly every day',
    criteria: [
      { letter: 'A', required: 'At least 5 of the following (must include 1 or 2):', items: ['(1) Depressed mood', '(2) Loss of interest/pleasure (anhedonia)', '(3) Significant weight/appetite change', '(4) Insomnia or hypersomnia', '(5) Psychomotor agitation or retardation', '(6) Fatigue or loss of energy', '(7) Feelings of worthlessness or excessive guilt', '(8) Difficulty thinking/concentrating', '(9) Recurrent thoughts of death or suicidal ideation'] },
      { letter: 'B', required: 'Symptoms cause clinically significant distress or impairment in social, occupational, or other areas.' },
      { letter: 'C', required: 'Not attributable to substances or another medical condition.' },
      { letter: 'D', required: 'Not better explained by schizophrenia spectrum or other psychotic disorder.' },
      { letter: 'E', required: 'No manic/hypomanic episode (unless substance-induced or medical).' },
    ],
  },
  {
    condition: 'Generalised Anxiety Disorder (DSM-5)',
    icon: '😰',
    color: 'border-[#ffe082] bg-[#fff8e1]',
    duration: '≥6 months, more days than not',
    criteria: [
      { letter: 'A', required: 'Excessive anxiety and worry about multiple events/activities.' },
      { letter: 'B', required: 'Difficulty controlling the worry.' },
      { letter: 'C', required: '≥3 of: restlessness, easily fatigued, difficulty concentrating, irritability, muscle tension, sleep disturbance.' },
      { letter: 'D', required: 'Symptoms cause significant distress or impairment.' },
      { letter: 'E', required: 'Not attributable to substances or another medical condition.' },
      { letter: 'F', required: 'Not better explained by another mental disorder.' },
    ],
  },
  {
    condition: 'PTSD (DSM-5)',
    icon: '⚡',
    color: 'border-[#f8bbd0] bg-[#fce4ec]',
    duration: '≥1 month after exposure to traumatic event',
    criteria: [
      { letter: 'A', required: 'Exposure to actual/threatened death, serious injury, or sexual violence (direct, witness, learning, or repeated exposure).' },
      { letter: 'B', required: '≥1 intrusion symptom: memories, dreams, dissociative reactions, distress at cues, physiological reactions.' },
      { letter: 'C', required: '≥1 avoidance symptom: avoidance of memories/thoughts or external reminders.' },
      { letter: 'D', required: '≥2 negative alterations in cognitions/mood: amnesia, negative beliefs, blame, negative emotions, diminished interest, detachment, emotional numbing.' },
      { letter: 'E', required: '≥2 alterations in arousal/reactivity: irritability, reckless behaviour, hypervigilance, exaggerated startle, concentration problems, sleep disturbance.' },
    ],
  },
];

export default function ClinicalResources() {
  const [openTool, setOpenTool] = useState<string | null>(null);
  const [openDSM, setOpenDSM] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#e3f2fd] text-[#1565c0] px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-[#bbdefb]">
          🩺 Clinic Portal
        </div>
        <h2 className="font-serif text-4xl text-[#2c3028] mb-4">Clinical Resources</h2>
        <p className="text-lg text-[#6b7265] max-w-xl mx-auto">Validated screening tools, DSM-5 diagnostic criteria, and clinical decision support for primary care practitioners.</p>
      </div>

      {/* Screening Tools */}
      <section className="mb-14">
        <h3 className="font-serif text-2xl text-[#2c3028] mb-2 flex items-center gap-2">
          <ClipboardList size={22} className="text-[#4a7c59]" /> Validated Screening Tools
        </h3>
        <p className="text-[#6b7265] text-sm mb-6">Click any tool to view all questions, response options, and scoring guidance.</p>

        <div className="space-y-3">
          {SCREENING_TOOLS.map(tool => (
            <div key={tool.name} className={`border-2 rounded-2xl overflow-hidden transition-all ${tool.color}`}>
              <button
                onClick={() => setOpenTool(openTool === tool.name ? null : tool.name)} className="w-full"
                className="w-full flex items-center justify-between p-5 text-left hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center gap-4">
                  <div className="font-serif text-2xl font-bold">{tool.name}</div>
                  <div>
                    <div className="font-bold text-sm">{tool.full}</div>
                    <div className="text-xs opacity-75">{tool.condition}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a href={tool.link} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs font-bold opacity-75 hover:opacity-100 underline">
                    Official PDF <ExternalLink size={11} />
                  </a>
                  {openTool === tool.name ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              <AnimatePresence>
                {openTool === tool.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/80 border-t border-current/20 p-6 space-y-4">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-[#6b7265] mb-2">Response Options</div>
                        <div className="text-sm text-[#2c3028] bg-[#f5f0e8] px-4 py-2 rounded-xl">{tool.options}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-[#6b7265] mb-2">Questions</div>
                        <ol className="space-y-2">
                          {tool.questions.map((q, i) => (
                            <li key={i} className="flex gap-3 text-sm text-[#2c3028]">
                              <span className="font-bold shrink-0 text-[#6b7265]">{i + 1}.</span>{q}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-[#6b7265] mb-2">Scoring</div>
                          <div className="text-sm text-[#2c3028]">{tool.scoring}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-[#6b7265] mb-2">Clinical Cutoff</div>
                          <div className="text-sm text-[#2c3028] font-medium">{tool.cutoff}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* DSM-5 Criteria */}
      <section className="mb-14">
        <h3 className="font-serif text-2xl text-[#2c3028] mb-2 flex items-center gap-2">
          <Brain size={22} className="text-[#4a7c59]" /> DSM-5 Diagnostic Criteria
        </h3>
        <p className="text-[#6b7265] text-sm mb-6">Quick-reference diagnostic criteria for the most common presentations in primary care.</p>

        <div className="space-y-3">
          {DSM_CRITERIA.map(d => (
            <div key={d.condition} className={`border-2 rounded-2xl overflow-hidden ${d.color}`}>
              <button
                onClick={() => setOpenDSM(openDSM === d.condition ? null : d.condition)}
                className="w-full flex items-center justify-between p-5 text-left hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{d.icon}</div>
                  <div>
                    <div className="font-bold text-[#2c3028]">{d.condition}</div>
                    <div className="text-xs text-[#6b7265]">Duration: {d.duration}</div>
                  </div>
                </div>
                {openDSM === d.condition ? <ChevronUp size={20} className="text-[#6b7265]" /> : <ChevronDown size={20} className="text-[#6b7265]" />}
              </button>

              <AnimatePresence>
                {openDSM === d.condition && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/80 border-t border-[#d8d0c4] p-6 space-y-3">
                      {d.criteria.map(c => (
                        <div key={c.letter} className="flex gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#2c3028] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{c.letter}</div>
                          <div className="text-sm text-[#2c3028]">
                            <span className="font-medium">{c.required}</span>
                            {c.items && (
                              <ul className="mt-2 space-y-1 pl-2">
                                {c.items.map((item, i) => (
                                  <li key={i} className="text-[#6b7265] flex gap-2"><span className="shrink-0">·</span>{item}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Reference */}
      <section>
        <h3 className="font-serif text-2xl text-[#2c3028] mb-6 flex items-center gap-2">
          <BookOpen size={22} className="text-[#4a7c59]" /> Clinical Quick Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Safety Assessment', icon: '🔴', items: ['Ask directly: "Are you thinking about suicide?"', 'Assess plan, means, intent, timeline', 'Protective factors: family, religion, future plans', 'Document and refer immediately if high risk'] },
            { title: 'Referral Thresholds', icon: '🔵', items: ['PHQ-9 ≥15 → Urgent psychiatry referral', 'Active suicidal ideation → Emergency department', 'GAD-7 ≥15 + functional impairment → Specialist', 'PHQ-9 10-14 + GAD-7 10-14 → Structured therapy'] },
            { title: 'First-Line Treatments', icon: '🟢', items: ['Mild-moderate depression: CBT or structured self-help', 'Moderate-severe: SSRI + therapy combination', 'GAD: CBT first-line; SSRI/SNRI if medication needed', 'Follow up within 2-4 weeks of starting treatment'] },
          ].map(card => (
            <div key={card.title} className="bg-white border border-[#d8d0c4] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{card.icon}</span>
                <h4 className="font-bold text-[#2c3028]">{card.title}</h4>
              </div>
              <ul className="space-y-2">
                {card.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[#6b7265]">
                    <span className="text-[#4a7c59] shrink-0 mt-0.5">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

    </motion.div>
  );
}
