const mysql = require("mysql2");

const conexao = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

conexao.connect(err => {
  if (err) {
    console.error(" Erro ao conectar MySQL:", err.message);
  } else {
    console.log(" MySQL conectado com sucesso no banco:", process.env.DB_NAME);
  }
});

module.exports = conexao;
