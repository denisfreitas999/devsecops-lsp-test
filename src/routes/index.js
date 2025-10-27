// src/routes/index.js

const express = require('express');
const router = express.Router();

const pacienteRoutes = require('./pacienteRoutes'); // Mudamos para o novo arquivo

// Todas as rotas em pacienteRoutes agora começarão com /pacientes
// Ex: POST /api/pacientes
router.use('/pacientes', pacienteRoutes);

module.exports = router;