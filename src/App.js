
// import React, { useState, useEffect } from "react";
// import "./App.css";
// import { getArtist, getSpotifyToken } from "./services/spotifyServices";
// import AnalyzeSpotifyData from "./services/analyzeSpotify";
// import { getArtistInstagram, getArtistMilestones } from "./services/chatGPTServices";
// import { searchArtistsByGenre, getArtistStats } from "./services/spotifyServices";
// import { getInstagramPosts, getInstagramTestPosts } from './services/instagramServices'
// // AGREGAR ESTA IMPORTACIÓN
// import ArtistInfo from "./components/spotifyApi";

// import { 
//   Box, Typography, Grid, 
//   Container, TextField, Link, InputAdornment, Avatar
// } from "@mui/material";
// import SearchIcon from '@mui/icons-material/Search';

// // Botón personalizado para reemplazar el botón de Material-UI
// const CustomButton = ({ children, onClick, isActive }) => {
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         fontSize: '14px',
//         padding: '8px 16px',
//         borderRadius: '4px',
//         cursor: 'pointer',
//         backgroundColor: isActive ? '#000000' : '#FFFFFF',
//         color: isActive ? '#FFFFFF' : '#000000',
//         border: isActive ? 'none' : '1px solid #E0E0E0',
//         fontWeight: 500,
//         transition: 'all 0.2s ease'
//       }}
//     >
//       {children}
//     </button>
//   );
// };

// const UserDataSection = ({ analyzeSpotifyData }) => {
//   return (
//     <Box>
//       {/* Encabezado simplificado para "Tu Data" */}
//       <Box sx={{ pt: 2, pb: 4 }}>
//         <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
//           Tu Data
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           Aquí podrás analizar tu data de Spotify e Instagram y ver que contenido te a traído más
//           <br />oyentes y más oyentes
//         </Typography>
//       </Box>
      
//       {/* El componente AnalyzeSpotifyData se renderiza directamente aquí */}
//       {analyzeSpotifyData}
//     </Box>
//   );
// };

// const ResearchArtistsSection = ({ 
//   searchTerm, 
//   setSearchTerm, 
//   handleSearch, 
//   artistData, 
//   instagramHandle, 
//   artistMilestones, 
//   setSelectedGenre,
//   selectedGenre,
//   accessToken,
//   // ✅ NUEVAS PROPS AGREGADAS
//   instagramPosts,
//   loadingPosts
// }) => {
//   const [genreArtists, setGenreArtists] = useState([]);
//   const [selectedRelatedArtist, setSelectedRelatedArtist] = useState(null);
//   const [relatedArtistInstagram, setRelatedArtistInstagram] = useState("");
//   const [relatedArtistMilestones, setRelatedArtistMilestones] = useState([]);
//   // ✅ AGREGAR ESTADO PARA POSTS DEL ARTISTA RELACIONADO
//   const [relatedArtistPosts, setRelatedArtistPosts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Obtener artistas del género cuando cambia el género seleccionado
//   useEffect(() => {
//     async function fetchArtistsByGenre() {
//       if (selectedGenre && accessToken) {
//         try {
//           const artists = await searchArtistsByGenre(selectedGenre, accessToken);
//           setGenreArtists(artists);
//           setSelectedRelatedArtist(null);
//           setRelatedArtistInstagram("");
//           setRelatedArtistMilestones([]);
//           // ✅ RESETEAR POSTS DEL ARTISTA RELACIONADO
//           setRelatedArtistPosts([]);
//         } catch (error) {
//           console.error("Error al buscar artistas por género:", error);
//         }
//       }
//     }
    
//     fetchArtistsByGenre();
//   }, [selectedGenre, accessToken]);

//   // Manejar la selección de un artista relacionado
//   const handleRelatedArtistSelect = async (artist) => {
//     try {
//       setLoading(true);
      
//       // Obtener información detallada del artista
//       const artistDetails = await getArtistStats(artist.id, accessToken);
//       setSelectedRelatedArtist(artistDetails);
      
//       // Obtener Instagram y hitos del artista
//       const { instagram } = await getArtistInstagram(artist.name, artist.genres[0] || "");
//       setRelatedArtistInstagram(instagram);
      
