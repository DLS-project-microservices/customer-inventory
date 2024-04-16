import 'dotenv/config';
import mongoose from 'mongoose';
import connectToRabbitMQ from './messages/connection.js';
import consumeProductEvents from './messages/ConsumeProduct.js';

try {
    await mongoose.connect(process.env.DB_URL);

}
catch(error) {
    console.log(error);
}

connectToRabbitMQ()
    .then(() => {
        console.log('Connected to RabbitMQ');
        consumeProductEvents(); 
    })
    .catch((error) => {
        console.error('Error connecting to RabbitMQ:', error);
    });


