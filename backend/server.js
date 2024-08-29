const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { v2: cloudinary } = require('cloudinary');
 
const { authRoutes } = require('./routes/auth.route');
const { connectMongoDB } = require('./db/connectMongoDB');
const { userRoutes } = require('./routes/user.route');
const { postRoutes } = require('./routes/post.route');
const { notificationRoutes } = require('./routes/notification.route');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/notifications', notificationRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectMongoDB();
})