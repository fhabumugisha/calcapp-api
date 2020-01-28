
const Project = require("../models/project");

const getProjectsByUserId = async (userId, currentPage, perPage) => {

    try {
        const totalItems = await Project.find({ userId: userId }).countDocuments();
        const projects = await Project.find({ userId: userId })
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });

        return {
            projects,
            totalItems
        }
    } catch (e) {
        throw new Error(e.message)
    }
}

const getProjects = async (currentPage, perPage) => {
    try {
        const totalItems = await Project.find().countDocuments();
        const projects = await Project.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage).sort({ createdAt: -1 });
        return {
            projects,
            totalItems
        }
    } catch (e) {
        throw new Error(e.message)
    }



}

const postProject = async (newProject) => {
    const project = new Project({
        title: newProject.title,
        type: newProject.type,
        userId: newProject.userId,
        totalAmount: newProject.totalAmount,
        description : newProject.description
      });

      try{
        return await project.save();
      }catch (e) {
        throw new Error(e.message)
    }
}


const updateProject = async (userId) => {

}


const deleteProject = async (projectId) => {
    try {
        await Project.findByIdAndRemove(projectId);
    } catch (e) {
        throw new Error(e.message)
    }
}


const getProject = async (projectId) => {
    try {
        return await Project.findById(projectId);
    } catch (e) {
        throw new Error(e.message)
    }

}




module.exports = {
    getProjectsByUserId,
    getProjects,
    postProject,
    updateProject,
    deleteProject,
    getProject


}