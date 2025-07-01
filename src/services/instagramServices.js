


// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

// /**
//  * Log helper para debugging
//  */
// const log = (message, data = null) => {
//   console.log(`🔍 [INSTAGRAM SERVICES] ${message}`);
//   if (data) console.log(data);
// };

// /**
//  * Log de error helper
//  */
// const logError = (message, error = null) => {
//   console.error(`❌ [INSTAGRAM SERVICES] ${message}`);
//   if (error) console.error(error);
// };

// /**
//  * Log de warning helper
//  */
// const logWarn = (message, data = null) => {
//   console.warn(`⚠️ [INSTAGRAM SERVICES] ${message}`);
//   if (data) console.warn(data);
// };

// /**
//  * Valida si un post tiene la estructura correcta
//  */
// const isValidPost = (post) => {
//   if (!post || typeof post !== 'object') {
//     return false;
//   }

//   // ✅ VALIDACIÓN MÁS PERMISIVA - Solo campos esenciales
//   const hasRequiredFields = (
//     post.id && 
//     (post.shortcode || post.code || post.media_id) // Flexible con identificadores
//   );

//   if (!hasRequiredFields) {
//     logWarn('Post inválido - campos faltantes:', {
//       id: !!post.id,
//       shortcode: !!post.shortcode,
//       code: !!post.code,
//       media_id: !!post.media_id,
//       availableKeys: Object.keys(post)
//     });
//     return false;
//   }

//   return true;
// };

// /**
//  * Extrae la mejor URL de imagen disponible
//  */
// const extractImageUrl = (post) => {
//   // Prioridad de URLs de imagen
//   const possibleUrls = [
//     post.display_url,
//     post.thumbnail_url,
//     post.media_url,
//     post.image_url,
//     post.src,
//     post.url,
//     post.preview_url,
//     post.photo_url
//   ];

//   for (const url of possibleUrls) {
//     if (url && typeof url === 'string' && url.length > 10) {
//       // Verificar que la URL parece válida
//       if (url.includes('instagram') || url.includes('cdninstagram') || url.includes('fbcdn')) {
//         return url;
//       }
//     }
//   }

//   // Si no encuentra URL de Instagram, buscar cualquier URL válida
//   for (const url of possibleUrls) {
//     if (url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('https'))) {
//       return url;
//     }
//   }

//   return null;
// };

// /**
//  * Normaliza un post para asegurar formato consistente
//  */
// const normalizePost = (post) => {
//   const imageUrl = extractImageUrl(post);
  
//   const normalized = {
//     id: String(post.id || post.media_id || ''),
//     shortcode: String(post.shortcode || post.code || post.id || ''),
//     url: String(post.permalink || post.post_url || `https://instagram.com/p/${post.shortcode || post.code}/`),
//     type: String(post.type || post.media_type || 'PHOTO').toUpperCase(),
//     caption: String(post.caption || post.text || post.description || ''),
//     like_count: Number(post.like_count || post.likes || post.like || 0),
//     comment_count: Number(post.comment_count || post.comments || post.comment || 0),
//     timestamp: Number(post.timestamp || post.taken_at || post.created_time || Date.now()),
//     display_url: imageUrl,
//     is_video: Boolean(post.is_video || post.video_url || post.type === 'VIDEO'),
//     // Campos adicionales que podrían ser útiles
//     video_url: post.video_url || null,
//     owner: post.owner || post.user || null,
//     width: Number(post.width || 0),
//     height: Number(post.height || 0)
//   };

//   // Debug de la URL extraída
//   if (imageUrl) {
//     log(`📸 URL de imagen extraída para post ${normalized.shortcode}: ${imageUrl.substring(0, 50)}...`);
//   } else {
//     logWarn(`❌ No se pudo extraer URL de imagen para post ${normalized.shortcode}`, {
//       availableFields: Object.keys(post).filter(key => key.toLowerCase().includes('url') || key.toLowerCase().includes('src') || key.toLowerCase().includes('image'))
//     });
//   }

