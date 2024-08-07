const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } 
    catch (error) {
        console.error(`Error in connection to MongoDB: ${error.message}`)
        process.exit(1);
    }
}

module.exports = {
    connectMongoDB,
}