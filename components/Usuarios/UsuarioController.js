const conexao = require('../../db/conexao');

function DeleteUsuario(req, res) {
  const { id, tipo } = req.body;

  if (!id || !tipo) {
    return res.status(400).json({ erro: 'ID e tipo são obrigatórios.' });
  }

  const tabelasValidas = ['empresa', 'aluno', 'coordenador', "instituicao", "palestrante"];

  if (!tabelasValidas.includes(tipo)) {
    return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
  }

  const campoId = {
    empresa: 'id_empresa',
    aluno: 'id_aluno',
    coordenador: 'id_coordenador',
    instituicao: 'id',
    palestrante: 'id'
  }[tipo];

  const sql = `DELETE FROM ${tipo} WHERE ${campoId} = ?`;

  conexao.query(sql, [id], (err, resultado) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao deletar usuário.' });
    }

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    res.json({ mensagem: `${tipo} deletado com sucesso.` });
  });
}

function UsuarioLogado(req, res){
  if (!req.session.usuarioLogado) {
    return res.status(401).json({ erro: 'Usuário não está logado.' });
  }

  res.json({ usuario: req.session.usuarioLogado });
}

function Logout(req, res) {
  if (req.session.usuarioLogado) {
      req.session.destroy(err => {
          if (err) {
              console.error(err);
              return res.status(500).json({ erro: 'Erro ao encerrar a sessão.' });
          }
          res.clearCookie('connect.sid'); // limpa o cookie de sessão
          return res.json({ mensagem: 'Logout realizado com sucesso!' });
      });
  } else {
      return res.status(400).json({ erro: 'Nenhum usuário está logado.' });
  }
}

module.exports = {DeleteUsuario, UsuarioLogado, Logout};