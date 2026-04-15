// Genera N ganchos como array estructurado (para el paso 2 del wizard)
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;
import { generateWithAI } from '@/lib/ai-client';
import { getHumanizerSystemPrompt, postProcessHumanize, type HumanizerConfig } from '@/lib/humanizer';
import { HOOK_TEMPLATES, type HookType, type Platform, type Tone, type Niche } from '@/lib/viral-frameworks';
import { getServerSupabase } from '@/lib/supabase';
import { buildStyleContext, loadUserStyle } from '@/lib/style-profile';

interface Body {
  tema: string;
  hookType: HookType;
  platform: Platform;
  tone: Tone;
  niche: Niche;
  cantidad: number;
  humanizer: HumanizerConfig;
  useMyStyle?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    if (!body.tema) {
      return NextResponse.json({ error: 'El tema es requerido' }, { status: 400 });
    }

    const cantidad = Math.max(3, Math.min(10, body.cantidad || 5));
    const hookRef = HOOK_TEMPLATES[body.hookType]
      .map((h) => h.replace('{tema}', body.tema))
      .slice(0, 4)
      .join('\n  - ');

    const humanPrompt = getHumanizerSystemPrompt(body.humanizer);

    // Inyección de estilo del usuario (opcional)
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

    const systemPrompt = `Eres un experto en ganchos virales. Detienes el scroll en 2 segundos.

${humanPrompt}`;

    const userPrompt = `Genera EXACTAMENTE ${cantidad} ganchos virales diferentes para:

TEMA: ${body.tema}
TIPO: ${body.hookType}
PLATAFORMA: ${body.platform}
TONO: ${body.tone}
NICHO: ${body.niche}

EJEMPLOS (inspírate, crea variaciones ORIGINALES):
  - ${hookRef}

REGLAS:
- Máximo 10-15 palabras por gancho
- Cada uno debe abrir un "gap de curiosidad"
- Sonido natural, no corporativo
- Varía estructuras entre ellos

FORMATO ESTRICTO — SOLO devuelve JSON válido, sin texto extra:
{
  "hooks": [
    { "text": "gancho 1", "reason": "por qué funciona en 1 frase" },
    { "text": "gancho 2", "reason": "..." }
  ]
}`;

    const result = await generateWithAI(systemPrompt, userPrompt, styleContext);

    // Parsea el JSON (con tolerancia a ruido alrededor)
    let hooks: Array<{ text: string; reason: string }> = [];
    try {
      const match = result.content.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        hooks = (parsed.hooks || []).map((h: any) => ({
          text: postProcessHumanize(String(h.text || ''), body.humanizer),
          reason: String(h.reason || ''),
        }));
      }
    } catch {
      // Fallback: dividir por líneas si el JSON falló
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
