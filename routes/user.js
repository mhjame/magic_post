const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/post_info/:id', userController.getPost);

router.get('/post_info', userController.getPostInfo); 
router.get('/search_post', userController.searchPost); 
router.get('/user_search_post', userController.userSearchPost);

module.exports = router;