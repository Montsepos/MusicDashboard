const CLIENT_ID = "3fff9f9d533e4d80b04bfe054072e3c7";
const CLIENT_SECRET = "b32bec8593994ebab39ef8bcd913ac8e";
let accessToken = "";

async function getSpotifyToken() {
  const url = "https://accounts.spotify.com/api/token";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  });

  const data = await response.json();
  accessToken = data.access_token;
}

async function getArtist(artist) {
  if (!accessToken) {
    await getSpotifyToken();
  }

  const searchUrl = `https://api.spotify.com/v1/search?q=${artist}&type=artist`;
  const response = await fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  return data.artists.items.length > 0 ? data.artists.items[0] : null;
}

export { getArtist };