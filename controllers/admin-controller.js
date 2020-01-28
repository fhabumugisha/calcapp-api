const projectService = require("../services/project-service");
const userService = require("../services/user-service");

/**
 *
 * @param {*} projectId
 * @param {*} req
 */
async function verifyReadAccountById(accountId, req) {
    const account = await userService.getUser(accountId);
    if (!account) {
      const error = new Error('Could not find account.');
      error.statusCode = 404;
      throw error;
    }
    
    return account;
  }


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
   
    return project;
  }
  
exports.deleteUser = async (req, res, next) => {
    const { userId } = req.params;
  
    try {
      await verifyReadAccountById(userId, req);
  
      await userService.deleteUser(userId);
  
      await projectService.deleteProjectsByUserId(userId);
  
      res.status(200).json({
        message: 'Deleted account.'
      });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  };

  exports.getProjects = async (req, res, next) => {
    const currentPage = +req.query.page || 1;
    const perPage = +req.query.pagesize || 6;
    try {
      const result = await projectService.getProjects(
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

  exports.getProject = async (req, res, next) => {
    const { projectId } = req.params;
  
    try {
      const project = await verifyReadProjectById(projectId, req);
      res.status(200).json({
        message: "Project fetched successfully!",
        project
      });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  };


  exports.getUsers = async (req, res, next) => {
    const currentPage = +req.query.page || 1;
    const perPage = +req.query.pagesize || 6;
    
    try {
      const result = await userService.getUsers(
        currentPage,
        perPage
      );
  
      res.status(200).json({
        message: "Fetched users successfully.",
        users: result.users,
        totalItems: result.totalItems
      });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  };
  