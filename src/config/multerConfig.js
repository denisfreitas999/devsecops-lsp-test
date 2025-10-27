const multer = require('multer');
const path = require('path');

// Configuração de onde e como salvar os arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Salva os arquivos na pasta 'uploads' na raiz do projeto
        cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        // Mantém o nome original do arquivo, adicionando um timestamp para evitar duplicatas
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;