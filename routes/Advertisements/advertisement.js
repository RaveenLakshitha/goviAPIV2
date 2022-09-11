const express = require("express");
const {
  getAdds,
  getAdd,
  createAdd,
  updateAdd,
  deleteAdd,
  getUsersAdd,
  setPaymentStatus,
  setadvertisementStatus,
} = require("../../controllers/Advertisements/advertisements");
const { uploads3 } = require("../../middleware/imageupload");
const { protect } = require("../../middleware/auth");
const {
  notify,
} = require("../../middleware/Notifications/Adds/addCreatingNotification");

const router = express.Router();

router
  .route("/")
  .get(getAdds)
  .post(protect, uploads3.single("image"), createAdd, notify);
router.route("/getUsersAdd").get(protect, getUsersAdd);
router.route("/:id").get(getAdd).put(updateAdd).delete(deleteAdd);
router
  .route("/setadvertisementStatus/:id")
  .put(protect, setadvertisementStatus);
router.route("/setPaymentStatus/:id").put(protect, setPaymentStatus);

module.exports = router;
