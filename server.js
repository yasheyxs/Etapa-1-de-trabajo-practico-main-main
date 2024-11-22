import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/users.route.js';
import productRoutes from './routes/products.route.js';
import salesRoutes from './routes/sells.route.js';
import verifyToken from './middleware/auth.js';


dotenv.config();

const app = express();

// Conexión a MongoDB
mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);

// Configurar el puerto y levantar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

// Ruta raíz para prueba
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API!');
  });
  