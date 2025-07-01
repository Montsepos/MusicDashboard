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

  const hasRequiredFields = (
    post.id && 
    (post.shortcode || post.code || post.media_id)
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
      if (url.includes('instagram') || url.includes('cdninstagram') || url.includes('fbcdn')) {
        return url;
      }
    }
  }

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
    is_video: Boolean(post.is_video || post.video_url || post.type === 'VIDEO' || post.type === 'REEL'),
    video_url: post.video_url || null,
    owner: post.owner || post.user || null,
    width: Number(post.width || 0),
    height: Number(post.height || 0)
  };

  if (imageUrl) {
    log(`📸 URL de imagen extraída para post ${normalized.shortcode}: ${imageUrl.substring(0, 50)}...`);
  } else {
    logWarn(`❌ No se pudo extraer URL de imagen para post ${normalized.shortcode}`);
  }

  return normalized;
};

/**
 * 🚀 FUNCIÓN PRINCIPAL - SIN LOGIN POR DEFECTO (RÁPIDA)
 * Obtiene posts de Instagram SIN LOGIN para mayor velocidad
 */
export const getInstagramPosts = async (username, limit = 6) => {
  try {
    log(`🏃‍♂️ MODO RÁPIDO: Obteniendo posts SIN LOGIN para @${username}...`);

    const cleanUsername = username.replace('@', '').trim();
    
    if (!cleanUsername) {
      throw new Error('Username de Instagram inválido');
    }

    // ✅ URL SIN PARÁMETRO DE LOGIN (MÁS RÁPIDO)
    const url = `${BACKEND_URL}/api/instagram/top-posts/${cleanUsername}?limit=${limit}`;
    log(`📡 Llamando (SIN LOGIN): ${url}`);

    // ✅ TIMEOUT AJUSTADO PARA SIN LOGIN (2 minutos - suficiente tiempo)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutos

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const responseData = await response.json();
      
      log(`📊 Respuesta recibida (SIN LOGIN):`, {
        isArray: Array.isArray(responseData),
        length: Array.isArray(responseData) ? responseData.length : 'N/A'
      });

      // ✅ PROCESAMIENTO RÁPIDO DE RESPUESTA
      let posts = [];
      let success = false;

      if (Array.isArray(responseData)) {
        posts = responseData;
        success = true;
        log(`✅ Formato directo - ${posts.length} posts encontrados`);
      } else if (Array.isArray(responseData.posts)) {
        posts = responseData.posts;
        success = responseData.success !== false;
        log(`✅ Formato anidado - ${posts.length} posts encontrados`);
      } else if (responseData.error) {
        throw new Error(responseData.error);
      } else {
        posts = [];
        success = false;
        logWarn('Formato de respuesta no reconocido');
      }

      // ✅ VALIDACIÓN Y NORMALIZACIÓN RÁPIDA
      const validPosts = [];
      
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        
        if (isValidPost(post)) {
          const normalizedPost = normalizePost(post);
          validPosts.push(normalizedPost);
        }
      }

      const postsWithImages = validPosts.filter(p => p.display_url).length;
      log(`🎯 RESULTADO RÁPIDO: ${validPosts.length} posts válidos, ${postsWithImages} con imágenes`);

      return {
        success: success && validPosts.length > 0,
        username: cleanUsername,
        posts: validPosts,
        posts_count: validPosts.length,
        posts_with_images: postsWithImages,
        total_received: posts.length,
        mode: 'fast_no_login',
        timestamp: Date.now()
      };

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Timeout (2 minutos) - El scraping toma más tiempo del esperado');
      } else {
        throw fetchError;
      }
    }

  } catch (error) {
    logError(`Error en modo rápido para @${username}: ${error.message}`, error);
    
    return {
      success: false,
      username: username.replace('@', '').trim(),
      posts: [],
      posts_count: 0,
      posts_with_images: 0,
      total_received: 0,
      error: error.message,
      mode: 'fast_no_login',
      timestamp: Date.now()
    };
  }
};

/**
 * 🔐 FUNCIÓN CON LOGIN (MÁS LENTA PERO MÁS DATOS)
 * Solo usar cuando el modo rápido falle o se necesiten más datos
 */
