// Genera 3 guiones en paralelo (uno por cada framework auto-sugerido) — Paso 3 del wizard
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
import { generateWithAI } from '@/lib/ai-client';
import { postProcessHumanize, type HumanizerConfig } from '@/lib/humanizer';
import { buildScriptPrompt } from '@/lib/prompt-builder';
import type { Framework, HookType, Niche, Platform, ScriptLength, Tone, ContentObjective, UniversalPillar } from '@/lib/viral-frameworks';
import { getServerSupabase } from '@/lib/supabase';
import { buildStyleContext, loadUserStyle } from '@/lib/style-profile';

interface Body {
  tema: string;
  hookText: string;
  hookType: HookType;
  frameworks: Framework[];
  platform: Platform;
  tone: Tone;
  niche: Niche;
  length: ScriptLength;
  audiencia?: string;
  contexto?: string;
  humanizer: HumanizerConfig;
  useMyStyle?: boolean;
  incluirCta?: boolean;
  contentObjective?: ContentObjective;
  universalPillar?: UniversalPillar;
  useReferentes?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    if (!body.tema || !body.frameworks?.length) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Inyección de guiones referentes (guiones ganadores del usuario)
    let referentesContext = '';
    if (body.useReferentes) {
      try {
        const supabase = getServerSupabase();
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: refScripts } = await supabase
              .from('reference_scripts')
              .select('topic, script_content, hook_type, framework, style_analysis, creator_name')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(3);

            if (refScripts && refScripts.length > 0) {
              const parts = refScripts.map((r: any, i: number) => {
                const analysis = r.style_analysis;
                return `--- GUIÓN REFERENTE ${i + 1}${r.creator_name ? ` (${r.creator_name})` : ''} — Tema: ${r.topic} ---
${analysis?.hook_pattern ? `Técnica del gancho: ${analysis.hook_pattern}` : ''}
${analysis?.why_it_works ? `Por qué funciona: ${analysis.why_it_works}` : ''}
${analysis?.engagement_triggers?.length ? `Triggers: ${analysis.engagement_triggers.join(', ')}` : ''}

GUIÓN:
${r.script_content}
--- fin referente ${i + 1} ---`;
              });

              referentesContext = `
=== GUIONES REFERENTES — INSPÍRATE EN SU ESTILO Y ESTRUCTURA (NO LOS COPIES) ===
Estos guiones han tenido alto engagement. Estudia CÓMO abren, cómo generan curiosidad, qué tipo de frases usan y cómo cierran. Adapta esas técnicas a tu guión sin copiar frases literales.

${parts.join('\n\n')}
=== FIN DE REFERENTES ===`;
            }
          }
        }
      } catch {
        // Non-fatal — generate without referentes context
      }
    }

    // Inyección de estilo si el usuario la activó
    let styleContext = '';
    if (body.useMyStyle) {
      const supabase = getServerSupabase();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const style = await loadUserStyle(supabase, user.id);
          styleContext = buildStyleContext(style);
        }
      }
    }

    // Generación en paralelo: un guión por framework
    const tasks = body.frameworks.map(async (framework) => {
      const prompt = buildScriptPrompt(
        {
          tema: body.tema,
          platform: body.platform,
          framework,
          hookType: body.hookType,
          tone: body.tone,
          niche: body.niche,
          length: body.length,
          contexto_adicional: `Usa EXACTAMENTE este gancho como arranque del guión: "${body.hookText}". ${body.contexto || ''}`,
          audiencia_objetivo: body.audiencia,
          incluir_cta: body.incluirCta ?? true,
          contentObjective: body.contentObjective,
          universalPillar: body.universalPillar,
        },
        body.humanizer
      );

      // Combine style context + referentes context
      const combinedContext = [styleContext, referentesContext]
        .filter(Boolean)
        .join('\n\n') || undefined;

      const result = await generateWithAI(
        'Eres un guionista experto en contenido viral. SOLO devuelve el guión, sin explicaciones.',
        prompt,
        combinedContext
      );

      return {
        framework,
        content: postProcessHumanize(result.content, body.humanizer),
      };
    });

    const scripts = await Promise.all(tasks);
    return NextResponse.json({ scripts });
  } catch (error) {
    console.error('[wizard/generate-scripts]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    );
  }
}
