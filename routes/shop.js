const express = require("express");
const {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
  getUsersShop,
  setShopStatus,
  getShopsNearby,
  updateUsersShop,
  updateShopProfilePicture,
} = require("../controllers/shop");
const upload = require("../middleware/upload");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { uploads3 } = require("../middleware/imageupload");
const {
  notify,
  createnotify,
} = require("../middleware/Notifications/Shop/shopCreatingNotification");
const {
  updateNotify,
} = require("../middleware/Notifications/Shop/shopUpdateNotify");
const {
  visibilityChangedNotify,
} = require("../middleware/Notifications/Shop/shopVisibilityUpdate");
router
  .route("/")
  .get(protect, getShops)
  //.post(protect, upload.single("profilePicture"), createShop);

  .post(
    protect,
    uploads3.fields([
      {
        name: "profilePicture",
        maxCount: 1,
      },
      {
        name: "shopImages",
        maxCount: 3,
      },
      {
        name: "proofDocuments",
        maxCount: 2,
      },
    ]),
    createShop,
    createnotify
  );
// .post(protect, uploads3.array("shopFiles"), createShop);
router.route("/radius/:latitude/:longitude/:distance").get(getShopsNearby);
router
  .route("/setShopVisibility/:id")
  .put(protect, setShopStatus, visibilityChangedNotify);
router.route("/getUsersShop").get(protect, getUsersShop);
router
  .route("/:id")
  .put(
    updateShop,
    uploads3.fields([
      {
        name: "profilePicture",
        maxCount: 1,
      },
      {
        name: "shopImages",
        maxCount: 3,
      },
      {
        name: "proofDocuments",
        maxCount: 2,
      },
    ])
  )
  .delete(deleteShop);
router.route("/updateUsersShop").post(
  protect,
  uploads3.fields([
    {
      name: "profilePicture",
      maxCount: 1,
    },
    {
      name: "shopImages",
      maxCount: 3,
    },
    {
      name: "proofDocuments",
      maxCount: 2,
    },
  ]),
  updateUsersShop,
  updateNotify
);
/* router
  .route("/updateShopProfilePicture")
  .post(protect, upload.single("userImage"), updateShopProfilePicture); */
router.route("/:id").get(protect, getShop);

module.exports = router;
