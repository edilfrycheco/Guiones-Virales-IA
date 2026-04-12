'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { BookTemplate, ChevronRight, Copy, Check, Zap, Brain, Target, MessageCircle, Repeat, BookOpen } from 'lucide-react';
import { FRAMEWORK_STRUCTURES, HOOK_TEMPLATES, type HookType } from '@/lib/viral-frameworks';

const FRAMEWORK_ICONS: Record<string, typeof Zap> = {
  PAS: Target,
  AIDA: Brain,
  BAB: Repeat,
  HRAS: Zap,
  OPEN_LOOP: MessageCircle,
  STORYTELLING: BookOpen,
};

const FRAMEWORK_COLORS: Record<string, string> = {
  PAS: 'from-blue-500 to-cyan-600',
  AIDA: 'from-purple-500 to-indigo-600',
  BAB: 'from-green-500 to-emerald-600',
  HRAS: 'from-amber-500 to-orange-600',
  OPEN_LOOP: 'from-pink-500 to-rose-600',
  STORYTELLING: 'from-teal-500 to-cyan-600',
};

const HOOK_TYPE_LABELS: Record<HookType, string> = {
  curiosidad: 'Curiosidad',
  controversia: 'Controversia',
  pregunta: 'Pregunta',
  declaracion_impactante: 'Declaración Impactante',
  pattern_interrupt: 'Pattern Interrupt',
  mito: 'Rompe-mitos',
  historia: 'Historia',
  dato_sorprendente: 'Dato Sorprendente',
  reto: 'Reto',
  confesion: 'Confesión',
};

export default function TemplatesPage() {
  const [activeFramework, setActiveFramework] = useState<string | null>(null);
  const [activeHookType, setActiveHookType] = useState<HookType | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = async (text: string, index: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[240px]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <BookTemplate size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Plantillas & Frameworks</h1>
              <p className="text-sm text-[var(--text-muted)]">Explora los frameworks virales y plantillas de ganchos</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Frameworks Section */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Frameworks de Guión</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(FRAMEWORK_STRUCTURES).map(([key, fw]) => {
                const Icon = FRAMEWORK_ICONS[key] || Target;
                const color = FRAMEWORK_COLORS[key] || 'from-gray-500 to-gray-600';
                const isActive = activeFramework === key;

                return (
                  <div key={key}>
                    <button
                      onClick={() => setActiveFramework(isActive ? null : key)}
                      className={`w-full text-left bg-[var(--bg-card)] border rounded-xl p-5 transition-all duration-200 ${
                        isActive
                          ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                          : 'border-[var(--border-color)] hover:border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                          <Icon size={20} className="text-white" />
                        </div>
                        <ChevronRight
                          size={16}
                          className={`text-[var(--text-muted)] transition-transform ${isActive ? 'rotate-90' : ''}`}
                        />
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1">{key}</h3>
                      <p className="text-[11px] text-indigo-400 font-medium mb-2">{fw.nombre}</p>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{fw.descripcion}</p>
                    </button>

                    {isActive && (
                      <div className="mt-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 animate-slide-up">
                        <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Estructura paso a paso:</h4>
                        <div className="space-y-3">
                          {fw.pasos.map((paso, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <p className="text-sm text-[var(--text-primary)]">{paso}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Hook Templates Section */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Plantillas de Ganchos</h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {Object.entries(HOOK_TYPE_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveHookType(activeHookType === key ? null : key as HookType)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeHookType === key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-indigo-500/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeHookType && (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 animate-slide-up">
                <h3 className="text-sm font-semibold text-white mb-4">
                  Plantillas de tipo: <span className="text-indigo-400">{HOOK_TYPE_LABELS[activeHookType]}</span>
                </h3>
                <div className="space-y-2">
                  {HOOK_TEMPLATES[activeHookType].map((template, i) => {
                    const copyKey = `${activeHookType}-${i}`;
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-lg group"
                      >
                        <p className="text-sm text-[var(--text-primary)]">{template}</p>
                        <button
                          onClick={() => handleCopy(template, copyKey)}
                          className="p-1.5 rounded-md hover:bg-[var(--border-color)] text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all"
                        >
                          {copiedIndex === copyKey ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-3">
                  Reemplaza <code className="text-indigo-400">{'{'} tema {'}'}</code> con tu tema específico
                </p>
              </div>
            )}

            {!activeHookType && (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-8 text-center">
                <p className="text-[var(--text-muted)] text-sm">Selecciona un tipo de gancho para ver las plantillas</p>
              </div>
            )}
          </section>

          {/* Tips Section */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Tips de los Pros</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-amber-400 mb-3">Método Victor Heras</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>• Las empresas tienen 3-5 segundos para captar atención</li>
                  <li>• El contenido debe ENTRETENER primero, educar segundo</li>
                  <li>• El hook visual es tan importante como el verbal</li>
                  <li>• Cada CTA debe beneficiar directamente a tu cuenta</li>
                  <li>• Originalidad y autenticidad superan la producción</li>
                </ul>
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-emerald-400 mb-3">Retención 2026</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>• 70%+ watch-through rate = potencial viral</li>
                  <li>• Micro-ganchos cada 5-8 segundos mantienen la atención</li>
                  <li>• Open loops: abre preguntas que solo cierras al final</li>
                  <li>• Videos sub-20 segundos: 42% de tasa de completado</li>
                  <li>• Coherencia hook-contenido-CTA es más clave que nunca</li>
                </ul>
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-purple-400 mb-3">Escritura Humana</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>• Varía longitud de oraciones (cortas + largas)</li>
                  <li>• Incluye autocorrecciones ("bueno, más bien...")</li>
                  <li>• Usa fragmentos de oración sin verbo</li>
                  <li>• Expresa opiniones y juicios subjetivos</li>
                  <li>• Elimina conectores formales (sin embargo, además...)</li>
                </ul>
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-blue-400 mb-3">Algoritmo 2026</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>• Satisfacción a largo plazo {">"} picos virales únicos</li>
                  <li>• Consistencia temática y autoridad del creador importan más</li>
                  <li>• 80% de usuarios ven sin sonido — subtítulos son esenciales</li>
                  <li>• Audio trending = +300-500% alcance en primeras 24h</li>
                  <li>• Calidad del video {">"} número de seguidores</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
