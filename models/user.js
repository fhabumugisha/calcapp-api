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
            title: {
                type: String,
                required: true
            },
            totalAmount: {
                type: Number,
                defaut: 0
            },
            items: [
                {
                    title: {
                        type: String,
                        required: true
                    },
                    amount: {
                        type: Number,
                        defaut: 0
                    },
                }
            ],
            categories: [
                {
                    title: {
                        type: String,
                        required: true
                    },
                    totalAmount: {
                        type: Number,
                        defaut: 0
                    },
                    items: [
                        {
                            title: {
                                type: String,
                                required: true
                            },
                            amount: {
                                type: Number,
                                defaut: 0
                            },
                        }
                    ],
                }
            ]
        }
    ]
})

module.exports = mongoose.model('User', userSchema);