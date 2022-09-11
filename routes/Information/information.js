const express = require("express");
const {
  getAllInfo,
  getInfo,
  createInfo,
  updateInfo,
  deleteInfo,
  updatePicture,
  setInfoVisibility,
  getInfoByCategory,
} = require("../../controllers/Information/information");
const upload = require("../../middleware/upload");
const { protect } = require("../../middleware/auth");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");

router.route("/").get(getAllInfo).post(upload.single("Image"), createInfo);
router.route("/getInfoByCategory/:id").get(getInfoByCategory);
router
  .route("/:id")
  .get(getInfo)
  .put(protect, upload.single("Image"), updateInfo)
  .delete(deleteInfo);
router.route("/setInfoVisibility/:id").put(protect, setInfoVisibility);

router
  .route("/updatePicture/:id")
  .put(protect, upload.single("Image"), updatePicture);

module.exports = router;
