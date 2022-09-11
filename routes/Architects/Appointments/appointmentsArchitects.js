const express = require("express");
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getUsersAppointments,
} = require("../../../controllers/Architects/Appointmetns/appointmentsArchitect");

const router = express.Router();
const { protect } = require("../../../middleware/auth");

router.route("/").get(getAppointments);
router.route("/getUsersAppointments").get(protect, getUsersAppointments);
router.route("/:id").post(protect, createAppointment);
/* router.route("/getUsersAppointments").get(protect, getUsersAppointments); */
router.route("/:id").put(updateAppointment).delete(deleteAppointment);
router.route("/:id").get(getAppointment);
module.exports = router;
