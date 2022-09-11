const Answers = require("../../models/Forum/Answers");
const user = require("../../models/user");
const Questions = require("../../models/Forum/Questions");
const ErrorResponse = require("../../utils/errorResponse");

//#######################################Get all answers###############################
//@desc     Get all Answers
//@route    Get /api/v1/Forum/getAnswers
//@access   Public
exports.getAnswers = async (req, res, next) => {
  try {
    const answers = await Answers.find().populate("userId");
    res
      .status(200)
      .json({ success: true, count: answers.length, data: answers });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#######################################Get all answers############################
//#######################################Add answers###############################

//@desc     Add Answer
//          -Add A into users Asked Q(array) in Question schema.
//          -Increment AnswerCount in Question Querry.
//@route    Post /api/v1/Forum/getAnswers
//@access   Private
exports.AddAnswer = async (req, res, next) => {
  // req.body.createdBy = req.user.id;
  if (req.file) {
    const data = await uploadToCloudinary(req.file.path, "QA-images");
    req.body.imageUrl = data.url;
    req.body.publicId = data.public_id;
  }
  req.body.userId = req.user.id;

  const Answer = await Answers.create(req.body);
  await Questions.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        Answers: Answer.id,
      },
    }
  );

  await Questions.findOneAndUpdate(
    { _id: req.params.id },
    { $inc: { AnswerCount: 1 } }
    //Add voted Q or A ID into user profile
  );

  res.status(200).json({ success: true, data: Answer });
};

//#######################################Add answers###############################
//#######################################Upvote answer,Down vote answer###############################
//@desc     Add vote to Answer
//@route    Post /api/v1/Forum/AddVoteToAnswer
//@access   Private
exports.AddVoteToAnswer = async (req, res, next) => {
  try {
    const voted = await Answers.findById(req.params.id);

    if (voted.votedUser.includes(req.user.id)) {
      return next(
        new ErrorResponse(`Answer was voted by user ${req.user.id}`, 404)
      );
    } else {
      const Ans = await Answers.updateOne(
        { _id: req.params.id },
        { $inc: { Vote: 1 } }
        //Add voted Q or A ID into user profile
      );

      await Answers.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            votedUser: req.user.id,
          },
        },
        { new: true }
      );

      await Answers.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            downvotedUser: req.user.id,
          },
        },
        { new: true }
      );

      res.status(200).json({ success: true, data: Ans });
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Remove vote from Answer
//@route    Post /api/v1/Forum/DownVoteToAnswer
//@access   Private
exports.DownVoteToAnswer = async (req, res, next) => {
  try {
    const voted = await Answers.findById(req.params.id);

    if (voted.downvotedUser.includes(req.user.id)) {
      return next(
        new ErrorResponse(`Answer was down voted by user ${req.user.id}`, 404)
      );
    } else {
      const Ans = await Answers.updateOne(
        { _id: req.params.id },
        { $inc: { Vote: -1 } }
        //Add voted Q or A ID into user profile
      );

      await Answers.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            votedUser: req.user.id,
          },
        },
        { new: true }
      );
      await Answers.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            downvotedUser: req.user.id,
          },
        },
        { new: true }
      );

      res.status(200).json({ success: true, data: Ans });
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#######################################Upvote answer,Down vote answer###############################
//#######################################Remove answer,Block answer,Unblock answer###############################
//@desc     Delete an Answer
//@route    Delete /api/v1/Forum/RemoveAnswer/:id
//@access   Public
exports.RemoveAnswer = async (req, res, next) => {
  try {
    const ans = await Answers.findByIdAndDelete(req.params.id);
    await Questions.findByIdAndUpdate(req.body.QuestionId, {
      $pull: { Answers: req.params.id },
    });

    if (!ans) {
      return next(
        new ErrorResponse(`Answers not Found With id of ${req.params.id}`, 404)
      );
    }
    await Questions.findOneAndUpdate(
      { _id: req.body.QuestionId },
      { $inc: { AnswerCount: -1 } }
      //Add voted Q or A ID into user profile
    );

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Block Answer
//@route    Post /api/v1/Forum/BlockAnswer/:id
//@access   Private
exports.BlockAnswer = async (req, res, next) => {
  try {
    const Answer = await Answers.findByIdAndUpdate(req.params.id, {
      $set: { status: false },
    });

    if (!Answer) {
      return next(
        new ErrorResponse(`Answer not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: Answer.status });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Unblock Answer
//@route    Post /api/v1/Forum/UnblockAnswer/:id
//@access   Private
exports.UnblockAnswer = async (req, res, next) => {
  try {
    const Answer = await Answers.findByIdAndUpdate(req.params.id, {
      $set: { status: true },
    });

    if (!Answer) {
      return next(
        new ErrorResponse(`Answer not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: Answer.status });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//#######################################Remove answer,Block answer,Unblock answer###############################
//#######################################Update answer###############################

//@desc     Update an Answer
//@route    Put /api/v1/Forum/UpdateAnswer/:id
//@access   Public
exports.UpdateAnswer = async (req, res, next) => {
  try {
    const Answer = await Answers.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!Answer) {
      return next(
        new ErrorResponse(`Answer not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: Answer });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#######################################Update answer###############################
