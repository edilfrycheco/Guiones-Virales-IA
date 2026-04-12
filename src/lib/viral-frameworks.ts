// Motor de frameworks virales basado en investigación de Victor Heras,
// Sandcastles.ai y las mejores prácticas de creadores top 2025-2026

export type Platform = 'instagram' | 'tiktok' | 'youtube_shorts';
export type ScriptLength = 'corto' | 'medio' | 'largo';
export type HookType =
  | 'curiosidad'
  | 'controversia'
  | 'pregunta'
  | 'declaracion_impactante'
  | 'pattern_interrupt'
  | 'mito'
  | 'historia'
  | 'dato_sorprendente'
  | 'reto'
  | 'confesion';

export type Framework = 'PAS' | 'AIDA' | 'BAB' | 'HRAS' | 'OPEN_LOOP' | 'STORYTELLING';
export type Tone = 'casual' | 'energetico' | 'serio' | 'inspirador' | 'humoristico' | 'educativo';
export type Niche =
  | 'negocios'
  | 'fitness'
  | 'finanzas'
  | 'tecnologia'
  | 'lifestyle'
  | 'educacion'
  | 'marketing'
  | 'desarrollo_personal'
  | 'cocina'
  | 'viajes'
  | 'moda'
  | 'relaciones'
  | 'otro';

export interface ScriptConfig {
  tema: string;
  platform: Platform;
  framework: Framework;
  hookType: HookType;
  tone: Tone;
  niche: Niche;
  length: ScriptLength;
  contexto_adicional?: string;
  audiencia_objetivo?: string;
  incluir_cta: boolean;
  estilo_cta?: string;
}

export interface HookConfig {
  tema: string;
  hookType: HookType;
  platform: Platform;
  tone: Tone;
  niche: Niche;
  cantidad: number;
}

export interface AnalysisResult {
  puntuacion_total: number;
  hook_score: number;
  retencion_score: number;
  cta_score: number;
  humanizacion_score: number;
  desglose: {
    categoria: string;
    puntuacion: number;
    feedback: string;
    sugerencia: string;
  }[];
  mejoras_sugeridas: string[];
}

// Fórmulas de duración por plataforma y longitud
export const DURATION_MAP: Record<Platform, Record<ScriptLength, { seconds: number; words: number }>> = {
  instagram: {
    corto: { seconds: 15, words: 40 },
    medio: { seconds: 30, words: 80 },
    largo: { seconds: 60, words: 160 },
  },
  tiktok: {
    corto: { seconds: 15, words: 40 },
    medio: { seconds: 30, words: 80 },
    largo: { seconds: 60, words: 160 },
  },
  youtube_shorts: {
    corto: { seconds: 20, words: 50 },
    medio: { seconds: 40, words: 100 },
    largo: { seconds: 58, words: 150 },
  },
};

