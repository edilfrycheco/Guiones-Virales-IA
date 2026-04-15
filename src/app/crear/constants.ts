import type { Framework, HookType, Niche, Platform, ScriptLength, Tone } from '@/lib/viral-frameworks';

export const HOOK_TYPE_LABELS: Record<HookType, string> = {
  curiosidad: '🔍 Curiosidad',
  controversia: '🔥 Controversia',
  pregunta: '❓ Pregunta',
  declaracion_impactante: '💥 Declaración Impactante',
  pattern_interrupt: '⚡ Pattern Interrupt',
  mito: '🚫 Mito',
  historia: '📖 Historia',
  dato_sorprendente: '📊 Dato Sorprendente',
  reto: '🎯 Reto',
  confesion: '💬 Confesión',
};

export const HOOK_TYPE_DESCRIPTIONS: Record<HookType, string> = {
  curiosidad: 'Crea un gap de información que el espectador necesita cerrar',
  controversia: 'Genera reacción emocional fuerte — a favor o en contra',
  pregunta: 'Hace al espectador reflexionar sobre sí mismo o su situación',
  declaracion_impactante: 'Una afirmación poderosa que detiene el scroll instantáneamente',
  pattern_interrupt: 'Rompe el patrón del scroll con algo inesperado',
  mito: 'Desafía creencias establecidas — genera debate y shares',
  historia: 'Conecta emocionalmente desde el primer segundo',
  dato_sorprendente: 'Un número o hecho que genera credibilidad inmediata',
  reto: 'Activa la mentalidad de desafío y superación',
  confesion: 'Vulnerabilidad estratégica que genera confianza y conexión',
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: '📸 Instagram',
  tiktok: '🎵 TikTok',
  youtube_shorts: '▶️ YouTube Shorts',
};

export const TONE_LABELS: Record<Tone, string> = {
  casual: '😎 Casual',
  energetico: '⚡ Energético',
  serio: '📐 Serio',
  inspirador: '✨ Inspirador',
  humoristico: '😄 Humorístico',
  educativo: '🎓 Educativo',
};

export const NICHE_LABELS: Record<Niche, string> = {
  negocios: '💼 Negocios',
  fitness: '💪 Fitness',
  finanzas: '💰 Finanzas',
  tecnologia: '🤖 Tecnología',
  lifestyle: '🌿 Lifestyle',
  educacion: '📚 Educación',
  marketing: '📣 Marketing',
  desarrollo_personal: '🧠 Des. Personal',
  cocina: '👨‍🍳 Cocina',
  viajes: '✈️ Viajes',
  moda: '👗 Moda',
  relaciones: '❤️ Relaciones',
  otro: '• Otro',
};

export const LENGTH_LABELS: Record<ScriptLength, string> = {
  corto: '⚡ Corto (15s)',
  medio: '📊 Medio (30s)',
  largo: '📝 Largo (60s)',
};

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  PAS: 'PAS',
  AIDA: 'AIDA',
  BAB: 'BAB',
  HRAS: 'HRAS',
  OPEN_LOOP: 'Open Loop',
  STORYTELLING: 'Storytelling',
};

export const FRAMEWORK_DESCRIPTIONS: Record<Framework, string> = {
  PAS: 'Problema → Agitación → Solución',
  AIDA: 'Atención → Interés → Deseo → Acción',
  BAB: 'Before → After → Bridge',
  HRAS: 'Hook → Retención → Argumento → Salida',
  OPEN_LOOP: 'Bucle Abierto con Curiosidad Apilada',
  STORYTELLING: 'Narrativa Personal',
};

export const HUMANIZER_REGION_LABELS: Record<string, string> = {
  neutro: '🌎 Neutro',
  mexico: '🇲🇽 México',
  espana: '🇪🇸 España',
  argentina: '🇦🇷 Argentina',
  colombia: '🇨🇴 Colombia',
};

export const HUMANIZER_NIVEL_LABELS: Record<string, string> = {
  sutil: 'Sutil',
  moderado: 'Moderado',
  agresivo: 'Agresivo',
};

export const HUMANIZER_PERSONALIDAD_LABELS: Record<string, string> = {
  directo: '⚡ Directo',
  reflexivo: '🤔 Reflexivo',
  sarcastico: '😏 Sarcástico',
  empatico: '❤️ Empático',
};
