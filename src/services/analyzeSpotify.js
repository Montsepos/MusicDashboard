
// import React, { useState } from "react";
// import Papa from "papaparse";
// import { Card, CardContent, Box, Typography } from "@mui/material";
// import { LineChart, Line as RechartsLine, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// // Función para formatear la fecha y eliminar la hora si existe
// const formatDate = (dateString) => {
//   if (!dateString || typeof dateString !== "string") return null;
//   return dateString.split(" ")[0]; // Extrae solo la parte de la fecha
// };

// const AnalyzeSpotifyData = () => {
//   const [spotifyData, setSpotifyData] = useState([]);
//   const [instagramData, setInstagramData] = useState([]);
//   const [fileError, setFileError] = useState(null);
//   const [activeButton, setActiveButton] = useState("spotify");
//   const [spotifyFileName, setSpotifyFileName] = useState("");
//   const [instagramFileName, setInstagramFileName] = useState("");
  
//   // Datos originales de demostración (similares a los de la primera versión)
//   const demoData = [
//     { date: "2024-01-01", streams: 1200, listeners: 800, followers: 5000, followersChange: 0, interactions: 320 },
//     { date: "2024-01-08", streams: 1500, listeners: 950, followers: 5100, followersChange: 100, interactions: 380 },
//     { date: "2024-01-15", streams: 1800, listeners: 1100, followers: 5250, followersChange: 150, interactions: 450 },
//     { date: "2024-01-22", streams: 2200, listeners: 1400, followers: 5400, followersChange: 150, interactions: 520 },
//     { date: "2024-01-29", streams: 2500, listeners: 1600, followers: 5600, followersChange: 200, interactions: 580 },
//     { date: "2024-02-05", streams: 2800, listeners: 1800, followers: 5850, followersChange: 250, interactions: 650 },
//     { date: "2024-02-12", streams: 3200, listeners: 2000, followers: 6100, followersChange: 250, interactions: 710 },
//     { date: "2024-02-19", streams: 3600, listeners: 2200, followers: 6400, followersChange: 300, interactions: 780 },
//     { date: "2024-02-26", streams: 4000, listeners: 2500, followers: 6700, followersChange: 300, interactions: 850 },
//     { date: "2024-03-04", streams: 4500, listeners: 2800, followers: 7100, followersChange: 400, interactions: 920 },
//   ];

//   // Cargar archivo de Spotify
//   const handleSpotifyUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
    
//     setSpotifyFileName(file.name);
    
//     Papa.parse(file, {
//       header: true,
//       dynamicTyping: true,
//       complete: (result) => {
//         console.log("Spotify data loaded:", result);
        
//         if (!result.data || result.data.length === 0) {
//           setFileError("El archivo CSV de Spotify está vacío o con formato incorrecto");
//           return;
//         }
        
//         let formattedData = result.data
//           .filter(row => row && typeof row === 'object') // Asegurar que sea un objeto válido
//           .map((row) => ({
//             date: formatDate(row["date"]),
//             streams: row["streams"] || 0,
//             listeners: row["listeners"] || 0,
//             followers: row["followers"] || 0,
//           }))
//           .filter(entry => entry.date && new Date(entry.date) >= new Date("2024-01-01"));
          
//         if (formattedData.length === 0) {
//           setFileError("No se encontraron datos válidos en el archivo CSV de Spotify");
//           return;
//         }

//         // Calcular el cambio en followers
//         formattedData = formattedData.map((entry, index, arr) => ({
//           ...entry,
//           followersChange: index === 0 ? 0 : entry.followers - arr[index - 1].followers,
//         }));

//         console.log("Formatted Spotify data:", formattedData);
//         setSpotifyData(formattedData);
//         setActiveButton("spotify");
//         setFileError(null);
//       },
//       error: (error) => {
//         console.error("Error parsing Spotify CSV:", error);
//         setFileError(`Error al leer el archivo CSV de Spotify: ${error.message}`);
//       },
//     });
//   };

//   // Cargar archivo de Instagram
//   const handleInstagramUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
    
//     setInstagramFileName(file.name);
    
//     Papa.parse(file, {
//       header: true,
//       dynamicTyping: true,
//       complete: (result) => {
//         console.log("Instagram data loaded:", result);
        
//         if (!result.data || result.data.length === 0) {
//           setFileError("El archivo CSV de Instagram está vacío o con formato incorrecto");
//           return;
//         }
        
