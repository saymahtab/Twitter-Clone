const { Router } = require('express');
const { protectRoute } = require('../middleware/protectRoute');
const { getNotification, deleteNotification } = require('../controllers/notification.controller');

const notificationRoutes = Router();

notificationRoutes.get('/', protectRoute, getNotification)
notificationRoutes.delete('/', protectRoute, deleteNotification)

module.exports = {
    notificationRoutes,
}