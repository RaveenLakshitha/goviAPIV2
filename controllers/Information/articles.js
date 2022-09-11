const ErrorResponse = require("../../utils/errorResponse");
const Article = require("../../models/Information/articles");
const info = require("../../models/Information/information");

//#############################################Get all article , Get article by Id  #########################################

//@desc     Get all article
//@route    Get /api/v1/article
//@access   Public
exports.getAllArticles = async (req, res, next) => {
  try {
    const article = await Article.find();
    res
      .status(200)
      .json({ success: true, count: article.length, data: article });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a article
//@route    Get /api/v1/article/:id
//@access   Public
exports.getArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      next(
        new ErrorResponse(`No article  Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: article });
  } catch (err) {
    next(
      new ErrorResponse(`No article Found With id of ${req.params.id}`, 404)
    );
  }
};
//@desc     Get a article
//@route    Get /api/v1/article/:id
//@access   Public
exports.getArticleByInfoId = async (req, res, next) => {
  try {
    const Info = await Article.find({ infoId: req.params.id });
    if (!Info) {
      next(
        new ErrorResponse(
          `No article Found With information id of ${req.params.id}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: Info });
  } catch (err) {
    next(err);
  }
};

//#############################################Get all article , Get article by Id  #########################################

//#############################################Create article #########################################

//@desc     Create a article
//@route    Post /api/v1/article
//@access   Public
exports.createArticle = async (req, res, next) => {
  try {
    if (req.file) {
      const data = await uploadToCloudinary(req.file.path, "info-images");
      req.body.imageUrl = data.url;
      req.body.publicId = data.public_id;
    }
    console.log(req.body);
    req.body.infoId = req.params.id;
    const article = await Article.create(req.body);

    await info.findByIdAndUpdate(req.params.id, {
      $push: {
        Articles: article.id,
      },
    });

    res.status(200).json({ success: true, data: article });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#############################################Create article #########################################
//#############################################Update article by id #########################################

//@desc     Update a article
//@route    Put /api/v1/article
//@access   Public
exports.updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!article) {
      return next(
        new ErrorResponse(`Article not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: article });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#############################################Update article by id #########################################
//#############################################Delete article,Change article visibility  #########################################
//@desc     Delete a article
//@route    Delete /api/v1/article
//@access   Private
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    await info.findOneAndUpdate(
      { infoId: req.body.infoId },
      {
        $pull: {
          Articles: article.id,
        },
      }
    );

    if (!article) {
      return next(
        new ErrorResponse(`No article  Found With id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//################################### Delete article,Change article visibility#########################################
