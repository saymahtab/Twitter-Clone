const { Router } = require('express');
const { protectRoute } = require('../middlewares/protectRoute');
const { getNotifications, deleteNotifications } = require('../controllers/notification.controller');

const notificationRoutes = Router();

notificationRoutes.get('/', protectRoute, getNotifications)
notificationRoutes.delete('/', protectRoute, deleteNotifications)

module.exports = {
    notificationRoutes,
}