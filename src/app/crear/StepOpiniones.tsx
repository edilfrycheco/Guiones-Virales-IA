'use client';

import { useState } from 'react';
import { Loader2, MessageSquare, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import type { WizardState } from './types';
import { loadProfile } from '@/lib/user-profile';

interface Props {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  onNext: () => void;
}

const WEEK_LABEL: Record<NonNullable<WizardState['weekObjective']>, { label: string; desc: string; tone: string }> = {
  alcance: { label: 'S1 · Alcance', desc: 'Esta semana toca contenido que se comparta con quien aún no te conoce.', tone: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
  educativo: { label: 'S2 · Educativo', desc: 'Esta semana toca enseñar algo accionable que la gente quiera guardar.', tone: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  conexion: { label: 'S3 · Conexión', desc: 'Esta semana toca tocar algo que la gente siente pero no se atreve a decir.', tone: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
  autoridad: { label: 'S4 · Autoridad', desc: 'Esta semana toca mostrar criterio profesional sin postureo.', tone: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
};

export default function StepOpiniones({ state, update, onNext }: Props) {
  const [opinandoIA, setOpinandoIA] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profile = typeof window !== 'undefined' ? loadProfile() : null;
  const weekInfo = state.weekObjective ? WEEK_LABEL[state.weekObjective] : null;

  const pedirOpinionIA = async () => {
    if (state.tema.trim().length < 3) return;
    setOpinandoIA(true);
    setError(null);
    try {
      const res = await fetch('/api/wizard/opinar-tema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: state.tema,
          audiencia: profile?.audiencia_objetivo,
          perspectiva_editorial: profile?.perspectiva_editorial,
          manera_ensenar: profile?.manera_ensenar,
          weekObjective: state.weekObjective,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al pedir la opinión');
      update({ opinionIA: data.opinion, opinionUsuario: '' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally {
      setOpinandoIA(false);
    }
  };

  const canContinue = state.tema.trim().length >= 3
    && state.opinionIA.trim().length > 0
    && state.opinionUsuario.trim().length >= 10;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Banner de la semana */}
      {weekInfo && (
        <div className={`rounded-xl border px-4 py-3 ${weekInfo.tone}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide">{weekInfo.label}</span>
              <p className="text-sm mt-0.5 opacity-90">{weekInfo.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tema */}
      <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-7">
        <h2 className="text-lg font-semibold text-white mb-1">¿Sobre qué es el video?</h2>
        <p className="text-[#909296] text-sm mb-4">
          Escribe el tema en una frase. La IA va a opinar primero, luego tú das tu opinión real.
        </p>
        <textarea
          value={state.tema}
          onChange={(e) => update({ tema: e.target.value, opinionIA: '', opinionUsuario: '' })}
          placeholder="Ej: por qué la calidad visual cambia la percepción de tu marca"
          rows={2}
          className="w-full bg-[#25262B] border border-[#2C2E33] rounded-xl px-4 py-3 text-white placeholder-[#5C5F66] focus:border-[#5c7cfa] focus:outline-none text-sm resize-none transition-colors"
          autoFocus
        />

        {state.tema.trim().length >= 3 && !state.opinionIA && !opinandoIA && (
          <button
            onClick={pedirOpinionIA}
            className="mt-4 flex items-center gap-2 bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Sparkles size={16} />
            Que opine la IA primero
          </button>
        )}

        {opinandoIA && (
          <div className="mt-4 flex items-center gap-2 text-[#909296] text-sm">
            <Loader2 size={16} className="animate-spin" />
            La IA está pensando sobre el tema...
          </div>
        )}

        {error && (
          <p className="mt-3 text-sm text-rose-400">{error}</p>
        )}
      </div>

      {/* Opinión IA */}
      {state.opinionIA && (
        <div className="bg-[#1A1B1E] border border-amber-500/20 rounded-2xl p-7">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <MessageSquare size={14} className="text-amber-400" />
              </div>
              <h3 className="text-white font-semibold text-sm">Lo que opina la IA</h3>
            </div>
            <button
              onClick={pedirOpinionIA}
              disabled={opinandoIA}
              className="text-xs text-[#909296] hover:text-amber-400 flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={12} className={opinandoIA ? 'animate-spin' : ''} />
              Regenerar
            </button>
          </div>
          <div className="text-[#C1C2C5] text-sm leading-relaxed whitespace-pre-wrap">
            {state.opinionIA}
          </div>
          <p className="text-xs text-[#5C5F66] mt-4 italic">
            Esto es un disparador — no es lo que vas a decir en el video. Lee, reacciona y abajo escribe lo que tú piensas de verdad.
          </p>
        </div>
      )}

      {/* Opinión Usuario */}
      {state.opinionIA && (
        <div className="bg-[#1A1B1E] border border-emerald-500/20 rounded-2xl p-7">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Sparkles size={14} className="text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">Tu opinión real</h3>
          </div>
          <p className="text-[#909296] text-sm mb-3">
            ¿Qué piensas tú sobre esto? ¿Estás de acuerdo con la IA, lo matizas, lo rebates? Escríbelo como te salga — esta es la materia prima de los ganchos y del guión.
          </p>
          <textarea
            value={state.opinionUsuario}
            onChange={(e) => update({ opinionUsuario: e.target.value })}
            placeholder="Lo que pienso de verdad sobre esto es..."
            rows={6}
            className="w-full bg-[#25262B] border border-[#2C2E33] rounded-xl px-4 py-3 text-white placeholder-[#5C5F66] focus:border-emerald-500 focus:outline-none text-sm resize-none transition-colors"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[#5C5F66]">
              {state.opinionUsuario.length < 10
                ? `Faltan ${10 - state.opinionUsuario.length} caracteres mínimos`
                : `${state.opinionUsuario.split(/\s+/).filter(Boolean).length} palabras`}
            </span>
          </div>
        </div>
      )}

      {/* Continuar */}
      <button
        onClick={onNext}
        disabled={!canContinue}
        className="w-full flex items-center justify-center gap-2 bg-[#5c7cfa] hover:bg-[#4c6ef5] disabled:bg-[#25262B] disabled:text-[#5C5F66] text-white font-semibold py-3.5 rounded-xl transition-colors"
      >
        Continuar a ganchos
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
