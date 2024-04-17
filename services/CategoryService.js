import Category from './models/Category';
import Product from './models/Product';

async function createCategory(categoryData) {
    try {
        const category = await Category.create(categoryData);
        return category;
    } catch (error) {
        throw new Error(`Error creating category: ${error.message}`);
    }
}

async function updateCategory(categoryId, newData) {
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
}

async function deleteCategory(categoryId) {
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
}

export { createCategory, updateCategory, deleteCategory };
