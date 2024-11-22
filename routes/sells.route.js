// En sells.route.js
import mongoose from 'mongoose';
import Product from '../models/product.js';
import Sale from '../models/sale.js';
import express from 'express';
const router = express.Router();

//funciona
router.post('/order', async (req, res) => {
    const { userID, products, totalAmount } = req.body;

    try {
        let totalAmountCalculated = 0;
        for (const item of products) {
            const productId = new mongoose.Types.ObjectId(item.productId);
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado` });
            }

            totalAmountCalculated += product.price * item.quantity;
        }

        if (totalAmountCalculated !== totalAmount) {
            return res.status(400).json({ message: "El totalAmount no coincide con el cálculo de los productos" });
        }

        // Crear el registro de la venta
        const newSale = new Sale({
            userId: userID,
            products,
            totalAmount: totalAmountCalculated,
        });

        await newSale.save();
        res.status(201).json({ message: 'Compra realizada con éxito', sale: newSale });
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).json({ message: 'Error al procesar la compra', error });
    }
});

export default router;
