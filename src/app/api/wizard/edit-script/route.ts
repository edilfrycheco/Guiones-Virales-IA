// Edita un guión con una instrucción rápida (ej: "más agresivo", "más corto")
import { NextRequest, NextResponse } from 'next/server';
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

    const result = await generateWithAI(
      `Eres un editor experto en guiones virales. Modificas guiones manteniendo su esencia.

${humanPrompt}`,
      `GUIÓN ORIGINAL:
${body.script}

INSTRUCCIÓN DE EDICIÓN:
${body.instruction}

Aplica la instrucción y devuelve el GUIÓN COMPLETO EDITADO. Mantén las secciones (🎯 GANCHO, 📝 CUERPO, 🚀 CTA, 💡 NOTAS). SOLO devuelve el guión editado, sin explicaciones.`
    );

    const edited = postProcessHumanize(result.content, body.humanizer);
    return NextResponse.json({ script: edited });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    );
  }
}
