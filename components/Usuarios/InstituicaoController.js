const conexao = require('../../db/conexao');
const bcrypt = require('bcrypt');
const emailController = require('../EmailController');
const cepController = require("../CepController");

function GetAllInstituicoes(res){
    conexao.query('SELECT * FROM instituicao', (err, resultados) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar instituições' });
    }

    const instituicaoSemSenha = resultados.map(instituicao => {
      delete instituicao.senha;
      return instituicao;
    });

    res.json(instituicaoSemSenha);
  });
}

function InserirInstituicao(req, res) {
    const { nome, email, tipo, codigo, telefone, cep } = req.body;

    if (!nome || !email || !telefone|| !cep || !codigo || !tipo) {
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

        console.log(cepInfo);
        
        // Primeiro insere o endereço
        conexao.query('INSERT INTO endereco (rua, bairro, cidade, estado, cep, complemento) VALUES (?, ?, ?, ?, ?, ?)', [logradouro, bairro, localidade, estado, cep, complemento], (err, resultadoEndereco) => {
            if (err) {
                console.error('Erro ao inserir endereço:', err);
                return res.status(500).json({ erro: 'Erro ao cadastrar endereço.' });
            }

            const id_endereco = resultadoEndereco.insertId;

            const sqlInstituicao = `
                INSERT INTO instituicao (nome, id_endereco, tipo, cod_instituicao, senha, email, telefone)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            conexao.query(sqlInstituicao, [nome, id_endereco, tipo, codigo, hash, email, telefone], (err, resultadoInstituicao) => {
                if (err) {
                    console.error('Erro ao inserir instituição:', err);
                    return res.status(500).json({ erro: 'Erro ao cadastrar instituição.' });
                }

                try {
                    emailController.EnviarEmail(email, senha);
                } catch (e) {
                    console.error('Erro ao enviar email:', e);
                }

                res.status(201).json({
                    mensagem: 'Instituição cadastrada com sucesso.',
                    id_empresa: resultadoInstituicao.insertId
                });
            });
        });
    });
}

function AtualizarInstituicao(req, res) {
    const { id_instituicao, nome, email, telefone, tipo, codigo } = req.body;

    if (!id_instituicao) {
        return res.status(400).json({ erro: "ID obrigatório não preenchido." });
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
    if (tipo) {
        campos.push("tipo = ?");
        valores.push(tipo);
    }
    if (codigo) {
        campos.push("cod_instituicao = ?");
        valores.push(codigo);
    }

    executarUpdate();

    function executarUpdate() {
        if (campos.length === 0) {
        return res.status(400).json({ erro: "Nenhum campo para atualizar." });
        }

        const sql = `UPDATE instituicao SET ${campos.join(", ")} WHERE id = ?`;
        valores.push(id_instituicao);

        conexao.query(sql, valores, (err, resultado) => {
        if (err) {
            console.error("Erro ao atualizar instituição:", err);
            return res.status(500).json({ erro: "Erro ao atualizar instituição." });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Instituição não encontrada." });
        }

        res.status(200).json({
            mensagem: "Instituição atualizada com sucesso.",
            id_instituicao,
        });
        });
    }
}
  

module.exports = {GetAllInstituicoes, InserirInstituicao, AtualizarInstituicao};