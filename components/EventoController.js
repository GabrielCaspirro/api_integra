const conexao = require('../db/conexao');
const cepController = require("../components/CepController");

async function InserirEvento(req, res) {
    const { nome, descricao, data, horario_inicio, horario_final, valor, tipo, cep } = req.body;

    if (!nome || !descricao || !data || !horario_inicio || !horario_final || !valor || !tipo || !cep) {
        return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos.' });
    }

    try {
        const cepInfo = await cepController.procurarCep(cep);
        const logradouro = cepInfo['logradouro'];
        const localidade = cepInfo['localidade'];
        const bairro = cepInfo['bairro'];
        const estado = cepInfo['uf'];
        const complemento = cepInfo['complemento'];

        conexao.query(
        'INSERT INTO endereco (rua, bairro, cidade, estado, cep, complemento) VALUES (?, ?, ?, ?, ?, ?)',
        [logradouro, bairro, localidade, estado, cep, complemento],
        (err, resultadoEndereco) => {
            if (err) {
            console.error('Erro ao inserir endereço:', err);
            return res.status(500).json({ erro: 'Erro ao cadastrar endereço.' });
            }

            const id_endereco = resultadoEndereco.insertId;

            const sqlEvento = `
            INSERT INTO evento (nome, descricao, data, horario_inicio, horario_saida, valor, tipo, id_endereco, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pendente')
            `;

            conexao.query(
                sqlEvento,
                [nome, descricao, data, horario_inicio, horario_final, valor, tipo, id_endereco],
                (err2, resultadoEvento) => {
                    if (err2) {
                    console.error('Erro ao inserir evento:', err2);
                    return res.status(500).json({ erro: 'Erro ao cadastrar evento.' });
                    }

                    res.status(201).json({
                    mensagem: 'Evento cadastrado com sucesso.',
                    id_evento: resultadoEvento.insertId
                    });
                }
            );
        }
    );
    } catch (error) {
        console.error('Erro ao processar CEP:', error);
        return res.status(500).json({ erro: 'Erro ao buscar informações do CEP.' });
    }
}  

function GetEventos(req, res){
  let { mes, tipo, status } = req.query;

  let sql = "SELECT * FROM evento WHERE 1=1"; 
  let params = [];

  if (mes) {
    sql += " AND MONTH(data) = ?";
    params.push(mes);
  }

  if (tipo) {
    sql += " AND tipo = ?";
    params.push(tipo);
  }

  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }

  conexao.query(sql, params, (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar eventos" });
    }

    res.status(200).json(resultados);
  });
}

module.exports = { GetEventos, InserirEvento }