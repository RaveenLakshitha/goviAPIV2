const Cart = require("../../models/Cart/cart");
const Item = require("../../models/Items&Rent/item");
//@desc     Get all Questions
//@route    Get /api/v1/Forum/getQuestions
//@access   Public
exports.getCarts = async (req, res, next) => {
  try {
    const carts = await Cart.find()
      .populate("user", { username: 1, email: 1 })
      .populate({
        path: "cartItems",
        populate: {
          path: "item",
          model: Item,
        },
      });
    res.status(200).json({ success: true, count: carts.length, data: carts });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get users Cart
//@route    Get /api/v1/Forum/getQuestions
//@access   Public
exports.getUsersCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate({
      path: "cartItems",
      populate: {
        path: "item",
        model: Item,
      },
    });
    if (!cart) {
      return next(
        new ErrorResponse(`Cart not Found With id of ${req.user.id}`, 404)
      );
    }
    //shop.itemCount = await item.countDocuments({ userId: req.user.id });
    res
      .status(200)
      // .json({ success: true, data: shop, items: shop.items, shopToken });
      .json({ success: true, data: cart });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Add Item to Cart
//@route    Post /api/v1/Categories
//@access   Public
exports.addItemToCart = async (req, res, next) => {
  try {
    const cart = new Cart({
      user: req.user.id,
      cartItems: req.body.cartItems,
      cartTotalPrice: req.body.cartTotalPrice,
    });

    //Check for createdCart
    const createdCart = await Cart.findOne({ user: req.user.id });

    if (createdCart) {
      //Check for addedItem in createdCart
      const product = req.body.cartItems.product;
      const item = await createdCart.cartItems.find(
        (i) => i.product == product
      );

      if (item) {
        await Cart.findOneAndUpdate(
          { user: req.user._id, "cartItems.product": product },
          {
            $set: {
              cartItems: {
                ...req.body.cartItems,
                quantity: item.quantity + req.body.cartItems.quantity,
              },
            },
          }
        );

        await Cart.findOneAndUpdate(
          { user: req.user._id, "cartItems.product": product },
          {
            $set: {
              cartItems: {
                ...req.body.cartItems,
                cartTotalPrice:
                  createdCart.cartTotalPrice + req.body.cartTotalPrice,
              },
            },
          }
        );
      } else {
        await Cart.findOneAndUpdate(
          { user: req.user._id },
          {
            $push: {
              cartItems: req.body.cartItems,
            },
          }
        );
      }

      return res.status(200).json({ success: true, data: cart });
    }

    cart.save((error, cart) => {
      if (cart) {
        return res.status(200).json({ success: true, data: cart });
      } else console.log(error);
    });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Remove item from Cart
//@route    Post /api/v1/Categories
//@access   Public
exports.removeItemFromCart = async (req, res, next) => {
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
