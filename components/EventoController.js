const conexao = require('../db/conexao');
const cepController = require("../components/CepController");

async function InserirEvento(req, res) {
  const { 
    nome, 
    descricao, 
    data, 
    opcoes_horarios, // lista de opções de horários
    valor,
    max_participantes, 
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
    !max_participantes || 
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
          (nome, descricao, data, opcoes_horarios, periodo_escolhido, valor, tipo, id_endereco, status, id_empresa, id_palestrante, max_participantes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pendente', ?, ?, ?)
        `;

        conexao.query(
          sqlEvento,
          [
            nome, 
            descricao, 
            data, 
            JSON.stringify(opcoes_horarios), // stringify só aqui
            null,
            valor, 
            tipo, 
            id_endereco, 
            id_empresa || null, 
            id_palestrante || null,
            max_participantes
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

function GetEventosAluno(req, res) {
  const { id_aluno } = req.query; // vamos identificar o aluno logado

  if (!id_aluno) {
    return res.status(400).json({ erro: "É necessário informar o id_aluno" });
  }

  // buscamos a instituição do aluno
  const sqlInstituicao = `
    SELECT id_instituicao FROM aluno WHERE id_aluno = ?
  `;

  conexao.query(sqlInstituicao, [id_aluno], (err, resultado) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar instituição do aluno" });
    }

    if (resultado.length === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    const id_instituicao = resultado[0].id_instituicao;

    // agora buscamos os eventos confirmados daquela instituição
    const sqlEventos = `
      SELECT e.*, c.nome AS nome_coordenador, i.nome AS nome_instituicao
      FROM evento e
      INNER JOIN evento_coordenador ec ON e.id = ec.id_evento
      INNER JOIN coordenador c ON ec.id_coordenador = c.id_coordenador
      INNER JOIN coordenador_instituicao ci ON c.id_coordenador = ci.id_coordenador
      INNER JOIN instituicao i ON ci.id_instituicao = i.id
      WHERE e.periodo_escolhido IS NOT NULL
        AND ci.id_instituicao = ?
      ORDER BY e.data ASC
    `;

    conexao.query(sqlEventos, [id_instituicao], (err, eventos) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro ao buscar eventos" });
      }

      eventos.forEach(evento => {
        try {
          evento.opcoes_horarios = JSON.parse(evento.opcoes_horarios);
        } catch (e) {
          evento.opcoes_horarios = [];
        }
      });

      res.status(200).json(eventos);
    });
  });
}

function GetEventosAceitosCoordenador(req, res) {
  const { id_coordenador } = req.params;

  if (!id_coordenador) {
    return res.status(400).json({ erro: "ID do coordenador não fornecido." });
  }

  const sql = `
    SELECT 
      e.*, 
      ec.status AS status_coordenador,
      ec.observacao,
      ec.horario_escolhido,
      ec.turmas
    FROM evento_coordenador ec
    INNER JOIN evento e ON ec.id_evento = e.id
    WHERE ec.id_coordenador = ? AND ec.status = 'Aceito';
  `;

  conexao.query(sql, [id_coordenador], (err, resultados) => {
    if (err) {
      console.error("Erro ao buscar eventos aceitos do coordenador:", err);
      return res.status(500).json({ erro: "Erro ao buscar eventos do coordenador." });
    }

    // Ajusta os nomes dos tipos de evento para exibição
    resultados.forEach(evento => {
      if (evento.tipo === "visita_tecnica") evento.tipo = "Visita Técnica";
      else if (evento.tipo === "palestra") evento.tipo = "Palestra";
    });

    res.status(200).json(resultados);
  });
}

async function VincularEventoEmpresaCoordenador(req, res) {
  const { id_evento, id_coordenador, status, horario, observacao, turmas } = req.body;

  if (!id_evento || !id_coordenador || !turmas) {
    return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos.' });
  }

  // Inserir vínculo
  const insertSql = `
    INSERT INTO evento_coordenador 
      (id_evento, id_coordenador, status, observacao, horario_escolhido, turmas)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  conexao.query(insertSql, [id_evento, id_coordenador, status, observacao || null, horario || null, turmas], (err, resultado) => {
    if (err) {
      console.error('Erro ao vincular evento com empresa/coordenador:', err);
      return res.status(500).json({ erro: 'Erro ao vincular evento.' });
    }

    // Mapear status do vínculo para status do evento
    let statusEvento = null;
    if (status === "aceito") statusEvento = "Aprovada";
    else if (status === "recusado") statusEvento = "Cancelada";

    // Atualizar evento
    let updateFields = [];
    let updateParams = [];

    if (statusEvento) {
      updateFields.push('status = ?');
      updateParams.push(statusEvento);
    }

    if (horario) {
      updateFields.push('periodo_escolhido = ?');
      updateParams.push(horario);
    }

    if (updateFields.length > 0) {
      const updateSql = `UPDATE evento SET ${updateFields.join(', ')} WHERE id = ?`;
      updateParams.push(id_evento);

      conexao.query(updateSql, updateParams, (err2) => {
        if (err2) {
          console.error('Erro ao atualizar status do evento:', err2);
          return res.status(500).json({ erro: 'Erro ao atualizar status do evento.' });
        }

        return res.status(201).json({
          mensagem: 'Evento vinculado e atualizado com sucesso.',
          id_vinculo: resultado.insertId
        });
      });
    } else {
      return res.status(201).json({
        mensagem: 'Evento vinculado com sucesso (sem alteração de status).',
        id_vinculo: resultado.insertId
      });
    }
  });
}

function GetAlunosInstituicaoCoordenador(req, res) {
  const { id_coordenador } = req.params;

  if (!id_coordenador) {
    return res.status(400).json({ erro: "ID do coordenador não fornecido." });
  }

  const sql = `
    SELECT a.* 
    FROM aluno a
    INNER JOIN coordenador_instituicao ic ON ic.id_instituicao = a.id_instituicao
    WHERE ic.id_coordenador = ?;
  `;

  conexao.query(sql, [id_coordenador], (err, resultados) => {
    if (err) {
      console.error("Erro ao buscar alunos da instituição do coordenador:", err);
      return res.status(500).json({ erro: "Erro ao buscar alunos." });
    }

    res.status(200).json(resultados);
  });
}


module.exports = { GetEventos, GetEventosAluno, InserirEvento, VincularEventoEmpresaCoordenador, GetEventosAceitosCoordenador, GetAlunosInstituicaoCoordenador }