//       // ✅ OBTENER POSTS DE INSTAGRAM DEL ARTISTA RELACIONADO
//       if (instagram) {
//         try {
//           console.log(`📸 Obteniendo posts para artista relacionado @${instagram}...`);
//           const posts = await getInstagramPosts(instagram);
//           console.log(`✅ Posts obtenidos para ${artist.name}:`, posts);
//           setRelatedArtistPosts(posts);
//         } catch (error) {
//           console.error("❌ Error obteniendo posts del artista relacionado:", error);
//           setRelatedArtistPosts([]);
//         }
//       } else {
//         console.log("⚠️ No se encontró Instagram para artista relacionado");
//         setRelatedArtistPosts([]);
//       }
      
//       const milestones = await getArtistMilestones(artist.name);
//       setRelatedArtistMilestones(milestones);
//     } catch (error) {
//       console.error("Error al obtener detalles del artista relacionado:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box maxWidth="1200px" mx="auto">
//       <Box sx={{ pt: 2, pb: 4 }}>
//         <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
//           Investiga a otros artistas
//         </Typography>
//         <Typography variant="body1" color="text.secondary" paragraph>
//           Busca al artista que deas investigar (puedes ser tu mismo) para poder acceder a su data de Spotify y sus 
//           mejores videos de Instagram. Además explora artistas similares de su mismo género
//         </Typography>
        
