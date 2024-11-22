import { Router } from 'express';
import Product from '../models/product.js';

const router = Router();

// Obtener todos los productos (funciona)
router.get('/getp', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

// Crear un nuevo producto (funciona)
router.post('/createp', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
});

export default router;