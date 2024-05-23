import { connectToRabbitMQ } from 'amqplib-retry-wrapper-dls';
import ProductService from '../services/productService.js';

const channel = await connectToRabbitMQ(process.env.AMQP_HOST);

async function consumeProductEvents() {
    const exchange = 'product';
    const queue = 'product_events';
    
    try {
        await channel.assertExchange(exchange, 'direct', {
            durable: true
        });

        const assertQueue = await channel.assertQueue(queue, {
            durable: true
        });

        channel.bindQueue(assertQueue.queue, exchange, 'product change');

        console.log('Waiting for product events...');

        channel.consume(assertQueue.queue, async (msg) => {
            try {
                const message = JSON.parse(msg.content.toString());
                if (message.status === 'created') {
                    const data = {
                        _id: message.product.id,
                        name: message.product.name,
                        description: message.product.description,
                        price: message.product.price,
                        quantity: message.product.quantity,
                        categories: message.product.categories.map(category => category.id),
                        createdAt: message.product.createdAt,
                        updatedAt: message.product.updatedAt,
                    }
                    ProductService.createProduct(data)
                } else if (message.status === 'updated') {
                    const data = {
                        _id: message.product.id,
                        name: message.product.name,
                        description: message.product.description,
                        price: message.product.price,
                        quantity: message.product.quantity,
                        categories: message.product.categories.map(category => category.id),
                        updatedAt: message.product.updatedAt
                    }
                    await ProductService.updateProduct(message.product.id, data);
                } else if (message.status === 'deleted') {
                    await ProductService.deleteProduct(message.product.id);
                }
                console.log('Product event processed successfully');
                channel.ack(msg)
            } catch (error) {
                console.error('Error processing product event:', error);
            }
        });
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
}

export default consumeProductEvents;
