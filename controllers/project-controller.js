const { validationResult } = require("express-validator");

const projectService = require("../services/project-service");
const userService = require("../services/user-service");
/**
 *
 * @param {*} projectId
 * @param {*} req
 */
async function verifyReadProjectById(projectId, req) {
  const project = await projectService.getProject(projectId);
 
  if (!project) {
    const error = new Error("Could not find project.");
    error.statusCode = 404;
    throw error;
  }
  if (project.userId.toString() !== req.userId) {
    const error = new Error("Not authorized!");
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
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
}

exports.getProjects = async (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const perPage = +req.query.pagesize || 6;
  const userId = req.userId;
  try {
    const result = await projectService.getProjectsByUserId(
      userId,
      currentPage,
      perPage
    );

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
  const { title, type, description, items, categories, totalAmount } = req.body;

  //const totalAmount = 0;
 
  const userId = req.userId;
  const project = {
    title: title,
    type: type,
    userId: userId,
    totalAmount: totalAmount || 0,
    description: description,
    items: items || [],
    categories : categories || []
  };
  try {
    verifyValidationResult(req);
    const createdProject = await projectService.saveProject(project);
     await userService.addProject(userId, createdProject);
    res.status(200).json({
      message: "Project created successfully",
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
    await verifyReadProjectById(projectId, req);
    const { title, description, items, categories } = req.body;

    const project = {};
    project.title = title;
    project.description = description;
    project.items = items;
    project.categories = categories;

    const updatedProject = await projectService.updateProject(
      projectId,
      project
    );
    res.status(200).json({
      message: "Project updated!",
      project: updatedProject
    });
  } catch (error) {
    console.log(error);
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
    console.log("delete project");
    await projectService.deleteProject(projectId);

    await userService.removeProject(req.userId, projectId);
    res.status(200).json({
      message: "Deleted project."
    });
  } catch (error) {
    console.log(error)
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = "Error while deleting project"
    }
    next(error);
  }
};

exports.getProject = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    const project = await verifyReadProjectById(projectId, req);
    res.status(200).json({
      message: "Project fetched successfully updated!",
      project
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
