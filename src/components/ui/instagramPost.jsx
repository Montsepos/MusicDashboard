

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Link, 
  CircularProgress,
  Chip,
  IconButton
} from '@mui/material';
import { 
  Favorite as HeartIcon, 
  Comment as CommentIcon,
  PlayArrow as PlayIcon,
  OpenInNew as OpenIcon
} from '@mui/icons-material';

const InstagramPost = ({ post, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Función para formatear números
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Función para formatear fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha desconocida';
    
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Función para obtener el icono del tipo de post
  const getPostTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
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

  // Función para abrir el post en Instagram
  const openInstagramPost = () => {
    if (post.url || post.permalink) {
      window.open(post.url || post.permalink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
      onClick={openInstagramPost}
    >
      {/* Header del post */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 1.5,
        bgcolor: '#fafafa',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '1.1rem' }}>{getPostTypeIcon(post.type)}</span>
          <Typography variant="caption" sx={{ 
            fontWeight: 600, 
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {post.type || 'IMAGE'}
          </Typography>
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          {formatDate(post.timestamp)}
        </Typography>
      </Box>

      {/* Imagen/Video del post */}
      <Box sx={{ 
        position: 'relative', 
        paddingTop: '100%', // Aspect ratio 1:1
        overflow: 'hidden'
      }}>
        {!imageLoaded && !imageError && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5'
          }}>
            <CircularProgress size={30} />
          </Box>
        )}
        
        {post.display_url && !imageError ? (
          <CardMedia
            component="img"
            src={post.display_url}
            alt={`Post de Instagram ${index + 1}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: imageLoaded ? 'block' : 'none'
            }}
          />
        ) : (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            color: '#999'
          }}>
            <span style={{ fontSize: '3rem', marginBottom: '8px' }}>📷</span>
            <Typography variant="caption">Imagen no disponible</Typography>
          </Box>
        )}
        
        {/* Overlay para video/reel */}
        {(post.is_video || post.type === 'VIDEO' || post.type === 'REEL') && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.3)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '&:hover': { opacity: 1 }
          }}>
            <IconButton sx={{ 
              bgcolor: 'rgba(255,255,255,0.9)', 
              '&:hover': { bgcolor: 'white' }
            }}>
              <PlayIcon sx={{ fontSize: '2rem' }} />
            </IconButton>
          </Box>
        )}

        {/* Botón para abrir en nueva pestaña */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255,255,255,0.9)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '&:hover': { bgcolor: 'white' },
            '.MuiCard-root:hover &': { opacity: 1 }
          }}
          onClick={(e) => {
            e.stopPropagation();
            openInstagramPost();
          }}
        >
          <OpenIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Contenido del post */}
      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
        {/* Caption */}
        {post.caption && (
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 1.5,
              color: '#333',
              lineHeight: 1.4,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {post.caption.length > 120 ? `${post.caption.substring(0, 120)}...` : post.caption}
          </Typography>
        )}

        {/* Estadísticas */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 'auto'
        }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Likes */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <HeartIcon sx={{ fontSize: '1.1rem', color: '#e91e63' }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#666' }}>
                {formatNumber(post.like_count || 0)}
              </Typography>
            </Box>
            
            {/* Comentarios */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CommentIcon sx={{ fontSize: '1.1rem', color: '#757575' }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#666' }}>
                {formatNumber(post.comment_count || 0)}
              </Typography>
            </Box>
          </Box>

          {/* Shortcode */}
          {post.shortcode && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#999',
                fontFamily: 'monospace',
                fontSize: '0.7rem'
              }}
            >
              #{post.shortcode}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const InstagramPosts = ({ posts = [], loading = false, username, artist }) => {
  console.log('🔥 [INSTAGRAM POSTS] Props:', {
    postsCount: posts.length,
    loading,
    username,
    artistName: artist?.name,
    firstPost: posts[0]
  });

  // Estado de carga
  if (loading) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, fontSize: '1.1rem' }}>
          📸 Posts de Instagram
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          py: 6,
          border: '2px dashed #e0e0e0',
          borderRadius: '8px',
          bgcolor: '#fafafa'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Obteniendo posts de Instagram...
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Esto puede tomar hasta 2 minutos
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Estado sin posts
  if (!posts || posts.length === 0) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, fontSize: '1.1rem' }}>
          📸 Posts de Instagram
        </Typography>
        <Box sx={{ 
          textAlign: 'center',
          py: 4,
          border: '2px dashed #e0e0e0',
          borderRadius: '8px',
          bgcolor: '#fafafa'
        }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📷</span>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            No se encontraron posts de Instagram
          </Typography>
          {username && (
            <Typography variant="body2" color="text.secondary">
              para @{username}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  // Calcular estadísticas
  const totalLikes = posts.reduce((sum, post) => sum + (post.like_count || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.comment_count || 0), 0);
  const postsWithImages = posts.filter(post => post.display_url).length;

  return (
    <Box sx={{ mt: 3 }}>
      {/* Header con estadísticas */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        flexWrap: 'wrap',
        gap: 1
      }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
          📸 Posts de Instagram
        </Typography>
        
        {username && (
          <Link 
            href={`https://instagram.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              color: '#2196f3',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Ver perfil completo →
          </Link>
        )}
      </Box>

      {/* Estadísticas rápidas */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 3,
        flexWrap: 'wrap'
      }}>
        <Chip 
          label={`${posts.length} posts`} 
          size="small" 
          sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
        />
        <Chip 
          label={`${totalLikes.toLocaleString()} likes total`} 
          size="small" 
          sx={{ bgcolor: '#fce4ec', color: '#c2185b' }}
        />
        <Chip 
          label={`${totalComments.toLocaleString()} comentarios`} 
          size="small" 
          sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2' }}
        />
        <Chip 
          label={`${postsWithImages}/${posts.length} con imagen`} 
          size="small" 
          sx={{ bgcolor: '#e8f5e8', color: '#388e3c' }}
        />
      </Box>

      {/* Grid de posts */}
      <Grid container spacing={2}>
        {posts.map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={post.id || post.shortcode || index}>
            <InstagramPost post={post} index={index} />
          </Grid>
        ))}
      </Grid>

      {/* Footer con link a Instagram */}
      {username && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Datos obtenidos de{' '}
            <Link 
              href={`https://instagram.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#2196f3' }}
            >
              @{username}
            </Link>
            {' '}• Actualizado en tiempo real
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default InstagramPosts;