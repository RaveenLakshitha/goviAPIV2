const express = require("express");
const {
  getOrders,
  addOrderToShop,
  getUnpaidShopOrdersByUser,
  getUnpaidShopOrdersByAdmin,
  getShopOrders,
  getUsersOrders,
  getUndeliveredShopOrdersByShop,
  payUnpaidShopOrdersByUser,
  sendUndeliveredShopOrdersByShop,
  ChangeShopOrderStatus,
  getCODShopOrders,
  getTakeawayShopOrders,
  //removeOrder,
} = require("../../controllers/Orders/shopOrders");
const { protect } = require("../../middleware/auth");
const router = express.Router();

router.route("/").get(getOrders);
router.route("/:id").post(protect, addOrderToShop);
router.route("/getShopOrders").get(protect, getShopOrders);
router.route("/getCODShopOrders").get(protect, getCODShopOrders);
router.route("/getTakeawayShopOrders").get(protect, getTakeawayShopOrders);
router
  .route("/getUnpaidShopOrdersByUser")
  .get(protect, getUnpaidShopOrdersByUser);
router.route("/getUnpaidShopOrdersByAdmin").get(getUnpaidShopOrdersByAdmin);
router
  .route("/getUndeliveredShopOrdersByShop")
  .get(getUndeliveredShopOrdersByShop);
router.route("/getUsersOrders").get(protect, getUsersOrders);
router
  .route("/payUnpaidShopOrdersByUser/:id")
  .put(protect, payUnpaidShopOrdersByUser);
router
  .route("/sendUndeliveredShopOrdersByShop/:id")
  .put(sendUndeliveredShopOrdersByShop);
router.route("/ChangeShopOrderStatus/:id").put(protect, ChangeShopOrderStatus);
//router.route("/removeOrder/:id").post(protect, removeOrder);

module.exports = router;
