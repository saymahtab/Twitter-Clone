const bcrypt = require('bcryptjs')
const { v2 } = require('cloudinary')

//models
const { Notification } = require("../models/notification.model");
const { User } = require("../models/user.model");

const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({username}).select('-passward');
        if(!user) {
            res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    } 
    catch (err) {
        console.log("Error in getUserProfile: ", err.message)
        res.status(500).json({error: err.message});
    }
}

const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentuser = await User.findById(req.user._id);

        if(id === req.user._id.toString()) {
            return res.status(404).json({error: "You can't follow/Unfollow yourself"})
        }
        if(!userToModify || !currentuser) {
            return res.status(404).json({error: "User not found"})
        }
        const isFollowing = currentuser.following.includes(id)
        if(isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id} });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id} });
            res.status(200).json({message: "User Unfollowed successfully"});
        }
        else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id} });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id} });

            const newNotification = new Notification({
                type: 'follow',
                from: req.user._id,
                to: userToModify._id
            })

            await newNotification.save();

            res.status(200).json({message: "User followed successfully"});
        }
    } 
    catch (err) {
        console.log("Error in followUnfollowUser: ", err.message)
        res.status(500).json({error: err.message});
    }
}

const getSuggestedUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const userFollowedByMe = await User.findById(userId).select("following");
        const users = await User.aggregate([
            {
                $match: {
                    _id: {$ne:userId}
                }
            },
            {$sample:{size:10}}
        ])
        const filteredUsers = users.filter(user => !userFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0, 4);

        suggestedUsers.forEach(user => user.passward=null)

        res.status(200).json(suggestedUsers);
    } 
    catch (error) {
        console.log("Error in getSuggestedUsers ", error.message);
        res.status(500).json({error: error.message})
    }
}

const updateUser = async (req, res) => {
    const {fullName, username, email, currentPassward, newPassward, bio, link} = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User Not Found"});

        if((!newPassward && currentPassward) || (!currentPassward && newPassward)) {
            return res.status(400).json({error: "Please provide both current passward and new Passward"});
        }
        if(currentPassward && newPassward) {
            const isMatch = await bcrypt.compare(currentPassward, user.passward);
            if(!isMatch) return res.status(400).json({error: "Current passward is Incorrect"});
            if(newPassward.length < 6) return res.status(400).json({error: "Passward must be atleast 6 character long"});

            const salt = await bcrypt.genSalt(10);
            user.passward = await bcrypt.hash(newPassward, salt);
        }

        if(profileImg) {
            if(user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);
            }

            const uploadedResponse = await v2.uploader.upload(profileImg)
            profileImg = uploadedResponse.secure_url;
        }
        if(coverImg) {
            if(user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
            }

            const uploadedResponse = await v2.uploader.upload(coverImg)
            coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();
        user.passward = null

        return res.status(200).json(user)

    } 
    catch (error) {
        console.log("Error in updateUser ", error.message);
        res.status(500).json({error: error.message})
    }
}

module.exports = {
    getUserProfile,
    followUnfollowUser,
    getSuggestedUser,
    updateUser,
}