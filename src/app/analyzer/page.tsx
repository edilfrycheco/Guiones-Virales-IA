'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ScoreCard, { TotalScore } from '@/components/ScoreCard';
import { BarChart3, Search, AlertTriangle } from 'lucide-react';

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

export default function AnalyzerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  const handleAnalyze = async () => {
    if (!script.trim()) return;

    setIsLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch('/api/analyze-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
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
              <p className="text-sm text-[var(--text-muted)]">Evalúa el potencial viral de tu guión con puntuación detallada</p>
            </div>
          </div>
        </div>

        <div className="flex gap-6 p-8">
          {/* Input Panel */}
          <div className="w-[450px] flex-shrink-0 space-y-5">
            <div>
              <label>Pega tu guión aquí *</label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Pega aquí el guión que quieres analizar...&#10;&#10;Ejemplo:&#10;¿Sabías que el 90% de los emprendedores fracasan por esta razón?&#10;&#10;Mira, te voy a contar algo que a mí me costó 2 años aprender..."
                rows={16}
                className="min-h-[300px]"
              />
              <p className="text-xs text-[var(--text-muted)] mt-2">
                {script.length} caracteres · ~{Math.round(script.split(/\s+/).filter(Boolean).length)} palabras · ~{Math.round(script.split(/\s+/).filter(Boolean).length / 2.5)}s de video
              </p>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!script.trim() || isLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <Search size={18} />
              {isLoading ? 'Analizando...' : 'Analizar Guión'}
            </button>
          </div>

          {/* Results Panel */}
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
                    <p className="text-[var(--text-muted)] text-sm mt-1">Evaluando gancho, retención, estructura y viralidad</p>
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
                    <p className="text-[var(--text-muted)] text-sm mt-1">Pega un guión y analiza su potencial viral</p>
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

                {/* Raw analysis fallback */}
                {analysis.parse_error && analysis.raw_analysis && (
                  <div className="bg-[var(--bg-card)] border border-amber-500/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-amber-400 mb-3">
                      <AlertTriangle size={16} />
                      <span className="text-sm font-medium">Análisis en formato texto</span>
                    </div>
                    <pre className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{analysis.raw_analysis}</pre>
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

                {/* Top Mejoras */}
                {analysis.mejoras_top_3?.length > 0 && (
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Top 3 Mejoras</h3>
                    <div className="space-y-2">
                      {analysis.mejoras_top_3.map((mejora, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </span>
                          <p className="text-sm text-[var(--text-primary)]">{mejora}</p>
                        </div>
                      ))}
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
