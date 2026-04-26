// Edita un guión con una instrucción rápida (ej: "más corto", "menos abstracto").
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;
import { generateWithAI } from '@/lib/ai-client';
import { getHumanizerSystemPrompt, postProcessHumanize, type HumanizerConfig } from '@/lib/humanizer';

interface Body {
  script: string;
  instruction: string;
  humanizer: HumanizerConfig;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    if (!body.script || !body.instruction) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const humanPrompt = getHumanizerSystemPrompt(body.humanizer);

    const systemPrompt = `Eres un editor que ajusta guiones manteniendo la voz del creador y la tesis del guión. No cambias lo que dice — cambias cómo lo dice según la instrucción.

${humanPrompt}

REGLAS:
- Mantén la postura y tesis del guión original. Si el creador defendía una idea, el editado la sigue defendiendo.
- No agregues frases de coach, ni resúmenes finales, ni "como ven".
- No cambies el inicio (el gancho) salvo que la instrucción lo pida explícitamente.
- Devuelve SOLO el guión editado en texto plano. Sin etiquetas tipo "GANCHO:", sin emojis decorativos, sin explicaciones de qué cambiaste.`;

    const userPrompt = `GUIÓN ACTUAL:
${body.script}

INSTRUCCIÓN:
${body.instruction}

Devuelve el guión completo con la instrucción aplicada.`;

    const result = await generateWithAI(systemPrompt, userPrompt, undefined, {
      model: 'claude-sonnet-4-6',
      maxTokens: 4096,
    });

    const edited = postProcessHumanize(result.content, body.humanizer);
    return NextResponse.json({ script: edited });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    );
  }
}
