const { validationResult } = require('express-validator');
const Project = require('../models/project');
const User = require('../models/user');

const { ProjectTypes, CategoryTypes } = require('../models/project');
const projectService = require('../services/project-service')

/**
 *
 * @param {*} projectId
 * @param {*} req
 */
async function verifyReadProjectById(projectId, req) {
  const project = await Project.findById(projectId);
  if (!project) {
    const error = new Error('Could not find project.');
    error.statusCode = 404;
    throw error;
  }
  if (project.userId.toString() !== req.userId) {
    const error = new Error('Not authorized!');
    error.statusCode = 403;
    throw error;
  }
  return project;
}

/**
 *
 * @param {*} req
 */
function verifyValidationResult(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
}




exports.getProjects = async (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const perPage = +req.query.pagesize || 6;
  const userId = req.userId
  try {
    /* const totalItems = await Project.find({
      userId: req.userId
    }).countDocuments();
    const projects = await Project.find({
      userId: req.userId
    })
      .skip((currentPage - 1) * perPage)
      .limit(perPage).sort({createdAt:-1}); */

      const result = await projectService.getProjectsByUserId(userId, currentPage, perPage)

    res.status(200).json({
      message: "Fetched user projects successfully.",
      projects: result.projects,
      totalItems: result.totalItems
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postProject = async (req, res, next) => {
  const { title } = req.body;
  const { type } = req.body;
  const { description } = req.body;
  const totalAmount = 0;
  const userId = req.userId;
  const project = new Project({
    title: title,
    type: type,
    userId: userId,
    totalAmount: totalAmount,
    description : description
  });
  try {
    verifyValidationResult(req);
    const createdProject = await project.save();
    const user = await User.findById(userId);
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
  const { projectId } = req.params;
  try {
    verifyValidationResult(req);
    const project = await verifyReadProjectById(projectId, req);
    const { title } = req.body;
    const { description } = req.body;
    const { items } = req.body;
    const { categories } = req.body;
    // const type =  req.body.type;
    project.title = title;
    project.description = description;
    project.items = items;
    let projectTotalAmount = 0;
    // project.type =  type;
    if (ProjectTypes.PURCHASE === project.type || ProjectTypes.OTHER === project.type) {
      for (const item of items) {
        const itemAmount = +item.amount;
        projectTotalAmount += itemAmount;
      }
    } else {
      for (const category of categories) {
        let categoryTotalAmount = 0;
        for (const item of category.items) {
          const itemAmount = +item.amount;
          categoryTotalAmount += itemAmount;
        }
        category.totalAmount = categoryTotalAmount;
        if (CategoryTypes.INCOME === category.type || CategoryTypes.OTHER === category.type) {
          projectTotalAmount += category.totalAmount;
        } else if (CategoryTypes.EXPENSES === category.type) {
          projectTotalAmount -= category.totalAmount;
        }
      }
    }

    project.totalAmount = projectTotalAmount;
    project.categories = categories;
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
  const { projectId } = req.params;

  try {
    await verifyReadProjectById(projectId, req);

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
  const { projectId } = req.params;

  try {
    const project = await verifyReadProjectById(projectId, req);
    res.status(200).json({
      message: 'Project fetched successfully updated!',
      project
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getProjectCategories = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    const project = await verifyReadProjectById(projectId, req);
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
  const { projectId } = req.params;
  const { categoryId } = req.params;
  try {
    const project = await verifyReadProjectById(projectId, req);

    const category = project.categories.id(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: 'Project category fetched successfully !',
      category
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createProjectCategory = async (req, res, next) => {
  const { projectId } = req.params;
  try {
    verifyValidationResult(req);
    const project = await verifyReadProjectById(projectId, req);
    const { title } = req.body;
    const { type } = req.body;
    const category = {
      title,
      type
    };
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
  const { projectId } = req.params;
  const { categoryId } = req.params;
  try {
    verifyValidationResult(req);
    const project = await verifyReadProjectById(projectId, req);
    const category = project.categories.id(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    const { title } = req.body;
    category.title = title;

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
  const { projectId } = req.params;
  const { categoryId } = req.params;
  try {
    const project = await verifyReadProjectById(projectId, req);
    const category = project.categories.id(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    project.categories.pull(categoryId);
    // Update project totalAmount
    if (CategoryTypes.INCOME === category.type || CategoryTypes.OTHER === category.type) {
      project.totalAmount -= category.totalAmount;
    } else if (CategoryTypes.EXPENSES === category.type) {
      project.totalAmount += category.totalAmount;
    }

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
  const { projectId } = req.params;
  const { categoryId } = req.params;
  try {
    const project = await verifyReadProjectById(projectId, req);
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

exports.getProjectCategoryItem = async (req, res, next) => {
  const { projectId } = req.params;
  const { categoryId } = req.params;
  const { itemId } = req.params;

  try {
    const project = await verifyReadProjectById(projectId, req);
    const category = project.categories.id(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }

    const item = category.items.id(itemId);
    if (!item) {
      const error = new Error('Could not find item.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Category item fetched successfully !',
      item
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createProjectCategoryItem = async (req, res, next) => {
  const { projectId } = req.params;
  const { categoryId } = req.params;

  try {
    verifyValidationResult(req);
    const project = await verifyReadProjectById(projectId, req);
    const category = project.categories.id(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }

    const item = {
      title: req.body.title,
      amount: +req.body.amount
    };

    category.items.push(item);
    // Update total amount
    category.totalAmount += item.amount;

    if (CategoryTypes.INCOME === category.type || CategoryTypes.OTHER === category.type) {
      project.totalAmount += item.amount;
    } else if (CategoryTypes.EXPENSES === category.type) {
      project.totalAmount -= item.amount;
    }
    const updatedProject = await project.save();
    res.status(200).json({
      message: 'Category item created successfully !',
      project: updatedProject
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteProjectCategoryItem = async (req, res, next) => {
  const { projectId } = req.params;
  const { categoryId } = req.params;
  const { itemId } = req.params;

  try {
    const project = await verifyReadProjectById(projectId, req);
    const category = project.categories.id(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }

    const item = category.items.id(itemId);
    if (!item) {
      const error = new Error('Could not find item.');
      error.statusCode = 404;
      throw error;
    }

    category.items.pull(itemId);
    // Update project totalAmount
    category.totalAmount -= item.amount;

    if (CategoryTypes.INCOME === category.type || CategoryTypes.OTHER === category.type) {
      project.totalAmount -= item.amount;
    } else if (CategoryTypes.EXPENSES === category.type) {
      project.totalAmount += item.amount;
    }
    const updatedProject = await project.save();
    res.status(200).json({
      message: 'Category item deleted successfully !',
      project: updatedProject
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateProjectCategoryItem = async (req, res, next) => {
  const { projectId } = req.params;
  const { categoryId } = req.params;
  const { itemId } = req.params;

  try {
    verifyValidationResult(req);
    const project = await verifyReadProjectById(projectId, req);
    const category = project.categories.id(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }

    const item = category.items.id(itemId);
    if (!item) {
      const error = new Error('Could not find item.');
      error.statusCode = 404;
      throw error;
    }

    category.items.pull(itemId);
    // Update total amount
    category.totalAmount -= item.amount;

    const newItem = {
      title: req.body.title,
      amount: +req.body.amount
    };
    category.items.push(newItem);
    category.totalAmount += newItem.amount;


    if (CategoryTypes.INCOME === category.type || CategoryTypes.OTHER === category.type) {
      project.totalAmount = (project.totalAmount - item.amount) + newItem.amount;
    } else if (CategoryTypes.EXPENSES === category.type) {
      project.totalAmount = (project.totalAmount + item.amount) - newItem.amount;
    }
    const updatedProject = await project.save();
    res.status(200).json({
      message: 'Category item updated successfully !',
      project: updatedProject
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getProjectItems = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    const project = await verifyReadProjectById(projectId, req);
    res.status(200).json({
      message: 'Project items fetched successfully !',
      items: project.items
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getProjectItem = async (req, res, next) => {
  const { projectId } = req.params;
  const { itemId } = req.params;
  try {
    const project = await verifyReadProjectById(projectId, req);

    const item = project.items.id(itemId);
    if (!item) {
      const error = new Error('Could not find item.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: 'Project item fetched successfully !',
      item
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createProjectItem = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    verifyValidationResult(req);
    const project = await verifyReadProjectById(projectId, req);

    const item = {
      title: req.body.title,
      amount: +req.body.amount
    };
    project.items.push(item);
    // Update project totalAmount
    project.totalAmount += item.amount;

    const updatedProject = await project.save();

    res.status(200).json({
      message: 'Project item created successfully !',
      project: updatedProject
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteProjectItem = async (req, res, next) => {
  const { projectId } = req.params;
  const { itemId } = req.params;
  try {
    const project = await verifyReadProjectById(projectId, req);

    const item = project.items.id(itemId);
    if (!item) {
      const error = new Error('Could not find item.');
      error.statusCode = 404;
      throw error;
    }
    project.items.pull(itemId);
    // Update project totalAmount
    project.totalAmount -= item.amount;
    const updatedProject = await project.save();

    res.status(200).json({
      message: 'Project item deleted successfully !',
      project: updatedProject
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateProjectItem = async (req, res, next) => {
  try {
    verifyValidationResult(req);
    const { projectId } = req.params;
    const { itemId } = req.params;
    const project = await verifyReadProjectById(projectId, req);

    const item = project.items.id(itemId);
    if (!item) {
      const error = new Error('Could not find item.');
      error.statusCode = 404;
      throw error;
    }
    const oldAmount = item.amount;
    item.title = req.body.title;
    item.amount = +req.body.amount;
    // Update project totalAmount
    project.totalAmount = (project.totalAmount - oldAmount) + item.amount;
    const updatedProject = await project.save();
    res.status(200).json({
      message: 'Project item updated successfully !',
      project: updatedProject
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


