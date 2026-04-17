import type { Framework, HookType, Niche, Platform, ScriptLength, Tone, ContentObjective, UniversalPillar } from '@/lib/viral-frameworks';
import type { HumanizerConfig } from '@/lib/humanizer';

export interface GeneratedHook {
  text: string;
  reason: string;
}

export interface GeneratedScript {
  framework: Framework;
  content: string;
}

export type WizardStep = 1 | 2 | 3 | 4;

export interface WizardState {
  step: WizardStep;
  // Step 1
  tema: string;
  hookType: HookType;
  hookTypeIsAuto: boolean;
  contentObjective: ContentObjective | null;
  contentObjectiveIsAuto: boolean;
  universalPillar: UniversalPillar | null;
  universalPillarIsAuto: boolean;
  // Step 2 config
  platform: Platform;
  tone: Tone;
  niche: Niche;
  length: ScriptLength;
  cantidad: number;
  humanizer: HumanizerConfig;
  useMyStyle: boolean;
  // Step 2 results
  generatedHooks: GeneratedHook[];
  selectedHookIndex: number | null;
  // Step 3 config
  frameworks: Framework[];
  incluirCta: boolean;
  contexto: string;
  audiencia: string;
  // Step 3 results
  generatedScripts: GeneratedScript[];
  selectedScriptIndex: number | null;
  // Step 4
  editedScript: string;
  editInstruction: string;
}
