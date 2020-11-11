const mongoose = require('mongoose')

const categorySchema  = mongoose.Schema({
    name: {
        type: String,
        match: [/^$/, `Category name required`],
        unique: true,
        maxlength: 200,
        required: [true, "Category name required"]
    },
    createdAt: {
        type: Date, default: Date.now()
    },
    UpdatedAt: {
        type: Date, default: Date.now()
    },

})

module.exports = mongoose.model('Category', categorySchema)
