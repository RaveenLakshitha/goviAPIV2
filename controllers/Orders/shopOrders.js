const Order = require("../../models/Orders/shopOrders");
const shop = require("../../models/shop");
const user = require("../../models/user");
const Item = require("../../models/Items&Rent/item");
//@desc     Remove item from Cart
//@route    Post /api/v1/Categories
//@access   Public

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("orderedItem")
      .populate({
        path: "orderedItem",
        populate: {
          path: "item",
          model: Item,
        },
      })
      .populate({
        path: "orderedItem",
        populate: {
          path: "shop",
          model: shop,
        },
      });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get shops orders
//@route    Post /api/v1/Categories
//@access   Public
exports.getUsersOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: "orderedItem",
        populate: {
          path: "item",
          model: Item,
        },
      })
      .populate({
        path: "orderedItem",
        populate: {
          path: "shop",
          model: shop,
        },
      });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get shops orders
//@route    Post /api/v1/Categories
//@access   Public
exports.getShopOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ shop: req.user.shopId })
      .populate({
        path: "orderedItem",
        populate: {
          path: "item",
          model: Item,
        },
      })
      .populate({
        path: "orderedItem",
        populate: {
          path: "shop",
          model: shop,
        },
      });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Remove item from Cart
//@route    Post /api/v1/Categories
//@access   Public
exports.getUnpaidShopOrdersByUser = async (req, res, next) => {
  try {
    const orders = await Order.find(
      { user: req.user },
      { userToAdminPay: false }
    )
      .populate({
        path: "orderedItem",
        populate: {
          path: "item",
          model: Item,
        },
      })
      .populate({
        path: "orderedItem",
        populate: {
          path: "shop",
          model: shop,
        },
      });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Remove item from Cart
//@route    Post /api/v1/Categories
//@access   Public
exports.getUnpaidShopOrdersByAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find({
      adminToShopPay: false,
      paymentOption: "Online",
    })
      .populate({
        path: "orderedItem",
        populate: {
          path: "item",
          model: Item,
        },
      })
      .populate({
        path: "orderedItem",
        populate: {
          path: "shop",
          model: shop,
        },
      });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Remove item from Cart
//@route    Post /api/v1/Categories
//@access   Public
exports.getTakeawayShopOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ paymentOption: "Takeaway" })
      .populate({
        path: "orderedItem",
        populate: {
          path: "item",
          model: Item,
        },
      })
      .populate({
        path: "orderedItem",
        populate: {
          path: "shop",
          model: shop,
        },
      });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Remove item from Cart
//@route    Post /api/v1/Categories
//@access   Public
exports.getCODShopOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      paymentOption: "CashOnDelivery",
    })
      .populate({
        path: "orderedItem",
        populate: {
          path: "item",
          model: Item,
        },
      })
      .populate({
        path: "orderedItem",
        populate: {
          path: "shop",
          model: shop,
        },
      });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Remove item from Cart
//@route    Post /api/v1/Categories
//@access   Public
exports.getUndeliveredShopOrdersByShop = async (req, res, next) => {
  try {
    const orders = await Order.find({ deliveryStatus: false })
      .populate({
        path: "orderedItem",
        populate: {
          path: "item",
          model: Item,
        },
      })
      .populate({
        path: "orderedItem",
        populate: {
          path: "shop",
          model: shop,
        },
      });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Remove item from Cart
//@route    Post /api/v1/Categories
//@access   Public
exports.payUnpaidShopOrdersByUser = async (req, res, next) => {
  try {
    const orders = await Order.findByIdAndUpdate(
      req.params.id,
      { adminToShopPay: true },
      { new: true }
    );

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Remove item from Cart
//@route    Post /api/v1/Categories
//@access   Public
exports.sendUndeliveredShopOrdersByShop = async (req, res, next) => {
  try {
    const orders = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus: true },
      { new: true }
    );

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Add Item to Cart
//@route    Post /api/v1/Categories
//@access   Public
exports.addOrderToShop = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);
    await shop.findOneAndUpdate(
      { id: req.params.shopId },
      {
        $push: {
          orders: order.id,
        },
      }
    );
    await user.findByIdAndUpdate(req.user.id, {
      $push: {
        orders: order.id,
      },
    });

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
          adminOrders: order.id,
        },
      },
      { new: true }
    );

    return res.status(200).json({ success: true, data: order });
    //[Order model should update with cart Items when click the Place Order button]-->Enter bank Card-->Pass By PayCheck-->Place Order-->Change Payment Status
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Add Item to Cart
//@route    Post /api/v1/Categories
//@access   Public
exports.ChangeShopOrderStatus = async (req, res, next) => {
  try {
    const newState = Order.findByIdAndUpdate(req.body.id, req.body.newStatus);

    return res.status(200).json({ success: true, data: newState });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
/* //@desc     Remove item from Cart
//@route    Post /api/v1/Categories
//@access   Public
exports.removeOrder = async (req, res, next) => {
  try {
    const cart = new Cart({
      user: req.user.id,
      cartItems: req.body.cartItems,
    });

    cart.save((cart) => {
      if (cart) {
        return res.status(200).json({ success: true, data: cart });
      }
    });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
 */
