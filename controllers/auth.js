const user = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/mainSender");
const asyncHandler = require("../middleware/async");
const crypto = require("crypto");
const cart = require("../models/Cart/cart");
const list = require("../models/Wishlist/wishlist");

//#############################################Create User, User Login#########################################

//@desc     Create a user
//@route    Post /api/v1/users
//@access   Public
exports.createUser = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.profilePicture = req.file.location;
    }

    //Check for registered user
    const createdUser = await user.findOne(
      { email: req.body.email },
      { userVisibility: ["Active", "Suspend"] }
    );

    if (createdUser) {
      return next(
        new ErrorResponse(
          `The user  has already registered with email ${req.body.email}`,
          400
        )
      );
    }
    const User = await user.create(req.body);
    //Create Token
    const token = User.getSignedJwtToken();

    const Cart = await cart.create({ user: User.id });
    const List = await list.create({ user: User.id });

    await user.findByIdAndUpdate(User.id, { cartId: Cart._id });
    const U = await user.findByIdAndUpdate(
      User.id,
      { listId: List._id },
      { new: true }
    );

    res.status(201).json({ success: true, data: U, token });
  } catch (err) {
    res.status(400).json({ data: err });
  }
};

//@desc     Login User
//@route    Post /api/v1/users
//@access   Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validate email and password
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 401)
      );
    }

    //Check for user
    const User = await user.findOne({ email }).select("+password");

    if (!User) {
      return next(new ErrorResponse("Invalid Email", 401));
    }

    //Check if password matches
    const isMatch = await User.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credintials", 401));
    }

    sendTokenResponse(User, 200, res);
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     signout User
//@route    Get /api/v1/signoutUser
//@access   Public
exports.signoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Signout success" });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#############################################Create User, User Login#########################################

//#############################################Get all Users , Get logged user , Get user by Id#########################################

//@desc         Get Current Logged user
//@route        Get /api/v1/auth/me
//@access       private

