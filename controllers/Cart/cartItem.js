const cart = require("../../models/Cart/cart");
const Item = require("../../models/Items&Rent/item");
const shopOrder = require("../../models/Orders/shopOrders");
const cartItem = require("../../models/Cart/cartItem");
const { findOne } = require("../../models/shop");
const ErrorResponse = require("../../utils/errorResponse");
const userOrders = require("../../models/Orders/userOrders");
const Shop = require("../../models/shop");
const User = require("../../models/user");

//increase item amount
//decrease item amount

//@desc     Get all Questions
//@route    Get /api/v1/Forum/getQuestions
//@access   Public
exports.getCartItems = async (req, res, next) => {
  try {
    const item = await cartItem.find();
    res.status(200).json({ success: true, count: item.length, data: item });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Create a architect
//@route    Post /api/v1/architects
//@access   Public
exports.createCartItem = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    req.body.cart = req.user.cartId;

    price = req.body.amount * req.body.unitPrice;
    req.body.totalPrice = price;

    const itemId = await Item.findById(req.body.item);
    req.body.shop = itemId.shopId;

    const Cart = await cart.findOne({ user: req.user.id });
    const newCartTotal = price + Cart.cartTotalPrice;
    const newCartOnline = price + Cart.priceToPayOnline;

    const cItem = await cartItem.create(req.body);

    var item;
    if (!Cart) {
      return next(
        new ErrorResponse(`Cart not Found With id of ${req.user.id}`, 404)
      );
    }

    item = await cart.findOneAndUpdate(
      { user: req.user.id },
      {
        $push: {
          cartItems: cItem.id,
        },
        $set: {
          cartTotalPrice: newCartTotal,
          priceToPayOnline: newCartOnline,
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
exports.deleteCartItem = async (req, res, next) => {
  try {
    var cItem = await cartItem.findById(req.params.id);
    var price = cItem.amount * cItem.unitPrice;

    const Cart = await cart.findOne({ user: req.user.id });
    const newCartTotal = Cart.cartTotalPrice - price;
    const newCartOnline = Cart.priceToPayOnline - price;

    const nCart = await cart.findOneAndUpdate(
      { user: req.user.id },
      {
        $pull: {
          cartItems: req.params.id,
        },
        $set: {
          cartTotalPrice: newCartTotal,
          priceToPayOnline: newCartOnline,
        },
      },
      { new: true }
    );

    const item = await cartItem.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: nCart });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Add like to Question
//@route    Post /api/v1/Forum/AddVoteToQuest/:id
//@access   Private
exports.AddAmount = async (req, res, next) => {
  try {
    //const cItemA = await cartItem.findOne({ _id: req.params.id });
    const item = await cartItem.updateOne(
      { _id: req.params.id },
      { $inc: { amount: 1 } }
    );
    const cItem = await cartItem.findOne({ _id: req.params.id });
    var price = cItem.totalPrice;
    price = cItem.amount * cItem.unitPrice;
    req.body.totalPrice = price;
    incPrice = cItem.unitPrice;
    const itemF = await cartItem.updateOne(
      { _id: req.params.id },
      { totalPrice: req.body.totalPrice }
    );
    const cartA = await cart.findOne({ user: req.user.id });
    const cartTotalPrice = cartA.cartTotalPrice;
    newTotalCartPrice = cartTotalPrice + incPrice;
    var Cart;
    Cart = await cart.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          cartItems: cItem.id,
        },
        $set: { cartTotalPrice: newTotalCartPrice },
      }
    );

    if (cItem.paymentOption == "Online") {
      Cart = await cart.findOneAndUpdate(
        { user: req.user.id },
        {
          $set: {
            cartItems: cItem.id,
          },
          $set: { priceToPayOnline: newTotalCartPrice },
        }
      );
    }
    res.status(200).json({ success: true, data: itemF, cart: Cart });
  } catch (err) {
    console.log(err);
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Add like to Question
//@route    Post /api/v1/Forum/AddVoteToQuest/:id
//@access   Private
exports.DownAmount = async (req, res, next) => {
  try {
    const item = await cartItem.updateOne(
      { _id: req.params.id },
      { $inc: { amount: -1 } }
    );
    const cItem = await cartItem.findOne({ _id: req.params.id });
    var price = cItem.totalPrice;
    price = cItem.amount * cItem.unitPrice;
    req.body.totalPrice = price;
    decPrice = cItem.unitPrice;
    const itemF = await cartItem.updateOne(
      { _id: req.params.id },
      { totalPrice: req.body.totalPrice }
    );
    const cartA = await cart.findOne({ user: req.user.id });
    const cartTotalPrice = cartA.cartTotalPrice;
    newTotalCartPrice = cartTotalPrice - decPrice;
    var Cart;
    Cart = await cart.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          cartItems: cItem.id,
        },
        $set: { cartTotalPrice: newTotalCartPrice },
      }
    );
    if (cItem.paymentOption == "Online") {
      Cart = await cart.findOneAndUpdate(
        { user: req.user.id },
        {
          $set: {
            cartItems: cItem.id,
          },
          $set: { priceToPayOnline: newTotalCartPrice },
        }
      );
    }
    res.status(200).json({ success: true, data: itemF, cart: Cart });
  } catch (err) {
    console.log(err);
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Add like to Question
//@route    Post /api/v1/Forum/AddVoteToQuest/:id
//@access   Private
exports.changePaymentOption = async (req, res, next) => {
  try {
    const cItem = await cartItem.findById(req.params.id);
    const cartA = await cart.findOne({ user: req.user.id });
    if (!cItem) {
      return next(
        new ErrorResponse(
          `The cart item with ID ${req.params.id} not found`,
          400
        )
      );
    }
    var newcart;
    if (
      req.params.option == "Online" &&
      cItem.paymentOption == "Takeaway" &&
      cartA.cartTotalPrice != 0
    ) {
      await cartItem.findOneAndUpdate(
        { user: req.user.id },
        {
          $set: { paymentOption: "Online" },
        }
      );

      var totalPrice = cItem.totalPrice;
      const onlinePrice = cartA.priceToPayOnline;
      newOnlinePrice = onlinePrice + totalPrice;
      if (newOnlinePrice <= cartA.cartTotalPrice) {
        newcart = await cart.findOneAndUpdate(
          { user: req.user.id },
          {
            $set: {
              cartItems: cItem.id,
            },
            $set: { priceToPayOnline: newOnlinePrice },
          },
          { new: true }
        );
      }
    } else if (
      req.params.option == "Takeaway" &&
      cItem.paymentOption == "Online" &&
      cartA.cartTotalPrice != 0 &&
      cartA.priceToPayOnline != 0
    ) {
      await cartItem.findOneAndUpdate(
        { user: req.user.id },
        {
          $set: { paymentOption: "Takeaway" },
        },
        { new: true }
      );

      var totalPrice = cItem.totalPrice;
      const onlinePrice = cartA.priceToPayOnline;
      newOnlinePrice = onlinePrice - totalPrice;
      if (newOnlinePrice <= cartA.cartTotalPrice) {
        newcart = await cart.findOneAndUpdate(
          { user: req.user.id },
          {
            $set: {
              cartItems: cItem.id,
            },
            $set: { priceToPayOnline: newOnlinePrice },
          },
          { new: true }
        );
      }
    } else if (
      req.params.option == "CashOnDelivery" &&
      cItem.paymentOption == "Online" &&
      cartA.cartTotalPrice != 0 &&
      cartA.priceToPayOnline != 0
    ) {
      await cartItem.findOneAndUpdate(
        { user: req.user.id },
        {
          $set: { paymentOption: "CashOnDelivery" },
        },
        { new: true }
      );

      var totalPrice = cItem.totalPrice;
      const onlinePrice = cartA.priceToPayOnline;
      newOnlinePrice = onlinePrice - totalPrice;
      if (newOnlinePrice <= cartA.cartTotalPrice) {
        newcart = await cart.findOneAndUpdate(
          { user: req.user.id },
          {
            $set: {
              cartItems: cItem.id,
            },
            $set: { priceToPayOnline: newOnlinePrice },
          },
          { new: true }
        );
      }
    }
    res.status(200).json({ success: true, data: newcart });
  } catch (err) {
    console.log(err);
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Get all Questions
//@route    Get /api/v1/Forum/getQuestions
//@access   Public
exports.sendCartitemsToShopOrders = async (req, res, next) => {
  try {
    const Cart = await cart
      .findOne({ user: req.user.id })
      .populate("cartItems");
    var cItems = [];
    cItems = Cart.cartItems;
    //For loop and async await
    const order = cItems.map(({ _id, shop, totalPrice }) => {
      const sOrder = shopOrder.create({
        shop: shop,
        user: req.user.id,
        orderedItem: _id,
        totalPrice: totalPrice,
        contactNumber: req.body.contactNumber,
        additionalPhoneNumber: req.body.additionalPhoneNumber,
        shippingaddress: req.body.address,
      });

      Shop.findByIdAndUpdate(shop, {
        $push: {
          ordersId: sOrder.id,
        },
      });
      User.updateMany(
        { role: "Admin" },
        {
          $push: {
            adminOrders: sOrder.id,
          },
        },
        { new: true }
      );
      User.findByIdAndUpdate(req.user.id, {
        $push: {
          orders: sOrder.id,
        },
      });
    });
    Promise.all(order) /* .then(console.log).catch(console.error) */;
    //Cart insert into user as an order

    for (var j = 0; j < cItems.length; j++) {
      var it = await Item.findById(cItems[j].item);
      var nit = it.quantity - cItems[j].amount;
      await Item.findByIdAndUpdate(cItems[j].item, {
        quantity: nit,
      });
      if (nit <= 0) {
        await Item.findByIdAndUpdate(
          cItems[j].item,
          {
            availability: false,
          },
          {
            $set: { quantity: 0 },
          }
        );
      }
    }

    //Cart insert into admin as an order
    //Remove all car items after checkout

    var newcart = await cart.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: { cartItems: [], cartTotalPrice: 0, priceToPayOnline: 0 },
      },
      { new: true }
    );
    console.log(newcart);
    res.status(200).json({ success: true, data: newcart });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