//   return normalized;
// };

// /**
//  * Obtiene posts de Instagram para un usuario
//  */
// export const getInstagramPosts = async (username, limit = 6) => {
//   try {
//     log(`Obteniendo posts de Instagram para @${username}...`);

//     // ✅ LIMPIAR USERNAME
//     const cleanUsername = username.replace('@', '').trim();
    
//     if (!cleanUsername) {
//       throw new Error('Username de Instagram inválido');
//     }

//     // ✅ CONSTRUIR URL CON PARÁMETROS
//     const url = `${BACKEND_URL}/api/instagram/${cleanUsername}?limit=${limit}`;
//     log(`Llamando a: ${url}`);

//     // ✅ REALIZAR PETICIÓN
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       timeout: 30000 // 30 segundos timeout
//     });

//     // ✅ VERIFICAR STATUS
//     if (!response.ok) {
//       throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
//     }

//     // ✅ PARSEAR RESPUESTA
//     const responseData = await response.json();
    
//     log(`Respuesta recibida del scraper:`, {
//       hasData: !!responseData,
//       keys: Object.keys(responseData || {}),
//       dataType: typeof responseData
//     });

//     // ✅ VALIDAR ESTRUCTURA DE RESPUESTA
//     if (!responseData) {
//       throw new Error('Respuesta vacía del servidor');
//     }

//     // ✅ MANEJAR DIFERENTES FORMATOS DE RESPUESTA DEL SCRAPER
//     let posts = [];
//     let success = false;

//     // Formato 1: { success: true, data: { posts: [...] } }
//     if (responseData.data && Array.isArray(responseData.data.posts)) {
//       posts = responseData.data.posts;
//       success = responseData.success !== false;
//       log(`✅ Formato con data wrapper - ${posts.length} posts encontrados`);
//     }
//     // Formato 2: { success: true, posts: [...] }
//     else if (Array.isArray(responseData.posts)) {
//       posts = responseData.posts;
//       success = responseData.success !== false;
//       log(`✅ Formato directo - ${posts.length} posts encontrados`);
//     }
//     // Formato 3: [ {...}, {...}, ... ] (array directo)
//     else if (Array.isArray(responseData)) {
//       posts = responseData;
//       success = true;
//       log(`✅ Formato array directo - ${posts.length} posts encontrados`);
//     }
//     // Formato 4: { items: [...] } (algunos scrapers usan 'items')
//     else if (Array.isArray(responseData.items)) {
//       posts = responseData.items;
//       success = true;
//       log(`✅ Formato con items - ${posts.length} posts encontrados`);
//     }
//     // Formato 5: { user: { edge_owner_to_timeline_media: { edges: [...] } } } (formato GraphQL)
//     else if (responseData.user?.edge_owner_to_timeline_media?.edges) {
//       posts = responseData.user.edge_owner_to_timeline_media.edges.map(edge => edge.node);
//       success = true;
//       log(`✅ Formato GraphQL - ${posts.length} posts encontrados`);
//     }
//     // Error en respuesta
//     else if (responseData.error) {
//       throw new Error(responseData.error);
//     }
//     else {
//       logWarn('Formato de respuesta no reconocido, mostrando estructura completa:');
//       console.log('📊 Respuesta completa del scraper:', responseData);
      
//       // Intentar extraer posts de cualquier array que encuentre
//       const possibleArrays = Object.values(responseData).filter(val => Array.isArray(val));
//       if (possibleArrays.length > 0) {
//         posts = possibleArrays[0];
//         success = true;
//         log(`🔄 Usando primer array encontrado - ${posts.length} posts`);
//       } else {
//         posts = [];
//         success = false;
//       }
//     }

