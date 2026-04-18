// Perfil de usuario local — guardado en localStorage, sin necesidad de auth
// Usado para pre-cargar defaults en el wizard y enriquecer los prompts

export interface UserProfile {
  audiencia_objetivo: string;  // descripción libre del cliente ideal
  nicho_default: string;
  platform_default: string;
  tone_default: string;
}

const PROFILE_KEY = 'user_profile_v1';

export function loadProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? (JSON.parse(saved) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}
