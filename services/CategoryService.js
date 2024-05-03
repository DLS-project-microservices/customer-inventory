import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";

const CategoryService = {
async createCategory(categoryData) {
    try {
        const category = await Category.create(categoryData);
        return category;
    } catch (error) {
        throw new Error(`Error creating category: ${error.message}`);
    }
},

async updateCategory(categoryId, newData) {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, {
            $set: {
                name: newData.name,
                description: newData.description
            }
        }, { new: true });
        return updatedCategory;
    } catch (error) {
        throw new Error(`Error updating category: ${error.message}`);
    }
},

async deleteCategory(categoryId) {
    try {
        const category = await Category.findById(categoryId);
        
        const productsIds = category.products;
        
        await Promise.all(productsIds.map(async productsId => {
            const product = await Product.findById(productsId);
            if (product) {
                product.categories = product.categories.filter(catId => catId.toString() !== categoryId.toString());
                await product.save();
            }
        }));

        await Category.findByIdAndDelete(categoryId);
    } catch (error) {
        throw new Error(`Failed to delete category: ${error.message}`);
    }
},

async getCategories() {
    const categories = await Category.find();
    return categories;
},

async getCategoryById(id) {
    const category = await Category.findById(id);
    return category;
},

}

export default CategoryService;