const express = require("express");
const {
  getShopRatings,
  getItemRatings,
  getRentItemsRatings,
  getExpertsRatings,
  getProjectsRatings,
  getArchitectsRatings,
  createRating,
  deleteRating,
} = require("../controllers/rating");

const router = express.Router();
const { protect } = require("../middleware/auth");

router.route("/getShopRatings").get(getShopRatings);
router.route("/getItemRatings").get(getItemRatings);
router.route("/getRentItemsRatings").get(getRentItemsRatings);
router.route("/getExpertsRatings").get(getExpertsRatings);
router.route("/getProjectsRatings").get(getProjectsRatings);
router.route("/getArchitectsRatings").get(getArchitectsRatings);
router.route("/").post(protect, createRating);
router.route("/:id").delete(protect, deleteRating);

module.exports = router;
