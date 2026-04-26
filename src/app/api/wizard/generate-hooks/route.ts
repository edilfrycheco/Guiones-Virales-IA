// Genera ganchos como MENSAJES DIRECTOS a la persona que verá el video.
// No usa plantillas. El gancho nace de la opinión real del usuario sobre el tema
// + su voz editorial + su audiencia. La IA decide internamente el tipo de gancho
// — el usuario no elige estructura.
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
import { generateWithAI } from '@/lib/ai-client';
import { getHumanizerSystemPrompt, postProcessHumanize, type HumanizerConfig } from '@/lib/humanizer';
import type { Platform, Tone, Niche } from '@/lib/viral-frameworks';
import type { WeekObjective } from '@/lib/user-profile';

interface Body {
  tema: string;
  opinionUsuario: string;          // lo que el usuario piensa de verdad — la materia prima del gancho
  opinionIA?: string;              // opcional: para entender el contexto de la conversación
  platform: Platform;
  tone: Tone;
  niche: Niche;
  cantidad?: number;
  humanizer: HumanizerConfig;
  audiencia?: string;
  perspectiva_editorial?: string;
  manera_ensenar?: string;
  weekObjective?: WeekObjective | null;
}

const OBJECTIVE_INTENT: Record<WeekObjective, string> = {
  alcance: 'INTENCIÓN DE LA SEMANA: ALCANCE. Los ganchos deben ser ultra-compartibles. Una persona que no conoce al creador debe pensar "esto tiene que verlo X".',
  educativo: 'INTENCIÓN DE LA SEMANA: EDUCATIVO. Los ganchos deben prometer aprendizaje accionable. La persona debe sentir que va a salir con algo concreto.',
  conexion: 'INTENCIÓN DE LA SEMANA: CONEXIÓN. Los ganchos deben tocar algo que la persona siente pero no se atreve a decir. "Yo también" es la reacción que buscamos.',
  autoridad: 'INTENCIÓN DE LA SEMANA: AUTORIDAD. Los ganchos deben mostrar criterio profesional, mirada experta, no postureo.',
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    if (!body.tema || body.tema.trim().length < 3) {
      return NextResponse.json({ error: 'El tema es requerido' }, { status: 400 });
    }
    if (!body.opinionUsuario || body.opinionUsuario.trim().length < 10) {
      return NextResponse.json({ error: 'Necesito tu opinión sobre el tema antes de generar ganchos' }, { status: 400 });
    }

    const cantidad = Math.max(3, Math.min(8, body.cantidad || 5));
    const humanPrompt = getHumanizerSystemPrompt(body.humanizer);

    const systemPrompt = `Eres un escritor que entiende cómo se le habla a una persona — no a una audiencia abstracta. Cada gancho que escribes es UN MENSAJE DIRECTO a alguien específico viendo el video en este momento.

${humanPrompt}

PRINCIPIO CENTRAL — LO QUE DIFERENCIA TUS GANCHOS:
No usas plantillas. No partes de "tipo curiosidad" ni "tipo pregunta" ni "tipo dato". Partes de UNA persona específica viendo el video y de lo que le tienes que decir para que se quede.

Un gancho tuyo nace siempre de esta secuencia mental:
1. ¿Qué piensa de verdad el creador sobre este tema? (la opinión que te dio)
2. ¿Qué está viviendo o sintiendo la persona que verá el video?
3. ¿Cuál es la frase exacta que conecta lo que el creador piensa con lo que esa persona vive?

Esa frase es el gancho. No un patrón rellenado con el tema.`;

    const audienciaCtx = body.audiencia ? `\nA QUIÉN LE HABLAS:\n${body.audiencia}` : '';
    const perspectivaCtx = body.perspectiva_editorial
      ? `\n\nPERSPECTIVA EDITORIAL DEL CREADOR (esto es lo que él piensa de su industria — los ganchos deben sonar coherentes con esta postura):\n${body.perspectiva_editorial}`
      : '';
    const maneraCtx = body.manera_ensenar
      ? `\n\nCÓMO COMUNICA EL CREADOR (los ganchos deben sonar a esto, no a una marca):\n${body.manera_ensenar}`
      : '';
    const objectiveCtx = body.weekObjective ? `\n\n${OBJECTIVE_INTENT[body.weekObjective]}` : '';
    const opinionIACtx = body.opinionIA ? `\n\nLA IA HABÍA OPINADO ESTO ANTES (contexto de la conversación, no para repetir):\n${body.opinionIA}` : '';

    const userPrompt = `TEMA DEL VIDEO: ${body.tema}${audienciaCtx}${perspectivaCtx}${maneraCtx}${opinionIACtx}

LO QUE EL CREADOR PIENSA DE VERDAD (esta es la MATERIA PRIMA del gancho — todo gancho debe nacer de aquí):
${body.opinionUsuario}${objectiveCtx}

PLATAFORMA: ${body.platform}
TONO: ${body.tone}

═══ TU TRABAJO ═══
Escribe ${cantidad} ganchos. Cada gancho es UN MENSAJE DIRECTO a una persona viendo el video.

LO QUE NUNCA HACES:
✗ Plantillas estructurales ("Nadie te dice esto...", "El secreto de...", "El 90% hace mal...")
✗ Aforismos de coach ("El éxito no es...", "La verdadera...")
✗ Sustantivos abstractos como sujeto (autenticidad, esencia, propósito)
✗ Empezar más de un gancho con la misma palabra
✗ Ganchos genéricos que servirían para cualquier tema del nicho

LO QUE SIEMPRE HACES:
✓ Le hablas a UNA persona, no a "los emprendedores" ni "los creadores"
✓ Describes una situación tan concreta que esa persona la reconoce al instante
✓ La opinión real del creador se nota — no es contenido sin postura
✓ Cada gancho tiene un detalle físico, temporal o numérico que lo aterriza

⏱ LONGITUD: máximo 2 oraciones, máximo 30 palabras por gancho. Se dice mirando a cámara en 3 segundos.

PRUEBA DE CALIDAD: Si pudieras leer el gancho y reemplazar el tema por otro y siguiera funcionando, NO sirve. Cada gancho debe ser inseparable de este tema y de esta opinión.

VARIEDAD ENTRE LOS ${cantidad}: cada uno debe atacar el tema desde un ángulo distinto. No repitas estructura ni primera palabra.

FORMATO ESTRICTO — solo JSON válido, sin texto extra antes ni después:
{
  "hooks": [
    { "text": "el gancho exacto que dirías mirando a cámara", "reason": "a quién le habla y qué le promete escuchar — 1 frase" }
  ]
}`;

    const result = await generateWithAI(systemPrompt, userPrompt, undefined, {
      model: 'claude-sonnet-4-6',
      maxTokens: 3072,
      thinking: { budgetTokens: 1024 },
    });

    let hooks: Array<{ text: string; reason: string }> = [];
    try {
      const match = result.content.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        hooks = (parsed.hooks || []).map((h: { text?: unknown; reason?: unknown }) => ({
          text: postProcessHumanize(String(h.text || ''), body.humanizer),
          reason: String(h.reason || ''),
        }));
      }
    } catch {
      const lines = result.content
        .split('\n')
        .map((l) => l.replace(/^\d+[\.\)]\s*/, '').trim())
        .filter((l) => l.length > 10 && l.length < 200);
      hooks = lines.slice(0, cantidad).map((text) => ({ text, reason: '' }));
    }

    return NextResponse.json({ hooks, model: result.model });
  } catch (error) {
    console.error('[wizard/generate-hooks]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    );
  }
}
