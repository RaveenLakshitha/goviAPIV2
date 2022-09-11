//const asyncHandler = require("../middleware/async");

const Expert = require("../../models/Experts/experts");
const user = require("../../models/user");
const ErrorResponse = require("../../utils/errorResponse");
const geocoder = require("../../utils/geocoder");
const notification = require("../../models/Notifications/notifications");
//####################################Get all Architects,Get logged usrs profile,Get profile by id,Get nearby architects##################
//####################################Create Architect##################
//####################################Update Architect##################
//####################################Delete Architect,set profile visibility##################
//@desc     Get all experts
//@route    Get /api/v1/experts
//@access   Public
exports.getExperts = async (req, res, next) => {
  try {
    const experts = await Expert.find().populate("user");
    /*  .populate("user")
      .populate("appointmentSlots", { description: 1, date: 1, time: 1 })
      .populate("mentions")
      .populate("expertReviews"); */
    res
      .status(200)
      .json({ success: true, count: experts.length, data: experts });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a expert
//@route    Get /api/v1/experts/:id
//@access   Public
exports.getUsersExpertProfile = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.user.expertId, {
      expertVisibility: "Active",
    })
      .populate("user")
      .populate("mentions")
      .populate("user")
      .populate("appointmentSlots", { description: 1, date: 1, time: 1 })
      .populate("expertReviews");
    if (!expert) {
      return next(
        new ErrorResponse(`Expert not Found With id of ${req.user.id}`, 404)
      );
    }

    res
      .status(200)
      // .json({ success: true, data: expert, items: expert.items, expertToken });
      .json({ success: true, data: expert });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a expert
//@route    Get /api/v1/experts/:id
//@access   Public
exports.getExpert = async (req, res, next) => {
  try {
    if (req.user.role == "Admin") {
      const expert = await Expert.findOne({
        user: req.user.id,
      })
        .populate("user")
        .populate("mentions")
        .populate("appointments")
        .populate("expertReviews");
      if (!expert) {
        return next(
          new ErrorResponse(`Expert not Found With id of ${req.user.id}`, 404)
        );
      }
    } else {
      const expert = await Expert.findOne({
        user: req.user.id,
        expertVisibility: "Active",
      })
        .populate("user")
        .populate("mentions")
        .populate("appointments")
        .populate("expertReviews");
      if (!expert) {
        return next(
          new ErrorResponse(`Expert not Found With id of ${req.user.id}`, 404)
        );
      }
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Create a expert
//@route    Post /api/v1/experts
//@access   Public
exports.createExpert = async (req, res, next) => {
  try {
    //###############Add image#######################

    if (req.files.proofDocuments) {
      let proofDocuments = [];
      if (req.files.proofDocuments.length > 0) {
        proofDocuments = req.files.proofDocuments.map((file) => {
          return { img: file.location };
        });
      }
      req.body.proofDocuments = proofDocuments;
    }

    //###############Add image#######################
    //Add long and lat into body
    console.log(req.body.professionalemailaddress);
    console.log(req.body);
    if (req.body.longitude && req.body.latitude) {
      req.body.location = {
        type: "Point",
        coordinates: [req.body.longitude, req.body.latitude],
      };
    }
    const User = await user.findById(req.user.id);
    req.body.userName = User.userName;
    req.body.profilePicture = User.profilePicture;
    //Add user to req.body
    req.body.user = req.user.id;

    //Check for published expert
    const createdExpert = await Expert.findOne(
      { user: req.user.id },
      { expertVisibility: ["Active", "Suspend", "Pending"] }
    );

    //Admin can add more experts
    if (createdExpert && req.user.role !== "Admin") {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.id} has already published a expert profile`,
          400
        )
      );
    }
    /* //#######################Send admin notification###########################
    //Create notificatioon
    const notifybody = {
      Title: "Expert profile creating Request",
      Description: `Expert profile ${architect.id} requested from user ${req.user.id}`,
      DateAndTime: Date.now(),
    };
    const not = await notification.create(notifybody);
    var notify = "Send";
    //Set status as sent in notifications
    const Notification = await notification.findByIdAndUpdate(
      { _id: not._id },
      {
        status: "Sent",
      },
      { new: true }
    );

    const users = await user.find({ role: "Admin" });
    const admins = [];
    console.log(users);

    for (const admin of users) {
      // const { path } = admin;
      admins.push(admin.id);
    }
    console.log("################");
    console.log(admins);
    //Update all admins notifications
    await user.updateMany(
      { role: "Admin" },
      {
        $push: {
          notifications: Notification.id,
        },
      },
      { new: true }
    );

    //
    const updated = await notification.findByIdAndUpdate(
      not._id,
      {
        $push: {
          user: admins,
        },
      },
      { new: true }
    );

    //#######################Send admin notification###########################
 */
    const expert = await Expert.create(req.body);
    await user.findByIdAndUpdate(req.user.id, {
      expertId: expert.id,
    });
    req.expert = expert.id;
    next();
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Update a expert
//@route    Put /api/v1/experts
//@access   Public
exports.updateExpert = async (req, res, next) => {
  try {
    const expert = await Expert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!expert) {
      return next(
        new ErrorResponse(`Expert not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: expert });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Delete a expert
//@route    Delete /api/v1/experts
//@access   Private
exports.deleteExpert = async (req, res, next) => {
  try {
    await user.findOneAndUpdate(
      { expertId: req.params.id },
      {
        $set: { expertId: null },
      },
      { new: true }
    );
    const expert = await Expert.findByIdAndDelete(req.params.id);

    if (!expert) {
      return next(
        new ErrorResponse(`Expert not Found With id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a expert within Radius
//@route    Get /api/v1/experts/radius/:latitude/:longitude
//@access   Private
exports.getExpertsNearby = async (req, res, next) => {
  try {
    const { latitude, longitude, distance } = req.params;
    /* lat - 6.635889372825712 ,lon - 80.71250331797633  */
    const loc = await geocoder.reverse({
      lat: latitude,
      lon: longitude,
    });
    console.log(loc);
    const lat = loc[0].latitude;
    const long = loc[0].longitude;

    const radius = distance / 3963;
    const experts = await Expert.find({
      location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
    });
    res
      .status(200)
      .json({ success: true, count: experts.length, data: experts });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

/* 
//@desc     Get all experts
//@route    Get /api/v1/experts
//@access   Public
exports.getExperts = asyncHandler( async (req, res, next) => {
    const experts = await Expert.find();
    res.status(200).json({ success: true, count: experts.length, data: experts });
  } 
); */

//@desc     Update expert visibility
//@route    Put /api/v1/experts
//@access   Public
exports.setExpertStatus = async (req, res, next) => {
  try {
    if (req.user.role === "Admin") {
      //Block,Unblock,Approve,Decline,
      if (req.body.status === "Approve") {
        const expert = await Expert.findByIdAndUpdate(req.params.id, {
          $set: { expertVisibility: "Active" },
        });

        if (!expert) {
          return next(
            new ErrorResponse(
              `Expert not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        await user.findByIdAndUpdate(expert.user, {
          $set: { expertId: expert.id },
        });
        res.status(200).json({ success: true, data: expert });
      }
      if (req.body.status === "Unblock") {
        const expert = await Expert.findByIdAndUpdate(req.params.id, {
          $set: { expertVisibility: "Active" },
        });

        if (!expert) {
          return next(
            new ErrorResponse(
              `Expert not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        res.status(200).json({ success: true, data: expert });
      }
      if (req.body.status === "Block") {
        const expert = await Expert.findByIdAndUpdate(req.params.id, {
          $set: { expertVisibility: "Suspend" },
        });

        if (!expert) {
          return next(
            new ErrorResponse(
              `Expert not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        res.status(200).json({ success: true, data: expert });
      }
      if (req.body.status === "Decline") {
        const expert = await Expert.findByIdAndUpdate(req.params.id, {
          $set: { expertVisibility: "Declined" },
        });

        if (!expert) {
          return next(
            new ErrorResponse(
              `Expert not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        res.status(200).json({ success: true, data: expert });
      }
    } else {
      return next(new ErrorResponse(`${req.user.userName} not an Admin`, 404));
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
