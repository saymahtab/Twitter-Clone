const { Router } = require('express');
const { signup, login, logout, getMe } = require('../controllers/auth.controller');
const { protectRoute } = require('../middlewares/protectRoute');

const authRoutes = Router();

authRoutes.get('/me', protectRoute, getMe)
authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)

module.exports = {
    authRoutes,
}