'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { WizardState } from './types';
import { FRAMEWORK_LABELS } from './constants';

const AI_EDIT_PRESETS = [
  {
    label: '✂️ Más corto',
    instruction: 'Hazlo más corto, elimina lo que sobre sin perder el impacto principal',
  },
  {
    label: '🔥 Más agresivo',
    instruction: 'Hazlo más agresivo e impactante, sube la energía y el nivel de urgencia',
  },
  {
    label: '😌 Más natural',
    instruction: 'Hazlo sonar más natural y conversacional, menos como IA, más como humano',
  },
  {
    label: '💥 Mejor gancho',
    instruction:
      'Reescribe solo el gancho inicial (primeros 2-3 segundos) para que sea más irresistible',
  },
  {
    label: '📣 Mejor CTA',
    instruction: 'Mejora la llamada a la acción al final para que sea más motivante y concreta',
  },
  {
    label: '🎭 Más historia',
    instruction: 'Añade más elementos de narrativa personal y conexión emocional',
  },
];

interface Props {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  onBack: () => void;
  onReset: () => void;
}

type EditMode = 'none' | 'ai' | 'manual';

export default function StepRevision({ state, update, onBack, onReset }: Props) {
  const router = useRouter();
  const [editMode, setEditMode] = useState<EditMode>('none');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedScript =
    state.selectedScriptIndex !== null
      ? state.generatedScripts[state.selectedScriptIndex]
      : null;

  const currentContent = state.editedScript || selectedScript?.content || '';
  const isEdited =
    state.editedScript && selectedScript && state.editedScript !== selectedScript.content;

  const applyAiEdit = async (instruction: string) => {
    if (!instruction.trim()) return;
    setEditLoading(true);
    setEditError('');
    try {
      const res = await fetch('/api/wizard/edit-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: currentContent,
          instruction,
          humanizer: state.humanizer,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      update({ editedScript: data.script, editInstruction: '' });
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Error al editar');
    } finally {
      setEditLoading(false);
    }
  };

  const saveScript = async () => {
    if (!selectedScript || saved) return;
    setSaveLoading(true);
    try {
      const selectedHook =
        state.selectedHookIndex !== null ? state.generatedHooks[state.selectedHookIndex] : null;

      // Mark hook as used
      if (selectedHook) {
        await fetch('/api/hooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tema: state.tema,
            hook_type: state.hookType,
            hook_text: selectedHook.text,
            platform: state.platform,
            tone: state.tone,
            niche: state.niche,
            is_favorite: false,
          }),
        });
      }

      // Save approved script
      await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: state.tema,
          framework: selectedScript.framework,
          hook_type: state.hookType,
          platform: state.platform,
          tone: state.tone,
          niche: state.niche,
          length: state.length,
          script_content: currentContent,
          is_approved: true,
        }),
      });

      setSaved(true);
    } catch {
      // Silent fail when not logged in — data still lives in localStorage
    } finally {
      setSaveLoading(false);
    }
  };

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const analyzeScript = () => {
    try {
      sessionStorage.setItem('analyze_script', currentContent);
    } catch {}
    router.push('/analyzer');
  };

  if (!selectedScript) {
    return (
      <div className="text-center py-16 text-[#909296]">
        No hay guión seleccionado.{' '}
        <button onClick={onBack} className="text-[#5c7cfa] hover:underline">
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Script display / editor */}
      <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-semibold">Tu guión</h2>
            <span className="text-xs bg-[#5c7cfa]/20 text-[#5c7cfa] px-2 py-1 rounded-full font-medium">
              {FRAMEWORK_LABELS[selectedScript.framework]}
            </span>
            {isEdited && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                Editado
              </span>
            )}
          </div>
          <button
            onClick={copyScript}
            className="text-sm text-[#909296] hover:text-white border border-[#2C2E33] hover:border-[#5c7cfa] px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? '✓ Copiado' : '📋 Copiar'}
          </button>
        </div>

        {editMode === 'manual' ? (
          <textarea
            value={currentContent}
            onChange={(e) => update({ editedScript: e.target.value })}
            className="w-full min-h-[420px] bg-[#25262B] border border-[#5c7cfa]/40 rounded-xl px-4 py-4 text-sm text-[#C1C2C5] focus:border-[#5c7cfa] focus:outline-none resize-y leading-relaxed font-mono"
          />
        ) : (
          <div className="bg-[#25262B] rounded-xl px-4 py-4 text-sm text-[#C1C2C5] leading-relaxed whitespace-pre-wrap">
            {currentContent}
          </div>
        )}
      </div>

      {/* Edit section */}
      <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <h3 className="font-semibold">Editar guión</h3>
          <button
            onClick={() => setEditMode(editMode === 'ai' ? 'none' : 'ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              editMode === 'ai'
                ? 'bg-[#5c7cfa] text-white'
                : 'bg-[#25262B] border border-[#2C2E33] text-[#909296] hover:text-white'
            }`}
          >
            ✨ Editar con IA
          </button>
          <button
            onClick={() => setEditMode(editMode === 'manual' ? 'none' : 'manual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              editMode === 'manual'
                ? 'bg-[#5c7cfa] text-white'
                : 'bg-[#25262B] border border-[#2C2E33] text-[#909296] hover:text-white'
            }`}
          >
            ✏️ Editar manual
          </button>
        </div>

        {editMode === 'ai' && (
          <div>
            {/* Quick preset buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {AI_EDIT_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyAiEdit(preset.instruction)}
                  disabled={editLoading}
                  className="py-2 px-3 bg-[#25262B] border border-[#2C2E33] hover:border-[#5c7cfa]/60 hover:text-white rounded-lg text-xs text-[#C1C2C5] transition-all disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {/* Custom instruction */}
            <div className="flex gap-2">
              <input
                type="text"
                value={state.editInstruction}
                onChange={(e) => update({ editInstruction: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && applyAiEdit(state.editInstruction)}
                placeholder="Instrucción personalizada... (Ej: cámbialo a segunda persona del plural)"
                className="flex-1 bg-[#25262B] border border-[#2C2E33] rounded-lg px-3 py-2 text-sm text-white placeholder-[#5C5F66] focus:border-[#5c7cfa] focus:outline-none"
              />
              <button
                onClick={() => applyAiEdit(state.editInstruction)}
                disabled={editLoading || !state.editInstruction.trim()}
                className="px-4 py-2 bg-[#5c7cfa] hover:bg-[#4c6ef5] disabled:bg-[#2C2E33] disabled:text-[#5C5F66] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 min-w-[52px] justify-center"
              >
                {editLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  '→'
                )}
              </button>
            </div>
            {editError && <p className="mt-2 text-sm text-red-400">{editError}</p>}
          </div>
        )}

        {editMode === 'manual' && (
          <p className="text-sm text-[#909296]">
            Edita el guión directamente arriba. Los cambios se guardan automáticamente en la
            sesión.
          </p>
        )}

        {editMode === 'none' && (
          <p className="text-sm text-[#5C5F66]">
            Elige un modo de edición o continúa con el guión tal como está.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="bg-[#1A1B1E] border border-[#2C2E33] rounded-2xl p-6">
        <h3 className="font-semibold mb-4">¿Qué quieres hacer?</h3>
        <div className="grid grid-cols-3 gap-3">
          {/* Save */}
          <button
            onClick={saveScript}
            disabled={saveLoading || saved}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
              saved
                ? 'border-green-500/50 bg-green-500/10 text-green-400'
                : 'border-[#2C2E33] bg-[#25262B] hover:border-green-500/40 text-[#C1C2C5] hover:text-white'
            }`}
          >
            <span className="text-2xl">{saved ? '✅' : '💾'}</span>
            <span className="text-sm font-medium">
              {saved ? 'Guardado' : saveLoading ? 'Guardando...' : 'Aprobar y Guardar'}
            </span>
            <span className="text-xs text-[#5C5F66] text-center leading-snug">
              Guarda gancho y guión aprobados para mejorar tu perfil de IA
            </span>
          </button>

          {/* Analyze */}
          <button
            onClick={analyzeScript}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#2C2E33] bg-[#25262B] hover:border-[#5c7cfa]/50 text-[#C1C2C5] hover:text-white transition-all"
          >
            <span className="text-2xl">📊</span>
            <span className="text-sm font-medium">Analizar</span>
            <span className="text-xs text-[#5C5F66] text-center leading-snug">
              Puntuación detallada en 7 categorías
            </span>
          </button>

          {/* New */}
          <button
            onClick={onReset}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#2C2E33] bg-[#25262B] hover:border-orange-500/40 text-[#C1C2C5] hover:text-orange-400 transition-all"
          >
            <span className="text-2xl">🔄</span>
            <span className="text-sm font-medium">Nuevo guión</span>
            <span className="text-xs text-[#5C5F66] text-center leading-snug">
              Empezar un nuevo flujo desde cero
            </span>
          </button>
        </div>
      </div>

      {/* Back nav */}
      <button
        onClick={onBack}
        className="px-6 py-3 border border-[#2C2E33] hover:border-[#5c7cfa] text-[#909296] hover:text-white rounded-xl transition-colors"
      >
        ← Volver a Guiones
      </button>
    </div>
  );
}
