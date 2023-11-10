const express = require('express');
const router = express.Router();
const managerController = require('../controllers/ManagerController');


router.get('/login', managerController.getLogin); // get/post
router.get('/', managerController.getHome);
router.get('/search', managerController.getSearch);

module.exports = router;