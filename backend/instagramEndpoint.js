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
    const useLogin = req.query.login === 'true';

    console.log(`Buscando los mejores posts para: ${username} (login: ${useLogin})`);

    // Construir la ruta al script de python - CORREGIDO el nombre del archivo
    const scriptPath = path.join(__dirname, 'instagram_scraper.py');

    // Verificar que el script existe
    if (!fs.existsSync(scriptPath)) {
      console.error(`Script no encontrado: ${scriptPath}`);
      return res.status(500).json({ 
        error: 'Script de scraper no encontrado',
        path: scriptPath 
      });
    }

    // Ejecutar el script de Python con los parámetros adecuados
    const loginParam = useLogin ? 'true' : 'false';
    const command = `python "${scriptPath}" ${username} ${limit} ${loginParam}`;
    
    console.log(`Ejecutando: ${command}`);

    const pythonProcess = exec(command, 
      { 
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer para manejar respuestas grandes
        timeout: 120000 // 2 minutos timeout
      }, 
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error ejecutando el scraper: ${error}`);
          return res.status(500).json({ 
            error: 'Error al obtener datos de Instagram',
            details: error.message 
          });
        }

        if (stderr) {
          console.error(`Error en stderr: ${stderr}`);
          // No retornar aquí, stderr puede contener warnings normales
        }

        // Extraer el JSON del output del script
        try {
          const outputLines = stdout.split('\n');
          const jsonStartIndex = outputLines.findIndex(line => line.trim() === 'JSON_OUTPUT_START');
          const jsonEndIndex = outputLines.findIndex(line => line.trim() === 'JSON_OUTPUT_END');

          if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            const jsonString = outputLines.slice(jsonStartIndex + 1, jsonEndIndex).join('\n').trim();
            
            if (jsonString) {
              const data = JSON.parse(jsonString);
              console.log(`✅ Posts obtenidos: ${data.length}`);
              return res.json(data);
            } else {
              console.warn('JSON vacío entre marcadores');
              return res.json([]);
            }
          } else {
            // Buscar cualquier JSON en la salida como fallback
            const jsonRegex = /\[.*\]/s;
            const match = stdout.match(jsonRegex);
            if (match) {
              const data = JSON.parse(match[0]);
              console.log(`✅ Posts obtenidos (regex): ${data.length}`);
              return res.json(data);
            }

            console.error('No se encontró JSON válido en la salida');
            console.error('Salida completa:', stdout.substring(0, 500));
            return res.json([]); // Retornar array vacío en lugar de error
          }
        } catch (jsonError) {
          console.error(`Error al procesar JSON: ${jsonError}`);
          console.error('Salida que causó error:', stdout.substring(0, 500));
          return res.status(500).json({ 
            error: 'Error al procesar la respuesta del scraper',
            details: jsonError.message 
          });
        }
      }
    );

    // Manejar timeout del proceso
    pythonProcess.on('error', (error) => {
      console.error(`Error del proceso Python: ${error}`);
      return res.status(500).json({ 
        error: 'No se pudo ejecutar el scraper de Python',
        details: error.message 
      });
    });

  } catch (error) {
    console.error(`Error general: ${error}`);
    res.status(500).json({ 
      error: 'Error al obtener datos de Instagram',
      details: error.message 
    });
  }
});

module.exports = router;