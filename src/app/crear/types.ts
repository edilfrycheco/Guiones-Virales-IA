import type { Niche, Platform, ScriptLength, Tone } from '@/lib/viral-frameworks';
import type { HumanizerConfig } from '@/lib/humanizer';
import type { WeekObjective } from '@/lib/user-profile';

export interface GeneratedHook {
  text: string;
  reason: string;
}

export type WizardStep = 1 | 2 | 3;

export interface WizardState {
  step: WizardStep;

  // Paso 1 — Tema y opiniones
  tema: string;
  opinionIA: string;          // lo que la IA opina sobre el tema (genera la app)
  opinionUsuario: string;     // lo que el usuario realmente piensa
  weekObjective: WeekObjective | null; // contexto de la semana actual (alcance/educativo/conexion/autoridad)

  // Defaults técnicos (vienen del perfil, no se eligen en el wizard)
  platform: Platform;
  tone: Tone;
  niche: Niche;
  length: ScriptLength;
  humanizer: HumanizerConfig;

  // Paso 2 — Ganchos
  generatedHooks: GeneratedHook[];
  selectedHookIndex: number | null;

  // Paso 3 — Guión
  generatedScript: string;
  editedScript: string;
  editInstruction: string;
}
