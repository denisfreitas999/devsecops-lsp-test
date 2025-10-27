const { Sequelize } = require('sequelize');
const path = require('path');

// Configura a conexão com o banco de dados SQLite
// O arquivo do banco será criado na raiz do projeto
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', '..', 'database.sqlite'), // Caminho para o arquivo do banco

    // ADICIONE ESTA LINHA PARA DESATIVAR OS LOGS DE SQL
    logging: false
});

module.exports = sequelize;