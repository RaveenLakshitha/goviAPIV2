const express = require("express");
const {
  getExperts,
  getExpert,
  createExpert,
  updateExpert,
  deleteExpert,
  getUsersExpertProfile,
  setExpertStatus,
  getExpertsNearby,
} = require("../../controllers/Experts/experts");
const { uploads3 } = require("../../middleware/imageupload");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const {
  notify,
  createnotify,
} = require("../../middleware/Notifications/Experts/expertCreatingNotification");
router
  .route("/")
  .get(getExperts)
  .post(
    protect,
    uploads3.fields([
      {
        name: "proofDocuments",
        maxCount: 2,
      },
    ]),
    createExpert,
    createnotify
  );
router.route("/radius/:latitude/:longitude/:distance").get(getExpertsNearby);
router.route("/setExpertStatus/:id").put(protect, setExpertStatus);
router.route("/getUsersExpertProfile").get(protect, getUsersExpertProfile);
router.route("/:id").put(updateExpert).delete(deleteExpert);
router.route("/:id").get(getExpert);

module.exports = router;
