import React from "react";

function ArtistInfo({ artist, instagramHandle, setSelectedGenre }) {
  console.log("INSTAGRAM HANDLE EN COMPONENTE:", instagramHandle);
  if (!artist) return null;

  return (
    <div>
      <h3>{artist.name}</h3>
      {instagramHandle && (
        <p><strong>Instagram:</strong> @{instagramHandle}</p>
      )}
      <img
        src={artist.images.length > 0 ? artist.images[0].url : ""}
        alt={artist.name}
        width="200"
      />
      <table>
        <thead>
          <tr>
            <th>Artist</th>
            <th>Followers</th>
            <th>Popularity</th>
            <th>Genres</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{artist.name}</td>
            <td>{artist.followers.total.toLocaleString()}</td>
            <td>{artist.popularity}</td>
            <td>
              {artist.genres.map((genre) => (
                <span
                  key={genre}
                  style={{ marginRight: 10, cursor: "pointer", color: "blue" }}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </span>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ArtistInfo;
