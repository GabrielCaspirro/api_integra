const conexao = require('../../db/conexao');
const bcrypt = require('bcrypt');

function GetAllCoordenadores(res){
    conexao.query('SELECT * FROM coordenador', (err, resultados) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar coordenadores' });
    }
    
    const coordenadorSemSenha = resultados.map(coordenador => {
      delete coordenador.senha;
      return coordenador;
    });

    res.json(coordenadorSemSenha);
  });
}

function InserirCoordenador(req, res) {
    const { matricula, nome, email, senha } = req.body;
  
    if (!matricula || !nome || !email || !senha) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
    }
  
    const sql = `
      INSERT INTO coordenador (matricula, nome, email, senha)
      VALUES (?, ?, ?, ?)
    `;
  
    bcrypt.hash(senha, 10, (err, hash) => {
      if (err) return res.status(500).json({ erro: 'Erro ao criptografar senha.' });
      conexao.query(sql, [matricula, nome, email, hash], (err, resultado) => {
          if (err) {
              console.error('Erro ao inserir coordenador:', err);
              return res.status(500).json({ erro: 'Erro ao inserir coordenador.' });
          }
  
          res.status(201).json({
          mensagem: 'coordenador cadastrado com sucesso.',
          id_coordenador: resultado.insertId
          });
      }); 
    })
  }

  function AtualizarCoordenador(req, res) {
    const { id_coordenador, matricula, nome, email, telefone} = req.body;

    if (!id_coordenador) {
      return res.status(400).json({ erro: 'ID obrigatório não preenchido.' });
    }

    let campos = [];
    let valores = [];

    if (nome) {
      campos.push("nome = ?");
      valores.push(nome);
    }
    if (email) {
      campos.push("email = ?");
      valores.push(email);
    }
    if (telefone) {
      campos.push("telefone = ?");
      valores.push(telefone);
    }
    if (matricula) {
      campos.push("matricula = ?");
      valores.push(matricula);
    }

    {
      executarUpdate();
    }

    function executarUpdate() {
      if (campos.length === 0) {
        return res.status(400).json({ erro: 'Nenhum campo para atualizar.' });
      }

      const sql = `UPDATE coordenador SET ${campos.join(", ")} WHERE id_coordenador = ?`;
      valores.push(id_coordenador);

      conexao.query(sql, valores, (err, resultado) => {
        if (err) {
          console.error("Erro ao atualizar coordenador:", err);
          return res.status(500).json({ erro: "Erro ao atualizar coordenador." });
        }

        if (resultado.affectedRows === 0) {
          return res.status(404).json({ erro: "Coordenador não encontrado." });
        }

        res.status(200).json({
          mensagem: "Coordenador atualizado com sucesso.",
          id_coordenador,
        });
      });
    }
  }


  module.exports = {GetAllCoordenadores, InserirCoordenador, AtualizarCoordenador}