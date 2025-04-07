const CLIENT_ID = "3fff9f9d533e4d80b04bfe054072e3c7";
const CLIENT_SECRET = "b32bec8593994ebab39ef8bcd913ac8e";

// Función para obtener el token de Spotify
export async function getSpotifyToken() {
  const url = "https://accounts.spotify.com/api/token";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  });

  const data = await response.json();
  if (data.access_token) {
    console.log("Token de Spotify EN SPOTIFY SERVICES:", data.access_token);
    return data.access_token;
  } else {
    console.error("Error obteniendo token de Spotify:", data);
    return null;
  }
}

// Función para buscar un artista por nombre, usando el token
export async function getArtist(artist, token) {
  if (!token) {
    console.error("Token no disponible para buscar artista");
    return null;
  }
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    artist
  )}&type=artist`;
  const response = await fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!data.artists || !data.artists.items) {
    console.error("Error: data.artists o data.artists.items undefined", data);
    return null;
  }
  return data.artists.items.length > 0 ? data.artists.items[0] : null;
}

// Función para buscar artistas por género
export async function searchArtistsByGenre(genre, token) {
  if (!token) {
    console.error("Token no disponible para buscar artistas por género");
    return [];
  }
  // Se construye la query con comillas y se codifica
  const query = `genre:"${genre}"`;
  const encodedQuery = encodeURIComponent(query);
  const url = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=artist&limit=10`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!data.artists || !data.artists.items) {
    console.error("Error searching artists by genre:", data);
    return [];
  }
  return data.artists.items;
}

// Función para obtener estadísticas de un artista por su ID
export async function getArtistStats(artistId, token) {
  if (!token) {
    console.error("Token no disponible para obtener estadísticas");
    return null;
  }
  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}
