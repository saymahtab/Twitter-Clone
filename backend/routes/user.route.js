const { Router } = require('express');
const { protectRoute } = require('../middlewares/protectRoute');
const { getUserProfile, followUnfollowUser, getSuggestedUsers, updateUserProfile } = require('../controllers/user.controller');

const userRoutes = Router();

userRoutes.get('/profile/:username', protectRoute, getUserProfile);
userRoutes.get('/suggested', protectRoute, getSuggestedUsers)
userRoutes.get('/follow/:id', protectRoute, followUnfollowUser);
userRoutes.patch('/update', protectRoute, updateUser);


module.exports = {
    userRoutes,
}