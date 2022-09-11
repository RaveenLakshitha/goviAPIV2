const item = require("../models/Items&Rent/item");
const User = require("../models/user");
const shop = require("../models/shop");
const reviews = require("../models/Reviews/review");
const Expert = require("../models/Experts/experts");
const Architect = require("../models/Architects/architect");
const RentItem = require("../models/Items&Rent/RentItems");
const project = require("../models/Architects/projects");
const ErrorResponse = require("../utils/errorResponse");
//@desc     Get all reviews
//@route    Get /api/v1/reviews
//@access   Public
exports.getReviews = async (req, res, next) => {
  try {
    const Reviews = await reviews.find();

    res
      .status(200)
      .json({ success: true, count: Reviews.length, data: Reviews });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a order
//@route    Get /api/v1/orders/:id
//@access   Public
exports.getUsersReviews = async (req, res, next) => {
  try {
    const reviews = await User.findById(req.user.id).populate("reviews");
    if (!reviews) {
      return next(
        new ErrorResponse(`User not Found With id of ${req.user.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: reviews,
      // usersShop: logedUser.shop,
    });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a order
//@route    Get /api/v1/orders/:id
//@access   Public
exports.getSingleUsersReviews = async (req, res, next) => {
  try {
    const reviews = await User.findById(req.params.id).populate("reviews");
    if (!reviews) {
      return next(
        new ErrorResponse(`User not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: reviews,
      // usersShop: logedUser.shop,
    });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Create a order
//@route    Post /api/v1/orders
//@access   Public
exports.createReview = async (req, res, next) => {
  try {
    //Add user to req.body
    var review;
    req.body.user = req.user.id;
    console.log(req.user.id);
    const createdReview = await reviews.findById(req.params.id);
    if (createdReview) {
      review = createdReview;
    } else {
      review = await reviews.create(req.body);
    }

    const revShopId = await shop.findById(req.body.shopId);
    const revItemId = await item.findById(req.body.itemId);
    const revExpertId = await Expert.findById(req.body.expertId);
    const revArchitectId = await Architect.findById(req.body.architectId);
    const revRentItemId = await RentItem.findById(req.body.rentItemId);
    const revProjectId = await project.findById(req.body.projectId);

    if (revShopId) {
      await shop.findOneAndUpdate(
        { id: req.body.shopId },
        {
          $push: {
            shopReviews: review.id,
          },
        }
      );
      await User.findOneAndUpdate(
        { id: req.user.id },
        {
          $push: {
            addedReviewsShop: review.id,
          },
        }
      );
    }
    if (revItemId) {
      await item.findOneAndUpdate(
        { id: req.body.itemId },
        {
          $push: {
            itemReviews: review.id,
          },
        }
      );
      await User.findOneAndUpdate(
        { id: req.user.id },
        {
          $push: {
            addedReviewsItems: review.id,
          },
        }
      );
    }
    if (revExpertId) {
      await Expert.findOneAndUpdate(
        { id: req.body.expertId },
        {
          $push: {
            expertReviews: review.id,
          },
        }
      );
      await User.findOneAndUpdate(
        { id: req.user.id },
        {
          $push: {
            addedReviewsExperts: review.id,
          },
        }
      );
    }
    if (revArchitectId) {
      await Architect.findOneAndUpdate(
        { id: req.body.architectId },
        {
          $push: {
            architectReviews: review.id,
          },
        }
      );
      await User.findOneAndUpdate(
        { id: req.user.id },
        {
          $push: {
            addedReviewsItems: review.id,
          },
        }
      );
    }
    if (revRentItemId) {
      await RentItem.findOneAndUpdate(
        { id: req.body.rentItemId },
        {
          $push: {
            rentItemReviews: review.id,
          },
        }
      );
      await User.findOneAndUpdate(
        { id: req.user.id },
        {
          $push: {
            addedReviewsRentItems: review.id,
          },
        }
      );
    }
    if (revProjectId) {
      await project.findOneAndUpdate(
        { id: req.body.projectId },
        {
          $push: {
            projectReviews: review.id,
          },
        }
      );
      await User.findOneAndUpdate(
        { id: req.user.id },
        {
          $push: {
            addedReviewsProject: review.id,
          },
        }
      );
    }
    console.log(review);
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Update a orders
//@route    Put /api/v1/order
//@access   Public
exports.updateReview = async (req, res, next) => {
  const review = await reviews.findByIdAndUpdate(
    req.params.id,
    { review: req.body.review },
    { new: true }
  );
  res.status(200).json({ success: true, data: review });
};
//@desc     Delete a order
//@route    Delete /api/v1/order
//@access   Private
exports.deleteReview = async (req, res, next) => {
  const revShopId = await shop.findById(req.body.shopId);
  const revItemId = await item.findById(req.body.itemId);
  const revExpertId = await Expert.findById(req.body.expertId);
  const revArchitectId = await Architect.findById(req.body.architectId);
  const revRentItemId = await RentItem.findById(req.body.rentItemId);
  const revProjectId = await project.findById(req.body.projectId);
  const review = await reviews.findByIdAndDelete(req.params.id);

  if (revShopId) {
    await shop.findOneAndUpdate(
      { id: req.body.shopId },
      {
        $pull: {
          shopReviews: review.id,
        },
      }
    );
    await User.findOneAndUpdate(
      { id: req.user.id },
      {
        $pull: {
          addedReviewsShop: review.id,
        },
      }
    );
  }
  if (revItemId) {
    await item.findOneAndUpdate(
      { id: req.body.itemId },
      {
        $pull: {
          itemReviews: review.id,
        },
      }
    );
    await User.findOneAndUpdate(
      { id: req.user.id },
      {
        $pull: {
          addedReviewsItems: review.id,
        },
      }
    );
  }
  if (revExpertId) {
    await Expert.findOneAndUpdate(
      { id: req.body.expertId },
      {
        $pull: {
          expertReviews: review.id,
        },
      }
    );
    await User.findOneAndUpdate(
      { id: req.user.id },
      {
        $pull: {
          addedReviewsExperts: review.id,
        },
      }
    );
  }
  if (revArchitectId) {
    await Architect.findOneAndUpdate(
      { id: req.body.architectId },
      {
        $pull: {
          architectReviews: review.id,
        },
      }
    );
    await User.findOneAndUpdate(
      { id: req.user.id },
      {
        $pull: {
          addedReviewsItems: review.id,
        },
      }
    );
  }
  if (revRentItemId) {
    await RentItem.findOneAndUpdate(
      { id: req.body.rentItemId },
      {
        $pull: {
          rentItemReviews: review.id,
        },
      }
    );
    await User.findOneAndUpdate(
      { id: req.user.id },
      {
        $pull: {
          addedReviewsRentItems: review.id,
        },
      }
    );
  }
  if (revProjectId) {
    await project.findOneAndUpdate(
      { id: req.body.projectId },
      {
        $pull: {
          projectReviews: review.id,
        },
      }
    );
    await User.findOneAndUpdate(
      { id: req.user.id },
      {
        $pull: {
          addedReviewsProject: review.id,
        },
      }
    );
  }
  res
    .status(200)
    .json({ success: true, msg: `Delete review ${req.params.id}` });
};
