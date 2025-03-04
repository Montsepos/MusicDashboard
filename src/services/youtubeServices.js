const YOUTUBE_API_KEY = "412949067291-94od2mkt5ag7ohm3upalgaf79cc8ug7p.apps.googleusercontent.com"; // ID 
// y el secret? donde lo pongo
// const YOUTUBE_API_SECRET = "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"
//NOESTA FUNCIONANDO AUN


async function getYouTubeData(artist) {
  try {
    // 1️⃣ Buscar el canal del artista en YouTube
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${artist}&type=channel&key=${YOUTUBE_API_KEY}`
    );
    const searchData = await searchResponse.json();

    if (searchData.items.length === 0) return null;

    const channelId = searchData.items[0].id.channelId;

    // 2️⃣ Obtener información del canal
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    const channelData = await channelResponse.json();

    if (channelData.items.length > 0) {
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
    }
  } catch (error) {
    console.error("Error al obtener datos de YouTube", error);
    return null;
  }
}

export { getYouTubeData };