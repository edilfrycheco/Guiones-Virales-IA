'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, RefreshCw, Copy, Check, Wand2, RotateCcw } from 'lucide-react';
import type { WizardState } from './types';
import { loadProfile } from '@/lib/user-profile';

interface Props {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  onBack: () => void;
  onReset: () => void;
}

export default function StepGuion({ state, update, onBack, onReset }: Props) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedHook = state.selectedHookIndex !== null
    ? state.generatedHooks[state.selectedHookIndex]
    : null;

  const generateScript = async () => {
    if (!selectedHook) return;
    setLoading(true);
    setError('');

    const profile = loadProfile();

    try {
      const res = await fetch('/api/wizard/generate-scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: state.tema,
          opinionUsuario: state.opinionUsuario,
          opinionIA: state.opinionIA,
          hookText: selectedHook.text,
          platform: state.platform,
          tone: state.tone,
          niche: state.niche,
          length: state.length,
          humanizer: state.humanizer,
          audiencia: profile?.audiencia_objetivo,
          perspectiva_editorial: profile?.perspectiva_editorial,
          manera_ensenar: profile?.manera_ensenar,
          weekObjective: state.weekObjective,
        }),
      });

      const raw = await res.text();
      let data: { script?: string; error?: string } = {};
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
      const script = data.script || '';
      update({ generatedScript: script, editedScript: script });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al generar el guión');
    } finally {
      setLoading(false);
    }
  };

  // Auto-genera al entrar si aún no hay guión
  useEffect(() => {
    if (!state.generatedScript && selectedHook && !loading) {
      generateScript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyEditInstruction = async () => {
    if (!state.editInstruction.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/wizard/edit-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: state.editedScript || state.generatedScript,
          instruction: state.editInstruction,
          humanizer: state.humanizer,
        }),
      });
      const raw = await res.text();
      let data: { script?: string; error?: string } = {};
      try { data = JSON.parse(raw); } catch {
        throw new Error('Respuesta inválida del servidor.');
      }
      if (!res.ok || data.error) throw new Error(data.error || `Error ${res.status}`);
      update({ editedScript: data.script || '', editInstruction: '' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al aplicar la instrucción');
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(state.editedScript || state.generatedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const wordCount = (state.editedScript || state.generatedScript || '').trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-7">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Tu guión</h2>
            <p className="text-[#909296] text-sm">
              Escrito desde tu opinión, con el gancho que elegiste.
            </p>
          </div>
          {!loading && state.generatedScript && (
            <div className="flex items-center gap-2">
              <button
                onClick={copy}
                className="text-xs text-[#909296] hover:text-[#5c7cfa] flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2C2E33] hover:border-[#5c7cfa] transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
              <button
                onClick={generateScript}
                disabled={loading}
                className="text-xs text-[#909296] hover:text-[#5c7cfa] flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2C2E33] hover:border-[#5c7cfa] transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Regenerar
              </button>
            </div>
          )}
        </div>

        {/* Gancho usado */}
        {selectedHook && (
          <div className="mb-5 p-3 bg-[#25262B] border-l-2 border-[#5c7cfa] rounded-r-lg">
            <p className="text-xs text-[#5C5F66] mb-1">Gancho elegido:</p>
            <p className="text-white text-sm italic">"{selectedHook.text}"</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-[#5c7cfa] mb-3" />
            <p className="text-[#909296] text-sm">Escribiendo tu guión...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-sm text-rose-300">
            {error}
            <button onClick={generateScript} className="ml-3 underline hover:no-underline">
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (state.generatedScript || state.editedScript) && (
          <>
            {editing ? (
              <textarea
                value={state.editedScript}
                onChange={(e) => update({ editedScript: e.target.value })}
                rows={20}
                className="w-full bg-[#25262B] border border-[#5c7cfa]/50 rounded-xl px-4 py-3 text-white text-sm leading-relaxed font-mono resize-vertical focus:outline-none focus:border-[#5c7cfa]"
              />
            ) : (
              <div className="bg-[#25262B] border border-[#2C2E33] rounded-xl px-5 py-4 text-[#E4E4E7] text-sm leading-relaxed whitespace-pre-wrap min-h-[200px]">
                {state.editedScript || state.generatedScript}
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-[#5C5F66]">{wordCount} palabras</span>
              <button
                onClick={() => setEditing(!editing)}
                className="text-xs text-[#909296] hover:text-[#5c7cfa] transition-colors"
              >
                {editing ? '✓ Cerrar editor' : '✎ Editar a mano'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Reescritura por instrucción */}
      {!loading && state.generatedScript && (
        <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Wand2 size={16} className="text-violet-400" />
            <h3 className="text-white font-semibold text-sm">Pídele un ajuste a la IA</h3>
          </div>
          <p className="text-[#909296] text-xs mb-3">
            Ej: "más corto", "más casual", "menos abstracto", "que cierre con una pregunta"
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={state.editInstruction}
              onChange={(e) => update({ editInstruction: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && applyEditInstruction()}
              placeholder="Cómo querés que ajuste el guión..."
              className="flex-1 bg-[#25262B] border border-[#2C2E33] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#5C5F66] focus:border-violet-500 focus:outline-none"
            />
            <button
              onClick={applyEditInstruction}
              disabled={loading || !state.editInstruction.trim()}
              className="bg-violet-600 hover:bg-violet-500 disabled:bg-[#25262B] disabled:text-[#5C5F66] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* Botones bottom */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#909296] hover:text-white px-4 py-3 rounded-xl border border-[#2C2E33] hover:border-[#5c7cfa] transition-colors"
        >
          <ArrowLeft size={16} />
          Atrás
        </button>
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 text-[#909296] hover:text-white border border-[#2C2E33] hover:border-[#5c7cfa] py-3 rounded-xl transition-colors"
        >
          <RotateCcw size={16} />
          Empezar nuevo guión
        </button>
      </div>
    </div>
  );
}
