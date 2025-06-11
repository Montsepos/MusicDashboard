
import React, { useEffect, useState } from "react";
import { searchArtistsByGenre, getArtistStats } from "../services/spotifyServices";
import { getArtistInstagram, getArtistMilestones } from "../services/chatGPTServices";
import { Box, Typography, Link, Grid } from "@mui/material";

const GenreArtist = ({ genre, accessToken }) => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [relatedArtistInfo, setRelatedArtistInfo] = useState(null);
  const [relatedInstagramHandle, setRelatedInstagramHandle] = useState("");
  const [relatedMilestones, setRelatedMilestones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const results = await searchArtistsByGenre(genre, accessToken);
        setArtists(results);
        setSelectedArtist(null);
        setRelatedArtistInfo(null);
      } catch (error) {
        console.error("Error al buscar artistas por género:", error);
      }
    }

    if (genre && accessToken) {
      fetchArtists();
    }
  }, [genre, accessToken]);

  // Al hacer clic en un artista, se obtienen sus estadísticas e Instagram
  const handleArtistClick = async (artist) => {
    try {
      setLoading(true);
      
      // Obtener datos completos del artista seleccionado
      const stats = await getArtistStats(artist.id, accessToken);
      setRelatedArtistInfo(stats);

      // Obtener Instagram y hitos
      const { instagram } = await getArtistInstagram(stats.name, stats.genres[0] || "");
      setRelatedInstagramHandle(instagram);

      const milestones = await getArtistMilestones(stats.name);
      setRelatedMilestones(milestones);
    } catch (error) {
      console.error("Error al obtener datos del artista o Instagram:", error);
      setRelatedInstagramHandle("No disponible");
    } finally {
      setLoading(false);
    }
  };

  // Componente para mostrar información del artista relacionado
  const RelatedArtistInfo = ({ artist, instagramHandle, artistMilestones }) => {
    if (!artist) return null;

    return (
      <Box sx={{ width: '100%' }}>
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
          {artist.genres.map((g, index) => (
            <React.Fragment key={g}>
              <Link
                component="span"
                sx={{ 
                  color: '#2196f3',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {g}
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
        
        {/* Datos de Instagram */}
        {instagramHandle && (
          <Box>
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
            <Typography component="p" sx={{ mt: 1 }}>
              Sus mejores videos...
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Artistas del género "{genre}"
      </Typography>
      
      <Grid container spacing={3}>
        {artists.map((artist) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={artist.id}>
            <Box 
              sx={{
                cursor: 'pointer',
                p: 1,
                borderRadius: '4px',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.04)'
                }
              }}
              onClick={() => handleArtistClick(artist)}
            >
              <Box
                component="img"
                src={artist.images.length > 0 ? artist.images[0].url : ""}
                alt={artist.name}
                sx={{ 
                  width: '100%',
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  mb: 1
                }}
              />
              <Typography variant="body2" fontWeight="medium" align="center">
                {artist.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      
      {/* Mostrar el artista seleccionado junto al artista principal */}
      {relatedArtistInfo && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
            {/* Imagen del artista relacionado */}
            <Box sx={{ width: { xs: '100%', sm: '250px' }, flexShrink: 0 }}>
              <Box 
                component="img"
                src={relatedArtistInfo.images.length > 0 ? relatedArtistInfo.images[0].url : ""}
                alt={relatedArtistInfo.name}
                sx={{ 
                  width: '100%', 
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
            
            {/* Información del artista relacionado */}
            <Box sx={{ flex: 1 }}>
              <RelatedArtistInfo 
                artist={relatedArtistInfo} 
                instagramHandle={relatedInstagramHandle}
                artistMilestones={relatedMilestones} 
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default GenreArtist;