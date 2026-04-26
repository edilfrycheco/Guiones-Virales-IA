// La IA opina sobre el tema ANTES de que el usuario dé su opinión.
// Su rol no es responder ni resumir — es provocar la reflexión del usuario,
// señalar la tensión real del tema y decir lo que otros no dicen.
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;
import { generateWithAI } from '@/lib/ai-client';
import type { WeekObjective } from '@/lib/user-profile';

interface Body {
  tema: string;
  audiencia?: string;
  perspectiva_editorial?: string;
  manera_ensenar?: string;
  weekObjective?: WeekObjective | null;
}

const OBJECTIVE_HINT: Record<WeekObjective, string> = {
  alcance: 'Esta semana el creador busca ALCANCE — contenido que se comparta con quien aún no lo conoce. La opinión debe abrir una conversación que un no-seguidor querría compartir.',
  educativo: 'Esta semana el creador busca enseñar algo accionable. La opinión debe apuntar al valor real que se puede entregar, no quedarse en lo abstracto.',
  conexion: 'Esta semana el creador busca CONEXIÓN — vulnerabilidad y resonancia. La opinión debe tocar la tensión emocional o existencial del tema, no la táctica.',
  autoridad: 'Esta semana el creador busca posicionar AUTORIDAD. La opinión debe mostrar criterio profesional, mirada experta, perspectiva que la mayoría no tiene.',
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    if (!body.tema || body.tema.trim().length < 3) {
      return NextResponse.json({ error: 'El tema es requerido' }, { status: 400 });
    }

    const systemPrompt = `Eres un colaborador editorial honesto, no un asistente complaciente.

Tu rol es OPINAR sobre el tema antes de que el creador dé su propia opinión. No resumes, no haces tutoriales, no das listas. Das tu lectura honesta del tema: cuál es la tensión real, qué dicen todos sobre esto y qué se queda sin decir, dónde está el matiz que la mayoría se salta.

REGLAS DE TU OPINIÓN:
- Tomas postura. No "depende", no "ambas cosas son válidas".
- Señalas lo que no se suele decir o lo que el consenso del nicho ignora.
- Aterrizas con concreción — no abstractos vacíos como "autenticidad" o "valor".
- Hablas como persona, no como manual. Frases con ritmo natural, sin estructura de informe.
- Máximo 3 párrafos cortos. Sin viñetas, sin títulos, sin emojis decorativos.
- Tu opinión NO es la del creador — es un disparador para que reaccione, esté de acuerdo, lo matice o lo rebata.
- No le digas qué hacer al creador. No es un consejo. Es una mirada.

NO empieces con frases tipo "este es un tema interesante" ni "buena pregunta". Entras directo al asunto.`;

    const audienciaCtx = body.audiencia ? `\nAUDIENCIA del creador: ${body.audiencia}` : '';
    const perspectivaCtx = body.perspectiva_editorial
      ? `\nPERSPECTIVA EDITORIAL del creador (no la repitas, úsala para entender desde dónde piensa):\n${body.perspectiva_editorial}`
      : '';
    const maneraCtx = body.manera_ensenar
      ? `\nMANERA DE COMUNICAR del creador (no la imites — solo entiéndela):\n${body.manera_ensenar}`
      : '';
    const objectiveCtx = body.weekObjective ? `\n\n${OBJECTIVE_HINT[body.weekObjective]}` : '';

    const userPrompt = `TEMA: ${body.tema}${audienciaCtx}${perspectivaCtx}${maneraCtx}${objectiveCtx}

Da tu opinión honesta sobre este tema. 2-3 párrafos cortos. Postura clara. Sin consejos ni listas.`;

    const result = await generateWithAI(systemPrompt, userPrompt, undefined, {
      model: 'claude-sonnet-4-6',
      maxTokens: 800,
    });

    return NextResponse.json({ opinion: result.content.trim(), model: result.model });
  } catch (error) {
    console.error('[wizard/opinar-tema]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    );
  }
}
