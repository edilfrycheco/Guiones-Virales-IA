'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import type { ReferenceScript } from '@/lib/supabase';
import { BookOpen, Plus, Trash2, ChevronDown, ChevronUp, Loader2, Sparkles } from 'lucide-react';

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'otro', label: 'Otro' },
];

const NICHE_OPTIONS = [
  'finanzas', 'negocios', 'marketing', 'desarrollo_personal',
  'fitness', 'cocina', 'lifestyle', 'relaciones',
  'educacion', 'tecnologia', 'viajes', 'moda', 'otro',
];

// ---------------------------------------------------------------------------
// Add Script Form
// ---------------------------------------------------------------------------
function AddScriptForm({ onAdded }: { onAdded: (s: ReferenceScript) => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    creator_name: '',
    topic: '',
    platform: 'instagram',
    niche: '',
    estimated_views: '',
    script_content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.script_content.trim() || !form.topic.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/reference-scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          estimated_views: form.estimated_views ? Number(form.estimated_views) : undefined,
        }),
      });
      const raw = await res.text();
      let data: Record<string, unknown> = {};
      try { data = JSON.parse(raw); } catch {
        throw new Error(
          res.status === 504
            ? 'El servidor tardó demasiado. Intenta de nuevo.'
            : 'Respuesta inválida del servidor. Reintenta.'
        );
      }
      if (data.error) throw new Error(data.error as string);
      onAdded(data.script);
      setForm({ creator_name: '', topic: '', platform: 'instagram', niche: '', estimated_views: '', script_content: '' });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 text-white font-medium">
          <Plus size={18} className="text-[#5c7cfa]" />
          Añadir guión ganador
        </div>
        {open ? <ChevronUp size={16} className="text-[#5C5F66]" /> : <ChevronDown size={16} className="text-[#5C5F66]" />}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="border-t border-[var(--border-color)] px-5 py-5 space-y-4">
          <p className="text-xs text-[#5C5F66]">
            Pega la transcripción de un video de Instagram (o cualquier plataforma) que haya tenido buen engagement. Claude lo analizará automáticamente.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#909296] mb-1.5">Creador / Cuenta</label>
              <input
                type="text"
                value={form.creator_name}
                onChange={(e) => setForm({ ...form, creator_name: e.target.value })}
                placeholder="Ej: @juanperez"
                className="w-full bg-[#25262B] border border-[#2C2E33] rounded-lg px-3 py-2 text-sm text-white placeholder-[#5C5F66] focus:border-[#5c7cfa] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#909296] mb-1.5">Tema del video *</label>
              <input
                type="text"
                required
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="Ej: cómo invertir siendo principiante"
                className="w-full bg-[#25262B] border border-[#2C2E33] rounded-lg px-3 py-2 text-sm text-white placeholder-[#5C5F66] focus:border-[#5c7cfa] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-[#909296] mb-1.5">Plataforma</label>
              <select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full bg-[#25262B] border border-[#2C2E33] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5c7cfa] focus:outline-none"
              >
                {PLATFORM_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#909296] mb-1.5">Nicho</label>
              <select
                value={form.niche}
                onChange={(e) => setForm({ ...form, niche: e.target.value })}
                className="w-full bg-[#25262B] border border-[#2C2E33] rounded-lg px-3 py-2 text-sm text-white focus:border-[#5c7cfa] focus:outline-none"
              >
                <option value="">Sin especificar</option>
                {NICHE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#909296] mb-1.5">Vistas estimadas</label>
              <input
                type="number"
                value={form.estimated_views}
                onChange={(e) => setForm({ ...form, estimated_views: e.target.value })}
                placeholder="Ej: 500000"
                className="w-full bg-[#25262B] border border-[#2C2E33] rounded-lg px-3 py-2 text-sm text-white placeholder-[#5C5F66] focus:border-[#5c7cfa] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#909296] mb-1.5">
              Transcripción / Guión del video *
            </label>
            <textarea
              required
              value={form.script_content}
              onChange={(e) => setForm({ ...form, script_content: e.target.value })}
              placeholder="Pega aquí la transcripción exacta del video ganador..."
              rows={8}
              className="w-full bg-[#25262B] border border-[#2C2E33] rounded-xl px-4 py-3 text-sm text-white placeholder-[#5C5F66] focus:border-[#5c7cfa] focus:outline-none resize-none leading-relaxed"
            />
            <p className="text-xs text-[#5C5F66] mt-1">
              {form.script_content.length} caracteres
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border border-[#2C2E33] text-[#909296] hover:text-white rounded-lg text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !form.script_content.trim() || !form.topic.trim()}
              className="flex-1 py-2 bg-[#5c7cfa] hover:bg-[#4c6ef5] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Analizando con IA...
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Guardar y analizar
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Script Card
// ---------------------------------------------------------------------------
function ScriptCard({
  script,
  onDelete,
}: {
  script: ReferenceScript;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este guión de referencia?')) return;
    setDeleting(true);
    try {
      await fetch(`/api/reference-scripts/${script.id}`, { method: 'DELETE' });
      onDelete(script.id);
    } finally {
      setDeleting(false);
    }
  };

  const analysis = script.style_analysis;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
      {/* Card header */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {script.creator_name && (
                <span className="text-xs font-semibold text-[#5c7cfa]">{script.creator_name}</span>
              )}
              <span className="text-xs bg-[#25262B] border border-[#2C2E33] text-[#909296] px-2 py-0.5 rounded-full capitalize">
                {script.platform}
              </span>
              {script.hook_type && (
                <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  {script.hook_type}
                </span>
              )}
              {script.framework && (
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {script.framework}
                </span>
              )}
              {script.estimated_views && (
                <span className="text-xs text-[#5C5F66]">
                  ~{(script.estimated_views / 1000).toFixed(0)}K vistas
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-white">{script.topic}</p>
            {analysis?.hook_pattern && (
              <p className="text-xs text-[#909296] mt-1 italic">"{analysis.hook_pattern}"</p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg text-[#5C5F66] hover:text-white hover:bg-[#2C2E33] transition-all"
              title={expanded ? 'Colapsar' : 'Ver análisis completo'}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-lg text-[#5C5F66] hover:text-red-400 hover:bg-red-400/10 transition-all"
              title="Eliminar"
            >
              {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded analysis */}
      {expanded && (
        <div className="border-t border-[var(--border-color)] px-5 py-4 space-y-4">
          {analysis && (
            <div className="space-y-3">
              {analysis.why_it_works && (
                <div>
                  <p className="text-xs font-semibold text-[#909296] mb-1">Por qué funciona</p>
                  <p className="text-sm text-[#C1C2C5]">{analysis.why_it_works}</p>
                </div>
              )}

              {analysis.engagement_triggers?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#909296] mb-1.5">Triggers de engagement</p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.engagement_triggers.map((t, i) => (
                      <span key={i} className="text-xs bg-[#25262B] border border-[#2C2E33] text-[#C1C2C5] px-2 py-1 rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.retention_mechanisms && analysis.retention_mechanisms.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#909296] mb-1.5">Mecanismos de retención</p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.retention_mechanisms.map((m, i) => (
                      <span key={i} className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-1 rounded-lg">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(analysis.loop_timing || analysis.payoff_moment) && (
                <div className="grid grid-cols-2 gap-3">
                  {analysis.loop_timing && (
                    <div>
                      <p className="text-xs font-semibold text-[#909296] mb-1">Timing de loops</p>
                      <p className="text-xs text-[#C1C2C5]">{analysis.loop_timing}</p>
                    </div>
                  )}
                  {analysis.payoff_moment && (
                    <div>
                      <p className="text-xs font-semibold text-[#909296] mb-1">Momento de payoff</p>
                      <p className="text-xs text-[#C1C2C5]">{analysis.payoff_moment}</p>
                    </div>
                  )}
                </div>
              )}

              {analysis.pattern_interrupts && analysis.pattern_interrupts.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#909296] mb-1.5">Pattern interrupts</p>
                  <div className="space-y-1">
                    {analysis.pattern_interrupts.map((p, i) => (
                      <p key={i} className="text-xs text-amber-300 italic">"{p}"</p>
                    ))}
                  </div>
                </div>
              )}

              {analysis.key_phrases?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#909296] mb-1.5">Frases clave</p>
                  <div className="space-y-1">
                    {analysis.key_phrases.map((p, i) => (
                      <p key={i} className="text-xs text-[#5c7cfa] italic">"{p}"</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-[#909296] mb-2">Guión completo</p>
            <div className="bg-[#25262B] rounded-xl px-4 py-3 text-sm text-[#C1C2C5] leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
              {script.script_content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function ReferentesPage() {
  const [scripts, setScripts] = useState<ReferenceScript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reference-scripts')
      .then((r) => r.json())
      .then((d) => setScripts(d.scripts || []))
      .finally(() => setLoading(false));
  }, []);

  const handleAdded = (script: ReferenceScript) => {
    setScripts((prev) => [script, ...prev]);
  };

  const handleDelete = (id: string) => {
    setScripts((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[240px]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Guiones Referentes</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Pega guiones ganadores · Claude los analiza · El wizard los usa como inspiración
              </p>
            </div>
            <div className="ml-auto">
              <span className="text-sm text-[#5C5F66]">
                {scripts.length} guión{scripts.length !== 1 ? 'es' : ''} en tu biblioteca
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-5 max-w-3xl">
          {/* Info banner */}
          <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl px-5 py-4">
            <div className="flex items-start gap-3">
              <Sparkles size={16} className="text-violet-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-[#C1C2C5] space-y-1">
                <p>
                  <span className="text-white font-medium">Cómo funciona:</span> Transcribe o pega el guión de un video de Instagram (u otra red) que haya tenido buen engagement. Claude detecta automáticamente el tipo de gancho, el framework, por qué funciona y los triggers psicológicos que usa.
                </p>
                <p className="text-[#5C5F66]">
                  Cuando generes guiones en el wizard, activa "Usar referentes" para que la IA se inspire en el estilo y estructura de estos videos ganadores.
                </p>
              </div>
            </div>
          </div>

          {/* Add form */}
          <AddScriptForm onAdded={handleAdded} />

          {/* Script list */}
          {loading ? (
            <div className="flex items-center justify-center py-16 text-[#5C5F66]">
              <Loader2 size={20} className="animate-spin mr-2" />
              Cargando...
            </div>
          ) : scripts.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-8 text-center">
              <BookOpen size={32} className="text-[#2C2E33] mx-auto mb-3" />
              <p className="text-[var(--text-secondary)] font-medium">Tu biblioteca está vacía</p>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Añade el primer guión ganador usando el formulario de arriba
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {scripts.map((s) => (
                <ScriptCard key={s.id} script={s} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
