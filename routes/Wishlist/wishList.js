const express = require("express");
const {
  getLists,
  getUsersList,
} = require("../../controllers/Wishlist/wishlists");

const router = express.Router();
const { protect } = require("../../middleware/auth");

router.route("/").get(getLists);
router.route("/getUsersList").get(protect, getUsersList);

module.exports = router;
