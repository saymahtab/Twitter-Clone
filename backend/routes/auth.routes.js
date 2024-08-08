const { Router } = require('express');
const { protectRoute } = require('../middleware/protectRoute');
const { getMe, signup, login, logout } = require('../controllers/auth.controller');


const authRoutes = Router();

authRoutes.get('/me',protectRoute , getMe)
authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)

module.exports = {
    authRoutes,
}