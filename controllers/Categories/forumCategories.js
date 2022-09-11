const Category = require("../../models/Categories/forumCategories");
const ErrorResponse = require("../../utils/errorResponse");
function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      categoryName: cate.categoryName,
      slug: cate.slug,
      Items: cate.Items,
      children: createCategories(categories, cate._id),
    });
  }
  return categoryList;
}

//@desc     Get all Categories
//@route    Get /api/v1/Categories
//@access   Public
exports.getCategories = async (req, res, next) => {
  try {
    const Categories = await Category.find().populate("Questions");
    res
      .status(200)
      .json({ success: true, count: Categories.length, data: Categories });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a Category
//@route    Get /api/v1/Categories/:id
//@access   Public
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById({
      _id: req.params.id,
      visibility: "Active",
    }).populate("Items");

    if (!category) {
      return next(
        new ErrorResponse(
          `category not Found With id of ${req.params.categoryName}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get sub Categories by parent id
//@route    Get /api/v1/Categories/:id
//@access   Public
exports.getCategoryByParent = async (req, res, next) => {
  try {
    const category = await Category.find({
      parentId: req.params.id,
    }).populate("Items");

    if (!category) {
      return next(
        new ErrorResponse(
          `category not Found With id of ${req.params.categoryName}`,
          404
        )
      );
    }
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Create a Category
//@route    Post /api/v1/Categories
//@access   Public
exports.createCategory = async (req, res, next) => {
  try {
    if (req.user.role === "Admin") {
      const categoryObj = {
        categoryName: req.body.categoryName,
        categoryType: req.body.categoryType,
      };
      if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
      }
      if (req.file) {
        categoryObj.image = req.file.location;
      }
      console.log(categoryObj.categoryName);
      const created = await Category.findOne({
        categoryName: categoryObj.categoryName,
      });
      if (!created) {
        const cat = await Category.create(categoryObj);
        if (categoryObj.parentId) {
          await Category.findByIdAndUpdate(
            { _id: categoryObj.parentId },
            {
              $push: {
                SubCategories: cat.id,
              },
            }
          );
        }
        res.status(200).json({ success: true, data: cat });
      } else {
        return next(
          new ErrorResponse(
            `Category ${categoryObj.categoryName} already created!`,
            404
          )
        );
      }
    } else {
      return next(
        new ErrorResponse(`User ${req.user.userName} not an Admin`, 404)
      );
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Update a Category
//@route    Put /api/v1/Categories/:id
//@access   Public
exports.updateCategory = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = req.file.location;
    }
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({
      success: true,
      msg: `Update Category ${req.params.id}`,
      data: category,
    });
  } catch (err) {
    res.status(400).json({ success: false });
    next(err);
  }
};

//@desc     Delete a Category
//@route    Delete /api/v1/Categories/:id
//@access   Private
exports.deleteCategory = async (req, res, next) => {
  try {
    if (req.user.role === "Admin") {
      const category = await Category.findByIdAndDelete(req.params.id);

      if (!category) {
        return res.status(400).json({ success: false });
      }
      res.status(200).json({ success: true, data: {} });
    } else {
      return next(new ErrorResponse(`${req.user.id} not an Admin`, 404));
    }
  } catch (err) {
    res.status(400).json({ success: false });
    next(err);
  }
};
//@desc     Hide a Category
//@route    Delete /api/v1/Categories/:id
//@access   Private
exports.hideCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: { visibility: false },
      },
      { new: true }
    );

    if (!category) {
      return next(
        new ErrorResponse(`Category not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: category.visibility });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Show a Category
//@route    Delete /api/v1/Categories/:id
//@access   Private
exports.showCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: { visibility: true },
      },
      { new: true }
    );

    if (!category) {
      return next(
        new ErrorResponse(`Category not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: category.visibility });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
