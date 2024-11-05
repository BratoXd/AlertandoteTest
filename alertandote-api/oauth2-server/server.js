// Importar módulos necesarios
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fileUploadRouter = require('./fileUpload');
const cors = require('cors');


// Crear la aplicación Express
const app = express();


// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3000', // URL de tu frontend
    credentials: true, // Permite enviar cookies
  }));

// Configurar sesión para almacenar información del usuario
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Inicializar Passport y la sesión de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar la estrategia de Google OAuth 2.0
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
(accessToken, refreshToken, profile, done) => {
  // Aquí se maneja el perfil del usuario una vez autenticado
  // Guardar tokens si es necesario
  const user = {
    profile,
    accessToken,
    refreshToken
  };
  return done(null, user);
}));





// Serializar y deserializar usuario
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
app.get('/auth/status', (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated() });
});

// Ruta principal
app.get('/', (req, res) => {
  res.send('<h1>Bienvenido al servidor OAuth 2.0</h1><a href="/auth/google">Iniciar sesión con Google</a>');
});

// Ruta de autenticación con Google
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback de Google para redirigir después de autenticación exitosa
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('http://localhost:3000/'); // Redirige al componente de subida en el frontend
});

// Ruta protegida que requiere autenticación
app.get('http://localhost:3000/', ensureAuthenticated, (req, res) => {
  res.send(`<h1>Perfil de usuario</h1><p>${JSON.stringify(req.user.profile)}</p><a href="/logout">Cerrar sesión</a>`);
});

// Función para asegurar que el usuario está autenticado
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});


app.use('/api/upload', fileUploadRouter);


// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
