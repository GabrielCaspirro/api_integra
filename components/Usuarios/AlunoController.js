const conexao = require('../../db/conexao');
const bcrypt = require('bcrypt');
const emailController = require('../EmailController');

function GetAllEstudantes(res){
    conexao.query('SELECT * FROM aluno', (err, resultados) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar alunos' });
    }

    const alunosSemSenha = resultados.map(aluno => {
      delete aluno.senha;
      return aluno;
    });

    res.json(alunosSemSenha);
  });
}

function InserirEstudante(req, res) {
    const { rm, nome, curso, modulo_ano, email, telefone } = req.body;
  
    if (!rm || !nome || !email) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
    }
  
    let senha = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();
    console.log(senha);
    const sql = `
      INSERT INTO aluno (nome, email, senha, telefone, data_cadastro, curso, rm, modulo_ano)
      VALUES (?, ?, ?, ?, current_timestamp(), ?, ?, ?)
    `;
  
    bcrypt.hash(senha, 10, (err, hash) => {
      if (err) return res.status(500).json({ erro: 'Erro ao criptografar senha.' });
  
      conexao.query(sql, [nome, email, hash, telefone, curso, rm, modulo_ano], (err, resultado) => {
          if (err) {
            console.error('Erro ao inserir estudante:', err);
            return res.status(500).json({ erro: 'Erro ao inserir estudante.' });
          }
  
          try{
            emailController.EnviarEmail(email, senha);
            console.log(senha);
          }catch(e){
            return res.status(500).json({ erro: 'Erro ao enviar email.' });
          }
          
          res.status(201).json({
            mensagem: 'estudante cadastrado com sucesso.',
            id_aluno: resultado.insertId
          });
      }); 
    });
  }

  function AtualizarEstudante(req, res) {
    const { id_aluno, rm, nome, curso, modulo_ano, email, telefone} = req.body;

    if (!id_aluno) {
      return res.status(400).json({ erro: 'ID obrigatório não preenchido.' });
    }

    // Guarda os campos que foram enviados
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
    if (curso) {
      campos.push("curso = ?");
      valores.push(curso);
    }
    if (rm) {
      campos.push("rm = ?");
      valores.push(rm);
    }
    if (modulo_ano) {
      campos.push("modulo_ano = ?");
      valores.push(modulo_ano);
    }

    {
      executarUpdate();
    }

    function executarUpdate() {
      if (campos.length === 0) {
        return res.status(400).json({ erro: 'Nenhum campo para atualizar.' });
      }

      const sql = `UPDATE aluno SET ${campos.join(", ")} WHERE id_aluno = ?`;
      valores.push(id_aluno);

      conexao.query(sql, valores, (err, resultado) => {
        if (err) {
          console.error("Erro ao atualizar estudante:", err);
          return res.status(500).json({ erro: "Erro ao atualizar estudante." });
        }

        if (resultado.affectedRows === 0) {
          return res.status(404).json({ erro: "Estudante não encontrado." });
        }

        res.status(200).json({
          mensagem: "Estudante atualizado com sucesso.",
          id_aluno,
        });
      });
    }
  }


  module.exports = {InserirEstudante, GetAllEstudantes, AtualizarEstudante};