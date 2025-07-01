
// const express = require('express');
// const { spawn } = require('child_process');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');

// console.log('🚀 Iniciando el servidor backend...');
// const app = express();
// const port = process.env.PORT || 3001;

// // Habilitar CORS para permitir solicitudes desde tu app React
// app.use(cors());
// app.use(express.json());

// // Función de logging mejorada
// const log = (level, message) => {
//   const timestamp = new Date().toISOString().substring(11, 19);
//   const emoji = {
//     'INFO': '🔵',
//     'SUCCESS': '✅',
//     'WARN': '⚠️',
//     'ERROR': '❌',
//     'DEBUG': '🔍'
//   };
//   console.log(`${emoji[level] || '📝'} [${timestamp}] ${message}`);
// };

// // Endpoint principal para Instagram scraping REAL
// app.get('/api/instagram/top-posts/:username', (req, res) => {
//   const { username } = req.params;
//   const limit = req.query.limit || 6;
  
//   // Validar el username para prevenir inyección de comandos
//   if (!/^[a-zA-Z0-9._]+$/.test(username)) {
//     log('ERROR', `Username inválido: ${username}`);
//     return res.status(400).json({ error: 'Nombre de usuario inválido' });
//   }
  
//   log('INFO', `🔥 Scraping REAL para @${username} (límite: ${limit})`);
  
//   // Construir la ruta al script Python
//   const scriptPath = path.join(__dirname, 'instagram_scraper.py');
  
//   // Verificar que el script existe
//   if (!fs.existsSync(scriptPath)) {
//     log('ERROR', `Script no encontrado: ${scriptPath}`);
//     return res.status(500).json({ 
//       error: 'Script de scraper no encontrado',
//       path: scriptPath 
//     });
//   }
  
//   log('DEBUG', `Ejecutando: python "${scriptPath}" ${username} ${limit}`);
  
//   // Ejecutar el script de Python con spawn para mejor control
//   const pythonProcess = spawn('python', [scriptPath, username, limit.toString()], {
//     cwd: __dirname,
//     env: process.env
//   });
  
//   let dataString = '';
//   let errorString = '';
  
//   // Capturar la salida estándar
//   pythonProcess.stdout.on('data', (data) => {
//     const output = data.toString();
//     dataString += output;
    
//     // Log solo líneas importantes del Python
//     const lines = output.split('\n');
//     lines.forEach(line => {
//       if (line.includes('[INFO]') || line.includes('[SUCCESS]') || line.includes('[ERROR]') || line.includes('[WARN]')) {
//         console.log(`🐍 ${line.trim()}`);
//       }
//     });
//   });
  
//   // Capturar errores
//   pythonProcess.stderr.on('data', (data) => {
//     const error = data.toString();
//     errorString += error;
//     console.log(`🐍 [STDERR] ${error.trim()}`);
//   });
  
//   // Configurar timeout para evitar procesos colgados
//   const timeout = setTimeout(() => {
//     log('WARN', `Timeout del proceso Python para @${username}`);
//     pythonProcess.kill();
//   }, 120000); // 2 minutos timeout
  
//   // Cuando termine el proceso
//   pythonProcess.on('close', (code) => {
//     clearTimeout(timeout);
//     log('DEBUG', `Proceso Python terminado con código: ${code}`);
    
//     if (code !== 0) {
//       log('ERROR', `Scraper falló (código ${code}): ${errorString.substring(0, 200)}`);
//       return res.status(500).json({ 
//         error: 'Error en el scraper de Instagram',
//         details: errorString.substring(0, 300),
//         code: code
//       });
//     }
    
//     try {
//       // Buscar JSON en la salida entre los marcadores
//       log('DEBUG', `Procesando salida del Python (${dataString.length} chars)`);
      
//       let jsonData = null;
      
//       // Método 1: Buscar entre JSON_OUTPUT_START y JSON_OUTPUT_END
//       const outputLines = dataString.split('\n');
//       const jsonStartIndex = outputLines.findIndex(line => line.trim() === 'JSON_OUTPUT_START');
//       const jsonEndIndex = outputLines.findIndex(line => line.trim() === 'JSON_OUTPUT_END');
      
