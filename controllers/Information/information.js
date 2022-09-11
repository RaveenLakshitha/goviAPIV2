const ErrorResponse = require("../../utils/errorResponse");
const Information = require("../../models/Information/information");
const infoCategory = require("../../models/Categories/infoCategory");

//#############################################Get all information , Get information by Id  #########################################

//@desc     Get all information
//@route    Get /api/v1/information
//@access   Public
exports.getAllInfo = async (req, res, next) => {
  try {
    const information = await Information.find(); /* .populate("Articles") */
    res
      .status(200)
      .json({ success: true, count: information.length, data: information });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a information
//@route    Get /api/v1/information/:id
//@access   Public
exports.getInfo = async (req, res, next) => {
  try {
    const Info = await Information.findById(req.params.id).populate("Articles");
    if (!Info) {
      next(
        new ErrorResponse(
          `No information  Found With id of ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: Info });
  } catch (err) {
    next(
      new ErrorResponse(`No information Found With id of ${req.params.id}`, 404)
    );
  }
};
//@desc     Get a information
//@route    Get /api/v1/information/:id
//@access   Public
exports.getInfoByCategory = async (req, res, next) => {
  try {
    const Info = await Information.find({ categoryId: req.params.id }).populate(
      "Articles"
    );
    if (!Info) {
      next(
        new ErrorResponse(
          `No information  Found With id of ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: Info });
  } catch (err) {
    next(
      new ErrorResponse(`No information Found With id of ${req.params.id}`, 404)
    );
  }
};

//#############################################Get all information , Get information by Id  #########################################

//#############################################Create information #########################################

//@desc     Create a information
//@route    Post /api/v1/information
//@access   Public
exports.createInfo = async (req, res, next) => {
  try {
    if (req.file) {
      const data = await uploadToCloudinary(req.file.path, "info-images");
      req.body.imageUrl = data.url;
      req.body.publicId = data.public_id;
    }

    const information = await Information.create(req.body);

    await infoCategory.findByIdAndUpdate(information.categoryId, {
      $push: {
        Information: information.id,
      },
    });

    res.status(200).json({ success: true, data: information });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#############################################Create information #########################################
//#############################################Update information by id #########################################

//@desc     Update a information
//@route    Put /api/v1/information
//@access   Public
exports.updateInfo = async (req, res, next) => {
  try {
    if (req.file) {
      const data = await uploadToCloudinary(req.file.path, "info-images");
      req.body.imageUrl = data.url;
      req.body.publicId = data.public_id;
    }
    const information = await Information.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!information) {
      return next(
        new ErrorResponse(
          `Information not Found With id of ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: information });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Update a shop profile picture
//@route    Put /api/v1/shops
//@access   Public
exports.updatePicture = async (req, res, next) => {
  try {
    if (req.file) {
      const data = await uploadToCloudinary(req.file.path, "info-images");
      req.body.imageUrl = data.url;
      req.body.publicId = data.public_id;
    }

    const information = await Information.findByIdAndUpdate(
      req.user.shopId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!information) {
      return next(
        new ErrorResponse(
          `Information not Found With id of ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: information });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#############################################Update information by id #########################################
//#############################################Delete information,Change information visibility  #########################################
//@desc     Delete a information
//@route    Delete /api/v1/information
//@access   Private
exports.deleteInfo = async (req, res, next) => {
  try {
    const info = await Information.findById(req.params.id);
    const information = await Information.findByIdAndDelete(req.params.id);

    await infoCategory.findOneAndUpdate(
      { categoryName: information.categoryName },
      {
        $pull: {
          Information: info.id,
        },
      }
    );

    if (!information) {
      return next(
        new ErrorResponse(
          `No information  Found With id of ${req.params.id}`,
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

//@desc     Update shop visibility
//@route    Put /api/v1/shops
//@access   Public
exports.setInfoVisibility = async (req, res, next) => {
  try {
    if (req.user.role === "Admin") {
      //Block,Unblock,Approve,Decline,
      if (req.body.status === "Activate") {
        const information = await Information.findByIdAndUpdate(
          req.params.id,
          {
            $set: { infoVisibility: "Active" },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        if (!information) {
          return next(
            new ErrorResponse(
              `Information not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        await infoCategory.findOneAndUpdate(
          { categoryName: information.categoryName },
          {
            $push: {
              Information: information.id,
            },
          }
        );

        res.status(200).json({ success: true, data: information });
      }
      if (req.body.status === "Deactivate") {
        const information = await Information.findByIdAndUpdate(
          req.params.id,
          {
            $set: { infoVisibility: "Inactive" },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        if (!information) {
          return next(
            new ErrorResponse(
              `Information not Found With id of ${req.params.id}`,
              404
            )
          );
        }
        await infoCategory.findOneAndUpdate(
          { categoryName: information.categoryName },
          {
            $pull: {
              info: information.id,
            },
          }
        );

        res.status(200).json({ success: true, data: information });
      }
    } else {
      return next(new ErrorResponse(`${req.user.userName} not an Admin`, 404));
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//################################### Delete information,Change information visibility#########################################
