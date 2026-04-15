// Mapea tipos de gancho → frameworks óptimos
// Lógica: ciertos ganchos encajan mejor con ciertas estructuras narrativas

import type { Framework, HookType, Niche } from './viral-frameworks';

// Ranking de compatibilidad hook → framework (score 0-10)
// Basado en el comportamiento real del gancho: lo que abre mejor se cierra mejor
const HOOK_FRAMEWORK_SCORES: Record<HookType, Record<Framework, number>> = {
  curiosidad: {
    OPEN_LOOP: 10,
    STORYTELLING: 9,
    HRAS: 8,
    PAS: 6,
    AIDA: 5,
    BAB: 4,
  },
  controversia: {
    PAS: 10,
    HRAS: 9,
    AIDA: 7,
    OPEN_LOOP: 6,
    STORYTELLING: 5,
    BAB: 3,
  },
  pregunta: {
    AIDA: 9,
    PAS: 8,
    HRAS: 8,
    OPEN_LOOP: 7,
    STORYTELLING: 5,
    BAB: 4,
  },
  declaracion_impactante: {
    BAB: 10,
    HRAS: 9,
    AIDA: 8,
    STORYTELLING: 7,
    PAS: 6,
    OPEN_LOOP: 5,
  },
  pattern_interrupt: {
    HRAS: 10,
    PAS: 8,
    AIDA: 7,
    OPEN_LOOP: 6,
    BAB: 5,
    STORYTELLING: 4,
  },
  mito: {
    PAS: 10,
    HRAS: 8,
    AIDA: 7,
    OPEN_LOOP: 6,
    BAB: 5,
    STORYTELLING: 4,
  },
  historia: {
    STORYTELLING: 10,
    BAB: 9,
    HRAS: 7,
    OPEN_LOOP: 6,
    AIDA: 5,
    PAS: 4,
  },
  dato_sorprendente: {
    AIDA: 10,
    HRAS: 9,
    PAS: 7,
    OPEN_LOOP: 6,
    BAB: 5,
    STORYTELLING: 4,
  },
  reto: {
    BAB: 10,
    AIDA: 8,
    HRAS: 7,
    PAS: 6,
    STORYTELLING: 5,
    OPEN_LOOP: 4,
  },
  confesion: {
    STORYTELLING: 10,
    HRAS: 8,
    BAB: 7,
    OPEN_LOOP: 6,
    PAS: 5,
    AIDA: 4,
  },
};

// Pistas lingüísticas para inferir el tipo de gancho a partir del tema
const HOOK_TYPE_HINTS: Record<HookType, RegExp[]> = {
  pregunta: [
    /^¿/, /\?\s*$/, /por qué/i, /cómo/i, /sabías que/i, /qué pasa/i,
    /qué har[íi]as/i, /qué tan/i, /cu[áa]nto/i, /cu[áa]ndo/i, /qui[ée]n/i,
    /y si/i, /ser[íi]as capaz/i, /alguna vez/i, /te has preguntado/i,
  ],
  mito: [
    /mito/i, /mentira/i, /falso/i, /no es cierto/i, /error/i, /equivocad/i,
    /todos creen/i, /la gente cree/i, /mal entend/i, /en realidad no/i,
    /deja de creer/i, /te han enga[ñn]ado/i, /est[áa]s haciendo mal/i,
    /lo que nadie te dice/i, /la verdad sobre/i, /el gran error/i,
  ],
  historia: [
    /historia/i, /me pas[oó]/i, /viv[íi]/i, /experiencia/i, /cuando yo/i,
    /un d[íi]a/i, /hace \d+/i, /en \d{4}/i, /primera vez/i, /mi historia/i,
    /te cuento/i, /os cuento/i, /les cuento/i, /lo que me pas[oó]/i,
    /desde que/i, /despu[ée]s de/i, /antes de que/i,
  ],
  reto: [
    /reto/i, /desaf[íi]o/i, /intenta/i, /prueba/i, /\d+\s*d[íi]as/i, /challenge/i,
    /lo logr[ée]/i, /haz esto/i, /semana de/i, /mes de/i, /30 d[íi]as/i,
    /en 7 d[íi]as/i, /en 21 d[íi]as/i, /consistencia/i,
  ],
  confesion: [
    /confesi[óo]n/i, /honest/i, /verdad/i, /admito/i, /secreto/i,
    /nunca te dije/i, /no pod[íi]a decir/i, /por fin/i, /debo confesar/i,
    /voy a ser honest/i, /lo que nunca cuento/i, /mi lado oscuro/i,
    /me cuesta admitir/i, /no me siento orgullos/i, /fallé/i,
  ],
  dato_sorprendente: [
    /\d+%/, /estad[íi]sticas?/i, /estudio/i, /dato/i, /investigaci[óo]n/i,
    /cient[íi]ficos/i, /seg[úu]n/i, /millones/i, /miles de/i,
    /al mes/i, /al a[ñn]o/i, /promedio/i, /de cada \d/i, /\d de cada/i,
    /veces m[áa]s/i, /horas al d[íi]a/i, /en n[úu]meros/i,
  ],
  controversia: [
    /deja de/i, /odio/i, /peor/i, /arruinando/i, /sobrevalorado/i, /basura/i,
    /nadie lo dice/i, /todos mienten/i, /t[óo]xico/i, /peligroso/i,
    /manipulaci[óo]n/i, /la industria/i, /no quieren que sepas/i,
    /est[áa]n equivocados/i, /problema con/i, /por esto fracasas/i,
    /te est[áa]n robando/i, /es una estafa/i,
  ],
  declaracion_impactante: [
    /cambi[óo]/i, /transform/i, /logr[ée]/i, /en \d+/i, /brutal/i,
    /quit[ée]/i, /dej[ée]/i, /empec[ée]/i, /dupliqu[ée]/i,
    /gan[ée] \d/i, /perd[íi] \d+/i, /ahorr[ée]/i, /consegu[íi]/i,
    /pas[ée] de/i, /de 0 a/i, /resultado fue/i, /funcion[oó]/i,
  ],
  pattern_interrupt: [
    /para/i, /espera/i, /olvida/i, /detente/i, /urgente/i, /atenci[óo]n/i,
    /antes de/i, /no hagas/i, /comet[íi] un error/i, /advertencia/i,
    /alerta/i, /importante/i, /l[ée]e esto/i, /no sigas/i, /para todo/i,
  ],
  curiosidad: [
    /secreto/i, /nadie/i, /nunca/i, /descubr[íi]/i, /no sab[íi]as/i,
    /no te han contado/i, /incre[íi]ble/i, /sorprendente/i, /lo que pas[oó]/i,
    /la raz[óo]n/i, /el motivo/i, /por esto/i, /el truco/i, /el m[ée]todo/i,
    /c[óo]mo es posible/i, /qu[ée] hay detr[áa]s/i,
  ],
};

