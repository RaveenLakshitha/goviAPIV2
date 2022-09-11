const Advertisement = require("../../models/Advertisement/advertisement");
const ErrorResponse = require("../../utils/errorResponse");
const notification = require("../../models/Notifications/notifications");
const user = require("../../models/user");

//@desc     Get all adds
//@route    Get /api/v1/advertisements
//@access   Public
exports.getAdds = async (req, res, next) => {
  try {
    const adds = await Advertisement.find();
    res.status(200).json({ success: true, count: adds.length, data: adds });
    /* if (req.user.role == "Admin") {
      const adds = await advertisement.find();
      res.status(200).json({ success: true, count: adds.length, data: adds });
    } else {
      const adds = await advertisement.find({
        advertisementVisibility: "Active",
      });
      res.status(200).json({ success: true, count: adds.length, data: adds });
    } */
  } catch (err) {
    res.status(400).json({ success: false });
    next(err);
  }
};
//@desc     Get a add
//@route    Get /api/v1/advertisements/:id
//@access   Public
exports.getAdd = async (req, res, next) => {
  try {
    const add = await Advertisement.findById(req.params.id);

    if (!add) {
      next(
        new ErrorResponse(`User not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: add });
    /* if (req.user.role == "Admin") {
      const add = await advertisement.findById(req.params.id);

      if (!add) {
        next(
          new ErrorResponse(`User not Found With id of ${req.params.id}`, 404)
        );
      }
      res.status(200).json({ success: true, data: add });
    } else {
      const add = await advertisement.findById(req.params.id, {
        infoVisibility: "Active",
      });

      if (!add) {
        next(
          new ErrorResponse(`User not Found With id of ${req.params.id}`, 404)
        );
      }
      res.status(200).json({ success: true, data: add });
    } */
  } catch (err) {
    next(new ErrorResponse(`User not Found With id of ${req.params.id}`, 404));
  }
};
//@desc     Get a shop
//@route    Get /api/v1/shops/:id
//@access   Public
exports.getUsersAdd = async (req, res, next) => {
  try {
    const add = await Advertisement.find({ user: req.user.id });
    if (!add) {
      return next(
        new ErrorResponse(
          `Advertisement not Found With user ${req.user.id} id`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: add });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Create a user
//@route    Post /api/v1/advertisements
//@access   Public
exports.createAdd = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = req.file.location;
    }
    //Create add
    req.body.user = req.user.id;
    const add = await Advertisement.create(req.body);
    req.add = add.id;
    next();
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Update a user
//@route    Put /api/v1/advertisements/:id
//@access   Public
exports.updateAdd = async (req, res, next) => {
  try {
    const add = await Advertisement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!add) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: add });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Delete a user
//@route    Delete /api/v1/advertisements/:id
//@access   Private
exports.deleteAdd = async (req, res, next) => {
  try {
    const add = await Advertisement.findByIdAndDelete(req.params.id);

    if (!add) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Update advertisement visibility
//@route    Put /api/v1/advertisements
//@access   Public
exports.setadvertisementStatus = async (req, res, next) => {
  try {
    if (req.user.role === "Admin") {
      //Block,Unblock,Approve,Decline,
      if (req.body.status === "Approve") {
        const advertisement = await Advertisement.findByIdAndUpdate(
          req.params.id,
          {
            $set: { advertisementVisibility: "Active" },
          }
        );

        if (!advertisement) {
          return next(
            new ErrorResponse(
              `advertisement not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        await user.findByIdAndUpdate(advertisement.user, {
          $set: { advertisementId: advertisement.id },
        });
        res.status(200).json({ success: true, data: advertisement });
      }
      if (req.body.status === "Unblock") {
        const advertisement = await Advertisement.findByIdAndUpdate(
          req.params.id,
          {
            $set: { advertisementVisibility: "Active" },
          }
        );

        if (!advertisement) {
          return next(
            new ErrorResponse(
              `advertisement not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        res.status(200).json({ success: true, data: advertisement });
      }
      if (req.body.status === "Block") {
        const advertisement = await Advertisement.findByIdAndUpdate(
          req.params.id,
          {
            $set: { advertisementVisibility: "Suspend" },
          }
        );

        if (!advertisement) {
          return next(
            new ErrorResponse(
              `advertisement not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        res.status(200).json({ success: true, data: advertisement });
      }
      if (req.body.status === "Decline") {
        const advertisement = await Advertisement.findByIdAndUpdate(
          req.params.id,
          {
            $set: { advertisementVisibility: "Declined" },
          }
        );

        if (!advertisement) {
          return next(
            new ErrorResponse(
              `advertisement not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        res.status(200).json({ success: true, data: advertisement });
      }
    } else {
      return next(new ErrorResponse(`${req.user.userName} not an Admin`, 404));
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Update advertisement visibility
//@route    Put /api/v1/advertisements
//@access   Public
exports.setPaymentStatus = async (req, res, next) => {
  try {
    if (req.body.status === "paid") {
      const advertisement = await Advertisement.findByIdAndUpdate(
        req.params.id,
        {
          $set: { Paid: true },
        },
        { new: true }
      );

      if (!advertisement) {
        return next(
          new ErrorResponse(
            `advertisement not Found With id of ${req.params.id}`,
            404
          )
        );
      }
      res.status(200).json({ success: true, data: advertisement });
    }

    if (req.body.status === "unpaid") {
      const advertisement = await Advertisement.findByIdAndUpdate(
        req.params.id,
        {
          $set: { Paid: false },
        },
        { new: true }
      );

      if (!advertisement) {
        return next(
          new ErrorResponse(
            `advertisement not Found With id of ${req.params.id}`,
            404
          )
        );
      }
      res.status(200).json({ success: true, data: advertisement });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ data: err });
    next(err);
  }
};
