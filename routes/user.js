const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const router = express.Router();

router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;

/* 
router.get('/api/v1/auths',(req,res)=>{
  res.send('Hello');
  res.status(200).json({success:true,data:{name:}})
}) */
