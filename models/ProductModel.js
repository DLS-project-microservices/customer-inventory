import mongoose from 'mongoose';
import Category from './CategoryModel.js';

const productSchema = new mongoose.Schema({
   _id: {
       type: Number,
       required: true
   },
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
   quantity: {
      type: Number,
      default: 0.0
  },
   categories: [{ 
       type: Number,
       ref: 'Category' 
   }]
});
 const Product = mongoose.model('Product', productSchema);

export default Product;

 