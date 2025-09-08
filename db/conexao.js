// db/conexao.js
const mysql = require('mysql2');

let conexao;

function handleDisconnect() {
  conexao = mysql.createConnection({
    host: process.env.DB_HOST,       // host do banco
    user: process.env.DB_USER,       // usuário
    password: process.env.DB_PASS,   // senha
    database: process.env.DB_NAME    // nome do banco
  });

  conexao.connect(err => {
    if (err) {
      console.error('Erro ao conectar ao MySQL:', err);
      setTimeout(handleDisconnect, 2000); // tenta reconectar em 2s
    } else {
      console.log('Conectado ao MySQL!');
    }
  });

  conexao.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.warn('Conexão perdida. Reconectando...');
      handleDisconnect(); // reconecta automaticamente
    } else {
      throw err;
    }
  });
}

handleDisconnect();

// exporta uma função para pegar a conexão atual
module.exports = () => conexao;

