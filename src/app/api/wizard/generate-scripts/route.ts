// Genera UN guión a partir de:
//  - el tema
//  - la opinión real del usuario sobre el tema
//  - el gancho que el usuario eligió
//  - su voz editorial (perspectiva + manera de enseñar)
//  - su audiencia
//
// La IA decide internamente la estructura. El usuario no elige framework ni tipo.
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
import { generateWithAI } from '@/lib/ai-client';
import { getHumanizerSystemPrompt, postProcessHumanize, type HumanizerConfig } from '@/lib/humanizer';
import type { Platform, Tone, Niche, ScriptLength } from '@/lib/viral-frameworks';
import { DURATION_MAP } from '@/lib/viral-frameworks';
import type { WeekObjective } from '@/lib/user-profile';

interface Body {
  tema: string;
  opinionUsuario: string;
  opinionIA?: string;
  hookText: string;
  platform: Platform;
  tone: Tone;
  niche: Niche;
  length: ScriptLength;
  humanizer: HumanizerConfig;
  audiencia?: string;
  perspectiva_editorial?: string;
  manera_ensenar?: string;
  weekObjective?: WeekObjective | null;
  incluirCta?: boolean;
}

const OBJECTIVE_INTENT: Record<WeekObjective, string> = {
  alcance: 'OBJETIVO DEL VIDEO: ALCANCE — el guión debe ser tan compartible que un no-seguidor lo envíe a alguien.',
  educativo: 'OBJETIVO DEL VIDEO: EDUCATIVO — el guión debe entregar algo accionable. Optimiza para saves y watch time.',
  conexion: 'OBJETIVO DEL VIDEO: CONEXIÓN — el guión debe hacer que la persona sienta "yo también". Optimiza para comentarios y mensajes.',
  autoridad: 'OBJETIVO DEL VIDEO: AUTORIDAD — el guión debe demostrar criterio profesional sin postureo. Optimiza para follows.',
};

