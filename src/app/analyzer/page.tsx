'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ScoreCard, { TotalScore } from '@/components/ScoreCard';
import { BarChart3, Search, AlertTriangle, Check, X, Sparkles } from 'lucide-react';

interface AnalysisCategory {
  nombre: string;
  puntuacion: number;
  feedback: string;
  mejora: string;
}

interface AnalysisData {
  puntuacion_total: number;
  categorias: AnalysisCategory[];
  veredicto: string;
  mejoras_top_3: string[];
  raw_analysis?: string;
  parse_error?: boolean;
}

const DEFAULT_HUMANIZER = { nivel: 'moderado', regionalismos: 'neutro', personalidad: 'directo' };

export default function AnalyzerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  // Improvement state
  const [applyingIdx, setApplyingIdx] = useState<number | null>(null);
  const [improvedScript, setImprovedScript] = useState<string | null>(null);
  const [improvedLabel, setImprovedLabel] = useState('');
  const [applyError, setApplyError] = useState('');
  const [reanalyzing, setReanalyzing] = useState(false);
  const [copied, setCopied] = useState<'original' | 'improved' | null>(null);

  // Pick up script passed from the wizard via sessionStorage
  useEffect(() => {
    try {
      const fromWizard = sessionStorage.getItem('analyze_script');
      if (fromWizard) {
        setScript(fromWizard);
        sessionStorage.removeItem('analyze_script');
      }
    } catch {}
  }, []);

  const handleAnalyze = async (scriptToAnalyze = script) => {
    if (!scriptToAnalyze.trim()) return;
    setIsLoading(true);
    setAnalysis(null);
    setImprovedScript(null);
    setApplyError('');
    try {
      const res = await fetch('/api/analyze-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scriptToAnalyze }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (error) {
      setAnalysis({
        puntuacion_total: 0,
        categorias: [],
        veredicto: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        mejoras_top_3: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyMejora = async (mejora: string, idx: number) => {
    setApplyingIdx(idx);
    setImprovedScript(null);
    setApplyError('');
    setImprovedLabel(mejora);
    try {
      const res = await fetch('/api/wizard/edit-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          instruction: mejora,
          humanizer: DEFAULT_HUMANIZER,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setImprovedScript(data.script);
    } catch (e) {
      setApplyError(e instanceof Error ? e.message : 'Error al aplicar mejora');
    } finally {
      setApplyingIdx(null);
    }
  };

  const acceptImproved = async () => {
    if (!improvedScript) return;
    setScript(improvedScript);
    setImprovedScript(null);
    // Re-analyze the improved version
    setReanalyzing(true);
    await handleAnalyze(improvedScript);
    setReanalyzing(false);
  };

  const discardImproved = () => {
    setImprovedScript(null);
    setApplyError('');
  };

  const copyText = async (text: string, which: 'original' | 'improved') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };

  const wordCount = script.split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[240px]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Analizador de Guiones</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Evalúa el potencial viral · Aplica mejoras con IA · Compara versiones
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 p-8">
          {/* Left: Input + Comparison */}
          <div className="w-[450px] flex-shrink-0 space-y-5">
            {/* Script input */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                Pega tu guión aquí *
              </label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Pega aquí el guión que quieres analizar..."
                rows={14}
                className="w-full bg-[#25262B] border border-[#2C2E33] rounded-xl px-4 py-3 text-sm text-white placeholder-[#5C5F66] focus:border-[#5c7cfa] focus:outline-none resize-none leading-relaxed"
              />
              <p className="text-xs text-[var(--text-muted)] mt-2">
                {script.length} caracteres · ~{wordCount} palabras · ~{Math.round(wordCount / 2.5)}s de video
              </p>
            </div>

            <button
              onClick={() => handleAnalyze()}
              disabled={!script.trim() || isLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <Search size={18} />
              {isLoading || reanalyzing ? 'Analizando...' : 'Analizar Guión'}
            </button>

            {/* Comparison panel — appears when a mejora is applied */}
            {(improvedScript || applyingIdx !== null || applyError) && (
              <div className="bg-[#1A1B1E] border border-[#5c7cfa]/30 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#2C2E33] bg-[#5c7cfa]/5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#5c7cfa]" />
                    <span className="text-sm font-semibold text-white">Versión mejorada</span>
                  </div>
                  <button onClick={discardImproved} className="text-[#5C5F66] hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>

                {applyingIdx !== null && (
                  <div className="flex items-center justify-center gap-3 py-10 text-[#909296]">
                    <span className="w-5 h-5 border-2 border-[#5c7cfa]/30 border-t-[#5c7cfa] rounded-full animate-spin" />
                    <span className="text-sm">Aplicando mejora...</span>
                  </div>
                )}

                {applyError && (
                  <p className="px-4 py-4 text-sm text-red-400">{applyError}</p>
                )}

                {improvedScript && (
                  <>
                    <p className="px-4 pt-3 pb-1 text-xs text-[#5c7cfa] italic line-clamp-2">
                      "{improvedLabel}"
                    </p>
                    <div className="px-4 pb-3">
                      <div className="max-h-64 overflow-y-auto text-sm text-[#C1C2C5] leading-relaxed whitespace-pre-wrap bg-[#25262B] rounded-lg px-3 py-3 mt-2">
                        {improvedScript}
                      </div>
                    </div>
                    <div className="flex gap-2 px-4 pb-4">
                      <button
                        onClick={() => copyText(improvedScript, 'improved')}
                        className="flex-1 py-2 border border-[#2C2E33] rounded-lg text-xs text-[#909296] hover:text-white hover:border-[#5c7cfa] transition-colors"
                      >
                        {copied === 'improved' ? '✓ Copiado' : '📋 Copiar'}
                      </button>
                      <button
                        onClick={acceptImproved}
                        className="flex-1 py-2 bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check size={13} />
                        Usar y re-analizar
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div className="flex-1 min-w-0">
            {isLoading && (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-8">
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <div className="relative">
                    <div className="w-12 h-12 border-2 border-emerald-500/30 rounded-full animate-spin border-t-emerald-500" />
                    <BarChart3 size={20} className="text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">Analizando tu guión...</p>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                      Evaluando gancho, retención, estructura y viralidad
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !analysis && (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-8">
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                    <BarChart3 size={28} className="text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)] font-medium">Los resultados aparecerán aquí</p>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                      Pega un guión y analiza su potencial viral
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && analysis && (
              <div className="space-y-5 animate-fade-in">
                {/* Total Score */}
                {analysis.puntuacion_total > 0 && (
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl">
                    <TotalScore score={analysis.puntuacion_total} />
                  </div>
                )}

                {/* Raw fallback */}
                {analysis.parse_error && analysis.raw_analysis && (
                  <div className="bg-[var(--bg-card)] border border-amber-500/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-amber-400 mb-3">
                      <AlertTriangle size={16} />
                      <span className="text-sm font-medium">Análisis en formato texto</span>
                    </div>
                    <pre className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
                      {analysis.raw_analysis}
                    </pre>
                  </div>
                )}

                {/* Category Scores */}
                {analysis.categorias?.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {analysis.categorias.map((cat, i) => (
                      <ScoreCard
                        key={i}
                        label={cat.nombre}
                        score={cat.puntuacion}
                        feedback={cat.feedback}
                        mejora={cat.mejora}
                      />
                    ))}
                  </div>
                )}

                {/* Veredicto */}
                {analysis.veredicto && (
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Veredicto</h3>
                    <p className="text-white">{analysis.veredicto}</p>
                  </div>
                )}

                {/* Top 3 Mejoras — now with Apply buttons */}
                {analysis.mejoras_top_3?.length > 0 && (
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
                        Top 3 Mejoras
                      </h3>
                      <span className="text-xs text-[#5C5F66]">
                        Aplica con IA y compara versiones
                      </span>
                    </div>
                    <div className="space-y-3">
                      {analysis.mejoras_top_3.map((mejora, i) => {
                        const isApplying = applyingIdx === i;
                        return (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 rounded-xl bg-[#25262B] border border-[#2C2E33]"
                          >
                            <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <p className="text-sm text-[var(--text-primary)] flex-1 leading-relaxed">
                              {mejora}
                            </p>
                            <button
                              onClick={() => applyMejora(mejora, i)}
                              disabled={isApplying || applyingIdx !== null}
                              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isApplying
                                  ? 'bg-[#5c7cfa]/20 text-[#5c7cfa] cursor-wait'
                                  : 'bg-[#5c7cfa] hover:bg-[#4c6ef5] text-white disabled:bg-[#2C2E33] disabled:text-[#5C5F66]'
                              }`}
                            >
                              {isApplying ? (
                                <>
                                  <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                                  Aplicando...
                                </>
                              ) : (
                                <>
                                  <Sparkles size={11} />
                                  Aplicar
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
