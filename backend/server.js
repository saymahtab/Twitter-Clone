const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const { authRoutes } = require('./routes/auth.routes');
const { connectMongoDB } = require('./db/connectMongoDB');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectMongoDB();
})