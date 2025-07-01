import { useState, useEffect, useCallback, useRef } from 'react';
import { getInstagramPosts, getInstagramPostsWithLogin, getInstagramPostsAuto } from '../services/instagramServices';

/**
 * Hook personalizado para manejar posts de Instagram
 * @param {string} username - Username de Instagram
 * @param {number} limit - Número máximo de posts a obtener
 * @param {boolean} autoFetch - Si debe cargar automáticamente al montar
 * @param {number} refreshInterval - Intervalo de auto-refresh en minutos (0 = deshabilitado)
 */
export const useInstagram = (username, limit = 6, autoFetch = true, refreshInterval = 0) => {
  // Estado principal
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  
  // Estado de configuración
  const [useLogin, setUseLogin] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postsWithImages, setPostsWithImages] = useState(0);
  
  // Referencias para limpieza
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Función para obtener posts
  const fetchPosts = useCallback(async (options = {}) => {
    const {
      forceRefresh = false,
      withLogin = useLogin,
      showLoading = true
    } = options;

    // Evitar múltiples requests simultáneos
    if (loading && !forceRefresh) {
      console.log('🔄 Request en progreso, omitiendo...');
      return;
    }

    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();

    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      console.log(`🔍 Fetcheando posts para @${username} (login: ${withLogin})`);

      let result;
      
      if (withLogin) {
        result = await getInstagramPostsWithLogin(username, limit);
      } else {
        result = await getInstagramPostsAuto(username, limit);
      }

      // Verificar si el request fue cancelado
      if (abortControllerRef.current?.signal.aborted) {
        console.log('🚫 Request cancelado');
        return;
      }

      console.log('📊 Resultado del fetch:', result);

      if (result.success && result.posts && result.posts.length > 0) {
        setPosts(result.posts);
        setTotalPosts(result.posts_count || result.posts.length);
        setPostsWithImages(result.posts_with_images || result.posts.filter(p => p.display_url).length);
        setLastFetch(new Date());
        setError(null);
        
        console.log(`✅ ${result.posts.length} posts cargados para @${username}`);
        
        return result.posts;
      } else {
        const errorMsg = result.error || 'No se encontraron posts para este usuario';
        setError(errorMsg);
        setPosts([]);
        setTotalPosts(0);
        setPostsWithImages(0);
        
        console.warn('⚠️ No se obtuvieron posts:', errorMsg);
        
        return [];
      }

    } catch (err) {
      // Ignorar errores de abort
      if (err.name === 'AbortError') {
        console.log('🚫 Fetch abortado');
        return;
      }

      console.error('❌ Error en useInstagram fetch:', err);
      
      const errorMsg = `Error al cargar posts: ${err.message}`;
      setError(errorMsg);
      setPosts([]);
      setTotalPosts(0);
      setPostsWithImages(0);
      
      throw err;
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [username, limit, useLogin, loading]);

  // Función para refrescar
  const refresh = useCallback((options = {}) => {
    return fetchPosts({ forceRefresh: true, ...options });
  }, [fetchPosts]);

  // Función para alternar login
  const toggleLogin = useCallback(() => {
    setUseLogin(prev => !prev);
  }, []);

  // Función para limpiar datos
  const clearPosts = useCallback(() => {
    setPosts([]);
    setError(null);
    setLastFetch(null);
    setTotalPosts(0);
    setPostsWithImages(0);
  }, []);

  // Auto-fetch inicial
  useEffect(() => {
    if (autoFetch && username) {
      fetchPosts();
    }
  }, [username, autoFetch]); // No incluir fetchPosts para evitar loops

  // Auto-refresh periódico
  useEffect(() => {
    if (refreshInterval > 0 && username) {
      const interval = setInterval(() => {
        console.log(`🔄 Auto-refresh de Instagram posts cada ${refreshInterval} minutos`);
        fetchPosts({ showLoading: false });
      }, refreshInterval * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, username, fetchPosts]);

  // Refetch cuando cambia useLogin
  useEffect(() => {
    if (username && posts.length > 0) {
      // Solo refetch si ya había posts cargados
      fetchPosts({ forceRefresh: true });
    }
  }, [useLogin]);

  // Estadísticas calculadas
  const stats = {
    totalLikes: posts.reduce((sum, post) => sum + (post.like_count || 0), 0),
    totalComments: posts.reduce((sum, post) => sum + (post.comment_count || 0), 0),
    avgLikes: posts.length > 0 ? Math.round(posts.reduce((sum, post) => sum + (post.like_count || 0), 0) / posts.length) : 0,
    avgComments: posts.length > 0 ? Math.round(posts.reduce((sum, post) => sum + (post.comment_count || 0), 0) / posts.length) : 0,
    postTypes: posts.reduce((acc, post) => {
      const type = post.type || 'IMAGE';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {}),
    postsWithImages,
    totalPosts
  };

  // Estado de carga inteligente
  const isInitialLoading = loading && posts.length === 0;
  const isRefreshing = loading && posts.length > 0;

  return {
    // Datos principales
    posts,
    loading,
    error,
    lastFetch,
    
    // Configuración
    useLogin,
    username,
    limit,
    
    // Estadísticas
    stats,
    
    // Estados derivados
    isInitialLoading,
    isRefreshing,
    hasError: !!error,
    hasPosts: posts.length > 0,
    isEmpty: !loading && posts.length === 0 && !error,
    
    // Acciones
    fetchPosts,
    refresh,
    toggleLogin,
    clearPosts,
    
    // Funciones de utilidad
    retryWithLogin: () => refresh({ withLogin: true }),
    retryWithoutLogin: () => refresh({ withLogin: false }),
    
    // Información de tiempo
    minutesSinceLastFetch: lastFetch ? Math.floor((Date.now() - lastFetch.getTime()) / 60000) : null,
    canRefresh: !loading,
    
    // Configuración avanzada
    setUseLogin,
  };
};

export default useInstagram;