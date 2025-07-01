
import React, { useState, useEffect } from "react";
import { Box, Typography, Link, Stack, Card, CardMedia, CardContent, CircularProgress } from "@mui/material";
import axios from 'axios';
import InstagramPosts from './ui/instagramPost';

const YouTubeVideos = ({ artistName }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Función para generar un ID de video aleatorio pero determinista basado en el nombre del artista
  const generateVideoId = (name, index) => {
    const demoVideos = [
      'dQw4w9WgXcQ', // Never Gonna Give You Up
      '9bZkp7q19f0', // Gangnam Style
      'JGwWNGJdvx8', // Shape of You
      'kJQP7kiw5Fk', // Despacito
      '6Dh-RL__uN4', // Take On Me
      'hTWKbfoikeg', // Smells Like Teen Spirit
      'fJ9rUzIMcZQ', // Bohemian Rhapsody
      'r4NQPVrPLCY', // As It Was
      'zO6D_BAuYCI', // Uptown Funk
      'OPf0YbXqDm0'  // Blinding Lights
    ];
    
    // Calcular un valor hash simple a partir del nombre del artista
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return demoVideos[(hash + index) % demoVideos.length];
  };

  useEffect(() => {
    const fetchVideos = async () => {
      if (!artistName) return;
      
      setLoading(true);
      try {
        // Simulación de tiempo de carga
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Generar 3 videos simulados basados en el nombre del artista
        const hash = artistName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        
        const mockVideos = [0, 1, 2].map(index => {
          const videoId = generateVideoId(artistName, index);
          
          // Títulos y descripciones dinámicas basadas en el artista
          const titles = [
            `${artistName} - Mejor Videoclip Oficial`,
            `${artistName} - Presentación en Vivo (Festival)`,
            `${artistName} - Sesión Acústica (Estudio)`
          ];
          
          const descriptions = [
            `Videoclip oficial de ${artistName}. Música disponible en todas las plataformas digitales.`,
            `${artistName} en vivo interpretando sus mejores éxitos en Festival de Música.`,
            `${artistName} en una íntima sesión acústica interpretando sus mejores temas.`
          ];
          
          // Números de vistas decrecientes para que el primero sea el más popular
          const viewCounts = [
            1000000 + (hash % 9000000),
            500000 + (hash % 4500000),
            250000 + (hash % 2500000)
          ];
          
          return {
            id: videoId,
            title: titles[index],
            description: descriptions[index],
            publishedAt: new Date(Date.now() - (index * 30 * 24 * 60 * 60 * 1000)).toISOString(),
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            channelTitle: artistName,
            viewCount: viewCounts[index],
            likeCount: Math.floor(viewCounts[index] / 20),
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            watchUrl: `https://www.youtube.com/watch?v=${videoId}`
          };
        });
        
        setVideos(mockVideos);
        setSelectedVideo(mockVideos[0]); // Seleccionar el primer video automáticamente
        setError(null);
      } catch (err) {
        console.error('Error al cargar videos de YouTube:', err);
        setError('No pudimos cargar los videos en este momento.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [artistName]);

  // Función para formatear el número de vistas
  const formatViewCount = (viewCount) => {
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M vistas`;
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K vistas`;
    } else {
      return `${viewCount} vistas`;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ my: 2 }}>
        {error}
      </Typography>
    );
  }

  if (videos.length === 0 && !loading) {
    return (
      <Typography color="text.secondary" sx={{ my: 2 }}>
        No se encontraron videos para {artistName}.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, fontSize: '1.1rem' }}>
        Videos populares
      </Typography>
      
      {/* Reproductor principal */}
      {selectedVideo && (
        <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', bgcolor: '#000', borderRadius: '4px', mb: 2 }}>
          <iframe
            width="100%"
            height="100%"
            src={`${selectedVideo.embedUrl}?rel=0`}
            title={selectedVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          ></iframe>
        </Box>
      )}
      
      {/* Título y detalles del video seleccionado */}
      {selectedVideo && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            {selectedVideo.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {formatViewCount(selectedVideo.viewCount)} • {new Date(selectedVideo.publishedAt).toLocaleDateString()}
          </Typography>
        </Box>
      )}
      
      {/* Lista de miniaturas */}
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          overflowX: 'auto',
          pb: 2,
          '::-webkit-scrollbar': {
            height: '8px',
          },
          '::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
          },
          '::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {videos.map((video) => (
          <Card 
            key={video.id} 
            sx={{ 
              minWidth: 220, 
              maxWidth: 300, 
              flexShrink: 0,
              border: selectedVideo?.id === video.id ? '2px solid #1976d2' : 'none'
            }}
            onClick={() => setSelectedVideo(video)}
          >
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                image={video.thumbnailUrl}
                alt={video.title}
                sx={{ 
                  height: 150, 
                  objectFit: 'cover',
                  '&:hover': {
                    opacity: 0.9,
                    cursor: 'pointer'
                  }
                }}
              />
              {/* Overlay de play */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: '48px',
                  opacity: 0.8
                }}
              >
                ▶️
              </Box>
            </Box>
            <CardContent sx={{ py: 1 }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 'medium',
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                display: '-webkit-box', 
                WebkitLineClamp: 2, 
                WebkitBoxOrient: 'vertical',
                fontSize: '0.875rem',
                lineHeight: 1.2
              }}>
                {video.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {formatViewCount(video.viewCount)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
      
      {/* Enlace a YouTube */}
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <Link 
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(artistName + ' official video')}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            color: '#2196f3',
            textDecoration: 'none',
            fontWeight: 'medium',
            fontSize: '0.875rem',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          Ver más videos en YouTube →
        </Link>
      </Box>
    </Box>
  );
};

