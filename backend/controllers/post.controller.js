const { Notification } = require("../models/notification.model");
const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");
const { v2 } = require('cloudinary')

const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});

        if(!text && !img) {
            return res.status(404).json({message: "Post must have text or image"});
        }
        if(img) {
            const uploadedResponse = await v2.uploader.upload(img)
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img,
        })
        await newPost.save();
        res.status(201).json(newPost);
    } 
    catch (error) {
        res.status(500).json({error: "Internal Server Error"})
        console.log("Error in createPost controller: ", error)
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) {
            return res.status(404).json({error: "Post not found"})
        }
        if(post.user.toString() != req.user._id.toString()) {
            return res.status(404).json({error: "You are not authorized to delete this post"})
        }
        if(post.img) {
            const imgId = post.img.split('/').pop().split('.')[0];
            await v2.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id)

        res.status(200).json({message: "Post deleted Successfully"})
    } 
    catch (error) {
        console.log("Error in deletePost Controller", error);
        res.status(500).json({error: "Internal Server error"});
    }
}

const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if(!text) {
            return res.status(404).json({error: 'Text field is Empty'})
        }
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({error: 'Post Not Found'})
        }
        const comment = {user: userId, text};
        post.comments.push(comment)
        await post.save();

        res.status(201).json(post)
    } 
    catch (error) {
        console.log("Error in commentOnPost Controller", error);
        res.status(500).json({error: "Internal Server error"});
    }
}

const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id:postId } = req.params;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({error: 'Page Not Found'})
        }
        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost) {
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}});

            res.status(200).json({message: "post unliked successfully"})
        }
        else {
            post.likes.push(userId)
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            })
            await notification.save();

            res.status(200).json({message: "post liked successfully"})
        }
    } 
    catch (error) {
        console.log("Error in likeUnlikePost Controller", error);
        res.status(500).json({error: "Internal Server error"});
    }
}

const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: "user",
            select: "-passward",
        })
        .populate({
            path: "comments.user",
            select: "-passward"
        })

        if(posts.length === 0) {
            return res.status(404).json([])
        }
        res.status(200).json(posts)
    } 
    catch (error) {
        console.log("Error in getAllPost Controller", error);
        res.status(500).json({error: "Internal Server error"});
    }
}


module.exports = {
    createPost,
    deletePost,
    commentOnPost,
    likeUnlikePost,
    getAllPost,
}