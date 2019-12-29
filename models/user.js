const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    projects: [
       {
          type: Schema.Types.ObjectId,
          ref: 'Project'
       }
    ],
    { timestamps: true }
})

module.exports = mongoose.model('User', userSchema);