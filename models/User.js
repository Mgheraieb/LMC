const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        maxlength: 200,
        required: [true, "Username required"]
    },
    email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, `Please fill valid email address`],
        maxlength: 200,
        unique: true,
        required: [true, "Email required"]
    },
    password: {
        type: String,
        unique: true,
        minlength: 8,
        required: [true, "Password required"]
    },
    createdAt: {
        type: Date, default: Date.now()
    },
    UpdatedAt: {
        type: Date, default: Date.now()
    },
    token: {
        type: String
    }
})

module.exports = mongoose.model('User', userSchema)
