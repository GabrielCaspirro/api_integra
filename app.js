const apiRoutes = require('./routes/rotas');
const express = require('express');
const session = require('express-session');
const cors = require("cors");
const app = express();
const path = require('path');

// Servir pasta de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: '123456789', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/integra-api', apiRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
