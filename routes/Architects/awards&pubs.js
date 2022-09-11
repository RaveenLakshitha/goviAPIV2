const express = require("express");
const {
  getAwards,
  getAward,
  createAward,
  updateAward,
  deleteAward,
} = require("../../controllers/Architects/awards&pubs");
const { protect } = require("../../middleware/auth");
const { accessArchitect } = require("../../middleware/architectAuth");
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");

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
  .get(getAwards)
  .post(
    protect,
    uploads3.fields([
      {
        name: "gallery",
        maxCount: 5,
      },
    ]),
    createAward
  );
router.route("/:id").get(getAward).put(updateAward).delete(deleteAward);

module.exports = router;