function ArtistInfo({ 
  artist, 
  instagramHandle, 
  artistMilestones = [], 
  instagramPosts = [],
  loadingPosts = false,
  setSelectedGenre 
}) {
  console.log('🔥 [ARTIST INFO] Props recibidas:', {
    artistName: artist?.name,
    instagramHandle,
    instagramPosts: {
      type: typeof instagramPosts,
      isArray: Array.isArray(instagramPosts),
      length: instagramPosts?.length || 'N/A',
      content: instagramPosts
    },
    loadingPosts
  });

  if (!artist) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
        {/* Imagen del artista - lado izquierdo */}
        <Box sx={{ width: { xs: '100%', sm: '250px' }, flexShrink: 0 }}>
          <Box 
            component="img"
            src={artist.images.length > 0 ? artist.images[0].url : ""}
            alt={artist.name}
            sx={{ 
              width: '100%', 
              maxHeight: '300px',
              objectFit: 'cover',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          />
        </Box>
        
        {/* Información del artista - lado derecho */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, fontSize: '1.1rem' }}>
            Datos de Spotify
          </Typography>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontWeight: 'bold' }}>Artista - </Typography>
            <Typography component="span">{artist.name}</Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontWeight: 'bold' }}>Seguidores - </Typography>
            <Typography component="span">{artist.followers.total.toLocaleString()}</Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontWeight: 'bold' }}>Popularidad - </Typography>
            <Typography component="span">{artist.popularity}</Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography component="span" sx={{ fontWeight: 'bold' }}>Géneros - </Typography>
            {artist.genres.map((genre, index) => (
              <React.Fragment key={genre}>
                <Link
                  component="span"
                  onClick={() => setSelectedGenre(genre)}
                  sx={{ 
                    color: '#2196f3',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {genre}
                </Link>
                {index < artist.genres.length - 1 && <span> </span>}
              </React.Fragment>
            ))}
          </Box>
          
          {/* Hitos del artista */}
          {artistMilestones.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, fontSize: '1.1rem' }}>
                Hitos del artista
              </Typography>
              <Box component="ol" sx={{ pl: 2.5, mt: 0.5, mb: 0 }}>
                {artistMilestones.map((hito, i) => (
                  <Typography component="li" key={i} sx={{ mb: 0.5, fontSize: '0.95rem' }}>
                    {hito}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
          
          {/* Datos de Instagram básicos */}
          {instagramHandle && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, fontSize: '1.1rem' }}>
                Datos de Instagram
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography component="span" sx={{ fontWeight: 'bold' }}>Cuenta: </Typography>
                <Link 
                  href={`https://instagram.com/${instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: '#2196f3',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  @{instagramHandle}
                </Link>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Posts de Instagram */}
      {instagramHandle && (
        <Box sx={{ mt: 4 }}>
          <InstagramPosts
            posts={instagramPosts}
            loading={loadingPosts}
            username={instagramHandle}
            artist={artist}
          />
        </Box>
      )}
      
      {/* Videos de YouTube */}
      <YouTubeVideos artistName={artist.name} />
    </Box>
  );
}

export default ArtistInfo;