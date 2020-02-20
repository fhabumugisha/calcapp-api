const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    
    
},

{ timestamps: true }

);


module.exports = mongoose.model('Notification', notificationSchema);