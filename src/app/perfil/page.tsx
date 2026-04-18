'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { loadProfile, saveProfile, type UserProfile } from '@/lib/user-profile';
import { NICHE_LABELS, PLATFORM_LABELS, TONE_LABELS } from '@/app/crear/constants';
import { CheckCircle2, User } from 'lucide-react';

const NICHE_OPTIONS = Object.entries(NICHE_LABELS).map(([value, label]) => ({ value, label }));
const PLATFORM_OPTIONS = Object.entries(PLATFORM_LABELS).map(([value, label]) => ({ value, label }));
const TONE_OPTIONS = Object.entries(TONE_LABELS).map(([value, label]) => ({ value, label }));

const EMPTY: UserProfile = {
  audiencia_objetivo: '',
  nicho_default: 'marketing',
  platform_default: 'instagram',
  tone_default: 'casual',
};

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
    saveProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!hydrated) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[240px]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Mi Perfil</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Define tu audiencia y defaults — se aplican automáticamente en cada guión
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-8 py-10 space-y-8">

          {/* Audiencia objetivo */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 space-y-3">
            <div>
              <h2 className="text-white font-semibold text-base">Audiencia ideal</h2>
              <p className="text-[var(--text-muted)] text-sm mt-0.5">
                Describe en detalle a quien le hablas. Cuanto más específico, mejor los ganchos y guiones.
              </p>
            </div>
            <textarea
              rows={4}
              value={form.audiencia_objetivo}
              onChange={(e) => setForm({ ...form, audiencia_objetivo: e.target.value })}
              placeholder="Ej: dueños de negocios y profesionales independientes que sienten que su presencia visual no refleja su nivel, y quieren mejorarla para atraer mejores clientes y cobrar más."
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-white text-sm placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Defaults */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-white font-semibold text-base">Defaults del wizard</h2>
              <p className="text-[var(--text-muted)] text-sm mt-0.5">
                Estos valores se pre-seleccionan cada vez que creas un nuevo guión.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {saved ? (
              <>
                <CheckCircle2 size={18} />
                Guardado
              </>
            ) : (
              'Guardar perfil'
            )}
          </button>

          {form.audiencia_objetivo && (
            <p className="text-xs text-[var(--text-muted)] text-center">
              Esta descripción se inyecta en cada prompt de ganchos y guiones automáticamente.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
