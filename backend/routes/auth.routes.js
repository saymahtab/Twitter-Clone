const { Router } = require('express');
const authControllers = require('../controllers/auth.controller');
const { protectRoute } = require('../middleware/protectRoute');
const authRoutes = Router();

authRoutes.get('/me',protectRoute , authControllers.getMe)
authRoutes.post('/signup', authControllers.signup)
authRoutes.post('/login', authControllers.login)
authRoutes.post('/logout', authControllers.logout)

module.exports = {
    authRoutes,
}