
// import React, { useState, useEffect } from "react";
// import "./App.css";
// import { getArtist, getSpotifyToken } from "./services/spotifyServices";
// import AnalyzeSpotifyData from "./services/analyzeSpotify";
// import { getArtistInstagram, getArtistMilestones } from "./services/chatGPTServices";
// import { searchArtistsByGenre, getArtistStats } from "./services/spotifyServices";
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
//   accessToken
// }) => {
//   const [genreArtists, setGenreArtists] = useState([]);
//   const [selectedRelatedArtist, setSelectedRelatedArtist] = useState(null);
//   const [relatedArtistInstagram, setRelatedArtistInstagram] = useState("");
//   const [relatedArtistMilestones, setRelatedArtistMilestones] = useState([]);
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
      
//       const milestones = await getArtistMilestones(artist.name);
//       setRelatedArtistMilestones(milestones);
//     } catch (error) {
//       console.error("Error al obtener detalles del artista relacionado:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box maxWidth="1000px" mx="auto">
//       <Box sx={{ pt: 2, pb: 4 }}>
//         <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
//           Investiga a otros artistas
//         </Typography>
//         <Typography variant="body1" color="text.secondary" paragraph>
//           Busca al artista que deas investigar (puedes ser tu mismo) para poder acceder a su data de Spotify y sus 
//           mejores videos de Instagram. Además explora artistas similares de su mismo género
//         </Typography>
        
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
      
//       {/* Mostrar información del artista principal */}
//       {artistData && (
//         <Box>
//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
//             {/* Columna del artista principal */}
//             <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
//               <Box sx={{ mb: 2 }}>
//                 <img
//                   src={artistData.images.length > 0 ? artistData.images[0].url : ""}
//                   alt={artistData.name}
//                   style={{ 
//                     width: '100%',
//                     maxHeight: '300px',
//                     objectFit: 'cover',
//                     borderRadius: '4px'
//                   }}
//                 />
//               </Box>
              
//               <Box>
//                 <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
//                   Datos de Spotify
//                 </Typography>
                
//                 <Box sx={{ mb: 1 }}>
//                   <Typography component="span" sx={{ fontWeight: 'bold' }}>Artista - </Typography>
//                   <Typography component="span">{artistData.name}</Typography>
//                 </Box>
                
//                 <Box sx={{ mb: 1 }}>
//                   <Typography component="span" sx={{ fontWeight: 'bold' }}>Seguidores - </Typography>
//                   <Typography component="span">{artistData.followers.total.toLocaleString()}</Typography>
//                 </Box>
                
//                 <Box sx={{ mb: 1 }}>
//                   <Typography component="span" sx={{ fontWeight: 'bold' }}>Popularidad - </Typography>
//                   <Typography component="span">{artistData.popularity}</Typography>
//                 </Box>
                
//                 <Box sx={{ mb: 3 }}>
//                   <Typography component="span" sx={{ fontWeight: 'bold' }}>Géneros - </Typography>
//                   {artistData.genres.map((genre, index) => (
//                     <React.Fragment key={genre}>
//                       <Link
//                         component="span"
//                         onClick={() => setSelectedGenre(genre)}
//                         sx={{ 
//                           color: '#2196f3',
//                           cursor: 'pointer',
//                           textDecoration: 'none',
//                           '&:hover': { textDecoration: 'underline' }
//                         }}
//                       >
//                         {genre}
//                       </Link>
//                       {index < artistData.genres.length - 1 && <span> </span>}
//                     </React.Fragment>
//                   ))}
//                 </Box>
                
//                 {/* Hitos del artista */}
//                 {artistMilestones.length > 0 && (
//                   <Box sx={{ mb: 3 }}>
//                     <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
//                       Hitos del artista
//                     </Typography>
//                     <Box component="ol" sx={{ pl: 2.5, mt: 0.5, mb: 0 }}>
//                       {artistMilestones.map((hito, i) => (
//                         <Typography component="li" key={i} sx={{ mb: 0.5, fontSize: '0.95rem' }}>
//                           {hito}
//                         </Typography>
//                       ))}
//                     </Box>
//                   </Box>
//                 )}
                
