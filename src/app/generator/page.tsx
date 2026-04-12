'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ScriptOutput from '@/components/ScriptOutput';
import { Wand2, Settings2 } from 'lucide-react';
import type { ScriptConfig, Platform, Framework, HookType, Tone, Niche, ScriptLength } from '@/lib/viral-frameworks';
import type { HumanizerConfig } from '@/lib/humanizer';

export default function GeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [model, setModel] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Script config
  const [tema, setTema] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [framework, setFramework] = useState<Framework>('PAS');
  const [hookType, setHookType] = useState<HookType>('curiosidad');
  const [tone, setTone] = useState<Tone>('casual');
  const [niche, setNiche] = useState<Niche>('marketing');
  const [length, setLength] = useState<ScriptLength>('medio');
  const [contexto, setContexto] = useState('');
  const [audiencia, setAudiencia] = useState('');
  const [incluirCta, setIncluirCta] = useState(true);

  // Humanizer config
  const [nivel, setNivel] = useState<'sutil' | 'moderado' | 'agresivo'>('moderado');
  const [regionalismos, setRegionalismos] = useState<'neutro' | 'mexico' | 'espana' | 'argentina' | 'colombia'>('neutro');
  const [personalidad, setPersonalidad] = useState<'directo' | 'reflexivo' | 'sarcastico' | 'empatico'>('directo');

  const handleGenerate = async () => {
    if (!tema.trim()) return;

    setIsLoading(true);
    setOutput('');

    const scriptConfig: ScriptConfig = {
      tema,
      platform,
      framework,
      hookType,
      tone,
      niche,
      length,
      contexto_adicional: contexto || undefined,
      audiencia_objetivo: audiencia || undefined,
      incluir_cta: incluirCta,
    };

    const humanizerConfig: HumanizerConfig = { nivel, regionalismos, personalidad };

    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptConfig, humanizerConfig }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.script);
      setModel(data.model);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[240px]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Wand2 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Generador de Guiones</h1>
              <p className="text-sm text-[var(--text-muted)]">Crea guiones virales con frameworks probados y escritura humanizada</p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 p-8">
          {/* Config Panel */}
          <div className="w-[380px] flex-shrink-0 space-y-5">
            {/* Tema */}
            <div>
              <label>Tema del guión *</label>
              <input
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ej: Cómo ganar dinero con IA en 2026"
                className="w-full"
              />
            </div>

            {/* Row: Platform + Length */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label>Plataforma</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
                  <option value="instagram">Instagram Reels</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube_shorts">YouTube Shorts</option>
                </select>
              </div>
              <div>
                <label>Duración</label>
                <select value={length} onChange={(e) => setLength(e.target.value as ScriptLength)}>
                  <option value="corto">Corto (~15s)</option>
                  <option value="medio">Medio (~30s)</option>
                  <option value="largo">Largo (~60s)</option>
                </select>
              </div>
            </div>

            {/* Framework */}
            <div>
              <label>Framework</label>
              <select value={framework} onChange={(e) => setFramework(e.target.value as Framework)}>
                <option value="PAS">PAS — Problema, Agitación, Solución</option>
                <option value="AIDA">AIDA — Atención, Interés, Deseo, Acción</option>
                <option value="BAB">BAB — Before, After, Bridge</option>
                <option value="HRAS">HRAS — Método Victor Heras</option>
                <option value="OPEN_LOOP">Open Loop — Curiosidad Apilada</option>
                <option value="STORYTELLING">Storytelling — Narrativa Personal</option>
              </select>
            </div>

            {/* Row: Hook + Tone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label>Tipo de gancho</label>
                <select value={hookType} onChange={(e) => setHookType(e.target.value as HookType)}>
                  <option value="curiosidad">Curiosidad</option>
                  <option value="controversia">Controversia</option>
                  <option value="pregunta">Pregunta</option>
                  <option value="declaracion_impactante">Declaración impactante</option>
                  <option value="pattern_interrupt">Pattern Interrupt</option>
                  <option value="mito">Rompe-mitos</option>
                  <option value="historia">Historia</option>
                  <option value="dato_sorprendente">Dato sorprendente</option>
                  <option value="reto">Reto</option>
                  <option value="confesion">Confesión</option>
                </select>
              </div>
              <div>
                <label>Tono</label>
                <select value={tone} onChange={(e) => setTone(e.target.value as Tone)}>
                  <option value="casual">Casual</option>
                  <option value="energetico">Energético</option>
                  <option value="serio">Serio</option>
                  <option value="inspirador">Inspirador</option>
                  <option value="humoristico">Humorístico</option>
                  <option value="educativo">Educativo</option>
                </select>
              </div>
            </div>

            {/* Niche */}
            <div>
              <label>Nicho</label>
              <select value={niche} onChange={(e) => setNiche(e.target.value as Niche)}>
                <option value="negocios">Negocios</option>
                <option value="fitness">Fitness</option>
                <option value="finanzas">Finanzas</option>
                <option value="tecnologia">Tecnología</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="educacion">Educación</option>
                <option value="marketing">Marketing</option>
                <option value="desarrollo_personal">Desarrollo Personal</option>
                <option value="cocina">Cocina</option>
                <option value="viajes">Viajes</option>
                <option value="moda">Moda</option>
                <option value="relaciones">Relaciones</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* CTA toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIncluirCta(!incluirCta)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  incluirCta ? 'bg-indigo-600' : 'bg-[var(--border-color)]'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    incluirCta ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className="text-sm text-[var(--text-secondary)]">Incluir llamada a la acción</span>
            </div>

            {/* Advanced Settings Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-indigo-400 transition-colors w-full"
            >
              <Settings2 size={14} />
              {showAdvanced ? 'Ocultar' : 'Mostrar'} opciones avanzadas
            </button>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="space-y-4 p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl animate-slide-up">
                <h4 className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Motor de Humanización
                </h4>

                <div>
                  <label>Nivel de humanización</label>
                  <select value={nivel} onChange={(e) => setNivel(e.target.value as typeof nivel)}>
                    <option value="sutil">Sutil — Profesional pero natural</option>
                    <option value="moderado">Moderado — Como un creador experimentado</option>
                    <option value="agresivo">Agresivo — Completamente espontáneo</option>
                  </select>
                </div>

                <div>
                  <label>Regionalismos</label>
                  <select value={regionalismos} onChange={(e) => setRegionalismos(e.target.value as typeof regionalismos)}>
                    <option value="neutro">Español neutro</option>
                    <option value="mexico">México</option>
                    <option value="espana">España</option>
                    <option value="argentina">Argentina</option>
                    <option value="colombia">Colombia</option>
                  </select>
                </div>

                <div>
                  <label>Personalidad</label>
                  <select value={personalidad} onChange={(e) => setPersonalidad(e.target.value as typeof personalidad)}>
                    <option value="directo">Directo — Al grano, sin rodeos</option>
                    <option value="reflexivo">Reflexivo — Piensa en voz alta</option>
                    <option value="sarcastico">Sarcástico — Humor ácido</option>
                    <option value="empatico">Empático — Conecta emocionalmente</option>
                  </select>
                </div>

                <div>
                  <label>Audiencia objetivo (opcional)</label>
                  <input
                    type="text"
                    value={audiencia}
                    onChange={(e) => setAudiencia(e.target.value)}
                    placeholder="Ej: Emprendedores de 25-35 años"
                  />
                </div>

                <div>
                  <label>Contexto adicional (opcional)</label>
                  <textarea
                    value={contexto}
                    onChange={(e) => setContexto(e.target.value)}
                    placeholder="Información extra, datos, ángulo específico..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!tema.trim() || isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              <Wand2 size={18} />
              {isLoading ? 'Generando...' : 'Generar Guión Viral'}
            </button>
          </div>

          {/* Output Panel */}
          <div className="flex-1 min-w-0">
            <ScriptOutput
              content={output}
              isLoading={isLoading}
              model={model}
              onRegenerate={output ? handleGenerate : undefined}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
