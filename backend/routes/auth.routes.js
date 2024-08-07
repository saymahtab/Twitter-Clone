const { Router } = require('express');
const authControllers = require('../controllers/auth.controller');
const authRoutes = Router();

authRoutes.post('/signup', authControllers.signup)
authRoutes.post('/login', authControllers.login)
authRoutes.post('/logout', authControllers.logout)

module.exports = {
    authRoutes,
}