import 'dotenv/config';
import amqp from 'amqplib';

let connection = null;

async function connectToRabbitMQ() {
    if (connection) {
        return connection;
    }

    const maxRetries = 6;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        console.log(`Connecting to RabbitMQ (Attempt ${retryCount + 1} of ${maxRetries})...`);

        try {
            connection = await amqp.connect(`amqp://${process.env.AMQP_HOST}`);
            console.log(`Connection to RabbitMQ established`);
            return connection;
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            retryCount += 1;
            const delaySeconds = Math.pow(2, retryCount);
            console.log(`Retrying in ${delaySeconds} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
        }
    }

    throw new Error('Failed to connect to RabbitMQ after max retry attempts.');
}

export default connectToRabbitMQ;
