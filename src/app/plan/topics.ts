export type Angulo = 'estrategia' | 'audiovisual' | 'negocio' | 'criterio';
export type TopicObjective = 'alcance' | 'educativo' | 'autoridad';

export interface PlanTopic {
  text: string;
  angulo: Angulo;
  objetivo: TopicObjective;
}

export interface S3Tension {
  text: string;
}

export interface S3Question {
  text: string;
}

export const PLAN_TOPICS: PlanTopic[] = [
  // ── ESTRATEGIA ──────────────────────────────────────────────────────────────
  { text: 'Por qué la consistencia mata la creatividad', angulo: 'estrategia', objetivo: 'alcance' },
  { text: 'El error que comete el 90% al intentar crecer en Instagram', angulo: 'estrategia', objetivo: 'alcance' },
  { text: 'Por qué publicas demasiado y eso te está costando alcance', angulo: 'estrategia', objetivo: 'alcance' },
  { text: 'La razón por la que tu contenido educativo no convierte', angulo: 'estrategia', objetivo: 'alcance' },
  { text: 'Por qué las tendencias te están haciendo daño', angulo: 'estrategia', objetivo: 'alcance' },
  { text: 'Por qué no necesitas más seguidores para monetizar', angulo: 'estrategia', objetivo: 'alcance' },
  { text: 'La trampa del contenido de nicho que nadie te explica', angulo: 'estrategia', objetivo: 'alcance' },
  { text: 'Por qué tus mejores ideas no funcionan y las peores sí', angulo: 'estrategia', objetivo: 'alcance' },

  { text: 'Cómo estructuro mis videos antes de grabar', angulo: 'estrategia', objetivo: 'educativo' },
  { text: 'Cómo saber si un tema tiene potencial antes de grabarlo', angulo: 'estrategia', objetivo: 'educativo' },
  { text: 'Mi proceso completo para crear un video de 60 segundos', angulo: 'estrategia', objetivo: 'educativo' },
  { text: 'Cómo planifico un mes de contenido en menos de 2 horas', angulo: 'estrategia', objetivo: 'educativo' },
  { text: 'Cómo saber qué tipo de contenido funciona para tu etapa', angulo: 'estrategia', objetivo: 'educativo' },
  { text: 'Cómo analizar tus métricas sin volverte loco', angulo: 'estrategia', objetivo: 'educativo' },
  { text: 'Cómo reutilizar un video en 5 formatos distintos', angulo: 'estrategia', objetivo: 'educativo' },
  { text: 'Cómo crear un gancho que funcione en los primeros 3 segundos', angulo: 'estrategia', objetivo: 'educativo' },

  { text: 'Por qué el algoritmo no es tu problema', angulo: 'estrategia', objetivo: 'autoridad' },
  { text: 'Lo que nadie te dice sobre el gancho en los primeros 3 segundos', angulo: 'estrategia', objetivo: 'autoridad' },
  { text: 'Qué hace que un video se comparta (no es lo que crees)', angulo: 'estrategia', objetivo: 'autoridad' },
  { text: 'Qué separa a un creador de contenido de un creador con autoridad', angulo: 'estrategia', objetivo: 'autoridad' },
  { text: 'El tipo de contenido que deberías estar haciendo según tu etapa', angulo: 'estrategia', objetivo: 'autoridad' },
  { text: 'El contenido que más me ha costado y por qué valió la pena', angulo: 'estrategia', objetivo: 'autoridad' },
  { text: 'Qué hace que un creador crezca lento pero de forma real', angulo: 'estrategia', objetivo: 'autoridad' },

  // ── AUDIOVISUAL ─────────────────────────────────────────────────────────────
  { text: 'La mentira del equipo caro', angulo: 'audiovisual', objetivo: 'alcance' },
  { text: 'Por qué tu edición es demasiado larga y nadie te lo dice', angulo: 'audiovisual', objetivo: 'alcance' },
  { text: 'Por qué los subtítulos cambian por completo el rendimiento de un video', angulo: 'audiovisual', objetivo: 'alcance' },
  { text: 'La diferencia entre un video que se ve y uno que se guarda', angulo: 'audiovisual', objetivo: 'alcance' },
  { text: 'El error de audio que destruye la confianza en segundos', angulo: 'audiovisual', objetivo: 'alcance' },
  { text: 'Por qué el color no es lo que le da coherencia a tu marca visual', angulo: 'audiovisual', objetivo: 'alcance' },

  { text: 'Cómo mejorar el audio de tus videos sin gastar dinero', angulo: 'audiovisual', objetivo: 'educativo' },
  { text: 'El setup mínimo para empezar a grabar hoy', angulo: 'audiovisual', objetivo: 'educativo' },
  { text: 'Cómo iluminar una escena con luz natural', angulo: 'audiovisual', objetivo: 'educativo' },
  { text: 'Cómo hacer una edición que mantiene la atención', angulo: 'audiovisual', objetivo: 'educativo' },
  { text: 'Cómo grabar contenido en vertical sin que se vea mal', angulo: 'audiovisual', objetivo: 'educativo' },
  { text: 'Cómo planear un video con 0 improvisación', angulo: 'audiovisual', objetivo: 'educativo' },
  { text: 'Cómo hacer thumbnails que funcionan en mobile', angulo: 'audiovisual', objetivo: 'educativo' },
  { text: 'Cómo hacer transiciones que no distraigan', angulo: 'audiovisual', objetivo: 'educativo' },
  { text: 'Cómo grabar un video de presentación que funcione', angulo: 'audiovisual', objetivo: 'educativo' },
  { text: 'Cómo usar el B-roll para que tu video se sienta cinematográfico', angulo: 'audiovisual', objetivo: 'educativo' },

  { text: 'Por qué la calidad visual no es lo que crees', angulo: 'audiovisual', objetivo: 'autoridad' },
  { text: 'Lo que separa un video amateur de uno profesional (no es el equipo)', angulo: 'audiovisual', objetivo: 'autoridad' },
  { text: 'Qué hace que un B-roll sea bueno de verdad', angulo: 'audiovisual', objetivo: 'autoridad' },
  { text: 'Qué le da una estética coherente a tu feed (no son los filtros)', angulo: 'audiovisual', objetivo: 'autoridad' },
  { text: 'Por qué el ritmo de edición importa más que los efectos', angulo: 'audiovisual', objetivo: 'autoridad' },
  { text: 'Qué convierte a un videógrafo en un narrador', angulo: 'audiovisual', objetivo: 'autoridad' },
  { text: 'Lo que la imagen de un video comunica antes de que digas una palabra', angulo: 'audiovisual', objetivo: 'autoridad' },

  // ── NEGOCIO ──────────────────────────────────────────────────────────────────
  { text: 'La trampa del trabajo gratis a cambio de exposición', angulo: 'negocio', objetivo: 'alcance' },
  { text: 'Por qué el precio más bajo no te da más clientes', angulo: 'negocio', objetivo: 'alcance' },
  { text: 'La diferencia entre ser barato y ser accesible', angulo: 'negocio', objetivo: 'alcance' },
  { text: 'El error más común al cotizar un proyecto de video', angulo: 'negocio', objetivo: 'alcance' },
  { text: 'Por qué perder un cliente puede ser lo mejor que te pasa', angulo: 'negocio', objetivo: 'alcance' },
  { text: 'La razón por la que tus clientes no te recomiendan', angulo: 'negocio', objetivo: 'alcance' },
  { text: 'Por qué el cliente difícil siempre avisa antes de contratarte', angulo: 'negocio', objetivo: 'alcance' },

  { text: 'Cómo establecer mi precio como creador freelance', angulo: 'negocio', objetivo: 'educativo' },
  { text: 'Cómo estructurar una propuesta que cierra', angulo: 'negocio', objetivo: 'educativo' },
  { text: 'Cómo gestionar múltiples proyectos sin perder calidad', angulo: 'negocio', objetivo: 'educativo' },
  { text: 'Cómo cobrar por tu tiempo sin que parezca caro', angulo: 'negocio', objetivo: 'educativo' },
  { text: 'Cómo pedirle testimonio a un cliente sin que sea incómodo', angulo: 'negocio', objetivo: 'educativo' },
  { text: 'Cómo hacer contratos simples que te protejan', angulo: 'negocio', objetivo: 'educativo' },
  { text: 'Cómo negociar sin sentirte incómodo', angulo: 'negocio', objetivo: 'educativo' },
  { text: 'Cómo presentar un proyecto sin que el cliente cambie todo al final', angulo: 'negocio', objetivo: 'educativo' },

  { text: 'Qué hace que un cliente vuelva vs que no vuelva nunca', angulo: 'negocio', objetivo: 'autoridad' },
  { text: 'Lo que aprendí de mis peores clientes', angulo: 'negocio', objetivo: 'autoridad' },
  { text: 'Por qué tu portfolio no es lo que vende', angulo: 'negocio', objetivo: 'autoridad' },
  { text: 'Qué te da sostenibilidad real como freelance', angulo: 'negocio', objetivo: 'autoridad' },
  { text: 'Lo que nadie cuenta sobre vivir del contenido', angulo: 'negocio', objetivo: 'autoridad' },
  { text: 'Qué hace que un creador pase de freelance a negocio', angulo: 'negocio', objetivo: 'autoridad' },
  { text: 'Por qué la mayoría de freelances no salen del ciclo de escasez', angulo: 'negocio', objetivo: 'autoridad' },

  // ── CRITERIO ─────────────────────────────────────────────────────────────────
  { text: 'Por qué la autenticidad se convirtió en otra fórmula', angulo: 'criterio', objetivo: 'alcance' },
  { text: 'Por qué el contenido de valor no siempre aporta valor', angulo: 'criterio', objetivo: 'alcance' },
  { text: 'La diferencia entre un creador y un productor de contenido', angulo: 'criterio', objetivo: 'alcance' },
  { text: 'Por qué la mayoría de educadores de marketing no hacen marketing', angulo: 'criterio', objetivo: 'alcance' },
  { text: 'Por qué el formato no es la estrategia', angulo: 'criterio', objetivo: 'alcance' },
  { text: 'Por qué el engagement bajo no siempre es un problema', angulo: 'criterio', objetivo: 'alcance' },
  { text: 'La trampa de optimizar para el algoritmo en lugar del espectador', angulo: 'criterio', objetivo: 'alcance' },
  { text: 'El problema con crear contenido para todos', angulo: 'criterio', objetivo: 'alcance' },
  { text: 'Lo que el contenido viral no te está diciendo', angulo: 'criterio', objetivo: 'alcance' },

  { text: 'Qué significa realmente tener voz propia en el contenido', angulo: 'criterio', objetivo: 'autoridad' },
  { text: 'La diferencia entre inspirar y replicar', angulo: 'criterio', objetivo: 'autoridad' },
  { text: 'Qué hace que el criterio sea más valioso que las técnicas', angulo: 'criterio', objetivo: 'autoridad' },
  { text: 'Por qué el crecimiento rápido puede ser una trampa', angulo: 'criterio', objetivo: 'autoridad' },
  { text: 'Qué le pasa al creador que siempre sigue lo que funciona', angulo: 'criterio', objetivo: 'autoridad' },
  { text: 'Qué pienso de los cursos que enseñan fórmulas de contenido', angulo: 'criterio', objetivo: 'autoridad' },
  { text: 'Lo que separa un buen guion de uno que parece IA', angulo: 'criterio', objetivo: 'autoridad' },
  { text: 'Qué es lo que de verdad comunica autoridad en un video', angulo: 'criterio', objetivo: 'autoridad' },
  { text: 'Por qué enseñar lo que sé es más difícil de lo que parece', angulo: 'criterio', objetivo: 'autoridad' },
  { text: 'Lo que la obsesión por el nicho le hace a tu creatividad', angulo: 'criterio', objetivo: 'autoridad' },
];