export const getInstagramPostsWithLogin = async (username, limit = 6) => {
  try {
    log(`🔐 MODO CON LOGIN: Obteniendo posts CON LOGIN para @${username}...`);

    const cleanUsername = username.replace('@', '').trim();
    
    if (!cleanUsername) {
      throw new Error('Username de Instagram inválido');
    }

    // ✅ URL CON PARÁMETRO DE LOGIN
    const url = `${BACKEND_URL}/api/instagram/top-posts/${cleanUsername}?limit=${limit}&login=true`;
    log(`📡 Llamando (CON LOGIN): ${url}`);

    // ✅ TIMEOUT PARA LOGIN (4 minutos - tiempo suficiente para login + scraping)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 240000); // 4 minutos

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const responseData = await response.json();
      
      let posts = Array.isArray(responseData) ? responseData : [];
      
      const validPosts = posts.filter(isValidPost).map(normalizePost);
      const postsWithImages = validPosts.filter(p => p.display_url).length;
      
      log(`🔐 RESULTADO CON LOGIN: ${validPosts.length} posts válidos, ${postsWithImages} con imágenes`);

      return {
        success: validPosts.length > 0,
        username: cleanUsername,
        posts: validPosts,
        posts_count: validPosts.length,
        posts_with_images: postsWithImages,
        total_received: posts.length,
        with_login: true,
        mode: 'with_login',
        timestamp: Date.now()
      };

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Timeout con login (4 minutos) - Instagram puede estar bloqueando');
      } else {
        throw fetchError;
      }
    }

  } catch (error) {
    logError(`Error con login para @${username}: ${error.message}`, error);
    return {
      success: false,
      username: username.replace('@', '').trim(),
      posts: [],
      posts_count: 0,
      posts_with_images: 0,
      total_received: 0,
      with_login: true,
      error: error.message,
      mode: 'with_login',
      timestamp: Date.now()
    };
  }
};

/**
 * 🔄 FUNCIÓN INTELIGENTE CON FALLBACK CONTROLADO
 * Primero sin login (rápido), solo usa login si realmente es necesario
 */
export const getInstagramPostsAuto = async (username, limit = 6) => {
  try {
    log(`🔄 MODO INTELIGENTE: Iniciando para @${username}...`);
    
    // ✅ PRIMER INTENTO: SIN LOGIN (RÁPIDO)
    let result = await getInstagramPosts(username, limit);
    
    // ✅ SOLO USAR LOGIN SI REALMENTE ES NECESARIO
    // Criterios: No hay posts Y no hay error de timeout
    const shouldTryLogin = (
      !result.success && 
      result.posts_count === 0 && 
      !result.error?.includes('Timeout')
    );
    
    if (shouldTryLogin) {
      logWarn(`🔄 Sin login no funcionó, intentando con login...`);
      result = await getInstagramPostsWithLogin(username, limit);
      result.fallback_used = true;
      result.mode = 'auto_with_fallback';
    } else {
      log(`✅ Modo sin login funcionó correctamente`);
      result.mode = 'auto_fast_only';
    }
    
    return result;
    
  } catch (error) {
    logError(`Error en modo inteligente: ${error.message}`, error);
    return {
      success: false,
      username: username.replace('@', '').trim(),
      posts: [],
      posts_count: 0,
      error: error.message,
      mode: 'auto_error',
      timestamp: Date.now()
    };
  }
};

/**
 * 🧪 FUNCIÓN DE PRUEBA PARA TESTING
 */
export const getInstagramTestPosts = async (username) => {
  try {
    log(`🧪 Obteniendo posts de prueba para @${username}...`);

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
      mode: 'test',
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
      mode: 'test',
      timestamp: Date.now()
    };
  }
};

/**
 * 🏥 FUNCIÓN PARA VERIFICAR ESTADO DEL SERVICIO
 */
export const checkInstagramHealth = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    return data;
  } catch (error) {
    logError(`Error verificando salud del servicio: ${error.message}`);
    return { status: 'error', error: error.message };
  }
};

// ✅ EXPORTAR TODAS LAS FUNCIONES
export default {
  getInstagramPosts,          // 🚀 Función principal (SIN LOGIN - RÁPIDA)
  getInstagramPostsWithLogin, // 🔐 Con login (más lenta)
  getInstagramPostsAuto,      // 🔄 Inteligente con fallback controlado
  getInstagramTestPosts,      // 🧪 Para testing
  checkInstagramHealth        // 🏥 Health check
};