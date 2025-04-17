const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

async function fetchWithRetries(apiCallFn, retries = MAX_RETRIES, delay = RETRY_DELAY_MS) {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCallFn();
    } catch (error) {
      const status = error?.response?.status || error?.status;
      if (status === 429 && i < retries - 1) {
        console.warn(`Intento ${i + 1} fallido con error 429. Reintentando en ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error("Error crítico al hacer fetch:", error);
        throw error;
      }
    }
  }
}

/**
 * Obtiene el usuario de Instagram de un artista usando GPT.
 */
export async function getArtistInstagram(artistName) {
  const prompt = `¿Cuál es el usuario de Instagram del artista musical llamado "${artistName}"? Solo responde con el nombre de usuario, sin símbolos extra.`;
  console.log("BUSCANDO IA");
  console.log("Artista llamado se busca el usuario CON CHAT GPT:", artistName);

  return await fetchWithRetries(async () => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!data || !data.choices || !data.choices[0]) {
      console.error("Respuesta inesperada de OpenAI:", data);
      return { instagram: "No disponible" };
    }

    // Corregido: declarar 'username' con const en lugar de asignarlo sin declarar
    const username = data.choices[0].message.content.trim();  // ✅ Se captura correctamente el string
    console.log("Respuesta de IA:", username);
    return { instagram: username };
  });
}

export async function getSimilarArtistsWithInstagram(artistName) {
  const prompt = `Dame una lista de 5 artistas similares a ${artistName}, con sus nombres de usuario de Instagram. Si no hay Instagram, indica "No disponible".`;

  return await fetchWithRetries(async () => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!data || !data.choices || !data.choices[0]) {
      console.error("Respuesta inesperada de OpenAI:", data);
      return [];
    }

    const listText = data.choices[0].message.content;
    const lines = listText.split("\n").filter(Boolean);

    return lines.map(line => {
      const [namePart, instaPart] = line.split("-");
      return {
        name: namePart?.trim() || "Desconocido",
        instagram: instaPart?.replace("@", "").trim() || "No disponible"
      };
    });
  });
}
