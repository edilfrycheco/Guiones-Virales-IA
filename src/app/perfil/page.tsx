'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { loadProfile, saveProfile, type UserProfile } from '@/lib/user-profile';
import { NICHE_LABELS, PLATFORM_LABELS, TONE_LABELS } from '@/app/crear/constants';
import { CheckCircle2, User, MessageSquare, Sparkles, Calendar } from 'lucide-react';

const NICHE_OPTIONS = Object.entries(NICHE_LABELS).map(([value, label]) => ({ value, label }));
const PLATFORM_OPTIONS = Object.entries(PLATFORM_LABELS).map(([value, label]) => ({ value, label }));
const TONE_OPTIONS = Object.entries(TONE_LABELS).map(([value, label]) => ({ value, label }));

const EMPTY: UserProfile = {
  audiencia_objetivo: '',
  perspectiva_editorial: '',
  manera_ensenar: '',
  nicho_default: 'marketing',
  platform_default: 'instagram',
  tone_default: 'casual',
  rotacion_activa: false,
  rotacion_inicio: '',
};

// Devuelve el lunes de la semana actual en formato ISO
function getCurrentMonday(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

export default function PerfilPage() {
  const [form, setForm] = useState<UserProfile>(EMPTY);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const profile = loadProfile();
    if (profile) setForm(profile);
    setHydrated(true);
  }, []);

  const handleSave = () => {
    const profileToSave = { ...form };
    if (form.rotacion_activa && !form.rotacion_inicio) {
      profileToSave.rotacion_inicio = getCurrentMonday();
    }
    saveProfile(profileToSave);
    setForm(profileToSave);
    try { localStorage.removeItem('wizard_state_v1'); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!hydrated) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[240px]">
        <div className="px-8 py-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Mi Perfil</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Tu voz se inyecta en cada gancho y guión — configúrala una vez y la IA habla desde ahí
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-8 py-10 space-y-6">

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={16} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold text-base">A quién le hablas</h2>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">
                  Describe a tu cliente ideal — lo que vive, lo que le preocupa, lo que necesita escuchar.
                </p>
              </div>
            </div>
            <textarea
              rows={3}
              value={form.audiencia_objetivo}
              onChange={(e) => setForm({ ...form, audiencia_objetivo: e.target.value })}
              placeholder="Ej: dueños de negocios y profesionales independientes que sienten que su presencia visual no refleja su nivel y quieren mejorarla para atraer mejores clientes."
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-white text-sm placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare size={16} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold text-base">Tu perspectiva editorial</h2>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">
                  Qué piensas <span className="italic">de verdad</span> sobre tu industria. Lo que te molesta del statu quo, con qué no estás de acuerdo, qué nadie dice. Esto es lo que te hace ti — la IA no puede inventarlo.
                </p>
              </div>
            </div>
            <textarea
              rows={5}
              value={form.perspectiva_editorial}
              onChange={(e) => setForm({ ...form, perspectiva_editorial: e.target.value })}
              placeholder="Ej: la creación de contenido se ha vuelto una industria de fórmulas vacías. Todos venden el mismo sistema, el mismo hook, la misma promesa. Eso genera creadores que copian en lugar de pensar. Crear contenido que funcione es difícil — pretender que hay una fórmula mágica es lo que hace que la gente pierda su voz."
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-white text-sm placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={16} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold text-base">Cómo enseñas / cómo comunicas</h2>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">
                  Qué evitas. Cómo prefieres explicar. Qué te diferencia de los demás creadores de tu nicho. Lo que no harías nunca aunque funcione.
                </p>
              </div>
            </div>
            <textarea
              rows={5}
              value={form.manera_ensenar}
              onChange={(e) => setForm({ ...form, manera_ensenar: e.target.value })}
              placeholder="Ej: enseño desde la experiencia real, no desde la teoría. Admito cuando algo es difícil. No prometo resultados fáciles ni uso hype. Prefiero un ejemplo concreto antes que una lista de pasos. Hablo aterrizado, sin frases motivacionales vacías."
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-white text-sm placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar size={16} className="text-violet-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold text-base">Rotación semanal de objetivos</h2>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">
                  Cada semana se enfoca en un tipo distinto: <span className="text-white">Alcance → Educativo → Conexión → Autoridad</span>. La app te orienta sin encerrarte.
                </p>
              </div>
            </div>
            <label className="flex items-center gap-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg px-4 py-3 cursor-pointer hover:border-violet-500/40 transition-colors">
              <input
                type="checkbox"
                checked={form.rotacion_activa}
                onChange={(e) => setForm({ ...form, rotacion_activa: e.target.checked })}
                className="w-4 h-4 accent-violet-500"
              />
              <span className="text-white text-sm">Activar rotación automática</span>
            </label>
          </div>

          <details className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 group">
            <summary className="cursor-pointer list-none flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold text-base">Defaults técnicos</h2>
                <p className="text-[var(--text-muted)] text-sm mt-0.5">
                  Nicho, plataforma y tono pre-seleccionados. Opcional.
                </p>
              </div>
              <span className="text-[var(--text-muted)] text-xs group-open:rotate-180 transition-transform">▼</span>
            </summary>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Nicho
                </label>
                <select
                  value={form.nicho_default}
                  onChange={(e) => setForm({ ...form, nicho_default: e.target.value })}
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {NICHE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Plataforma
                </label>
                <select
                  value={form.platform_default}
                  onChange={(e) => setForm({ ...form, platform_default: e.target.value })}
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {PLATFORM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  Tono
                </label>
                <select
                  value={form.tone_default}
                  onChange={(e) => setForm({ ...form, tone_default: e.target.value })}
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {TONE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </details>

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {saved ? (
              <>
                <CheckCircle2 size={18} />
                Guardado — tu próximo guión usará esta voz
              </>
            ) : (
              'Guardar perfil'
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
