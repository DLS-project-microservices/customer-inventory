import 'dotenv/config';
import mongoose from 'mongoose';
import insertSampleData from './db/seed.js';

try {
    await mongoose.connect(process.env.DB_URL);
    await insertSampleData();

}
catch(error) {
    console.log(error);
}



