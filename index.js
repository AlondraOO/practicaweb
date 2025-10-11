const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== CONEXIÓN A MONGODB ==========
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado exitosamente'))
  .catch(err => console.error('❌ Error al conectar MongoDB:', err));

// ========== MODELO DE DATOS ==========
const estudianteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  matricula: { type: String, required: true, unique: true },
  carrera: { type: String, required: true },
  semestre: { type: Number, required: true },
  email: { type: String, required: true },
  fechaRegistro: { type: Date, default: Date.now }
});

const Estudiante = mongoose.model('Estudiante', estudianteSchema);

// ========== RUTAS HTML ==========

// Página Principal
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sistema de Estudiantes</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .header {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          margin-bottom: 30px;
          text-align: center;
        }
        h1 { color: #667eea; margin-bottom: 10px; }
        .subtitle { color: #666; font-size: 18px; }
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }
        .card:hover { transform: translateY(-5px); }
        .card h2 { color: #667eea; margin-bottom: 15px; }
        .btn {
          display: inline-block;
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          margin-top: 15px;
          transition: background 0.3s;
        }
        .btn:hover { background: #764ba2; }
        .form-section {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: #333;
          font-weight: 600;
        }
        input, select {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
        }
        input:focus, select:focus {
          outline: none;
          border-color: #667eea;
        }
        .btn-submit {
          width: 100%;
          padding: 15px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .btn-submit:hover { background: #764ba2; }
        .status { 
          text-align: center; 
          padding: 15px; 
          margin: 20px 0; 
          border-radius: 8px;
          display: none;
        }
        .success { background: #d4edda; color: #155724; display: block; }
        .error { background: #f8d7da; color: #721c24; display: block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Sistema de Gestión de Estudiantes</h1>
          <p class="subtitle">Proyecto de Bases de Datos - MongoDB + Render</p>
        </div>

        <div class="cards">
          <div class="card">
            <h2>📝 Registrar Estudiante</h2>
            <p>Agrega un nuevo estudiante al sistema</p>
            <a href="#formulario" class="btn">Ir al Formulario</a>
          </div>
          <div class="card">
            <h2>👥 Ver Estudiantes</h2>
            <p>Consulta todos los estudiantes registrados</p>
            <a href="/estudiantes" class="btn">Ver Lista</a>
          </div>
          <div class="card">
            <h2>📊 API REST</h2>
            <p>Accede a los datos en formato JSON</p>
            <a href="/api/estudiantes" class="btn">Ver API</a>
          </div>
        </div>

        <div class="form-section" id="formulario">
          <h2 style="color: #667eea; margin-bottom: 20px;">Registrar Nuevo Estudiante</h2>
          <div id="mensaje" class="status"></div>
          
          <form id="formEstudiante">
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" name="nombre" required placeholder="Ej: Juan">
            </div>
            <div class="form-group">
              <label>Apellido</label>
              <input type="text" name="apellido" required placeholder="Ej: Pérez">
            </div>
            <div class="form-group">
              <label>Matrícula</label>
              <input type="text" name="matricula" required placeholder="Ej: 21310001">
            </div>
            <div class="form-group">
              <label>Carrera</label>
              <select name="carrera" required>
                <option value="">Selecciona una carrera</option>
                <option value="Ingeniería en Inteligencia Artificial">Ingeniería en Inteligencia Artificial</option>
                <option value="Ingeniería en Sistemas">Ingeniería en Sistemas</option>
                <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                <option value="Arquitectura">Arquitectura</option>
              </select>
            </div>
            <div class="form-group">
              <label>Semestre</label>
              <input type="number" name="semestre" required min="1" max="12" placeholder="1-12">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" required placeholder="estudiante@example.com">
            </div>
            <button type="submit" class="btn-submit">Registrar Estudiante</button>
          </form>
        </div>
      </div>

      <script>
        document.getElementById('formEstudiante').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData);
          const mensaje = document.getElementById('mensaje');

          try {
            const response = await fetch('/api/estudiantes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
              mensaje.className = 'status success';
              mensaje.textContent = '✅ Estudiante registrado exitosamente';
              e.target.reset();
            } else {
              mensaje.className = 'status error';
              mensaje.textContent = '❌ Error: ' + result.error;
            }
          } catch (error) {
            mensaje.className = 'status error';
            mensaje.textContent = '❌ Error de conexión';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Página de Lista de Estudiantes
app.get('/estudiantes', async (req, res) => {
  try {
    const estudiantes = await Estudiante.find().sort({ fechaRegistro: -1 });
    
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lista de Estudiantes</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }
          .container { max-width: 1200px; margin: 0 auto; }
          .header {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin-bottom: 30px;
            text-align: center;
          }
          h1 { color: #667eea; margin-bottom: 10px; }
          .btn {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin: 10px;
          }
          .table-container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            background: #667eea;
            color: white;
            padding: 15px;
            text-align: left;
          }
          td {
            padding: 15px;
            border-bottom: 1px solid #ddd;
          }
          tr:hover { background: #f5f5f5; }
          .badge {
            display: inline-block;
            padding: 5px 10px;
            background: #667eea;
            color: white;
            border-radius: 5px;
            font-size: 14px;
          }
          .empty {
            text-align: center;
            padding: 50px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👥 Lista de Estudiantes Registrados</h1>
            <p>Total: ${estudiantes.length} estudiante(s)</p>
            <a href="/" class="btn">← Volver al Inicio</a>
            <a href="/api/estudiantes" class="btn">Ver API JSON</a>
          </div>

          <div class="table-container">
            ${estudiantes.length === 0 ? 
              '<div class="empty">No hay estudiantes registrados aún</div>' :
              `<table>
                <thead>
                  <tr>
                    <th>Matrícula</th>
                    <th>Nombre Completo</th>
                    <th>Carrera</th>
                    <th>Semestre</th>
                    <th>Email</th>
                    <th>Fecha de Registro</th>
                  </tr>
                </thead>
                <tbody>
                  ${estudiantes.map(est => `
                    <tr>
                      <td><span class="badge">${est.matricula}</span></td>
                      <td>${est.nombre} ${est.apellido}</td>
                      <td>${est.carrera}</td>
                      <td>${est.semestre}° Semestre</td>
                      <td>${est.email}</td>
                      <td>${new Date(est.fechaRegistro).toLocaleDateString('es-MX')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>`
            }
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Error al obtener estudiantes');
  }
});

// ========== API REST ==========

// Obtener todos los estudiantes (JSON)
app.get('/api/estudiantes', async (req, res) => {
  try {
    const estudiantes = await Estudiante.find().sort({ fechaRegistro: -1 });
    res.json({
      total: estudiantes.length,
      estudiantes: estudiantes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nuevo estudiante
app.post('/api/estudiantes', async (req, res) => {
  try {
    const estudiante = new Estudiante(req.body);
    await estudiante.save();
    res.status(201).json({ 
      mensaje: 'Estudiante registrado exitosamente',
      estudiante: estudiante 
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'La matrícula ya existe' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Buscar estudiante por matrícula
app.get('/api/estudiantes/:matricula', async (req, res) => {
  try {
    const estudiante = await Estudiante.findOne({ matricula: req.params.matricula });
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar estudiante
app.delete('/api/estudiantes/:matricula', async (req, res) => {
  try {
    const estudiante = await Estudiante.findOneAndDelete({ matricula: req.params.matricula });
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json({ mensaje: 'Estudiante eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta de estado
app.get('/api/status', (req, res) => {
  res.json({
    estado: 'funcionando',
    database: mongoose.connection.readyState === 1 ? 'conectada' : 'desconectada',
    fecha: new Date()
  });
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 MongoDB: ${mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
});