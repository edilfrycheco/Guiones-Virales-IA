'use client';

interface ScoreCardProps {
  label: string;
  score: number;
  feedback?: string;
  mejora?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excelente';
  if (score >= 75) return 'Muy bueno';
  if (score >= 60) return 'Bueno';
  if (score >= 40) return 'Mejorable';
  return 'Necesita trabajo';
}

export default function ScoreCard({ label, score, feedback, mejora }: ScoreCardProps) {
  const color = getScoreColor(score);

  return (
    <div className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-4 animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">{getScoreLabel(score)}</span>
          <span className="text-lg font-bold text-white">{score}</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${score}%`, '--score-width': `${score}%` } as React.CSSProperties}
        />
      </div>

      {feedback && (
        <p className="text-xs text-[var(--text-secondary)] mb-1">
          <span className="text-green-400">+</span> {feedback}
        </p>
      )}
      {mejora && (
        <p className="text-xs text-[var(--text-muted)]">
          <span className="text-amber-400">→</span> {mejora}
        </p>
      )}
    </div>
  );
}

interface TotalScoreProps {
  score: number;
}

export function TotalScore({ score }: TotalScoreProps) {
  const color = score >= 80 ? 'from-green-500 to-emerald-600'
    : score >= 60 ? 'from-yellow-500 to-amber-600'
    : score >= 40 ? 'from-orange-500 to-red-500'
    : 'from-red-500 to-red-700';

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
        <div className="w-24 h-24 rounded-full bg-[var(--bg-card)] flex items-center justify-center">
          <span className="text-3xl font-bold text-white">{score}</span>
        </div>
      </div>
      <p className="text-sm text-[var(--text-muted)] mt-3">Puntuación de Viralidad</p>
      <p className="text-lg font-semibold text-white">{getScoreLabel(score)}</p>
    </div>
  );
}
