'use client';

import { useEffect, useState } from 'react';
import type { WizardState } from './types';
import { FRAMEWORK_LABELS, FRAMEWORK_DESCRIPTIONS, LENGTH_LABELS } from './constants';
import { getBestFrameworksForHook, explainHookFrameworkMatch } from '@/lib/hook-framework-mapper';

interface Props {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepGuiones({ state, update, onNext, onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-suggest 3 best frameworks when entering this step
  useEffect(() => {
    if (state.frameworks.length === 0) {
      const best = getBestFrameworksForHook(state.hookType, 3);
      update({ frameworks: best });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedHook =
    state.selectedHookIndex !== null ? state.generatedHooks[state.selectedHookIndex] : null;

  const generateScripts = async () => {
    if (!selectedHook) return;
    setLoading(true);
    setError('');
    update({ generatedScripts: [], selectedScriptIndex: null });
    try {
      const res = await fetch('/api/wizard/generate-scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: state.tema,
          hookText: selectedHook.text,
          hookType: state.hookType,
          frameworks: state.frameworks,
          platform: state.platform,
          tone: state.tone,
          niche: state.niche,
          length: state.length,
          audiencia: state.audiencia,
          contexto: state.contexto,
          humanizer: state.humanizer,
          useMyStyle: state.useMyStyle,
          incluirCta: state.incluirCta,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      update({ generatedScripts: data.scripts || [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al generar guiones');
    } finally {
      setLoading(false);
    }
  };

  const selectedScript =
    state.selectedScriptIndex !== null
      ? state.generatedScripts[state.selectedScriptIndex]
      : null;

  return (
    <div className="space-y-5">
      {/* Config card */}
      <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-1">Configura los guiones</h2>
        {selectedHook && (
          <p className="text-[#909296] text-sm mb-5">
            Gancho elegido:{' '}
            <span className="text-white italic">"{selectedHook.text}"</span>
          </p>
        )}

        {/* Auto-suggested frameworks */}
        {state.frameworks.length > 0 && (
          <div className="mb-5">
            <label className="block text-xs text-[#909296] mb-2">
              3 frameworks sugeridos para tu gancho de{' '}
              <span className="text-[#5c7cfa]">{state.hookType}</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {state.frameworks.map((fw) => (
                <div
                  key={fw}
                  className="bg-[#25262B] border border-[#5c7cfa]/25 rounded-xl p-3"
                >
                  <div className="font-semibold text-white text-sm">
                    {FRAMEWORK_LABELS[fw]}
                  </div>
                  <div className="text-xs text-[#909296] mt-0.5">
                    {FRAMEWORK_DESCRIPTIONS[fw]}
                  </div>
                  <div className="text-xs text-[#5c7cfa] mt-2 italic leading-snug">
                    {explainHookFrameworkMatch(state.hookType, fw)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Length + CTA toggle */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-[#909296] mb-1.5">Duración</label>
            <div className="flex gap-1">
              {(['corto', 'medio', 'largo'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => update({ length: l })}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    state.length === l
                      ? 'bg-[#5c7cfa] text-white'
                      : 'bg-[#25262B] border border-[#2C2E33] text-[#909296] hover:text-white'
                  }`}
                >
                  {LENGTH_LABELS[l].split(' ').slice(1).join(' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => update({ incluirCta: !state.incluirCta })}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  state.incluirCta ? 'bg-[#5c7cfa]' : 'bg-[#2C2E33]'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                    state.incluirCta ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
              <span className="text-sm text-[#C1C2C5]">Incluir CTA</span>
            </label>
          </div>
        </div>

        {/* Optional context fields */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs text-[#909296] mb-1.5">
              Audiencia objetivo <span className="text-[#5C5F66]">(opcional)</span>
            </label>
            <input
              type="text"
              value={state.audiencia}
              onChange={(e) => update({ audiencia: e.target.value })}
              placeholder="Ej: jóvenes de 18-25 años"
              className="w-full bg-[#25262B] border border-[#2C2E33] rounded-lg px-3 py-2 text-sm text-white placeholder-[#5C5F66] focus:border-[#5c7cfa] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-[#909296] mb-1.5">
              Contexto adicional <span className="text-[#5C5F66]">(opcional)</span>
            </label>
            <input
              type="text"
              value={state.contexto}
              onChange={(e) => update({ contexto: e.target.value })}
              placeholder="Ej: para cuenta de 0 seguidores"
              className="w-full bg-[#25262B] border border-[#2C2E33] rounded-lg px-3 py-2 text-sm text-white placeholder-[#5C5F66] focus:border-[#5c7cfa] focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={generateScripts}
          disabled={loading || !selectedHook}
          className="w-full bg-[#5c7cfa] hover:bg-[#4c6ef5] disabled:bg-[#2C2E33] disabled:text-[#5C5F66] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generando 3 guiones en paralelo...
            </>
          ) : (
            <>📝 Generar 3 Guiones</>
          )}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
      </div>

      {/* Generated scripts */}
      {state.generatedScripts.length > 0 && (
        <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Selecciona el guión que más te gusta</h3>
            {selectedScript && (
              <span className="text-sm text-[#5c7cfa]">✓ Seleccionado</span>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {state.generatedScripts.map((script, idx) => {
              const isSelected = state.selectedScriptIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() =>
                    update({ selectedScriptIndex: idx, editedScript: script.content })
                  }
                  className={`rounded-xl border p-4 cursor-pointer transition-all flex flex-col ${
                    isSelected
                      ? 'border-[#5c7cfa] bg-[#5c7cfa]/5'
                      : 'border-[#2C2E33] bg-[#25262B] hover:border-[#5c7cfa]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        isSelected
                          ? 'bg-[#5c7cfa] text-white'
                          : 'bg-[#2C2E33] text-[#909296]'
                      }`}
                    >
                      {FRAMEWORK_LABELS[script.framework]}
                    </span>
                    {isSelected && (
                      <span className="text-[#5c7cfa] text-sm font-medium">✓</span>
                    )}
                  </div>
                  <div className="text-sm text-[#C1C2C5] leading-relaxed flex-1 whitespace-pre-wrap overflow-hidden max-h-72">
                    {script.content}
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#2C2E33] text-xs text-[#5C5F66]">
                    {FRAMEWORK_DESCRIPTIONS[script.framework]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-[#2C2E33] hover:border-[#5c7cfa] text-[#909296] hover:text-white rounded-xl transition-colors"
        >
          ← Volver
        </button>
        <button
          onClick={onNext}
          disabled={state.selectedScriptIndex === null}
          className="flex-1 bg-[#5c7cfa] hover:bg-[#4c6ef5] disabled:bg-[#25262B] disabled:text-[#5C5F66] text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Continuar → Revisar y Editar
        </button>
      </div>
    </div>
  );
}