//         const formattedData = result.data
//           .filter(row => row && typeof row === 'object') // Asegurar que sea un objeto válido
//           .map((row) => ({
//             date: formatDate(row["Date"]),
//             interactions: row["Primary"] || 0,
//           }))
//           .filter(entry => entry.date && new Date(entry.date) >= new Date("2024-01-01"));
          
//         if (formattedData.length === 0) {
//           setFileError("No se encontraron datos válidos en el archivo CSV de Instagram");
//           return;
//         }

//         console.log("Formatted Instagram data:", formattedData);
//         setInstagramData(formattedData);
//         setActiveButton("instagram");
//         setFileError(null);
//       },
//       error: (error) => {
//         console.error("Error parsing Instagram CSV:", error);
//         setFileError(`Error al leer el archivo CSV de Instagram: ${error.message}`);
//       },
//     });
//   };

//   // Combinar los datos para el gráfico (similar a la primera versión)
//   let mergedData = [...demoData]; // Usar datos de demostración por defecto
  
//   if (spotifyData.length > 0) {
//     // Si hay datos de Spotify, usarlos en lugar de los de demostración
//     mergedData = spotifyData.map(item => ({
//       date: item.date,
//       streams: item.streams,
//       listeners: item.listeners,
//       followersChange: item.followersChange,
//       // Mantener interactions como 0 o similar por ahora
//       interactions: 0
//     }));
//   }
  
//   // Agregar datos de Instagram si están disponibles
//   if (instagramData.length > 0) {
//     instagramData.forEach(instaEntry => {
//       const matchIndex = mergedData.findIndex(entry => entry.date === instaEntry.date);
//       if (matchIndex >= 0) {
//         mergedData[matchIndex] = {
//           ...mergedData[matchIndex],
//           interactions: instaEntry.interactions
//         };
//       } else {
//         mergedData.push({
//           date: instaEntry.date,
//           streams: 0,
//           listeners: 0,
//           followersChange: 0,
//           interactions: instaEntry.interactions
//         });
//       }
//     });
//   }
  
//   // Ordenar los datos por fecha
//   mergedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
//   console.log("Final merged data for chart:", mergedData);

//   return (
//     <>
//       {/* Botones para cargar CSV con indicadores de archivo cargado */}
//       <Box sx={{ mb: 3 }}>
//         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
//           <Box>
//             <input
//               id="spotify-upload"
//               type="file"
//               accept=".csv"
//               onChange={handleSpotifyUpload}
//               style={{ display: 'none' }}
//             />
//             <label htmlFor="spotify-upload" style={{ cursor: 'pointer' }}>
//               <Box 
//                 sx={{ 
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center'
//                 }}
//               >
//                 <button
//                   style={{
//                     fontSize: '14px',
//                     padding: '8px 16px',
//                     borderRadius: '4px',
//                     cursor: 'pointer',
//                     backgroundColor: activeButton === "spotify" ? '#000000' : '#FFFFFF',
//                     color: activeButton === "spotify" ? '#FFFFFF' : '#000000',
//                     border: activeButton === "spotify" ? 'none' : '1px solid #E0E0E0'
//                   }}
//                   onClick={() => {
//                     setActiveButton("spotify");
//                     document.getElementById('spotify-upload').click();
//                   }}
//                 >
//                   SCV SPOTIFY
//                 </button>
//                 {spotifyFileName && (
//                   <Typography variant="caption" sx={{ mt: 1, color: 'success.main' }}>
//                     {spotifyFileName} (cargado)
//                   </Typography>
//                 )}
//               </Box>
//             </label>
//           </Box>
          
//           <Box>
//             <input
//               id="instagram-upload"
//               type="file"
//               accept=".csv"
//               onChange={handleInstagramUpload}
//               style={{ display: 'none' }}
//             />
//             <label htmlFor="instagram-upload" style={{ cursor: 'pointer' }}>
//               <Box 
//                 sx={{ 
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center'
//                 }}
//               >
//                 <button
//                   style={{
//                     fontSize: '14px',
//                     padding: '8px 16px',
//                     borderRadius: '4px',
//                     cursor: 'pointer',
//                     backgroundColor: activeButton === "instagram" ? '#000000' : '#FFFFFF',
//                     color: activeButton === "instagram" ? '#FFFFFF' : '#000000',
//                     border: activeButton === "instagram" ? 'none' : '1px solid #E0E0E0'
//                   }}
//                   onClick={() => {
//                     setActiveButton("instagram");
//                     document.getElementById('instagram-upload').click();
//                   }}
//                 >
//                   SCV INSTAGRAM
//                 </button>
//                 {instagramFileName && (
//                   <Typography variant="caption" sx={{ mt: 1, color: 'success.main' }}>
//                     {instagramFileName} (cargado)
//                   </Typography>
//                 )}
//               </Box>
//             </label>
//           </Box>
//         </Box>
        
