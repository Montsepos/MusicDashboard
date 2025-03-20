import React, { useState } from "react";
import Papa from "papaparse";
import { Line } from "recharts";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { LineChart, Line as RechartsLine, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const AnalyzeSpotifyData = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        const formattedData = result.data.map((row) => ({
          date: row["date"],
          streams: Number(row["streams"]),
          listeners: Number(row["listeners"]),
          followers: Number(row["followers"]),
        }));
        setData(formattedData);
      },
      header: true,
    });
  };

  return (
    <Card>
      <h2>Spotify Data Analysis</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {data.length > 0 && (
        <LineChart width={800} height={400} data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <RechartsLine  type="monotone" dataKey="streams" stroke="#8884d8" name="Streams" />
          <RechartsLine  type="monotone" dataKey="listeners" stroke="#82ca9d" name="listeners" />
          <RechartsLine  type="monotone" dataKey="followers" stroke="#ffc658" name="Followers" />
        </LineChart>
      )}
    </Card>
  );
};

export default AnalyzeSpotifyData;
