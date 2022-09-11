//const asyncHandler = require("../middleware/async");
const awards = require("../../models/Architects/awards&pubs");
const pubs = require("../../models/Architects/projects");
const Architect = require("../../models/Architects/architect");
const user = require("../../models/user");
const ErrorResponse = require("../../utils/errorResponse");
const geocoder = require("../../utils/geocoder");
const notification = require("../../models/Notifications/notifications");
const ArchitectRecords = require("../../models/Statistics/ArchitectRecords");
const mongoose = require("mongoose");
//####################################Get all Architects,Get logged usrs profile,Get profile by id,Get nearby architects##################

//@desc     Get all architects
//@route    Get /api/v1/architects
//@access   Public
exports.getArchitects = async (req, res, next) => {
  try {
    console.log(req.user);
    if (!req.user) {
      return next(new ErrorResponse(`Not authorize to access`, 404));
    }
    if (req.user.role == "Admin") {
      const architects = await Architect.find();
      /* .populate("user")
        .populate("awards")
        .populate("projects")
        .populate("appointmentSlots")
        .populate("archiectReviews"); */
      res
        .status(200)
        .json({ success: true, count: architects.length, data: architects });
    } else {
      const architects = await Architect.find({ architectVisibility: "Active" })
        .populate("user")
        .populate("awards")
        .populate("projects")
        .populate("appointmentSlots")
        .populate("archiectReviews");
      res
        .status(200)
        .json({ success: true, count: architects.length, data: architects });
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
exports.getArchiRecords = async (req, res, next) => {
  try {
    const records = await ArchitectRecords.find();
    res.status(200).json({ success: true, data: records });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a architect
//@route    Get /api/v1/architects/:id
//@access   Public
exports.getUsersArchitectAppointmentsGraph = async (req, res, next) => {
  try {
    var apps = [];
    const architect = await Architect.findOne({
      user: req.user.id,
    });
    if (!architect) {
      return next(
        new ErrorResponse(`Architect not Found With id of ${req.user.id}`, 404)
      );
    }
    apps = architect.archiectRecords;
    const archi = await Architect.findOne({ user: req.user._id });
    var arr = await ArchitectRecords.aggregate([
      {
        $match: {
          architect: archi._id,
        },
      },
      {
        $group: {
          _id: {
            truncatedOrderDate: {
              $dateTrunc: {
                date: "$createdAt",
                unit: "week",
                binSize: 2,
              },
            },
            architect: archi._id,
          },
          NoOfAppontments: { $sum: "$numofAppointments" },
        },
      },
    ]);
    console.log(arr);

    /* 
   Get data of past 7 days
   var d = new Date();
    d.setDate(d.getDate() - 7);

    const data = await ArchitectRecords.find({ createdAt: { $gt: d } });
    console.log(data); */

    res.status(200).json({ success: true, data: arr });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Get a architect
//@route    Get /api/v1/architects/:id
//@access   Public
exports.getUsersArchitect = async (req, res, next) => {
  try {
    const architect = await Architect.findOne({
      user: req.user.id,
    })
      .populate("user")
      .populate("appointmentSlots", { description: 1, date: 1, time: 1 })
      .populate("user")
      .populate("awards")
      .populate("projects");

    if (!architect) {
      return next(
        new ErrorResponse(`Architect not Found With id of ${req.user.id}`, 404)
      );
    }

    //const architectToken = architect.getArchitectsignedJwtToken();
    res.status(200).json({ success: true, data: architect });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Get a single architect
//@route    Put /api/v1/architects
//@access   Public
exports.getArchitect = async (req, res, next) => {
  try {
    if (req.user.role == "Admin") {
      const architect = await Architect.findById({
        _id: req.params.id,
      })
        .populate("user")
        .populate("architectItems")
        .populate("architectReviews")
        .populate("appointments");

      if (!architect) {
        return next(
          new ErrorResponse(
            `Architect not Found With id of ${req.params.id}`,
            404
          )
        );
      }
      res.status(200).json({ success: true, data: architect });
    } else {
      const architect = await Architect.findById({
        _id: req.params.id,
        architectVisibility: "Active",
      })
        .populate("user")
        .populate("architectItems")
        .populate("architectReviews")
        .populate("appointments");

      if (!architect) {
        return next(
          new ErrorResponse(
            `Architect not Found With id of ${req.params.id}`,
            404
          )
        );
      }
      res.status(200).json({ success: true, data: architect });
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Get a architect within Radius
//@route    Get /api/v1/architects/radius/:latitude/:longitude
//@access   Private
exports.getArchitectsNearby = async (req, res, next) => {
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
    const architects = await Architect.find({
      location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
    })
      .populate("user")
      .populate("appointmentSlots", { description: 1, date: 1, time: 1 });
    res
      .status(200)
      .json({ success: true, count: architects.length, data: architects });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//####################################Get all Architects,Get logged usrs profile,Get profile by id,Get nearby architects##################
//####################################Create Architect##################

//@desc     Create a architect
//@route    Post /api/v1/architects
//@access   Public
exports.createArchitect = async (req, res, next) => {
  try {
    if (req.files) {
      let profilePic = [];
      let shopPics = [];
      let proofDocs = [];
      if (req.files.profilePicture) {
        if (req.files.profilePicture.length > 0) {
          profilePic = req.files.profilePicture.map((file) => {
            return { img: file.location };
          });
        }
        req.body.profilePicture = profilePic;
      }
      if (req.files.shopImages) {
        if (req.files.shopImages.length > 0) {
          shopPics = req.files.shopImages.map((file) => {
            return { img: file.location };
          });
        }
        req.body.shopImages = shopPics;
      }
      if (req.files.proofDocuments) {
        if (req.files.proofDocuments.length > 0) {
          proofDocs = req.files.proofDocuments.map((file) => {
            return { img: file.location };
          });
        }
        req.body.proofDocuments = proofDocs;
      }
    }

    //Add long and lat into body
    if (req.body.longitude && req.body.latitude) {
      req.body.location = {
        type: "Point",
        coordinates: [req.body.longitude, req.body.latitude],
      };
    }

    //Add user to req.body
    req.body.user = req.user.id;

    //Check for published architect
    const createdArchitect = await Architect.findOne(
      { user: req.user.id },
      { architectVisibility: ["Active", "Suspend", "Pending"] }
    );

    //Admin can add more architects
    if (createdArchitect && req.user.role !== "Admin") {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.id} has already published a architect`,
          400
        )
      );
    }
    const architect = await Architect.create(req.body);
    await user.findByIdAndUpdate(req.user.id, {
      architectId: architect.id,
    });

    const userU = await user.findById(req.user.id).populate("shopId");
    const archiRecord = await ArchitectRecords.create({
      profileName: architect.id,
    });

    //#######################Create architect###########################
    //#######################Send admin notification###########################
    /* //Create notificatioon
    const notifybody = {
      Title: "Architect profile creating Request",
      Description: `architect profile ${architect.id} requested from user ${req.user.id}`,
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

    //#######################Send admin notification########################### */

    res.status(201).json({ success: true, data: architect, user: userU });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//####################################Create Architect##################
//####################################Update Architect##################
//@desc     Update a architect
//@route    Put /api/v1/architects
//@access   Public
exports.updateArchitect = async (req, res, next) => {
  try {
    const architect = await Architect.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!architect) {
      return next(
        new ErrorResponse(
          `Architect not Found With id of ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: architect });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//####################################Update Architect##################
//####################################Delete Architect,set profile visibility##################
//@desc     Delete a architect
//@route    Delete /api/v1/architects
//@access   Private
exports.deleteArchitect = async (req, res, next) => {
  try {
    await user.findByIdAndUpdate(req.params.userId, {
      $set: { architectId: null },
    });
    const architect = await Architect.findByIdAndDelete(req.params.id);

    if (!architect) {
      return next(
        new ErrorResponse(
          `Architect not Found With id of ${req.params.id}`,
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

//@desc     Update architect visibility
//@route    Put /api/v1/architects
//@access   Public
exports.setArchitectStatus = async (req, res, next) => {
  try {
    if (req.user.role === "Admin") {
      //Block,Unblock,Approve,Decline,
      if (req.body.status === "Approve") {
        const architect = await Architect.findByIdAndUpdate(req.params.id, {
          $set: { architectVisibility: "Active" },
        });

        if (!architect) {
          return next(
            new ErrorResponse(
              `Architect not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        //Set architect id in user
        await user.findByIdAndUpdate(architect.user, {
          $set: { architectId: architect.id },
        });
        res.status(200).json({ success: true, data: architect });
      }
      if (req.body.status === "Unblock") {
        const architect = await Architect.findByIdAndUpdate(req.params.id, {
          $set: { architectVisibility: "Active" },
        });

        if (!architect) {
          return next(
            new ErrorResponse(
              `Architect not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        res.status(200).json({ success: true, data: architect });
      }
      if (req.body.status === "Block") {
        const architect = await Architect.findByIdAndUpdate(req.params.id, {
          $set: { architectVisibility: "Suspend" },
        });

        if (!architect) {
          return next(
            new ErrorResponse(
              `Architect not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        res.status(200).json({ success: true, data: architect });
      }
      if (req.body.status === "Decline") {
        const architect = await Architect.findByIdAndUpdate(req.params.id, {
          $set: { architectVisibility: "Declined" },
        });

        if (!architect) {
          return next(
            new ErrorResponse(
              `Architect not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        res.status(200).json({ success: true, data: architect });
      }
    } else {
      return next(new ErrorResponse(`${req.user.userName} not an Admin`, 404));
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//####################################Delete Architect,set profile visibility##################
//@desc     Update a shop
//@route    Put /api/v1/shops
//@access   Public
exports.updateArchitectProfile = async (req, res, next) => {
  try {
    if (req.files) {
      let profilePic = [];
      let shopPics = [];
      let proofDocs = [];
      if (req.files.profilePicture) {
        if (req.files.profilePicture.length > 0) {
          profilePic = req.files.profilePicture.map((file) => {
            return { img: file.location };
          });
        }
        req.body.profilePic = profilePic;
      }
      if (req.files.shopImages) {
        if (req.files.shopImages.length > 0) {
          shopPics = req.files.shopImages.map((file) => {
            return { img: file.location };
          });
        }
        req.body.shopPictures = shopPics;
      }
      if (req.files.proofDocuments) {
        if (req.files.proofDocuments.length > 0) {
          proofDocs = req.files.proofDocuments.map((file) => {
            return { img: file.location };
          });
        }
        req.body.proofDocs = proofDocs;
      }
    }

    const archi = await Architect.findByIdAndUpdate(
      req.user.architectId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!archi) {
      return next(
        new ErrorResponse(
          `Archi not Found With id of ${req.user.architectId}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: archi });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
