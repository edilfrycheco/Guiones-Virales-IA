// Cliente de Supabase para el navegador y servidor
// Maneja auth + almacenamiento de ganchos, guiones y perfil de estilo

import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Variables públicas — se inyectan en el bundle del cliente
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// ¿Supabase está configurado? Sirve para mostrar modo invitado si falta
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Cliente para componentes del navegador
export function getBrowserSupabase() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Cliente para rutas de API (lee la sesión desde cookies)
export function getServerSupabase() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // En Server Components no podemos escribir cookies. Next lo refresca en middleware.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          // Ignorar (ver comentario arriba)
        }
      },
    },
  });
}

// Tipos de las tablas — deben coincidir con supabase-schema.sql
export interface SavedHook {
  id: string;
  user_id: string;
  tema: string;
  hook_type: string;
  hook_text: string;
  platform: string;
  tone: string;
  niche: string;
  is_favorite: boolean;
  used_count: number;
  last_used_at: string | null;
  created_at: string;
}

export interface SavedScript {
  id: string;
  user_id: string;
  tema: string;
  framework: string;
  hook_type: string;
  platform: string;
  tone: string;
  niche: string;
  length: string;
  script_content: string;
  hook_id: string | null;
  is_approved: boolean;
  score: number | null;
  created_at: string;
}

export interface ReferenceScript {
  id: string;
  user_id: string;
  creator_name: string | null;
  platform: string;
  topic: string;
  niche: string | null;
  estimated_views: number | null;
  script_content: string;
  hook_type: string | null;
  framework: string | null;
  style_analysis: {
    hook_pattern: string;
    key_phrases: string[];
    why_it_works: string;
    tone: string;
    engagement_triggers: string[];
  } | null;
  created_at: string;
}

export interface StyleProfile {
  id: string;
  user_id: string;
  region: string;
  personality: string;
  nivel_humanizacion: string;
  default_platform: string;
  default_tone: string;
  default_niche: string;
  created_at: string;
  updated_at: string;
}
