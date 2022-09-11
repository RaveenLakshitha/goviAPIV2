const Architect = require("../../models/Architects/architect");
const Project = require("../../models/Architects/projects");

//const Project = require("../models/project");
//const shop = require("../models/shop");

//@desc     Get all projects
//@route    Get /api/v1/projects
//@access   Public
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("architectId")
      .populate("userId");
    res
      .status(200)
      .json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get a Project
//@route    Get /api/v1/projects/:id
//@access   Public
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(
        new ErrorResponse(`Project not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Create a Project
//@route    Post /api/v1/projects
//@access   Public
exports.createProject = async (req, res, next) => {
  try {
    if (req.files) {
      if (req.files.projectPictures) {
        let projectPictures = [];

        if (req.files.projectPictures.length > 0) {
          projectPictures = req.files.projectPictures.map((file) => {
            return { img: file.location };
          });
        }
        req.body.projectPictures = projectPictures;
      }
    }
    // req.body.createdBy = req.user.id;
    req.body.architectId = req.user.architectId;
    req.body.userId = req.user.id;

    const project = await Project.create(req.body);
    await Architect.findOneAndUpdate(
      { user: req.user.id },
      {
        $push: {
          projects: project.id,
        },
      }
    );

    await Architect.findOneAndUpdate(
      { _id: project.architectId },
      { $inc: { projectCount: 1 } }
      //Add voted Q or A ID into user profile
    );

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Update a project
//@route    Put /api/v1/projects
//@access   Public
exports.updateProject = async (req, res, next) => {
  try {
    if (req.files) {
      let projectPictures = [];

      if (req.files.projectPictures.length > 0) {
        projectPictures = req.files.projectPictures.map((file) => {
          return { img: file.location };
        });
      }
      req.body.projectPictures = projectPictures;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return next(
        new ErrorResponse(`project not Found With id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//#################################### Delete Project #########################
//@desc     Delete project
//@route    Delete /api/v1/shops
//@access   Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    const delproject = await Project.findByIdAndDelete(req.params.id);
    await shop.findByIdAndUpdate(req.body.shopId, {
      $pull: { shopProjects: req.params.id },
    });

    await Architect.findOneAndUpdate(
      { _id: delproject.architectId },
      { $inc: { projectCount: -1 } }
    );

    if (!delproject) {
      return next(
        new ErrorResponse(`Project not Found With id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//#################################### Delete project #########################
//#######################################Block project,Unblock project###############################

//@desc     Block Project
//@route    Post /api/v1/Forum/BlockAnswer/:id
//@access   Private
exports.BlockProject = async (req, res, next) => {
  try {
    if (req.user.role == "Admin") {
      const project = await Project.findByIdAndUpdate(
        req.params.id,
        {
          $set: { projectVisibility: false },
        },
        { new: true }
      );
      await Architect.findOneAndUpdate(
        { _id: project.architectId },
        { $inc: { projectCount: -1 } }
      );

      if (!project) {
        return next(
          new ErrorResponse(
            `Project not Found With id of ${req.params.id}`,
            404
          )
        );
      }
      res.status(200).json({ success: true, data: project.projectVisibility });
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Unblock Answer
//@route    Post /api/v1/Forum/UnblockAnswer/:id
//@access   Private
exports.UnblockProject = async (req, res, next) => {
  try {
    if (req.user.role == "Admin") {
      const project = await Project.findByIdAndUpdate(
        req.params.id,
        {
          $set: { projectVisibility: true },
        },
        { new: true }
      );
      await shop.findOneAndUpdate(
        { _id: project.shopId },
        { $inc: { projectCount: 1 } }
      );

      if (!project) {
        return next(
          new ErrorResponse(
            `Project not Found With id of ${req.params.id}`,
            404
          )
        );
      }
      res.status(200).json({ success: true, data: project.projectVisibility });
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//#######################################Remove project,Block project,Unblock project###############################
