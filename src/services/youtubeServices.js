const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

async function getYouTubeData(artist) {
  try {
    if (!API_KEY) {
      throw new Error("La clave de API de YouTube no está definida.");
    }

    // 1️⃣ Buscar el canal del artista
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(artist)}&type=channel&key=${API_KEY}`
    );
    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      console.warn("No se encontraron canales para este artista.");
      return null;
    }

    const channelId = searchData.items[0].id.channelId;

    // 2️⃣ Obtener información del canal
    const channelResponse = await fetch(
      `${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
    );
    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      console.warn("No se encontró información del canal.");
      return null;
    }

    const channelInfo = channelData.items[0];

    return {
      channelName: channelInfo.snippet.title,
      channelId: channelInfo.id,
      channelUrl: `https://www.youtube.com/channel/${channelInfo.id}`,
      thumbnail: channelInfo.snippet.thumbnails.high.url,
      subscribers: channelInfo.statistics.subscriberCount,
      totalViews: channelInfo.statistics.viewCount,
      totalVideos: channelInfo.statistics.videoCount,
    };
  } catch (error) {
    console.error("Error al obtener datos de YouTube:", error);
    return null;
  }
}

export { getYouTubeData };
