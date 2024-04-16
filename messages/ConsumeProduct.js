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
                console.log('Received product event:', message);
                if (message.status === 'created') {
                    console.log(message)
                    await ProductService.createProduct({
                        _id: message.product.id,
                        name: message.product.name,
                        description: message.product.description,
                        quantity: message.product.quantity,
                        categories: message.product.categories.map(category => category.id)
                    });
                } else if (message.status === 'updated') {
                    await ProductService.updateProduct(
                        message.product.id,
                        {
                            _id: message.product.id,
                            name: message.product.name,
                            description: message.product.description,
                            quantity: message.product.quantity,
                            categories: message.product.categories.map(category => category.id)
                        });
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
