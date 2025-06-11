const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Endpoint para obtener los mejores posts de Instagram de un artista
router.get('/top-posts/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const limit = req.query.limit || 6;
    
    console.log(`Buscando los mejores posts para: ${username}`);
    
    // Construir la ruta al script de python
    const scriptPath = path.join(__dirname, 'instagram_scaper.py');
    
    // Ejecutar el script de Python con los parámetros adecuados
    const pythonProcess = exec(`python "${scriptPath}" ${username} ${limit} true`, 
      { maxBuffer: 1024 * 1024 * 10 }, // 10MB buffer para manejar respuestas grandes
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error ejecutando el scraper: ${error}`);
          return res.status(500).json({ error: 'Error al obtener datos de Instagram' });
        }
        
        if (stderr) {
          console.error(`Error en stderr: ${stderr}`);
        }
        
        // Extraer el JSON del output del script
        try {
          const outputLines = stdout.split('\n');
          const jsonStartIndex = outputLines.findIndex(line => line === 'JSON_OUTPUT_START');
          const jsonEndIndex = outputLines.findIndex(line => line === 'JSON_OUTPUT_END');
          
          if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            const jsonString = outputLines.slice(jsonStartIndex + 1, jsonEndIndex).join('\n');
            const data = JSON.parse(jsonString);
            return res.json(data);
          } else {
            // Buscar cualquier JSON en la salida
            const jsonRegex = /\[.*\]/s;
            const match = stdout.match(jsonRegex);
            if (match) {
              const data = JSON.parse(match[0]);
              return res.json(data);
            }
            
            console.error('No se encontró JSON válido en la salida');
            return res.status(500).json({ error: 'No se pudieron procesar los datos' });
          }
        } catch (jsonError) {
          console.error(`Error al procesar JSON: ${jsonError}`);
          console.error('Salida completa:', stdout);
          return res.status(500).json({ error: 'Error al procesar la respuesta del scraper' });
        }
      });
  } catch (error) {
    console.error(`Error general: ${error}`);
    res.status(500).json({ error: 'Error al obtener datos de Instagram' });
  }
});

module.exports = router;