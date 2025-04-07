import React, { useState, useEffect } from "react";
import "./App.css";
import { getArtist, getSpotifyToken } from "./services/spotifyServices";
import ArtistInfo from "./components/spotifyApi";
import AnalyzeSpotifyData from "./services/analyzeSpotify";
import { Card, CardContent } from "./components/ui/card";
import GenreArtist from "./services/genreArtist";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [artistData, setArtistData] = useState(null);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [spotifyAccessToken, setSpotifyAccessToken] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);

  // Obtener token de Spotify al cargar la app
  useEffect(() => {
    getSpotifyToken().then((token) => {
      setSpotifyAccessToken(token);
      console.log("Token de Spotify obtenido:", token);
    });
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchTerm || !spotifyAccessToken) return;

    // Buscar artista en Spotify
    const artist = await getArtist(searchTerm, spotifyAccessToken);
    setArtistData(artist);
    console.log("Artista encontrado:", artist);

    // Obtener artistas relacionados basado en el género del artista
    // Supongamos que tomamos el primer género del artista para buscar relacionados
    if (artist && artist.genres && artist.genres.length > 0) {
      setSelectedGenre(artist.genres[0]);
    }
  }

  return (
    <div className="App">
      <h2>Music Dash</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for an artist"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <ArtistInfo artist={artistData} setSelectedGenre={setSelectedGenre} />

      {selectedGenre && (
        <GenreArtist genre={selectedGenre} accessToken={spotifyAccessToken} />
      )}

      <h1 className="text-2xl font-bold mb-4">Music Dashboard</h1>
      <Card>
        <CardContent>
          <AnalyzeSpotifyData />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
