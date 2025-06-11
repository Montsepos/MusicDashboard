// src/services/youtubeService.js
import axios from 'axios';

// Reemplaza con tu clave de API real
const API_KEY = 'AIzaSyAKQW8KXCcemxOUxZoD_gPKFD6J2wpyDw8';
console.log('BUSCANDO VIDEOS');
// Cache para almacenar resultados y minimizar llamadas a la API
const cacheExpiration = 24 * 60 * 60 * 1000; // 24 horas
const cache = new Map();

export const getTopArtistVideos = async (artistName, maxResults = 3) => {
  if (!artistName) return [];
  
  // Crear una clave de caché que incluya el nombre del artista y la cantidad de resultados
  const cacheKey = `${artistName}-${maxResults}`;
  
  // Comprobar si hay datos en caché
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    // Si la caché está fresca, usarla
    if (Date.now() - timestamp < cacheExpiration) {
      console.log(`Usando datos en caché YOUTUBE para ${artistName}`);
      return data;
    }
  }
  
  console.log(`Buscando videos de YouTube para: ${artistName}`);
  
  try {
    // Búsqueda de videos del artista
    const searchQuery = `${artistName} official music video`;
    const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: API_KEY,
        q: searchQuery,
        part: 'snippet',
        type: 'video',
        videoEmbeddable: true,
        maxResults: maxResults,
        videoCategoryId: '10', // Categoría "Music"
        order: 'viewCount', // Ordenar por número de vistas
      }
    });
    
    // Extraer los IDs de los videos
    const videoIds = searchResponse.data.items.map(item => item.id.videoId);
    
    // Obtener estadísticas detalladas de los videos
    const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        key: API_KEY,
        id: videoIds.join(','),
        part: 'snippet,statistics,contentDetails'
      }
    });
    
    // Procesar los resultados
    const videos = videoResponse.data.items.map(video => ({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      thumbnailUrl: video.snippet.thumbnails.high.url,
      channelTitle: video.snippet.channelTitle,
      channelId: video.snippet.channelId,
      viewCount: parseInt(video.statistics.viewCount, 10),
      likeCount: parseInt(video.statistics.likeCount, 10) || 0,
      commentCount: parseInt(video.statistics.commentCount, 10) || 0,
      duration: video.contentDetails.duration, // Formato ISO 8601
      embedUrl: `https://www.youtube.com/embed/${video.id}`,
      watchUrl: `https://www.youtube.com/watch?v=${video.id}`
    }));
    
    // Guardar en caché
    cache.set(cacheKey, {
      data: videos,
      timestamp: Date.now()
    });
    
    return videos;
  } catch (error) {
    console.error('Error al obtener videos de YouTube:', error.response?.data || error.message);
    
    // Si hay un error, intentar devolver datos en caché aunque estén expirados
    if (cache.has(cacheKey)) {
      console.log('Usando datos en caché expirados debido a un error');
      return cache.get(cacheKey).data;
    }
    
    // Si no hay caché, devolver videos de ejemplo
    return [
      {
        id: 'dummyId1',
        title: `${artistName} - Best Music Video (Example)`,
        description: 'This is an example video when YouTube API is unavailable',
        publishedAt: new Date().toISOString(),
        thumbnailUrl: 'https://via.placeholder.com/480x360?text=Example+Music+Video',
        channelTitle: artistName,
        viewCount: 1000000,
        likeCount: 50000,
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Un video de respaldo
        watchUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: 'dummyId2',
        title: `${artistName} - Live Performance (Example)`,
        description: 'Example live performance video',
        publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        thumbnailUrl: 'https://via.placeholder.com/480x360?text=Live+Performance',
        channelTitle: artistName,
        viewCount: 500000,
        likeCount: 25000,
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        watchUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: 'dummyId3',
        title: `${artistName} - Acoustic Session (Example)`,
        description: 'Example acoustic session video',
        publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        thumbnailUrl: 'https://via.placeholder.com/480x360?text=Acoustic+Session',
        channelTitle: artistName,
        viewCount: 250000,
        likeCount: 12500,
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        watchUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ];
  }
};

// Función para formatear el número de vistas
export const formatViewCount = (viewCount) => {
  if (viewCount >= 1000000) {
    return `${(viewCount / 1000000).toFixed(1)}M vistas`;
  } else if (viewCount >= 1000) {
    return `${(viewCount / 1000).toFixed(1)}K vistas`;
  } else {
    return `${viewCount} vistas`;
  }
};

// Función para formatear la duración ISO 8601 a minutos:segundos
export const formatDuration = (isoDuration) => {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = (match[1] && match[1].replace('H', '')) || 0;
  const minutes = (match[2] && match[2].replace('M', '')) || 0;
  const seconds = (match[3] && match[3].replace('S', '')) || 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};