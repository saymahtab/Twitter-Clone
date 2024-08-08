const express = require('express');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');

const { connectMongoDB } = require('./db/connectMongoDB');
const { authRoutes } = require('./routes/auth.routes');
const { userRoutes } = require('./routes/user.routes');
const { postRoutes } = require('./routes/post.routes');
const {v2} = require('cloudinary');
const { notificationRoutes } = require('./routes/notification.routes');

dotenv.config()

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/notification', notificationRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectMongoDB();
})