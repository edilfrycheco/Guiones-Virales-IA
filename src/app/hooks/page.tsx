'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ScriptOutput from '@/components/ScriptOutput';
import { Zap } from 'lucide-react';
import type { Platform, HookType, Tone, Niche } from '@/lib/viral-frameworks';
import type { HumanizerConfig } from '@/lib/humanizer';

export default function HooksPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [model, setModel] = useState('');

  const [tema, setTema] = useState('');
  const [hookType, setHookType] = useState<HookType>('curiosidad');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [tone, setTone] = useState<Tone>('casual');
  const [niche, setNiche] = useState<Niche>('marketing');
  const [cantidad, setCantidad] = useState(5);

  const [nivel, setNivel] = useState<'sutil' | 'moderado' | 'agresivo'>('moderado');
  const [regionalismos, setRegionalismos] = useState<'neutro' | 'mexico' | 'espana' | 'argentina' | 'colombia'>('neutro');

  const handleGenerate = async () => {
    if (!tema.trim()) return;

    setIsLoading(true);
    setOutput('');

    const hookConfig = { tema, hookType, platform, tone, niche, cantidad };
    const humanizerConfig: HumanizerConfig = { nivel, regionalismos, personalidad: 'directo' };

    try {
      const res = await fetch('/api/generate-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hookConfig, humanizerConfig }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.hooks);
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Generador de Ganchos</h1>
              <p className="text-sm text-[var(--text-muted)]">Crea hooks virales que detengan el scroll en 2 segundos</p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 p-8">
          {/* Config Panel */}
          <div className="w-[380px] flex-shrink-0 space-y-5">
            <div>
              <label>Tema *</label>
              <input
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ej: Productividad, marca personal, inversiones..."
              />
            </div>

            <div>
              <label>Tipo de gancho</label>
              <select value={hookType} onChange={(e) => setHookType(e.target.value as HookType)}>
                <option value="curiosidad">Curiosidad — "Nadie te dice esto..."</option>
                <option value="controversia">Controversia — "Deja de hacer..."</option>
                <option value="pregunta">Pregunta — "¿Por qué nadie habla de...?"</option>
                <option value="declaracion_impactante">Declaración impactante</option>
                <option value="pattern_interrupt">Pattern Interrupt — "PARA."</option>
                <option value="mito">Rompe-mitos — "El mito más grande..."</option>
                <option value="historia">Historia — "Hace 6 meses..."</option>
                <option value="dato_sorprendente">Dato sorprendente — "El 90% de..."</option>
                <option value="reto">Reto — "Te reto a probar esto..."</option>
                <option value="confesion">Confesión — "Voy a ser honesto..."</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label>Plataforma</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube_shorts">YouTube Shorts</option>
                </select>
              </div>
              <div>
                <label>Cantidad</label>
                <select value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))}>
                  <option value={3}>3 ganchos</option>
                  <option value={5}>5 ganchos</option>
                  <option value={8}>8 ganchos</option>
                  <option value={10}>10 ganchos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label>Humanización</label>
                <select value={nivel} onChange={(e) => setNivel(e.target.value as typeof nivel)}>
                  <option value="sutil">Sutil</option>
                  <option value="moderado">Moderado</option>
                  <option value="agresivo">Agresivo</option>
                </select>
              </div>
              <div>
                <label>Región</label>
                <select value={regionalismos} onChange={(e) => setRegionalismos(e.target.value as typeof regionalismos)}>
                  <option value="neutro">Neutro</option>
                  <option value="mexico">México</option>
                  <option value="espana">España</option>
                  <option value="argentina">Argentina</option>
                  <option value="colombia">Colombia</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!tema.trim() || isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2"
            >
              <Zap size={18} />
              {isLoading ? 'Generando...' : `Generar ${cantidad} Ganchos`}
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
