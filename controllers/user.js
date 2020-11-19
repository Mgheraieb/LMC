const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.user = (req, res, next) => {
    const name = req.params.name
    User.findOne({name: name})
        .then((user) => {
            if (!user)
                return res.status(404).json({user});
            return res.status(200).json(user);
        })
        .catch((error) => res.status(500).json(error));
}

exports.me = (req, res, next) => {
    User.findById(req.body.id)
        .then((user) => {
            if (!user)
                return res.status(404).json({error: "User not found"})
            res.status(200).json(user);
        })
        .catch((error) => res.status(500).json({error}));
}

exports.updatePassword = (req, res, next) =>{
    const token = req.headers.authorization[1].split(' ')[1]
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword
    if (!oldPassword || !newPassword)
        return res.status(400).json({error: "Please fill all fields"})
    User.findOne({token : token})
        .then((user) => {
            if (!user)
                return res.status(404).json({error: "User not found"})
            bcrypt.compare(oldPassword, user.password)
                .then((valid) =>{
                    if (!valid)
                        return res.status(401).json({error: "Incorrect password"})
                    user.password = newPassword
                    user.save()
                        .then((res) => {
                            return res.status(204).json({message: "Success"})
                        })
                        .catch((err) => {
                            return res.status(500).json(err)
                        })
                })

        })
        .catch((err) => res.staus(500).json(err))
    // const userFindQuery = User.findOne({token : token})
    // userFindQuery.exec((error, result) => {
    //     if (error)
    //         return res.status(500).json(error)
    //     if (!result)
    //         return res.status(403).json({error : "Please login"})
    //     const user = result
    //     bcrypt.compare(oldPassword, user.password, function (err, isMatch) {
    //         if (isMatch) {
    //             user.password = newPassword
    //             user.save()
    //         } else {
    //         }
    //     })
    // })
}


exports.updateEmail = (req, res, next) => {
    const token = req.body.token
    const password = req.body.password
    const email = req.body.email
    if (!token)
        return res.status(403).json({error: "Please login"})
    if (!password || !email)
        return res.status(403).json({error: "Please fill all fields"})
    const userFindQuery = User.findOne({token: token})
    userFindQuery.exec((error, user) => {
        if (error)
            return res.status(500).json(error)
        if (!user)
            return res.status(403).json({error: "Please login"})
        const checkDouble = User.findOne({email : email})
        checkDouble.exec((error , result) => {
            if (error)
                return res.status(500).json(error)
            if (result)
                return res.status(403).json({error: "Email already taken"})
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (isMatch) {
                    user.email = email
                    user.save()
                    return res.status(200).json(user)
                } else {
                    return res.status(403).json({error: "Password error"})
                }
            })
        })
    })
}
