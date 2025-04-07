// services/GenreArtist.js
import React, { useEffect, useState } from "react";
import { searchArtistsByGenre } from "../services/spotifyServices";

function GenreArtist({ genre, accessToken }) {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    async function fetchArtists() {
      const results = await searchArtistsByGenre(genre, accessToken);
      setArtists(results);
    }
    if (genre && accessToken) {
      fetchArtists();
    }
  }, [genre, accessToken]);

  return (
    <div>
      <h3>Artistas de género "{genre}"</h3>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default GenreArtist;

