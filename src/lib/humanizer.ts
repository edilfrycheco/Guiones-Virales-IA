// Motor de humanización de texto
// Basado en investigación de patrones de escritura humana vs IA
// Objetivo: hacer que los guiones sean indistinguibles de escritura humana

export interface HumanizerConfig {
  nivel: 'sutil' | 'moderado' | 'agresivo';
  regionalismos: 'neutro' | 'mexico' | 'espana' | 'argentina' | 'colombia';
  personalidad: 'directo' | 'reflexivo' | 'sarcastico' | 'empatico';
}

// Palabras y frases que los detectores de IA identifican como artificiales
const AI_TELLTALE_WORDS = [
  'sin embargo', 'además', 'por lo tanto', 'en consecuencia', 'cabe destacar',
  'es importante mencionar', 'vale la pena señalar', 'en resumen',
  'fundamentalmente', 'esencialmente', 'indudablemente', 'ciertamente',
  'efectivamente', 'significativamente', 'sustancialmente', 'particularmente',
  'adicionalmente', 'previamente', 'posteriormente', 'simultáneamente',
  'respectivamente', 'inherentemente', 'notablemente', 'considerablemente',
];

// Reemplazos naturales para lenguaje de IA
const NATURAL_REPLACEMENTS: Record<string, string[]> = {
  'sin embargo': ['pero', 'la cosa es que', 'ahora bien', 'ojo', 'aunque'],
  'además': ['y encima', 'ah, y otra cosa', 'también', 'y mira'],
  'por lo tanto': ['así que', 'entonces', 'o sea', 'total que'],
  'en consecuencia': ['y claro', 'resultado', 'lo que pasa es que'],
  'cabe destacar': ['lo importante aquí es', 'fíjate en esto', 'presta atención'],
  'es importante mencionar': ['te digo algo', 'escucha esto', 'dato clave'],
  'fundamentalmente': ['básicamente', 'en el fondo', 'a fin de cuentas'],
  'esencialmente': ['o sea', 'básicamente', 'al final del día'],
  'indudablemente': ['sin duda', 'seguro', 'de eso no hay duda'],
  'significativamente': ['mucho', 'bastante', 'de verdad', 'en serio'],
  'adicionalmente': ['y aparte', 'también', 'sumado a eso'],
  'efectivamente': ['exacto', 'sí', 'tal cual'],
};

// Muletillas y expresiones humanas naturales por región
const REGIONAL_FILLERS: Record<string, string[]> = {
  neutro: ['mira', 'te cuento', 'la verdad', 'fíjate', 'escucha', 'ojo', 'la cosa es'],
  mexico: ['wey', 'neta', 'la neta', 'no manches', 'órale', 'chido', 'a poco'],
  espana: ['tío', 'mola', 'flipas', 'venga', 'a ver', 'joer', 'es que'],
  argentina: ['che', 'mirá', 'boludo', 'te juro', 'es una masa', 'posta', 're'],
  colombia: ['parce', 'marica', 'qué chimba', 'severo', 'pilas', 'de una', 'bacano'],
};

// Patrones de imperfección humana (los humanos NO son perfectos al escribir)
const HUMAN_IMPERFECTIONS = {
  // Los humanos usan frases incompletas
  sentence_fragments: [
    'Y sí.',
    'Así de simple.',
    'Punto.',
    'Ni más ni menos.',
    'Literal.',
    'Créeme.',
    'Suena loco, lo sé.',
    'Ya sé, ya sé.',
  ],
  // Los humanos repiten para enfatizar
  emphasis_repetitions: [
    'pero de verdad, de verdad',
    'esto es clave, clave, clave',
    'no, no, no',
    'sí, sí, sí',
  ],
  // Autocorrecciones (muy humano)
  self_corrections: [
    'bueno, más bien',
    'o sea, lo que quiero decir es',
    'bueno, no exactamente, pero',
    'a ver, me explico mejor',
    'no, espera, déjame reformular',
  ],
  // Pausas y pensamiento en voz alta
  thinking_pauses: [
    '...',
    'mmm',
    'a ver...',
    'déjame pensar...',
  ],
};

