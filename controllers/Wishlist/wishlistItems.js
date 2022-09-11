const list = require("../../models/Wishlist/wishlist");
const Item = require("../../models/Items&Rent/item");
const listItem = require("../../models/Wishlist/wishlistItems");
const ErrorResponse = require("../../utils/errorResponse");
const Shop = require("../../models/shop");
const User = require("../../models/user");
//increase item amount
//decrease item amount

//@desc     Get all Questions
//@route    Get /api/v1/Forum/getQuestions
//@access   Public
exports.getListItems = async (req, res, next) => {
  try {
    const item = await listItem.find();
    res.status(200).json({ success: true, count: item.length, data: item });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Create a architect
//@route    Post /api/v1/architects
//@access   Public
exports.createListItem = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    req.body.list = req.user.listId;

    const itemId = await Item.findById(req.body.item);
    req.body.shop = itemId.shopId;

    const List = await list.findOne({ user: req.user.id });
    const cItem = await listItem.create(req.body);
    var item;
    item = await list.findOneAndUpdate(
      { user: req.user.id },
      {
        $push: {
          listItems: cItem.id,
        },
      },
      { new: true }
    );

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Delete a architect
//@route    Delete /api/v1/architects
//@access   Private
exports.deleteListItem = async (req, res, next) => {
  try {
    var item;
    item = await list.findOneAndUpdate(
      { user: req.user.id },
      {
        $pull: {
          listItems: req.params.id,
        },
      },
      { new: true }
    );
    await listItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
