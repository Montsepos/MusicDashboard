import React, { useState, useEffect } from 'react';
import { getInstagramPostsAuto, checkInstagramHealth } from '../services/instagramServices';
import './InstagramFeed.css'; // Asumiendo que crearás este CSS

const InstagramPost = ({ post, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha desconocida';
    
    try {
      const date = new Date(timestamp * 1000); // Convertir de Unix timestamp
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'VIDEO':
        return '🎥';
      case 'REEL':
        return '🎬';
      case 'CAROUSEL':
        return '📸';
      default:
        return '📷';
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const openInstagramPost = () => {
    if (post.url || post.permalink) {
      window.open(post.url || post.permalink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="instagram-post" onClick={openInstagramPost}>
      {/* Header del post */}
      <div className="post-header">
        <div className="post-type">
          <span className="post-type-icon">{getPostTypeIcon(post.type)}</span>
          <span className="post-type-text">{post.type}</span>
        </div>
        <div className="post-date">
          {formatDate(post.timestamp)}
        </div>
      </div>

      {/* Imagen/Video del post */}
      <div className="post-media">
        {!imageLoaded && !imageError && (
          <div className="post-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {post.display_url && !imageError ? (
          <img
            src={post.display_url}
            alt={`Instagram post ${index + 1}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: imageLoaded ? 'block' : 'none' }}
            className="post-image"
          />
        ) : (
          <div className="post-no-image">
            <span>📷</span>
            <p>Imagen no disponible</p>
          </div>
        )}
        
        {/* Overlay para video/reel */}
        {post.is_video && (
          <div className="video-overlay">
            <div className="play-button">▶️</div>
          </div>
        )}
      </div>

      {/* Caption del post */}
      {post.caption && (
        <div className="post-caption">
          <p>{post.caption.length > 100 ? `${post.caption.substring(0, 100)}...` : post.caption}</p>
        </div>
      )}

      {/* Estadísticas del post */}
      <div className="post-stats">
        <div className="stat">
          <span className="stat-icon">❤️</span>
          <span className="stat-value">{formatNumber(post.like_count || 0)}</span>
        </div>
        <div className="stat">
          <span className="stat-icon">💬</span>
          <span className="stat-value">{formatNumber(post.comment_count || 0)}</span>
        </div>
        <div className="post-shortcode">
          #{post.shortcode}
        </div>
      </div>
    </div>
  );
};

const InstagramFeed = ({ username = 'montsepos', limit = 6, showTitle = true }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [useLogin, setUseLogin] = useState(false);
  const [serviceHealth, setServiceHealth] = useState(null);

  // Función para obtener posts
  const fetchPosts = async (forceRefresh = false) => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 Obteniendo posts de Instagram para @${username}...`);

      const result = await getInstagramPostsAuto(username, limit);
      
      console.log('📊 Resultado del servicio:', result);

      if (result.success && result.posts && result.posts.length > 0) {
        setPosts(result.posts);
        setLastFetch(new Date());
        setError(null);
        
        console.log(`✅ ${result.posts.length} posts cargados exitosamente`);
      } else {
        setError(result.error || 'No se encontraron posts para este usuario');
        setPosts([]);
        
        console.warn('⚠️ No se obtuvieron posts:', result.error);
      }

    } catch (err) {
      console.error('❌ Error obteniendo posts:', err);
      setError(`Error al cargar posts: ${err.message}`);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Verificar salud del servicio
  const checkService = async () => {
    try {
      const health = await checkInstagramHealth();
      setServiceHealth(health);
    } catch (err) {
      console.error('Error verificando salud del servicio:', err);
    }
  };

  // Efecto para cargar posts automáticamente
  useEffect(() => {
    if (username) {
      fetchPosts();
      checkService();
    }
  }, [username, limit]);

  // Función para refrescar manualmente
  const handleRefresh = () => {
    fetchPosts(true);
  };

  // Función para alternar modo login
  const toggleLogin = () => {
    setUseLogin(!useLogin);
  };

  return (
    <div className="instagram-feed">
      {/* Header del feed */}
      {showTitle && (
        <div className="feed-header">
          <div className="feed-title">
            <h3>📸 Posts de Instagram</h3>
            <span className="username">@{username}</span>
          </div>
          
          <div className="feed-controls">
            <button 
              onClick={handleRefresh} 
              disabled={loading}
              className="refresh-button"
            >
              {loading ? '🔄' : '↻'} Actualizar
            </button>
            
            <button 
              onClick={toggleLogin}
              className={`login-toggle ${useLogin ? 'active' : ''}`}
              title={useLogin ? 'Modo con login activado' : 'Modo sin login'}
            >
              {useLogin ? '🔐' : '🔓'}
            </button>
          </div>
        </div>
      )}

      {/* Indicador de estado del servicio */}
      {serviceHealth && (
        <div className={`service-status ${serviceHealth.status === 'ok' ? 'healthy' : 'error'}`}>
          <span className="status-dot"></span>
          <span>Scraper: {serviceHealth.status === 'ok' ? 'Conectado' : 'Error'}</span>
          {serviceHealth.scraper && (
            <span className="scraper-info">
              {serviceHealth.scraper.ready ? '✅ Ready' : '❌ Not Ready'}
            </span>
          )}
        </div>
      )}

      {/* Estado de carga */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner large"></div>
          <p>Obteniendo posts de Instagram...</p>
          <small>Esto puede tomar hasta 2 minutos</small>
        </div>
      )}

      {/* Estado de error */}
      {error && !loading && (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button onClick={handleRefresh} className="retry-button">
              Reintentar
            </button>
            <button onClick={toggleLogin} className="try-login-button">
              {useLogin ? 'Probar sin login' : 'Probar con login'}
            </button>
          </div>
        </div>
      )}

      {/* Grid de posts */}
      {posts.length > 0 && !loading && (
        <>
          <div className="posts-grid">
            {posts.map((post, index) => (
              <InstagramPost 
                key={post.id || post.shortcode || index} 
                post={post} 
                index={index}
              />
            ))}
          </div>
          
          {/* Información adicional */}
          <div className="feed-footer">
            <div className="posts-info">
              <span>📊 {posts.length} posts mostrados</span>
              {lastFetch && (
                <span>• Actualizado: {lastFetch.toLocaleTimeString('es-ES')}</span>
              )}
            </div>
            
            <div className="posts-summary">
              <span>❤️ {posts.reduce((sum, post) => sum + (post.like_count || 0), 0).toLocaleString()} likes total</span>
              <span>💬 {posts.reduce((sum, post) => sum + (post.comment_count || 0), 0).toLocaleString()} comentarios total</span>
            </div>
          </div>
        </>
      )}

      {/* Estado vacío */}
      {posts.length === 0 && !loading && !error && (
        <div className="empty-state">
          <div className="empty-icon">📸</div>
          <p>No hay posts disponibles</p>
          <button onClick={handleRefresh} className="load-button">
            Cargar posts
          </button>
        </div>
      )}
    </div>
  );
};

export default InstagramFeed;