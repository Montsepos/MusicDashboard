
// const MAX_RETRIES = 3;
// const RETRY_DELAY_MS = 3000;

// async function fetchWithRetries(apiCallFn, retries = MAX_RETRIES, delay = RETRY_DELAY_MS) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       return await apiCallFn();
//     } catch (error) {
//       const status = error?.response?.status || error?.status;
//       if (status === 429 && i < retries - 1) {
//         console.warn(`Intento ${i + 1} fallido con error 429. Reintentando en ${delay}ms...`);
//         await new Promise(resolve => setTimeout(resolve, delay));
//       } else {
//         console.error("Error crítico al hacer fetch:", error);
//         throw error;
//       }
//     }
//   }
// }
// export async function getArtistMilestones(artistName) {
//   const prompt = `
//     Dime los 5 hitos más importantes del artista musical "${artistName}", 
//     incluyendo premios ganados, shows destacados o reconocimientos clave.
//     Devuélvelo como un listado numerado.
//   `.trim();

//   const data = await fetchWithRetries(async () => {
//     const res = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: prompt }],
//       }),
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       throw new Error(`Error al llamar a OpenAI: ${res.status} ${res.statusText} - ${errorText}`);
//     }

//     return await res.json();
//   });

//   const content = data?.choices?.[0]?.message?.content;

//   if (!content) {
//     console.error("Respuesta inesperada de OpenAI:", data);
//     return [];
//   }

//   return content
//     .split("\n")
//     .map(line => line.trim())
//     .filter(line => /^\d+\./.test(line));  // Solo líneas numeradas (1., 2., etc.)
// }

// export async function getArtistInstagram(artistName, artistgenres) {
//   const prompt = `¿Cuál es el usuario de Instagram del artista musical llamado "${artistName}" del genero "${artistgenres}"? Solo responde con el nombre de usuario, sin símbolos extra.`;

//   return await fetchWithRetries(async () => {
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: prompt }],
//       }),
//     });

//     const data = await response.json();

//     if (!data || !data.choices || !data.choices[0]) {
//       console.error("Respuesta inesperada de OpenAI:", data);
//       return { instagram: "No disponible" };
//     }

//     const username = data.choices[0].message.content.trim();  
//     return { instagram: username };
//   });
// }
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

// API base URL - Asegúrate de ajustar esto según tu configuración
const API_BASE_URL = "http://localhost:3001"; // o la URL donde se ejecuta tu backend

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

export async function getArtistMilestones(artistName) {
  const prompt = `
    Dime los 5 hitos más importantes del artista musical "${artistName}", 
    incluyendo premios ganados, shows destacados o reconocimientos clave.
    Devuélvelo como un listado numerado.
  `.trim();

  const data = await fetchWithRetries(async () => {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
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

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error al llamar a OpenAI: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return await res.json();
  });

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    console.error("Respuesta inesperada de OpenAI:", data);
    return [];
  }

  return content
    .split("\n")
    .map(line => line.trim())
    .filter(line => /^\d+\./.test(line));  // Solo líneas numeradas (1., 2., etc.)
}

export async function getArtistInstagram(artistName, artistgenres) {
  // Primero obtenemos el nombre de usuario de Instagram a través de OpenAI
  const prompt = `¿Cuál es el usuario de Instagram del artista musical llamado "${artistName}" del genero "${artistgenres}"? Solo responde con el nombre de usuario, sin símbolos extra.`;

  try {
    const openaiResponse = await fetchWithRetries(async () => {
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

      const username = data.choices[0].message.content.trim();
      
      // Limpiar el username en caso de que venga con @ o texto adicional
      let cleanUsername = username.replace('@', '');
      
      // Si hay espacios o texto adicional, tomar solo la primera palabra
      if (cleanUsername.includes(' ')) {
        cleanUsername = cleanUsername.split(' ')[0];
      }
      
      // Si hay puntos o comas, eliminarlos
      cleanUsername = cleanUsername.replace(/[.,]/g, '');
      
      return { instagram: cleanUsername };
    });

    // Obtener el username de la respuesta de OpenAI
    const instagramUsername = openaiResponse.instagram;
    
    console.log(`Instagram username obtenido para ${artistName}: @${instagramUsername}`);
    
    // Devolvemos el usuario de Instagram
    return { instagram: instagramUsername };
    
  } catch (error) {
    console.error("Error al obtener información de Instagram:", error);
    
    // En caso de error, devolvemos un valor predeterminado
    // Intentamos crear un nombre de usuario basado en el nombre del artista
    const fallbackUsername = artistName.toLowerCase()
      .replace(/\s+/g, '') // Eliminar espacios
      .replace(/[^a-z0-9_]/g, ''); // Eliminar caracteres especiales
      
    return { instagram: fallbackUsername };
  }
}

export async function getTopInstagramPosts(username) {
  console.log('🔍 [FRONTEND] Iniciando getTopInstagramPosts para:', username);
  
  if (!username) {
    console.error("❌ [FRONTEND] No username proporcionado");
    return [];
  }
  
  const fullUrl = `${API_BASE_URL}/api/instagram/top-posts/${username}?limit=6`;
  console.log(`📡 [FRONTEND] Haciendo fetch a: ${fullUrl}`);
  
  try {
    const response = await fetch(fullUrl);
    console.log(`📥 [FRONTEND] Respuesta recibida, status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ [FRONTEND] Datos recibidos:`, data);
    return data;
  } catch (error) {
    console.error(`💥 [FRONTEND] Error:`, error);
    return [];
  }
}