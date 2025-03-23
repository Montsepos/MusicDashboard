import React, { useState } from "react";
import Papa from "papaparse";
import { Card } from "../components/ui/card";
import { LineChart, Line as RechartsLine, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyzeSpotifyData = () => {
  const [spotifyData, setSpotifyData] = useState([]);
  const [instagramData, setInstagramData] = useState([]);
  const [fileError, setFileError] = useState(null);

  // Función para limpiar y normalizar las fechas (eliminar la hora)
  const normalizeDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  // Cargar archivo de Spotify
  const handleSpotifyUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const formattedData = result.data
          .map((row) => ({
            date: normalizeDate(row["date"]),
            streams: row["streams"] || 0,
            listeners: row["listeners"] || 0,
            followers: row["followers"] || 0,
            interactions: 0, // Inicializa en 0 para evitar datos faltantes
          }))
          .filter(entry => entry.date && new Date(entry.date) >= new Date("2024-01-01"));

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
            date: normalizeDate(row["Date"]), // Normaliza la fecha quitando la hora
            interactions: row["Primary"] || 0,
            streams: 0, // Inicializa en 0 para evitar datos faltantes
            listeners: 0,
            followers: 0,
          }))
          .filter(entry => entry.date && new Date(entry.date) >= new Date("2024-01-01"));

        setInstagramData(formattedData);
        setFileError(null);
      },
      error: () => setFileError("Error al leer el archivo CSV de Instagram"),
    });
  };

  // Crear un mapa con todas las fechas y datos combinados
  const dataMap = new Map();

  // Agregar datos de Spotify
  spotifyData.forEach(entry => {
    dataMap.set(entry.date, { ...entry });
  });

  // Agregar datos de Instagram asegurando que las fechas sean las mismas
  instagramData.forEach(instaEntry => {
    if (dataMap.has(instaEntry.date)) {
      dataMap.set(instaEntry.date, { ...dataMap.get(instaEntry.date), interactions: instaEntry.interactions });
    } else {
      dataMap.set(instaEntry.date, { ...instaEntry }); // Agrega la entrada si no existía
    }
  });

  // Convertir el mapa en un array y ordenarlo por fecha
  const mergedData = Array.from(dataMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

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
          <RechartsLine type="monotone" dataKey="followers" stroke="#ffc658" name="Followers" />
          <RechartsLine type="monotone" dataKey="interactions" stroke="red" name="Instagram Interactions" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AnalyzeSpotifyData;
