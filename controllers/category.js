const Category = require('../models/category')
const user = require('../models/user')

exports.add = (req, res, next) => {
    const token = req.body.token;
    const name = req.body.name;
    if (!token || !name){
       return res.status(401).json({error: "Please fill all fields"});
    }
    user.findOne({token: token})
        .then((user) => {
            if (user.type !== 'admin')
                return res.status(403).json({error : 'forbidden access'})
            else{
                const newCategory = new Category({
                    name: name
                })
                newCategory.save()
                    .then(() => res.status(201).json({
                        message: "category created successfully",
                        newCategory
                    }))
                    .catch((err) => res.status(500).json({err}))
            }
        }).catch((err) => res.status(500).json(err))
}

exports.getAll = (req, res, next)=>{
    const query = Category.find()
    query.exec((err, result) => {
        if (err)
            res.status(500).json(err)
        res.status(200).json(result)
    })
    // Category.find()
    //     .then((res) => res.status(200).json(res))
    //     .catch((err) => res.status(500).json({err}))
}

exports.getOne = (req, res, next) => {
    const name = req.params.name
    if (!name)
        return res.status(401)
    const query = Category.findOne({name: name})
    query.exec((err, result) => {
        if (err)
            res.status(500).json(err)
        if (!result)
            res.status(404).json({error: "Category not found"})
        else
        res.status(200).json(result)
    })
}
