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
  cookie: {
    httpOnly: true,
    secure: false, // Cambiar a `true` si usas HTTPS
    sameSite: 'lax', // Controla cómo se envían las cookies
  },
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
  if (req.isAuthenticated()) {
      // Usuario autenticado exitosamente
      res.status(200).json({
          authenticated: true,
          user: req.user, // Información del usuario autenticado
      });
  } else {
      // Usuario no autenticado
      res.status(200).json({
          authenticated: false,
          attemptedUser: req.session?.attemptedUser || null, // Datos del intento fallido si están guardados
          message: "User not authenticated",
      });
  }
});


app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Ruta de autenticación con Google
app.get('/auth/google', 
  passport.authenticate('google', {
  scope: ['profile', 'email']
}));


app.get(
  '/auth/google/callback',
  (req, res, next) => {
    console.log("Parametros de la URL:", req.query);  // Verifica los parámetros de la URL
    if (req.query.error) {
      console.log("Error en la autenticación:", req.query.error);
      return res.redirect('http://localhost:3000');
    }
    next();
  },
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect('http://localhost:3000');
  }
);



app.use('/api/upload', fileUploadRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
