import 'dotenv/config';
import mongoose from 'mongoose';
import connectToRabbitMQ from './messages/connection.js';
import consumeProductEvents from './messages/ConsumeProduct.js';
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import consumeCategoryEvents from './messages/ConsumeCategory.js';


const app = express();

app.use(cors({
    credentials: true,
    origin: "*"
}));

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 8090;

try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () => console.log('Server is listening on port', PORT))
}
catch(error) {
    console.log(error);
}

connectToRabbitMQ()
    .then(() => {
        console.log('Connected to RabbitMQ');
        consumeProductEvents(); 
        consumeCategoryEvents();
    })
    .catch((error) => {
        console.error('Error connecting to RabbitMQ:', error);
    });








