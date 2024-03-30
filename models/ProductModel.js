import mongoose from 'mongoose';
import Category from './CategoryModel.js';

const productSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true
    },
    description: {
       type: String,
       default: 'There is no description for this product yet.'
    },
    quantity: {
       type: Number,
       default: 0
    },
    categories: [Category.schema]
 });
 
 const Product = mongoose.model('Product', productSchema);

export default Product;

 