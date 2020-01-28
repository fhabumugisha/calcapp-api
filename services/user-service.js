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
      return await  User.findOne({email: value})
    }catch (e) {
        throw new Error(e.message)
    }
}
const deleteUser = async (userId) => {

}
const postUser= async (newUser) => {
    const user = new User({
        email: .newUser.email,
        password: newUser.hashedPwd,
        projects: newUser.projects
    });

      try{
        return await user.save();
      }catch (e) {
        throw new Error(e.message)
    }
}


module.exports =  {   
    getUsers,
    deleteUser
    
}