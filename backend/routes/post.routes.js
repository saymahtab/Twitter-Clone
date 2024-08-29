const { Router } = require('express');
const { protectRoute } = require('../middlewares/protectRoute');
const { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts } = require('../controllers/post.controller');

const postRoutes = Router();

postRoutes.get('/all', protectRoute, getAllPosts);
postRoutes.get('/likes/:id', protectRoute, getLikedPosts);
postRoutes.get('/following', protectRoute, getFollowingPosts);
postRoutes.get('/user/:userName', protectRoute, getUserPosts);
postRoutes.post('/create', protectRoute, createPost);
postRoutes.post('/like/:id', protectRoute, likeUnlikePost);
postRoutes.post('/comment/:id', protectRoute, commentOnPost);
postRoutes.delete('/:id', protectRoute, deletePost);

module.exports = {
    postRoutes,
}