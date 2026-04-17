import { NextRequest, NextResponse } from 'next/server';
import { buildAnalysisPrompt } from '@/lib/prompt-builder';
import { generateWithAI } from '@/lib/ai-client';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { script } = body as { script: string };

    if (!script?.trim()) {
      return NextResponse.json(
        { error: 'El guión es requerido' },
        { status: 400 }
      );
    }

    const fullPrompt = buildAnalysisPrompt(script);

    // Sonnet 4.6 + extended thinking → análisis más profundo y estructurado
    const result = await generateWithAI(
      'Eres un analista experto en contenido viral. Responde SOLO con JSON válido, sin texto adicional.',
      fullPrompt,
      undefined,
      {
        model: 'claude-sonnet-4-6',
        maxTokens: 8192,
        thinking: { budgetTokens: 5000 },
      }
    );

    // Intentar parsear JSON de la respuesta
    let analysis;
    try {
      // Extraer JSON si viene envuelto en markdown
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(result.content);
    } catch {
      // Si no es JSON válido, devolver como texto
      analysis = {
        puntuacion_total: 0,
        raw_analysis: result.content,
        parse_error: true,
      };
    }

    return NextResponse.json({
      analysis,
      model: result.model,
    });
  } catch (error) {
    console.error('Error analyzing script:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