//     // ✅ DEBUG: MOSTRAR ESTRUCTURA DEL PRIMER POST
//     if (posts.length > 0) {
//       log(`📊 Estructura del primer post recibido:`, {
//         keys: Object.keys(posts[0]),
//         hasDisplayUrl: !!posts[0].display_url,
//         hasImageUrl: !!posts[0].image_url,
//         hasMediaUrl: !!posts[0].media_url,
//         hasThumbnailUrl: !!posts[0].thumbnail_url,
//         urlFields: Object.keys(posts[0]).filter(key => 
//           key.toLowerCase().includes('url') || 
//           key.toLowerCase().includes('src') || 
//           key.toLowerCase().includes('image')
//         )
//       });
//     }

//     // ✅ VALIDAR Y NORMALIZAR POSTS
//     const validPosts = [];
    
//     for (let i = 0; i < posts.length; i++) {
//       const post = posts[i];
      
//       if (isValidPost(post)) {
//         const normalizedPost = normalizePost(post);
//         validPosts.push(normalizedPost);
//         log(`✅ Post ${i + 1} procesado: ${normalizedPost.shortcode} ${normalizedPost.display_url ? '📸' : '❌'}`);
//       } else {
//         logWarn(`❌ Post ${i + 1} inválido, omitiendo...`);
//         console.log('Post problemático:', post);
//       }
//     }

//     // ✅ VERIFICAR QUE HAY POSTS VÁLIDOS
//     if (validPosts.length === 0) {
//       if (posts.length > 0) {
//         logWarn(`Se recibieron ${posts.length} posts pero ninguno es válido`);
//         console.log('Posts recibidos del scraper:', posts);
//       } else {
//         logWarn(`No se recibieron posts para @${cleanUsername}`);
//       }
//     }

//     // ✅ ESTADÍSTICAS FINALES
//     const postsWithImages = validPosts.filter(p => p.display_url).length;
//     log(`🎯 RESULTADO FINAL: ${validPosts.length} posts válidos, ${postsWithImages} con imágenes para @${cleanUsername}`);

//     // ✅ RETORNAR RESULTADO NORMALIZADO
//     return {
//       success: success && validPosts.length > 0,
//       username: cleanUsername,
//       posts: validPosts,
//       posts_count: validPosts.length,
//       posts_with_images: postsWithImages,
//       total_received: posts.length,
//       timestamp: Date.now()
//     };

//   } catch (error) {
//     logError(`Error obteniendo posts de Instagram para @${username}: ${error.message}`, error);
    
//     // ✅ RETORNAR ESTRUCTURA CONSISTENTE EN CASO DE ERROR
//     return {
//       success: false,
//       username: username.replace('@', '').trim(),
//       posts: [],
//       posts_count: 0,
//       posts_with_images: 0,
//       total_received: 0,
//       error: error.message,
//       timestamp: Date.now()
//     };
//   }
// };

// /**
//  * Obtiene posts de prueba (para testing)
//  */
// export const getInstagramTestPosts = async (username) => {
//   try {
//     log(`Obteniendo posts de prueba para @${username}...`);

//     const cleanUsername = username.replace('@', '').trim();
//     const url = `${BACKEND_URL}/api/instagram/test/${cleanUsername}`;
    
//     const response = await fetch(url);
    
//     if (!response.ok) {
//       throw new Error(`Error HTTP ${response.status}`);
//     }

//     const data = await response.json();
    
//     return {
//       success: true,
//       username: cleanUsername,
//       posts: data.data?.posts || [],
//       posts_count: data.data?.posts?.length || 0,
//       timestamp: Date.now()
//     };

//   } catch (error) {
//     logError(`Error obteniendo posts de prueba: ${error.message}`);
//     return {
//       success: false,
//       username: username.replace('@', '').trim(),
//       posts: [],
//       posts_count: 0,
//       error: error.message,
//       timestamp: Date.now()
//     };
//   }
// };

