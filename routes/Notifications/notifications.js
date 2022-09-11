const express = require("express");
const { protect } = require("../../middleware/auth");
const {
  getNotifications,
  getSingleNotification,
  getUsersNotifications,
  getNotificationsCreatedByUser,
  getNotificationsSendByUser,
  createNotification,
  sendNotificationSingle,
  removeNotificationSingle,
  sendNotificationAll,
  removeNotificationAll,
  deleteNotification,
} = require("../../controllers/Notifications/notifications");

const router = express.Router();

router.route("/").get(getNotifications).post(protect, createNotification);
router.route("/getSingleNotification/:id").get(getSingleNotification);
router.route("/getUsersNotifications").get(protect, getUsersNotifications);
router
  .route("/getNotificationsCreatedByUser")
  .get(protect, getNotificationsCreatedByUser);
router
  .route("/getNotificationsSendByUser")
  .get(protect, getNotificationsSendByUser);
router
  .route("/sendNotificationSingle/:id")
  .put(protect, sendNotificationSingle);
router
  .route("/removeNotificationSingle/:id")
  .put(protect, removeNotificationSingle);
router.route("/sendNotificationAll/:id").put(protect, sendNotificationAll);
router.route("/removeNotificationAll/:id").put(protect, removeNotificationAll);
router.route("/deleteNotification/:id").delete(protect, deleteNotification);

module.exports = router;
