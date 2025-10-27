// src/server.js (versão final com Swagger e Roteador)

const express = require('express');
const { initDb } = require('./models');

// --- Importações para o Swagger ---
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swaggerConfig');
// ---------------------------------

// --- Importação do Roteador Principal ---
const mainRouter = require('./routes'); // Importa o index.js da pasta routes
// --------------------------------------

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Configuração das Rotas ---
// Rota da Raiz
app.get('/', (req, res) => {
    res.send('API de Prontuários Médicos está funcionando! Acesse /api-docs para a documentação.');
});

// Rota para a documentação do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Roteador Principal da API
app.use('/api', mainRouter); // Todas as nossas rotas começarão com /api
// ------------------------------


const startServer = async () => {
    try {
        await initDb();

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
            console.log(`Documentação da API disponível em http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Falha ao iniciar o servidor:', error);
        process.exit(1);
    }
};

startServer();