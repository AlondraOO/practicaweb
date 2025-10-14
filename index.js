const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== CONEXIÓN A SUPABASE ==========
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ========== MIDDLEWARE DE AUTENTICACIÓN ==========
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Token inválido o expirado' });

  req.user = data.user;
  next();
}

// ========== RUTAS DE AUTENTICACIÓN ==========
app.get('/login', (req, res) => {
  res.send(`
    <html lang="es">
    <head><title>Iniciar Sesión</title></head>
    <body style="font-family: sans-serif; text-align: center; margin-top: 100px;">
      <h2>Inicio de sesión</h2>
      <form method="POST" action="/login">
        <input type="email" name="email" placeholder="Correo" required><br><br>
        <input type="password" name="password" placeholder="Contraseña" required><br><br>
        <button type="submit">Ingresar</button>
      </form>
      <p>¿No tienes cuenta? <a href="/signup">Registrarte</a></p>
    </body></html>
  `);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).send(`<p>Error: ${error.message}</p><a href="/login">Volver</a>`);
  res.send(`
    <h3>✅ Inicio de sesión exitoso</h3>
    <p>Guarda este token para tus peticiones:</p>
    <pre>${data.session.access_token}</pre>
    <a href="/">Ir al sistema</a>
  `);
});

app.get('/signup', (req, res) => {
  res.send(`
    <html lang="es">
    <head><title>Registro</title></head>
    <body style="font-family: sans-serif; text-align: center; margin-top: 100px;">
      <h2>Crear cuenta</h2>
      <form method="POST" action="/signup">
        <input type="email" name="email" placeholder="Correo" required><br><br>
        <input type="password" name="password" placeholder="Contraseña" required><br><br>
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a></p>
    </body></html>
  `);
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).send(`<p>Error: ${error.message}</p><a href="/signup">Volver</a>`);
  res.send(`<p>✅ Cuenta creada. Ahora puedes <a href="/login">iniciar sesión</a>.</p>`);
});

// ========== PÁGINA PRINCIPAL ==========
app.get('/', (req, res) => {
  res.send(`
    <html lang="es">
    <head>
      <title>Inicio</title>
      <meta charset="UTF-8">
    </head>
    <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
      <h1>🎓 Sistema de Estudiantes - Supabase</h1>
      <p>Debes iniciar sesión para acceder al sistema.</p>
      <a href="/login">Iniciar Sesión</a> |
      <a href="/signup">Registrarse</a>
    </body>
    </html>
  `);
});

// ========== API ESTUDIANTES (PROTEGIDA) ==========
app.get('/api/estudiantes', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('estudiantes')
    .select('*')
    .order('fecha_registro', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ total: data.length, estudiantes: data });
});

app.post('/api/estudiantes', authMiddleware, async (req, res) => {
  const estudiante = req.body;
  const { data, error } = await supabase.from('estudiantes').insert([estudiante]);

  if (error) {
    if (error.message.includes('duplicate key'))
      return res.status(400).json({ error: 'La matrícula ya existe' });
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({ mensaje: 'Estudiante registrado exitosamente', estudiante: data[0] });
});

app.get('/api/estudiantes/:matricula', authMiddleware, async (req, res) => {
  const { matricula } = req.params;
  const { data, error } = await supabase.from('estudiantes').select('*').eq('matricula', matricula).single();

  if (error || !data) return res.status(404).json({ error: 'Estudiante no encontrado' });
  res.json(data);
});

app.delete('/api/estudiantes/:matricula', authMiddleware, async (req, res) => {
  const { matricula } = req.params;
  const { error } = await supabase.from('estudiantes').delete().eq('matricula', matricula);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensaje: 'Estudiante eliminado exitosamente' });
});

// ========== ESTADO ==========
app.get('/api/status', (req, res) => {
  res.json({ estado: 'funcionando', base: 'supabase', fecha: new Date() });
});

// ========== SERVIDOR ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