//                 {/* Datos de Instagram */}
//                 {instagramHandle && (
//                   <Box>
//                     <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
//                       Datos de Instagram
//                     </Typography>
//                     <Box sx={{ mb: 1 }}>
//                       <Typography component="span" sx={{ fontWeight: 'bold' }}>Cuenta: </Typography>
//                       <Link 
//                         href={`https://instagram.com/${instagramHandle}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         sx={{ 
//                           color: '#2196f3',
//                           textDecoration: 'none',
//                           fontWeight: 'bold',
//                           '&:hover': { textDecoration: 'underline' }
//                         }}
//                       >
//                         @{instagramHandle}
//                       </Link>
//                     </Box>
//                     <Typography component="p" sx={{ mt: 1 }}>
//                       Sus mejores videos...
//                     </Typography>
//                   </Box>
//                 )}
//               </Box>
//             </Box>
            
//             {/* Columna del artista relacionado */}
//             {selectedRelatedArtist && (
//               <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
//                 <Box sx={{ mb: 2 }}>
//                   <img
//                     src={selectedRelatedArtist.images.length > 0 ? selectedRelatedArtist.images[0].url : ""}
//                     alt={selectedRelatedArtist.name}
//                     style={{ 
//                       width: '100%',
//                       maxHeight: '300px',
//                       objectFit: 'cover',
//                       borderRadius: '4px'
//                     }}
//                   />
//                 </Box>
                
//                 <Box>
//                   <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
//                     Datos de Spotify
//                   </Typography>
                  
//                   <Box sx={{ mb: 1 }}>
//                     <Typography component="span" sx={{ fontWeight: 'bold' }}>Artista - </Typography>
//                     <Typography component="span">{selectedRelatedArtist.name}</Typography>
//                   </Box>
                  
//                   <Box sx={{ mb: 1 }}>
//                     <Typography component="span" sx={{ fontWeight: 'bold' }}>Seguidores - </Typography>
//                     <Typography component="span">{selectedRelatedArtist.followers.total.toLocaleString()}</Typography>
//                   </Box>
                  
//                   <Box sx={{ mb: 1 }}>
//                     <Typography component="span" sx={{ fontWeight: 'bold' }}>Popularidad - </Typography>
//                     <Typography component="span">{selectedRelatedArtist.popularity}</Typography>
//                   </Box>
                  
//                   <Box sx={{ mb: 3 }}>
//                     <Typography component="span" sx={{ fontWeight: 'bold' }}>Géneros - </Typography>
//                     {selectedRelatedArtist.genres.map((genre, index) => (
//                       <React.Fragment key={genre}>
//                         <Link
//                           component="span"
//                           sx={{ 
//                             color: '#2196f3',
//                             cursor: 'pointer',
//                             textDecoration: 'none',
//                             '&:hover': { textDecoration: 'underline' }
//                           }}
//                         >
//                           {genre}
//                         </Link>
//                         {index < selectedRelatedArtist.genres.length - 1 && <span> </span>}
//                       </React.Fragment>
//                     ))}
//                   </Box>
                  
//                   {/* Hitos del artista relacionado */}
//                   {relatedArtistMilestones.length > 0 && (
//                     <Box sx={{ mb: 3 }}>
//                       <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
//                         Hitos del artista
//                       </Typography>
//                       <Box component="ol" sx={{ pl: 2.5, mt: 0.5, mb: 0 }}>
//                         {relatedArtistMilestones.map((hito, i) => (
//                           <Typography component="li" key={i} sx={{ mb: 0.5, fontSize: '0.95rem' }}>
//                             {hito}
//                           </Typography>
//                         ))}
//                       </Box>
//                     </Box>
//                   )}
                  