export const S3_TENSIONES: S3Tension[] = [
  { text: 'Cobrar barato para que te contraten vs cobrar lo que vale para atraer al cliente correcto' },
  { text: 'Hacer lo que el algoritmo pide vs hacer lo que realmente quieres decir' },
  { text: 'Mostrar resultados de clientes vs proteger la confidencialidad de tus proyectos' },
  { text: 'Ser consistente vs esperar a tener algo realmente bueno que decir' },
  { text: 'Enseñar todo gratis para ganar autoridad vs guardar los mejores insights para clientes' },
  { text: 'Hacer contenido de nicho para crecer vs diversificar para no quemarte' },
  { text: 'Hacer contenido que ayuda vs hacer contenido que convierte' },
  { text: 'Parecer más grande de lo que eres vs ser honesto sobre el tamaño de tu negocio' },
  { text: 'Trabajar con marcas que pagan bien vs trabajar solo con proyectos en los que crees' },
  { text: 'Tener un proceso replicable vs adaptarte a cada cliente' },
  { text: 'Decir que no a proyectos mal pagados vs necesitar el flujo de caja' },
  { text: 'Publicar cuando no tienes nada que decir vs solo publicar cuando tienes algo valioso' },
  { text: 'Colaborar con competidores vs proteger tu posicionamiento único' },
  { text: 'Compartir errores propios vs mantener la autoridad percibida' },
  { text: 'Querer ir más lento y hacer menos vs la presión de estar siempre presente' },
];

