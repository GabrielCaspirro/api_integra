const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');


const UsuarioController = require('../components/Usuarios/UsuarioController');
const AlunoController = require('../components/Usuarios/AlunoController');
const EmpresaController = require('../components/Usuarios/EmpresaController');
const CoordenadorController = require('../components/Usuarios/CoordenadorController');
const InstituicaoController = require('../components/Usuarios/InstituicaoController');
const PalestranteController = require('../components/Usuarios/PalestranteController');
const EnderecoController = require('../components/EnderecoController');
const EventoController = require('../components/EventoController');
const LoginController = require('../components/LoginController');

router.use(express.json());
router.use(express.urlencoded({ extended: true })); 

router.get('/api', (req, res) => {
    res.json({mensagem: "Api funcionando!"});
}); 

//ALUNOS
router.get('/estudantes', (req, res) => {
    AlunoController.GetAllEstudantes(res);
});

router.post('/inserir-estudante', (req, res) => {
    AlunoController.InserirEstudante(req, res);
});

router.put('/atualizar-estudante', (req, res) => {
    AlunoController.AtualizarEstudante(req, res);
});

//COORDENADORES
router.get('/coordenadores', (req, res) => {
    CoordenadorController.GetAllCoordenadores(res);
});

router.post('/inserir-coordenador', (req, res) => {
    CoordenadorController.InserirCoordenador(req, res);
});

router.put('/atualizar-coordenador', (req, res) => {
    CoordenadorController.AtualizarCoordenador(req, res);
});

//EMPRESAS
router.get('/empresas', (req, res) => {
    EmpresaController.GetAllEmpresas(res);
});

router.get('/solicitacoes/empresa/:id_empresa', EmpresaController.GetSolicitacoesEmpresa);

router.post(
  '/inserir-empresa',
  upload.single('logo'), // "logo" é o name do input no formulário
  EmpresaController.InserirEmpresa
);

router.post('/responder-solicitacao', (req, res) => {
    EmpresaController.ResponderSolicitacao(req, res);
});

router.put('/atualizar-empresa', (req, res) => {
    EmpresaController.AtualizarEmpresa(req, res);
});

//INSTITUIÇÕES
router.get('/instituicoes', (req, res) => {
    InstituicaoController.GetAllInstituicoes(res);
});

router.post('/inserir-instituicao', (req, res) => {
    InstituicaoController.InserirInstituicao(req, res);
});

router.put('/atualizar-instituicao', (req, res) => {
    InstituicaoController.AtualizarInstituicao(req, res);
});

//PALESTRANTE
router.get('/palestrantes', (req, res) => {
    PalestranteController.GetAllPalestrantes(res);
});

router.post('/inserir-palestrante', (req, res) => {
    PalestranteController.InserirPalestrante(req, res);
});

router.post('/solicitar-vinculo', (req, res) => {
    PalestranteController.SolicitarVinculoPalestrante(req, res);
});

router.put('/atualizar-palestrante', (req, res) => {
    PalestranteController.AtualizarPalestrante(req, res);
});

//ENDEREÇO
router.get('/enderecos', (req, res) => {
    EnderecoController.GetAllEnderecos(res);
});

router.put('/atualizar-endereco', (req, res) => {
    EnderecoController.AtualizarEndereco(req, res);
});

router.delete('/delete-endereco', (req, res) => {
    EnderecoController.DeleteEndereco(req, res);
});

//USUARIOS

router.get('/login', (req, res) => {
    UsuarioController.UsuarioLogado(req, res);
});

router.get('/logout', (req, res) => {
    UsuarioController.Logout(req, res);
});

router.delete('/delete-usuario', (req, res) => {
    UsuarioController.DeleteUsuario(req, res);
});

//LOGIN 
router.post('/login', (req, res) => {
    LoginController.Login(req, res);
});

//EVENTOS
router.get('/eventos', (req, res) => {
    EventoController.GetEventos(req, res);
})

router.post('/inserir-evento', (req, res) => {
    EventoController.InserirEvento(req, res);
})

module.exports = router;
