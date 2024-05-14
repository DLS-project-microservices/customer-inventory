import connectToRabbitMQ from './connection.js';
import categoryService from '../services/categoryService.js';

async function consumeCategoryEvents() {
    try {
        const connection = await connectToRabbitMQ();
        const channel = await connection.createChannel();
        const exchange = 'product';
        const queue = 'category_events';

        await channel.assertExchange(exchange, 'direct', {
            durable: true
        });

        const assertQueue = await channel.assertQueue(queue, {
            durable: true
        });

        channel.bindQueue(assertQueue.queue, exchange, 'category change');

        console.log('Waiting for category events...');

        channel.consume(assertQueue.queue, async (msg) => {
            try {
                const message = JSON.parse(msg.content.toString());
                if (message.status === 'created') {
                    console.log(message)

                    const data = {
                        _id: message.category.id,
                        name: message.category.name,
                        description: message.category.categoryDescription,
                    }
                    categoryService.createCategory(data)
                } else if (message.status === 'updated') {
                    const data = {
                        _id: message.category.id,
                        name: message.category.name,
                        description: message.category.categoryDescription,
                    }
                    await categoryService.updateCategory(message.category.id, data);
                } else if (message.status === 'deleted') {
                    await categoryService.deleteCategory(message.category.id);
                }
                console.log('Category event processed successfully');
                channel.ack(msg)
            } catch (error) {
                console.error('Error processing category event:', error);
            }
        });
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
}

export default consumeCategoryEvents;
