const apiRoutes = require('./routes/rotas');
const express = require('express');
const session = require('express-session');
const cors = require("cors");
const app = express();
const path = require('path');

// Servir pasta de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: true, 
    httpOnly: true, 
    maxAge: 1000 * 60 * 60 
  }
}));

app.use(cors({
  origin: "https://api-integra.vercel.app", 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/integra-api', apiRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
