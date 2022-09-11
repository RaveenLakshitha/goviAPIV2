const express = require("express");
const { protect } = require("../../middleware/auth");
const {
  getAnswers,
  AddAnswer,
  AddVoteToAnswer,
  DownVoteToAnswer,
  RemoveAnswer,
  UpdateAnswer,
} = require("../../controllers/Forum/Answers");

const router = express.Router();

router.route("/getAnswers").get(getAnswers);
router.route("/addAnswer/:id").post(protect, AddAnswer);
router.route("/AddVoteToAnswer/:id").post(protect, AddVoteToAnswer);
router.route("/DownVoteFromAnswer/:id").put(protect, DownVoteToAnswer);
router.route("/UpdateAnswer/:id").put(UpdateAnswer);
router.route("/RemoveAnswer/:id").delete(RemoveAnswer);

module.exports = router;
