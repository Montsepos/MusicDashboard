// import { useState, useEffect } from "react";
// import "./App.css";
// import { getArtist } from "./services/spotifyServices";
// import { getYouTubeData, exchangeCodeForToken } from "./services/youtubeServices";
// import ArtistInfo from "./components/spotifyApi";
// import YouTubeInfo from "./components/youtubeInfo";
// import React from "react";
// import AnalyzeSpotifyData from "./services/analyzeSpotify";
// import { Card, CardContent } from "./components/ui/card";

// const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
// const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
// const SCOPE = process.env.REACT_APP_SCOPE;

// function App() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [artistData, setArtistData] = useState(null);
//   const [youtubeData, setYouTubeData] = useState(null);
//   const [accessToken, setAccessToken] = useState(localStorage.getItem("youtube_access_token"));

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get("code");
//     console.log("Código de autorización recibido:", code); // ✅ Verifica si el código llega correctamente


//     if (code) {
//       exchangeCodeForToken(code).then((token) => {
//         setAccessToken(token);
//         localStorage.setItem("youtube_access_token", token);
//         window.history.replaceState({}, document.title, "/");
//       }).catch(error => {
//         console.error("Error intercambiando código por token:", error);
//     });
// }
// }, []);

//   useEffect(() => {
//     if (accessToken) {
//       getYouTubeData(accessToken).then((youtubeInfo) => {
//         setYouTubeData(youtubeInfo);
//       }).catch(error => {
//         console.error("Error obteniendo datos de YouTube:", error);
//       });
//     }
//   }, [accessToken]);

//   async function handleSearch(e) {
//     e.preventDefault();
//     if (!searchTerm) return;

//     const artist = await getArtist(searchTerm);
//     setArtistData(artist);
//   }

//   function loginWithYouTube() {
//     const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(SCOPE)}&response_type=code&access_type=offline`;
//     window.location.href = authUrl;
//   }

//   return (
//     <div className="App">
//       <h2>Music Dash</h2>
//       <button onClick={loginWithYouTube}>Iniciar sesión con YouTube</button>
//       <form onSubmit={handleSearch}>
//         <input
//           type="text"
//           placeholder="Search for an artist"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button type="submit">Search</button>
//       </form>
//       <ArtistInfo artist={artistData} />
//       <YouTubeInfo youtubeData={youtubeData} />
      
//       <h1 className="text-2xl font-bold mb-4">Music Dashboard</h1>
//       <Card>
//         <CardContent>
//           <AnalyzeSpotifyData />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default App;