import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";

const ProductService = {
    async createProduct(productData) {
        try {
            const product = await Product.create(productData);
            const { categories } = productData;
            await Promise.all(categories.map(async categoryId => {
                const category = await Category.findById(categoryId);
                if (category) {
                    category.products.push(product._id);
                    await category.save();
                }
            }));
            return product;
        } catch (error) {
            throw new Error(`Failed to create product: ${error.message}`);
        }
    },
  
    async updateProduct(productId, updateData) {
        try {
            const product = await Product.findByIdAndUpdate(productId, updateData, { new: true });
            const { categories } = updateData;
            const existingCategories = await Category.find({ products: productId });
    
            const categoriesToAdd = categories.filter(categoryId => !existingCategories.some(cat => cat._id.toString() === categoryId));
            const categoriesToRemove = existingCategories.filter(cat => !categories.includes(cat._id.toString()));
    
            await Promise.all(categoriesToAdd.map(async categoryId => {
                const category = await Category.findById(categoryId);
                if (category) {
                    category.products.push(productId);
                    await category.save();
                }
            }));
    
            await Promise.all(categoriesToRemove.map(async category => {
                category.products = category.products.filter(prodId => prodId.toString() !== productId);
                await category.save();
            }));
    
            return product;
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    },
  
    async deleteProduct(productId) {
        try {
            const product = await Product.findById(productId);
            const categories = await Category.find({ products: productId });
    
            await Promise.all(categories.map(async category => {
                category.products = category.products.filter(prodId => prodId.toString() !== productId);
                await category.save();
            }));
    
            await Product.findByIdAndDelete(productId);
        } catch (error) {
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    },
  
    async getProducts() {
        try {
          const products = await Product.find().populate('categories');
          return products;
        } catch (error) {
          throw new Error(`Failed to get products: ${error.message}`);
        }
      },
  
      async getProductById(productId) {
        try {
          const product = await Product.findById(productId).populate('categories');
          return product;
        } catch (error) {
          throw new Error(`Failed to get product by ID: ${error.message}`);
        }
      },

      async updateCategoriesProduct(product) {
        try {
            const categoriesToUpdate = product.categories;
            const products = await Product.find({ categories: { $in: categoriesToUpdate } });
            const uniqueCategoryIds = [...new Set(categoriesToUpdate)];

            await Promise.all(uniqueCategoryIds.map(async (categoryId) => {
                const category = await Category.findById(categoryId);
                if (category) {
                    category.products = products.filter(p => p.categories.includes(categoryId)).map(p => p._id);
                    await category.save();
                }
            }));
        } catch (error) {
            throw new Error(`Failed to update categories: ${error.message}`);
        }
    },

};


  
  
  export default ProductService;