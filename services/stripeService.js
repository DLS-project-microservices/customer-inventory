import Stripe from 'stripe';
import dotenv from 'dotenv';
import Product from '../models/ProductModel.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeService = {
    async createPaymentIntent(items) {
        try {
            const productIds = items.map(item => item.productId);
            const products = await Product.find({ _id: { $in: productIds } });

            const lineItems = products.map(product => {
                const item = items.find(item => item.productId === product._id);

                if (!item) {
                    throw new Error(`Item with productId ${product._id} not found`);
                }

                const quantity = item.quantity;
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.name,
                            description: product.description
                        },
                        // TODO: Replace with actual price when price added to database use product.price
                        unit_amount: 123 * 100,
                    },
                    quantity: quantity,
                };
            });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: 'https://yourwebsite.com/success',
                cancel_url: 'https://yourwebsite.com/cancel',
            });

            return {
                sessionId: session.url
            };
        } catch (error) {
            throw new Error('Error creating payment intent: ' + error.message);
        }
    }
};

export default stripeService;