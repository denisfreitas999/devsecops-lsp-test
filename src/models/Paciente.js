const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// ❌ VIOLAÇÃO RNF-07-B: O modelo inteiro é um grande alvo para esta regra,
// pois define a estrutura para armazenamento de múltiplos dados pessoais e sensíveis.
const Paciente = sequelize.define('Paciente', {
    nome_completo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    data_nascimento: {
        type: DataTypes.DATEONLY,
    },
    // Adicionando filiação, um dado pessoal comum em cadastros de saúde.
    filiacao_mae: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    telefone: {
        type: DataTypes.STRING,
    },
    endereco: {
        type: DataTypes.STRING,
    },
    sexo_biologico: {
        type: DataTypes.STRING,
    },
    identidade_genero: {
        type: DataTypes.STRING,
    },
    etnia: {
        type: DataTypes.STRING,
    },
    tipo_sanguineo: {
        type: DataTypes.STRING,
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: true,
    modelName: 'Paciente',
    tableName: 'pacientes'
});
module.exports = Paciente;