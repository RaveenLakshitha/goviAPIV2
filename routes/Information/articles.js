const express = require("express");
const {
  getAllArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleByInfoId,
} = require("../../controllers/Information/articles");

const { protect } = require("../../middleware/auth");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");
const upload = multer();

router.route("/").get(getAllArticles);
//router.route("/:id").post(createArticle);
router.route("/:id").post(
  upload.fields([
    {
      name: "Title",
      maxCount: 1,
    },
    {
      name: "Description",
      maxCount: 1,
    },
  ]),
  createArticle
);
router.route("/getArticleByInfoId/:id").get(getArticleByInfoId);
router.route("/:id").get(getArticle).put(updateArticle).delete(deleteArticle);

module.exports = router;
