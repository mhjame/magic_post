const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');


router.get('/post_info', userController.searchPostInfo); 

module.exports = router;