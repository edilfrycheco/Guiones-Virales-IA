'use client';

import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { Wand2, Zap, BarChart3, BookTemplate, ArrowRight, Flame, TrendingUp, Target, Brain } from 'lucide-react';

const FEATURES = [
  {
    href: '/generator',
    icon: Wand2,
    title: 'Generador de Guiones',
    description: 'Crea guiones virales completos con frameworks probados. Hook, cuerpo, CTA — todo optimizado para máxima retención.',
    color: 'from-indigo-500 to-purple-600',
    tag: 'Principal',
  },
  {
    href: '/hooks',
    icon: Zap,
    title: 'Generador de Ganchos',
    description: 'Genera múltiples hooks virales en segundos. 10 tipos de ganchos diferentes optimizados para detener el scroll.',
    color: 'from-amber-500 to-orange-600',
    tag: 'Popular',
  },
  {
    href: '/analyzer',
    icon: BarChart3,
    title: 'Analizador de Guiones',
    description: 'Evalúa tus guiones existentes. Obtén puntuación de viralidad, retención, naturalidad y sugerencias de mejora.',
    color: 'from-emerald-500 to-teal-600',
    tag: 'Nuevo',
  },
  {
    href: '/templates',
    icon: BookTemplate,
    title: 'Plantillas & Frameworks',
    description: 'Explora los frameworks virales: PAS, AIDA, BAB, método Victor Heras, Open Loop y Storytelling.',
    color: 'from-pink-500 to-rose-600',
    tag: 'Referencia',
  },
];

const STATS = [
  { icon: Flame, label: 'Frameworks Virales', value: '6', sublabel: 'Probados por creadores top' },
  { icon: TrendingUp, label: 'Tipos de Ganchos', value: '10', sublabel: 'Para máximo impacto' },
  { icon: Target, label: 'Plataformas', value: '3', sublabel: 'Instagram, TikTok, YouTube' },
  { icon: Brain, label: 'Motor Humanización', value: 'v2', sublabel: 'Escritura indetectable' },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[240px]">
        {/* Hero Section */}
        <div className="relative overflow-hidden border-b border-[var(--border-color)]">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
          <div className="relative px-8 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
                  v1.0 — Motor de Guiones Virales
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
                Crea guiones que <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">se hacen virales</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-2xl">
                Motor de generación basado en las metodologías de los creadores más exitosos.
                Frameworks probados, ganchos irresistibles y escritura indistinguible de un humano real.
              </p>
              <div className="flex gap-3 mt-6">
                <Link
                  href="/generator"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-all hover:shadow-lg hover:shadow-indigo-500/25"
                >
                  <Wand2 size={16} />
                  Crear Guión
                </Link>
                <Link
                  href="/hooks"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-white rounded-lg font-medium text-sm transition-all border border-[var(--border-color)]"
                >
                  <Zap size={16} />
                  Generar Ganchos
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-4 gap-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="px-8 pb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Herramientas</h2>
          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="group bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-2 group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-1 text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Abrir <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Method Credits */}
        <div className="px-8 pb-12">
          <div className="bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
            <h3 className="text-white font-semibold mb-2">Metodologías integradas</h3>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              Este motor integra el <strong className="text-indigo-400">Método HRAS de Victor Heras</strong> (Hook, Retención, Argumento, Salida),
              junto con frameworks clásicos de copywriting como <strong className="text-[var(--text-secondary)]">PAS, AIDA, BAB</strong>,
              y técnicas avanzadas de <strong className="text-[var(--text-secondary)]">Open Loop y Storytelling</strong>.
              El motor de humanización aplica 10 reglas de escritura natural para que cada guión sea indistinguible
              de contenido escrito por un creador humano real.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
