
const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`🌐 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Endpoint de salud
app.get('/health', (req, res) => {
  console.log('🟢 [BACKEND] Health check');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Servidor funcionando correctamente'
  });
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
  console.log('🟢 [BACKEND] Test endpoint llamado');
  res.json({ 
    message: 'Backend funcionando', 
    timestamp: new Date().toISOString() 
  });
});

// Endpoint para Instagram (temporalmente con datos de prueba)
app.get('/api/instagram/top-posts/:username', (req, res) => {
  const { username } = req.params;
  console.log(`🔥 [BACKEND] Instagram endpoint llamado para: ${username}`);
  
  // Datos de prueba por ahora
  const mockData = [
    {
      id: 'test1',
      shortcode: 'ABC123',
      media_url: 'https://via.placeholder.com/400x400?text=Test+Post+1',
      caption: `Post de prueba para ${username}`,
      like_count: 15432,
      timestamp: new Date().toISOString(),
      type: 'IMAGE'
    },
    {
      id: 'test2',
      shortcode: 'DEF456',
      media_url: 'https://via.placeholder.com/400x400?text=Test+Post+2',
      caption: 'Segundo post de prueba con muchos likes',
      like_count: 12345,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: 'REEL'
    },
    {
      id: 'test3',
      shortcode: 'GHI789',
      media_url: 'https://via.placeholder.com/400x400?text=Test+Post+3',
      caption: 'Tercer post de prueba',
      like_count: 9876,
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      type: 'IMAGE'
    }
  ];
  
  console.log(`✅ [BACKEND] Enviando ${mockData.length} posts de prueba para ${username}`);
  res.json(mockData);
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ [BACKEND] Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  console.log(`⚠️ [BACKEND] Ruta no encontrada: ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    url: req.originalUrl 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 [BACKEND] Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔗 [BACKEND] Endpoints disponibles:`);
  console.log(`   - Health: http://localhost:${PORT}/health`);
  console.log(`   - Test: http://localhost:${PORT}/api/test`);
  console.log(`   - Instagram: http://localhost:${PORT}/api/instagram/top-posts/[username]`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ [BACKEND] Puerto ${PORT} ya está en uso`);
    console.log(`💡 [BACKEND] Intenta cerrar otros servidores o usar otro puerto`);
    process.exit(1);
  } else {
    console.error(`❌ [BACKEND] Error al iniciar servidor:`, err);
    process.exit(1);
  }
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 [BACKEND] Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 [BACKEND] Cerrando servidor...');
  process.exit(0);
});