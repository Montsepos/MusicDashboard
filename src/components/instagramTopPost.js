// // components/ui/instagramTopPosts.js
// import React from 'react';
// import { Box, Typography, Stack, Card, CardMedia, CardContent } from '@mui/material';

// const InstagramTopPosts = ({ username }) => {
//   // Simulación de datos de posts populares (en una implementación real, esto vendría de una API)
//   const popularPosts = [
//     {
//       id: 'post1',
//       imageUrl: 'https://via.placeholder.com/400x400?text=Post+Popular+1',
//       likes: 15432,
//       date: '2024-04-10',
//       caption: 'Nuevo sencillo ya disponible en todas las plataformas! #música'
//     },
//     {
//       id: 'post2',
//       imageUrl: 'https://via.placeholder.com/400x400?text=Post+Popular+2',
//       likes: 12345,
//       date: '2024-03-28',
//       caption: 'Gracias por venir a nuestro concierto en Santiago! #tour2024'
//     },
//     {
//       id: 'post3',
//       imageUrl: 'https://via.placeholder.com/400x400?text=Post+Popular+3',
//       likes: 10876,
//       date: '2024-03-15',
//       caption: 'Próximamente nueva música... #nuevoálbum'
//     }
//   ];

//   return (
//     <Box sx={{ mt: 2 }}>
//       <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
//         Publicaciones más populares
//       </Typography>
      
//       <Stack 
//         direction="row" 
//         spacing={2} 
//         sx={{ 
//           overflowX: 'auto',
//           pb: 2,
//           '::-webkit-scrollbar': {
//             height: '8px',
//           },
//           '::-webkit-scrollbar-track': {
//             background: '#f1f1f1',
//             borderRadius: '10px',
//           },
//           '::-webkit-scrollbar-thumb': {
//             background: '#888',
//             borderRadius: '10px',
//           }
//         }}
//       >
//         {popularPosts.map((post) => (
//           <Card key={post.id} sx={{ minWidth: 220, maxWidth: 300, flexShrink: 0 }}>
//             <Box
//               component="a"
//               href={`https://instagram.com/${username}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               sx={{ textDecoration: 'none', color: 'inherit' }}
//             >
//               <CardMedia
//                 component="img"
//                 image={post.imageUrl}
//                 alt={post.caption}
//                 sx={{ height: 200, objectFit: 'cover' }}
//               />
//               <CardContent>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="caption" color="text.secondary">
//                     {post.date}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     ❤️ {post.likes.toLocaleString()}
//                   </Typography>
//                 </Box>
//                 <Typography 
//                   variant="body2" 
//                   sx={{ 
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis',
//                     display: '-webkit-box',
//                     WebkitLineClamp: 2,
//                     WebkitBoxOrient: 'vertical'
//                   }}
//                 >
//                   {post.caption}
//                 </Typography>
//               </CardContent>
//             </Box>
//           </Card>
//         ))}
//       </Stack>
//     </Box>
//   );
// };

// export default InstagramTopPosts;





import React, { useState, useEffect } from "react";
import { Box, Typography, Link, Stack, Card, CardMedia, CardContent, CircularProgress, Alert } from "@mui/material";
import { getTopInstagramPosts } from '../services/chatGPTServices';

const InstagramTopPosts = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugLogs, setDebugLogs] = useState([]); // Nuevo estado para logs
  const [scraperStatus, setScraperStatus] = useState(''); // Estado del scraper

  // Función para agregar logs en tiempo real
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry); // Log en consola del navegador
    setDebugLogs(prev => [...prev, logEntry]);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (!username) return;
      
      setLoading(true);
      setError(null);
      setDebugLogs([]); // Limpiar logs anteriores
      
      try {
        addLog(`🔍 Iniciando búsqueda de posts para @${username}`);
        setScraperStatus('Iniciando scraper...');
        
        // Indicar que está obteniendo los posts
        addLog('📡 Contactando con el backend...');
        setScraperStatus('Contactando backend...');
        
        const fetchedPosts = await getTopInstagramPosts(username);
        
        if (fetchedPosts && fetchedPosts.length > 0) {
          addLog(`✅ Se encontraron ${fetchedPosts.length} posts exitosamente`);
          setPosts(fetchedPosts);
          setError(null);
          setScraperStatus(`✅ Completado: ${fetchedPosts.length} posts encontrados`);
        } else {
          addLog(`⚠️ No se encontraron posts para @${username}`);
          setPosts([]);
          setError("No se encontraron publicaciones para este artista.");
          setScraperStatus('❌ No se encontraron posts');
        }
      } catch (err) {
        const errorMsg = `❌ Error: ${err.message}`;
        addLog(errorMsg);
        console.error('Error completo:', err);
        setError('No pudimos cargar las publicaciones de Instagram en este momento.');
        setPosts([]);
        setScraperStatus('❌ Error en el scraper');
      } finally {
        setLoading(false);
        addLog('🏁 Proceso terminado');
      }
    };

    fetchPosts();
  }, [username]);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
        Publicaciones más populares de @{username}
      </Typography>
      
      {/* Sección de debug - mostrar solo durante el desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Estado del Scraper: {scraperStatus}
          </Typography>
          
          {/* Mostrar logs en tiempo real */}
          {debugLogs.length > 0 && (
            <Box sx={{ maxHeight: 150, overflow: 'auto', bgcolor: 'white', p: 1, borderRadius: 1 }}>
              {debugLogs.map((log, index) => (
                <Typography key={index} variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
                  {log}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      )}
      
      {loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
          <CircularProgress size={30} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {scraperStatus || 'Ejecutando scraper...'}
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
          {process.env.NODE_ENV === 'development' && (
            <Typography variant="caption" component="div" sx={{ mt: 1 }}>
              Revisa la consola del navegador para más detalles
            </Typography>
          )}
        </Alert>
      )}

      {posts.length === 0 && !loading && !error && (
        <Typography color="text.secondary" sx={{ my: 2 }}>
          No se encontraron publicaciones para @{username}
        </Typography>
      )}

      {/* Mostrar los posts */}
      {posts.length > 0 && (
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
          {posts.map((post) => (
            <Card key={post.id} sx={{ minWidth: 250, maxWidth: 300, flexShrink: 0 }}>
              <CardMedia
                component="img"
                image={post.media_url}
                alt={post.caption?.slice(0, 30) || 'Instagram post'}
                sx={{ 
                  height: 200, 
                  objectFit: 'cover',
                  '&:hover': {
                    opacity: 0.9,
                    cursor: 'pointer'
                  }
                }}
                onClick={() => window.open(`https://instagram.com/p/${post.shortcode}`, '_blank')}
              />
              <CardContent sx={{ py: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {post.timestamp ? new Date(post.timestamp).toLocaleDateString() : 'Sin fecha'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ❤️ {post.like_count.toLocaleString()}
                  </Typography>
                </Box>
                {post.caption && (
                  <Typography variant="body2" sx={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical',
                    fontSize: '0.875rem'
                  }}>
                    {post.caption}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default InstagramTopPosts;