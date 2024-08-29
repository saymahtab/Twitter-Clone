const {v2: cloudinary} = require('cloudinary')

const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");
const { Notification } = require('../models/notification.model');

const createPost = async (req, res) => {
    const { text } = req.body;
    let { image } = req.body;

    const userId = req.user._id.toString();

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({error: "User not found"});
        }

        if(!text && !image) {
            return res.status(400).json({error: "Post must have text or image"});
        }

        if(image) {
            const uploadResponse = cloudinary.uploader.upload(image);
            image = uploadResponse.secure_url
        }

        const newPost = new Post({
            user: userId,
            text,
            image,
        })

        await newPost.save();
        res.status(200).json(newPost);
    } 
    catch (err) {
        console.log("Error in createPost controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const deletePost = async (req, res) => {
     try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({error: "Post not found"});
        }
        if(post.user.toString() !== req.user._id.toString()) {
            return res.status(400).json({error: "You are not authorized to delete this post"})
        }
        if(post.image) {
            const imgId = post.image.split('/')[7].pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id)

        res.status(200).json({error: "Post deleted successfully"});

     } 
     catch (err) {
        console.log("Error in deletePost controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
     }
}

const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id; 
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({error: "Post not found"});
        }  

        if(!text) {
            return res.status(400).json({error: "Text is required"});
        }

        const comment = { user: userId, text};

        post.comments.push(comment);
        await post.save();  

        return res.status(200).json(post);
    } 
    catch (err) {
        console.log("Error in commentPost controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({error: "Post not found"});
        }
        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost) {

            await Post.updateOne({ _id: postId }, { $pull: { likes: userId }});
            await User.updateOne({_id: userId}, { $pull: { likedPosts: postId }});

            return res.status(200).json({message: "Post UnLiked Successfully"})
        }
        else {
            post.likes.push(userId);
            await User.updateOne({_id: userId}, { $push: { likedPosts: postId }});

            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: 'like'
            })
            await notification.save()

            return res.status(200).json({message: "Post Liked Successfully"})
        }
    } 
    catch (err) {
        console.log("Error in likedUnlikedPost controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: 'user',
            select: "-password",
        }).populate({
            path: 'comments.user',
            select: "-password"
        })

        if(posts.length === 0 ) {
            return res.status(400).json([]);
        }
        res.status(200).json(posts);
    } 
    catch (err) {
        console.log("Error in getAllPosts controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const getLikedPosts = async (req, res) => {

    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(400).json({error: "User not found"});
        }
        const likedPosts = await Post.find({_id: {$in: user.likedPosts}})
        .populate({
            path: 'user',
            select: "-password",
        }).populate({
            path: 'comments.user',
            select: "-password",
        })

        res.status(200).json(likedPosts)
    } 
    catch (err) {
        console.log("Error in getLikedPosts controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const getFollowingPosts = async (req, res) => {

    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({error: "User not found"});
        }
        const following = user.following;

        const feedPosts = await Post.find({user: {$in: following}}).sort({createdAt: -1})
        .populate({
            path: 'user',
            select: "-password",
        }).populate({
            path: 'comments.user',
            select: "-password",
        })

        res.status(200).json(feedPosts);
    } 
    catch (err) {
        console.log("Error in getFollowingPosts controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const getUserPosts = async (req, res) => {
    const { userName } = req.params;

    try {
        const user = await User.findOne({ userName });
        if(!user) {
            return res.status(404).json({error: "User not Found"});
        }
        const posts = await Post.find({user: user._id}).sort({createdAt: -1})
        .populate({
            path: 'user',
            select: "-password",
        }).populate({
            path: 'comments.user',
            select: "-password",
        })

        res.status(200).json(posts)
    } 
    catch (err) {
        console.log("Error in getUserPosts controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {
    createPost,
    deletePost,
    commentOnPost,
    likeUnlikePost,
    getAllPosts,
    getLikedPosts,
    getFollowingPosts,
    getUserPosts,
}