//         {/* Búsqueda sin cambios */}
//         <Box sx={{ display: 'flex', mt: 3, mb: 4 }}>
//           <TextField
//             size="small"
//             placeholder="Buscar artista"
//             variant="outlined"
//             fullWidth
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             sx={{ 
//               mr: 1,
//               maxWidth: '600px',
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '4px',
//                 '& fieldset': {
//                   borderColor: '#E0E0E0',
//                 }
//               }
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <CustomButton 
//             isActive={true}
//             onClick={handleSearch}
//           >
//             Buscar
//           </CustomButton>
//         </Box>
//       </Box>
      
//       {artistData && (
//         <Box>
//           {/* Contenedor de artistas con layout mejorado */}
//           <Box sx={{ 
//             display: 'grid',
//             gridTemplateColumns: {
//               xs: '1fr', // Una columna en pantallas pequeñas
//               lg: selectedRelatedArtist ? '1fr 1fr' : '1fr' // Dos columnas solo cuando hay artista relacionado
//             },
//             gap: 4,
//             mb: 4,
//             // Asegurar que el contenido no se desborde
//             minHeight: 'fit-content',
//             alignItems: 'start'
//           }}>
//             {/* Artista principal */}
//             <Box sx={{ 
//               minWidth: 0, // Permite que el contenido se contraiga
//               overflow: 'hidden' // Previene desbordamiento
//             }}>
//               <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#1976d2' }}>
//                 Artista Principal
//               </Typography>
//               {console.log('🔥 [APP.JS] Renderizando ArtistInfo para artista principal:', artistData.name)}
//               <ArtistInfo 
//                 artist={artistData}
//                 instagramHandle={instagramHandle}
//                 artistMilestones={artistMilestones}
//                 // ✅ PASAR LOS POSTS DE INSTAGRAM COMO PROPS
//                 instagramPosts={instagramPosts}
//                 loadingPosts={loadingPosts}
//                 setSelectedGenre={setSelectedGenre}
//               />
//             </Box>
            
//             {/* Artista relacionado */}
//             {selectedRelatedArtist && (
//               <Box sx={{ 
//                 minWidth: 0, // Permite que el contenido se contraiga
//                 overflow: 'hidden' // Previene desbordamiento
//               }}>
//                 <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#1976d2' }}>
//                   Artista Relacionado
//                 </Typography>
//                 {console.log('🔥 [APP.JS] Renderizando ArtistInfo para artista relacionado:', selectedRelatedArtist.name)}
//                 <ArtistInfo 
//                   artist={selectedRelatedArtist}
//                   instagramHandle={relatedArtistInstagram}
//                   artistMilestones={relatedArtistMilestones}
//                   // ✅ PASAR LOS POSTS DEL ARTISTA RELACIONADO
//                   instagramPosts={relatedArtistPosts}
//                   loadingPosts={loading}
//                   setSelectedGenre={setSelectedGenre}
//                 />
//               </Box>
//             )}
//           </Box>
          
//           {/* Barra horizontal de artistas del género - sin cambios */}
//           {selectedGenre && genreArtists.length > 0 && (
//             <Box sx={{ mb: 4 }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 Artistas del género "{selectedGenre}"
//               </Typography>
              
//               <Box 
//                 sx={{ 
//                   display: 'flex', 
//                   overflowX: 'auto',
//                   pb: 2,
//                   '::-webkit-scrollbar': {
//                     height: '8px',
//                   },
//                   '::-webkit-scrollbar-track': {
//                     background: '#f1f1f1',
//                     borderRadius: '10px',
//                   },
//                   '::-webkit-scrollbar-thumb': {
//                     background: '#888',
//                     borderRadius: '10px',
//                   },
//                   '::-webkit-scrollbar-thumb:hover': {
//                     background: '#555',
//                   },
//                 }}
//               >
//                 {genreArtists.map((artist) => (
//                   <Box
//                     key={artist.id}
//                     sx={{
//                       minWidth: '130px',
//                       p: 1,
//                       mr: 2,
//                       textAlign: 'center',
//                       cursor: 'pointer',
//                       border: selectedRelatedArtist?.id === artist.id ? '2px solid #000' : '2px solid transparent',
//                       borderRadius: '8px',
//                       transition: 'all 0.2s',
//                       '&:hover': {
//                         transform: 'translateY(-5px)',
//                       }
//                     }}
//                     onClick={() => handleRelatedArtistSelect(artist)}
//                   >
//                     <img
//                       src={artist.images.length > 0 ? artist.images[0].url : ""}
//                       alt={artist.name}
//                       style={{
//                         width: '100%',
//                         aspectRatio: '1/1',
//                         objectFit: 'cover',
//                         borderRadius: '4px',
//                         marginBottom: '8px'
//                       }}
//                     />
//                     <Typography 
//                       variant="body2" 
//                       sx={{ 
//                         fontWeight: selectedRelatedArtist?.id === artist.id ? 'bold' : 'normal',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                         whiteSpace: 'nowrap'
//                       }}
//                     >
//                       {artist.name}
//                     </Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </Box>
//           )}
//         </Box>
//       )}
//     </Box>
//   );
// };

// function App() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [artistData, setArtistData] = useState(null);
//   const [artistMilestones, setArtistMilestones] = useState([]);
//   const [spotifyAccessToken, setSpotifyAccessToken] = useState("");
//   const [selectedGenre, setSelectedGenre] = useState(null);
//   const [instagramHandle, setInstagramHandle] = useState("");
//   const [selectedSection, setSelectedSection] = useState("userdata");
  
//   // ✅ NUEVOS ESTADOS PARA LOS POSTS DE INSTAGRAM
//   const [instagramPosts, setInstagramPosts] = useState([]);
//   const [loadingPosts, setLoadingPosts] = useState(false);

//   useEffect(() => {
//     getSpotifyToken().then((token) => {
//       setSpotifyAccessToken(token);
//       console.log("Token de Spotify obtenido:", token);
//     });
//   }, []);

//   // ✅ FUNCIÓN handleSearch COMPLETAMENTE MEJORADA
//   async function handleSearch(e) {
//     if (e) e.preventDefault();
//     if (!searchTerm || !spotifyAccessToken) return;

//     try {
//       console.log(`🔍 Iniciando búsqueda para: ${searchTerm}`);
      
//       // 1. Obtener datos del artista de Spotify
//       const artist = await getArtist(searchTerm, spotifyAccessToken);
//       setArtistData(artist);

//       if (artist?.name) {
//         console.log("🎵 GENERO DEL ARTISTA:", artist.genres[0]);
        
//         // 2. Obtener Instagram handle del artista
//         const { instagram } = await getArtistInstagram(artist.name, artist.genres[0] || "");
//         setInstagramHandle(instagram);
//         console.log(`📱 Instagram handle encontrado: @${instagram}`);

//         // 3. ✅ OBTENER POSTS USANDO EL INSTAGRAM HANDLE (NO EL NOMBRE DEL ARTISTA)
//         if (instagram && instagram.trim()) {
//           setLoadingPosts(true);
//           try {
//             console.log(`📸 Obteniendo posts de Instagram para @${instagram}...`);
//             const posts = await getInstagramPosts(instagram);
//             console.log(`✅ ${posts.length} posts de Instagram obtenidos:`, posts);
//             setInstagramPosts(posts);
//           } catch (error) {
//             console.error("❌ Error obteniendo posts de Instagram:", error);
//             setInstagramPosts([]);
//           } finally {
//             setLoadingPosts(false);
//           }
//         } else {
//           console.log("⚠️ No se encontró handle de Instagram válido para este artista");
//           setInstagramPosts([]);
//           setLoadingPosts(false);
//         }

//         // 4. Obtener milestones del artista
//         console.log(`🏆 Obteniendo milestones para ${artist.name}...`);
//         const milestones = await getArtistMilestones(artist.name);
//         setArtistMilestones(milestones);
//         console.log(`✅ Milestones obtenidos:`, milestones);
//       }

//       // 5. Configurar género
//       if (artist && artist.genres && artist.genres.length > 0) {
//         setSelectedGenre(artist.genres[0]);
//       } else {
//         setSelectedGenre(null);
//       }
      
//       console.log("✅ Búsqueda completada exitosamente");
//     } catch (error) {
//       console.error("❌ Error en la búsqueda:", error);
//       // ✅ RESETEAR TODOS LOS ESTADOS EN CASO DE ERROR
//       setArtistData(null);
//       setInstagramHandle("");
//       setInstagramPosts([]);
//       setArtistMilestones([]);
//       setLoadingPosts(false);
//       setSelectedGenre(null);
//     }
//   }

//   return (
//     <Container maxWidth="xl" sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       {/* Header pequeño + botones */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, width: '100%' }}>
//         <Typography variant="h6" component="h1" fontWeight="bold">
//           Music Dashboard
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <CustomButton 
//             isActive={selectedSection === "userdata"}
//             onClick={() => setSelectedSection("userdata")}
//           >
//             Tu Data
//           </CustomButton>
//           <CustomButton 
//             isActive={selectedSection === "research"}
//             onClick={() => setSelectedSection("research")}
//           >
//             Investiga
//           </CustomButton>
//         </Box>
//       </Box>

//       {/* Contenido según botón apretado */}
//       {selectedSection === "userdata" && (
//         <Grid container spacing={3} justifyContent="center">
//           <Grid item xs={12} md={10} lg={8}>
//             <UserDataSection analyzeSpotifyData={<AnalyzeSpotifyData />} />
//           </Grid>
//         </Grid>
//       )}

//       {selectedSection === "research" && (
//         <Box width="100%">
//           <ResearchArtistsSection 
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             handleSearch={handleSearch}
//             artistData={artistData}
//             instagramHandle={instagramHandle}
//             artistMilestones={artistMilestones}
//             setSelectedGenre={setSelectedGenre}
//             selectedGenre={selectedGenre}
//             accessToken={spotifyAccessToken}
//             // ✅ PASAR LAS NUEVAS PROPS DE INSTAGRAM
//             instagramPosts={instagramPosts}
//             loadingPosts={loadingPosts}
//           />
//         </Box>
//       )}
//     </Container>
//   );
// }

// export default App;


import React, { useState, useEffect } from "react";
import "./App.css";
import { getArtist, getSpotifyToken } from "./services/spotifyServices";
import AnalyzeSpotifyData from "./services/analyzeSpotify";
import { getArtistInstagram, getArtistMilestones } from "./services/chatGPTServices";
import { searchArtistsByGenre, getArtistStats } from "./services/spotifyServices";
import { getInstagramPosts, getInstagramTestPosts } from './services/instagramServices'
import ArtistInfo from "./components/spotifyApi";

import { 
  Box, Typography, Grid, 
  Container, TextField, Link, InputAdornment, Avatar
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

//modularizar
const CustomButton = ({ children, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: '14px',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: isActive ? '#000000' : '#FFFFFF',
        color: isActive ? '#FFFFFF' : '#000000',
        border: isActive ? 'none' : '1px solid #E0E0E0',
        fontWeight: 500,
        transition: 'all 0.2s ease'
      }}
    >
      {children}
    </button>
  );
};

const UserDataSection = ({ analyzeSpotifyData }) => {
  return (
    <Box>
      {/* Encabezado simplificado para "Tu Data" */}
      <Box sx={{ pt: 2, pb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
          Tu Data
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aquí podrás analizar tu data de Spotify e Instagram y ver que contenido te a traído más
          <br />oyentes y más oyentes
        </Typography>
      </Box>
      
      {/* El componente AnalyzeSpotifyData se renderiza directamente aquí */}
      {analyzeSpotifyData}
    </Box>
  );
};

const ResearchArtistsSection = ({ 
  searchTerm, 
  setSearchTerm, 
  handleSearch, 
  artistData, 
  instagramHandle, 
  artistMilestones, 
  setSelectedGenre,
  selectedGenre,
  accessToken,
  instagramPosts,
  loadingPosts
}) => {
  const [genreArtists, setGenreArtists] = useState([]);
  const [selectedRelatedArtist, setSelectedRelatedArtist] = useState(null);
  const [relatedArtistInstagram, setRelatedArtistInstagram] = useState("");
  const [relatedArtistMilestones, setRelatedArtistMilestones] = useState([]);
  const [relatedArtistPosts, setRelatedArtistPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchArtistsByGenre() {
      if (selectedGenre && accessToken) {
        try {
          const artists = await searchArtistsByGenre(selectedGenre, accessToken);
          setGenreArtists(artists);
          setSelectedRelatedArtist(null);
          setRelatedArtistInstagram("");
          setRelatedArtistMilestones([]);
          setRelatedArtistPosts([]);
        } catch (error) {
          console.error("Error al buscar artistas por género:", error);
        }
      }
    }
    
    fetchArtistsByGenre();
  }, [selectedGenre, accessToken]);

  // Manejar la selección de un artista relacionado
  const handleRelatedArtistSelect = async (artist) => {
    try {
      setLoading(true);
      
      // Obtener información detallada del artista
      const artistDetails = await getArtistStats(artist.id, accessToken);
      setSelectedRelatedArtist(artistDetails);
      
      // Obtener Instagram y hitos del artista
      const { instagram } = await getArtistInstagram(artist.name, artist.genres[0] || "");
      setRelatedArtistInstagram(instagram);
      
      if (instagram) {
        try {
          console.log(`📸 Obteniendo posts para artista relacionado @${instagram}...`);
          const instagramData = await getInstagramPosts(instagram);
          
          if (instagramData.success && instagramData.posts && Array.isArray(instagramData.posts) && instagramData.posts.length > 0) {
            console.log(`✅ ${instagramData.posts.length} posts obtenidos para ${artist.name}:`, instagramData.posts);
            setRelatedArtistPosts(instagramData.posts);
          } else {
            console.log(`⚠️ No se encontraron posts para ${artist.name}:`, instagramData.error || 'Sin posts');
            setRelatedArtistPosts([]);
          }
        } catch (error) {
          console.error("❌ Error obteniendo posts del artista relacionado:", error);
          setRelatedArtistPosts([]);
        }
      } else {
        console.log("⚠️ No se encontró Instagram para artista relacionado");
        setRelatedArtistPosts([]);
      }
      
      const milestones = await getArtistMilestones(artist.name);
      setRelatedArtistMilestones(milestones);
    } catch (error) {
      console.error("Error al obtener detalles del artista relacionado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth="1200px" mx="auto">
      <Box sx={{ pt: 2, pb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
          Investiga a otros artistas
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Busca al artista que deas investigar (puedes ser tu mismo) para poder acceder a su data de Spotify y sus 
          mejores videos de Instagram. Además explora artistas similares de su mismo género
        </Typography>
        
        {/* Búsqueda sin cambios */}
        <Box sx={{ display: 'flex', mt: 3, mb: 4 }}>
          <TextField
            size="small"
            placeholder="Buscar artista"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              mr: 1,
              maxWidth: '600px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                '& fieldset': {
                  borderColor: '#E0E0E0',
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <CustomButton 
            isActive={true}
            onClick={handleSearch}
          >
            Buscar
          </CustomButton>
        </Box>
      </Box>
      
      {artistData && (
        <Box>
          {/* Contenedor de artistas con layout mejorado */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr', // Una columna en pantallas pequeñas
              lg: selectedRelatedArtist ? '1fr 1fr' : '1fr' // Dos columnas solo cuando hay artista relacionado
            },
            gap: 4,
            mb: 4,
            // Asegurar que el contenido no se desborde
            minHeight: 'fit-content',
            alignItems: 'start'
          }}>
            {/* Artista principal */}
            <Box sx={{ 
              minWidth: 0, // Permite que el contenido se contraiga
              overflow: 'hidden' // Previene desbordamiento
            }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#1976d2' }}>
                Artista Principal
              </Typography>
              {console.log('🔥 [APP.JS] Renderizando ArtistInfo para artista principal:', artistData.name)}
              <ArtistInfo 
                artist={artistData}
                instagramHandle={instagramHandle}
                artistMilestones={artistMilestones}
                // ✅ PASAR LOS POSTS DE INSTAGRAM COMO PROPS
                instagramPosts={instagramPosts}
                loadingPosts={loadingPosts}
                setSelectedGenre={setSelectedGenre}
              />
            </Box>
            
            {/* Artista relacionado */}
            {selectedRelatedArtist && (
              <Box sx={{ 
                minWidth: 0, // Permite que el contenido se contraiga
                overflow: 'hidden' // Previene desbordamiento
              }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#1976d2' }}>
                  Artista Relacionado
                </Typography>
                {console.log('🔥 [APP.JS] Renderizando ArtistInfo para artista relacionado:', selectedRelatedArtist.name)}
                <ArtistInfo 
                  artist={selectedRelatedArtist}
                  instagramHandle={relatedArtistInstagram}
                  artistMilestones={relatedArtistMilestones}
                  // ✅ PASAR LOS POSTS DEL ARTISTA RELACIONADO
                  instagramPosts={relatedArtistPosts}
                  loadingPosts={loading}
                  setSelectedGenre={setSelectedGenre}
                />
              </Box>
            )}
          </Box>
          
          {/* Barra horizontal de artistas del género - sin cambios */}
          {selectedGenre && genreArtists.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Artistas del género "{selectedGenre}"
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
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
                {genreArtists.map((artist) => (
                  <Box
                    key={artist.id}
                    sx={{
                      minWidth: '130px',
                      p: 1,
                      mr: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: selectedRelatedArtist?.id === artist.id ? '2px solid #000' : '2px solid transparent',
                      borderRadius: '8px',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      }
                    }}
                    onClick={() => handleRelatedArtistSelect(artist)}
                  >
                    <img
                      src={artist.images.length > 0 ? artist.images[0].url : ""}
                      alt={artist.name}
                      style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginBottom: '8px'
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: selectedRelatedArtist?.id === artist.id ? 'bold' : 'normal',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {artist.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [artistData, setArtistData] = useState(null);
  const [artistMilestones, setArtistMilestones] = useState([]);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [instagramHandle, setInstagramHandle] = useState("");
  const [selectedSection, setSelectedSection] = useState("userdata");
  
  // ✅ NUEVOS ESTADOS PARA LOS POSTS DE INSTAGRAM
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    getSpotifyToken().then((token) => {
      setSpotifyAccessToken(token);
      console.log("Token de Spotify obtenido:", token);
    });
  }, []);

  // ✅ AGREGAR useEffect PARA DEBUGGING (temporal)
  useEffect(() => {
    console.log('🐛 [APP.JS] Estado instagramPosts cambió:', {
      type: typeof instagramPosts,
      isArray: Array.isArray(instagramPosts),
      length: instagramPosts?.length || 'N/A',
      content: instagramPosts
    });
  }, [instagramPosts]);

  // ✅ FUNCIÓN handleSearch COMPLETAMENTE CORREGIDA
  async function handleSearch(e) {
    if (e) e.preventDefault();
    if (!searchTerm || !spotifyAccessToken) return;

    try {
      console.log(`🔍 Iniciando búsqueda para: ${searchTerm}`);
      
      // 1. Obtener datos del artista de Spotify
      const artist = await getArtist(searchTerm, spotifyAccessToken);
      setArtistData(artist);

      if (artist?.name) {
        console.log("🎵 GENERO DEL ARTISTA:", artist.genres[0]);
        
        // 2. Obtener Instagram handle del artista
        const { instagram } = await getArtistInstagram(artist.name, artist.genres[0] || "");
        setInstagramHandle(instagram);
        console.log(`📱 Instagram handle encontrado: @${instagram}`);

        // 3. ✅ OBTENER POSTS - CÓDIGO COMPLETAMENTE CORREGIDO
        if (instagram && instagram.trim()) {
          setLoadingPosts(true);
          try {
            console.log(`📸 Obteniendo posts de Instagram para @${instagram}...`);
            const instagramData = await getInstagramPosts(instagram);
            
            // 🐛 DEBUG: Ver qué devuelve el servicio
            console.log('🐛 [APP.JS] Respuesta completa de Instagram:', instagramData);
            console.log('🐛 [APP.JS] Success:', instagramData.success);
            console.log('🐛 [APP.JS] Posts count:', instagramData.posts_count);
            console.log('🐛 [APP.JS] Posts array:', instagramData.posts);

            // ✅ VALIDAR Y EXTRAER POSTS CORRECTAMENTE
            if (instagramData.success && instagramData.posts && Array.isArray(instagramData.posts) && instagramData.posts.length > 0) {
              console.log(`✅ ${instagramData.posts.length} posts de Instagram obtenidos:`, instagramData.posts);
              setInstagramPosts(instagramData.posts); // ← SOLO LOS POSTS, NO TODO EL OBJETO
            } else {
              console.log(`⚠️ No se encontraron posts válidos para @${instagram}`);
              console.log('🐛 [APP.JS] Razón:', instagramData.error || 'Posts array vacío o inválido');
              setInstagramPosts([]); // ← ARRAY VACÍO
            }
          } catch (error) {
            console.error("❌ Error obteniendo posts de Instagram:", error);
            setInstagramPosts([]);
          } finally {
            setLoadingPosts(false);
          }
        } else {
          console.log("⚠️ No se encontró handle de Instagram válido para este artista");
          setInstagramPosts([]);
          setLoadingPosts(false);
        }

        // 4. Obtener milestones del artista
        console.log(`🏆 Obteniendo milestones para ${artist.name}...`);
        const milestones = await getArtistMilestones(artist.name);
        setArtistMilestones(milestones);
        console.log(`✅ Milestones obtenidos:`, milestones);
      }

      // 5. Configurar género
      if (artist && artist.genres && artist.genres.length > 0) {
        setSelectedGenre(artist.genres[0]);
      } else {
        setSelectedGenre(null);
      }
      
      console.log("✅ Búsqueda completada exitosamente");
    } catch (error) {
      console.error("❌ Error en la búsqueda:", error);
      // ✅ RESETEAR TODOS LOS ESTADOS EN CASO DE ERROR
      setArtistData(null);
      setInstagramHandle("");
      setInstagramPosts([]);
      setArtistMilestones([]);
      setLoadingPosts(false);
      setSelectedGenre(null);
    }
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header pequeño + botones */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, width: '100%' }}>
        <Typography variant="h6" component="h1" fontWeight="bold">
          Music Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CustomButton 
            isActive={selectedSection === "userdata"}
            onClick={() => setSelectedSection("userdata")}
          >
            Tu Data
          </CustomButton>
          <CustomButton 
            isActive={selectedSection === "research"}
            onClick={() => setSelectedSection("research")}
          >
            Investiga
          </CustomButton>
        </Box>
      </Box>

      {/* Contenido según botón apretado */}
      {selectedSection === "userdata" && (
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <UserDataSection analyzeSpotifyData={<AnalyzeSpotifyData />} />
          </Grid>
        </Grid>
      )}

      {selectedSection === "research" && (
        <Box width="100%">
          <ResearchArtistsSection 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            artistData={artistData}
            instagramHandle={instagramHandle}
            artistMilestones={artistMilestones}
            setSelectedGenre={setSelectedGenre}
            selectedGenre={selectedGenre}
            accessToken={spotifyAccessToken}
            // ✅ PASAR LAS NUEVAS PROPS DE INSTAGRAM
            instagramPosts={instagramPosts}
            loadingPosts={loadingPosts}
          />
        </Box>
      )}
    </Container>
  );
}

export default App;