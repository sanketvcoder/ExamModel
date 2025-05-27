import mongoose from 'mongoose'
import { mongodb } from '../config/config.js'

export const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(mongodb)
        console.log(`MongoDb connected : ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
}