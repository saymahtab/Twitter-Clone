const { generateTokenAndSetCookie } = require("../lib/utils/generateToken");
const { User } = require("../models/user.model");
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    try {
		const { fullName, userName, email, password } = req.body;

        if (!userName || !fullName || !password || !email) {
            return res.status(400).json({ error: "All fields are required" });
        }

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		const existingUser = await User.findOne({ userName });
		if (existingUser) {
			return res.status(400).json({ error: "UserName is already taken" });
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email is already taken" });
		}

		if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			fullName,
			userName,
			email,
			password: hashedPassword,
		});

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				userName: newUser.userName,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} 
    catch (error) {

		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

const login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const user = await User.findOne({ userName });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        if(!user || !isPasswordCorrect) {
            return res.status(404).json({error: "Invalid username or passward"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        })
    } 
    catch (err) {
        console.log("Error in login controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const logout = async (req, res) => {
    try {
        res.cookie('jwt',"", {maxAge: 0})
        res.status(200).json({message: "Logged out successfully"})
    } 
    catch (err) {
        console.log("Error in logout controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        res.status(200).json(user);
    } 
    catch (err) {
        console.log("Error in getMe controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {
    signup,
    login,
    logout,
    getMe,
}