'use client';

import { useState } from 'react';
import { Copy, Check, RotateCcw, Download, Sparkles } from 'lucide-react';

interface ScriptOutputProps {
  content: string;
  isLoading: boolean;
  model?: string;
  onRegenerate?: () => void;
}

export default function ScriptOutput({ content, isLoading, model, onRegenerate }: ScriptOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guion-viral-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-8">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-indigo-500/30 rounded-full animate-spin border-t-indigo-500" />
            <Sparkles size={20} className="text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Generando tu guión viral...</p>
            <p className="text-[var(--text-muted)] text-sm mt-1">Aplicando frameworks y humanización</p>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-8">
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center">
            <Sparkles size={28} className="text-[var(--text-muted)]" />
          </div>
          <div>
            <p className="text-[var(--text-secondary)] font-medium">Tu guión aparecerá aquí</p>
            <p className="text-[var(--text-muted)] text-sm mt-1">Configura las opciones y haz clic en Generar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
          <span className="text-sm text-[var(--text-secondary)]">
            Guión generado
            {model && model !== 'demo-mode' && (
              <span className="text-[var(--text-muted)] ml-2">({model})</span>
            )}
            {model === 'demo-mode' && (
              <span className="text-amber-400/70 ml-2">(modo demo)</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-white transition-all"
            title="Copiar"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-white transition-all"
            title="Descargar"
          >
            <Download size={16} />
          </button>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-white transition-all"
              title="Regenerar"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 animate-fade-in">
        <div className="prose prose-invert max-w-none">
          {content.split('\n').map((line, i) => {
            // Detectar secciones del guión
            if (line.startsWith('🎯') || line.startsWith('📝') || line.startsWith('🚀') || line.startsWith('💡') || line.startsWith('⚠️')) {
              return (
                <h3 key={i} className="text-indigo-400 font-semibold text-[15px] mt-6 mb-2 first:mt-0">
                  {line}
                </h3>
              );
            }
            if (line.trim() === '') {
              return <div key={i} className="h-3" />;
            }
            return (
              <p key={i} className="text-[var(--text-primary)] text-[14px] leading-relaxed mb-1">
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
