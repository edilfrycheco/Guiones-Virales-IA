// Cliente de IA para generación de guiones
// Soporta Anthropic Claude como motor principal

interface AIResponse {
  content: string;
  model: string;
}

export async function generateWithAI(
  systemPrompt: string,
  userPrompt: string
): Promise<AIResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  // Modelo por defecto: claude-sonnet-4-6 (último modelo más capaz)
  // Override via env var AI_MODEL si quieres otro modelo
  const model = process.env.AI_MODEL || 'claude-sonnet-4-6';

  if (!apiKey) {
    // Modo demo: generar respuesta basada en plantillas
    return {
      content: generateDemoResponse(userPrompt),
      model: 'demo-mode',
    };
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return {
    content: data.content[0].text,
    model,
  };
}

function generateDemoResponse(prompt: string): string {
  // Extrae el tema del prompt
  const temaMatch = prompt.match(/TEMA:\s*(.+)/);
  const tema = temaMatch ? temaMatch[1].trim() : 'tu nicho';

  return `🎯 GANCHO (primeros 2-3 segundos):
Te voy a contar algo sobre ${tema} que ojalá alguien me hubiera dicho hace 2 años. Y no, no es lo que piensas.

📝 CUERPO:
Mira, yo estaba como tú. Buscando en Google, viendo videos, intentando entender ${tema}... y nada.

Todo el mundo te dice lo mismo. "Haz esto, haz lo otro". Pero nadie te dice la parte incómoda.

La verdad — y esto me costó aprenderlo — es que el 90% de lo que te enseñan sobre ${tema} está desactualizado. Punto.

¿Sabes qué funciona de verdad? Voy a ser directo porque no me gusta dar rodeos.

Lo que me cambió todo fue dejar de copiar y empezar a entender el POR QUÉ detrás de cada estrategia. Suena obvio, lo sé. Pero la mayoría salta directo a la táctica sin entender la lógica.

Y cuando entiendes la lógica de ${tema}... ahí es donde todo hace clic.

Bueno, no es que sea magia. Me tomó como 3 semanas de prueba y error. Pero la diferencia fue BRUTAL.

🚀 CTA:
Si quieres que te comparta los 3 pasos exactos que usé, guarda este video y sígueme que lo publico mañana.

💡 NOTAS DE GRABACIÓN:
- Empieza mirando directo a cámara, con expresión de "te voy a contar un secreto"
- En la parte del "90% está desactualizado", haz una pausa antes de "Punto" — dale peso
- Ritmo: empieza normal, acelera en la parte del medio, baja el tono en el cierre para crear intimidad

⚠️ MODO DEMO: Este guión fue generado con plantillas. Configura tu ANTHROPIC_API_KEY para obtener guiones personalizados con IA.`;
}
