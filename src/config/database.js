// ===================================================================
// ARQUIVO: src/config/database.js
// DESCRIÇÃO: Configuração e inicialização da conexão com o banco
// de dados SQLite utilizando o Sequelize ORM.
// ===================================================================

const { Sequelize } = require('sequelize');
const path = require('path');

/**
 * Instância principal do Sequelize configurada para utilizar SQLite.
 * O banco de dados será criado automaticamente na raiz do projeto.
 */
const sequelize = new Sequelize({
    dialect: 'sqlite', // Define o tipo de banco de dados (neste caso, SQLite)
    storage: path.join(__dirname, '..', '..', 'database.sqlite'), // Caminho absoluto para o arquivo físico do banco
    logging: false // Desativa os logs SQL no console (mantém o terminal limpo)
});

/**
 * Exporta a instância configurada do Sequelize para ser reutilizada
 * em outras partes do sistema (ex: models, migrations, seeds, etc.).
 */
module.exports = sequelize;
