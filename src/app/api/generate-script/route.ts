import { NextRequest, NextResponse } from 'next/server';
import { buildScriptPrompt } from '@/lib/prompt-builder';
import { generateWithAI } from '@/lib/ai-client';
import { postProcessHumanize } from '@/lib/humanizer';
import type { ScriptConfig } from '@/lib/viral-frameworks';
import type { HumanizerConfig } from '@/lib/humanizer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scriptConfig, humanizerConfig } = body as {
      scriptConfig: ScriptConfig;
      humanizerConfig: HumanizerConfig;
    };

    if (!scriptConfig?.tema) {
      return NextResponse.json(
        { error: 'El tema es requerido' },
        { status: 400 }
      );
    }

    // Construir el prompt completo
    const fullPrompt = buildScriptPrompt(scriptConfig, humanizerConfig);

    // Generar con IA
    const result = await generateWithAI(
      'Eres un guionista experto en contenido viral. SOLO devuelve el guión, sin explicaciones adicionales.',
      fullPrompt
    );

    // Post-procesar para humanización adicional
    const humanizedContent = postProcessHumanize(result.content, humanizerConfig);

    return NextResponse.json({
      script: humanizedContent,
      model: result.model,
      config: {
        framework: scriptConfig.framework,
        platform: scriptConfig.platform,
        hookType: scriptConfig.hookType,
        tone: scriptConfig.tone,
      },
    });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
