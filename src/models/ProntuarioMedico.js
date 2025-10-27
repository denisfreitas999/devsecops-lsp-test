// src/models/ProntuarioMedico.js (Versão Corrigida e Simplificada)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProntuarioMedico = sequelize.define('ProntuarioMedico', {
    // Removemos os dados pessoais daqui. Eles pertencem ao modelo Paciente.
    // O link será feito pelo 'pacienteId' que o Sequelize adiciona automaticamente.

    plano_saude: {
        type: DataTypes.STRING,
        comment: 'DADO SENSÍVEL (SAÚDE): Informação administrativa de saúde.'
    },
    medicacao: {
        type: DataTypes.TEXT,
        comment: 'DADO SENSÍVEL (SAÚDE): Tratamento farmacológico.'
    },
    historico_medico: {
        type: DataTypes.TEXT,
        comment: 'DADO SENSÍVEL (SAÚDE): Informações pregressas.'
    },
    // Mantemos os outros dados sensíveis que são parte do prontuário
    teste_genetico: {
        type: DataTypes.TEXT,
        comment: 'DADO SENSÍVEL (GENÉTICO): Resultados de exames de DNA.'
    },
    biometria: {
        type: DataTypes.BLOB('long'),
        comment: 'DADO SENSÍVEL (BIOMÉTRICO): Identificador único do indivíduo.'
    },
}, {
    timestamps: true,
    modelName: 'ProntuarioMedico',
    tableName: 'prontuarios_medicos'
});

module.exports = ProntuarioMedico;