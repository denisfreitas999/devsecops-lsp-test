// src/routes/pacienteRoutes.js
const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const upload = require('../config/multerConfig');

/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: API para gerenciamento de pacientes e seus prontuários
 */

// --- Rota 1: POST /pacientes ---
/**
 * @swagger
 * /pacientes:
 *   post:
 *     summary: Cria um novo paciente e seu prontuário inicial
 *     tags: [Pacientes]
 *     description: Cria um registro para o paciente e seu primeiro prontuário médico de forma atômica. Contém violação de RNF-07-A.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_completo: { type: string, example: "Ana Lúcia" }
 *               cpf: { type: string, example: "11122233344" }
 *               email: { type: string, example: "ana.lucia@email.com" }
 *               telefone: { type: string, example: "11988776655" }
 *               prontuario:
 *                 type: object
 *                 properties:
 *                   plano_saude: { type: string, example: "Plano Rubi" }
 *                   historico_medico: { type: string, example: "Paciente com histórico de asma." }
 *     responses:
 *       201:
 *         description: Paciente e prontuário criados com sucesso.
 *       500:
 *         description: Erro interno no servidor.
 */
router.post('/', pacienteController.criarPacienteComProntuario);

// --- Rota 2: GET /pacientes/{id}/prontuario ---
/**
 * @swagger
 * /pacientes/{id}/prontuario:
 *   get:
 *     summary: Busca o prontuário médico de um paciente
 *     tags: [Pacientes]
 *     description: Demonstra as violacoes RNF-07-A (log de dados sensiveis) e RNF-07-B (uso de variavel com dado sensivel).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente.
 *     responses:
 *       200:
 *         description: Prontuário encontrado.
 *       404:
 *         description: Prontuário não encontrado.
 *       500:
 *         description: Erro interno no servidor.
 */
router.get('/:id/prontuario', pacienteController.buscarProntuario);

// --- Rota 3: POST /pacientes/{id}/verificar-convenio ---
/**
 * @swagger
 * /pacientes/{id}/verificar-convenio:
 *   post:
 *     summary: Simula a verificação de elegibilidade do paciente em um convênio
 *     tags: [Pacientes]
 *     description: Contém violação de RNF-08 ao simular uma chamada para uma API externa usando protocolo HTTP inseguro.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do paciente.
 *     responses:
 *       200:
 *         description: Verificação simulada com sucesso.
 *       404:
 *         description: Paciente não encontrado.
 *       500:
 *         description: Erro interno no servidor.
 */
router.post('/:id/verificar-convenio', pacienteController.verificarCreditoConvenio);

// --- Rota 4: POST /pacientes/{id}/compartilhar ---
/**
 * @swagger
 * /pacientes/{id}/compartilhar:
 *   post:
 *     summary: Simula o compartilhamento de dados do paciente com uma API parceira
 *     tags: [Pacientes]
 *     description: Contém violação de RNF-07-C ao enviar o objeto completo do paciente, com dados pessoais e sensíveis, no corpo de uma requisição de rede.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente a ser compartilhado.
 *     responses:
 *       200:
 *         description: Simulação de compartilhamento bem-sucedida.
 *       404:
 *         description: Paciente não encontrado.
 *       500:
 *         description: Erro interno no servidor.
 */
router.post('/:id/compartilhar', pacienteController.compartilharProntuario);

// --- Rota 5: POST /pacientes/{id}/upload-documento ---
/**
 * @swagger
 * /pacientes/{id}/upload-documento:
 *   post:
 *     summary: Realiza o upload de um documento para o paciente
 *     tags: [Pacientes]
 *     description: Contém violação de RNF-07-D ao simular a construção de um FormData com dados pessoais desnecessários.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *                 format: binary
 *                 description: O arquivo a ser enviado (ex- exame.pdf).
 *     responses:
 *       200:
 *         description: Upload bem-sucedido.
 *       404:
 *         description: Paciente não encontrado.
 */
router.post('/:id/upload-documento', upload.single('documento'), pacienteController.uploadDocumento);

// --- Rota 6: POST /pacientes/{id}/enviar-email ---
/**
 * @swagger
 * /pacientes/{id}/enviar-email:
 *   post:
 *     summary: Simula o envio de um e-mail de boas-vindas para o paciente
 *     tags: [Pacientes]
 *     description: Contém violação de RNF-07-E ao incluir dados pessoais (CPF) e sensíveis (plano de saúde) no corpo de um e-mail.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente.
 *     responses:
 *       200:
 *         description: Simulação de envio de e-mail bem-sucedida.
 *       404:
 *         description: Paciente não encontrado.
 *       500:
 *         description: Erro interno no servidor.
 */
router.post('/:id/enviar-email', pacienteController.enviarEmailBoasVindas);

// --- Rota 7: POST /pacientes/{id}/gerar-relatorio ---
/**
 * @swagger
 * /pacientes/{id}/gerar-relatorio:
 *   post:
 *     summary: Gera um relatório de diagnóstico do paciente em um arquivo .txt
 *     tags: [Pacientes]
 *     description: Contém violação de RNF-07-F ao salvar dados pessoais e sensíveis em um arquivo de texto local sem criptografia.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente.
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso.
 *       404:
 *         description: Paciente ou prontuário não encontrado.
 *       500:
 *         description: Erro interno no servidor.
 */
router.post('/:id/gerar-relatorio', pacienteController.gerarRelatorioTxt);

// --- Rota 8: GET /pacientes/{id}/auditar-acesso ---
/**
 * @swagger
 * /pacientes/{id}/auditar-acesso:
 *   get:
 *     summary: Simula a geração de um log de auditoria para o acesso ao prontuário
 *     tags: [Pacientes]
 *     description: Contém violação de RNF-07-G ao serializar o objeto completo do paciente, com todos os seus dados, para um log JSON.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente.
 *     responses:
 *       200:
 *         description: Auditoria simulada com sucesso.
 *       404:
 *         description: Paciente não encontrado.
 *       500:
 *         description: Erro interno no servidor.
 */
router.get('/:id/auditar-acesso', pacienteController.auditarAcessoProntuario);

// --- Rota 9: DELETE /pacientes/cpf/{cpf} ---
/**
 * @swagger
 * /pacientes/cpf/{cpf}:
 *   delete:
 *     summary: Exclui permanentemente um paciente pelo CPF (Hard Delete)
 *     tags: [Pacientes]
 *     description: Contém violação de RNF-12-A ao usar um dado pessoal (CPF) como critério em um comando de exclusão (`destroy`).
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do paciente a ser excluído.
 *     responses:
 *       204:
 *         description: Paciente excluído com sucesso.
 *       404:
 *         description: Paciente não encontrado.
 *       500:
 *         description: Erro interno no servidor.
 */
router.delete('/cpf/:cpf', pacienteController.deletarPacienteHard);

// --- Rota 10: POST /pacientes/cpf/{cpf}/arquivar ---
/**
 * @swagger
 * /pacientes/cpf/{cpf}/arquivar:
 *   post:
 *     summary: Simula o arquivamento de dados antigos e a exclusão de um arquivo de backup
 *     tags: [Pacientes]
 *     description: Contém violação de RNF-12-B ao apagar um arquivo temporário cujo nome literal contém dados pessoais (`paciente`, `cpf`).
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do paciente cujos dados serão arquivados.
 *     responses:
 *       200:
 *         description: Arquivamento simulado com sucesso.
 *       500:
 *         description: Erro interno no servidor.
 */
router.post('/cpf/:cpf/arquivar', pacienteController.arquivarDadosAntigos);

module.exports = router;
