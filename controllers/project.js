const {
  validationResult
} = require("express-validator");
const Project = require("../models/project");
const User = require("../models/user");

exports.getProjects = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Project.find({
      userId: req.userId
    }).countDocuments();
    const projects = await Project.find({
        userId: req.userId
      })
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
  const type = req.body.type;
  const totalAmount = 0;
  const project = new Project({
    title: title,
    type: type,
    userId: req.userId,
    totalAmount: totalAmount
  });
  try {
    const createdProject = await project.save();
    const user = await User.findById(req.userId);
    user.projects.push(createdProject);
    await user.save();
    res.status(200).json({
      message: 'Project created successfully',
      project: createdProject
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }

};

exports.updateProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const projectId = req.params.projectId;
  try {
    const project = await verifyUserData(projectId, req);
    const title = req.body.title;
    //const type =  req.body.type;
    project.title = title;
    // project.type =  type;
    const updatedProject = await project.save();
    res.status(200).json({
      message: 'Project updated!',
      project: updatedProject
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }


};

exports.deleteProject = async (req, res, next) => {
  const projectId = req.params.projectId;

  try {
    await verifyUserData(projectId, req);

    await Project.findByIdAndRemove(projectId);

    const user = await User.findById(req.userId);
    user.projects.pull(projectId);
    await user.save();
    res.status(200).json({
      message: 'Deleted project.'
    });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }


};

exports.getProject = async (req, res, next) => {
  const projectId = req.params.projectId;

  try {
    const project = await verifyUserData(projectId, req);
    res.status(200).json({
      message: 'Project fetched successfully updated!',
      project: project
    });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getProjectCategories = async (req, res, next) => {
  const projectId = req.params.projectId;

  try {
    const project = await verifyUserData(projectId, req);    
    res.status(200).json({
      message: 'Project categories fetched successfully !',
      categories: project.categories
    });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getProjectCategory = async (req, res, next) => {
  const projectId = req.params.projectId;
  const categoryId = req.params.categoryId;
  try {
    const project = await verifyUserData(projectId, req);  
    
    const category = project.categories.id(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: 'Project category fetched successfully !',
      category: category
    });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


exports.createProjectCategory = async (req, res, next) => {
  const projectId = req.params.projectId;
  try {
    const project = await verifyUserData(projectId, req);
    const title = req.body.title;
    const type = req.body.type;
    const category = {
      title: title,
      type: type
    }

    project.categories.push(category);
    const updatedProject = await project.save();
    res.status(200).json({
      message: 'Category created successfully !',
      project: updatedProject
    });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateProjectCategory = async (req, res, next) => {
  const projectId = req.params.projectId;
  const categoryId = req.params.categoryId;
  try {
    const project = await verifyUserData(projectId, req);
    const category = project.categories.id(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    const title = req.body.title;
    
    
    category.title = title;
    console.log(category);
    const updatedProject = await project.save();
    res.status(200).json({
      message: 'Category updated successfully !',
      project: updatedProject
    });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};



exports.deleteProjectCategory = async (req, res, next) => {
  const projectId = req.params.projectId;
  const categoryId = req.params.categoryId;
  try {
    const project = await verifyUserData(projectId, req);
    const category = project.categories.id(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    project.categories.pull(categoryId);
    const updatedProject = await project.save();
    res.status(200).json({
      message: 'Category deleted successfully !',
      project: updatedProject
    });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};



exports.getProjectCategoryItems = async (req, res, next) => {
  const projectId = req.params.projectId;
  const categoryId = req.params.categoryId;
  try {
    const project = await verifyUserData(projectId, req);
    const category = project.categories.id(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      message: 'Category items fetched successfully !',
      items: category.items
    });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
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


async function verifyUserData(projectId, req) {
  const project = await Project.findById(projectId);
  if (!project) {
    const error = new Error('Could not find project.');
    error.statusCode = 404;
    throw error;
  }
  if (project.userId.toString() != req.userId) {
    const error = new Error('Not authorized!');
    error.statusCode = 403;
    throw error;
  }
  return project;
}