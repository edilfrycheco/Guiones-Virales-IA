'use client';

import { useCallback, useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import WizardProgress from '@/components/WizardProgress';
import type { WizardState, WizardStep } from './types';
import StepTema from './StepTema';
import StepGanchos from './StepGanchos';
import StepGuiones from './StepGuiones';
import StepRevision from './StepRevision';

const STORAGE_KEY = 'wizard_state_v1';

const DEFAULT_STATE: WizardState = {
  step: 1,
  tema: '',
  hookType: 'curiosidad',
  hookTypeIsAuto: true,
  platform: 'instagram',
  tone: 'casual',
  niche: 'otro',
  length: 'medio',
  cantidad: 5,
  humanizer: { nivel: 'moderado', regionalismos: 'neutro', personalidad: 'directo' },
  useMyStyle: false,
  generatedHooks: [],
  selectedHookIndex: null,
  frameworks: [],
  incluirCta: true,
  contexto: '',
  audiencia: '',
  generatedScripts: [],
  selectedScriptIndex: null,
  editedScript: '',
  editInstruction: '',
};

export default function CrearPage() {
  const [state, setState] = useState<WizardState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on first render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setState(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage on every state change
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
  const next = () =>
    update({ step: Math.min(4, state.step + 1) as WizardStep });
  const back = () =>
    update({ step: Math.max(1, state.step - 1) as WizardStep });
  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState(DEFAULT_STATE);
  };

  // Avoid hydration mismatch
  if (!hydrated) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[240px]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-lg">🚀</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Crear Guión Viral</h1>
                <p className="text-sm text-[var(--text-muted)]">
                  Flujo guiado paso a paso · Gancho → Guión → Revisión
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
          {/* Progress bar */}
          <WizardProgress step={state.step} onGoTo={goTo} />

          {/* Step content */}
          <div className="mt-10">
            {state.step === 1 && (
              <StepTema state={state} update={update} onNext={next} />
            )}
            {state.step === 2 && (
              <StepGanchos state={state} update={update} onNext={next} onBack={back} />
            )}
            {state.step === 3 && (
              <StepGuiones state={state} update={update} onNext={next} onBack={back} />
            )}
            {state.step === 4 && (
              <StepRevision state={state} update={update} onBack={back} onReset={reset} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
