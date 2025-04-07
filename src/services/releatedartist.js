//NO FUNCIONA EN LA API

// import axios from "axios";

// const getRelatedArtists = async (artistId, accessToken) => {
//   try {
//     const response = await axios.get(
//       `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
//       {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }
//     );
//     return response.data.artists;
//   } catch (error) {
//     console.error("Error fetching related artists:", error);
//     return [];
//   }
// };

// export default getRelatedArtists;