//                   {/* Datos de Instagram */}
//                   {relatedArtistInstagram && (
//                     <Box>
//                       <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
//                         Datos de Instagram
//                       </Typography>
//                       <Box sx={{ mb: 1 }}>
//                         <Typography component="span" sx={{ fontWeight: 'bold' }}>Cuenta: </Typography>
//                         <Link 
//                           href={`https://instagram.com/${relatedArtistInstagram}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           sx={{ 
//                             color: '#2196f3',
//                             textDecoration: 'none',
//                             fontWeight: 'bold',
//                             '&:hover': { textDecoration: 'underline' }
//                           }}
//                         >
//                           @{relatedArtistInstagram}
//                         </Link>
//                       </Box>
//                       <Typography component="p" sx={{ mt: 1 }}>
//                         Sus mejores videos...
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//               </Box>
//             )}
//           </Box>
          
//           {/* Barra horizontal de artistas del género */}
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

//   useEffect(() => {
//     getSpotifyToken().then((token) => {
//       setSpotifyAccessToken(token);
//       console.log("Token de Spotify obtenido:", token);
//     });
//   }, []);

//   async function handleSearch(e) {
//     if (e) e.preventDefault();
//     if (!searchTerm || !spotifyAccessToken) return;

//     const artist = await getArtist(searchTerm, spotifyAccessToken);
//     setArtistData(artist);

//     if (artist?.name) {
//       console.log("GENERO DEL ARTISTA:", artist.genres[0]);
//       const { instagram } = await getArtistInstagram(artist.name, artist.genres[0]);
//       setInstagramHandle(instagram);

//       const milestones = await getArtistMilestones(artist.name);
//       setArtistMilestones(milestones);
//     }

//     if (artist && artist.genres && artist.genres.length > 0) {
//       setSelectedGenre(artist.genres[0]);
//     } else {
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
import {getInstagramTopPosts} from "./services/instagramServices";
// AGREGAR ESTA IMPORTACIÓN
import ArtistInfo from "./components/spotifyApi";

import { 
  Box, Typography, Grid, 
  Container, TextField, Link, InputAdornment, Avatar
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

// Botón personalizado para reemplazar el botón de Material-UI
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
  accessToken
}) => {
  const [genreArtists, setGenreArtists] = useState([]);
  const [selectedRelatedArtist, setSelectedRelatedArtist] = useState(null);
  const [relatedArtistInstagram, setRelatedArtistInstagram] = useState("");
  const [relatedArtistMilestones, setRelatedArtistMilestones] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener artistas del género cuando cambia el género seleccionado
  useEffect(() => {
    async function fetchArtistsByGenre() {
      if (selectedGenre && accessToken) {
        try {
          const artists = await searchArtistsByGenre(selectedGenre, accessToken);
          setGenreArtists(artists);
          setSelectedRelatedArtist(null);
          setRelatedArtistInstagram("");
          setRelatedArtistMilestones([]);
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
      
      const milestones = await getArtistMilestones(artist.name);
      setRelatedArtistMilestones(milestones);
    } catch (error) {
      console.error("Error al obtener detalles del artista relacionado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth="1200px" mx="auto"> {/* Aumentar maxWidth */}
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
      
      {/* REEMPLAZA TODA ESTA SECCIÓN CON EL CÓDIGO CORREGIDO */}
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

  useEffect(() => {
    getSpotifyToken().then((token) => {
      setSpotifyAccessToken(token);
      console.log("Token de Spotify obtenido:", token);
    });
  }, []);

  async function handleSearch(e) {
    if (e) e.preventDefault();
    if (!searchTerm || !spotifyAccessToken) return;

    const artist = await getArtist(searchTerm, spotifyAccessToken);
    setArtistData(artist);

    if (artist?.name) {
      console.log("GENERO DEL ARTISTA:", artist.genres[0]);
      const { instagram } = await getArtistInstagram(artist.name, artist.genres[0]);
      setInstagramHandle(instagram);

      ///////////////////////////////////
      const posts = await getInstagramTopPosts(artist.name);
      console.log("Posts de Instagram obtenidos:", posts);

      const milestones = await getArtistMilestones(artist.name);
      setArtistMilestones(milestones);
    }

    if (artist && artist.genres && artist.genres.length > 0) {
      setSelectedGenre(artist.genres[0]);
    } else {
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
          />
        </Box>
      )}
    </Container>
  );
}

export default App;