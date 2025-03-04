import { useState } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [artistData, setArtistData] = useState(null);
  const [accessToken, setAccessToken] = useState("");

  async function getToken() {
    const clientId = "3fff9f9d533e4d80b04bfe054072e3c7";
    const clientSecret = "b32bec8593994ebab39ef8bcd913ac8e";
    const url = "https://accounts.spotify.com/api/token";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    });

    const data = await response.json();
    setAccessToken(data.access_token);
  }

  async function getArtist(artist) {
    if (!accessToken) {
      await getToken();
    }

    const searchUrl = `https://api.spotify.com/v1/search?q=${artist}&type=artist`;
    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (data.artists.items.length > 0) {
      const artistInfo = data.artists.items[0];
      setArtistData(artistInfo);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchTerm) {
      getArtist(searchTerm);
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

      {artistData && (
        <div>
          <h3>{artistData.name}</h3>
          <img
            src={artistData.images.length > 0 ? artistData.images[0].url : ""}
            alt={artistData.name}
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
                <td>{artistData.name}</td>
                <td>{artistData.followers.total.toLocaleString()}</td>
                <td>{artistData.popularity}</td>
                <td>{artistData.genres.join(", ")}</td>                
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;