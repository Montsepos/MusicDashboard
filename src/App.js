import { useState } from "react";
import "./App.css";
import { getArtist } from "./services/spotifyServices";
import { getYouTubeData } from "./services/youtubeServices";
import ArtistInfo from "./components/spotifyApi";
import YouTubeInfo from "./components/youtubeInfo";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [artistData, setArtistData] = useState(null);
  const [youtubeData, setYouTubeData] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchTerm) return;

    const artist = await getArtist(searchTerm);
    setArtistData(artist);

    if (artist) {
      const youtubeInfo = await getYouTubeData(artist.name);
      setYouTubeData(youtubeInfo);
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

      <ArtistInfo artist={artistData} />
      <YouTubeInfo youtubeData={youtubeData} />
    </div>
  );
}

export default App;