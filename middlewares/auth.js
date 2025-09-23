const jwt = require('jsonwebtoken');

const segredo = process.env.JWT_SECRET || 'segredo_super_secreto';

function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // pega só o token

    if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

    jwt.verify(token, segredo, (err, usuario) => {
        if (err) return res.status(403).json({ erro: 'Token inválido ou expirado' });
        req.usuario = usuario; // payload do token (id, tipo, email)
        next();
    });
}

module.exports = { autenticarToken };
