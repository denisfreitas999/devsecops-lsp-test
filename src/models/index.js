const sequelize = require('../config/database');
const Paciente = require('./Paciente');
const ProntuarioMedico = require('./ProntuarioMedico');

// Define o relacionamento: um paciente pode ter múltiplos prontuários.
Paciente.hasMany(ProntuarioMedico, { foreignKey: 'pacienteId' });
ProntuarioMedico.belongsTo(Paciente, { foreignKey: 'pacienteId' });

const db = {
    sequelize,
    Sequelize: sequelize.Sequelize,
    Paciente,
    ProntuarioMedico,
};

const initDb = async () => {
    try {
        // force: true apaga e recria as tabelas (ideal para desenvolvimento da PoC)
        await sequelize.sync({ force: true });
        console.log('Banco de dados e tabelas criados com sucesso.');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    }
};

module.exports = { db, initDb };