import Product from "../models/ProductModel.js";

async function getProducts() {
    const products = await Product.find();
    return products;
}

async function getProductById(id) {
    const product = await Product.findById(id);
    return product;
}

export { 
    getProducts,
    getProductById
}