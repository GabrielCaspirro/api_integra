const conexao = require('../db/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const segredo = process.env.JWT_SECRET || 'segredo_super_secreto';

function Login(req, res) {
    const { tipo, email, senha } = req.body;

    if (!tipo) {
        return res.status(400).json({ erro: 'Campo tipo é obrigatório.' });
    }

    const tabelasValidas = ['administrador', 'palestrante', 'instituicao', 'empresa', 'aluno', 'coordenador'];

    if (!tabelasValidas.includes(tipo)) {
        return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
    }

    const campoId = {
        administrador: 'id_administrador',
        palestrante: 'id',
        instituicao: 'id',
        empresa: 'id_empresa',
        aluno: 'id_aluno',
        coordenador: 'id_coordenador'
    }[tipo];

    const sql = `SELECT * FROM ${tipo} WHERE email = ?`;

    conexao.query(sql, [email], async (err, resultado) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: 'Erro ao buscar usuário.' });
        }

        if (resultado.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        const usuario = resultado[0];

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Senha incorreta.' });
        }

        // Cria o token
        const token = jwt.sign(
            {
                id: usuario[campoId],
                tipo: tipo,
                email: usuario.email
            },
            segredo,
            { expiresIn: '2h' }
        );

        return res.json({ mensagem: 'Login realizado com sucesso!', token });
    });
}

function Perfil(req, res) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ erro: "Token não fornecido." });
        }

        const [, token] = authHeader.split(" ");
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const { id, tipo } = decoded;

        // Mapeando o campo do ID
        const campoId = {
            administrador: "id_administrador",
            palestrante: "id",
            instituicao: "id",
            empresa: "id_empresa",
            aluno: "id_aluno",
            coordenador: "id_coordenador"
        }[tipo];

        // Mapeando o campo da logo, se existir
        const campoLogo = {
            administrador: null,
            palestrante: "logo",
            instituicao: "logo",
            empresa: "logo",
            aluno: "foto",
            coordenador: null
        }[tipo];

        // Monta o SELECT dinamicamente
        const selectCampos = [campoId, "email", "nome"];
        if (campoLogo) selectCampos.push(campoLogo);

        const sql = `SELECT ${selectCampos.join(", ")} FROM ${tipo} WHERE ${campoId} = ?`;

        conexao.query(sql, [id], (err, resultado) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ erro: "Erro ao buscar perfil." });
            }

            if (resultado.length === 0) {
                return res.status(404).json({ erro: "Usuário não encontrado." });
            }

            const usuario = resultado[0];

            // Monta o objeto de retorno
            const retorno = {
                id: usuario[campoId],
                tipo,
                email: usuario.email,
                nome: usuario.nome || "Usuário"
            };

            if (campoLogo) retorno.logo = usuario[campoLogo];

            res.json(retorno);
        });
    } catch (err) {
        return res.status(401).json({ erro: "Token inválido." });
    }
}

module.exports = { Login, Perfil };
