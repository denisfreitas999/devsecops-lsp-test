// src/config/swaggerConfig.js

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Prontuários Médicos - PoC LGPD',
            version: '1.0.0',
            description: 'API para demonstrar e testar as violações de LGPD detectadas pelo lgpd-compliance-lsp.',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Servidor de Desenvolvimento'
            },
        ],
    },
    // O caminho para os arquivos contendo as anotações OpenAPI (nossas rotas)
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs; 