//       if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
//         const jsonString = outputLines.slice(jsonStartIndex + 1, jsonEndIndex).join('\n').trim();
//         log('DEBUG', `JSON encontrado entre marcadores (${jsonString.length} chars)`);
        
//         try {
//           jsonData = JSON.parse(jsonString);
//           log('SUCCESS', `JSON parseado correctamente: ${jsonData.length} posts`);
//         } catch (parseError) {
//           log('ERROR', `Error parsing JSON de marcadores: ${parseError.message}`);
//         }
//       }
      
//       // Método 2: Buscar cualquier array JSON en la salida
//       if (!jsonData) {
//         log('DEBUG', 'Buscando JSON con regex...');
//         const jsonRegex = /\[.*\]/s;
//         const match = dataString.match(jsonRegex);
        
//         if (match) {
//           try {
//             jsonData = JSON.parse(match[0]);
//             log('SUCCESS', `JSON encontrado con regex: ${jsonData.length} posts`);
//           } catch (parseError) {
//             log('ERROR', `Error parsing JSON de regex: ${parseError.message}`);
//           }
//         }
//       }
      
//       // Método 3: Intentar leer archivo JSON como fallback
//       if (!jsonData) {
//         log('DEBUG', 'Intentando leer archivo JSON...');
//         try {
//           const jsonFilePath = path.join(__dirname, 'instagram_posts.json');
//           if (fs.existsSync(jsonFilePath)) {
//             const fileData = fs.readFileSync(jsonFilePath, 'utf8');
//             jsonData = JSON.parse(fileData);
//             log('SUCCESS', `JSON leído de archivo: ${jsonData.length} posts`);
//           }
//         } catch (fileError) {
//           log('ERROR', `Error leyendo archivo JSON: ${fileError.message}`);
//         }
//       }
      
//       // Enviar respuesta
//       if (jsonData && Array.isArray(jsonData) && jsonData.length > 0) {
//         log('SUCCESS', `Enviando ${jsonData.length} posts para @${username}`);
//         return res.json(jsonData);
//       } else {
//         log('WARN', `No se obtuvieron posts válidos para @${username}`);
//         return res.json([]);  // Array vacío si no hay posts
//       }
      
//     } catch (error) {
//       log('ERROR', `Error procesando respuesta: ${error.message}`);
//       log('DEBUG', `Salida que causó error: ${dataString.substring(0, 500)}`);
      
//       return res.status(500).json({ 
//         error: 'Error procesando respuesta del scraper',
//         details: error.message
//       });
//     }
//   });
  
//   // Manejar errores del proceso
//   pythonProcess.on('error', (error) => {
//     clearTimeout(timeout);
//     log('ERROR', `Error ejecutando Python: ${error.message}`);
//     return res.status(500).json({ 
//       error: 'No se pudo ejecutar el scraper de Python',
//       details: error.message
//     });
//   });
// });

// // Ruta alternativa (para compatibilidad)
// app.get('/api/instagram/:username', (req, res) => {
//   log('DEBUG', `Redirigiendo ${req.originalUrl} a /api/instagram/top-posts/${req.params.username}`);
//   res.redirect(`/api/instagram/top-posts/${req.params.username}?limit=${req.query.limit || 6}`);
// });

// // Endpoint de salud
// app.get('/health', (req, res) => {
//   const scriptPath = path.join(__dirname, 'instagram_scraper.py');
//   const scraperPath = path.join(__dirname, 'scraper', 'instagram.py');
  
//   const health = {
//     status: 'ok',
//     timestamp: new Date().toISOString(),
//     scraper: {
//       main_script: fs.existsSync(scriptPath),
//       selenium_scraper: fs.existsSync(scraperPath),
//       ready: fs.existsSync(scriptPath) && fs.existsSync(scraperPath)
//     }
//   };
  
//   log('INFO', `Health check - Ready: ${health.scraper.ready}`);
//   res.json(health);
// });

