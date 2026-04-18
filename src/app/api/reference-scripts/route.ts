// GET  — list all reference scripts for the current user
// POST — save a new reference script + auto-analyze it with Claude
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

import { generateWithAI } from '@/lib/ai-client';
import { getServerSupabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Analysis prompt
// ---------------------------------------------------------------------------
function buildReferenceAnalysisPrompt(script: string): string {
  return `Analiza el siguiente guión de un video ganador en redes sociales. Extrae los patrones que lo hacen efectivo, con foco especial en MECANISMOS DE RETENCIÓN.

GUIÓN:
---
${script}
---

Responde SOLO con JSON válido:
{
  "hook_type": "Tipo de gancho (Pregunta disruptiva / Dato sorprendente / Promesa directa / Historia personal / Afirmación polémica / Problema identificable)",
  "framework": "Framework detectado (PAS / AIDA / BAB / HRAS / OPEN_LOOP / STORYTELLING / Híbrido)",
  "hook_pattern": "Describe en 1 oración QUÉ técnica usa el gancho para detener el scroll",
  "key_phrases": ["frase memorable 1", "frase memorable 2", "frase memorable 3"],
  "why_it_works": "1-2 oraciones explicando la psicología detrás de su efectividad",
  "tone": "casual / energético / serio / inspirador / humorístico / educativo",
  "engagement_triggers": ["trigger psicológico 1", "trigger 2", "trigger 3"],
  "retention_mechanisms": ["mecanismo concreto 1 (open loop, cliffhanger, reveal delay, etc.)", "mecanismo 2", "mecanismo 3"],
  "loop_timing": "Describe en 1 frase CADA CUÁNTOS segundos abre nuevos loops (ej: 'abre un loop cada 6-8s y los cierra en cascada')",
  "payoff_moment": "En qué punto del guión entrega el valor principal (inicio / medio / 60-75% / final) y por qué ahí",
  "pattern_interrupts": ["interrupt 1 con frase aproximada", "interrupt 2"]
}`;
}

// ---------------------------------------------------------------------------
// GET /api/reference-scripts
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ scripts: [] });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ scripts: [] });
    }

    const { data, error } = await supabase
      .from('reference_scripts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ scripts: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/reference-scripts
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { creator_name, topic, platform, niche, estimated_views, script_content } = body as {
      creator_name?: string;
      topic: string;
      platform: string;
      niche?: string;
      estimated_views?: number;
      script_content: string;
    };

    if (!script_content?.trim() || !topic?.trim()) {
      return NextResponse.json({ error: 'El guión y el tema son requeridos' }, { status: 400 });
    }

    // Auto-analyze with Claude
    let hook_type: string | null = null;
    let framework: string | null = null;
    let style_analysis = null;

    try {
      const result = await generateWithAI(
        'Eres un analista experto en contenido viral. Responde SOLO con JSON válido.',
        buildReferenceAnalysisPrompt(script_content),
        undefined,
        { model: 'claude-sonnet-4-6', maxTokens: 4096 }
      );
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        hook_type = parsed.hook_type || null;
        framework = parsed.framework || null;
        style_analysis = {
          hook_pattern: parsed.hook_pattern || '',
          key_phrases: parsed.key_phrases || [],
          why_it_works: parsed.why_it_works || '',
          tone: parsed.tone || '',
          engagement_triggers: parsed.engagement_triggers || [],
          retention_mechanisms: parsed.retention_mechanisms || [],
          loop_timing: parsed.loop_timing || '',
          payoff_moment: parsed.payoff_moment || '',
          pattern_interrupts: parsed.pattern_interrupts || [],
        };
      }
    } catch {
      // Analysis failure is non-fatal — save the script without analysis
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      // No Supabase — return the analyzed data without persisting
      return NextResponse.json({
        script: {
          id: crypto.randomUUID(),
          creator_name: creator_name || null,
          platform,
          topic,
          niche: niche || null,
          estimated_views: estimated_views || null,
          script_content,
          hook_type,
          framework,
          style_analysis,
          created_at: new Date().toISOString(),
        },
      });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('reference_scripts')
      .insert({
        user_id: user?.id || null,
        creator_name: creator_name || null,
        platform,
        topic,
        niche: niche || null,
        estimated_views: estimated_views || null,
        script_content,
        hook_type,
        framework,
        style_analysis,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ script: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    );
  }
}