// Plantillas de ganchos por tipo (basado en investigación de creadores virales)
export const HOOK_TEMPLATES: Record<HookType, string[]> = {
  curiosidad: [
    'Nadie te dice esto sobre {tema}...',
    'Lo que descubrí sobre {tema} me cambió todo',
    'Esto sobre {tema} debería ser ilegal saberlo',
    'El secreto de {tema} que las marcas no quieren que sepas',
    'Llevo 3 años estudiando {tema} y esto es lo que nadie cuenta',
    'Si supieras esto sobre {tema}, no dormirías tranquilo',
  ],
  controversia: [
    'Deja de hacer {tema}. En serio.',
    'Todo lo que te dijeron sobre {tema} es mentira',
    'Perdón pero {tema} está sobrevalorado y te explico por qué',
    '{tema} está arruinando tu vida y no te das cuenta',
    'La verdad incómoda sobre {tema} que todos ignoran',
    'Me van a odiar por decir esto sobre {tema}...',
  ],
  pregunta: [
    '¿Por qué nadie habla de esto sobre {tema}?',
    '¿Sabías que {tema} funciona completamente al revés?',
    '¿Todavía crees que {tema} funciona así? Déjame explicarte',
    '¿Qué pasaría si todo lo que sabes de {tema} estuviera mal?',
    '¿Te has preguntado por qué {tema} no te funciona?',
  ],
  declaracion_impactante: [
    'En 30 días cambié completamente mi {tema}',
    'Esto me generó resultados que no creía posibles con {tema}',
    'Un solo cambio en {tema} me cambió la vida',
    'Logré en 1 semana lo que otros tardan años con {tema}',
    'Acabo de descubrir algo sobre {tema} que lo cambia todo',
  ],
  pattern_interrupt: [
    'PARA. Antes de seguir scrolleando necesitas saber esto sobre {tema}',
    'Espera, espera, espera. ¿Nadie te enseñó esto de {tema}?',
    'Olvida todo lo que sabes de {tema}. Esto es diferente.',
    'No sigas haciendo scroll. Esto de {tema} te interesa.',
    'Mira, sé que vas a seguir de largo, pero si te importa {tema}...',
  ],
  mito: [
    'El mito más grande sobre {tema} que todos se creen',
    'Te vendieron una mentira con {tema}. La realidad es esta.',
    '3 mitos sobre {tema} que te están frenando',
    'El error #1 que cometes con {tema} sin darte cuenta',
    '"Tienes que hacer X para lograr {tema}" — FALSO. Te explico.',
  ],
  historia: [
    'Hace 6 meses no sabía nada de {tema}. Hoy es diferente.',
    'Te cuento lo que me pasó cuando empecé con {tema}',
    'Esta es la historia de cómo {tema} me cambió todo',
    'Perdí todo por no entender {tema}. No cometas mi error.',
    'El día que descubrí la verdad sobre {tema} fue un antes y después',
  ],
  dato_sorprendente: [
    'El 90% de las personas hace mal {tema}. ¿Eres uno de ellos?',
    'Solo el 3% sabe esto sobre {tema}',
    'Un estudio reciente reveló algo increíble sobre {tema}',
    'Este dato sobre {tema} te va a dejar con la boca abierta',
    'La estadística de {tema} que nadie quiere aceptar',
  ],
  reto: [
    'Te reto a probar esto con {tema} por 7 días',
    'Haz esto con {tema} durante 1 semana y me cuentas',
    'Si logras esto con {tema}, estás en otro nivel',
    'Intenta esto con {tema} y te aseguro que no vuelves atrás',
  ],
  confesion: [
    'Voy a ser honesto contigo sobre {tema}...',
    'Nadie me paga por decir esto, pero {tema}...',
    'Tengo que confesar algo sobre {tema} que me da vergüenza',
    'No debería decir esto pero {tema}...',
    'La verdad es que con {tema} yo también la cagué al principio',
  ],
};

// Plantillas CTA por plataforma
export const CTA_TEMPLATES: Record<Platform, string[]> = {
  instagram: [
    'Guarda esto para cuando lo necesites',
    'Comparte con alguien que necesite escuchar esto',
    'Sígueme para más sobre {tema}',
    'Comenta "QUIERO" y te envío la guía completa',
    'Dale a guardar porque esto vale oro',
    '¿Quieres la parte 2? Dímelo en comentarios',
  ],
  tiktok: [
    'Sígueme para la parte 2',
    'Dale like si quieres más de esto',
    'Comparte y guarda para después',
    'Comenta cuál te resonó más',
    'Stitchea esto con tu experiencia',
    'Dueto si estás de acuerdo',
  ],
  youtube_shorts: [
    'Suscríbete para más contenido así',
    'Dale like y comenta tu opinión',
    'Mira el video completo en mi canal',
    'Activa la campanita para no perderte nada',
    'Deja en comentarios tu experiencia',
  ],
};

