const express = require("express");
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getImage,
  BlockItem,
  UnblockItem,
} = require("../../controllers/Items&Rent/item");
const { protect } = require("../../middleware/auth");
const { accessShop } = require("../../middleware/shopAuth");
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const router = express.Router();

const Grid = require("gridfs-stream");
var mongo = require("mongodb");
const crypto = require("crypto");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const conn = mongoose.connection;
const fs = require("fs");
const { uploads3 } = require("../../middleware/imageupload");

router
  .route("/")
  .get(getItems)
  .post(
    protect,
    uploads3.fields([
      {
        name: "thumbnail",
        maxCount: 1,
      },
      {
        name: "productPictures",
        maxCount: 5,
      },
    ]),
    createItem
  );
router
  .route("/:id")
  .get(getItem)
  .put(
    updateItem,
    (protect,
    uploads3.fields([
      {
        name: "thumbnail",
        maxCount: 1,
      },
      {
        name: "productPictures",
        maxCount: 5,
      },
    ]))
  )
  .delete(deleteItem);
router.route("/BlockItem/:id").put(protect, BlockItem);
router.route("/UnblockItem/:id").put(protect, UnblockItem);

module.exports = router;
