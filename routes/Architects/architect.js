const express = require("express");
const {
  getArchitects,
  getArchitect,
  createArchitect,
  updateArchitect,
  deleteArchitect,
  getUsersArchitect,
  setArchitectStatus,
  getArchitectsNearby,
  getUsersArchitectAppointmentsGraph,
  getArchiRecords,
  updateArchitectProfile,
} = require("../../controllers/Architects/architect");
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");
const upload = multer();
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { uploads3 } = require("../../middleware/imageupload");
router
  .route("/")
  .get(protect, getArchitects)
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
    createArchitect
  );

router.route("/updateArchitectProfile").post(
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
  updateArchitectProfile
);
//router.route("/:id").get(getArchitect);
router.route("/radius/:latitude/:longitude/:distance").get(getArchitectsNearby);
router.route("/getArchiRecords").get(getArchiRecords);
router.route("/setArchitectStatus/:id").put(protect, setArchitectStatus);
router.route("/getUsersArchitect").get(protect, getUsersArchitect);
router
  .route("/getUsersArchitectAppointmentsGraph")
  .get(protect, getUsersArchitectAppointmentsGraph);
router.route("/:id").put(
  uploads3.fields([
    {
      name: "services",
      maxCount: 5,
    },
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
  updateArchitect
);

router.route("/delete/:id/:userId").delete(deleteArchitect);

module.exports = router;
