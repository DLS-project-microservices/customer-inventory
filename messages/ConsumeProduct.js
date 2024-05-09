import connectToRabbitMQ from './connection.js';
import ProductService from '../services/ProductService.js';

async function consumeProductEvents() {
    try {
        const connection = await connectToRabbitMQ();
        const channel = await connection.createChannel();
        const exchange = 'product';
        const queue = 'product_events';

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
                        categories: message.product.categories.map(category => category.id)
                    }
                    ProductService.createProduct(data)
                } else if (message.status === 'updated') {
                    const data = {
                        _id: message.product.id,
                        name: message.product.name,
                        description: message.product.description,
                        price: message.product.price,
                        quantity: message.product.quantity,
                        categories: message.product.categories.map(category => category.id)
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