// // Ruta para verificar que el servidor está funcionando
// app.get('/', (req, res) => {
//   res.json({
//     message: 'API del servidor backend para scraping de Instagram',
//     endpoints: [
//       'GET /api/instagram/top-posts/:username',
//       'GET /health'
//     ],
//     timestamp: new Date().toISOString()
//   });
// });

// // Manejo de errores global
// app.use((err, req, res, next) => {
//   log('ERROR', `Error del servidor: ${err.message}`);
//   res.status(500).json({ 
//     error: 'Error interno del servidor',
//     message: err.message 
//   });
// });

// // Manejo de rutas no encontradas
// app.use('*', (req, res) => {
//   if (req.originalUrl !== '/favicon.ico') {
//     log('WARN', `Ruta no encontrada: ${req.originalUrl}`);
//   }
//   res.status(404).json({ 
//     error: 'Ruta no encontrada',
//     available_routes: ['/', '/health', '/api/instagram/top-posts/:username']
//   });
// });

// // Iniciar el servidor
// app.listen(port, () => {
//   log('SUCCESS', `Servidor corriendo en http://localhost:${port}`);
//   console.log('🔗 Endpoints disponibles:');
//   console.log(`   - Health: http://localhost:${port}/health`);
//   console.log(`   - Instagram: http://localhost:${port}/api/instagram/top-posts/[username]`);
//   console.log('');
//   log('INFO', 'Listo para hacer scraping REAL de Instagram con Selenium');
// }).on('error', (err) => {
//   if (err.code === 'EADDRINUSE') {
//     log('ERROR', `Puerto ${port} ya está en uso`);
//     process.exit(1);
//   } else {
//     log('ERROR', `Error iniciando servidor: ${err.message}`);
//     process.exit(1);
//   }
// });

// // Manejo de cierre graceful
// process.on('SIGTERM', () => {
//   log('INFO', 'Cerrando servidor...');
//   process.exit(0);
// });

// process.on('SIGINT', () => {
//   log('INFO', 'Cerrando servidor...');
//   process.exit(0);
// });

// backend/server.js
const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando el servidor backend...');
const app = express();
const port = process.env.PORT || 3001;

// Habilitar CORS para permitir solicitudes desde tu app React
app.use(cors());
app.use(express.json());

// Función de logging mejorada
const log = (level, message) => {
  const timestamp = new Date().toISOString().substring(11, 19);
  const emoji = {
    'INFO': '🔵',
    'SUCCESS': '✅',
    'WARN': '⚠️',
    'ERROR': '❌',
    'DEBUG': '🔍'
  };
  console.log(`${emoji[level] || '📝'} [${timestamp}] ${message}`);
};

