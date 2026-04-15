// Cliente de IA para generación de guiones
// Soporta Anthropic Claude como motor principal
// Incluye reintentos automáticos con exponential backoff para errores 529/503/429

interface AIResponse {
  content: string;
  model: string;
}

// Códigos HTTP que justifican reintento automático
const RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504, 529];
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // 2s, 4s, 8s

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callAnthropicAPI(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<Response> {
  const trimmedSystem = systemPrompt?.trim();
  const trimmedUser = userPrompt?.trim();

  if (!trimmedUser) {
    throw new Error('El prompt del usuario no puede estar vacío');
  }

  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      ...(trimmedSystem ? { system: trimmedSystem } : {}),
      messages: [{ role: 'user', content: trimmedUser }],
    }),
  });
}

export async function generateWithAI(
  systemPrompt: string,
  userPrompt: string,
  styleContext?: string
): Promise<AIResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const finalSystem = styleContext ? `${systemPrompt}\n\n${styleContext}` : systemPrompt;
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

  let lastError: Error | null = null;

  // Intento inicial + reintentos automáticos
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await callAnthropicAPI(apiKey, model, finalSystem, userPrompt);

      // Éxito
      if (response.ok) {
        const data = await response.json();
        return {
          content: data.content[0].text,
          model,
        };
      }

      // Error recuperable: reintentar con backoff
      if (RETRYABLE_STATUS_CODES.includes(response.status) && attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt); // 2s, 4s, 8s
        console.log(`[AI] Error ${response.status}, reintentando en ${delay}ms (intento ${attempt + 1}/${MAX_RETRIES})`);
        await sleep(delay);
        continue;
      }

      // Error no recuperable o agotamos reintentos
      const errorText = await response.text();
      const friendlyMessage = getFriendlyErrorMessage(response.status, errorText);
      throw new Error(friendlyMessage);

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // Si es error de red (fetch falla), también reintentamos
      if (attempt < MAX_RETRIES && error instanceof TypeError) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        await sleep(delay);
        continue;
      }
      throw lastError;
    }
  }

  throw lastError || new Error('No se pudo completar la generación');
}

function getFriendlyErrorMessage(status: number, errorText: string): string {
  switch (status) {
    case 529:
      return 'Los servidores de Anthropic están saturados en este momento. Ya reintentamos 3 veces. Por favor, espera 1-2 minutos y vuelve a intentarlo. Si persiste, prueba cambiar a Haiku 4.5 (claude-haiku-4-5-20251001) que suele estar menos saturado.';
    case 429:
      return 'Alcanzaste el límite de peticiones por minuto de Anthropic. Espera 30 segundos y reintenta.';
    case 401:
      return 'Tu API key de Anthropic es inválida o expiró. Verifica en console.anthropic.com que sigue activa.';
    case 402:
      return 'Tu cuenta de Anthropic no tiene crédito. Ve a console.anthropic.com → Billing y agrega saldo.';
    case 404:
      return `El modelo configurado no existe o no está disponible en tu cuenta. Verifica la variable AI_MODEL en Vercel. Modelos válidos: claude-sonnet-4-6, claude-opus-4-6, claude-haiku-4-5-20251001`;
    case 500:
    case 502:
    case 503:
    case 504:
      return `Error temporal del servidor de Anthropic (${status}). Reintentamos varias veces sin éxito. Espera unos minutos y reintenta.`;
    default:
      return `API Error (${status}): ${errorText}`;
  }
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
