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

    const userPrompt = `Genera EXACTAMENTE ${cantidad} ganchos virales para este tema.

TEMA: ${body.tema}
TIPO DE GANCHO: ${body.hookType}
PLATAFORMA: ${body.platform}
TONO: ${body.tone}
NICHO: ${body.niche}
${body.contentObjective ? `OBJETIVO DEL VIDEO: ${objectiveMap[body.contentObjective]}` : ''}
${body.universalPillar ? `PILAR UNIVERSAL: ${pillarMap[body.universalPillar]}` : ''}

═══ TU MISIÓN PRINCIPAL ═══
Cada gancho debe crear una PROMESA IMPLÍCITA. El espectador tiene que pensar: "necesito ver esto hasta el final". Abre un loop mental que su cerebro quiere cerrar. No es publicidad — es la primera frase de una historia que quieren escuchar.

La promesa puede ser: una revelación que cambia algo ("hay una razón que nadie menciona"), una paradoja curiosa ("hice X y pasó lo opuesto"), una pregunta incómoda que ya saben la respuesta pero no quieren admitir, o un dato que contradice lo que creen.

⏱ LONGITUD ESTRICTA: máximo 2 oraciones, máximo 30 palabras en total. Un gancho se dice en 3 segundos mirando a cámara. Si necesitas 4 oraciones para explicarlo, no es un gancho — es un párrafo.

═══ ASÍ DEBE SONAR — y qué promesa hace cada uno ═══
✅ "Hay una razón por la que Hermès no tiene cuenta en TikTok — y cuando la entiendes, cambia todo."
   → promete: una revelación que te cambia cómo piensas sobre algo familiar

✅ "Yo cerré mi cuenta con 50K seguidores en enero. En febrero vendí más que nunca."
   → promete: explicar una paradoja real que contradice la lógica esperada

✅ "¿Notaste que los relojes de lujo nunca muestran el precio en Instagram? Eso no es un accidente."
   → promete: revelar la lógica oculta detrás de algo que ya observaste sin entender

✅ "Llevaba 2 años creando contenido. Mis métricas eran perfectas. El problema: cero ventas."
   → promete: revelar el error invisible que estás cometiendo ahora mismo

✅ "Mira tu feed ahora mismo. Todo se parece, ¿verdad? El tuyo también."
   → promete: hacerte ver algo incómodo sobre ti que no querías admitir

✅ "El cliente que más me pagó me dijo que nunca había visto mi contenido. Eso me dejó mudo."
   → promete: explicar una verdad contraintuitiva que cambia cómo ves tu trabajo

═══ ANTI-PATRONES — PROHIBIDO ═══
❌ Aforismos de coach/consultor ("El lujo no grita, se reconoce") — no prometen nada
❌ Sustantivos abstractos como sujeto (viralidad, autenticidad, esencia, propósito)
❌ Estructura "X. No Y, Z." más de una vez
❌ Empezar más de 2 ganchos con la misma palabra

═══ CONCRETITUD — cada gancho necesita al menos UNO ═══
• Número específico ("4.200" / "3 años" / "8 meses" — no "millones")
• Nombre propio real (marca, persona pública, plataforma, ciudad)
• Acción física del narrador ("abrí", "borré", "dije", "revisé")
• Escena visualizable en 2 segundos ("mirando el teléfono a las 2am")

═══ VARIEDAD DE ESTRUCTURAS — no repetir la misma más de 2 veces ═══
→ "Yo [acción pasada inesperada]..."
→ "[Pregunta directa que incomoda al espectador]"
→ "[Afirmación que choca] — [contexto que la explica]"
→ "[Escena concreta in-medias-res]"
→ "[Dato que contradice lo que el espectador cree]"

FORMATO ESTRICTO — SOLO devuelve JSON válido, sin texto extra:
{
  "hooks": [
    { "text": "gancho 1", "reason": "en 1 frase: qué promesa abre en la cabeza del espectador" },
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