// /**
//  * Verifica el estado del servicio de Instagram
//  */
// export const checkInstagramHealth = async () => {
//   try {
//     const response = await fetch(`${BACKEND_URL}/api/instagram/health`);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     logError(`Error verificando salud del servicio: ${error.message}`);
//     return { status: 'error', error: error.message };
//   }
// };

// export default {
//   getInstagramPosts,
//   getInstagramTestPosts,
//   checkInstagramHealth
// };

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

/**
 * Log helper para debugging
 */
const log = (message, data = null) => {
  console.log(`🔍 [INSTAGRAM SERVICES] ${message}`);
  if (data) console.log(data);
};

/**
 * Log de error helper
 */
const logError = (message, error = null) => {
  console.error(`❌ [INSTAGRAM SERVICES] ${message}`);
  if (error) console.error(error);
};

/**
 * Log de warning helper
 */
const logWarn = (message, data = null) => {
  console.warn(`⚠️ [INSTAGRAM SERVICES] ${message}`);
  if (data) console.warn(data);
};

/**
 * Valida si un post tiene la estructura correcta
 */
const isValidPost = (post) => {
  if (!post || typeof post !== 'object') {
    return false;
  }

  // ✅ VALIDACIÓN MÁS PERMISIVA - Solo campos esenciales
  const hasRequiredFields = (
    post.id && 
    (post.shortcode || post.code || post.media_id) // Flexible con identificadores
  );

  if (!hasRequiredFields) {
    logWarn('Post inválido - campos faltantes:', {
      id: !!post.id,
      shortcode: !!post.shortcode,
      code: !!post.code,
      media_id: !!post.media_id,
      availableKeys: Object.keys(post)
    });
    return false;
  }

  return true;
};

/**
 * Extrae la mejor URL de imagen disponible
 */
const extractImageUrl = (post) => {
  // Prioridad de URLs de imagen
  const possibleUrls = [
    post.display_url,
    post.thumbnail_url,
    post.media_url,
    post.image_url,
    post.src,
    post.url,
    post.preview_url,
    post.photo_url
  ];

  for (const url of possibleUrls) {
    if (url && typeof url === 'string' && url.length > 10) {
      // Verificar que la URL parece válida
      if (url.includes('instagram') || url.includes('cdninstagram') || url.includes('fbcdn')) {
        return url;
      }
    }
  }

  // Si no encuentra URL de Instagram, buscar cualquier URL válida
  for (const url of possibleUrls) {
    if (url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('https'))) {
      return url;
    }
  }

  return null;
};

/**
 * Normaliza un post para asegurar formato consistente
 */
const normalizePost = (post) => {
  const imageUrl = extractImageUrl(post);
  
  const normalized = {
    id: String(post.id || post.media_id || ''),
    shortcode: String(post.shortcode || post.code || post.id || ''),
    url: String(post.permalink || post.post_url || `https://instagram.com/p/${post.shortcode || post.code}/`),
    type: String(post.type || post.media_type || 'PHOTO').toUpperCase(),
    caption: String(post.caption || post.text || post.description || ''),
    like_count: Number(post.like_count || post.likes || post.like || 0),
    comment_count: Number(post.comment_count || post.comments || post.comment || 0),
    timestamp: Number(post.timestamp || post.taken_at || post.created_time || Date.now()),
    display_url: imageUrl,
    is_video: Boolean(post.is_video || post.video_url || post.type === 'VIDEO'),
    // Campos adicionales que podrían ser útiles
    video_url: post.video_url || null,
    owner: post.owner || post.user || null,
    width: Number(post.width || 0),
    height: Number(post.height || 0)
  };

  // Debug de la URL extraída
  if (imageUrl) {
    log(`📸 URL de imagen extraída para post ${normalized.shortcode}: ${imageUrl.substring(0, 50)}...`);
  } else {
    logWarn(`❌ No se pudo extraer URL de imagen para post ${normalized.shortcode}`, {
      availableFields: Object.keys(post).filter(key => key.toLowerCase().includes('url') || key.toLowerCase().includes('src') || key.toLowerCase().includes('image'))
    });
  }

  return normalized;
};

