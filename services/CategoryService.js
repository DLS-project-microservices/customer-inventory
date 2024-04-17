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

        if (category.products.length > 0) {
            await Product.updateMany({ _id: { $in: category.products } }, { $pull: { categories: categoryId } });
        }

        await Category.findByIdAndDelete(categoryId);

        return { message: 'Category deleted successfully' };
    } catch (error) {
        throw new Error(`Error deleting category: ${error.message}`);
    }
}

export { createCategory, updateCategory, deleteCategory };
