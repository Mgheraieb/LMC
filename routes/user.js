const express = require('express');
const router = express.Router();
const controller = require('../controllers/user')

router.post('/register',controller.signup)
router.post('/login', controller.login)
router.get('/:name', controller.user)
router.post('/me', controller.me)
router.put('/updateEmail', controller.updateEmail)
router.put('/updatePassword', controller.updatePassword)
module.exports = router
