const List = require("../../models/Wishlist/wishlist");
const item = require("../../models/Items&Rent/item");
//@desc     Get all Questions
//@route    Get /api/v1/Forum/getQuestions
//@access   Public
exports.getLists = async (req, res, next) => {
  try {
    const carts = await List.find()
      .populate("user", { username: 1, email: 1 })
      .populate({
        path: "listItems",
        populate: {
          path: "item",
          model: item,
        },
      });
    res.status(200).json({ success: true, count: carts.length, data: carts });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get users List
//@route    Get /api/v1/Forum/getQuestions
//@access   Public
exports.getUsersList = async (req, res, next) => {
  try {
    const list = await List.findOne({
      user: req.user.id,
    }).populate({
      path: "listItems",
      populate: {
        path: "item",
        model: item,
      },
    });
    if (!list) {
      return next(
        new ErrorResponse(`List not Found With id of user ${req.user.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
