'use client';

import { useEffect, useState } from 'react';
import type { WizardState } from './types';
import type { HookType, ContentObjective, UniversalPillar } from '@/lib/viral-frameworks';
import { HOOK_TEMPLATES } from '@/lib/viral-frameworks';
import { suggestContentObjective, suggestHookType, suggestNiche, suggestTone, suggestUniversalPillar } from '@/lib/hook-framework-mapper';
import {
  HOOK_TYPE_LABELS,
  HOOK_TYPE_DESCRIPTIONS,
  NICHE_LABELS,
  TONE_LABELS,
  CONTENT_OBJECTIVE_LABELS,
  CONTENT_OBJECTIVE_ICONS,
  CONTENT_OBJECTIVE_DESCRIPTIONS,
  UNIVERSAL_PILLAR_LABELS,
  UNIVERSAL_PILLAR_DESCRIPTIONS,
} from './constants';

interface Props {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  onNext: () => void;
}

export default function StepTema({ state, update, onNext }: Props) {
  const [showAll, setShowAll] = useState(false);

  const analyzeAndUpdate = (tema: string, forceHookType?: HookType) => {
    if (tema.length <= 3) {
      update({ tema });
      return;
    }
    const hookType = forceHookType ?? (state.hookTypeIsAuto ? suggestHookType(tema) : state.hookType);
    const niche = suggestNiche(tema);
    const tone = suggestTone(tema, hookType);
    const universalPillar = state.universalPillarIsAuto ? suggestUniversalPillar(niche) : state.universalPillar;
    const contentObjective = state.contentObjectiveIsAuto ? suggestContentObjective(tema, hookType) : state.contentObjective;
    update({
      tema,
      ...(state.hookTypeIsAuto || forceHookType ? { hookType } : {}),
      niche,
      tone,
      ...(state.universalPillarIsAuto ? { universalPillar } : {}),
      ...(state.contentObjectiveIsAuto ? { contentObjective } : {}),
    });
  };

  // Re-analyze if tema already has content on mount (from localStorage)
  useEffect(() => {
    if (state.tema.length > 3 && state.hookTypeIsAuto) {
      analyzeAndUpdate(state.tema);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTemaChange = (tema: string) => {
    analyzeAndUpdate(tema);
  };

  const selectHookType = (hookType: HookType) => {
    const tone = suggestTone(state.tema, hookType);
    update({ hookType, hookTypeIsAuto: false, tone });
    setShowAll(false);
  };

  const resetToAuto = () => {
    const hookType = suggestHookType(state.tema);
    const tone = suggestTone(state.tema, hookType);
    update({ hookType, hookTypeIsAuto: true, tone });
    setShowAll(false);
  };

  const exampleHook =
    HOOK_TEMPLATES[state.hookType]?.[0]?.replace('{tema}', state.tema || '...') ?? '';
  const canContinue = state.tema.trim().length >= 3;
  const detectedNiche = state.niche !== 'otro' ? state.niche : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-2">¿Sobre qué es tu contenido?</h2>
        <p className="text-[#909296] text-sm mb-6">
          Escribe el tema, elige el objetivo de la semana y el pilar que quieres activar.
          La IA configurará todo lo demás automáticamente.
        </p>

        {/* Tema input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#C1C2C5] mb-2">Tema del video</label>
          <textarea
            value={state.tema}
            onChange={(e) => handleTemaChange(e.target.value)}
            placeholder="Ej: cómo invertir en acciones siendo principiante, los errores más comunes al emprender, por qué la mayoría fracasa en el gym..."
            rows={3}
            className="w-full bg-[#25262B] border border-[#2C2E33] rounded-xl px-4 py-3 text-white placeholder-[#5C5F66] focus:border-[#5c7cfa] focus:outline-none text-sm resize-none transition-colors"
            autoFocus
          />
        </div>

        {/* S1–S4 content objective selector */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-[#C1C2C5] mb-1">
            Objetivo del video esta semana
          </label>
          <p className="text-xs text-[#5C5F66] mb-3">
            Rota cada semana: S1 Alcance → S2 Educativo → S3 Conexión → S4 Autoridad
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(CONTENT_OBJECTIVE_LABELS) as [ContentObjective, string][]).map(
              ([obj, label]) => {
                const isSelected = state.contentObjective === obj;
                return (
                  <button
                    key={obj}
                    onClick={() => update({ contentObjective: obj, contentObjectiveIsAuto: false })}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#5c7cfa] bg-[#5c7cfa]/10'
                        : 'border-[#2C2E33] bg-[#25262B] hover:border-[#5c7cfa]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{CONTENT_OBJECTIVE_ICONS[obj]}</span>
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? 'text-white' : 'text-[#C1C2C5]'
                        }`}
                      >
                        {label}
                      </span>
                      {isSelected && state.contentObjectiveIsAuto && (
                        <span className="ml-auto text-[10px] bg-[#5c7cfa]/20 text-[#5c7cfa] px-1.5 py-0.5 rounded-full font-medium">
                          ✨ Auto
                        </span>
                      )}
                      {isSelected && !state.contentObjectiveIsAuto && (
                        <span className="ml-auto text-[#5c7cfa] text-xs font-bold">✓</span>
                      )}
                    </div>
                    <div className="text-xs text-[#5C5F66] leading-snug">
                      {CONTENT_OBJECTIVE_DESCRIPTIONS[obj]}
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Universal pillar selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#C1C2C5] mb-1">
            Pilar universal — ¿qué deseo profundo activa tu contenido?
          </label>
          <p className="text-xs text-[#5C5F66] mb-3">
            Todo contenido viral toca al menos uno de estos 4 deseos fundamentales
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(UNIVERSAL_PILLAR_LABELS) as [UniversalPillar, string][]).map(
              ([pillar, label]) => {
                const isSelected = state.universalPillar === pillar;
                return (
                  <button
                    key={pillar}
                    onClick={() => update({ universalPillar: pillar, universalPillarIsAuto: false })}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#5c7cfa] bg-[#5c7cfa]/10'
                        : 'border-[#2C2E33] bg-[#25262B] hover:border-[#5c7cfa]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? 'text-white' : 'text-[#C1C2C5]'
                        }`}
                      >
                        {label}
                      </span>
                      {isSelected && state.universalPillarIsAuto && (
                        <span className="ml-auto text-[10px] bg-[#5c7cfa]/20 text-[#5c7cfa] px-1.5 py-0.5 rounded-full font-medium">
                          ✨ Auto
                        </span>
                      )}
                      {isSelected && !state.universalPillarIsAuto && (
                        <span className="ml-auto text-[#5c7cfa] text-xs font-bold">✓</span>
                      )}
                    </div>
                    <div className="text-xs text-[#5C5F66]">
                      {UNIVERSAL_PILLAR_DESCRIPTIONS[pillar]}
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Auto-detected config — shown when tema is long enough */}
        {canContinue && (
          <div className="mb-5 bg-[#25262B] border border-[#2C2E33] rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="text-base mt-0.5">✨</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#909296] mb-2">Configuración detectada del tema</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-[#1A1B1E] border border-[#5c7cfa]/30 text-[#5c7cfa] px-2.5 py-1 rounded-full font-medium">
                  {HOOK_TYPE_LABELS[state.hookType]}
                </span>
                {detectedNiche && (
                  <span className="text-xs bg-[#1A1B1E] border border-[#2C2E33] text-[#C1C2C5] px-2.5 py-1 rounded-full">
                    {NICHE_LABELS[state.niche]}
                  </span>
                )}
                <span className="text-xs bg-[#1A1B1E] border border-[#2C2E33] text-[#C1C2C5] px-2.5 py-1 rounded-full">
                  {TONE_LABELS[state.tone]}
                </span>
              </div>
              <p className="text-xs text-[#5C5F66] mt-2">
                Puedes ajustarlo en los pasos siguientes.
              </p>
            </div>
          </div>
        )}

        {/* Hook type selector */}
        {canContinue && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-[#C1C2C5]">Tipo de gancho</label>
              <div className="flex items-center gap-3">
                {!state.hookTypeIsAuto && (
                  <button
                    onClick={resetToAuto}
                    className="text-xs text-[#909296] hover:text-[#5c7cfa] transition-colors"
                  >
                    ↩ Auto-sugerir
                  </button>
                )}
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs text-[#5c7cfa] hover:underline"
                >
                  {showAll ? 'Cerrar' : 'Ver todos'}
                </button>
              </div>
            </div>

            {!showAll ? (
              <div
                className="bg-[#25262B] border border-[#5c7cfa]/40 rounded-xl p-4 cursor-pointer hover:border-[#5c7cfa] transition-colors"
                onClick={() => setShowAll(true)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none mt-0.5">
                    {HOOK_TYPE_LABELS[state.hookType].split(' ')[0]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">
                        {HOOK_TYPE_LABELS[state.hookType].split(' ').slice(1).join(' ')}
                      </span>
                      {state.hookTypeIsAuto && (
                        <span className="text-xs bg-[#5c7cfa]/20 text-[#5c7cfa] px-2 py-0.5 rounded-full">
                          Auto-sugerido
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#909296] mt-1">
                      {HOOK_TYPE_DESCRIPTIONS[state.hookType]}
                    </p>
                    {exampleHook && (
                      <p className="text-xs text-[#5C5F66] mt-2 italic">"{exampleHook}"</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(HOOK_TYPE_LABELS) as [HookType, string][]).map(
                  ([type, label]) => (
                    <button
                      key={type}
                      onClick={() => selectHookType(type)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        state.hookType === type
                          ? 'border-[#5c7cfa] bg-[#5c7cfa]/10'
                          : 'border-[#2C2E33] bg-[#25262B] hover:border-[#5c7cfa]/50'
                      }`}
                    >
                      <div className="text-sm font-medium text-white">{label}</div>
                      <div className="text-xs text-[#909296] mt-0.5 line-clamp-2">
                        {HOOK_TYPE_DESCRIPTIONS[type]}
                      </div>
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onNext}
          disabled={!canContinue}
          className="w-full bg-[#5c7cfa] hover:bg-[#4c6ef5] disabled:bg-[#25262B] disabled:text-[#5C5F66] text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Continuar → Generar Ganchos
        </button>
      </div>
    </div>
  );
}
