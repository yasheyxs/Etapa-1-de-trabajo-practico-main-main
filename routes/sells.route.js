import { Router } from 'express';
import Sale from '../models/sale.js';
import Product from '../models/product.js';
import verifyToken from '../middleware/auth.js';

const router = Router();

// Crear una orden de compra
router.post('/order', verifyToken, async (req, res) => {
    const { products } = req.body; // [{ productId, quantity }]
    try {
        // Calcular el monto total de la venta
        let totalAmount = 0;
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado` });

            totalAmount += product.price * item.quantity;
        }

        // Crear la venta
        const newSale = new Sale({
            userId: req.user.userId,
            products,
            totalAmount,
        });
        await newSale.save();

        res.status(201).json({ message: 'Compra realizada con éxito', sale: newSale });
    } catch (error) {
        res.status(500).json({ message: 'Error al procesar la compra', error });
    }
});

export default router;
