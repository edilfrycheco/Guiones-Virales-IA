'use client';

import { useState } from 'react';
import type { WizardState, GeneratedHook } from './types';
import {
  PLATFORM_LABELS,
  TONE_LABELS,
  NICHE_LABELS,
  HOOK_TYPE_LABELS,
  HUMANIZER_REGION_LABELS,
  HUMANIZER_NIVEL_LABELS,
  HUMANIZER_PERSONALIDAD_LABELS,
} from './constants';

interface Props {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepGanchos({ state, update, onNext, onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());
  const [savingIdx, setSavingIdx] = useState<number | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const generateHooks = async () => {
    setLoading(true);
    setError('');
    setEditingIdx(null);
    update({ generatedHooks: [], selectedHookIndex: null });
    try {
      const res = await fetch('/api/wizard/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: state.tema,
          hookType: state.hookType,
          platform: state.platform,
          tone: state.tone,
          niche: state.niche,
          cantidad: state.cantidad,
          humanizer: state.humanizer,
          useMyStyle: state.useMyStyle,
          contentObjective: state.contentObjective,
          universalPillar: state.universalPillar,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      update({ generatedHooks: data.hooks || [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al generar ganchos');
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = (idx: number) => {
    const updated = [...state.generatedHooks];
    updated[idx] = { ...updated[idx], text: editText.trim() || updated[idx].text };
    update({ generatedHooks: updated });
    setEditingIdx(null);
  };

  const saveHookFavorite = async (hook: GeneratedHook, idx: number) => {
    if (savedIndices.has(idx)) return;
    setSavingIdx(idx);
    try {
      const res = await fetch('/api/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: state.tema,
          hook_type: state.hookType,
          hook_text: hook.text,
          platform: state.platform,
          tone: state.tone,
          niche: state.niche,
          is_favorite: true,
        }),
      });
      if (res.ok) setSavedIndices((prev) => new Set([...prev, idx]));
    } catch {
      // Silent — user not logged in
    } finally {
      setSavingIdx(null);
    }
  };

  const selectedHook =
    state.selectedHookIndex !== null ? state.generatedHooks[state.selectedHookIndex] : null;

  return (
    <div className="space-y-5">
      {/* Config card */}
      <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-1">Configura tus ganchos</h2>
        <p className="text-[#909296] text-sm mb-5">
          Tema: <span className="text-white italic">"{state.tema}"</span>
          {' · '}
          Gancho: <span className="text-[#5c7cfa]">{HOOK_TYPE_LABELS[state.hookType]}</span>
        </p>

        {/* Platform, Tone, Niche */}
        <div className="grid grid-cols-3 gap-3 mb-4">
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
        <div className="grid grid-cols-3 gap-3 mb-4">
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

        {/* Cantidad + useMyStyle */}
        <div className="flex items-center gap-6 mb-5">
          <div className="flex-1">
            <label className="block text-xs text-[#909296] mb-2">
              Cantidad de ganchos:{' '}
              <span className="text-white font-semibold">{state.cantidad}</span>
            </label>
            <input
              type="range"
              min={3}
              max={10}
              value={state.cantidad}
              onChange={(e) => update({ cantidad: Number(e.target.value) })}
              className="w-full accent-[#5c7cfa]"
            />
            <div className="flex justify-between text-xs text-[#5C5F66] mt-1">
              <span>3</span><span>10</span>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <div
              onClick={() => update({ useMyStyle: !state.useMyStyle })}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                state.useMyStyle ? 'bg-[#5c7cfa]' : 'bg-[#2C2E33]'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                  state.useMyStyle ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </div>
            <span className="text-sm text-[#C1C2C5]">Usar mi estilo</span>
          </label>
        </div>

        <button
          onClick={generateHooks}
          disabled={loading}
          className="w-full bg-[#5c7cfa] hover:bg-[#4c6ef5] disabled:bg-[#2C2E33] disabled:text-[#5C5F66] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generando {state.cantidad} ganchos...
            </>
          ) : (
            <>🎣 Generar {state.cantidad} Ganchos</>
          )}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
      </div>

      {/* Generated hooks */}
      {state.generatedHooks.length > 0 && (
        <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Selecciona tu gancho favorito</h3>
            {selectedHook && (
              <span className="text-sm text-[#5c7cfa]">✓ Gancho seleccionado</span>
            )}
          </div>
          <div className="space-y-3">
            {state.generatedHooks.map((hook, idx) => {
              const isSelected = state.selectedHookIndex === idx;
              const isSaved = savedIndices.has(idx);
              const isEditing = editingIdx === idx;

              return (
                <div
                  key={idx}
                  onClick={() => !isEditing && update({ selectedHookIndex: idx })}
                  className={`relative rounded-xl border p-4 transition-all ${
                    isEditing
                      ? 'border-[#5c7cfa] bg-[#5c7cfa]/5 cursor-default'
                      : isSelected
                      ? 'border-[#5c7cfa] bg-[#5c7cfa]/5 cursor-pointer'
                      : 'border-[#2C2E33] bg-[#25262B] hover:border-[#5c7cfa]/40 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Radio */}
                    {!isEditing && (
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          isSelected ? 'border-[#5c7cfa] bg-[#5c7cfa]' : 'border-[#5C5F66]'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    )}

                    {/* Content or editor */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={2}
                            autoFocus
                            className="w-full bg-[#1A1B1E] border border-[#5c7cfa] rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none"
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => saveEdit(idx)}
                              className="px-3 py-1 bg-[#5c7cfa] text-white rounded-lg text-xs font-medium"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingIdx(null)}
                              className="px-3 py-1 bg-[#25262B] border border-[#2C2E33] text-[#909296] rounded-lg text-xs"
                            >
                              Cancelar
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-white text-sm leading-relaxed">
                            {hook.text}
                          </p>
                          {hook.reason && (
                            <p className="text-xs text-[#909296] mt-1.5">💡 {hook.reason}</p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Actions (edit + star) */}
                    {!isEditing && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingIdx(idx);
                            setEditText(hook.text);
                          }}
                          title="Editar gancho"
                          className="p-1.5 rounded-lg text-[#5C5F66] hover:text-white hover:bg-[#2C2E33] transition-all text-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            saveHookFavorite(hook, idx);
                          }}
                          disabled={savingIdx === idx || isSaved}
                          title={isSaved ? 'Guardado en tu biblioteca' : 'Guardar en favoritos'}
                          className={`p-1.5 rounded-lg transition-all ${
                            isSaved
                              ? 'text-yellow-400'
                              : 'text-[#5C5F66] hover:text-yellow-400 hover:bg-yellow-400/10'
                          }`}
                        >
                          {savingIdx === idx ? (
                            <span className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin block" />
                          ) : (
                            <span className="text-base leading-none">{isSaved ? '⭐' : '☆'}</span>
                          )}
                        </button>
                      </div>
                    )}
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
          disabled={state.selectedHookIndex === null}
          className="flex-1 bg-[#5c7cfa] hover:bg-[#4c6ef5] disabled:bg-[#25262B] disabled:text-[#5C5F66] text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Continuar → Generar Guiones
        </button>
      </div>
    </div>
  );
}
