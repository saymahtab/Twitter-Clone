const express = require('express');
const dotenv = require('dotenv')
const { authRoutes } = require('./routes/auth.routes');
const { connectMongoDB } = require('../db/connectMongoDb');

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectMongoDB();
})