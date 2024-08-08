const { Notification } = require("../models/notification.model")

const getNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({to: userId}).populate({
            path: "from",
            select: "username profileImg"
        });
        await Notification.updateMany({to: userId}, {read: true});
        res.status(200).json(notifications)
    } 
    catch (error) {
        console.log("Error in getNotification Function", error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}
const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({to: userId});

        res.status(200).json({message: "Notification Deleted Successfully"})
    } 
    catch (error) {
        console.log("Error in deleteNotification Function", error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}

module.exports = {
    getNotification,
    deleteNotification,
}