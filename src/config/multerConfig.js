// ===================================================================
// ARQUIVO: src/config/multer.js
// DESCRIÇÃO: Configuração do Multer para upload de arquivos,
// definindo diretório de armazenamento e nomeação dos arquivos.
// ===================================================================

const multer = require('multer');
const path = require('path');

/**
 * Configuração do armazenamento local para uploads.
 * Define onde os arquivos serão salvos e como serão nomeados.
 */
const storage = multer.diskStorage({
    /**
     * Define o diretório de destino dos arquivos enviados.
     * Neste caso, os uploads serão salvos na pasta 'uploads'
     * localizada na raiz do projeto.
     */
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
    },

    /**
     * Define o nome final do arquivo salvo.
     * O nome original é mantido, mas recebe um sufixo único com timestamp
     * e um número aleatório para evitar colisões de nomes.
     */
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

/**
 * Instância configurada do Multer.
 * Pode ser utilizada em rotas para lidar com uploads de forma simples.
 */
const upload = multer({ storage: storage });

/**
 * Exporta o middleware de upload configurado
 * para ser utilizado nos controladores e rotas.
 */
module.exports = upload;
