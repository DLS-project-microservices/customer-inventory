import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
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
        default: 'There is no description for this category yet.'
    },
    products: [{ 
        type: Number,
        ref: 'Product' 
    }]
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
