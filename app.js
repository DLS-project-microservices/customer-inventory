import 'dotenv/config';
import mongoose from 'mongoose';
import consumeProductEvents from './messages/consumeProduct.js';
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import stripeRouter from './routes/checkoutRoutes.js'
import consumeCategoryEvents from './messages/consumeCategory.js';

await mongoose.connect(process.env.DB_URL);
await consumeProductEvents(); 
await consumeCategoryEvents();

const app = express();

app.use(cors({
    credentials: true,
    origin: "*"
}));
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/checkout', stripeRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log('Server is listening on port', PORT))









