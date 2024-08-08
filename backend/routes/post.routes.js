const { Router } = require("express");
const { protectRoute } = require("../middleware/protectRoute");
const { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPost } = require("../controllers/post.controller");
const postRoutes = Router();

postRoutes.get('/all', protectRoute, getAllPost);
postRoutes.post('/create', protectRoute, createPost);
postRoutes.post('/like/:id', protectRoute, likeUnlikePost);
postRoutes.post('/comment/:id', protectRoute, commentOnPost);
postRoutes.delete('/:id', protectRoute, deletePost);

module.exports = {
    postRoutes,
}