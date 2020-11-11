const express = require('express');
const router = express.Router();
const controller = require('../controllers/category')

router.post('/add', controller.add)
router.get('/', controller.getAll)
router.get('/:name', controller.getOne)

module.exports = router
