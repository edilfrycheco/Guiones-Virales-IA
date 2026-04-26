// Perfil de usuario local — guardado en localStorage, sin necesidad de auth
// Captura QUIÉN es el creador, QUÉ piensa y CÓMO comunica.
// Se inyecta en cada prompt para que la IA hable desde tu voz, no desde una plantilla.

export interface UserProfile {
  // Quién — la audiencia a la que le hablas
  audiencia_objetivo: string;

  // Desde dónde — tu perspectiva editorial: qué piensas de tu industria,
  // con qué no estás de acuerdo, qué te molesta del statu quo
  perspectiva_editorial: string;

  // Cómo enseñas — qué evitas, cómo prefieres comunicar, qué te diferencia
  manera_ensenar: string;

  // Defaults técnicos del wizard
  nicho_default: string;
  platform_default: string;
  tone_default: string;

  // Rotación semanal de objetivos S1→S2→S3→S4
  rotacion_activa: boolean;
  rotacion_inicio: string; // ISO date string del lunes en que empezó la rotación
}

const PROFILE_KEY = 'user_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  audiencia_objetivo: '',
  perspectiva_editorial: '',
  manera_ensenar: '',
  nicho_default: 'marketing',
  platform_default: 'instagram',
  tone_default: 'casual',
  rotacion_activa: false,
  rotacion_inicio: '',
};

export function loadProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (!saved) return null;
    // Merge con defaults para tolerar perfiles viejos sin los nuevos campos
    return { ...DEFAULT_PROFILE, ...JSON.parse(saved) } as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}

export type WeekObjective = 'alcance' | 'educativo' | 'conexion' | 'autoridad';

// Devuelve el objetivo S1-S4 que toca esta semana según la rotación
export function getCurrentWeekObjective(profile: UserProfile | null): WeekObjective | null {
  if (!profile?.rotacion_activa || !profile.rotacion_inicio) return null;
  try {
    const inicio = new Date(profile.rotacion_inicio);
    const ahora = new Date();
    const diffMs = ahora.getTime() - inicio.getTime();
    const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
    const order: WeekObjective[] = ['alcance', 'educativo', 'conexion', 'autoridad'];
    return order[((diffWeeks % 4) + 4) % 4];
  } catch {
    return null;
  }
}
