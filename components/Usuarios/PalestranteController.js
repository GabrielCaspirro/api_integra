const conexao = require('../../db/conexao');
const bcrypt = require('bcrypt');
const emailController = require('../EmailController');

function GetAllPalestrantes(res){
    conexao.query('SELECT * FROM palestrante', (err, resultados) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar instituições' });
    }

    const palestranteSemSenha = resultados.map(palestrante => {
      delete palestrante.senha;
      return palestrante;
    });

    res.json(palestranteSemSenha);
  });
}

function InserirPalestrante(req, res) {
    const { nome, email, especialidade, telefone, bio, id_empresa} = req.body;

    if (!nome || !email || !telefone) {
        return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos' });
    }

    let senha = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();

    bcrypt.hash(senha, 10, async (err, hash) => {
        if (err) return res.status(500).json({ erro: 'Erro ao criptografar senha.' });

        const sqlPalestrante = `
            INSERT INTO palestrante (nome, especialidade, email, senha, telefone, bio, id_empresa)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        conexao.query(sqlPalestrante, [nome, especialidade, email, hash, telefone, bio, id_empresa], (err, resultadoPalestrante) => {
            if (err) {
                console.error('Erro ao inserir palestrante:', err);
                return res.status(500).json({ erro: 'Erro ao cadastrar palestrante.' });
            }

            try {
                emailController.EnviarEmail(email, senha);
            } catch (e) {
                console.error('Erro ao enviar email:', e);
            }

            res.status(201).json({
                mensagem: 'Palestrante cadastrado com sucesso.',
                id_palestrante: resultadoPalestrante.insertId
            });
        });
    });
}

function AtualizarPalestrante(req, res) {
    const { id_palestrante, nome, email, telefone, bio, especialidade, id_empresa } = req.body;

    if (!id_palestrante) {
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
    if (especialidade) {
        campos.push("especialidade = ?");
        valores.push(especialidade);
    }
    if (bio) {
        campos.push("bio = ?");
        valores.push(bio);
    }
    if (id_empresa) {
        campos.push("id_empresa = ?");
        valores.push(id_empresa);
    }

    executarUpdate();

    function executarUpdate() {
        if (campos.length === 0) {
        return res.status(400).json({ erro: "Nenhum campo para atualizar." });
        }

        const sql = `UPDATE palestrante SET ${campos.join(", ")} WHERE id = ?`;
        valores.push(id_palestrante);

        conexao.query(sql, valores, (err, resultado) => {
        if (err) {
            console.error("Erro ao atualizar palestrante:", err);
            return res.status(500).json({ erro: "Erro ao atualizar palestrante." });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Palestrante não encontrada." });
        }

        res.status(200).json({
            mensagem: "Palestrante atualizada com sucesso.",
            id_palestrante,
        });
        });
    }
}

function SolicitarVinculoPalestrante(req, res) {
    const { id_palestrante, id_empresa } = req.body;

    if (!id_palestrante || !id_empresa) {
        return res.status(400).json({ erro: 'Informe id_palestrante e id_empresa' });
    }

    const checkQuery = `
        SELECT * FROM solicitacao_palestrante
        WHERE id_palestrante = ? AND id_empresa = ? AND status = 'pendente'
    `;

    conexao.query(checkQuery, [id_palestrante, id_empresa], (err, results) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao verificar solicitações' });
        }

        if (results.length > 0) {
            return res.status(400).json({ erro: 'Já existe uma solicitação pendente para esta empresa' });
        }

        const checkAccepted = `
            SELECT * FROM solicitacao_palestrante
            WHERE id_palestrante = ? AND id_empresa = ? AND status = 'aceito'
        `;

        conexao.query(checkAccepted, [id_palestrante, id_empresa], (err2, results2) => {
            if (err2) {
                return res.status(500).json({ erro: 'Erro ao verificar vínculo existente' });
            }

            if (results2.length > 0) {
                return res.status(400).json({ erro: 'Este palestrante já está vinculado a esta empresa' });
            }

            const insertQuery = `
                INSERT INTO solicitacao_palestrante (id_palestrante, id_empresa, status)
                VALUES (?, ?, 'pendente')
            `;

            conexao.query(insertQuery, [id_palestrante, id_empresa], (err3, result) => {
                if (err3) {
                    return res.status(500).json({ erro: 'Erro ao criar solicitação' });
                }

                return res.status(201).json({ 
                    mensagem: 'Solicitação enviada com sucesso',
                    id_solicitacao: result.insertId
                });
            });
        });
    });
}


module.exports = {GetAllPalestrantes, InserirPalestrante, AtualizarPalestrante, SolicitarVinculoPalestrante};