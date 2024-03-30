import Category from "../models/CategoryModel.js";
import Product from "../models/ProductModel.js";

const categoriesData = [
    { name: "Electronics", categoryDescription: "Products related to electronic devices" },
    { name: "Clothing", categoryDescription: "Apparel and accessories" },
    { name: "Books", categoryDescription: "Various genres of books" }
];

const productsData = [
    {
        name: "Smartphone",
        description: "A powerful smartphone with advanced features.",
        quantity: 10,
        categories: [
            { name: "Electronics", categoryDescription: "Products related to electronic devices" }
        ]
    },
    {
        name: "T-shirt",
        description: "Comfortable cotton T-shirt for everyday wear.",
        quantity: 20,
        categories: [
            { name: "Clothing", categoryDescription: "Apparel and accessories" }
        ]
    },
    {
        name: "Java Programming Book",
        description: "A comprehensive guide to Java programming language.",
        quantity: 5,
        categories: [
            { name: "Books", categoryDescription: "Various genres of books" }
        ]
    },
    {
        name: "Laptop",
        description: "High-performance laptop for work and entertainment.",
        quantity: 8,
        categories: [
            { name: "Electronics", categoryDescription: "Products related to electronic devices" }
        ]
    },
    {
        name: "Jeans",
        description: "Classic denim jeans for casual wear.",
        quantity: 15,
        categories: [
            { name: "Clothing", categoryDescription: "Apparel and accessories" },
            { name: "Outdoor" }
        ]
    }
];

// Inserting sample data
async function insertSampleData() {
    try {
        // Inserting categories
        const insertedCategories = await Category.insertMany(categoriesData);
        console.log("Categories inserted:", insertedCategories);

        // Inserting products
        const insertedProducts = await Product.insertMany(productsData);
        console.log("Products inserted:", insertedProducts);
    } catch (error) {
        console.error("Error inserting sample data:", error);
    }
}


// Call the function to insert sample data
export default insertSampleData