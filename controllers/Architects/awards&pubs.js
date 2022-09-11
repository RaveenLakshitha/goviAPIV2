const Architect = require("../../models/Architects/architect");
const Awards = require("../../models/Architects/awards&pubs");

//const Item = require("../models/item");
//const shop = require("../models/shop");

//@desc     Get all awards
//@route    Get /api/v1/awards
//@access   Public
exports.getAwards = async (req, res, next) => {
  try {
    const awards = await Awards.find()
      .populate("architectId")
      .populate("userId");
    res.status(200).json({ success: true, count: awards.length, data: awards });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a Award
//@route    Get /api/v1/awards/:id
//@access   Public
exports.getAward = async (req, res, next) => {
  try {
    const award = await Awards.findById(req.params.id);

    if (!award) {
      return next(
        new ErrorResponse(`Award not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: award });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Create a Award
//@route    Post /api/v1/awards
//@access   Public
exports.createAward = async (req, res, next) => {
  try {
    if (req.files) {
      let gallery = [];

      if (req.files.gallery.length > 0) {
        gallery = req.files.gallery.map((file) => {
          return { img: file.location };
        });
      }
      req.body.gallery = gallery;
    }

    req.body.architectId = req.user.architectId;
    req.body.userId = req.user.id;

    const award = await Awards.create(req.body);
    await Architect.findOneAndUpdate(
      { user: req.user.id },
      {
        $push: {
          awards: award.id,
        },
      }
    );

    res.status(201).json({ success: true, data: award });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Update a award
//@route    Put /api/v1/awards
//@access   Public
exports.updateAward = async (req, res, next) => {
  try {
    const award = await Awards.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!award) {
      return next(
        new ErrorResponse(`award not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: award });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Delete a award
//@route    Delete /api/v1/awards
//@access   Private
exports.deleteAward = async (req, res, next) => {
  try {
    const award = await Awards.findByIdAndDelete(req.params.id);
    await Architect.findByIdAndUpdate(req.body.architectId, {
      $pull: { awards: req.params.id },
    });

    if (!award) {
      return next(
        new ErrorResponse(`Award not Found With id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
