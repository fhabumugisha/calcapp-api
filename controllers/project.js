const { validationResult } = require("express-validator");
const  Project  = require("../models/project");
const  User  = require("../models/user");

exports.getProjects = async (req, res, next) => {
 
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    const totalItems = await Project.find({
      userId: req.userId
    }).countDocuments();
    const projects = await Project.find({ userId: req.userId })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Fetched user projects successfully.",
      projects: projects,
      totalItems: totalItems
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postProject = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }

    const title = req.body.title;
    const type =  req.body.type;
    const totalAmount =  0;
    const project = new Project({
        title: title,
        type: type,
        userId : req.userId,
        totalAmount : totalAmount
    });
    try {
        const createdProject = await project.save();
        const user = await User.findById(req.userId);
        user.projects.push(createdProject);
        await user.save();
        res.status(200).json({
            message: 'Project created successfully',
            project : createdProject
        }); 
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
          }
          next(error);
    }
    
};

exports.updateProject = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.deleteProject = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.getProject = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.getProjectCategories = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.getProjectCategory = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.createProjectCategory = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.updateProjectCategory = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.deleteProjectCategory = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.getProjectCategoryItems = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.getProjectCategoryItem = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.createProjectCategoryItem = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.deleteProjectCategoryItem = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.updateProjectCategoryItem = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.getProjectItems = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.getProjectItem = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.createProjectItem = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.deleteProjectItem = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};

exports.updateProjectItem = (req, res, next) => {
  res.status(200).json({
    title: "Let go!",
    totalPrice: "200 Euros"
  });
};
