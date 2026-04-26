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

  return `Eres un creador de contenido con millones de views, no un copywriter. Escribes guiones que suenan como una conversación real — con imperfecciones, ritmo irregular, jerga auténtica. NUNCA suenan a LinkedIn, a coach premium ni a comunicado de prensa.

${humanizerPrompt}

ANTI-PATRONES EN EL GUIÓN — PROHIBIDO:
❌ Frases-aforismo tipo "El lujo no grita, se reconoce"
❌ Enumeraciones académicas ("Primero... Segundo... Tercero...")
❌ Cierres moralizantes ("Y eso, amigos, es la clave del éxito")
❌ Sustantivos abstractos como sujeto principal (autenticidad, viralidad, identidad, esencia)
❌ Transiciones corporativas ("A continuación te explicaré", "Como mencioné anteriormente")
❌ Más de 2 frases seguidas de la misma longitud

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

INGENIERÍA DE RETENCIÓN (CRÍTICO — esto define si el video escala):
- MICRO-CURIOSITY STACKING: cada 5-7 segundos abre un NUEVO open-loop antes de cerrar el anterior. Nunca dejes al espectador sin una pregunta pendiente.
- PATTERN INTERRUPTS: cada 8-12 segundos cambia algo (tono, ritmo, ángulo, una frase corta tipo "espera —", "y lo más loco es", "pero esto no es lo peor")
- DELAYED PAYOFF: la información valiosa principal NO se entrega en los primeros 10s; se entrega en el 60-75% del guión, cuando el espectador ya invirtió tiempo
- LOOP-BACK opcional al final: cierra con una frase que invite a re-ver el inicio (solo si encaja con el tema)
- EVITA "ahora te voy a explicar" o "primero", "segundo", "tercero" — esos cierran loops anticipadamente

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
  return `Eres un analista experto en contenido viral para redes sociales. Evalúa el siguiente guión con foco en retención segundo-a-segundo.

GUIÓN A ANALIZAR:
---
${script}
---

EVALÚA en estas categorías (0-100 cada una):

1. **GANCHO** (0-100): ¿Los primeros 2-3 segundos detienen el scroll? ¿Hay gap de curiosidad?
2. **RETENCIÓN** (0-100): ¿Hay micro-ganchos cada 5-7s? ¿Open loops apilados? ¿Pattern interrupts? ¿Mantendrá al espectador hasta el final?
3. **ESTRUCTURA** (0-100): ¿Sigue un framework claro? ¿La progresión es lógica y fluida?
4. **VALOR** (0-100): ¿Entrega valor real? ¿Es accionable o memorable?
5. **CTA** (0-100): ¿Hay llamada a la acción? ¿Es natural y motivante?
6. **NATURALIDAD** (0-100): ¿Suena humano? ¿O suena a IA/corporativo? Evalúa muletillas, imperfecciones, ritmo.
7. **VIRALIDAD** (0-100): ¿Tiene potencial de ser compartido? ¿Genera emoción/reacción?

ANÁLISIS DE RETENCIÓN (CRÍTICO):
- Divide el guión mentalmente en bloques aproximados de 5 segundos
- Para cada bloque, estima la curva de retención esperada (% que sigue viendo)
- Identifica los puntos de drop-off probable (donde la gente saltaría al siguiente video)
- Detecta dónde está el payoff principal (% del guión)

FORMATO DE RESPUESTA (JSON):
{
  "puntuacion_total": [promedio de todas las categorías],
  "categorias": [
    {
      "nombre": "Gancho",
      "puntuacion": [0-100],
      "feedback": "[qué hace bien]",
      "mejora": "[qué podría mejorar]"
    }
  ],
  "retencion_breakdown": [
    { "segmento": "0-5s", "retencion_esperada": [0-100], "fragmento": "[primeras palabras]", "nota": "[qué pasa aquí]" },
    { "segmento": "5-10s", "retencion_esperada": [0-100], "fragmento": "...", "nota": "..." }
  ],
  "drop_off_risks": ["punto débil 1 con timestamp aproximado", "punto débil 2"],
  "payoff_location_pct": [0-100, % del guión donde está el payoff principal],
  "open_loops_detected": [número de open loops apilados],
  "pattern_interrupts_detected": [número de pattern interrupts],
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
- Ritmo: energía media-alta, pausas estratégicas

ESTRUCTURA TEMPORAL (Reels):
[0-2s]  HOOK visual + verbal — detén el scroll con curiosidad o promesa
[2-5s]  PROMESA — qué van a aprender/sentir si se quedan
[5-15s] LOOP #1 — abre una curiosidad y NO la cierres aún
[15-25s] PAYOFF parcial + LOOP #2 — entrega algo de valor pero abre otra pregunta
[25-40s] PAYOFF principal + tensión final
[últimos 3-5s] CIERRE + CTA en formato pregunta o reto`,

    tiktok: `INSTRUCCIONES PARA TIKTOK:
- Gancho en los primeros 1.5-2 segundos (más rápido que Instagram)
- Energía 20% más alta que Instagram
- Más informal, más raw, menos producido
- Puedes ser más directo y provocativo
- Formato nativo: como si estuvieras hablando a un amigo
- Trending sounds boostan 300-500% el alcance en 24h

ESTRUCTURA TEMPORAL (TikTok):
[0-1.5s] HOOK — frase punchy o pattern interrupt visual
[1.5-4s] CONTEXTO ultra-rápido — sitúa al espectador
[4-12s] LOOP #1 abierto — promesa de pago (revelación, dato, twist)
[12-22s] MINI-PAYOFF + LOOP #2 — entrega algo, abre otra cosa
[22-35s] PAYOFF principal — el momento "ohh"
[últimos 3s] LOOP-BACK al inicio o CTA conversacional`,

    youtube_shorts: `INSTRUCCIONES PARA YOUTUBE SHORTS:
- Gancho en los primeros 2-3 segundos
- Puede ser ligeramente más informativo que TikTok
- La estructura importa más (YouTube premia watch time)
- Cierra con algo que motive a ver más de tu canal
- Máximo 58 segundos, sweet spot: 30-45 segundos

ESTRUCTURA TEMPORAL (Shorts):
[0-3s]  HOOK — declaración fuerte o pregunta directa
[3-8s]  PREMISA — anuncia explícitamente qué van a aprender
[8-20s] LOOP #1 — desarrollo con cliffhanger antes del primer payoff
[20-35s] PAYOFF #1 + LOOP #2 hacia idea más grande
[35-50s] PAYOFF principal + síntesis
[últimos 5-8s] CTA al canal (ver más, suscribirse, video relacionado)`,
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
