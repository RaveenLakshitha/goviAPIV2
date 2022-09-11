const Questions = require("../../models/Forum/Questions");
const user = require("../../models/user");
const category = require("../../models/Categories/forumCategories");
const ErrorResponse = require("../../utils/errorResponse");
//###################################Get all Questions,Get Question,Get users Question by id,Get Logged users Questions#########################################
//@desc     Get all Questions
//@route    Get /api/v1/Forum/getQuestions
//@access   Public
exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await Questions.find().populate("Answers");
    res
      .status(200)
      .json({ success: true, count: questions.length, data: questions });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Get single Question
//@route    Get /api/v1/Forum/getQuestion
//@access   Public
exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Questions.findById({
      _id: req.params.id,
    }).populate("Answers");

    if (!question) {
      return next(
        new ErrorResponse(`Question not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: question });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Get logged users Questions
//@route    Get /api/v1/Forum/getQuestions
//@access   Private
exports.getMyQuestions = async (req, res, next) => {
  try {
    const questions = await Questions.find({ user: req.user.id, status: true });
    res
      .status(200)
      .json({ success: true, count: Questions.length, data: questions });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get specific users Questions by id.
//@route    Get /api/v1/Forum/getUsersQuestions
//@access   Public
exports.getUsersQuestions = async (req, res, next) => {
  try {
    const questions = await Questions.find({ user: req.params.id });
    if (!questions) {
      return next(
        new ErrorResponse(`User ${req.params.id} don't have Questions`, 404)
      );
    }
    res.status(200).json({ success: true, data: questions });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//###################################Get all Questions,Get Question,Get users Question by id,Get Logged users Questions#########################################
//###################################Create Questions#########################################

//@desc     Add a Question
//          -Add Q into users Asked Q(array) in users Model.
//          -Add Q into category(array) in category Model.
//@route    Post /api/v1/Forum/AddQuestion
//@access   Private
exports.AddQuestion = async (req, res, next) => {
  try {
    if (req.file) {
      const data = await uploadToCloudinary(req.file.path, "QA-images");
      req.body.imageUrl = data.url;
      req.body.publicId = data.public_id;
    }

    req.body.user = req.user.id;
    console.log(req.user);
    console.log(req.user.id);
    const Question = await Questions.create(req.body);
    await user.findByIdAndUpdate(req.user.id, {
      $push: {
        questAsked: Question.id,
      },
    });
    await category.findOneAndUpdate(
      { categoryName: req.body.Category },
      {
        $push: {
          Questions: Question.id,
        },
      }
    );
    res.status(200).json({ success: true, data: Question });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//###################################Create Questions#########################################
//###################################Upvote to Question,Downvote to Question#########################################

//@desc     Add like to Question
//@route    Post /api/v1/Forum/AddVoteToQuest/:id
//@access   Private
exports.AddVoteToQuest = async (req, res, next) => {
  try {
    const voted = await Questions.findById(req.params.id);

    if (voted.votedUser.includes(req.user.id)) {
      return next(
        new ErrorResponse(`Question was voted by user ${req.user.id}`, 404)
      );
    } else {
      const Quest = await Questions.updateOne(
        { _id: req.params.id },
        { $inc: { Vote: 1 } }
        //Add voted Q or A ID into user profile
      );

      await Questions.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            votedUser: req.user.id,
          },
        },
        { new: true }
      );

      await Questions.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            downvotedUser: req.user.id,
          },
        },
        { new: true }
      );

      res.status(200).json({ success: true, data: Quest });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Remove like from Question
//@route    Post /api/v1/Forum/DownVoteToQuest/:id
//@access   Private
exports.DownVoteFromQuest = async (req, res, next) => {
  try {
    const voted = await Questions.findById(req.params.id);

    if (voted.downvotedUser.includes(req.user.id)) {
      return next(
        new ErrorResponse(`Question was down voted by user ${req.user.id}`, 404)
      );
    } else {
      const Quest = await Questions.updateOne(
        { _id: req.params.id },
        { $inc: { Vote: -1 } }
        //Add voted Q or A ID into user profile
      );

      await Questions.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            votedUser: req.user.id,
          },
        },
        { new: true }
      );
      await Questions.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            downvotedUser: req.user.id,
          },
        },
        { new: true }
      );

      res.status(200).json({ success: true, data: Quest });
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//###################################Upvote to Question,Downvote to Question#########################################
//###################################Remove User Question,Block Question,Unblock Question#########################################

//@desc     Remove users Question
//          Remove Q from user and category Models
//@route    Delete /api/v1/Forum/RemoveQuestion/:id
//@access   Private
exports.RemoveQuestion = async (req, res, next) => {
  try {
    const PQuest = await Questions.findById(req.params.id);
    console.log(PQuest);
    const Question = await Questions.findByIdAndDelete(req.params.id);

    await user.findByIdAndUpdate(PQuest.user, {
      $pull: { questAsked: req.params.id },
    });

    await category.findOneAndUpdate(
      { categoryName: PQuest.Category },
      {
        $pull: {
          Questions: Question.id,
        },
      }
    );

    if (!Question) {
      return next(
        new ErrorResponse(`Question not Found With id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Block Question
//@route    Post /api/v1/Forum/BlockQuestion/:id
//@access   Private
exports.BlockQuestion = async (req, res, next) => {
  try {
    const Question = await Questions.findByIdAndUpdate(req.params.id, {
      $set: { status: false },
    });

    await category.findOneAndUpdate(
      { categoryName: Question.Category },
      {
        $pull: {
          Questions: Question.id,
        },
      }
    );

    if (!Question) {
      return next(
        new ErrorResponse(`Question not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: Question.status });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Unblock Question
//@route    Post /api/v1/Forum/UnblockQuestion/:id
//@access   Private
exports.UnblockQuestion = async (req, res, next) => {
  try {
    const Question = await Questions.findByIdAndUpdate(req.params.id, {
      $set: { status: true },
    });

    await category.findOneAndUpdate(
      { categoryName: Question.Category },
      {
        $push: {
          Questions: Question.id,
        },
      }
    );

    if (!Question) {
      return next(
        new ErrorResponse(`Question not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: Question.status });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//###################################Update Question#########################################

//@desc     Get all Questions
//@route    put /api/v1/Forum//UpdateQuestion/:id
//@access   Public
exports.UpdateQuestion = async (req, res, next) => {
  try {
    //const PQuest = await Questions.findById(req.params.id);
    const Question = await Questions.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    /*  await category.findOneAndUpdate(
      { categoryName: PQuest.Category },
      {
        $pull: {
          Questions: Question.id,
        },
      }
    );
    await category.findOneAndUpdate(
      { categoryName: req.body.Category },
      {
        $push: {
          Questions: Question.id,
        },
      }
    ); */
    if (!Question) {
      return next(
        new ErrorResponse(`Question not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: Question });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Update a Question picture
//@route    Put /api/v1/shops
//@access   Public
exports.updatePicture = async (req, res, next) => {
  try {
    const data = await uploadToCloudinary(req.file.path, "QA-images");
    req.body.imageUrl = data.url;
    req.body.publicId = data.public_id;

    const Question = await Questions.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!Question) {
      return next(
        new ErrorResponse(`Question not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: Question });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
