'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Zap, BookOpen, Lightbulb, TrendingUp, BarChart2, AlertTriangle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { loadProfile, getCurrentWeekObjective } from '@/lib/user-profile';
import type { WeekObjective } from '@/lib/user-profile';
import {
  PLAN_TOPICS,
  S3_TENSIONES,
  S3_PREGUNTAS,
  type Angulo,
  type TopicObjective,
} from './topics';

type Filter = 'todos' | Angulo | 's3';

const ANGULO_LABEL: Record<Angulo, string> = {
  estrategia: 'Estrategia',
  audiovisual: 'Audiovisual',
  negocio: 'Negocio',
  criterio: 'Criterio',
};

const OBJECTIVE_BADGE: Record<TopicObjective, { label: string; color: string }> = {
  alcance:   { label: 'S1 Alcance',   color: 'bg-rose-500/15 text-rose-300 border-rose-500/20' },
  educativo: { label: 'S2 Educativo', color: 'bg-amber-500/15 text-amber-300 border-amber-500/20' },
  autoridad: { label: 'S4 Autoridad', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' },
};

const WEEK_BANNER: Record<WeekObjective, { label: string; desc: string; color: string; icon: React.ElementType }> = {
  alcance:   { label: 'S1 · Semana de Alcance',   desc: 'Toca contenido que se comparta con quien aún no te conoce.', color: 'bg-rose-500/10 border-rose-500/20 text-rose-300', icon: Zap },
  educativo: { label: 'S2 · Semana Educativa',    desc: 'Toca enseñar algo accionable que la gente quiera guardar.',   color: 'bg-amber-500/10 border-amber-500/20 text-amber-300', icon: BookOpen },
  conexion:  { label: 'S3 · Semana de Conexión',  desc: 'Toca tocar algo que la gente siente pero no se atreve a decir.', color: 'bg-violet-500/10 border-violet-500/20 text-violet-300', icon: Lightbulb },
  autoridad: { label: 'S4 · Semana de Autoridad', desc: 'Toca mostrar criterio profesional sin postureo.',            color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300', icon: TrendingUp },
};

const ANGULO_ICON: Record<Angulo, React.ElementType> = {
  estrategia: BarChart2,
  audiovisual: Zap,
  negocio: TrendingUp,
  criterio: Lightbulb,
};

export default function PlanPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('todos');
  const [weekObjective, setWeekObjective] = useState<WeekObjective | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const profile = loadProfile();
    setWeekObjective(getCurrentWeekObjective(profile));
    setHydrated(true);
  }, []);

  const useTopic = (text: string) => {
    try {
      localStorage.setItem('wizard_tema_seed', text);
    } catch {}
    router.push('/crear');
  };

  const filteredTopics = PLAN_TOPICS.filter((t) => {
    if (filter === 'todos') return true;
    if (filter === 's3') return false;
    return t.angulo === filter;
  });

  // When S3 week and filter is 'todos', bump S3 tab to be highlighted
  const isS3Week = weekObjective === 'conexion';

  if (!hydrated) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[240px]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-lg">📋</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Plan de Contenido</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Elige un tema · La IA lo lleva al wizard con tu opinión
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-8 space-y-6">

          {/* Week banner */}
          {weekObjective && (
            <div className={`rounded-xl border px-5 py-4 ${WEEK_BANNER[weekObjective].color}`}>
              <div className="flex items-start gap-3">
                {(() => {
                  const Icon = WEEK_BANNER[weekObjective].icon;
                  return <Icon size={18} className="mt-0.5 flex-shrink-0" />;
                })()}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider">{WEEK_BANNER[weekObjective].label}</span>
                  <p className="text-sm mt-0.5 opacity-90">{WEEK_BANNER[weekObjective].desc}</p>
                  {isS3Week && (
                    <p className="text-xs mt-1 opacity-70">Esta semana usá las tensiones y preguntas de S3 — no los temas de la lista.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {(['todos', 'estrategia', 'audiovisual', 'negocio', 'criterio', 's3'] as const).map((f) => {
              const isActive = filter === f;
              const isS3 = f === 's3';
              const s3Highlight = isS3 && isS3Week;

              const label =
                f === 'todos' ? 'Todos'
                : f === 's3' ? '💜 S3 Conexión'
                : ANGULO_LABEL[f as Angulo];

              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? isS3
                        ? 'bg-violet-600 text-white'
                        : 'bg-[#5c7cfa] text-white'
                      : s3Highlight
                      ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30 hover:bg-violet-500/25'
                      : 'bg-[#25262B] text-[#909296] border border-[#2C2E33] hover:text-white hover:border-[#5c7cfa]/40'
                  }`}
                >
                  {label}
                  {s3Highlight && !isActive && <span className="ml-1.5 text-[10px] font-bold tracking-wide">ESTA SEMANA</span>}
                </button>
              );
            })}

            <span className="ml-auto text-xs text-[#5C5F66]">
              {filter === 's3' ? `${S3_TENSIONES.length + S3_PREGUNTAS.length} recursos` : `${filteredTopics.length} temas`}
            </span>
          </div>

          {/* S3 section */}
          {filter === 's3' && (
            <div className="space-y-8">
              {/* Info */}
              <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={16} className="text-violet-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-violet-200/80 leading-relaxed">
                    <strong className="text-violet-300">S3 no se crea desde un tema — se crea desde una tensión o una pregunta real.</strong>
                    <br />
                    Elige algo que realmente te resuene, escríbelo como tema en el wizard, y deja que tu opinión genuina lo guíe.
                  </div>
                </div>
              </div>

              {/* Tensiones */}
              <div>
                <h2 className="text-white font-semibold mb-1">Tensiones del oficio</h2>
                <p className="text-[#909296] text-xs mb-4">Dilemas reales entre dos verdades que se contradicen. Elige la que más te incomode.</p>
                <div className="grid grid-cols-1 gap-3">
                  {S3_TENSIONES.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => useTopic(t.text)}
                      className="w-full text-left bg-[#1A1B1E] border border-[#2C2E33] hover:border-violet-500/50 rounded-xl p-4 group transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-violet-500/15 text-violet-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-[#C1C2C5] text-sm leading-relaxed flex-1">{t.text}</p>
                        <ArrowRight size={14} className="text-[#5C5F66] group-hover:text-violet-400 transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preguntas */}
              <div>
                <h2 className="text-white font-semibold mb-1">Preguntas detonantes</h2>
                <p className="text-[#909296] text-xs mb-4">Preguntas que abren algo real. No las respondas con lo que "suena bien" — respondelas como te salga primero.</p>
                <div className="grid grid-cols-1 gap-3">
                  {S3_PREGUNTAS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => useTopic(q.text)}
                      className="w-full text-left bg-[#1A1B1E] border border-[#2C2E33] hover:border-violet-500/50 rounded-xl p-4 group transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400/70 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          ?
                        </div>
                        <p className="text-[#C1C2C5] text-sm leading-relaxed flex-1 italic">{q.text}</p>
                        <ArrowRight size={14} className="text-[#5C5F66] group-hover:text-violet-400 transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Regular topics grid */}
          {filter !== 's3' && (
            <div>
              {/* Group by ángulo when showing all */}
              {filter === 'todos' ? (
                <div className="space-y-10">
                  {(['estrategia', 'audiovisual', 'negocio', 'criterio'] as Angulo[]).map((angulo) => {
                    const topics = PLAN_TOPICS.filter((t) => t.angulo === angulo);
                    const Icon = ANGULO_ICON[angulo];
                    return (
                      <div key={angulo}>
                        <div className="flex items-center gap-2 mb-4">
                          <Icon size={15} className="text-[#5c7cfa]" />
                          <h2 className="text-white font-semibold">{ANGULO_LABEL[angulo]}</h2>
                          <span className="text-xs text-[#5C5F66]">{topics.length} temas</span>
                        </div>
                        <TopicGrid topics={topics} onSelect={useTopic} weekObjective={weekObjective} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <TopicGrid topics={filteredTopics} onSelect={useTopic} weekObjective={weekObjective} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TopicGrid({
  topics,
  onSelect,
  weekObjective,
}: {
  topics: ReturnType<typeof PLAN_TOPICS.filter>;
  onSelect: (text: string) => void;
  weekObjective: WeekObjective | null;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {topics.map((topic, i) => {
        const badge = OBJECTIVE_BADGE[topic.objetivo];
        const isThisWeek =
          weekObjective !== null &&
          weekObjective !== 'conexion' &&
          topic.objetivo === weekObjective;

        return (
          <button
            key={i}
            onClick={() => onSelect(topic.text)}
            className={`text-left bg-[#1A1B1E] border rounded-xl p-4 group transition-all hover:shadow-[0_0_0_1px_rgba(92,124,250,0.3)] ${
              isThisWeek
                ? 'border-[#5c7cfa]/40 bg-[#5c7cfa]/5'
                : 'border-[#2C2E33] hover:border-[#5c7cfa]/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[#C1C2C5] text-sm leading-relaxed flex-1">{topic.text}</p>
              <ArrowRight size={14} className="text-[#5C5F66] group-hover:text-[#5c7cfa] transition-colors flex-shrink-0 mt-0.5" />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${badge.color}`}>
                {badge.label}
              </span>
              {isThisWeek && (
                <span className="text-[10px] font-bold text-[#5c7cfa] uppercase tracking-wide">Esta semana</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
