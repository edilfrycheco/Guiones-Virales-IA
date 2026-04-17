// Genera N ganchos como array estructurado (para el paso 2 del wizard)
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
import { generateWithAI } from '@/lib/ai-client';
import { getHumanizerSystemPrompt, postProcessHumanize, type HumanizerConfig } from '@/lib/humanizer';
import { HOOK_TEMPLATES, type HookType, type Platform, type Tone, type Niche, type ContentObjective, type UniversalPillar } from '@/lib/viral-frameworks';
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
  contentObjective?: ContentObjective;
  universalPillar?: UniversalPillar;
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

    const systemPrompt = `Eres un creador de contenido viral con +5M seguidores. Escribes ganchos que suenan como una persona real hablando — no como un copy de LinkedIn ni un aforismo de coach.

${humanPrompt}`;

    const objectiveMap: Record<string, string> = {
      alcance: 'S1 ALCANCE — ultra-compartible, impacto máximo, optimizado para no-seguidores',
      educativo: 'S2 EDUCATIVO — promete aprendizaje valioso, optimizado para saves',
      conexion: 'S3 CONEXIÓN — vulnerabilidad y resonancia emocional, optimizado para comentarios',
      autoridad: 'S4 AUTORIDAD — demuestra expertise, optimizado para follows y confianza',
    };
    const pillarMap: Record<string, string> = {
      dinero: 'DINERO — activa el deseo de mejorar la situación económica',
      relaciones: 'RELACIONES — activa el deseo de conexión humana y pertenencia',
      estatus: 'ESTATUS — activa el deseo de ser respectado y reconocido',
      salud: 'SALUD — activa el deseo de bienestar y energía',
    };

    const userPrompt = `Genera EXACTAMENTE ${cantidad} ganchos virales para este tema. Cada uno debe sonar como si una persona real lo dijera mirando a cámara, no como una frase de LinkedIn.

TEMA: ${body.tema}
TIPO DE GANCHO: ${body.hookType}
PLATAFORMA: ${body.platform}
TONO: ${body.tone}
NICHO: ${body.niche}
${body.contentObjective ? `OBJETIVO DEL VIDEO: ${objectiveMap[body.contentObjective]}` : ''}
${body.universalPillar ? `PILAR UNIVERSAL: ${pillarMap[body.universalPillar]}` : ''}

═══ ANTI-PATRONES — PROHIBIDO usar cualquiera de estos ═══
❌ Estructura "X. No Y, Z." repetida más de una vez en la lista
❌ Ecuaciones tipo "X = Y" o "X = commoditized"
❌ Cierres con "Elige" o "De qué lado estás" o "Una de dos"
❌ Sustantivos abstractos como SUJETO del gancho (viralidad, identidad, autenticidad, jerarquía, código visual, esencia, propósito)
❌ Frases-aforismo estilo consultor o coach premium ("El lujo no grita, se reconoce")
❌ Más de UN gancho que use contraste "X% vs Y%"
❌ Todos los ganchos con la misma longitud de frase
❌ Empezar más de 2 ganchos con la misma palabra

═══ REQUISITO DE CONCRETITUD ═══
Cada gancho DEBE incluir al menos UNO de estos anclajes concretos:
• Un número real específico (no "millones" — sí "4.200" o "3 años" o "8 meses")
• Un nombre propio real (marca conocida, persona pública, plataforma, ciudad)
• Una acción física del narrador ("abrí", "vi", "borré", "dije", "revisé", "cerré")
• Una reacción emocional específica del narrador ("me rompió los esquemas", "no lo podía creer", "casi cierro todo")
• Una escena que se pueda visualizar en 2 segundos ("mirando mi teléfono a las 2am", "en la primera reunión con ese cliente")

═══ VARIEDAD OBLIGATORIA DE ESTRUCTURAS ═══
Distribuye estas estructuras entre los ${cantidad} ganchos (no repitas la misma más de 2 veces):
→ "Yo [acción pasada inesperada]..." — narrador en primera persona
→ "[Pregunta directa al espectador que lo incomoda]"
→ "[Afirmación que choca] — [contexto que la explica]"
→ "[Nombre de marca o persona real] [hace/dijo algo inesperado]. [Consecuencia que nadie menciona]."
→ "[Escena concreta en medio de la acción, in-medias-res]"
→ "Mira / Fíjate / Espera — [revelación inmediata]"
→ "[Dato concreto que contradice lo que el espectador cree]"

═══ VIBRA CORRECTA — así deben sonar ═══
✅ "Hay una razón por la que Hermès no tiene cuenta en TikTok — y cuando la entiendes, cambia todo."
✅ "Yo cerré mi cuenta con 50K seguidores en enero. En febrero vendí más que nunca."
✅ "¿Notaste que los relojes de lujo nunca muestran el precio en Instagram? Eso no es un accidente."
✅ "Llevaba 2 años creando contenido. Mis métricas eran perfectas. El problema: cero ventas."
✅ "Mira tu feed ahora mismo. Todo se parece, ¿verdad? El tuyo también."
✅ "El cliente que más me pagó me dijo que nunca había visto mi contenido. Eso me dejó mudo."

FORMATO ESTRICTO — SOLO devuelve JSON válido, sin texto extra:
{
  "hooks": [
    { "text": "gancho 1", "reason": "en 1 frase natural: qué abre en la cabeza del espectador" },
    { "text": "gancho 2", "reason": "..." }
  ]
}`;

    // Sonnet 4.6 + extended thinking (budget moderado para no exceder 60s de Vercel)
    const result = await generateWithAI(systemPrompt, userPrompt, styleContext, {
      model: 'claude-sonnet-4-6',
      maxTokens: 3072,
      thinking: { budgetTokens: 1024 },
    });

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
