const express = require("express");
const { protect } = require("../../middleware/auth");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  hideCategory,
  showCategory,
  getCategoryByParent,
} = require("../../controllers/Categories/infoCategory");
const { uploads3 } = require("../../middleware/imageupload");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(protect, uploads3.single("image"), createCategory);
router
  .route("/:id")
  .put(protect, uploads3.single("image"), updateCategory)
  .delete(protect, deleteCategory);
router.route("/getCategory/:id").get(getCategory);
router.route("/getCategoryByParent/:id").get(getCategoryByParent);
router.route("/showCategory/:id").put(protect, showCategory);
router.route("/hideCategory/:id").put(protect, hideCategory);

module.exports = router;