// Frameworks de estructura de guión
export const FRAMEWORK_STRUCTURES: Record<Framework, { nombre: string; descripcion: string; pasos: string[] }> = {
  PAS: {
    nombre: 'Problema - Agitación - Solución',
    descripcion: 'Identifica un dolor, lo amplifica emocionalmente y ofrece la solución. Ideal para contenido educativo y de ventas.',
    pasos: ['GANCHO: Captura atención inmediata', 'PROBLEMA: Identifica el dolor del espectador', 'AGITACIÓN: Amplifica las consecuencias de no resolverlo', 'SOLUCIÓN: Presenta la respuesta de forma clara', 'CTA: Llamada a la acción'],
  },
  AIDA: {
    nombre: 'Atención - Interés - Deseo - Acción',
    descripcion: 'Guía al espectador desde la atención hasta la acción. Clásico del copywriting adaptado a video corto.',
    pasos: ['ATENCIÓN: Hook potente que detiene el scroll', 'INTERÉS: Conecta con su realidad o curiosidad', 'DESEO: Muestra los beneficios de forma vívida', 'ACCIÓN: Indica el siguiente paso concreto'],
  },
  BAB: {
    nombre: 'Before - After - Bridge',
    descripcion: 'Muestra el antes, el después, y cómo llegar ahí. Ideal para transformaciones y testimonios.',
    pasos: ['GANCHO: Captura con la transformación', 'ANTES: Describe la situación actual/problema', 'DESPUÉS: Pinta la visión del resultado ideal', 'PUENTE: Explica el camino para lograrlo', 'CTA: Invita a dar el primer paso'],
  },
  HRAS: {
    nombre: 'Hook - Retención - Argumento - Salida (Método Victor Heras)',
    descripcion: 'La fórmula de Victor Heras: engancha, entretiene, da valor y cierra con acción.',
    pasos: ['HOOK: 2-3 segundos de gancho irresistible', 'RETENCIÓN: Entretén y mantén la atención con micro-ganchos', 'ARGUMENTO: Entrega el valor real con claridad', 'SALIDA: CTA estratégico que beneficie tu cuenta'],
  },
  OPEN_LOOP: {
    nombre: 'Bucle Abierto con Curiosidad Apilada',
    descripcion: 'Abre preguntas que solo se responden al final. Maximiza el watch time.',
    pasos: ['GANCHO: Promesa intrigante que abre un bucle', 'CONTEXTO: Información parcial que aumenta la curiosidad', 'MICRO-GANCHO: Nuevo bucle antes de cerrar el anterior', 'REVELACIÓN: Cierra el bucle principal con payoff satisfactorio', 'CTA: Aprovecha el momentum emocional'],
  },
  STORYTELLING: {
    nombre: 'Narrativa Personal',
    descripcion: 'Cuenta una historia real o dramatizada que conecta emocionalmente. La más humana y difícil de detectar como IA.',
    pasos: ['GANCHO: Inicio in-media-res (empieza por el momento más intenso)', 'CONTEXTO: Retrocede para dar antecedentes', 'CONFLICTO: El problema o desafío central', 'CLÍMAX: El momento de cambio o revelación', 'RESOLUCIÓN: La lección o moraleja', 'CTA: Conecta la historia con la acción'],
  },
};

// Nicho → temas populares
export const NICHE_TOPICS: Record<Niche, string[]> = {
  negocios: ['emprendimiento', 'ventas', 'marca personal', 'liderazgo', 'productividad', 'networking'],
  fitness: ['rutinas', 'nutrición', 'transformación física', 'suplementos', 'hábitos saludables'],
  finanzas: ['inversiones', 'ahorro', 'ingresos pasivos', 'cripto', 'libertad financiera', 'deudas'],
  tecnologia: ['apps', 'IA', 'gadgets', 'programación', 'tendencias tech', 'automatización'],
  lifestyle: ['rutina diaria', 'bienestar', 'minimalismo', 'organización', 'hábitos'],
  educacion: ['aprendizaje', 'estudios', 'idiomas', 'cursos online', 'técnicas de estudio'],
  marketing: ['redes sociales', 'contenido viral', 'email marketing', 'branding', 'copywriting'],
  desarrollo_personal: ['mentalidad', 'hábitos', 'confianza', 'disciplina', 'propósito'],
  cocina: ['recetas rápidas', 'meal prep', 'trucos de cocina', 'comida saludable'],
  viajes: ['destinos', 'tips de viaje', 'presupuesto', 'experiencias', 'nómada digital'],
  moda: ['outfits', 'tendencias', 'estilo personal', 'compras inteligentes'],
  relaciones: ['comunicación', 'citas', 'autoestima', 'límites', 'inteligencia emocional'],
  otro: [],
};
