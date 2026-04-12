import { NextRequest, NextResponse } from 'next/server';
import { buildHookPrompt } from '@/lib/prompt-builder';
import { generateWithAI } from '@/lib/ai-client';
import { postProcessHumanize } from '@/lib/humanizer';
import type { HookConfig } from '@/lib/viral-frameworks';
import type { HumanizerConfig } from '@/lib/humanizer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hookConfig, humanizerConfig } = body as {
      hookConfig: HookConfig;
      humanizerConfig: HumanizerConfig;
    };

    if (!hookConfig?.tema) {
      return NextResponse.json(
        { error: 'El tema es requerido' },
        { status: 400 }
      );
    }

    const fullPrompt = buildHookPrompt(hookConfig, humanizerConfig);

    const result = await generateWithAI(
      'Eres un experto en ganchos virales. Genera ganchos que detengan el scroll en 2 segundos.',
      fullPrompt
    );

    const humanizedContent = postProcessHumanize(result.content, humanizerConfig);

    return NextResponse.json({
      hooks: humanizedContent,
      model: result.model,
      config: {
        hookType: hookConfig.hookType,
        platform: hookConfig.platform,
        cantidad: hookConfig.cantidad,
      },
    });
  } catch (error) {
    console.error('Error generating hooks:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
