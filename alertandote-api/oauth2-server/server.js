// Importar módulos necesarios
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fileUploadRouter = require('./fileUpload');
const cors = require('cors');
const path = require('path');  

 
const app = express();
 
app.use(cors({
    origin: 'http://localhost:3000',  
    credentials: true,  
  }));

 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

 
app.use(passport.initialize());
app.use(passport.session());
 
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
(accessToken, refreshToken, profile, done) => {
 
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

 
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Ruta de autenticación con Google
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback de Google para redirigir después de autenticación exitosa
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('http://localhost:3000/'); 
});

// Ruta protegida que requiere autenticación
app.get('http://localhost:3000/', ensureAuthenticated, (req, res) => {
  res.send(`<h1>Perfil de usuario</h1><p>${JSON.stringify(req.user.profile)}</p><a href="/logout">Cerrar sesión</a>`);
});

 
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}


app.use('/api/upload', fileUploadRouter);

 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
