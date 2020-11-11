const Item = require('../models/item')
const User = require('../models/user')
const Category = require('../models/category')

exports.create = (req, res, next)=>{
    const token = req.body.token;
    if (!token)
        return res.status(401).json({error: "Please login"})
    const category = req.body.category;
    const name = req.body.name;
    const description = req.body.description
    if (!category || !name)
        return res.status(401).json({error : "Please fill all fields"})
    const userFindQuery = User.findOne({token: token})
    userFindQuery.exec((error, user) => {
        if (error)
            return res.status(500).json(error)
        if (!user)
            return res.status(401).json({error: "Please login"})
        const categoryFindQuery = Category.findOne({name : category})
        categoryFindQuery.exec((error, category) => {
            if (error)
                return res.status(500).json(error)
            if (!category)
                return res.status(401).json({error: "Please select valid category"})
            const newItem = new Item({
                name: name,
                description: description,
                ownerId: user._id,
                categoryId: category._id
            })
            console.log(newItem)
            newItem.save()
                .then(()=> res.status(201).json(newItem))
                .catch(() => res.status(500).json({error: "error"}))
        })
    })
}

exports.getAll = (req, res, next) => {
    const query = Item.find()
    query.exec((error, result) => {
        if (error)
            return res.status(500).json(error)
        return res.status(200).json(result)
    })
}

exports.getOne = (req, res, next) => {
    const name = req.params.name
    if (!name)
        return res.status(404).json({error: "Not found"})
    const query = Item.findOne({name: name})
    query.exec((error, result) => {
        if (error)
            return res.status(500).json(error)
        if (!result)
            return res.status(404).json({error: "Not found"})
        return res.status(200).json(result)
    })
}

exports.update = (req, res, next) =>{
    const token = req.body.token;
    const id = req.body.itemid
    if (!token)
        return res.status(401).json({error: "Please login"})
    const categoryId = req.body.category;
    const name = req.body.name;
    const description = req.body.description
    if (!categoryId || !name)
        return res.status(401).json({error : "Please fill all fields"})
    const userFindQuery = User.findOne({token : token})
    userFindQuery.exec((error, user) => {
        if (error)
            return res.status(500).json(error)
        if (!user)
            return res.status(404).json({error : "Please login"})
        const itemFindQuery = Item.findById(id)
        itemFindQuery.exec((error, item) => {
            if (error)
                return res.status(500).json(error)
            if (!item)
                return res.status(404).json({error: "Item not found"})
            console.log(user._id)
            console.log(item.ownerId)
            if (item.ownerId != user._id)
                return res.status(401).json({error: "Not owner" })
            const categoryFindId = Category.findById(categoryId)
            categoryFindId.exec((error, category) => {
               if (error)
                   return res.status(500).json(error)
                if (!category)
                    return res.status(404).json({error: "Category not found"})
                item.name = name
                item.categoryId = category._id
                item.description = description
                item.save()
                    .then(() => res.status(200).json({
                        message: "Modified",
                        item
                    }))
                    .catch((err) => res.status(500).json(err))
            })
        })
    })
}
