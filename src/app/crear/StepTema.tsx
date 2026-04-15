'use client';

import { useEffect, useState } from 'react';
import type { WizardState } from './types';
import type { HookType } from '@/lib/viral-frameworks';
import { HOOK_TEMPLATES } from '@/lib/viral-frameworks';
import { suggestHookType } from '@/lib/hook-framework-mapper';
import { HOOK_TYPE_LABELS, HOOK_TYPE_DESCRIPTIONS } from './constants';

interface Props {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  onNext: () => void;
}

export default function StepTema({ state, update, onNext }: Props) {
  const [showAll, setShowAll] = useState(false);

  // Re-suggest when tema changes (only when in auto mode)
  useEffect(() => {
    if (!state.hookTypeIsAuto || state.tema.length <= 3) return;
    const suggested = suggestHookType(state.tema, state.niche);
    if (suggested !== state.hookType) update({ hookType: suggested });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tema]);

  const handleTemaChange = (tema: string) => {
    const suggested = tema.length > 3 ? suggestHookType(tema, state.niche) : 'curiosidad';
    update({ tema, hookType: state.hookTypeIsAuto ? suggested : state.hookType });
  };

  const selectHookType = (hookType: HookType) => {
    update({ hookType, hookTypeIsAuto: false });
    setShowAll(false);
  };

  const resetToAuto = () => {
    const suggested = suggestHookType(state.tema, state.niche);
    update({ hookType: suggested, hookTypeIsAuto: true });
    setShowAll(false);
  };

  const exampleHook =
    HOOK_TEMPLATES[state.hookType]?.[0]?.replace('{tema}', state.tema || '...') ?? '';
  const canContinue = state.tema.trim().length >= 3;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-2">¿Sobre qué es tu contenido?</h2>
        <p className="text-[#909296] text-sm mb-6">
          Escribe el tema de tu video. La IA analizará el tema y sugerirá el tipo de gancho
          más efectivo para capturar atención en los primeros 2 segundos.
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

        {/* Hook type suggestion — only shown when tema is long enough */}
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
              /* Current suggestion */
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
              /* All hook types grid */
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
