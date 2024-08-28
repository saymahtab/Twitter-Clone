const { Router } = require('express');
const { signup, login, logout } = require('../controllers/auth.controller');

const authRoutes = Router();

authRoutes.post('/signup', signup)

authRoutes.post('/login', login)
authRoutes.post('/logout', logout)

module.exports = {
    authRoutes,
}