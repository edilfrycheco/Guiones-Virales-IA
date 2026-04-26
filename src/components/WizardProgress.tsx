'use client';

import type { WizardStep } from '@/app/crear/types';

const STEPS: { num: WizardStep; label: string; icon: string }[] = [
  { num: 1, label: 'Tema y opinión', icon: '💭' },
  { num: 2, label: 'Ganchos', icon: '🎣' },
  { num: 3, label: 'Guión', icon: '📝' },
];

interface Props {
  step: WizardStep;
  onGoTo: (s: WizardStep) => void;
}

export default function WizardProgress({ step, onGoTo }: Props) {
  const progressPct = ((step - 1) / 2) * 100;

  return (
    <div className="relative flex items-start justify-between px-5">
      {/* Background line */}
      <div className="absolute top-5 left-10 right-10 h-0.5 bg-[#2C2E33]" />
      {/* Active line */}
      <div
        className="absolute top-5 left-10 h-0.5 bg-[#5c7cfa] transition-all duration-500"
        style={{ width: `calc(${progressPct}% * (100% - 80px) / 100)` }}
      />

      {STEPS.map((s) => {
        const isCompleted = step > s.num;
        const isCurrent = step === s.num;
        const isClickable = isCompleted;

        return (
          <button
            key={s.num}
            onClick={() => isClickable && onGoTo(s.num)}
            disabled={!isClickable}
            className="relative flex flex-col items-center gap-2 z-10 disabled:cursor-default"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                isCurrent
                  ? 'bg-[#5c7cfa] border-[#5c7cfa] text-white shadow-[0_0_16px_rgba(92,124,250,0.45)]'
                  : isCompleted
                  ? 'bg-[#5c7cfa]/15 border-[#5c7cfa] text-[#5c7cfa] hover:bg-[#5c7cfa]/25'
                  : 'bg-[#1A1B1E] border-[#2C2E33] text-[#5C5F66]'
              }`}
            >
              {isCompleted ? '✓' : s.num}
            </div>
            <span
              className={`text-xs font-medium whitespace-nowrap ${
                isCurrent ? 'text-white' : isCompleted ? 'text-[#5c7cfa]' : 'text-[#5C5F66]'
              }`}
            >
              {s.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
