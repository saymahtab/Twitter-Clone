const { User } = require("../backend/models/user.model");
const jwt = require('jsonwebtoken')

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({error: "Unauthorized: No Token Provided"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(400).json({error: "Unauthorized: Invalid Token"})
        }
        const user = await User.findById(decoded.userId).select("-passward")

        if(!user) {
            res.status(404).json({error: "User not Found"});
        }
        req.user = user;
        next();
    } 
    catch (err) {
        console.log("Error in protectRoute Middleware", err.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

module.exports = {
    protectRoute,
}