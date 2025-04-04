import React, { useState } from "react";
import Papa from "papaparse";
import { Card } from "../components/ui/card";
import { LineChart, Line as RechartsLine, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Función para formatear la fecha y eliminar la hora si existe
const formatDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") return null;
  return dateString.split(" ")[0]; // Extrae solo la parte de la fecha
};

const AnalyzeSpotifyData = () => {
  const [spotifyData, setSpotifyData] = useState([]);
  const [instagramData, setInstagramData] = useState([]);
  const [fileError, setFileError] = useState(null);

  // Cargar archivo de Spotify
  const handleSpotifyUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        let formattedData = result.data
          .map((row) => ({
            date: formatDate(row["date"]),
            streams: row["streams"] || 0,
            listeners: row["listeners"] || 0,
            followers: row["followers"] || 0,
          }))
          .filter(entry => entry.date && new Date(entry.date) >= new Date("2024-01-01"));
          // Filtra valores nulos o vacíos

        // Calcular el cambio en followers
        formattedData = formattedData.map((entry, index, arr) => ({
          ...entry,
          followersChange: index === 0 ? 0 : entry.followers - arr[index - 1].followers,
        }));

        setSpotifyData(formattedData);
        setFileError(null);
      },
      error: () => setFileError("Error al leer el archivo CSV de Spotify"),
    });
  };

  // Cargar archivo de Instagram
  const handleInstagramUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const formattedData = result.data
          .map((row) => ({
            date: formatDate(row["Date"]),
            interactions: row["Primary"] || 0,
          }))
          .filter(entry => entry.date && new Date(entry.date) >= new Date("2024-01-01"));

        setInstagramData(formattedData);
        setFileError(null);
      },
      error: () => setFileError("Error al leer el archivo CSV de Instagram"),
    });
  };

  // Combinar los datos de Spotify e Instagram
  const mergedData = [...spotifyData];

  instagramData.forEach(instaEntry => {
    const match = mergedData.find(entry => entry.date === instaEntry.date);
    if (match) {
      match.interactions = instaEntry.interactions;
    } else {
      mergedData.push({ date: instaEntry.date, interactions: instaEntry.interactions });
    }
  });

  // Ordenar los datos por fecha para que el gráfico se vea correctamente
  mergedData.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Card>
      <label>
        Cargar archivo de Spotify (CSV):
        <input type="file" accept=".csv" onChange={handleSpotifyUpload} />
      </label>
      <br />
      <label>
        Cargar archivo de Instagram (CSV):
        <input type="file" accept=".csv" onChange={handleInstagramUpload} />
      </label>
      {fileError && <p style={{ color: "red" }}>{fileError}</p>}

      <ResponsiveContainer width="100%" height={400}>
        <LineChart width={800} height={400} data={mergedData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <RechartsLine type="monotone" dataKey="streams" stroke="#8884d8" name="Streams" />
          <RechartsLine type="monotone" dataKey="listeners" stroke="#82ca9d" name="Listeners" />
          <RechartsLine type="monotone" dataKey="followersChange" stroke="#ffc658" name="Followers Change" />
          {instagramData.length > 0 && (
            <RechartsLine type="monotone" dataKey="interactions" stroke="red" name="Instagram Interactions" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AnalyzeSpotifyData;
