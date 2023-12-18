const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/post_info/:id', userController.getPost);
router.get('/post_info', userController.searchPostInfo); 
router.get('/search_post', userController.searchPost); 

module.exports = router;