const conexao = require('../../db/conexao');
const bcrypt = require('bcrypt');
const emailController = require('../EmailController');
const cepController = require("../CepController");
const path = require("path");

function GetAllEmpresas(res){
    conexao.query('SELECT * FROM empresa', (err, resultados) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar empresas' });
    }
    
    const empresaSemSenha = resultados.map(empresa => {
      delete empresa.senha;
      return empresa;
    });

    res.json(empresaSemSenha);
  });
}

function InserirEmpresa(req, res) {
  const { nome, email, telefone, setor, cnpj, cep } = req.body;
  const logoFile = req.file; // multer coloca o arquivo aqui

  if (!nome || !email || !cnpj || !cep) {
    return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos' });
  }

  let senha = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();

  bcrypt.hash(senha, 10, async (err, hash) => {
    if (err) return res.status(500).json({ erro: 'Erro ao criptografar senha.' });

    const cepInfo = await cepController.procurarCep(cep);
    const logradouro = cepInfo['logradouro'];
    const localidade = cepInfo['localidade'];
    const bairro = cepInfo['bairro'];
    const estado = cepInfo['uf'];
    const complemento = cepInfo['complemento'];

    // Primeiro insere o endereço
    conexao.query(
      'INSERT INTO endereco (rua, bairro, cidade, estado, cep, complemento) VALUES (?, ?, ?, ?, ?, ?)',
      [logradouro, bairro, localidade, estado, cep, complemento],
      (err, resultadoEndereco) => {
        if (err) return res.status(500).json({ erro: 'Erro ao cadastrar endereço.' });

        const id_endereco = resultadoEndereco.insertId;
        const logoPath = logoFile ? `uploads/empresas/${logoFile.filename}` : null;

        const sqlEmpresa = `
          INSERT INTO empresa (nome, email, telefone, data_cadastro, setor, cnpj, senha, id_endereco, logo)
          VALUES (?, ?, ?, current_timestamp(), ?, ?, ?, ?, ?)
        `;

        conexao.query(
          sqlEmpresa,
          [nome, email, telefone, setor, cnpj, hash, id_endereco, logoPath],
          (err, resultadoEmpresa) => {
            if (err) return res.status(500).json({ erro: 'Erro ao cadastrar empresa.' });

            try {
              emailController.EnviarEmail(email, senha);
            } catch (e) {
              console.error('Erro ao enviar email:', e);
            }

            res.status(201).json({
              mensagem: 'Empresa cadastrada com sucesso.',
              id_empresa: resultadoEmpresa.insertId,
            });
          }
        );
      }
    );
  });
}

function AtualizarEmpresa(req, res) {
  const { id_empresa, setor, cnpj, nome, email, telefone} = req.body;

  if (!id_empresa) {
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
  if (setor) {
    campos.push("setor = ?");
    valores.push(setor);
  }
  if (cnpj) {
    campos.push("cnpj = ?");
    valores.push(cnpj);
  }

  {
    executarUpdate();
  }

  function executarUpdate() {
    if (campos.length === 0) {
      return res.status(400).json({ erro: 'Nenhum campo para atualizar.' });
    }

    const sql = `UPDATE empresa SET ${campos.join(", ")} WHERE id_empresa = ?
    
    `;
    valores.push(id_empresa);

    conexao.query(sql, valores, (err, resultado) => {
      if (err) {
        console.error("Erro ao atualizar empresa:", err);
        return res.status(500).json({ erro: "Erro ao atualizar empresa." });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ erro: "empresa não encontrada." });
      }

      res.status(200).json({
        mensagem: "empresa atualizada com sucesso.",
        id_empresa,
      });
    });
  }
}

async function ResponderSolicitacao(req, res) {
  const { id_solicitacao, aceitar } = req.body;

  if (!id_solicitacao || aceitar === undefined) {
    return res.status(400).json({ erro: "id_solicitacao e aceitar (true/false) são obrigatórios." });
  }

  const sqlBusca = `
    SELECT s.id, s.status, s.id_empresa, s.id_palestrante, p.id_empresa AS empresa_atual
    FROM solicitacao_palestrante s
    JOIN palestrante p ON p.id = s.id_palestrante
    WHERE s.id = ?
  `;

  conexao.query(sqlBusca, [id_solicitacao], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar solicitação:", err);
      return res.status(500).json({ erro: "Erro ao buscar solicitação." });
    }

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Solicitação não encontrada." });
    }

    const solicitacao = rows[0];

    if (solicitacao.status !== "Pendente") {
      return res.status(400).json({ erro: `Solicitação já possui os status de: ${solicitacao.status.toLowerCase()}` });
    }

    if (aceitar && solicitacao.empresa_atual && solicitacao.empresa_atual !== 0) {
      return res.status(400).json({ erro: "Palestrante já está vinculado a uma empresa." });
    }

    const novoStatus = aceitar ? "Aceito" : "Recusado";

    const sqlAtualiza = `
      UPDATE solicitacao_palestrante
      SET status = ?
      WHERE id = ?
    `;

    conexao.query(sqlAtualiza, [novoStatus, id_solicitacao], (err2, resultado) => {
      if (err2) {
        console.error("Erro ao atualizar solicitação:", err2);
        return res.status(500).json({ erro: "Erro ao atualizar solicitação." });
      }

      if (aceitar) {
        const sqlVinculo = `
          UPDATE palestrante
          SET id_empresa = ?
          WHERE id = ?
        `;

        conexao.query(sqlVinculo, [solicitacao.id_empresa, solicitacao.id_palestrante], (err3) => {
          if (err3) {
            console.error("Erro ao vincular palestrante:", err3);
            return res.status(500).json({ erro: "Erro ao vincular palestrante à empresa." });
          }

          return res.json({ mensagem: "Solicitação aceita e palestrante vinculado à empresa." });
        });
      } else {
        return res.json({ mensagem: "Solicitação recusada." });
      }
    });
  });
}

function GetSolicitacoesEmpresa(req, res) {
  const { id_empresa } = req.params; // pega da URL (ex: /solicitacoes/empresa/5)

  if (!id_empresa) {
    return res.status(400).json({ erro: 'O ID da empresa é obrigatório.' });
  }

  const query = `
    SELECT sp.id, sp.status, sp.data_solicitacao, 
           p.id, p.nome as nome_palestrante, p.email as email_palestrante
    FROM solicitacao_palestrante sp
    JOIN palestrante p ON sp.id_palestrante = p.id
    WHERE sp.id_empresa = ?
    ORDER BY sp.data_solicitacao DESC
  `;

  conexao.query(query, [id_empresa], (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar solicitações.' });
    }

    return res.status(200).json(resultados);
  });
}
  
module.exports = {GetAllEmpresas, InserirEmpresa, AtualizarEmpresa, ResponderSolicitacao, GetSolicitacoesEmpresa}