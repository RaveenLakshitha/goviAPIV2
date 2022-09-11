//const asyncHandler = require("../middleware/async");
const { uploadToCloudinary } = require("../middleware/cloudinaryImage");
const item = require("../models/Items&Rent/item");
const Shop = require("../models/shop");
const user = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const notification = require("../models/Notifications/notifications");

//#############################################Get all Shops , Get logged users Shop , Get shop by Id  #########################################
//@desc     Get all shops
//@route    Get /api/v1/shops
//@access   Public
exports.getShops = async (req, res, next) => {
  try {
    /*   if (!req.user) {
      return next(new ErrorResponse(`Not authorize to access`, 404));
    } */
    if (req.user.role == "Admin") {
      const shops = await Shop.find();
      /* .populate("user")
        .populate("shopItems")
        .populate("shopReviews"); */

      res.status(200).json({ success: true, count: shops.length, data: shops });
    } else {
      const shops = await Shop.find({ shopVisibility: "Active" })
        .populate("user")
        .populate("shopItems")
        .populate("shopReviews");

      res.status(200).json({ success: true, count: shops.length, data: shops });
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a shop
//@route    Get /api/v1/shops/:id
//@access   Public
exports.getUsersShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({
      user: req.user.id,
    })
      .populate("shopItems")
      .populate("ordersId")
      .populate("user");
    if (!shop) {
      return next(
        new ErrorResponse(`Shop not Found With id of ${req.user.id}`, 404)
      );
    }
    shop.itemCount = await item.countDocuments({ userId: req.user.id });

    res
      .status(200)
      // .json({ success: true, data: shop, items: shop.items, shopToken });
      .json({ success: true, data: shop });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a single shop
//@route    Put /api/v1/shops
//@access   Public
exports.getShop = async (req, res, next) => {
  try {
    if (req.user.role == "Admin") {
      const shop = await Shop.findById({
        _id: req.params.id,
        shopVisibility: "Active",
      })
        .populate("user")
        .populate("shopItems")
        .populate("ordersId")
        .populate("shopReviews");

      if (!shop) {
        return next(
          new ErrorResponse(`Shop not Found With id of ${req.params.id}`, 404)
        );
      }
      res.status(200).json({ success: true, data: shop });
    } else {
      const shop = await Shop.findById({
        _id: req.params.id,
        shopVisibility: "Active",
      })
        .populate("user")
        .populate("shopItems")
        .populate("ordersId")
        .populate("shopReviews");

      if (!shop) {
        return next(
          new ErrorResponse(`Shop not Found With id of ${req.params.id}`, 404)
        );
      }
      res.status(200).json({ success: true, data: shop });
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Get a shop within Radius
//@route    Get /api/v1/shops/radius/:latitude/:longitude
//@access   Private
exports.getShopsNearby = async (req, res, next) => {
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
    const shops = await Shop.find({
      location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
    });
    res.status(200).json({ success: true, count: shops.length, data: shops });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#############################################Get all Shops , Get logged users Shop , Get shop by Id  #########################################

//#############################################Create Shop#########################################

//@desc     Create a shop
//@route    Post /api/v1/shops
//@access   Public
exports.createShop = async (req, res, next) => {
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

    //Add long and lat into body
    if (req.body.longitude && req.body.latitude) {
      req.body.location = {
        type: "Point",
        coordinates: [req.body.latitude, req.body.longitude],
      };
    }

    //Add user to req.body
    req.body.user = req.user.id;

    //Check for published shop
    const createdShop = await Shop.findOne(
      { user: req.user.id },
      { shopVisibility: ["Active", "Suspend", "Pending"] }
    );

    //Admin can add more shops
    if (createdShop && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.id} has already published a shop`,
          400
        )
      );
    }

    const shop = await Shop.create(req.body);
    await user.findByIdAndUpdate(req.user.id, {
      shopId: shop.id,
    });
    req.shop = shop.id;
    next();
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//Delete images
//#############################################Create Shop#########################################

//################# Update Logged user shop,Update Shop by id,Update Shop Profile Picture by shop id, Update Logged users shop profile picture #########################################

//@desc     Update a shop
//@route    Put /api/v1/shops
//@access   Public
exports.updateShop = async (req, res, next) => {
  try {
    if (req.files) {
      let profilePic = [];
      let shopPics = [];
      let proofDocs = [];

      if (req.files.profilePicture.length > 0) {
        profilePic = req.files.profilePicture.map((file) => {
          return { img: file.location };
        });
      }
      req.body.profilePic = profilePic;

      if (req.files.shopImages.length > 0) {
        shopPics = req.files.shopImages.map((file) => {
          return { img: file.location };
        });
      }
      req.body.shopPictures = shopPics;

      if (req.files.proofDocuments.length > 0) {
        proofDocs = req.files.proofDocuments.map((file) => {
          return { img: file.location };
        });
      }
      req.body.proofDocs = proofDocs;
    }

    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!shop) {
      return next(
        new ErrorResponse(`Shop not Found With id of ${req.params.id}`, 404)
      );
    }
    req.shop = shop;
    next();
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Update a shop
//@route    Put /api/v1/shops
//@access   Public
exports.updateUsersShop = async (req, res, next) => {
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

    const shop = await Shop.findByIdAndUpdate(req.user.shopId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!shop) {
      return next(
        new ErrorResponse(`Shop not Found With id of ${req.user.shopId}`, 404)
      );
    }
    req.shop = shop;
    next();
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//################################### Delete Shop,Change Shop visibility#########################################

//@desc     Delete a shop
//@route    Delete /api/v1/shops
//@access   Private
exports.deleteShop = async (req, res, next) => {
  try {
    await user.findByIdAndUpdate(
      req.body.userId,
      { $unset: { shopId: "" } },
      { new: true }
    );
    const shop = await Shop.findByIdAndDelete(req.params.id);

    if (!shop) {
      return next(
        new ErrorResponse(`Shop not Found With id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//Create shop deactivation

//@desc     Update shop visibility
//@route    Put /api/v1/shops
//@access   Public
exports.setShopStatus = async (req, res, next) => {
  try {
    const userShop = await Shop.findById(req.params.id);
    var sitems = [];

    if (!userShop) {
      return next(
        new ErrorResponse(`Shop not Found With id of ${req.params.id}`, 404)
      );
    }
    if (req.user.role === "Admin") {
      //Block,Unblock,Approve,Decline,
      if (req.body.status === "Approve") {
        const shop = await Shop.findByIdAndUpdate(
          req.params.id,
          {
            $set: { shopVisibility: "Active" },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        await user.findByIdAndUpdate(
          shop.user,
          {
            $set: { shopId: shop.id },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        req.shop = shop.id;
        next();
      }
      if (req.body.status === "Unblock") {
        sitems = userShop.shopItems;
        const shop = await Shop.findByIdAndUpdate(
          req.params.id,
          {
            $set: { shopVisibility: "Active" },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        for (let i = 0; i <= sitems.length; i++) {
          await item.findByIdAndUpdate(sitems[i], {
            $set: {
              itemVisibility: true,
            },
          });
        }
        req.shop = shop.id;
        next();
      }
      if (req.body.status === "Block") {
        sitems = userShop.shopItems;
        const shop = await Shop.findByIdAndUpdate(
          req.params.id,
          {
            $set: { shopVisibility: "Suspend" },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        for (let i = 0; i <= sitems.length; i++) {
          await item.findByIdAndUpdate(sitems[i], {
            $set: {
              itemVisibility: false,
            },
          });
        }
        res.status(200).json({ success: true, data: shop });
      }
      if (req.body.status === "Decline") {
        const shop = await Shop.findByIdAndUpdate(
          req.params.id,
          {
            $set: { shopVisibility: "Decline" },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        res.status(200).json({ success: true, data: shop });
      }
    } else {
      return next(new ErrorResponse(`${req.user.userName} not an Admin`, 404));
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//################################### Delete Shop,Change Shop visibility#########################################
