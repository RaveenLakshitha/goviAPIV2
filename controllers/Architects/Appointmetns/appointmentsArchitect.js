const Slot = require("../../../models/Architects/Appointments/slotsArchitects");
const Appointment = require("../../../models/Architects/Appointments/appointmentsArchitects");
const ErrorResponse = require("../../../utils/errorResponse");
const ArchitectRecords = require("../../../models/Statistics/ArchitectRecords");
const Architect = require("../../../models/Architects/architect");
//#################################### GEt all appointments,Get single Appointment By id #########################
//@desc     Get all appointments
//@route    Get /api/v1/appointments
//@access   Public
exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find().populate("user");

    res
      .status(200)
      .json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a appointment
//@route    Get /api/v1/appointments/:id
//@access   Public

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "user"
    );

    if (!appointment) {
      return next(
        new ErrorResponse(
          `Appointment not Found With id of ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a shop
//@route    Get /api/v1/shops/:id
//@access   Public
exports.getUsersAppointments = async (req, res, next) => {
  try {
    const appointment = await Appointment.find({ user: req.user })
      .populate("slot")
      .populate({
        path: "slot",
        populate: {
          path: "architectId",
          model: Architect,
        },
      });
    if (!appointment) {
      return next(
        new ErrorResponse(
          `Appointmenst not Found With user ${req.user.id} id`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//#################################### GEt all appointments,Get single Appointment By id #########################
//#################################### Create appointment #########################

//@desc     Create a appointment
//@route    Post /api/v1/appointments
//@access   Public
exports.createAppointment = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    req.body.slot = req.params.id;
    const appointment = await Appointment.create(req.body);
    const slot = await Slot.findByIdAndUpdate(req.params.id, {
      $push: {
        appointments: appointment.id,
      },
    });

    const rec = await ArchitectRecords.create({ architect: slot.architectId });

    await Architect.findByIdAndUpdate(slot.architectId, {
      $push: { archiectRecords: rec },
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#################################### Create appointment #########################
//#################################### Update appointment #########################
//@desc     Update a appointment
//@route    Put /api/v1/appointments
//@access   Public
exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!appointment) {
      return next(
        new ErrorResponse(
          `Appointment not Found With id of ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//#################################### Update appointment #########################
//#################################### Delete appointment #########################
//@desc     Delete appointment
//@route    Delete /api/v1/shops
//@access   Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    const delappointment = await Appointment.findByIdAndDelete(req.params.id);
    await Slot.findByIdAndUpdate(req.params.id, {
      $pull: { shopAppointments: req.params.id },
    });

    if (!delappointment) {
      return next(
        new ErrorResponse(
          `Appointment not Found With id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//#################################### Delete appointment #########################
