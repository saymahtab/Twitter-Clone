const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { v2: cloudinary } = require('cloudinary');
 
const { authRoutes } = require('./routes/auth.route');
const { userRoutes } = require('./routes/user.route');
const { postRoutes } = require('./routes/post.route');
const { notificationRoutes } = require('./routes/notification.route');

const { connectMongoDB } = require('./db/connectMongoDB');
const cors = require('cors');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/notifications', notificationRoutes)

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
  }
  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectMongoDB();
})