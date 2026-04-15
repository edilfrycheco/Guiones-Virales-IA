// Constructor de prompts para generación de guiones virales
// Combina frameworks, hooks, humanización y conocimiento de plataformas

import {
  ScriptConfig,
  HookConfig,
  DURATION_MAP,
  HOOK_TEMPLATES,
  CTA_TEMPLATES,
  FRAMEWORK_STRUCTURES,
  type ContentObjective,
  type UniversalPillar,
} from './viral-frameworks';
import { HumanizerConfig, getHumanizerSystemPrompt } from './humanizer';

const OBJECTIVE_INSTRUCTIONS: Record<ContentObjective, string> = {
  alcance: 'OBJETIVO S1 — ALCANCE: Este video debe ser ultra-compartible. Diseña el gancho y guión para que gente que NO te sigue lo comparta. Prioriza impacto emocional o controversia sana sobre profundidad.',
  educativo: 'OBJETIVO S2 — EDUCATIVO: Este video debe enseñar algo valioso y accionable. El espectador debe querer guardarlo. Estructura clara con pasos o revelaciones. Optimiza para watch time alto y saves.',
  conexion: 'OBJETIVO S3 — CONEXIÓN: Este video debe crear comunidad. El espectador debe sentir "esto me pasa a mí también". Usa vulnerabilidad, historias y momentos de identificación. Optimiza para comentarios y DMs.',
  autoridad: 'OBJETIVO S4 — AUTORIDAD: Este video debe posicionarte como experto. Incluye datos concretos, experiencias reales y pruebas. El espectador debe quedar con ganas de seguirte y confiar en ti. Optimiza para follows.',
};

const PILLAR_INSTRUCTIONS: Record<UniversalPillar, string> = {
  dinero: 'PILAR UNIVERSAL — DINERO: Conecta el tema con el deseo de ganar, ahorrar o multiplicar dinero. El espectador debe sentir que este video puede mejorar su situación económica.',
  relaciones: 'PILAR UNIVERSAL — RELACIONES: Conecta el tema con el deseo de sentirse querido, entendido, acompañado o con mejores vínculos. El espectador debe sentirse visto y comprendido.',
  estatus: 'PILAR UNIVERSAL — ESTATUS: Conecta el tema con el deseo de ser respetado, reconocido y admirado. El espectador debe sentir que este contenido lo hace ver mejor o más inteligente ante los demás.',
  salud: 'PILAR UNIVERSAL — SALUD: Conecta el tema con el deseo de sentirse bien, tener más energía y vivir con mayor calidad. El espectador debe sentir que su bienestar depende de lo que van a aprender.',
};

