import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import insertSampleData from './db/seed.js';

const app = express();

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 8090;

try {
    await mongoose.connect(process.env.DB_URL);
    await insertSampleData();
    app.listen(PORT, () => console.log('Server is listening on port', PORT))

}
catch(error) {
    console.log(error);
}