// Endpoint principal para Instagram scraping REAL
app.get('/api/instagram/top-posts/:username', (req, res) => {
  const { username } = req.params;
  const limit = req.query.limit || 6;
  const useLogin = req.query.login === 'true'; // Nuevo parámetro para login
  
  // Validar el username para prevenir inyección de comandos
  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    log('ERROR', `Username inválido: ${username}`);
    return res.status(400).json({ error: 'Nombre de usuario inválido' });
  }
  
  log('INFO', `🔥 Scraping REAL para @${username} (límite: ${limit}, login: ${useLogin})`);
  
  // Construir la ruta al script Python
  const scriptPath = path.join(__dirname, 'instagram_scraper.py');
  
  // Verificar que el script existe
  if (!fs.existsSync(scriptPath)) {
    log('ERROR', `Script no encontrado: ${scriptPath}`);
    return res.status(500).json({ 
      error: 'Script de scraper no encontrado',
      path: scriptPath 
    });
  }
  
  // Comando con parámetro de login
  const loginParam = useLogin ? 'true' : 'false';
  log('DEBUG', `Ejecutando: python "${scriptPath}" ${username} ${limit} ${loginParam}`);
  
  // Ejecutar el script de Python con spawn para mejor control
  const pythonProcess = spawn('python', [scriptPath, username, limit.toString(), loginParam], {
    cwd: __dirname,
    env: process.env
  });
  
  let dataString = '';
  let errorString = '';
  
  // Capturar la salida estándar
  pythonProcess.stdout.on('data', (data) => {
    const output = data.toString();
    dataString += output;
    
    // Log solo líneas importantes del Python
    const lines = output.split('\n');
    lines.forEach(line => {
      if (line.includes('[INFO]') || line.includes('[SUCCESS]') || line.includes('[ERROR]') || line.includes('[WARN]')) {
        console.log(`🐍 ${line.trim()}`);
      }
    });
  });
  
  // Capturar errores
  pythonProcess.stderr.on('data', (data) => {
    const error = data.toString();
    errorString += error;
    console.log(`🐍 [STDERR] ${error.trim()}`);
  });
  
  // Configurar timeout para evitar procesos colgados
  const timeout = setTimeout(() => {
    log('WARN', `Timeout del proceso Python para @${username}`);
    pythonProcess.kill();
  }, 120000); // 2 minutos timeout
  
  // Cuando termine el proceso
  pythonProcess.on('close', (code) => {
    clearTimeout(timeout);
    log('DEBUG', `Proceso Python terminado con código: ${code}`);
    
    if (code !== 0) {
      log('ERROR', `Scraper falló (código ${code}): ${errorString.substring(0, 200)}`);
      return res.status(500).json({ 
        error: 'Error en el scraper de Instagram',
        details: errorString.substring(0, 300),
        code: code
      });
    }
    
    try {
      // Buscar JSON en la salida entre los marcadores
      log('DEBUG', `Procesando salida del Python (${dataString.length} chars)`);
      
      let jsonData = null;
      
      // Método 1: Buscar entre JSON_OUTPUT_START y JSON_OUTPUT_END
      const outputLines = dataString.split('\n');
      const jsonStartIndex = outputLines.findIndex(line => line.trim() === 'JSON_OUTPUT_START');
      const jsonEndIndex = outputLines.findIndex(line => line.trim() === 'JSON_OUTPUT_END');
      
      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        const jsonString = outputLines.slice(jsonStartIndex + 1, jsonEndIndex).join('\n').trim();
        log('DEBUG', `JSON encontrado entre marcadores (${jsonString.length} chars)`);
        
        try {
          jsonData = JSON.parse(jsonString);
          log('SUCCESS', `JSON parseado correctamente: ${jsonData.length} posts`);
        } catch (parseError) {
          log('ERROR', `Error parsing JSON de marcadores: ${parseError.message}`);
        }
      }
      
      // Método 2: Buscar cualquier array JSON en la salida
      if (!jsonData) {
        log('DEBUG', 'Buscando JSON con regex...');
        const jsonRegex = /\[.*\]/s;
        const match = dataString.match(jsonRegex);
        
        if (match) {
          try {
            jsonData = JSON.parse(match[0]);
            log('SUCCESS', `JSON encontrado con regex: ${jsonData.length} posts`);
          } catch (parseError) {
            log('ERROR', `Error parsing JSON de regex: ${parseError.message}`);
          }
        }
      }
      
      // Método 3: Intentar leer archivo JSON como fallback
      if (!jsonData) {
        log('DEBUG', 'Intentando leer archivo JSON...');
        try {
          const jsonFilePath = path.join(__dirname, 'instagram_posts.json');
          if (fs.existsSync(jsonFilePath)) {
            const fileData = fs.readFileSync(jsonFilePath, 'utf8');
            jsonData = JSON.parse(fileData);
            log('SUCCESS', `JSON leído de archivo: ${jsonData.length} posts`);
          }
        } catch (fileError) {
          log('ERROR', `Error leyendo archivo JSON: ${fileError.message}`);
        }
      }
      
      // Enviar respuesta
      if (jsonData && Array.isArray(jsonData) && jsonData.length > 0) {
        log('SUCCESS', `Enviando ${jsonData.length} posts para @${username}`);
        return res.json(jsonData);
      } else {
        log('WARN', `No se obtuvieron posts válidos para @${username}`);
        return res.json([]);  // Array vacío si no hay posts
      }
      
    } catch (error) {
      log('ERROR', `Error procesando respuesta: ${error.message}`);
      log('DEBUG', `Salida que causó error: ${dataString.substring(0, 500)}`);
      
      return res.status(500).json({ 
        error: 'Error procesando respuesta del scraper',
        details: error.message
      });
    }
  });
  
  // Manejar errores del proceso
  pythonProcess.on('error', (error) => {
    clearTimeout(timeout);
    log('ERROR', `Error ejecutando Python: ${error.message}`);
    return res.status(500).json({ 
      error: 'No se pudo ejecutar el scraper de Python',
      details: error.message
    });
  });
});

