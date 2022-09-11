const express = require("express");
const { protect } = require("../../middleware/auth");
const upload = require("../../middleware/upload");
const {
  getQuestions,
  getQuestion,
  AddQuestion,
  RemoveQuestion,
  UpdateQuestion,
  getUsersQuestions,
  getMyQuestions,
  UnblockQuestion,
  BlockQuestion,
  AddVoteToQuest,
  DownVoteFromQuest,
  updatePicture,
} = require("../../controllers/Forum/Questions");

const router = express.Router();

//################Get Qs,Get Qs by id,Get logged users Qs,Get Qs by Id,Get Qs of user
router.route("/").get(getQuestions);
router.route("/getQuestion/:id").get(getQuestion);
router.route("/getMyQuestions").get(protect, getMyQuestions);
router.route("/getUsersQuestions/:id").get(getUsersQuestions);
//################Get Qs,Get Qs by id,Get logged users Qs,Get Qs by Id,Get Qs of user
//################Add Qs
router
  .route("/AddQuestion")
  .post(protect, upload.single("QImage"), AddQuestion);
//################Add Qs
//################Upvote Q,Downvote Q

router.route("/AddVoteToQuest/:id").post(protect, AddVoteToQuest);
router.route("/DownVoteFromQuest/:id").post(protect, DownVoteFromQuest);

//################Upvote Q,Downvote Q
//################Update Q,Update ,Q picture
router.route("/UpdateQuestion/:id").put(UpdateQuestion);
router
  .route("/updatePicture")
  .post(protect, upload.single("QImage"), updatePicture);
//################Update Q,Update ,Q picture

//################Block Q,unblock Q,Remove Q
router.route("/BlockQuestion/:id").put(BlockQuestion);
router.route("/UnblockQuestion/:id").put(UnblockQuestion);
router.route("/RemoveQuestion/:id").delete(RemoveQuestion);

//################Block Q,unblock Q,Remove Q

module.exports = router;
