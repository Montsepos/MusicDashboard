// // services/GenreArtist.js
// import React, { useEffect, useState } from "react";
// import { searchArtistsByGenre } from "../services/spotifyServices";

// function GenreArtist({ genre, accessToken }) {
//   const [artists, setArtists] = useState([]);

//   useEffect(() => {
//     async function fetchArtists() {
//       const results = await searchArtistsByGenre(genre, accessToken);
//       setArtists(results);
//     }
//     if (genre && accessToken) {
//       fetchArtists();
//     }
//   }, [genre, accessToken]);

//   return (
//     <div>
//       <h3>Artistas de género "{genre}"</h3>
//       <ul>
//         {artists.map((artist) => (
//           <li key={artist.id}>{artist.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default GenreArtist;

import React, { useEffect, useState } from "react";
import { searchArtistsByGenre, getArtistStats } from "../services/spotifyServices";

const GenreArtist = ({ genre, accessToken }) => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Al cambiar el género o el token, se busca artistas de ese género
  useEffect(() => {
    async function fetchArtists() {
      const results = await searchArtistsByGenre(genre, accessToken);
      setArtists(results);
      setSelectedArtist(null); // Reinicia el artista seleccionado al cambiar de género
    }
    if (genre && accessToken) {
      fetchArtists();
    }
  }, [genre, accessToken]);

  // Al hacer clic en un artista, se obtienen sus estadísticas detalladas
  const handleArtistClick = async (artistId) => {
    const stats = await getArtistStats(artistId, accessToken);
    setSelectedArtist(stats);
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
          <img
            src={selectedArtist.images.length > 0 ? selectedArtist.images[0].url : ""}
            alt={selectedArtist.name}
            width="200"
          />
          <p>Followers: {selectedArtist.followers.total.toLocaleString()}</p>
          <p>Popularity: {selectedArtist.popularity}</p>
          <p>Genres: {selectedArtist.genres.join(" ")}</p>
        </div>
      )}
    </div>
  );
};

export default GenreArtist;