const Slot = require("../../../models/Experts/Appointments/slotsExpert");
const Appointment = require("../../../models/Experts/Appointments/appointmentsExpert");
const ErrorResponse = require("../../../utils/errorResponse");
const Expert = require("../../../models/Experts/experts");
const ArchitectRecords = require("../../../models/Statistics/ArchitectRecords");
//#################################### GEt all appointments,Get single Appointment By id #########################
//@desc     Get all appointments
//@route    Get /api/v1/appointments
//@access   Public
exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find();

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
    const appointment = await Appointment.findById(req.params.id);

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
//@desc     Get a appointment
//@route    Get /api/v1/appointments/:id
//@access   Public

exports.getUsersAppointments = async (req, res, next) => {
  try {
    const appointment = await Appointment.find({ user: req.user }).populate({
      path: "slot",
      populate: {
        path: "expertId",
        model: Expert,
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

    /*  const rec = await ArchitectRecords.create({ architect: slot.architectId });

    await Expert.findByIdAndUpdate(slot.expertId, {
      $push: { archiectRecords: rec },
    }); */

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