// Endpoint específico para scraping CON LOGIN (para más detalles)
app.get('/api/instagram/login/:username', (req, res) => {
  const { username } = req.params;
  const limit = req.query.limit || 6;
  
  // Validar el username
  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    log('ERROR', `Username inválido: ${username}`);
    return res.status(400).json({ error: 'Nombre de usuario inválido' });
  }
  
  log('INFO', `🔐 Scraping CON LOGIN para @${username} (límite: ${limit})`);
  
  // Construir la ruta al script Python
  const scriptPath = path.join(__dirname, 'instagram_scraper.py');
  
  if (!fs.existsSync(scriptPath)) {
    log('ERROR', `Script no encontrado: ${scriptPath}`);
    return res.status(500).json({ 
      error: 'Script de scraper no encontrado',
      path: scriptPath 
    });
  }
  
  log('DEBUG', `Ejecutando CON LOGIN: python "${scriptPath}" ${username} ${limit} true`);
  
  // Ejecutar con login habilitado
  const pythonProcess = spawn('python', [scriptPath, username, limit.toString(), 'true'], {
    cwd: __dirname,
    env: process.env
  });
  
  let dataString = '';
  let errorString = '';
  
  // Capturar la salida estándar
  pythonProcess.stdout.on('data', (data) => {
    const output = data.toString();
    dataString += output;
    
    // Log líneas importantes del Python
    const lines = output.split('\n');
    lines.forEach(line => {
      if (line.includes('[INFO]') || line.includes('[SUCCESS]') || line.includes('[ERROR]') || line.includes('[WARN]')) {
        console.log(`🔐 ${line.trim()}`);
      }
    });
  });
  
  // Capturar errores
  pythonProcess.stderr.on('data', (data) => {
    const error = data.toString();
    errorString += error;
    console.log(`🔐 [STDERR] ${error.trim()}`);
  });
  
  // Timeout más largo para login (3 minutos)
  const timeout = setTimeout(() => {
    log('WARN', `Timeout del proceso con login para @${username}`);
    pythonProcess.kill();
  }, 180000);
  
  // Cuando termine el proceso
  pythonProcess.on('close', (code) => {
    clearTimeout(timeout);
    log('DEBUG', `Proceso con login terminado con código: ${code}`);
    
    if (code !== 0) {
      log('ERROR', `Scraper con login falló (código ${code})`);
      return res.status(500).json({ 
        error: 'Error en el scraper con login',
        details: errorString.substring(0, 300),
        code: code
      });
    }
    
    try {
      // Procesar respuesta igual que el endpoint normal
      log('DEBUG', `Procesando salida con login (${dataString.length} chars)`);
      
      let jsonData = null;
      
      // Buscar JSON entre marcadores
      const outputLines = dataString.split('\n');
      const jsonStartIndex = outputLines.findIndex(line => line.trim() === 'JSON_OUTPUT_START');
      const jsonEndIndex = outputLines.findIndex(line => line.trim() === 'JSON_OUTPUT_END');
      
      if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        const jsonString = outputLines.slice(jsonStartIndex + 1, jsonEndIndex).join('\n').trim();
        try {
          jsonData = JSON.parse(jsonString);
          log('SUCCESS', `JSON con login parseado: ${jsonData.length} posts`);
        } catch (parseError) {
          log('ERROR', `Error parsing JSON con login: ${parseError.message}`);
        }
      }
      
      // Fallback con regex si es necesario
      if (!jsonData) {
        const jsonRegex = /\[.*\]/s;
        const match = dataString.match(jsonRegex);
        if (match) {
          try {
            jsonData = JSON.parse(match[0]);
            log('SUCCESS', `JSON con login encontrado con regex: ${jsonData.length} posts`);
          } catch (parseError) {
            log('ERROR', `Error parsing JSON regex con login: ${parseError.message}`);
          }
        }
      }
      
      // Enviar respuesta
      if (jsonData && Array.isArray(jsonData)) {
        log('SUCCESS', `Enviando ${jsonData.length} posts CON LOGIN para @${username}`);
        return res.json(jsonData);
      } else {
        log('WARN', `No se obtuvieron posts con login para @${username}`);
        return res.json([]);
      }
      
    } catch (error) {
      log('ERROR', `Error procesando respuesta con login: ${error.message}`);
      return res.status(500).json({ 
        error: 'Error procesando respuesta del scraper con login',
        details: error.message
      });
    }
  });
  
  // Manejar errores del proceso
  pythonProcess.on('error', (error) => {
    clearTimeout(timeout);
    log('ERROR', `Error ejecutando Python con login: ${error.message}`);
    return res.status(500).json({ 
      error: 'No se pudo ejecutar el scraper con login',
      details: error.message
    });
  });
});

