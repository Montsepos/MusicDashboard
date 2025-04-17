import React, { useEffect, useState } from "react";
import { searchArtistsByGenre, getArtistStats } from "../services/spotifyServices";
import ArtistInfo from "../components/spotifyApi";
import { getArtistInstagram } from "./chatCPTServices";

const GenreArtist = ({ genre, accessToken }) => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [instagramHandle, setInstagramHandle] = useState("");

  // Al cambiar el género o el token, se buscan artistas de ese género
  useEffect(() => {
    async function fetchArtists() {
      const results = await searchArtistsByGenre(genre, accessToken);
      setArtists(results);
      setSelectedArtist(null);
      setInstagramHandle(""); // Limpiar Instagram al cambiar género
    }

    if (genre && accessToken) {
      fetchArtists();
    }
  }, [genre, accessToken]);

  // Al hacer clic en un artista, se obtienen sus estadísticas e Instagram
  const handleArtistClick = async (artistId) => {
    try {
      const stats = await getArtistStats(artistId, accessToken);
      setSelectedArtist(stats);

      const { instagram } = await getArtistInstagram(stats.name);
      setInstagramHandle(instagram);
    } catch (error) {
      console.error("Error al obtener datos del artista o Instagram:", error);
      setInstagramHandle("No disponible");
    }
  };

  return (
    <div>
      <h3>Artistas de género "{genre}"</h3>
      <ul>
        {artists.map((artist) => (
          <li
            key={artist.id}
            style={{ cursor: "pointer", color: "blue", marginBottom: "5px" }}
            onClick={() => handleArtistClick(artist.id)}
          >
            {artist.name}
          </li>
        ))}
      </ul>

      {selectedArtist && (
        <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
          <h4>{selectedArtist.name}</h4>
          <ArtistInfo artist={selectedArtist} instagramHandle={instagramHandle} />
        </div>
      )}
    </div>
  );
};

export default GenreArtist;