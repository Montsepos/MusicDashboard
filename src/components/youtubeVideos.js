// src/components/YouTubeVideos.js
import React, { useState, useEffect } from 'react';
import { getTopArtistVideos, formatViewCount, formatDuration } from '../services/youtubeService';
import { Box, Typography, Card, CardMedia, CardContent, Grid, Link, CircularProgress } from '@mui/material';

const YouTubeVideos = ({ artistName }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!artistName) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const topVideos = await getTopArtistVideos(artistName);
        setVideos(topVideos);
        
        // Seleccionar automáticamente el primer video para reproducción
        if (topVideos.length > 0) {
          setSelectedVideo(topVideos[0]);
        }
      } catch (err) {
        console.error('Error al cargar videos de YouTube:', err);
        setError('No pudimos cargar los videos en este momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [artistName]);

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
      <Typography variant="h5" component="h2" gutterBottom>
        Videos populares de {artistName}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Reproductor de video */}
        <Grid item xs={12} md={8}>
          {selectedVideo && (
            <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', bgcolor: '#000' }}>
              <iframe
                width="100%"
                height="100%"
                src={`${selectedVideo.embedUrl}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              ></iframe>
            </Box>
          )}
          
          {selectedVideo && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedVideo.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {formatViewCount(selectedVideo.viewCount)} • {new Date(selectedVideo.publishedAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {selectedVideo.description.length > 300 
                  ? `${selectedVideo.description.substring(0, 300)}...` 
                  : selectedVideo.description}
              </Typography>
            </Box>
          )}
        </Grid>
        
        {/* Lista de reproducción */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Más videos
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {videos.map((video) => (
              <Card 
                key={video.id} 
                sx={{ 
                  display: 'flex', 
                  cursor: 'pointer',
                  bgcolor: selectedVideo?.id === video.id ? 'action.selected' : 'background.paper'
                }}
                onClick={() => setSelectedVideo(video)}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 120, height: 68, flexShrink: 0 }}
                  image={video.thumbnailUrl}
                  alt={video.title}
                />
                <CardContent sx={{ flex: '1 0 auto', py: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body2" component="div" sx={{ fontWeight: 'bold', mb: 0.5, lineHeight: 1.2 }}>
                    {video.title.length > 60 ? `${video.title.substring(0, 60)}...` : video.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" component="div">
                    {formatViewCount(video.viewCount)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link 
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(artistName + ' music')}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: 'none' }}
            >
              <Typography variant="body2" color="primary">
                Ver más videos en YouTube →
              </Typography>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default YouTubeVideos;