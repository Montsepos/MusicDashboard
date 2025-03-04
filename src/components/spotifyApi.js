import React from "react";

function ArtistInfo({ artist }) {
  if (!artist) return null;

  return (
    <div>
      <h3>{artist.name}</h3>
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
            <td>{artist.genres.join(", ")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ArtistInfo;