const express = require("express");
const {
  getAppointmentSlots,
  getAppointmentSlot,
  getAppointmentSlotsByExpert,
  createAppointmentSlot,
  updateAppointmentSlot,
  deleteAppointmentSlot,
  BlockSlot,
  UnblockSlot,
} = require("../../../controllers/Experts/Appointmetns/slotsExpert");

const router = express.Router();
const { protect } = require("../../../middleware/auth");

router.route("/").get(getAppointmentSlots).post(protect, createAppointmentSlot);
router
  .route("/getAppointmentSlotsByExpert/:id")
  .get(getAppointmentSlotsByExpert);
router
  .route("/:id")
  .put(protect, updateAppointmentSlot)
  .delete(protect, deleteAppointmentSlot);
router.route("/:id").get(getAppointmentSlot);
router.route("/BlockSlot/:id").put(BlockSlot);
router.route("/UnblockSlot/:id").put(UnblockSlot);

module.exports = router;
