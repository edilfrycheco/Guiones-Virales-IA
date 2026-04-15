// Sistema de aprendizaje de estilo del usuario
// Inyecta ejemplos del propio usuario en los prompts (few-shot learning)

import type { SavedHook, SavedScript } from './supabase';

export interface StyleInjection {
  topUsedHooks: SavedHook[];    // Top 5 usados
  topFavoriteHooks: SavedHook[]; // Top 3 marcados como favoritos
  topScripts: SavedScript[];     // Top 2 guiones aprobados
}

// Construye el bloque de contexto de estilo para inyectar en el system prompt
// Se llama desde las rutas API cuando el usuario activa "Usar mi estilo"
export function buildStyleContext(injection: StyleInjection): string {
  const parts: string[] = [];

  if (injection.topUsedHooks.length > 0) {
    parts.push(
      `GANCHOS QUE MÁS USAS (inspírate en su estructura y tono, NO los copies):
${injection.topUsedHooks.map((h, i) => `${i + 1}. "${h.hook_text}" — ${h.hook_type}`).join('\n')}`
    );
  }

  if (injection.topFavoriteHooks.length > 0) {
    parts.push(
      `TUS GANCHOS FAVORITOS (este es tu sello, mantén la voz):
${injection.topFavoriteHooks.map((h, i) => `${i + 1}. "${h.hook_text}"`).join('\n')}`
    );
  }

  if (injection.topScripts.length > 0) {
    parts.push(
      `GUIONES APROBADOS POR TI (estudia el ritmo, las muletillas y la forma de cerrar):
${injection.topScripts
  .map((s, i) => `--- GUIÓN APROBADO ${i + 1} (tema: ${s.tema}) ---
${s.script_content}
--- fin ---`)
  .join('\n\n')}`
    );
  }

  if (parts.length === 0) return '';

  return `
=== TU ESTILO PERSONAL (MUY IMPORTANTE) ===
A continuación tienes ejemplos reales de TU estilo. Imita las muletillas, el ritmo, el tipo de cierre y la forma de construir ganchos. No copies frases literalmente, pero mantén la VOZ.

${parts.join('\n\n')}
=== FIN DE TU ESTILO ===
`;
}

// Devuelve un StyleInjection vacío (cuando el usuario no tiene historial)
export function emptyStyleInjection(): StyleInjection {
  return { topUsedHooks: [], topFavoriteHooks: [], topScripts: [] };
}

// Carga el estilo del usuario desde Supabase
// null si no hay usuario logueado o Supabase no está configurado
export async function loadUserStyle(
  supabase: any,
  userId: string
): Promise<StyleInjection> {
  const [used, favs, scripts] = await Promise.all([
    supabase
      .from('hooks')
      .select('*')
      .eq('user_id', userId)
      .gt('used_count', 0)
      .order('used_count', { ascending: false })
      .limit(5),
    supabase
      .from('hooks')
      .select('*')
      .eq('user_id', userId)
      .eq('is_favorite', true)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('scripts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(2),
  ]);

  return {
    topUsedHooks: (used.data as SavedHook[]) || [],
    topFavoriteHooks: (favs.data as SavedHook[]) || [],
    topScripts: (scripts.data as SavedScript[]) || [],
  };
}
