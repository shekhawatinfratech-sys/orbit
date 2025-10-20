import { useState } from 'react';
import { motion } from 'framer-motion';

const QUESTIONS = [
  {
    key: 'revenue',
    label: 'Annual Revenue Range (₹)',
    options: ['<1 Cr','1–10 Cr','10–50 Cr','50–200 Cr','200+ Cr']
  },
  { key: 'dependency', label: 'Founder Dependency', options: ['High','Medium High','Medium','Low','None'] },
  { key: 'sops', label: 'SOPs / Processes Documented', options: ['None','Basic','Partial','Mostly','Fully'] },
  { key: 'team', label: 'Team Size', options: ['0–3','4–10','11–30','31–100','100+'] },
  { key: 'cashflow', label: 'Cash Flow Stability', options: ['Poor','Unstable','Average','Good','Excellent'] },
  { key: 'management', label: 'Management Layer', options: ['None','Weak','Moderate','Strong','Fully Functional'] },
  { key: 'automation', label: 'Automation & Systems', options: ['None','Basic','Partial','Integrated','Fully Automated'] },
  { key: 'focus', label: 'Founder Focus on Strategy vs Operations', options: ['0% Strategy','25%','50%','75%','100% Strategy'] }
];

const BUSINESS_TYPES = [
  { value: '', label: 'Select business type' },
  { value: 'construction', label: 'Construction' },
  { value: 'education', label: 'Education' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'services', label: 'Services' }
];

function scoreFromOptionIndex(i) {
  // options are 0..4 -> map to score 1..5
  return i + 1;
}

function orbitFromScores(total) {
  if (total <= 12) return { orbit: 'Orbit 1 — Foundation', level: 1 };
  if (total <= 20) return { orbit: 'Orbit 2 — Stability', level: 2 };
  if (total <= 28) return { orbit: 'Orbit 3 — Scale', level: 3 };
  if (total <= 35) return { orbit: 'Orbit 4 — Freedom', level: 4 };
  return { orbit: 'Orbit 5 — Legacy', level: 5 };
}

function remedialAndSupport(orbitLevel, businessType) {
  const base = {
    1: {
      next: 'Build consistent monthly sales, product-market fit, basic bookkeeping.',
      support: 'Mentorship, refine offering, simple CRM, bookkeeping (Zoho/QuickBooks).'
    },
    2: {
      next: 'Delegate repetitive tasks, hire first managers, document SOPs.',
      support: 'CRM + Invoicing automation, HR basics, simple ERP-lite, management courses.'
    },
    3: {
      next: 'Strengthen middle management, scale operations & marketing, track KPIs.',
      support: 'ERP/financial dashboards, hire department heads, invest in marketing & brand.'
    },
    4: {
      next: 'Leadership succession, market expansion, strategic partnerships.',
      support: 'Advisory board, M&A strategy, institutional governance.'
    },
    5: {
      next: 'Mentor & invest, create long-term legacy structures.',
      support: 'Family office / holding structure, succession planning.'
    }
  };

  let s = base[orbitLevel];
  if (!s) s = base[1];

  // business-specific tweak
  if (businessType === 'construction') {
    s.support += ' For construction: strengthen safety & compliance, project management software, digitize measurement & billing.';
  } else if (businessType === 'education') {
    s.support += ' For education: build curriculum IP, teacher training, accreditation, franchise playbook.';
  } else if (businessType === 'manufacturing') {
    s.support += ' For manufacturing: lean ops, QC, supplier consolidation, export readiness.';
  } else if (businessType === 'services') {
    s.support += ' For services: productize offerings, subscription models, service-level SOPs.';
  }

  return s;
}

export default function Home() {
  const [answers, setAnswers] = useState(() => {
    const init = {};
    QUESTIONS.forEach(q => init[q.key] = null);
    init.businessType = '';
    return init;
  });
  const [result, setResult] = useState(null);

  function handleSelect(key, valueIndex) {
    setAnswers(prev => ({ ...prev, [key]: valueIndex }));
  }

  function handleBusinessType(e) {
    setAnswers(prev => ({ ...prev, businessType: e.target.value }));
  }

  function analyze() {
    // compute total
    const scores = QUESTIONS.map(q => {
      const idx = answers[q.key];
      return (typeof idx === 'number') ? scoreFromOptionIndex(idx) : 0;
    });
    const total = scores.reduce((a,b)=>a+b, 0);
    const orbit = orbitFromScores(total);
    const support = remedialAndSupport(orbit.level, answers.businessType);
    setResult({ orbitLabel: orbit.orbit, total, support });
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-12 px-4">
      <div className="max-w-3xl w-full">
        <motion.h1 initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="text-3xl font-bold mb-6">Orbit Navigator — Entrepreneur Diagnostic</motion.h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <label className="block mb-4">
            <span className="text-sm font-medium">Business Type</span>
            <select className="mt-2 w-full border rounded p-2" value={answers.businessType} onChange={handleBusinessType}>
              {BUSINESS_TYPES.map(bt => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
            </select>
          </label>

          <div className="grid grid-cols-1 gap-4">
            {QUESTIONS.map((q, i) => (
              <div key={q.key}>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">{q.label}</div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {q.options.map((opt, idx) => {
                    const sel = answers[q.key] === idx;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelect(q.key, idx)}
                        className={`p-2 text-xs border rounded ${sel ? 'bg-sky-600 text-white' : 'bg-white text-slate-700'}`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <button onClick={analyze} className="mt-6 w-full bg-sky-600 text-white py-3 rounded font-semibold">Analyze Orbit</button>

          {result && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-6 p-4 border rounded">
              <div className="text-lg font-bold mb-2">{result.orbitLabel}</div>
              <div className="text-sm mb-2"><strong>Score:</strong> {result.total}</div>
              <div className="mb-2"><strong>Next steps:</strong> {result.support.next}</div>
              <div className="mb-2"><strong>Support & Remedial actions:</strong> {result.support.support}</div>
            </motion.div>
          )}
        </div>

        <div className="text-xs text-slate-500 mt-3">
          Tip: revenue buckets map to orbits (Orbit 1 = upto ₹1 Cr, Orbit 2 = ₹1–10 Cr, Orbit 3 = ₹10–50 Cr, Orbit 4 = ₹50–200 Cr, Orbit 5 = ₹200Cr+).
        </div>
      </div>
    </div>
  )
}
