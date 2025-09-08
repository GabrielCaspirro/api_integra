const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pasta onde os arquivos serão salvos
const uploadPath = path.join(__dirname, "../uploads/empresas");

// Cria a pasta se não existir
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuração do storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname); // pega a extensão do arquivo
    cb(null, `${timestamp}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Apenas arquivos de imagem são permitidos!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
