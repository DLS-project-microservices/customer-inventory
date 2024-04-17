import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
   _id: {
       type: Number,
       required: true,
       unique: true,

   },
   name: {
       type: String,
       required: true,
       unique: true,
   },
   description: {
       type: String,
       default: 'There is no description for this product yet.'
   },
   quantity: {
       type: Number,
       default: 0
   },
   price: {
      type: Number,
      default: 0
   },
   categories: [{ 
      type: Number,
      ref: 'Category'
  }]
});

const Product = mongoose.model('Product', productSchema);

export default Product;
