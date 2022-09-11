const category = require("../../models/Categories/itemCategories");
const Item = require("../../models/Items&Rent/item");
const shop = require("../../models/shop");

const ErrorResponse = require("../../utils/errorResponse");

//#################################### GEt all items,Get single Item By id #########################
//@desc     Get all items
//@route    Get /api/v1/items
//@access   Public
exports.getItems = async (req, res, next) => {
  try {
    /* if(req.user.role=="Admin"){}else{} */
    const items = await Item.find();
    //.populate("shopId", { shopName: 1, email: 1 })
    /* .populate("shopId")
      .populate("userId"); */
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//#################################### GEt all items,Get single Item By id #########################
//@desc     Get all items
//@route    Get /api/v1/items
//@access   Public
exports.getItemsByParentCategory = async (req, res, next) => {
  try {
    /* if(req.user.role=="Admin"){}else{} */
    const items = await Item.find({ parentCategoryId: req.params.categoryid });

    //.populate("shopId", { shopName: 1, email: 1 })
    /* .populate("shopId")
      .populate("userId"); */
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a item
//@route    Get /api/v1/items/:id
//@access   Public

exports.getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return next(
        new ErrorResponse(`Item not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: item });
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
exports.createItem = async (req, res, next) => {
  try {
    if (req.files) {
      let thumbnail = [];
      let productPictures = [];
      if (req.files.thumbnail) {
        if (req.files.thumbnail.length > 0) {
          thumbnail = req.files.thumbnail.map((file) => {
            return { img: file.location };
          });
        }
        req.body.thumbnail = thumbnail;
      }
      if (req.files.productPictures) {
        if (req.files.productPictures.length > 0) {
          productPictures = req.files.productPictures.map((file) => {
            return { img: file.location };
          });
        }
        req.body.productPictures = productPictures;
      }
    }
    // req.body.createdBy = req.user.id;
    req.body.shopId = req.user.shopId;
    req.body.userId = req.user.id;

    const Category = await category.findById(req.body.categoryId);
    req.body.categoryName = Category.categoryName;
    const parentCategory = await category.findById(req.body.parentCategoryId);
    req.body.parentCategoryName = parentCategory.categoryName;

    const item = await Item.create(req.body);
    await shop.findOneAndUpdate(
      { user: req.user.id },
      {
        $push: {
          shopItems: item.id,
        },
      }
    );

    await shop.findOneAndUpdate(
      { _id: item.shopId },
      { $inc: { itemCount: 1 } }
      //Add voted Q or A ID into user profile
    );

    await category.findByIdAndUpdate(req.body.categoryId, {
      $push: {
        Items: item.id,
      },
    });
    await category.findByIdAndUpdate(req.body.parentCategoryId, {
      $push: {
        Items: item.id,
      },
    });
    res.status(201).json({ success: true, data: item });
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
exports.updateItem = async (req, res, next) => {
  try {
    if (req.files) {
      if (req.files) {
        let thumbnail = [];
        let productPictures = [];

        if (req.files.thumbnail.length > 0) {
          thumbnail = req.files.thumbnail.map((file) => {
            return { img: file.location };
          });
        }
        req.body.thumbnail = thumbnail;

        if (req.files.productPictures.length > 0) {
          productPictures = req.files.productPictures.map((file) => {
            return { img: file.location };
          });
        }
        req.body.shopPictures = productPictures;
      }
    }

    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return next(
        new ErrorResponse(`Item not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: item });
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
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    const delitem = await Item.findByIdAndDelete(req.params.id);
    await shop.findByIdAndUpdate(req.body.shopId, {
      $pull: { shopItems: req.params.id },
    });

    await shop.findOneAndUpdate(
      { _id: delitem.shopId },
      { $inc: { itemCount: -1 } }
    );

    await category.findOneAndUpdate(
      { categoryName: item.categoryName },
      {
        $pull: {
          Items: delitem.id,
        },
      }
    );

    if (!delitem) {
      return next(
        new ErrorResponse(`Item not Found With id of ${req.params.id}`, 404)
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
exports.BlockItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      {
        $set: { itemVisibility: false },
      },
      { new: true }
    );
    await shop.findOneAndUpdate(
      { _id: item.shopId },
      { $inc: { itemCount: -1 } }
    );

    await category.findOneAndUpdate(
      { categoryName: item.categoryName },
      {
        $pull: {
          Items: delitem.id,
        },
      }
    );

    if (!item) {
      return next(
        new ErrorResponse(`Item not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: item.itemVisibility });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Unblock Answer
//@route    Post /api/v1/Forum/UnblockAnswer/:id
//@access   Private
exports.UnblockItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      {
        $set: { itemVisibility: true },
      },
      { new: true }
    );
    await shop.findOneAndUpdate(
      { _id: item.shopId },
      { $inc: { itemCount: 1 } }
    );

    await category.findOneAndUpdate(
      { categoryName: item.categoryName },
      {
        $push: {
          Items: delitem.id,
        },
      }
    );

    if (!item) {
      return next(
        new ErrorResponse(`Item not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: item.itemVisibility });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//#######################################Remove answer,Block answer,Unblock answer###############################