/**
 * Obtiene posts de Instagram para un usuario
 */
export const getInstagramPosts = async (username, limit = 6) => {
  try {
    log(`Obteniendo posts de Instagram para @${username}...`);

    // ✅ LIMPIAR USERNAME
    const cleanUsername = username.replace('@', '').trim();
    
    if (!cleanUsername) {
      throw new Error('Username de Instagram inválido');
    }

    // ✅ CONSTRUIR URL CON PARÁMETROS
    const url = `${BACKEND_URL}/api/instagram/${cleanUsername}?limit=${limit}`;
    log(`Llamando a: ${url}`);

    // ✅ REALIZAR PETICIÓN
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 segundos timeout
    });

    // ✅ VERIFICAR STATUS
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    // ✅ PARSEAR RESPUESTA
    const responseData = await response.json();
    
    log(`Respuesta recibida del scraper:`, {
      hasData: !!responseData,
      keys: Object.keys(responseData || {}),
      dataType: typeof responseData
    });

    // ✅ VALIDAR ESTRUCTURA DE RESPUESTA
    if (!responseData) {
      throw new Error('Respuesta vacía del servidor');
    }

    // ✅ MANEJAR DIFERENTES FORMATOS DE RESPUESTA DEL SCRAPER
    let posts = [];
    let success = false;

    // Formato 1: { success: true, data: { posts: [...] } }
    if (responseData.data && Array.isArray(responseData.data.posts)) {
      posts = responseData.data.posts;
      success = responseData.success !== false;
      log(`✅ Formato con data wrapper - ${posts.length} posts encontrados`);
    }
    // Formato 2: { success: true, posts: [...] }
    else if (Array.isArray(responseData.posts)) {
      posts = responseData.posts;
      success = responseData.success !== false;
      log(`✅ Formato directo - ${posts.length} posts encontrados`);
    }
    // Formato 3: [ {...}, {...}, ... ] (array directo)
    else if (Array.isArray(responseData)) {
      posts = responseData;
      success = true;
      log(`✅ Formato array directo - ${posts.length} posts encontrados`);
    }
    // Formato 4: { items: [...] } (algunos scrapers usan 'items')
    else if (Array.isArray(responseData.items)) {
      posts = responseData.items;
      success = true;
      log(`✅ Formato con items - ${posts.length} posts encontrados`);
    }
    // Formato 5: { user: { edge_owner_to_timeline_media: { edges: [...] } } } (formato GraphQL)
    else if (responseData.user?.edge_owner_to_timeline_media?.edges) {
      posts = responseData.user.edge_owner_to_timeline_media.edges.map(edge => edge.node);
      success = true;
      log(`✅ Formato GraphQL - ${posts.length} posts encontrados`);
    }
    // Error en respuesta
    else if (responseData.error) {
      throw new Error(responseData.error);
    }
    else {
      logWarn('Formato de respuesta no reconocido, mostrando estructura completa:');
      console.log('📊 Respuesta completa del scraper:', responseData);
      
      // Intentar extraer posts de cualquier array que encuentre
      const possibleArrays = Object.values(responseData).filter(val => Array.isArray(val));
      if (possibleArrays.length > 0) {
        posts = possibleArrays[0];
        success = true;
        log(`🔄 Usando primer array encontrado - ${posts.length} posts`);
      } else {
        posts = [];
        success = false;
      }
    }

    // ✅ DEBUG: MOSTRAR ESTRUCTURA COMPLETA DEL PRIMER POST
    if (posts.length > 0) {
      console.log(`🔍 [DEBUG] PRIMER POST COMPLETO DEL SCRAPER:`, posts[0]);
      log(`📊 Estructura del primer post recibido:`, {
        keys: Object.keys(posts[0]),
        hasDisplayUrl: !!posts[0].display_url,
        hasImageUrl: !!posts[0].image_url,
        hasMediaUrl: !!posts[0].media_url,
        hasThumbnailUrl: !!posts[0].thumbnail_url,
        urlFields: Object.keys(posts[0]).filter(key => 
          key.toLowerCase().includes('url') || 
          key.toLowerCase().includes('src') || 
          key.toLowerCase().includes('image')
        )
      });
      
      // Mostrar todas las URLs disponibles
      const allUrls = {};
      Object.keys(posts[0]).forEach(key => {
        if (key.toLowerCase().includes('url') || key.toLowerCase().includes('src') || key.toLowerCase().includes('image')) {
          allUrls[key] = posts[0][key];
        }
      });
      console.log(`🔗 [DEBUG] TODAS LAS URLs DISPONIBLES:`, allUrls);
    }

    // ✅ VALIDAR Y NORMALIZAR POSTS
    const validPosts = [];
    
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      
      if (isValidPost(post)) {
        const normalizedPost = normalizePost(post);
        validPosts.push(normalizedPost);
        log(`✅ Post ${i + 1} procesado: ${normalizedPost.shortcode} ${normalizedPost.display_url ? '📸' : '❌'}`);
      } else {
        logWarn(`❌ Post ${i + 1} inválido, omitiendo...`);
        console.log('Post problemático:', post);
      }
    }

    // ✅ VERIFICAR QUE HAY POSTS VÁLIDOS
    if (validPosts.length === 0) {
      if (posts.length > 0) {
        logWarn(`Se recibieron ${posts.length} posts pero ninguno es válido`);
        console.log('Posts recibidos del scraper:', posts);
      } else {
        logWarn(`No se recibieron posts para @${cleanUsername}`);
      }
    }

    // ✅ ESTADÍSTICAS FINALES
    const postsWithImages = validPosts.filter(p => p.display_url).length;
    log(`🎯 RESULTADO FINAL: ${validPosts.length} posts válidos, ${postsWithImages} con imágenes para @${cleanUsername}`);

    // ✅ RETORNAR RESULTADO NORMALIZADO
    return {
      success: success && validPosts.length > 0,
      username: cleanUsername,
      posts: validPosts,
      posts_count: validPosts.length,
      posts_with_images: postsWithImages,
      total_received: posts.length,
      timestamp: Date.now()
    };

  } catch (error) {
    logError(`Error obteniendo posts de Instagram para @${username}: ${error.message}`, error);
    
    // ✅ RETORNAR ESTRUCTURA CONSISTENTE EN CASO DE ERROR
    return {
      success: false,
      username: username.replace('@', '').trim(),
      posts: [],
      posts_count: 0,
      posts_with_images: 0,
      total_received: 0,
      error: error.message,
      timestamp: Date.now()
    };
  }
};

/**
 * Obtiene posts de prueba (para testing)
 */
export const getInstagramTestPosts = async (username) => {
  try {
    log(`Obteniendo posts de prueba para @${username}...`);

    const cleanUsername = username.replace('@', '').trim();
    const url = `${BACKEND_URL}/api/instagram/test/${cleanUsername}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      username: cleanUsername,
      posts: data.data?.posts || [],
      posts_count: data.data?.posts?.length || 0,
      timestamp: Date.now()
    };

  } catch (error) {
    logError(`Error obteniendo posts de prueba: ${error.message}`);
    return {
      success: false,
      username: username.replace('@', '').trim(),
      posts: [],
      posts_count: 0,
      error: error.message,
      timestamp: Date.now()
    };
  }
};

/**
 * Verifica el estado del servicio de Instagram
 */
export const checkInstagramHealth = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/instagram/health`);
    const data = await response.json();
    return data;
  } catch (error) {
    logError(`Error verificando salud del servicio: ${error.message}`);
    return { status: 'error', error: error.message };
  }
};

export default {
  getInstagramPosts,
  getInstagramTestPosts,
  checkInstagramHealth
};