exports.getMe = async (req, res, next) => {
  try {
    const logedUser = await user.findById(req.user.id);

    if (!logedUser) {
      return next(
        new ErrorResponse(`User not Found With id of ${req.user.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: logedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc         Get Login user by Id
//@route        Get /api/v1/auth/me
//@access       private

exports.getSingleUser = async (req, res, next) => {
  try {
    const User = await user.findById(req.params.id).populate("shopId");

    if (!User) {
      return next(
        new ErrorResponse(`User not Found With name of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: User });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get all users
//@route    Get /api/v1/users
//@access   Public
exports.getUsers = async (req, res, next) => {
  try {
    const users = await user.find();
    //.populate("shopId", { shopName: 1, email: 1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get all users
//@route    Get /api/v1/users
//@access   Public
exports.getOwners = async (req, res, next) => {
  try {
    var users;
    if (req.params.owns == "shop") {
      users = await user.find({ shopId: { $exists: true } }).populate("shopId");
    } else if (req.params.owns == "architect") {
      users = await user
        .find({ architectId: { $exists: true, $ne: null } })
        .populate("shopId");
    } else if (req.params.owns == "expert") {
      users = await user
        .find({ expertId: { $exists: true, $ne: null } })
        .populate("shopId");
    } else {
      users = await user.find().populate("shopId");
    }
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#############################################Get all Users , Get logged user , Get user by Id#########################################

//################################### Update Logged user,Update user by id,Update Profile Picture by user id, Update Logged user profile picture #########################################

//@desc     Update logged user
//@route    Put /api/v1/users/updateMe/:id
//@access   Public
exports.updateLoggedUser = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.profilePicture = req.file.location;
    }
    const User = await user.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!User) {
      return next(
        new ErrorResponse(`User not Found With name of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: User });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Update a user
//@route    Put /api/v1/users/:id
//@access   Public
exports.updateUser = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.profilePicture = req.file.location;
    }
    const User = await user.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!User) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: User });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Update Logged user profile picture
//@route    Put /api/v1/users/updateMyPRofilePic/
//@access   Public
exports.updateUserProfilePicture = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.profilePicture = req.file.location;
    }
    const User = await user.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!User) {
      return next(
        new ErrorResponse(`User not Found With name of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: User });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Update a user
//@route    Put /api/v1/users/:id
//@access   Public
exports.updateProfilePic = async (req, res, next) => {
  try {
    if (req.file) {
      const User = await user.findByIdAndUpdate(
        req.params.id,
        { profilePicture: req.file.location },
        {
          new: true,
        }
      );
      if (!User) {
        return res.status(400).json({ success: false });
      }
      res.status(200).json({ success: true, data: User });
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//################################### Update Logged user,Update user by id,Update Profile Picture by user id, Update Logged user profile picture #########################################

//@desc     Create an Admin
//@route    Post /api/v1/users
//@access   Public
exports.createAdmin = async (req, res, next) => {
  try {
    if (req.user.role == "Admin") {
      req.body.role = "Admin";
      //Check for published shop
      const createdAdmin = await user.findOne({ email: req.body.email });

      //Admin can add more shops
      if (createdAdmin) {
        return next(
          new ErrorResponse(
            `The user has already registered with email${req.body.email}`,
            400
          )
        );
      }

      const Admin = await user.create(req.body);

      //Create Token
      const token = Admin.getSignedJwtToken();

      res.status(201).json({ success: true, data: Admin, token });
    } else {
      return next(
        new ErrorResponse(
          `User ${req.user.username} with id ${req.user.id} is not an Admin`,
          400
        )
      );
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//Get token from model,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create Token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  //prevent showing cookie in the production mode
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

//################################### Forget Password,Reset Password #########################################

//@desc     Reset Password
//@route    Put /api/v1/users/resetpassword/:token
//@access   Public
exports.resetPassword = async (req, res, next) => {
  try {
    //Get hashed Token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const User = await user.findOne({
      resetPasswordToken,
      restPasswordExpire: { $gt: Date.now() },
    });
    console.log(User);
    if (!User) {
      return next(new ErrorResponse(`Invalid Token`, 404));
    }

    //Set new Passsword
    User.password = req.body.password;
    User.resetPasswordToken = undefined;
    User.restPasswordExpire = undefined;
    await User.save();
    res.status(200).json({ success: true, data: User });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Forgot Password
//@route    Delete /api/v1/users/:id
//@access   Private
exports.forgotPassword = async (req, res, next) => {
  try {
    const User = await user.findOne({ email: req.body.email });

    if (!User) {
      return next(new ErrorResponse(`Invalid Token`, 404));
    }
    //Get reset token
    const resettoken = User.getResetPasswordToken();
    await User.save({ validateBeforeSave: false });

    //Create reset URL
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auths/resetpassword/${resettoken}`;

    const message =
      /* `Hi ${User.userName},\n\nThere was a request to change your Govi Piyasa user account password!\n
    If you did not make this request then please ignore this email.Otherwise,
     please click this link to change your password: \n\n ${resetURL}`; */
      `<p>Click <a href="${resetURL}">here</a> to reset your password</p>`;
    try {
      await sendEmail({
        email: User.email,
        subject: "Password Reset Token",
        message,
      });
      res.status(200).json({ success: true, data: "Email Send" });
    } catch (err) {
      console.log(err);
      User.resetPasswordToken = undefined;
      User.restPasswordExpire = undefined;
      await User.save({ validateBeforeSave: false });
      res.status(200).json({ success: false, data: "Email Not Sent" });
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//################################### Delete User,Change User visibility #########################################

//@desc     Delete a user
//@route    Delete /api/v1/users/:id
//@access   Private
exports.deleteUser = async (req, res, next) => {
  try {
    const User = await user.findByIdAndDelete(req.params.id);

    if (!User) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Update User visibility
//@route    Put /api/v1/Users
//@access   Public
exports.setUserStatus = async (req, res, next) => {
  try {
    if (req.user.role === "Admin") {
      //Block,Unblock,Approve,Decline,
      if (req.body.status === "Approve") {
        const User = await user.findByIdAndUpdate(
          req.params.id,
          {
            $set: { userVisibility: "Active" },
          },
          {
            new: true,
          }
        );

        if (!User) {
          return next(
            new ErrorResponse(`User not Found With id of ${req.params.id}`, 404)
          );
        }
        res.status(200).json({ success: true, data: User });
      }
      if (req.body.status === "Unblock") {
        const User = await user.findByIdAndUpdate(
          req.params.id,
          {
            $set: { userVisibility: "Active" },
          },
          {
            new: true,
          }
        );

        if (!User) {
          return next(
            new ErrorResponse(`User not Found With id of ${req.params.id}`, 404)
          );
        }
        res.status(200).json({ success: true, data: User });
      }
      if (req.body.status === "Block") {
        const User = await user.findByIdAndUpdate(
          req.params.id,
          {
            $set: { userVisibility: "Suspend" },
          },
          {
            new: true,
          }
        );

        if (!User) {
          return next(
            new ErrorResponse(`User not Found With id of ${req.params.id}`, 404)
          );
        }
        res.status(200).json({ success: true, data: User });
      }
    } else {
      return next(new ErrorResponse(`${req.user.userName} not an Admin`, 404));
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//################################### Delete User,Change User visibility#########################################
