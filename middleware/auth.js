import jwt from 'jsonwebtoken';

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(403).send('Acceso denegado');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // El ID del usuario estará disponible en req.user
        next();
    } catch (err) {
        return res.status(400).send('Token no válido');
    }
};

export default verifyToken;
