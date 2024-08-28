const { User } = require("../models/user.model");
const jwt = require('jsonwebtoken');

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({error: "Unathorized: No token provided"})
        }  

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({error: "Unathorized: Invalid Token"});
        }
        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(404).json({error: "User not found"})
        }
        req.user = user;
        next();
    } 
    catch (err) {
        console.log("Error in protectRoute middleware", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {
    protectRoute,
}