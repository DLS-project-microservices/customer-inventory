import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    categoryDescription: {
        type: String,
        default: 'There is no description for this category yet.'
    }
});

const Category = mongoose.model('Category', categorySchema);

export default Category;