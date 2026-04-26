'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, RefreshCw, Sparkles, Check, Pencil, X } from 'lucide-react';
import type { WizardState, GeneratedHook } from './types';
import { loadProfile } from '@/lib/user-profile';

interface Props {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepGanchos({ state, update, onNext, onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const generateHooks = async () => {
    setLoading(true);
    setError('');
    setEditingIdx(null);
    update({ generatedHooks: [], selectedHookIndex: null });

    const profile = loadProfile();

    try {
      const res = await fetch('/api/wizard/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: state.tema,
          opinionUsuario: state.opinionUsuario,
          opinionIA: state.opinionIA,
          platform: state.platform,
          tone: state.tone,
          niche: state.niche,
          cantidad: 5,
          humanizer: state.humanizer,
          audiencia: profile?.audiencia_objetivo,
          perspectiva_editorial: profile?.perspectiva_editorial,
          manera_ensenar: profile?.manera_ensenar,
          weekObjective: state.weekObjective,
        }),
      });

      const raw = await res.text();
      let data: { hooks?: GeneratedHook[]; error?: string } = {};
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(
          res.status === 504 || !res.ok
            ? `El servidor tardó demasiado (${res.status}). Intenta de nuevo.`
            : 'Respuesta inválida del servidor. Reintenta.'
        );
      }
      if (!res.ok || data.error) throw new Error(data.error || `Error ${res.status}`);
      update({ generatedHooks: data.hooks || [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al generar ganchos');
    } finally {
      setLoading(false);
    }
  };

  // Auto-genera al entrar si aún no hay ganchos
  useEffect(() => {
    if (state.generatedHooks.length === 0 && !loading) {
      generateHooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveEdit = (idx: number) => {
    const updated = [...state.generatedHooks];
    updated[idx] = { ...updated[idx], text: editText.trim() || updated[idx].text };
    update({ generatedHooks: updated });
    setEditingIdx(null);
  };

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditText(state.generatedHooks[idx].text);
  };

  const canContinue = state.selectedHookIndex !== null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-7">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-1">Elige el gancho</h2>
            <p className="text-[#909296] text-sm">
              5 mensajes directos, escritos desde tu opinión real. Selecciona el que mejor diría lo que piensas.
            </p>
          </div>
          <button
            onClick={generateHooks}
            disabled={loading}
            className="text-xs text-[#909296] hover:text-[#5c7cfa] flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Regenerar
          </button>
        </div>

        {/* Resumen de la opinión */}
        <details className="mb-5 group">
          <summary className="cursor-pointer list-none text-xs text-[#5C5F66] hover:text-[#909296] flex items-center gap-1">
            <span className="group-open:rotate-90 transition-transform inline-block">▸</span>
            Ver tu opinión sobre el tema
          </summary>
          <div className="mt-2 p-3 bg-[#25262B] rounded-lg text-xs text-[#909296] italic leading-relaxed">
            {state.opinionUsuario}
          </div>
        </details>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-[#5c7cfa] mb-3" />
            <p className="text-[#909296] text-sm">Escribiendo ganchos desde tu opinión...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-sm text-rose-300">
            {error}
            <button
              onClick={generateHooks}
              className="ml-3 underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && state.generatedHooks.length > 0 && (
          <div className="space-y-3">
            {state.generatedHooks.map((hook, idx) => {
              const isSelected = state.selectedHookIndex === idx;
              const isEditing = editingIdx === idx;

              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all ${
                    isSelected
                      ? 'border-[#5c7cfa] bg-[#5c7cfa]/5 shadow-[0_0_0_1px_rgba(92,124,250,0.3)]'
                      : 'border-[#2C2E33] bg-[#25262B] hover:border-[#5c7cfa]/40'
                  }`}
                >
                  {isEditing ? (
                    <div className="p-4 space-y-3">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={2}
                        className="w-full bg-[#1A1B1E] border border-[#2C2E33] rounded-lg px-3 py-2 text-white text-sm resize-none focus:border-[#5c7cfa] focus:outline-none"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => saveEdit(idx)}
                          className="text-xs bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white px-3 py-1.5 rounded-md flex items-center gap-1"
                        >
                          <Check size={12} /> Guardar
                        </button>
                        <button
                          onClick={() => setEditingIdx(null)}
                          className="text-xs text-[#909296] hover:text-white px-3 py-1.5 rounded-md flex items-center gap-1"
                        >
                          <X size={12} /> Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => update({ selectedHookIndex: idx })}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-[#5c7cfa] bg-[#5c7cfa]'
                              : 'border-[#5C5F66]'
                          }`}
                        >
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm leading-relaxed">{hook.text}</p>
                          {hook.reason && (
                            <p className="text-xs text-[#5C5F66] mt-2 italic">→ {hook.reason}</p>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); startEdit(idx); }}
                          className="text-[#5C5F66] hover:text-[#5c7cfa] p-1 rounded"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#909296] hover:text-white px-4 py-3 rounded-xl border border-[#2C2E33] hover:border-[#5c7cfa] transition-colors"
        >
          <ArrowLeft size={16} />
          Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 flex items-center justify-center gap-2 bg-[#5c7cfa] hover:bg-[#4c6ef5] disabled:bg-[#25262B] disabled:text-[#5C5F66] text-white font-semibold py-3 rounded-xl transition-colors"
        >
          <Sparkles size={16} />
          Crear el guión
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
