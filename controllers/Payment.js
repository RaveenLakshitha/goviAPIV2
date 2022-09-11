//@desc    User to Admin payment
//@route    Get /api/v1/Forum/getQuestions
//@access   Public
exports.sendCartitemsToShopOrders = async (req, res, next) => {
    try {
      const Cart = await cart.findOne({ user: req.user.id });
      const cItems = [];
      cItems = Cart.cartItems;
      ()=>{
        await Shop.findByIdAndUpdate(x.shop,
          {
            $push: {
              orders: x.id,
            },
          }
        );  
      }
      res.status(200).json({ success: true, count: item.length, data: item });
    } catch (err) {
      res.status(400).json({ data: err });
      next(err);
    }
  };
  

  //@desc    Admin to shop payment
//@route    Get /api/v1/Forum/getQuestions
//@access   Public
exports.sendCartitemsToShopOrders = async (req, res, next) => {
    try {
      const Cart = await cart.findOne({ user: req.user.id });
      const cItems = [];
      cItems = Cart.cartItems;
      ()=>{
        await Shop.findByIdAndUpdate(x.shop,
          {
            $push: {
              orders: x.id,
            },
          }
        );  
      }
      res.status(200).json({ success: true, count: item.length, data: item });
    } catch (err) {
      res.status(400).json({ data: err });
      next(err);
    }
  };
  