const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado exitosamente'))
  .catch(err => console.error('❌ Error al conectar MongoDB:', err));

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '¡Hola desde Render + MongoDB!',
    estado: 'funcionando',
    fecha: new Date().toISOString()
  });
});

// Ruta de prueba de salud
app.get('/health', (req, res) => {
  const estado = mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado';
  res.json({ 
    servidor: 'activo',
    mongodb: estado
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});