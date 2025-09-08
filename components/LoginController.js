const conexao = require('../db/conexao');
const bcrypt = require('bcrypt');

function Login(req, res) {
    const {tipo, email, senha } = req.body;

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

        req.session.usuarioLogado = {
            id: usuario[campoId],
            tipo: tipo,
            email: usuario.email
        };

        return res.json({ mensagem: 'Login realizado com sucesso!', usuario: req.session.usuarioLogado });
    });
}

module.exports = { Login };
