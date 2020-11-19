const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;
    const regex = RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")
    if (!regex.test(password))
        bcrypt.hash(password, 10)
            .then(hash => {
                const user = new User({
                    name: name,
                    email: email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'User created' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
};

exports.login = async (req, res , next) => {
    const password = req.body.password;
    const name = req.body.name;
    if (!password || !name)
        return res.status(403).json({error: "UNAUTHORIZED"})
    User.findOne({$or:[
            {name : name},
            {email: name}
        ]})
        .then((user) => {
            if (!user)
                return res.status(404).json({error : "User not found"})
            bcrypt.compare(password, user.password)
                .then((valid) => {
                    if (!valid)
                        return res.status(401).json({error:"Mot de passe incorrect"})
                    const token = jwt.sign(
                        {userid: user._id},
                        "RANDOM_KEY",
                        {expiresIn: '24h'})
                    user.token = token
                    user.save()
                    return res.status(200).json({
                        user: user
                    })
                })
        })
    return res.status(500)
}
