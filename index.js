const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== CONEXIÓN A POSTGRESQL (NEON) ==========
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('✅ PostgreSQL (Neon) conectado exitosamente'))
  .catch(err => console.error('❌ Error al conectar PostgreSQL:', err));

// ========== PÁGINA PRINCIPAL ==========
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// ========== API REST ==========

// Obtener todos los estudiantes
app.get('/api/estudiantes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM estudiantes ORDER BY fecha_registro DESC');
    res.json({
      total: result.rowCount,
      estudiantes: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nuevo estudiante
app.post('/api/estudiantes', async (req, res) => {
  const { nombre, apellido, matricula, carrera, semestre, email } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO estudiantes (nombre, apellido, matricula, carrera, semestre, email)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, apellido, matricula, carrera, semestre, email]
    );

    res.status(201).json({
      mensaje: 'Estudiante registrado exitosamente',
      estudiante: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'La matrícula ya existe' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Buscar por matrícula
app.get('/api/estudiantes/:matricula', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM estudiantes WHERE matricula = $1',
      [req.params.matricula]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar estudiante
app.delete('/api/estudiantes/:matricula', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM estudiantes WHERE matricula = $1 RETURNING *',
      [req.params.matricula]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    res.json({ mensaje: 'Estudiante eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta de estado
app.get('/api/status', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      estado: 'funcionando',
      database: 'conectada',
      fecha: new Date()
    });
  } catch {
    res.json({
      estado: 'funcionando',
      database: 'desconectada',
      fecha: new Date()
    });
  }
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