export function buildScriptPrompt(config: ScriptConfig, humanizer: HumanizerConfig): string {
  const duration = DURATION_MAP[config.platform][config.length];
  const framework = FRAMEWORK_STRUCTURES[config.framework];
  const hookExamples = HOOK_TEMPLATES[config.hookType]
    .map(h => h.replace('{tema}', config.tema))
    .slice(0, 3)
    .join('\n  - ');
  const ctaExamples = CTA_TEMPLATES[config.platform]
    .map(c => c.replace('{tema}', config.tema))
    .slice(0, 3)
    .join('\n  - ');

  const platformInstructions = getPlatformInstructions(config.platform);
  const toneInstructions = getToneInstructions(config.tone);
  const humanizerPrompt = getHumanizerSystemPrompt(humanizer);

  return `Eres un guionista experto en contenido viral para redes sociales. Tu especialidad es crear guiones que generen millones de views con una escritura 100% natural e indistinguible de un humano real.

${humanizerPrompt}

---

GENERA UN GUIÓN VIRAL con estas especificaciones:

TEMA: ${config.tema}
PLATAFORMA: ${config.platform.replace('_', ' ')}
DURACIÓN OBJETIVO: ${duration.seconds} segundos (~${duration.words} palabras)
FRAMEWORK: ${framework.nombre}
TIPO DE GANCHO: ${config.hookType}
TONO: ${config.tone}
NICHO: ${config.niche}
${config.audiencia_objetivo ? `AUDIENCIA: ${config.audiencia_objetivo}` : ''}
${config.contexto_adicional ? `CONTEXTO EXTRA: ${config.contexto_adicional}` : ''}
${config.contentObjective ? `\n${OBJECTIVE_INSTRUCTIONS[config.contentObjective]}` : ''}
${config.universalPillar ? `\n${PILLAR_INSTRUCTIONS[config.universalPillar]}` : ''}

ESTRUCTURA DEL FRAMEWORK (${config.framework}):
${framework.pasos.map((p, i) => `${i + 1}. ${p}`).join('\n')}

EJEMPLOS DE GANCHOS (inspírate, NO copies):
  - ${hookExamples}

${config.incluir_cta ? `EJEMPLOS DE CTA (inspírate, NO copies):
  - ${ctaExamples}` : 'SIN CTA al final.'}

${platformInstructions}

${toneInstructions}

FORMATO DE RESPUESTA:
Devuelve SOLO el guión listo para grabar, con estas secciones marcadas:

🎯 GANCHO (primeros 2-3 segundos):
[El gancho aquí]

📝 CUERPO:
[El desarrollo del guión aquí]

${config.incluir_cta ? `🚀 CTA:\n[La llamada a la acción aquí]` : ''}

💡 NOTAS DE GRABACIÓN:
[2-3 tips sobre cómo grabar este guión: tono de voz, ritmo, gestos]

IMPORTANTE:
- El guión debe sonar como si un creador REAL lo estuviera diciendo de forma natural
- NO uses lenguaje corporativo ni de comunicado de prensa
- Usa el vocabulario que usaría tu audiencia
- Incluye al menos una imperfección natural (autocorrección, pausa, énfasis repetido)
- Las transiciones deben ser conversacionales, no académicas
- Cada oración debe mantener la curiosidad para la siguiente`;
}

export function buildHookPrompt(config: HookConfig, humanizer: HumanizerConfig): string {
  const hookExamples = HOOK_TEMPLATES[config.hookType]
    .map(h => h.replace('{tema}', config.tema))
    .join('\n  - ');

  const humanizerPrompt = getHumanizerSystemPrompt(humanizer);

  return `Eres un experto en ganchos virales para redes sociales. Creas ganchos que detienen el scroll en los primeros 2 segundos.

${humanizerPrompt}

---

GENERA ${config.cantidad} GANCHOS VIRALES:

TEMA: ${config.tema}
TIPO: ${config.hookType}
PLATAFORMA: ${config.platform.replace('_', ' ')}
TONO: ${config.tone}
NICHO: ${config.niche}
${config.contentObjective ? `\n${OBJECTIVE_INSTRUCTIONS[config.contentObjective]}` : ''}
${config.universalPillar ? `\n${PILLAR_INSTRUCTIONS[config.universalPillar]}` : ''}

EJEMPLOS DE REFERENCIA (inspírate, crea variaciones ORIGINALES):
  - ${hookExamples}

REGLAS PARA CADA GANCHO:
1. Máximo 2-3 segundos al leerlo en voz alta (10-15 palabras)
2. Debe crear un "gap de curiosidad" que obligue a seguir viendo
3. Debe sentirse como algo que diría un creador real, NO una marca
4. Varía las estructuras entre los ${config.cantidad} ganchos
5. Al menos uno debe empezar con una pregunta
6. Al menos uno debe ser una declaración impactante
7. Ninguno debe sonar genérico ni de plantilla

FORMATO: Devuelve cada gancho numerado, seguido de una breve nota sobre por qué funciona psicológicamente.

1. [Gancho]
   → Por qué funciona: [Explicación breve]`;
}

