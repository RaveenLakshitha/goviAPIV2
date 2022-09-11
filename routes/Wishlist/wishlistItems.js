const express = require("express");
const {
  createListItem,
  getListItems,
  deleteListItem,
} = require("../../controllers/Wishlist/wishlistItems");
const { protect } = require("../../middleware/auth");
const router = express.Router();

router.route("/").get(getListItems).post(protect, createListItem);
router.route("/:id").delete(protect, deleteListItem);

module.exports = router;
