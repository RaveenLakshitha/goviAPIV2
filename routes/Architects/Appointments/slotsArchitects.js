const express = require("express");
const {
  getAppointmentSlots,
  getAppointmentSlot,
  getAppointmentSlotsByArchitect,
  createAppointmentSlot,
  updateAppointmentSlot,
  deleteAppointmentSlot,
  BlockSlot,
  UnblockSlot,
} = require("../../../controllers/Architects/Appointmetns/slotsArchitect");

const router = express.Router();
const { protect } = require("../../../middleware/auth");

router.route("/").get(getAppointmentSlots).post(protect, createAppointmentSlot);
router
  .route("/getAppointmentSlotsByArchitect/:id")
  .get(getAppointmentSlotsByArchitect);
router
  .route("/:id")
  .put(protect, updateAppointmentSlot)
  .delete(protect, deleteAppointmentSlot);
router.route("/:id").get(getAppointmentSlot);
router.route("/BlockSlot/:id").put(BlockSlot);
router.route("/UnblockSlot/:id").put(UnblockSlot);

module.exports = router;
