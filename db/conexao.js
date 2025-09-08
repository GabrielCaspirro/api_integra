const mysql = require('mysql2');

const conexao = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
 
conexao.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com o banco:', err);
    return;
  }
  console.log('Conectado ao banco!');
});

module.exports = conexao;
