const express = require("express");
const {
  createCartItem,
  getCartItems,
  deleteCartItem,
  AddAmount,
  DownAmount,
  changePaymentOption,
  sendCartitemsToShopOrders,
} = require("../../controllers/Cart/cartItem");
const { protect } = require("../../middleware/auth");
const router = express.Router();

router.route("/").get(getCartItems);
router.route("/").post(protect, createCartItem);
router
  .route("/sendCartitemsToShopOrders")
  .post(protect, sendCartitemsToShopOrders);
router.route("/AddAmount/:id").post(protect, AddAmount);
router.route("/DownAmount/:id").post(protect, DownAmount);
router
  .route("/changePaymentOption/:id/:option")
  .post(protect, changePaymentOption);
router.route("/:id").delete(protect, deleteCartItem);

module.exports = router;