export const S3_PREGUNTAS: S3Question[] = [
  { text: '¿Qué es lo primero que hiciste en tu carrera que nunca le contarías a un cliente?' },
  { text: '¿Cuándo fue la última vez que aceptaste un proyecto que sabías que no ibas a disfrutar?' },
  { text: '¿Qué consejo de contenido seguiste meses antes de darte cuenta de que era malo?' },
  { text: '¿Hay algo en tu industria que todo el mundo hace y que tú crees que está mal?' },
  { text: '¿Cuándo fue la última vez que sentiste que estabas creando por obligación en lugar de por convicción?' },
  { text: '¿Qué aprendiste de un proyecto que salió mal que nunca publicas pero que es oro puro?' },
  { text: '¿Qué parte de tu trabajo la gente sobrevalora y qué parte subestima?' },
  { text: '¿Cuándo tomaste una decisión de negocio que parecía mala pero que resultó bien?' },
  { text: '¿Qué te hubiera dicho a ti mismo hace 3 años sobre cómo se siente este trabajo en realidad?' },
  { text: '¿Hay una creencia que tenías sobre la creatividad que ya no tienes?' },
  { text: '¿Qué harías diferente si empezaras hoy sin reputación, sin contactos, sin portfolio?' },
  { text: '¿Cuándo fue la última vez que dijiste que no y te alegró haberlo hecho?' },
  { text: '¿Cuál es la conversación más incómoda que has tenido con un cliente y cómo salió?' },
  { text: '¿Qué cosa real has sacrificado para mantener tu negocio?' },
  { text: '¿En qué momento dejaste de querer gustar a todo el mundo con tu contenido?' },
  { text: '¿Hay algo que enseñas que tú mismo no siempre haces?' },
  { text: '¿Cuándo fue la última vez que enviaste algo y pensaste "esto no es suficientemente bueno"?' },
  { text: '¿Qué mito del éxito como creador te costó más tiempo creer?' },
  { text: '¿En qué se parece tu trabajo a cuando empezaste y en qué no se parece en nada?' },
  { text: '¿Qué es lo más caro que has aprendido (en tiempo, dinero o energía)?' },
  { text: '¿Qué crees que te da autoridad real frente a lo que solo la simula?' },
  { text: '¿Hay algo que estás haciendo ahora mismo que sabes que no es sostenible?' },
  { text: '¿Cuál fue la primera vez que sentiste que tu trabajo valía lo que cobrabas?' },
  { text: '¿Qué dirías si un cliente potencial te preguntara por qué cobras lo que cobras?' },
  { text: '¿Hay un tipo de cliente con el que nunca volverías a trabajar? ¿Por qué?' },
];
