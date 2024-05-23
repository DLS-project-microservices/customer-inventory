import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

const ProductService = {
    async createProduct(productData) {
        try {
            const product = await Product.create(productData);

            const  categories = productData.categories;
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
            const existingProduct = await Product.findById(productId);
            if (updateData.updatedAt > existingProduct.updatedAt) {
                const product = await Product.findByIdAndUpdate(productId, updateData, { new: true });
            
                const categoriesToAdd = [];
                const categoriesToRemove = [];
        
                updateData.categories.forEach(categoryId => {
                    if (!existingProduct.categories.includes(categoryId)) {
                        categoriesToAdd.push(categoryId);
                    }
                });
        
                existingProduct.categories.forEach(categoryId => {
                    if (!updateData.categories.includes(categoryId)) {
                        categoriesToRemove.push(categoryId);
                    }
                });
        
                await Promise.all(categoriesToAdd.map(async categoryId => {
                    const category = await Category.findById(categoryId);
                    if (category) {
                        category.products.push(productId);
                        await category.save();
                    }
                }));
        
                await Promise.all(categoriesToRemove.map(async categoryId => {
                    const category = await Category.findById(categoryId);
                    if (category) {
                        category.products = category.products.filter(prodId => prodId.toString() !== productId.toString());
                        await category.save();
                    }
                }));
                console.log(`Product with id: '${productId}' was updated.`);

                return product;      
            }
            else {
                console.log(`Update message for product with ID: '${productId}' was ignored because it was older than the current version.\nIncoming message timestamp: ${updateData.updatedAt}\nTimestamp on product: ${existingProduct.updatedAt}\n`)
            }      
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    },
    
    async deleteProduct(productId) {
        try {
            const product = await Product.findById(productId);
            
            const categoryIds = product.categories;
            
            await Promise.all(categoryIds.map(async categoryId => {
                const category = await Category.findById(categoryId);
                if (category) {
                    category.products = category.products.filter(prodId => prodId.toString() !== productId.toString());
                    await category.save();
                }
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


};
  
  export default ProductService;