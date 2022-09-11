const express = require("express");
const {
  createUser,
  loginUser,
  getMe,
  getUsers,
  signoutUser,
  getSingleUser,
  getImage,
  updateProfilePic,
  updateUser,
  deleteUser,
  createAdmin,
  loginExpert,
  getExperts,
  forgotPassword,
  resetPassword,
  updateLoggedUser,
  setUserStatus,
  updateUserProfilePicture,
  getOwners,
} = require("../controllers/auth");

const router = express.Router();
const { protect } = require("../middleware/auth");
const { mailchecker } = require("../middleware/mailchecker");
const crypto = require("crypto");
const mongoose = require("mongoose");

/* const multerS3 = require("multer-s3");
const AWS = require("aws-sdk"); */
const { uploads3 } = require("../middleware/imageupload");
/* const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads/users"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
}); */

//////////////////////////////////////////
/* const s3 = new AWS.S3({
  accessKeyId: "AKIAZ2TS2LCDPED367CE",
  secretAccessKey: "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",
});

//const upload = multer({ storage });
const uploads3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "govibucket01",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldname: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, shortid.generate() + "-" + file.originalname);
    },
  }),
});
 */
//router.route("/register").post(createUser);
router.route("/register").post(uploads3.single("profilePicture"), createUser);
router.route("/createAdmin").post(protect, createAdmin);
//router.route("/login").post(mailchecker, loginUser);
router.route("/login").post(loginUser);

router.route("/forgotPassword").post(forgotPassword);
router.route("/getLoggedUser").get(protect, getMe);
router.route("/getOwners/:owns").get(getOwners);
router
  .route("/updateLoggedUser")
  .post(protect, uploads3.single("profilePicture"), updateLoggedUser);
router
  .route("/updateUserProfilePicture")
  .post(protect, uploads3.single("profilePicture"), updateUserProfilePicture);
router.route("/getUsers").get(getUsers);

router.route("/signoutUser").post(signoutUser);
router.route("/getSingleUserById/:id").get(getSingleUser);

router
  .route("/updateProfilePic/:id")
  .put(uploads3.single("profilePicture"), updateProfilePic);
router.route("/:id").put(updateUser);
router.route("/:id").delete(deleteUser);
router.route("/resetpassword/:resettoken").post(resetPassword);
router.route("/setUserVisibility/:id").put(protect, setUserStatus);
//router.route("/checkusername/:id").get(getSingleUser);

module.exports = router;
