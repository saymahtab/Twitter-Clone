
const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notification = await Notification.find({ to: userId }).populate({
            path: 'from',
            select: 'userName profileImg'
        })

        await Notification.updateMany({to: userId}, {read: true});

        res.status(200).json(notification);
    } 
    catch (err) {
        console.log("Error in getNotifications controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({to: userId})

        res.status(200).json({message: "Notification deleted successfully"});
    } 
    catch (err) {
        console.log("Error in deleteNotification controller", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {
    getNotifications,
    deleteNotifications,
}