'use client';

import { useCallback, useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import WizardProgress from '@/components/WizardProgress';
import type { WizardState, WizardStep } from './types';
import StepOpiniones from './StepOpiniones';
import StepGanchos from './StepGanchos';
import StepGuion from './StepGuion';
import { getCurrentWeekObjective, loadProfile } from '@/lib/user-profile';
import type { Niche, Platform, Tone } from '@/lib/viral-frameworks';

const STORAGE_KEY = 'wizard_state_v1';

const DEFAULT_STATE: WizardState = {
  step: 1,
  tema: '',
  opinionIA: '',
  opinionUsuario: '',
  weekObjective: null,
  platform: 'instagram',
  tone: 'casual',
  niche: 'otro',
  length: 'medio',
  humanizer: { nivel: 'moderado', regionalismos: 'neutro', personalidad: 'directo' },
  generatedHooks: [],
  selectedHookIndex: null,
  generatedScript: '',
  editedScript: '',
  editInstruction: '',
};

function applyProfileDefaults(base: WizardState): WizardState {
  const profile = loadProfile();
  if (!profile) return base;
  return {
    ...base,
    niche: (profile.nicho_default as Niche) || base.niche,
    platform: (profile.platform_default as Platform) || base.platform,
    tone: (profile.tone_default as Tone) || base.tone,
    weekObjective: getCurrentWeekObjective(profile),
  };
}

export default function CrearPage() {
  const [state, setState] = useState<WizardState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Profile is the authoritative source for niche/platform/tone/weekObjective —
  // always merge over saved state so updating the profile takes effect immediately.
  // wizard_tema_seed: set by /plan page when user clicks a topic.
  useEffect(() => {
    let next: WizardState = DEFAULT_STATE;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) next = { ...DEFAULT_STATE, ...JSON.parse(saved) };
    } catch {}

    // Check for a topic seed from the plan page
    try {
      const seed = localStorage.getItem('wizard_tema_seed');
      if (seed) {
        localStorage.removeItem('wizard_tema_seed');
        next = { ...DEFAULT_STATE, tema: seed };
      }
    } catch {}

    setState(applyProfileDefaults(next));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const goTo = (step: WizardStep) => update({ step });
  const next = () => update({ step: Math.min(3, state.step + 1) as WizardStep });
  const back = () => update({ step: Math.max(1, state.step - 1) as WizardStep });
  const reset = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setState(applyProfileDefaults(DEFAULT_STATE));
  };

  if (!hydrated) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[240px]">
        <div className="px-8 py-6 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-lg">🚀</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Crear Guión</h1>
                <p className="text-sm text-[var(--text-muted)]">
                  Tema → Opiniones → Ganchos → Guión
                </p>
              </div>
            </div>
            <button
              onClick={reset}
              className="text-xs text-[#909296] hover:text-white border border-[#2C2E33] hover:border-[#5c7cfa] px-3 py-1.5 rounded-lg transition-colors"
            >
              Empezar de nuevo
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-8">
          <WizardProgress step={state.step} onGoTo={goTo} />

          <div className="mt-10">
            {state.step === 1 && (
              <StepOpiniones state={state} update={update} onNext={next} />
            )}
            {state.step === 2 && (
              <StepGanchos state={state} update={update} onNext={next} onBack={back} />
            )}
            {state.step === 3 && (
              <StepGuion state={state} update={update} onBack={back} onReset={reset} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
