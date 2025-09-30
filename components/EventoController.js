const conexao = require('../db/conexao');
const cepController = require("../components/CepController");

async function InserirEvento(req, res) {
  const { 
    nome, 
    descricao, 
    data, 
    opcoes_horarios, // lista de opções de horários
    valor, 
    tipo, 
    cep, 
    id_empresa, 
    id_palestrante 
  } = req.body;

  if (
    !nome || 
    !descricao || 
    !data || 
    !opcoes_horarios || 
    !valor || 
    !tipo || 
    !cep || 
    (!id_empresa && !id_palestrante)
  ) {
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
      `INSERT INTO endereco (rua, bairro, cidade, estado, cep, complemento) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [logradouro, bairro, localidade, estado, cep, complemento],
      (err, resultadoEndereco) => {
        if (err) {
          console.error('Erro ao inserir endereço:', err);
          return res.status(500).json({ erro: 'Erro ao cadastrar endereço.' });
        }

        const id_endereco = resultadoEndereco.insertId;

        const sqlEvento = `
          INSERT INTO evento 
          (nome, descricao, data, opcoes_horarios, periodo_escolhido, valor, tipo, id_endereco, status, id_empresa, id_palestrante)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pendente', ?, ?)
        `;

        conexao.query(
          sqlEvento,
          [
            nome, 
            descricao, 
            data, 
            JSON.stringify(opcoes_horarios), // salva como JSON
            valor, 
            tipo, 
            id_endereco, 
            id_empresa || null, 
            id_palestrante || null
          ],
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


function GetEventos(req, res) {
  const { mes, tipo, status, confirmado, id_empresa } = req.query; // "confirmado" pode ser true/false

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

  if (id_empresa) {
    sql += " AND id_empresa = ?";
    params.push(id_empresa);
  }

  if (confirmado === "true") {
    sql += " AND periodo_escolhido IS NOT NULL";
  } else if (confirmado === "false") {
    sql += " AND periodo_escolhido IS NULL";
  }

  conexao.query(sql, params, (err, resultados) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar eventos" });
    }

    // parse das opções de horários para JSON (já que foi salvo como string)
    resultados.forEach(evento => {
      try {
        evento.opcoes_horarios = JSON.parse(evento.opcoes_horarios);
      } catch (e) {
        evento.opcoes_horarios = [];
      }
    });

    res.status(200).json(resultados);
  });
}

async function VincularEventoEmpresaCoordenador(req, res) {
  const { id_evento, id_coordenador, status, horario, observacao } = req.body;

  if (!id_evento || !id_coordenador) {
    return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos.' });
  }

  const sql = `
    INSERT INTO evento_empresa_coordenador (id_evento, id_coordenador, status, observacao, horario_escolhido)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  conexao.query(sql, [id_evento, id_coordenador, status, observacao, horario], (err, resultado) => {
    if (err) {
      console.error('Erro ao vincular evento com empresa/coordenador:', err);
      return res.status(500).json({ erro: 'Erro ao vincular evento.' });
    }

    return res.status(201).json({
      mensagem: 'Evento vinculado à empresa e coordenador com sucesso.',
      id_vinculo: resultado.insertId
    });
  });
}


module.exports = { GetEventos, InserirEvento, VincularEventoEmpresaCoordenador }