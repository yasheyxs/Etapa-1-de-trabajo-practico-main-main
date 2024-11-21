import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Default import

const router = Router();
const secretKey = process.env.JWT_SECRET || 'clave123'; // Cambia la clave en todos los archivos


// Obtener todos los usuarios
router.get('/getu', async (req, res) => {
    try {
        const usuarios = await User.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).send('Error al obtener los usuarios');
    }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        usuario ? res.json(usuario) : res.status(404).send('Usuario no encontrado');
    } catch (error) {
        res.status(500).send('Error al obtener el usuario');
    }
});

// Crear un usuario
router.post('/register', async (req, res) => {
    const { name, lastname, email, password } = req.body;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            name,
            lastname,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        updatedUser ? res.send('Usuario actualizado') : res.status(404).send('Usuario no encontrado');
    } catch (error) {
        res.status(500).send('Error al actualizar el usuario');
    }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        deletedUser ? res.send('Usuario eliminado') : res.status(404).send('Usuario no encontrado');
    } catch (error) {
        res.status(500).send('Error al eliminar el usuario');
    }
});

// Ruta para login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('Usuario no encontrado');

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).send('Contraseña incorrecta');

        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

export default router;
