const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
        minlength: 1,
        required: [true, "Item name required"]
    },
    description: {
        type: String,
        maxlength: 500,
        minlength: 10,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    UpdatedAt: {
        type: Date,
        default: Date.now()
    },
    location: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: [true, "Owner id required"]
    },
    categoryId: {
        type: String,
        required: [true, "Owner id required"]
    }
})

module.exports = mongoose.model('item', itemSchema)
