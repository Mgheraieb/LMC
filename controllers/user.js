const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require("jsonwebtoken");


const searchUser = async  (username, email) => {
    let result = []
    await User.find().or([
        {name: username},
        {email: email}
    ]).then((user) => {
        result = user
    })
    return result.length === 0
}

exports.signup = async (req, res, next) => {
    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;
    const regex = RegExp("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")
    if (!regex.test(password))
        res.status(400).json({ error: "Please enter valid password"})
    const result =  await searchUser(name, email)
    console.log(result)
    if (!result){
        res.status(400).json({error: "user already exist"})
        return ;
    }
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

const getUser = async (name) => {
    let result = undefined
    await User.findOne().or([
        {name: name},
        {email: name}
    ]).then((res) => {
        result = res
    })
        .catch((err) => {
            result = err
        })
    return result
}

exports.login = async (req, res , next) => {
    const password = req.body.password;
    const name = req.body.name;
    const user = await getUser(name)
    if (password && name) {
        if (user) {
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (isMatch) {
                    token =  jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN',
                        { expiresIn: '12h' }
                    )
                    user.token = token
                    user.save()
                    res.status(200).json(user)
                } else {
                }
            })
        }
    }else
            res.status(401).json({error: "Please fill all field"})
}
exports.user = (req, res, next) => {
    const name = req.params.name
    User.findOne({name: name})
        .then((user) => {
            if (user === null) {
                res.status(404).json({user});
                return;
            }
            res.status(200).json(user);
        })
        .catch((error) => res.status(500).json(error));
}

exports.me = (req, res, next) => {
    const token = req.body.token
    if (!token) {
        res.status(403).json({error: "Token undefined"});
        return;
    }
    User.findOne({token: token})
        .then((user) => {
            if (user === null) {
                res.status(404).json({user});
                return;
            }
            res.status(200).json(user);
        })
        .catch((error) => res.status(500).json({error}));
}

exports.updatePassword = (req, res, next) =>{
    const token = req.body.token
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword
    if (!token)
        return res.status(403).json({error : "Please login"})
    if (!oldPassword || !newPassword)
        return res.status(400).json({error: "Please fill all fields"})
    const userFindQuery = User.findOne({token : token})
    userFindQuery.exec((error, result) => {
        if (error)
            return res.status(500).json(error)
        if (!result)
            return res.status(403).json({error : "Please login"})
        const user = result
        bcrypt.compare(oldPassword, user.password, function (err, isMatch) {
            if (isMatch) {
                user.password = newPassword
                user.save()
            } else {
            }
        })
    })
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
