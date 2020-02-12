const Project = require("../models/project");
const { ProjectTypes, CategoryTypes } = require('../models/project');

const getProjectsByUserId = async (userId, currentPage, perPage) => {
  try {
    const totalItems = await Project.find({ userId: userId }).countDocuments();
    const projects = await Project.find({ userId: userId })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    return {
      projects,
      totalItems
    };
  } catch (e) {
    throw new Error(e.message);
  }
};

const getProjects = async (currentPage, perPage) => {
  try {
    const totalItems = await Project.find().countDocuments();
    const projects = await Project.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    return {
      projects,
      totalItems
    };
  } catch (e) {
    throw new Error(e.message);
  }
};

const saveProject = async (newProject) => {
  const project = new Project({
    title: newProject.title,
    type: newProject.type,
    userId: newProject.userId,
    totalAmount: newProject.totalAmount,
    description: newProject.description,
    items: newProject.items,
    categories : newProject.categories
  });

  try {
    return await project.save();
  } catch (e) {
    throw new Error(e.message);
  }
};

const updateProject = async (projectId, projectUpdate) => {
  try {
    const project = await Project.findById(projectId);
    if (project) {
      let projectTotalAmount = 0;
      // project.type =  type;
      if (
        ProjectTypes.PURCHASE === project.type ||
        ProjectTypes.OTHER === project.type
      ) {
        for (const item of projectUpdate.items) {
          const itemAmount = +item.amount;
          projectTotalAmount += itemAmount;
        }
      } else {
        for (const category of projectUpdate.categories) {
          let categoryTotalAmount = 0;
          for (const item of category.items) {
            const itemAmount = +item.amount;
            categoryTotalAmount += itemAmount;
          }
          category.totalAmount = categoryTotalAmount;
          if (
            CategoryTypes.INCOME === category.type ||
            CategoryTypes.OTHER === category.type
          ) {
            projectTotalAmount += category.totalAmount;
          } else if (CategoryTypes.EXPENSES === category.type) {
            projectTotalAmount -= category.totalAmount;
          }
        }
      }

      project.totalAmount = projectTotalAmount;
      project.categories = projectUpdate.categories;
      project.items = projectUpdate.items;
      project.title = projectUpdate.title;
      project.description = projectUpdate.description;

      return await project.save();
    }
  } catch (e) {
    throw new Error(e.message);
  }
};

const deleteProject = async (projectId) => {
  try {
    await Project.findByIdAndRemove(projectId);
  } catch (e) {
    throw new Error(e.message);
  }
};

const deleteProjectsByUserId = async (userId) => {
    try {
       await Project.deleteMany({ userId: userId });
    } catch (e) {
        throw new Error(e.message);
    }
}
const getProject = async (projectId) => {
  try {
    return await Project.findById(projectId);
     
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  getProjectsByUserId,
  getProjects,
  saveProject,
  updateProject,
  deleteProject,
  getProject,
  deleteProjectsByUserId
};
