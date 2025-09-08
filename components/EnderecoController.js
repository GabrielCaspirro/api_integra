const conexao = require('../db/conexao');

function GetAllEnderecos(res){
    conexao.query('SELECT * FROM endereco', (err, resultados) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar endereços' });
    }

    res.status(200).json(resultados);
  });
}

function AtualizarEndereco(req, res) {
    const { id, tipo, rua, numero, bairro, cidade, estado, cep, complemento } = req.body;

    if (!id || !tipo) {
        return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos.' });
    }

    let campos = [];
    let valores = [];

    if (rua) campos.push("rua = ?"), valores.push(rua);
    if (numero) campos.push("numero = ?"), valores.push(numero);
    if (bairro) campos.push("bairro = ?"), valores.push(bairro);
    if (cidade) campos.push("cidade = ?"), valores.push(cidade);
    if (estado) campos.push("estado = ?"), valores.push(estado);
    if (cep) campos.push("cep = ?"), valores.push(cep);
    if (complemento) campos.push("complemento = ?"), valores.push(complemento);

    if (campos.length === 0) {
        return res.status(400).json({ erro: 'Nenhum campo para atualizar.' });
    }

    let tabela = '';
    switch (tipo.toLowerCase()) {
        case 'empresa':
            tabela = 'empresa';
            break;
        case 'instituicao':
            tabela = 'instituicao';
            break;
        case 'evento':
            tabela = 'evento';
            break;
        default:
            return res.status(400).json({ erro: 'Tipo inválido.' });
    }

    const sqlBuscarEndereco = `SELECT id_endereco FROM ${tabela} WHERE id_${tabela} = ?`;
    conexao.query(sqlBuscarEndereco, [id], (err, resultado) => {
        if (err) {
            console.error("Erro ao buscar endereço:", err);
            return res.status(500).json({ erro: 'Erro ao buscar endereço.' });
        }

        if (resultado.length === 0) {
            return res.status(404).json({ erro: `${tipo} não encontrada.` });
        }

        const id_endereco = resultado[0].id_endereco;

        const sqlAtualizarEndereco = `UPDATE endereco SET ${campos.join(', ')} WHERE id_endereco = ?`;
        valores.push(id_endereco);

        conexao.query(sqlAtualizarEndereco, valores, (err, resultadoUpdate) => {
            if (err) {
                console.error("Erro ao atualizar endereço:", err);
                return res.status(500).json({ erro: 'Erro ao atualizar endereço.' });
            }

            res.status(200).json({
                mensagem: "Endereço atualizado com sucesso.",
                id_endereco
            });
        });
    });
}

function DeleteEndereco(req, res){
    const { id_endereco } = req.body;

    if (!id_endereco) {
        return res.status(400).json({ erro: 'ID obrigatório não preenchido.' });
    }

    conexao.query('DELETE FROM endereco WHERE id_endereco = ?', [id_endereco], (err, resultado) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro ao deletar endereço.' });
        }
    
        if (resultado.affectedRows === 0) {
        return res.status(404).json({ erro: 'Endereço não encontrado.' });
        }
    
        res.json({ mensagem: `Endereço deletado com sucesso.` });
  });
}

module.exports = { GetAllEnderecos, AtualizarEndereco, DeleteEndereco };