export function buildAnalysisPrompt(script: string): string {
  return `Eres un analista experto en contenido viral para redes sociales. Evalúa el siguiente guión y dale una puntuación detallada.

GUIÓN A ANALIZAR:
---
${script}
---

EVALÚA en estas categorías (0-100 cada una):

1. **GANCHO** (0-100): ¿Los primeros 2-3 segundos detienen el scroll? ¿Hay gap de curiosidad?
2. **RETENCIÓN** (0-100): ¿Hay micro-ganchos? ¿Open loops? ¿Ritmo variado? ¿Mantendrá al espectador hasta el final?
3. **ESTRUCTURA** (0-100): ¿Sigue un framework claro? ¿La progresión es lógica y fluida?
4. **VALOR** (0-100): ¿Entrega valor real? ¿Es accionable o memorable?
5. **CTA** (0-100): ¿Hay llamada a la acción? ¿Es natural y motivante?
6. **NATURALIDAD** (0-100): ¿Suena humano? ¿O suena a IA/corporativo? Evalúa muletillas, imperfecciones, ritmo.
7. **VIRALIDAD** (0-100): ¿Tiene potencial de ser compartido? ¿Genera emoción/reacción?

FORMATO DE RESPUESTA (JSON):
{
  "puntuacion_total": [promedio de todas las categorías],
  "categorias": [
    {
      "nombre": "Gancho",
      "puntuacion": [0-100],
      "feedback": "[qué hace bien]",
      "mejora": "[qué podría mejorar]"
    },
    ...
  ],
  "veredicto": "[1-2 frases resumen del guión]",
  "mejoras_top_3": ["mejora 1", "mejora 2", "mejora 3"]
}`;
}

function getPlatformInstructions(platform: string): string {
  const instructions: Record<string, string> = {
    instagram: `INSTRUCCIONES PARA INSTAGRAM REELS:
- Gancho visual + verbal en los primeros 2-3 segundos
- Estética cuidada pero no excesivamente producida (autenticidad > producción)
- Usa lenguaje que invite a guardar y compartir
- Piensa en formato vertical 9:16
- Los subtítulos son ESENCIALES (80% ve sin sonido)
- Ritmo: energía media-alta, pausas estratégicas`,

    tiktok: `INSTRUCCIONES PARA TIKTOK:
- Gancho en los primeros 1.5-2 segundos (más rápido que Instagram)
- Energía 20% más alta que Instagram
- Más informal, más raw, menos producido
- Puedes ser más directo y provocativo
- Formato nativo: como si estuvieras hablando a un amigo
- Trending sounds boostan 300-500% el alcance en 24h`,

    youtube_shorts: `INSTRUCCIONES PARA YOUTUBE SHORTS:
- Gancho en los primeros 2-3 segundos
- Puede ser ligeramente más informativo que TikTok
- La estructura importa más (YouTube premia watch time)
- Cierra con algo que motive a ver más de tu canal
- Máximo 58 segundos, sweet spot: 30-45 segundos`,
  };
  return instructions[platform] || instructions.instagram;
}

function getToneInstructions(tone: string): string {
  const instructions: Record<string, string> = {
    casual: 'TONO: Habla como si charlaras con un amigo. Relajado, sin prisas, natural. Usa jerga de tu nicho.',
    energetico: 'TONO: Alta energía desde el segundo 1. Frases punchy. Exclamaciones. Transmite pasión y urgencia.',
    serio: 'TONO: Autoridad tranquila. Datos concretos. Sin hype innecesario. Credibilidad por encima de entretenimiento.',
    inspirador: 'TONO: Motivacional pero genuino. Comparte vulnerabilidad. Conecta emocionalmente. Termina con esperanza.',
    humoristico: 'TONO: Usa humor, sarcasmo ligero, exageraciones cómicas. Haz reír antes de enseñar.',
    educativo: 'TONO: Profesor cool. Simplifica lo complejo. Usa analogías cotidianas. Haz que el espectador se sienta inteligente.',
  };
  return instructions[tone] || instructions.casual;
}
