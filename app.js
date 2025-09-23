require("dotenv").config();
const apiRoutes = require('./routes/rotas');
const express = require('express');
const session = require('express-session');
const cors = require("cors");
const app = express();
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET || "segredo_teste",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, 
    sameSite: "none", 
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  }
}));

const allowedOrigins = [
  'http://localhost:3000', 
  "https://integra-tcc.vercel.app/"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Não permtido pelo CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/integra-api', apiRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