// Instrucciones del sistema para humanización (usado en prompts de IA)
export function getHumanizerSystemPrompt(config: HumanizerConfig): string {
  const regionExamples = REGIONAL_FILLERS[config.regionalismos].join(', ');

  return `REGLAS DE HUMANIZACIÓN — APLICA TODAS SIN EXCEPCIÓN:

1. VARIACIÓN DE ESTRUCTURA: Alterna entre oraciones cortas (3-5 palabras), medias (8-12) y largas (15+). Los humanos NO escriben con longitud uniforme. Incluye al menos 2 fragmentos de oración (sin verbo).

2. IMPERFECCIONES NATURALES: Incluye al menos una autocorrección ("bueno, más bien..." o "o sea, lo que quiero decir es..."). Los humanos se corrigen sobre la marcha.

3. ELIMINA CONECTORES FORMALES: PROHIBIDO usar: sin embargo, además, por lo tanto, cabe destacar, es importante mencionar, fundamentalmente, esencialmente, indudablemente, significativamente, adicionalmente. Reemplaza con lenguaje coloquial.

4. RITMO IRREGULAR: No sigas un patrón predecible. Cambia el ritmo abruptamente. Una frase larga seguida de "Así de simple." es muy humano.

5. EXPRESIONES REGIONALES: Usa expresiones de estilo ${config.regionalismos}: ${regionExamples}. Deben sentirse naturales, no forzadas.

6. PERSONALIDAD ${config.personalidad.toUpperCase()}: ${getPersonalityInstructions(config.personalidad)}

7. EVITA LISTAS PERFECTAS: Los humanos no numeran todo ni usan bullet points simétricos en conversación. Mezcla formatos.

8. OPINIONES Y JUICIO: Incluye opiniones personales, preferencias y juicios subjetivos. La IA tiende a ser neutral. Los humanos toman partido.

9. REFERENCIAS CONCRETAS: Usa números específicos ("3 semanas", no "un tiempo"), marcas reales, situaciones cotidianas reconocibles.

10. EMOCIONES EXPLÍCITAS: Expresa frustración, sorpresa, emoción, duda. "Esto me volvió loco" > "Esto fue sorprendente".

NIVEL DE HUMANIZACIÓN: ${config.nivel.toUpperCase()}
${config.nivel === 'sutil' ? 'Aplica las reglas con moderación. El texto debe sonar profesional pero humano.' : ''}
${config.nivel === 'moderado' ? 'Aplica todas las reglas de forma equilibrada. Como si un creador de contenido experimentado estuviera hablando.' : ''}
${config.nivel === 'agresivo' ? 'Aplica todas las reglas al máximo. Debe sonar completamente como un humano hablando de forma espontánea. Incluye más muletillas, autocorrecciones y emociones.' : ''}`;
}

function getPersonalityInstructions(personality: string): string {
  const instructions: Record<string, string> = {
    directo: 'Ve al grano. Sin rodeos. Frases cortas y contundentes. Opiniones fuertes. "Esto funciona. Lo otro no. Punto."',
    reflexivo: 'Piensa en voz alta. Haz preguntas retóricas. Muestra el proceso de pensamiento. "Me puse a pensar y... la verdad es que tiene sentido cuando lo ves así."',
    sarcastico: 'Usa ironía y humor ácido con cariño. Exagera para hacer un punto. "Ah sí, porque claramente todos nacimos sabiendo de inversiones, ¿no?"',
    empatico: 'Conecta emocionalmente. Valida sentimientos. Usa "te entiendo", "yo también pasé por eso". Muestra vulnerabilidad.',
  };
  return instructions[personality] || instructions.directo;
}

// Función para post-procesar texto y hacerlo más humano (reglas deterministas)
export function postProcessHumanize(text: string, config: HumanizerConfig): string {
  let result = text;

  // 1. Reemplazar conectores formales de IA
  for (const [aiWord, replacements] of Object.entries(NATURAL_REPLACEMENTS)) {
    const regex = new RegExp(aiWord, 'gi');
    if (regex.test(result)) {
      const replacement = replacements[Math.floor(Math.random() * replacements.length)];
      result = result.replace(regex, replacement);
    }
  }

  // 2. Verificar que no queden palabras delatoras de IA
  for (const word of AI_TELLTALE_WORDS) {
    if (result.toLowerCase().includes(word.toLowerCase())) {
      const simpleReplacements: Record<string, string> = {
        'particularmente': 'sobre todo',
        'posteriormente': 'después',
        'previamente': 'antes',
        'simultáneamente': 'al mismo tiempo',
        'respectivamente': 'cada uno',
        'inherentemente': 'por naturaleza',
        'notablemente': 'mucho',
        'considerablemente': 'bastante',
        'sustancialmente': 'mucho',
        'ciertamente': 'claro que sí',
        'en resumen': 'al final',
        'vale la pena señalar': 'te digo algo',
      };
      if (simpleReplacements[word]) {
        result = result.replace(new RegExp(word, 'gi'), simpleReplacements[word]);
      }
    }
  }

  return result;
}

export {
  AI_TELLTALE_WORDS,
  NATURAL_REPLACEMENTS,
  REGIONAL_FILLERS,
  HUMAN_IMPERFECTIONS,
};