// Ruta alternativa (para compatibilidad)
app.get('/api/instagram/:username', (req, res) => {
  log('DEBUG', `Redirigiendo ${req.originalUrl} a /api/instagram/top-posts/${req.params.username}`);
  res.redirect(`/api/instagram/top-posts/${req.params.username}?limit=${req.query.limit || 6}`);
});

// Endpoint de salud
app.get('/health', (req, res) => {
  const scriptPath = path.join(__dirname, 'instagram_scraper.py');
  const scraperPath = path.join(__dirname, 'scraper', 'instagram.py');
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    scraper: {
      main_script: fs.existsSync(scriptPath),
      selenium_scraper: fs.existsSync(scraperPath),
      ready: fs.existsSync(scriptPath) && fs.existsSync(scraperPath),
      login_enabled: true,
      login_account: 'probandorolando123'
    },
    endpoints: {
      without_login: '/api/instagram/top-posts/:username',
      with_login: '/api/instagram/login/:username',
      with_login_param: '/api/instagram/top-posts/:username?login=true'
    }
  };
  
  log('INFO', `Health check - Ready: ${health.scraper.ready}, Login: ${health.scraper.login_enabled}`);
  res.json(health);
});

// Ruta para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({
    message: 'API del servidor backend para scraping de Instagram',
    endpoints: [
      'GET /api/instagram/top-posts/:username - Scraping sin login',
      'GET /api/instagram/top-posts/:username?login=true - Scraping con login',
      'GET /api/instagram/login/:username - Scraping con login (dedicado)',
      'GET /health - Estado del servidor'
    ],
    login_credentials: 'probandorolando123 / pr0banDO',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  log('ERROR', `Error del servidor: ${err.message}`);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  if (req.originalUrl !== '/favicon.ico') {
    log('WARN', `Ruta no encontrada: ${req.originalUrl}`);
  }
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    available_routes: [
      '/', 
      '/health', 
      '/api/instagram/top-posts/:username',
      '/api/instagram/login/:username'
    ]
  });
});

// Iniciar el servidor
app.listen(port, () => {
  log('SUCCESS', `Servidor corriendo en http://localhost:${port}`);
  console.log('🔗 Endpoints disponibles:');
  console.log(`   - Health: http://localhost:${port}/health`);
  console.log(`   - Instagram (sin login): http://localhost:${port}/api/instagram/top-posts/[username]`);
  console.log(`   - Instagram (con login): http://localhost:${port}/api/instagram/login/[username]`);
  console.log(`   - Instagram (con parámetro): http://localhost:${port}/api/instagram/top-posts/[username]?login=true`);
  console.log('');
  log('INFO', 'Listo para hacer scraping REAL de Instagram con Selenium');
  log('INFO', '🔐 Login disponible con: probandorolando123 / pr0banDO');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    log('ERROR', `Puerto ${port} ya está en uso`);
    process.exit(1);
  } else {
    log('ERROR', `Error iniciando servidor: ${err.message}`);
    process.exit(1);
  }
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  log('INFO', 'Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  log('INFO', 'Cerrando servidor...');
  process.exit(0);
});