import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI } from '@/lib/ai-client';
import { getHumanizerSystemPrompt, postProcessHumanize } from '@/lib/humanizer';
import type { HumanizerConfig } from '@/lib/humanizer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, humanizerConfig } = body as {
      text: string;
      humanizerConfig: HumanizerConfig;
    };

    if (!text?.trim()) {
      return NextResponse.json(
        { error: 'El texto es requerido' },
        { status: 400 }
      );
    }

    const systemPrompt = getHumanizerSystemPrompt(humanizerConfig);

    const result = await generateWithAI(
      systemPrompt,
      `Reescribe el siguiente texto para que suene completamente natural y humano. Mantén el significado y la estructura general pero hazlo sonar como si un creador de contenido real lo estuviera diciendo espontáneamente. NO añadas ni quites información, solo reformula para que suene humano.

TEXTO ORIGINAL:
---
${text}
---

TEXTO HUMANIZADO:`
    );

    const humanizedContent = postProcessHumanize(result.content, humanizerConfig);

    return NextResponse.json({
      original: text,
      humanized: humanizedContent,
      model: result.model,
    });
  } catch (error) {
    console.error('Error humanizing text:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