//         {fileError && (
//           <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
//             {fileError}
//           </Typography>
//         )}
//       </Box>

//       {/* Gráfico - recreando el diseño original */}
//       <Card>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart data={mergedData}>
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <RechartsLine type="monotone" dataKey="streams" stroke="#8884d8" name="Streams" strokeWidth={2} />
//               <RechartsLine type="monotone" dataKey="listeners" stroke="#82ca9d" name="Listeners" strokeWidth={2} />
//               <RechartsLine type="monotone" dataKey="followersChange" stroke="#ffc658" name="Followers Change" strokeWidth={2} />
//               <RechartsLine type="monotone" dataKey="interactions" stroke="#ff0000" name="Instagram Interactions" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>
//     </>
//   );
// };

// export default AnalyzeSpotifyData;


import React, { useState, useMemo } from "react";
import Papa from "papaparse";
import { Card, CardContent, Box, Typography, Chip } from "@mui/material";
import { LineChart, Line as RechartsLine, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';

// Función para formatear la fecha y eliminar la hora si existe
const formatDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") return null;
  return dateString.split(" ")[0]; // Extrae solo la parte de la fecha
};

const AnalyzeSpotifyData = () => {
  const [spotifyData, setSpotifyData] = useState([]);
  const [instagramData, setInstagramData] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [activeButton, setActiveButton] = useState("spotify");
  const [spotifyFileName, setSpotifyFileName] = useState("");
  const [instagramFileName, setInstagramFileName] = useState("");
  
  // Datos originales de demostración (similares a los de la primera versión)
  const demoData = [
    { date: "2024-01-01", streams: 1200, listeners: 800, followers: 5000, followersChange: 0, interactions: 320 },
    { date: "2024-01-08", streams: 1500, listeners: 950, followers: 5100, followersChange: 100, interactions: 380 },
    { date: "2024-01-15", streams: 1800, listeners: 1100, followers: 5250, followersChange: 150, interactions: 450 },
    { date: "2024-01-22", streams: 2200, listeners: 1400, followers: 5400, followersChange: 150, interactions: 520 },
    { date: "2024-01-29", streams: 2500, listeners: 1600, followers: 5600, followersChange: 200, interactions: 580 },
    { date: "2024-02-05", streams: 2800, listeners: 1800, followers: 5850, followersChange: 250, interactions: 650 },
    { date: "2024-02-12", streams: 3200, listeners: 2000, followers: 6100, followersChange: 250, interactions: 710 },
    { date: "2024-02-19", streams: 3600, listeners: 2200, followers: 6400, followersChange: 300, interactions: 780 },
    { date: "2024-02-26", streams: 4000, listeners: 2500, followers: 6700, followersChange: 300, interactions: 850 },
    { date: "2024-03-04", streams: 4500, listeners: 2800, followers: 7100, followersChange: 400, interactions: 920 },
  ];

  // Función para calcular el Impact Score usando la nueva fórmula con ratios de crecimiento
  const calculateImpactScore = (current, previous, interactions, maxInteractions) => {
    // Validar que tengamos datos previos y valores válidos
    if (!previous || maxInteractions === 0 || interactions === 0 || 
        previous.streams === 0 || previous.listeners === 0 || previous.followers === 0) {
      return 0;
    }

    // Calcular deltas (incrementos absolutos)
    const deltaStreams = current.streams - previous.streams;
    const deltaListeners = current.listeners - previous.listeners;
    const deltaFollowers = current.followers - previous.followers;

    // Calcular ratios de crecimiento porcentual
    const streamsGrowthRatio = deltaStreams / previous.streams;
    const listenersGrowthRatio = deltaListeners / previous.listeners;
    const followersGrowthRatio = deltaFollowers / previous.followers;

    // Factor de normalización de Instagram
    const instagramFactor = interactions / maxInteractions;

    // Aplicar la fórmula específica:
    // Impact Score = ( (ΔStreams/Streams_prev × 0.4) + (ΔListeners/Listeners_prev × 0.3) + (ΔFollowers/Followers_prev × 0.3) ) × (Instagram_Interactions / Max_Interactions)
    const impactScore = (
      (streamsGrowthRatio * 0.3) + 
      (listenersGrowthRatio * 0.3) + 
      (followersGrowthRatio * 0.4)
    ) * instagramFactor;

    return impactScore;
  };

  // Cargar archivo de Spotify
  const handleSpotifyUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setSpotifyFileName(file.name);
    
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        console.log("Spotify data loaded:", result);
        
        if (!result.data || result.data.length === 0) {
          setFileError("El archivo CSV de Spotify está vacío o con formato incorrecto");
          return;
        }
        
        let formattedData = result.data
          .filter(row => row && typeof row === 'object') // Asegurar que sea un objeto válido
          .map((row) => ({
            date: formatDate(row["date"]),
            streams: row["streams"] || 0,
            listeners: row["listeners"] || 0,
            followers: row["followers"] || 0,
          }))
          .filter(entry => entry.date && new Date(entry.date) >= new Date("2024-01-01"));
          
        if (formattedData.length === 0) {
          setFileError("No se encontraron datos válidos en el archivo CSV de Spotify");
          return;
        }

        // Calcular el cambio en followers
        formattedData = formattedData.map((entry, index, arr) => ({
          ...entry,
          followersChange: index === 0 ? 0 : entry.followers - arr[index - 1].followers,
        }));

        console.log("Formatted Spotify data:", formattedData);
        setSpotifyData(formattedData);
        setActiveButton("spotify");
        setFileError(null);
      },
      error: (error) => {
        console.error("Error parsing Spotify CSV:", error);
        setFileError(`Error al leer el archivo CSV de Spotify: ${error.message}`);
      },
    });
  };

  // Cargar archivo de Instagram
  const handleInstagramUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setInstagramFileName(file.name);
    
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        console.log("Instagram data loaded:", result);
        
        if (!result.data || result.data.length === 0) {
          setFileError("El archivo CSV de Instagram está vacío o con formato incorrecto");
          return;
        }
        
        const formattedData = result.data
          .filter(row => row && typeof row === 'object') // Asegurar que sea un objeto válido
          .map((row) => ({
            date: formatDate(row["Date"]),
            interactions: row["Primary"] || 0,
          }))
          .filter(entry => entry.date && new Date(entry.date) >= new Date("2024-01-01"));
          
        if (formattedData.length === 0) {
          setFileError("No se encontraron datos válidos en el archivo CSV de Instagram");
          return;
        }

        console.log("Formatted Instagram data:", formattedData);
        setInstagramData(formattedData);
        setActiveButton("instagram");
        setFileError(null);
      },
      error: (error) => {
        console.error("Error parsing Instagram CSV:", error);
        setFileError(`Error al leer el archivo CSV de Instagram: ${error.message}`);
      },
    });
  };

  // Calcular datos combinados y picos
  const { mergedData, topPeaks } = useMemo(() => {
    // Combinar los datos para el gráfico
    let mergedData = [...demoData]; // Usar datos de demostración por defecto
    
    if (spotifyData.length > 0) {
      // Si hay datos de Spotify, usarlos en lugar de los de demostración
      mergedData = spotifyData.map(item => ({
        date: item.date,
        streams: item.streams,
        listeners: item.listeners,
        followers: item.followers,
        followersChange: item.followersChange,
        // Mantener interactions como 0 por ahora
        interactions: 0
      }));
    }
    
    // Agregar datos de Instagram si están disponibles
    if (instagramData.length > 0) {
      instagramData.forEach(instaEntry => {
        const matchIndex = mergedData.findIndex(entry => entry.date === instaEntry.date);
        if (matchIndex >= 0) {
          mergedData[matchIndex] = {
            ...mergedData[matchIndex],
            interactions: instaEntry.interactions
          };
        } else {
          mergedData.push({
            date: instaEntry.date,
            streams: 0,
            listeners: 0,
            followers: 0,
            followersChange: 0,
            interactions: instaEntry.interactions
          });
        }
      });
    }
    
    // Ordenar los datos por fecha
    mergedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calcular el máximo de interacciones para normalización
    const maxInteractions = Math.max(...mergedData.map(d => d.interactions));
    
    // Calcular Impact Scores usando la fórmula de ratios de crecimiento
    const dataWithScores = mergedData.map((current, index) => {
      const previous = index > 0 ? mergedData[index - 1] : null;
      const impactScore = calculateImpactScore(current, previous, current.interactions, maxInteractions);
      
      return {
        ...current,
        impactScore: impactScore
      };
    });

    // Encontrar los 6 picos más altos (excluyendo el primer elemento que no tiene score válido)
    const validPeaks = dataWithScores
      .filter((item, index) => index > 0 && item.impactScore > 0) // Excluir primer elemento y scores negativos/cero
      .sort((a, b) => b.impactScore - a.impactScore) // Ordenar por score descendente
      .slice(0, 6); // Tomar los 6 mejores

    console.log("Top 6 peaks:", validPeaks);

    return { mergedData: dataWithScores, topPeaks: validPeaks };
  }, [spotifyData, instagramData]);

  return (
    <>
      {/* Botones para cargar CSV con indicadores de archivo cargado */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box>
            <input
              id="spotify-upload"
              type="file"
              accept=".csv"
              onChange={handleSpotifyUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="spotify-upload" style={{ cursor: 'pointer' }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <button
                  style={{
                    fontSize: '14px',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: activeButton === "spotify" ? '#000000' : '#FFFFFF',
                    color: activeButton === "spotify" ? '#FFFFFF' : '#000000',
                    border: activeButton === "spotify" ? 'none' : '1px solid #E0E0E0'
                  }}
                  onClick={() => {
                    setActiveButton("spotify");
                    document.getElementById('spotify-upload').click();
                  }}
                >
                  SCV SPOTIFY
                </button>
                {spotifyFileName && (
                  <Typography variant="caption" sx={{ mt: 1, color: 'success.main' }}>
                    {spotifyFileName} (cargado)
                  </Typography>
                )}
              </Box>
            </label>
          </Box>
          
          <Box>
            <input
              id="instagram-upload"
              type="file"
              accept=".csv"
              onChange={handleInstagramUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="instagram-upload" style={{ cursor: 'pointer' }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <button
                  style={{
                    fontSize: '14px',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: activeButton === "instagram" ? '#000000' : '#FFFFFF',
                    color: activeButton === "instagram" ? '#FFFFFF' : '#000000',
                    border: activeButton === "instagram" ? 'none' : '1px solid #E0E0E0'
                  }}
                  onClick={() => {
                    setActiveButton("instagram");
                    document.getElementById('instagram-upload').click();
                  }}
                >
                  SCV INSTAGRAM
                </button>
                {instagramFileName && (
                  <Typography variant="caption" sx={{ mt: 1, color: 'success.main' }}>
                    {instagramFileName} (cargado)
                  </Typography>
                )}
              </Box>
            </label>
          </Box>
        </Box>
        
        {fileError && (
          <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
            {fileError}
          </Typography>
        )}
      </Box>

      {/* Mostrar los 6 picos principales */}
      {topPeaks.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🚀 Top 6 Días de Mayor Impact Score (Crecimiento + Interacciones)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {topPeaks.map((peak, index) => (
                <Chip
                  key={peak.date}
                  label={`${index + 1}. ${peak.date} (Score: ${peak.impactScore.toFixed(3)})`}
                  color={index < 3 ? "primary" : "secondary"}
                  variant={index < 3 ? "filled" : "outlined"}
                  size="small"
                />
              ))}
            </Box>
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              <strong>Fórmula de Impact Score con Ratios de Crecimiento:</strong>
              <br />
              Impact Score = ( (ΔStreams/Streams_prev × 0.4) + (ΔListeners/Listeners_prev × 0.3) + (ΔFollowers/Followers_prev × 0.3) ) × (Instagram_Interactions / Max_Interactions)
              <br />
              <strong>Ponderación:</strong> Streams 40% | Listeners 30% | Followers 30%
              <br />
              <strong>Interpretación:</strong> Score normalizado que combina crecimiento porcentual de Spotify con intensidad de interacciones Instagram
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Gráfico - recreando el diseño original con puntos de pico destacados */}
      <Card>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mergedData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === "Impact Score") {
                    return [value?.toFixed(4), name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <RechartsLine type="monotone" dataKey="streams" stroke="#8884d8" name="Streams" strokeWidth={2} />
              <RechartsLine type="monotone" dataKey="listeners" stroke="#82ca9d" name="Listeners" strokeWidth={2} />
              <RechartsLine type="monotone" dataKey="followersChange" stroke="#ffc658" name="Followers Change" strokeWidth={2} />
              <RechartsLine type="monotone" dataKey="interactions" stroke="#ff0000" name="Instagram Interactions" strokeWidth={2} />
              <RechartsLine type="monotone" dataKey="impactScore" stroke="#ff6b6b" name="Impact Score" strokeWidth={1} strokeDasharray="5 5" />
              
              {/* Marcar los picos en el gráfico */}
              {topPeaks.slice(0, 3).map((peak, index) => (
                <ReferenceDot
                  key={peak.date}
                  x={peak.date}
                  y={peak.interactions}
                  r={6}
                  fill={index === 0 ? "#ff0000" : index === 1 ? "#ff6600" : "#ffcc00"}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default AnalyzeSpotifyData;