const PLATFORM_RHYTHM: Record<Platform, string> = {
  instagram: 'Ritmo Instagram: energía media-alta, pausas estratégicas, frases cortas. La gente ve sin sonido — los subtítulos deben tener sentido por sí solos.',
  tiktok: 'Ritmo TikTok: más raw que Instagram, hablado como si fuera con un amigo, sin producir de más. Energía 20% más alta.',
  youtube_shorts: 'Ritmo Shorts: ligeramente más informativo, estructura clara, cierre que motive a explorar más del canal.',
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    if (!body.tema || !body.hookText || !body.opinionUsuario) {
      return NextResponse.json({ error: 'Faltan datos requeridos (tema, opinión del usuario, gancho)' }, { status: 400 });
    }

    const duration = DURATION_MAP[body.platform][body.length];
    const humanPrompt = getHumanizerSystemPrompt(body.humanizer);

    const audienciaCtx = body.audiencia ? `\nA QUIÉN LE HABLAS:\n${body.audiencia}` : '';
    const perspectivaCtx = body.perspectiva_editorial
      ? `\n\nPERSPECTIVA EDITORIAL DEL CREADOR (esto es lo que él piensa de su industria — el guión debe ser coherente con esta postura, no genérico del nicho):\n${body.perspectiva_editorial}`
      : '';
    const maneraCtx = body.manera_ensenar
      ? `\n\nCÓMO COMUNICA EL CREADOR (el guión debe sonar exactamente así — no a marca, no a coach):\n${body.manera_ensenar}`
      : '';
    const objectiveCtx = body.weekObjective ? `\n\n${OBJECTIVE_INTENT[body.weekObjective]}` : '';
    const opinionIACtx = body.opinionIA ? `\n\nLA IA HABÍA OPINADO ESTO ANTES DE QUE ÉL DIERA SU OPINIÓN (contexto, no para repetir):\n${body.opinionIA}` : '';

    const systemPrompt = `Eres un guionista que escribe desde la voz real del creador, no desde un manual de copywriting. Tu trabajo es traducir lo que el creador piensa al guión que va a grabar.

${humanPrompt}

PRINCIPIO CENTRAL — LO QUE HACE QUE ESTE GUIÓN NO SUENE A IA NI A FÓRMULA:
El guión nace SIEMPRE de la opinión real del creador (que él mismo te escribió). No es un guión sobre el tema — es un guión sobre lo que ÉL piensa del tema. La diferencia es enorme.

Si el creador piensa "X" sobre un tema, el guión debe defender, ilustrar y aterrizar X — no dar un panorama equilibrado, no incluir ambos lados, no hacer un tutorial neutro.`;

    const userPrompt = `TEMA: ${body.tema}${audienciaCtx}${perspectivaCtx}${maneraCtx}${opinionIACtx}

LO QUE EL CREADOR PIENSA DE VERDAD (esta es la TESIS del guión — todo el desarrollo debe defender o aterrizar esto):
${body.opinionUsuario}${objectiveCtx}

GANCHO ELEGIDO POR EL CREADOR (debes empezar el guión EXACTAMENTE con esto — no lo reescribas):
"${body.hookText}"

═══ ESPECIFICACIONES TÉCNICAS ═══
PLATAFORMA: ${body.platform}
DURACIÓN OBJETIVO: ${duration.seconds} segundos (~${duration.words} palabras)
TONO: ${body.tone}
${PLATFORM_RHYTHM[body.platform]}

═══ TU TRABAJO ═══
Escribe el guión completo del video. La estructura la decides tú según lo que mejor sirve a esta tesis específica — no fuerces un framework.

LO QUE NUNCA HACES:
✗ Resumir la opinión del creador en abstracto — la ilustras con concreción
✗ Frases-aforismo de coach ("El éxito no es...", "La verdadera autenticidad...")
✗ Enumeraciones académicas ("Primero... segundo... tercero...")
✗ "A continuación te explicaré", "como mencioné anteriormente"
✗ Cierres moralizantes ("Y eso, amigos, es la clave")
✗ Sustantivos abstractos como sujeto principal (autenticidad, viralidad, esencia)
✗ Hablar a "los emprendedores" o "los creadores" — siempre a UNA persona
✗ Plantillas: si el guión podría servir cambiando solo el tema, no sirve

LO QUE SIEMPRE HACES:
✓ Empiezas EXACTAMENTE con el gancho elegido (sin reescribirlo)
✓ Mantienes la voz del creador en cada frase — su perspectiva editorial debe sentirse en el cuerpo, no solo en el gancho
✓ Cada idea se aterriza con un detalle concreto: una escena, un número, un ejemplo real (no "muchos creadores" — específico)
✓ Hay tensión narrativa: el espectador quiere saber a dónde va esto
✓ El guión defiende la tesis del creador. No es neutro.

INGENIERÍA DE RETENCIÓN (sin que se note):
- No abras todos los loops al inicio. Distribuye la tensión.
- Cada 5-7 segundos algo cambia (ritmo, ángulo, frase corta tipo "y aquí está lo raro" o "espera —")
- El payoff principal vive en el 60-75% del guión, no al inicio
- No uses "ahora te voy a explicar" ni "primero/segundo/tercero" — cierran loops anticipadamente

${body.incluirCta === false ? 'SIN CTA al final — cierra con una frase que deje pensando.' : 'CIERRE: termina con una invitación natural a comentar / responder con su experiencia / continuar la conversación. Nada de "sígueme", "guarda esto", "dale like" — eso suena a fórmula. Una pregunta real funciona mejor.'}

FORMATO DE RESPUESTA:
Devuelve SOLO el guión listo para grabar, en texto plano. Sin secciones marcadas con emojis, sin etiquetas tipo "GANCHO:" o "CUERPO:". Escríbelo como lo dirías frente a la cámara, en párrafos naturales.`;

    const result = await generateWithAI(
      systemPrompt,
      userPrompt,
      undefined,
      { model: 'claude-sonnet-4-6', maxTokens: 4096, thinking: { budgetTokens: 1500 } }
    );

    const script = postProcessHumanize(result.content, body.humanizer);

    return NextResponse.json({ script, model: result.model });
  } catch (error) {
    console.error('[wizard/generate-scripts]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    );
  }
}
