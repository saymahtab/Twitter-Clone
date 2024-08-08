const { Router } = require('express');
const { protectRoute } = require('../middleware/protectRoute');
const { getUserProfile, followUnfollowUser, getSuggestedUser, updateUser } = require('../controllers/user.controller');
const userRoutes = Router();

userRoutes.get('/profile/:username', protectRoute, getUserProfile)
userRoutes.get('/suggested', protectRoute, getSuggestedUser)
userRoutes.post('/follow/:id', protectRoute, followUnfollowUser)
userRoutes.post('/update', protectRoute, updateUser)
 
module.exports = {  
    userRoutes,
}