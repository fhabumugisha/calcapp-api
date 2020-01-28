const User = require('../models/user');

const getUsers = async ( currentPage, perPage) => {
    const totalItems = await User.find().countDocuments();
    const users = await User.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage).sort({createdAt:-1});

    return{
        users,
        totalItems
    }
}


const getUserByEmail = async ( email) => {
    try{
      return await  User.findOne({email: email})
    }catch (e) {
        throw new Error(e.message)
    }
}
const deleteUser = async (userId) => {
try {
    await User.findByIdAndRemove(userId);
} catch (error) {
    throw new Error(e.message);
}
}
const saveUser= async (newUser) => {
    console.log(newUser);
    
    const user = new User({
        email: newUser.email,
        password: newUser.password,
        projects: newUser.projects
    });

      try{
        return await user.save();
      }catch (e) {
        throw new Error(e.message)
    }
}


const addProject =  async (userId, project) => {
    try {
        const user = await User.findById(userId);
    user.projects.push(project);
    await user.save();
    } catch (e) {
        throw new Error(e.message)
    }
}

const removeProject = async (userId, projectId) => {
    try {
        await User.findById(req.userId);
    user.projects.pull(projectId);
    await user.save();
    } catch (e) {
        throw new Error(e.message)
    }
}


const getUser = async (userId) => {
    try {
       return await User.findById(userId);    
    } catch (e) {
        throw new Error(e.message)
    }
}
module.exports =  {   
    getUsers,
    deleteUser,
    addProject,
    removeProject,
    getUserByEmail,
    saveUser,
    getUser
    
}