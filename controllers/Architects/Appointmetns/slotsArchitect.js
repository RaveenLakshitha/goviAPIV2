const Slot = require("../../../models/Architects/Appointments/slotsArchitects");
const appointment = require("../../../models/Architects/Appointments/appointmentsArchitects");
const Architect = require("../../../models/Architects/architect");
const ErrorResponse = require("../../../utils/errorResponse");

//#################################### GEt all items,Get single Item By id #########################
//@desc     Get all items
//@route    Get /api/v1/items
//@access   Public
exports.getAppointmentSlots = async (req, res, next) => {
  try {
    /* if(req.user.role=="Admin"){}else{} */
    const slots = await Slot.find().populate("architectId");
    //.populate("shopId", { shopName: 1, email: 1 })
    res.status(200).json({ success: true, count: slots.length, data: slots });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a item
//@route    Get /api/v1/items/:id
//@access   Public

exports.getAppointmentSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return next(
        new ErrorResponse(`Slot not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: slot });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Get a item
//@route    Get /api/v1/items/:id
//@access   Public

exports.getAppointmentSlotsByArchitect = async (req, res, next) => {
  try {
    const slot = await Slot.find({
      architectId: req.params.id,
    }).populate("appointments");

    if (!slot) {
      return next(
        new ErrorResponse(
          `Slots not Found With Architect id of ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: slot });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#################################### GEt all items,Get single Item By id #########################
//#################################### Create item #########################

//@desc     Create a item
//@route    Post /api/v1/items
//@access   Public
exports.createAppointmentSlot = async (req, res, next) => {
  try {
    const profile = await Architect.findOne({ user: req.user.id });
    if (!profile) {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.id} dont have a profile`,
          400
        )
      );
    }

    req.body.architectId = req.user.architectId;
    req.body.userId = req.user.id;

    const slot = await Slot.create(req.body);
    await Architect.findByIdAndUpdate(req.user.architectId, {
      $push: {
        appointmentSlots: slot.id,
      },
    });

    res.status(201).json({ success: true, data: slot });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#################################### Create item #########################
//#################################### Update item #########################
//@desc     Update a item
//@route    Put /api/v1/items
//@access   Public
exports.updateAppointmentSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!slot) {
      return next(
        new ErrorResponse(`Slot not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: slot });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//#################################### Update item #########################
//#################################### Delete item #########################
//@desc     Delete item
//@route    Delete /api/v1/shops
//@access   Private
exports.deleteAppointmentSlot = async (req, res, next) => {
  try {
    const profile = await Architect.findOne({ user: req.user.id });
    if (!profile) {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.id} dont have a profile`,
          400
        )
      );
    }
    const slot = await Slot.findByIdAndDelete(req.params.id);
    await Architect.findByIdAndUpdate(req.user.architectId, {
      $pull: { appointmentSlots: req.params.id },
    });

    if (!slot) {
      return next(
        new ErrorResponse(`Slot not Found With id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//#################################### Delete item #########################
//#######################################Block item,Unblock item###############################
//@desc     Block Answer
//@route    Post /api/v1/Forum/BlockAnswer/:id
//@access   Private
exports.BlockSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      {
        $set: { avialability: false },
      },
      { new: true }
    );

    if (!slot) {
      return next(
        new ErrorResponse(`Slot not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: slot.avialability });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Unblock Answer
//@route    Post /api/v1/Forum/UnblockAnswer/:id
//@access   Private
exports.UnblockSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      {
        $set: { avialability: true },
      },
      { new: true }
    );

    if (!slot) {
      return next(
        new ErrorResponse(`Slot not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: slot.avialability });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
