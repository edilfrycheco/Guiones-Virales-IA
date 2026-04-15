'use client';

import { useEffect, useState } from 'react';
import type { WizardState } from './types';
import {
  FRAMEWORK_LABELS,
  FRAMEWORK_DESCRIPTIONS,
  LENGTH_LABELS,
  PLATFORM_LABELS,
  TONE_LABELS,
  NICHE_LABELS,
  HUMANIZER_NIVEL_LABELS,
  HUMANIZER_REGION_LABELS,
  HUMANIZER_PERSONALIDAD_LABELS,
} from './constants';
import { getBestFrameworksForHook, explainHookFrameworkMatch } from '@/lib/hook-framework-mapper';
import type { Framework } from '@/lib/viral-frameworks';

interface Props {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ALL_FRAMEWORKS: Framework[] = ['PAS', 'AIDA', 'BAB', 'HRAS', 'OPEN_LOOP', 'STORYTELLING'];

export default function StepGuiones({ state, update, onNext, onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Auto-suggest 3 best frameworks when entering this step
  useEffect(() => {
    if (state.frameworks.length === 0) {
      const best = getBestFrameworksForHook(state.hookType, 3);
      update({ frameworks: best });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset tab when new scripts are generated
  useEffect(() => {
    setActiveTab(0);
  }, [state.generatedScripts]);

  const selectedHook =
    state.selectedHookIndex !== null ? state.generatedHooks[state.selectedHookIndex] : null;

  const toggleFramework = (fw: Framework) => {
    const current = state.frameworks;
    if (current.includes(fw)) {
      if (current.length <= 1) return; // minimum 1
      update({ frameworks: current.filter((f) => f !== fw) });
    } else {
      if (current.length >= 3) {
        // Replace the last selected with the new one
        update({ frameworks: [...current.slice(0, 2), fw] });
      } else {
        update({ frameworks: [...current, fw] });
      }
    }
  };

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

  const numGuiones = state.frameworks.length;

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

        {/* Framework selector */}
        <div className="mb-5">
          <label className="block text-xs text-[#909296] mb-2">
            Frameworks — selecciona hasta 3 (activos:{' '}
            <span className="text-[#5c7cfa] font-semibold">{numGuiones}</span>)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ALL_FRAMEWORKS.map((fw) => {
              const isSelected = state.frameworks.includes(fw);
              return (
                <button
                  key={fw}
                  onClick={() => toggleFramework(fw)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-[#5c7cfa] bg-[#5c7cfa]/10 text-white'
                      : 'border-[#2C2E33] bg-[#25262B] text-[#909296] hover:border-[#5c7cfa]/40 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-sm">{FRAMEWORK_LABELS[fw]}</div>
                  <div className="text-xs text-[#5C5F66] mt-0.5">{FRAMEWORK_DESCRIPTIONS[fw]}</div>
                  {isSelected && (
                    <div className="text-xs text-[#5c7cfa] mt-1.5 italic leading-snug">
                      {explainHookFrameworkMatch(state.hookType, fw)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

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

        {/* Collapsible platform config */}
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-2 text-sm text-[#909296] hover:text-white transition-colors mb-3"
        >
          <span className="text-xs">{showConfig ? '▲' : '▼'}</span>
          <span>⚙️ {showConfig ? 'Ocultar' : 'Cambiar'} configuración de plataforma</span>
        </button>

        {showConfig && (
          <div className="space-y-4 mb-4 pt-3 border-t border-[#2C2E33]">
            {/* Platform, Tone, Niche */}
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { label: 'Plataforma', key: 'platform', options: PLATFORM_LABELS },
                  { label: 'Tono', key: 'tone', options: TONE_LABELS },
                  { label: 'Nicho', key: 'niche', options: NICHE_LABELS },
                ] as const
              ).map(({ label, key, options }) => (
                <div key={key}>
                  <label className="block text-xs text-[#909296] mb-1.5">{label}</label>
                  <select
                    value={state[key] as string}
                    onChange={(e) => update({ [key]: e.target.value } as Partial<WizardState>)}
                    className="w-full bg-[#25262B] border border-[#2C2E33] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5c7cfa] focus:outline-none"
                  >
                    {Object.entries(options).map(([val, lbl]) => (
                      <option key={val} value={val}>{lbl as string}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Humanizer */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-[#909296] mb-1.5">Humanización</label>
                <div className="flex gap-1">
                  {(['sutil', 'moderado', 'agresivo'] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => update({ humanizer: { ...state.humanizer, nivel: n } })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        state.humanizer.nivel === n
                          ? 'bg-[#5c7cfa] text-white'
                          : 'bg-[#25262B] border border-[#2C2E33] text-[#909296] hover:text-white'
                      }`}
                    >
                      {HUMANIZER_NIVEL_LABELS[n]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#909296] mb-1.5">Región</label>
                <select
                  value={state.humanizer.regionalismos}
                  onChange={(e) =>
                    update({ humanizer: { ...state.humanizer, regionalismos: e.target.value as any } })
                  }
                  className="w-full bg-[#25262B] border border-[#2C2E33] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5c7cfa] focus:outline-none"
                >
                  {Object.entries(HUMANIZER_REGION_LABELS).map(([val, lbl]) => (
                    <option key={val} value={val}>{lbl}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#909296] mb-1.5">Personalidad</label>
                <select
                  value={state.humanizer.personalidad}
                  onChange={(e) =>
                    update({ humanizer: { ...state.humanizer, personalidad: e.target.value as any } })
                  }
                  className="w-full bg-[#25262B] border border-[#2C2E33] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5c7cfa] focus:outline-none"
                >
                  {Object.entries(HUMANIZER_PERSONALIDAD_LABELS).map(([val, lbl]) => (
                    <option key={val} value={val}>{lbl}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

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
              Generando {numGuiones} guión{numGuiones !== 1 ? 'es' : ''} en paralelo...
            </>
          ) : (
            <>📝 Generar {numGuiones} Guión{numGuiones !== 1 ? 'es' : ''}</>
          )}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
      </div>

      {/* Generated scripts — tabbed full display */}
      {state.generatedScripts.length > 0 && (
        <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Selecciona el guión que más te gusta</h3>
            {selectedScript && (
              <span className="text-sm text-[#5c7cfa]">✓ Seleccionado</span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 border-b border-[#2C2E33]">
            {state.generatedScripts.map((script, idx) => {
              const isActive = activeTab === idx;
              const isSelected = state.selectedScriptIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all -mb-px border-b-2 flex items-center gap-1.5 ${
                    isActive
                      ? 'border-[#5c7cfa] text-[#5c7cfa] bg-[#5c7cfa]/5'
                      : 'border-transparent text-[#909296] hover:text-white'
                  }`}
                >
                  {FRAMEWORK_LABELS[script.framework]}
                  {isSelected && <span className="text-xs">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Active tab content */}
          {state.generatedScripts[activeTab] && (() => {
            const script = state.generatedScripts[activeTab];
            const isSelected = state.selectedScriptIndex === activeTab;
            return (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-semibold text-white">
                      {FRAMEWORK_LABELS[script.framework]}
                    </span>
                    <span className="text-xs text-[#5C5F66] ml-2">
                      {FRAMEWORK_DESCRIPTIONS[script.framework]}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      update({ selectedScriptIndex: activeTab, editedScript: script.content })
                    }
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#5c7cfa] text-white'
                        : 'border border-[#2C2E33] text-[#909296] hover:border-[#5c7cfa] hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ Seleccionado' : 'Seleccionar este'}
                  </button>
                </div>
                <div className="bg-[#25262B] rounded-xl px-4 py-4 text-sm text-[#C1C2C5] leading-relaxed whitespace-pre-wrap max-h-[520px] overflow-y-auto">
                  {script.content}
                </div>
              </div>
            );
          })()}
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
