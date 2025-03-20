export async function exchangeCodeForToken(code) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    }),
  });
  const data = await response.json();
  console.log("Respuesta del servidor:", data);

  if (!response.ok) {
    console.error("Error en la solicitud de token:", data);
    throw new Error("Error al obtener el token de acceso");
  }

  return data.access_token;
}

export async function getYouTubeChannelId(accessToken) { //errores al obtener id, revisar documentacion
  try {
    const response = await fetch("https://www.googleapis.com/youtube/v3/channels?part=id&mine=true", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id;
    } else {
      throw new Error("No se encontró el canal del usuario");
    }
  } catch (error) {
    console.error("Error al obtener el ID del canal:", error);
    return null;
  }
}

export async function getYouTubeData(accessToken) {
  console.log("Obteniendo datos de YouTube...");
  try {
    const channelId = await getYouTubeChannelId(accessToken);
    if (!channelId) {
      throw new Error("No se pudo obtener el ID del canal");
    }

    console.log("ID del canal obtenido:", channelId); // ✅ Agregado para depuración

    const response = await fetch(
      `https://youtubeanalytics.googleapis.com/v3/reports?ids=channel==${channelId}&metrics=views,subscribersGained&dimensions=day&startDate=2024-01-01&endDate=2024-03-18`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("Datos de YouTube RECIBIDOS:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener datos de YouTube:", error);
    return null;
  }
}