// Devuelve los 3 frameworks más compatibles para un tipo de gancho
export function getBestFrameworksForHook(hookType: HookType, count = 3): Framework[] {
  const scores = HOOK_FRAMEWORK_SCORES[hookType];
  return (Object.entries(scores) as [Framework, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([fw]) => fw);
}

// Sugerencia automática de tipo de gancho a partir del tema
// Si no hay pistas claras, devuelve un default inteligente según nicho
export function suggestHookType(tema: string, niche?: Niche): HookType {
  const texto = tema.trim();

  // Escanea patrones explícitos
  for (const [type, patterns] of Object.entries(HOOK_TYPE_HINTS) as [HookType, RegExp[]][]) {
    if (patterns.some((p) => p.test(texto))) {
      return type;
    }
  }

  // Defaults por nicho (cuando el tema es neutro)
  const nicheDefaults: Partial<Record<Niche, HookType>> = {
    negocios: 'controversia',
    fitness: 'mito',
    finanzas: 'dato_sorprendente',
    tecnologia: 'curiosidad',
    lifestyle: 'confesion',
    educacion: 'mito',
    marketing: 'controversia',
    desarrollo_personal: 'historia',
    cocina: 'dato_sorprendente',
    viajes: 'historia',
    moda: 'declaracion_impactante',
    relaciones: 'confesion',
  };

  if (niche && nicheDefaults[niche]) return nicheDefaults[niche]!;
  return 'curiosidad';
}

// Explicación humana de por qué un framework combina con un hook
export function explainHookFrameworkMatch(hookType: HookType, framework: Framework): string {
  const explanations: Partial<Record<`${HookType}-${Framework}`, string>> = {
    'curiosidad-OPEN_LOOP': 'El bucle abierto mantiene la curiosidad del gancho hasta el final. Combo perfecto.',
    'curiosidad-STORYTELLING': 'Una historia personal resuelve la curiosidad de forma emocional y memorable.',
    'controversia-PAS': 'PAS amplifica el conflicto que abrió la controversia y ofrece alivio con la solución.',
    'historia-STORYTELLING': 'Si empiezas con historia, la estructura narrativa completa es el camino natural.',
    'mito-PAS': 'PAS es ideal para desmontar mitos: problema (el mito), agitación (por qué te frena), solución (la verdad).',
    'reto-BAB': 'BAB muestra el antes del reto y el después de superarlo. Ideal para motivar.',
    'dato_sorprendente-AIDA': 'AIDA capitaliza la atención del dato y la convierte en acción.',
    'pattern_interrupt-HRAS': 'HRAS mantiene el ritmo agresivo del pattern interrupt con micro-ganchos.',
    'declaracion_impactante-BAB': 'BAB da contexto al antes/después que prometió la declaración.',
    'confesion-STORYTELLING': 'La confesión ES una historia personal. Combo emocionalmente poderoso.',
    'pregunta-AIDA': 'La pregunta genera interés y AIDA lo canaliza hasta la acción.',
  };

  return (
    explanations[`${hookType}-${framework}` as const] ||
    `${framework} funciona bien con ganchos de ${hookType} porque mantiene la promesa del inicio.`
  );
}
