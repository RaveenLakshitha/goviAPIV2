const express = require("express");
const {
  addItemToCart,
  getCarts,
  getUsersCart,
} = require("../../controllers/Cart/cart");

const router = express.Router();
const { protect } = require("../../middleware/auth");

router.route("/").get(getCarts);
router.route("/getUsersCart").get(protect, getUsersCart);
router.route("/").post(protect, addItemToCart);

module.exports = router;
