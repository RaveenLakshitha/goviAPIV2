const item = require("../models/Items&Rent/item");
const User = require("../models/user");
const shop = require("../models/shop");
const Expert = require("../models/Experts/experts");
const RentItems = require("../models/Items&Rent/RentItems");
const architect = require("../models/Architects/architect");
const ratingShop = require("../models/Ratings/ratingshop");
const ratingItem = require("../models/Ratings/ratingitem");
const ratingExpert = require("../models/Ratings/ratingexpert");
const ratingArchitect = require("../models/Ratings/ratingArchitect");
const ratingProjects = require("../models/Ratings/ratingProjects");
const ratingRentItems = require("../models/Ratings/RatingRentItem");
const projects = require("../models/Architects/projects");
//const equipments = require("../models/equipments");
const ErrorResponse = require("../utils/errorResponse");

//@desc     Get all Ratings
//@route    Get /api/v1/Ratings
//@access   Public
exports.getShopRatings = async (req, res, next) => {
  try {
    const Ratings = await ratingShop.find();
    res
      .status(200)
      .json({ success: true, count: Ratings.length, data: Ratings });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get all Ratings
//@route    Get /api/v1/Ratings
//@access   Public
exports.getItemRatings = async (req, res, next) => {
  try {
    const Ratings = await ratingItem.find();
    res
      .status(200)
      .json({ success: true, count: Ratings.length, data: Ratings });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get all Ratings
//@route    Get /api/v1/Ratings
//@access   Public
exports.getRentItemsRatings = async (req, res, next) => {
  try {
    const Ratings = await ratingRentItems.find();
    res
      .status(200)
      .json({ success: true, count: Ratings.length, data: Ratings });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get all Ratings
//@route    Get /api/v1/Ratings
//@access   Public
exports.getExpertsRatings = async (req, res, next) => {
  try {
    const Ratings = await ratingExpert.find();
    res
      .status(200)
      .json({ success: true, count: Ratings.length, data: Ratings });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get all Ratings
//@route    Get /api/v1/Ratings
//@access   Public
exports.getProjectsRatings = async (req, res, next) => {
  try {
    const Ratings = await ratingProjects.find();
    res
      .status(200)
      .json({ success: true, count: Ratings.length, data: Ratings });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get all Ratings
//@route    Get /api/v1/Ratings
//@access   Public
exports.getArchitectsRatings = async (req, res, next) => {
  try {
    const Ratings = await ratingArchitect.find();
    res
      .status(200)
      .json({ success: true, count: Ratings.length, data: Ratings });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Create a order
//@route    Post /api/v1/orders
//@access   Public
exports.createRating = async (req, res, next) => {
  try {
    //Add user to req.body
    var rate;
    req.body.user = req.user.id;

    /* const Rated = await ratings.findById(rate.id);
    if (Rated) {
      rate = Rated;
    } else {
    } */
    const revShopId = await shop.findById(req.body.shopId);
    const revItemId = await item.findById(req.body.itemId);
    const revExpertId = await Expert.findById(req.body.expertId);
    const revRentItemiId = await RentItems.findById(req.body.rentItemId);
    const revArchiId = await architect.findById(req.body.architectId);
    const revProjectId = await projects.findById(req.body.projectId);

    //Check Rating eke thiyena shopId,itemId,expertId
    //Read ratingSum and Set average
    //Add rated people number
    if (revShopId) {
      const rater = await ratingShop.findOne({
        user: req.user.id,
        shopId: req.body.shopId,
      });

      if (rater) {
        await ratingShop.findOne({
          shopId: req.body.shopId,
          user: req.user.id,
        });
        console.log("Shop Already Rated By User");

        rate = await ratingShop.updateOne(
          { shopId: req.body.shopId, user: req.user.id },
          {
            $set: {
              rating: req.body.rating,
            },
          }
        );
      } else {
        rate = await ratingShop.create(req.body);

        await shop.updateOne(
          { _id: req.body.shopId },
          {
            $push: {
              raters: req.user.id,
            },
          }
        );
        await shop.updateOne(
          { _id: req.body.shopId },
          {
            $push: {
              shopRatings: rate.id,
            },
          }
        );
        await User.findOneAndUpdate(
          { id: req.user.id },
          {
            $push: {
              shopRatings: rate.id,
            },
          }
        );
      }
    }
    if (revItemId) {
      const rater = await ratingItem.findOne({ user: req.user.id });
      if (rater && revItemId) {
        console.log("Item Already Rated By User");
      } else {
        rate = await ratingItem.create(req.body);
        await item.updateOne(
          { _id: req.body.itemId },
          {
            $push: {
              raters: req.user.id,
            },
          }
        );
        await item.updateOne(
          { _id: req.body.itemId },
          {
            $push: {
              itemRatings: rate.id,
            },
          }
        );
        await User.findOneAndUpdate(
          { id: req.user.id },
          {
            $push: {
              itemRatings: rate.id,
            },
          }
        );
      }
    }

    if (revExpertId) {
      const rater = await ratingExpert.findOne({ user: req.user.id });
      if (rater && revExpertId) {
        await ratingExpert.findOne({
          expertId: req.body.expertId,
          user: req.user.id,
        });
        console.log("Expert Already Rated By User");

        rate = await ratingExpert.updateOne(
          { expertId: req.body.expertId, user: req.user.id },
          {
            $set: {
              rating: req.body.rating,
            },
          }
        );
      } else {
        rate = await ratingExpert.create(req.body);

        await Expert.updateOne(
          { _id: req.body.expertId },
          {
            $push: {
              raters: req.user.id,
            },
          }
        );
        await Expert.updateOne(
          { _id: req.body.expertId },
          {
            $push: {
              expertRatings: rate.id,
            },
          }
        );
        await User.findOneAndUpdate(
          { id: req.user.id },
          {
            $push: {
              expertRatings: rate.id,
            },
          }
        );
      }
    }

    if (revArchiId) {
      const rater = await ratingArchitect.findOne(
        { user: req.user.id },
        { architectId: req.body.architectId }
      );

      if (rater) {
        await ratingArchitect.findOne({
          architectId: req.body.architectId,
          user: req.user.id,
        });
        console.log("Shop Already Rated By User");

        rate = await ratingArchitect.updateOne(
          { architectId: req.body.architectId, user: req.user.id },
          {
            $set: {
              rating: req.body.rating,
            },
          }
        );
      } else {
        rate = await ratingArchitect.create(req.body);

        await architect.updateOne(
          { _id: req.body.architectId },
          {
            $push: {
              raters: req.user.id,
            },
          }
        );
        await architect.updateOne(
          { _id: req.body.architectId },
          {
            $push: {
              architectRatings: rate.id,
            },
          }
        );
        await User.findOneAndUpdate(
          { id: req.user.id },
          {
            $push: {
              architectRatings: rate.id,
            },
          }
        );
      }
    }
    if (revRentItemiId) {
      const rater = await ratingRentItems.findOne({ user: req.user.id });
      if (rater && revRentItemiId) {
        console.log("Rent Item Already Rated By User");
      } else {
        rate = await ratingRentItems.create(req.body);
        await RentItems.updateOne(
          { _id: req.body.revRentItemiId },
          {
            $push: {
              raters: req.user.id,
            },
          }
        );
        await RentItems.updateOne(
          { _id: req.body.revRentItemiId },
          {
            $push: {
              rentItemRatings: rate.id,
            },
          }
        );
        await User.findOneAndUpdate(
          { id: req.user.id },
          {
            $push: {
              rentItemRatings: rate.id,
            },
          }
        );
      }
    }
    if (revProjectId) {
      const rater = await ratingProjects.findOne({ user: req.user.id });
      if (rater && revProjectId) {
        console.log("Project Already Rated By User");
      } else {
        rate = await ratingProjects.create(req.body);
        await projects.updateOne(
          { _id: req.body.revProjectId },
          {
            $push: {
              raters: req.user.id,
            },
          }
        );
        await projects.updateOne(
          { _id: req.body.revProjectId },
          {
            $push: {
              projectRatings: rate.id,
            },
          }
        );
        await User.findOneAndUpdate(
          { id: req.user.id },
          {
            $push: {
              projectRatings: rate.id,
            },
          }
        );
      }
    }

    res.status(200).json({ success: true, data: rate });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//#################################################################Delete ratings#############################
//@desc     Create a order
//@route    Post /api/v1/orders
//@access   Public
exports.deleteRating = async (req, res, next) => {
  try {
    //Add user to req.body
    var rate;
    req.body.user = req.user.id;

    const revShopId = await shop.findById(req.body.shopId);
    const revItemId = await item.findById(req.body.itemId);
    const revExpertId = await Expert.findById(req.body.expertId);
    const revRentItemiId = await RentItems.findById(req.body.architectId);
    const revArchiId = await architect.findById(req.body.expertId);
    const revProjectId = await projects.findById(req.body.projectId);

    if (revShopId) {
      const rater = await ratingShop.findOne(
        { user: req.user.id },
        { shopId: req.body.shopId }
      );

      rate = await ratingShop.findByIdAndDelete(req.params.id);

      await shop.updateOne(
        { _id: req.body.shopId },
        {
          $pull: {
            raters: req.user.id,
          },
        }
      );
      await shop.updateOne(
        { _id: req.body.shopId },
        {
          $pull: {
            shopRatings: rate.id,
          },
        }
      );
      await User.findOneAndUpdate(
        { id: req.user.id },
        {
          $pull: {
            shopRatings: rate.id,
          },
        }
      );
    }
    if (revItemId) {
      const rater = await ratingItem.findOne({ user: req.user.id });

      rate = await ratingItem.findByIdAndDelete(req.params.id);
      await item.updateOne(
        { _id: req.body.itemId },
        {
          $pull: {
            raters: req.user.id,
          },
        }
      );
      await item.updateOne(
        { _id: req.body.itemId },
        {
          $pull: {
            itemRatings: rate.id,
          },
        }
      );
      await User.findOneAndUpdate(
        { id: req.user.id },
        {
          $pull: {
            itemRatings: rate.id,
          },
        }
      );
    }

    if (revExpertId) {
      const rater = await ratingExpert.findOne({ user: req.user.id });

      rate = await ratingExpert.findByIdAndDelete(req.params.id);

      await Expert.updateOne(
        { _id: req.body.expertId },
        {
          $pull: {
            raters: req.user.id,
          },
        }
      );
      await Expert.updateOne(
        { _id: req.body.expertId },
        {
          $pull: {
            expertRatings: rate.id,
          },
        }
      );
      await User.findOneAndUpdate(
        { id: req.user.id },
        {
          $pull: {
            expertRatings: rate.id,
          },
        }
      );
    }

    if (revArchiId) {
      const rater = await ratingArchitect.findOne({ user: req.user.id });

      rate = await ratingArchitect.findByIdAndDelete(req.params.id);
      await architect.updateOne(
        { _id: req.body.architectId },
        {
          $pull: {
            raters: req.user.id,
          },
        }
      );
      await architect.updateOne(
        { _id: req.body.architectId },
        {
          $pull: {
            architectRatings: rate.id,
          },
        }
      );
      await User.findOneAndUpdate(
        { id: req.user.id },
        {
          $pull: {
            architectRatings: rate.id,
          },
        }
      );
    }
    if (revRentItemiId) {
      const rater = await ratingRentItems.findOne({ user: req.user.id });

      rate = await ratingRentItems.findByIdAndDelete(req.params.id);
      await RentItems.updateOne(
        { _id: req.body.rentItemId },
        {
          $pull: {
            raters: req.user.id,
          },
        }
      );
      await RentItems.updateOne(
        { _id: req.body.rentItemId },
        {
          $pull: {
            rentItemRatings: rate.id,
          },
        }
      );
      await User.findOneAndUpdate(
        { id: req.user.id },
        {
          $pull: {
            rentItemRatings: rate.id,
          },
        }
      );
    }
    if (revProjectId) {
      rate = await ratingProjects.findByIdAndDelete(req.params.id);
      await projects.updateOne(
        { _id: req.body.projectId },
        {
          $pull: {
            raters: req.user.id,
          },
        }
      );
      await projects.updateOne(
        { _id: req.body.projectId },
        {
          $pull: {
            projectRatings: rate.id,
          },
        }
      );
      await User.findOneAndUpdate(
        { id: req.user.id },
        {
          $pull: {
            projectRatings: rate.id,
          },
        }
      );
    }

    res.status(200).json({ success: true, data: rate });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
