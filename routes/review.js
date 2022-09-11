const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getUsersReviews,
} = require("../controllers/reviews");

const router = express.Router();
const { protect } = require("../middleware/auth");

router.route("/").get(getReviews).post(protect, createReview);
router.route("/getUsersReview").get(protect, getUsersReviews);
router.route("/:id").put(updateReview).delete(deleteReview);

module.exports = router;
