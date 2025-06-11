// /// src/services/instagramService.js
// import axios from 'axios';

// // Cache para almacenar resultados y minimizar llamadas al backend
// const cacheExpiration = 30 * 60 * 1000; // 30 minutos
// const cache = new Map();

// export const getInstagramTopPosts = async (username) => {
//   if (!username) return [];
  
//   username = username.replace('@', ''); // Eliminar @ si existe
  
//   // Comprobar si hay datos en caché
//   if (cache.has(username)) {
//     const { data, timestamp } = cache.get(username);
//     // Si la caché está fresca, usarla
//     if (Date.now() - timestamp < cacheExpiration) {
//       console.log(`Usando datos en caché para ${username}`);
//       return data;
//     }
//   }
  
//   console.log(`Obteniendo posts de Instagram para ${username}`);
  
//   try {
//     // Llamar al backend con el scraper
//     const response = await axios.get(`http://localhost:3001/api/instagram/${username}`);
    
//     // Procesar los datos si es necesario
//     const posts = response.data;
    
//     // Guardar en caché
//     cache.set(username, {
//       data: posts,
//       timestamp: Date.now()
//     });
    
//     return posts;
//   } catch (error) {
//     console.error('Error obteniendo posts de Instagram:', error.response || error.message || error);
    
//     // Devolver un arreglo vacío o datos de ejemplo en caso de error
//     return [];
//   }
// };

/// src/services/instagramService.js
import axios from 'axios';

// Cache para almacenar resultados y minimizar llamadas al backend
const cacheExpiration = 30 * 60 * 1000; // 30 minutos
const cache = new Map();

export const getInstagramTopPosts = async (username) => {
  if (!username) return [];
  
  username = username.replace('@', ''); // Eliminar @ si existe
  
  // Comprobar si hay datos en caché
  if (cache.has(username)) {
    const { data, timestamp } = cache.get(username);
    // Si la caché está fresca, usarla
    if (Date.now() - timestamp < cacheExpiration) {
      console.log(`Usando datos en caché para ${username}`);
      return data;
    }
  }
  
  console.log(`Obteniendo posts de Instagram para ${username}`);
  
  try {
    // Llamar al backend con el scraper
    const response = await axios.get(`http://localhost:3001/api/instagram/${username}`);
    
    // Procesar los datos si es necesario
    const posts = response.data;
    
    // Guardar en caché
    cache.set(username, {
      data: posts,
      timestamp: Date.now()
    });
    
    return posts;
  } catch (error) {
    console.error('Error obteniendo posts de Instagram:', error.response || error.message || error);
    
    // Devolver un arreglo vacío o datos de ejemplo en caso de error
    return [];
  }
};