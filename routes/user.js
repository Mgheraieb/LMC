const express = require('express');
const router = express.Router();
const controller = require('../controllers/user')
const auth = require('../middleware/auth')

router.get('/:name', controller.user)
router.post('/user',auth, controller.me)
router.put('/updateEmail',auth, controller.updateEmail)
router.put('/updatePassword',auth, controller.updatePassword)
module.exports = router
