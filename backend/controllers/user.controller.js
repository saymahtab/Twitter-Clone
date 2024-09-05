const { Notification } = require("../models/notification.model");
const { User } = require("../models/user.model");

const bcrypt = require('bcryptjs')
const { v2: cloudinary } = require('cloudinary');

const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ userName: username }).select("-password")
        if(!user) return res.status(404).json({error: "User Not Found"})
        res.status(200).json(user);
    } 
    catch (err) {
        console.log("Error in getProfile controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()) {
            return res.status(400).json({error: "You can't Follow/Unfollow yourself"});
        }
        if(!userToModify || !currentUser) {
            return res.status(400).json({error: "User not found"})
        }
        const isFollowing = currentUser.following.includes(id);
        if(isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id} });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

            res.status(200).json({message: "User Unfollowed Successfully"})
        }
        else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id} });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            const newNotification = new Notification({
                from: req.user._id,
                to: id,
                type: 'follow'
            });
            await newNotification.save();

            res.status(200).json({message: "User Followed Successfully"})
        }
    } 
    catch (error) {
        console.log("Error in followUnfollowUser controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const getSuggestedUsers = async (req, res) => {
    try {
       const userId = req.user._id;
       
       const usersFollowedByMe = await User.findById(userId).select('following');

       const users = await User.aggregate([
        {
            $match: {
                _id: {$ne: userId}
            },
        },
        {$sample: {size: 10}}
       ])

       const filteredUser = users.filter(user => !usersFollowedByMe.following.includes(user._id))
       const SuggestedUsers = filteredUser.slice(0, 4);

       SuggestedUsers.forEach(user => user.password = null);

       res.status(200).json(SuggestedUsers);
    }
    catch (err) {
        console.log("Error in getSuggestedUsers controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const updateUser = async (req, res) => {
    const { userName, fullName, currentPassword, email, newPassword, bio, link} = req.body;
    let { profileImg, coverImg} = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});

        if((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({error: "Please provide both current password and new passward"});
        }
        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) return res.status(400).json({ error: "Current password is incorrect"});

            if(newPassword.length < 6) {
                return res.status(400).json({error: "Password must be at least 6 characters long"});
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if(profileImg) {
            if(user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }

        if(coverImg) {
            if(user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.userName = userName || user.userName;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password = null;

        return res.status(200).json(user);

    }
    catch (err) {
        console.log("Error in update controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }

}

module.exports = {
    getUserProfile,
    followUnfollowUser,
    getSuggestedUsers,
    updateUser,
}