import Category from "../models/CategoryModel.js";

async function getCategories() {
    const categories = await Category.find();
    return categories;
}

async function getCategoryById(id) {
    const category = await Category.findById(id);
    return category;
}

export {
    getCategories,
    getCategoryById
}