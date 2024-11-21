import express from 'express';
import usersRoutes from './routes/users.route.js';
import productsRoutes from './routes/products.route.js';
import salesRoutes from './routes/sells.route.js';

const app = express();
app.use(express.json());

app.use('/usuarios', usersRoutes);
app.use('/productos', productsRoutes);
app.use('/ventas', salesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
