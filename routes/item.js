const express = require('express');
const router = express.Router();
const controller = require('../controllers/item')

router.post('/create',controller.create)
router.get('/',controller.getAll)
router.get('/:name',controller.getOne)
module.exports = router
