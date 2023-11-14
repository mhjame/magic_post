const express = require('express');
const router = express.Router();
const managerController = require('../controllers/ManagerController');


router.get('/login', managerController.getLogin); 
router.post('/login', managerController.postLogin);
router.get('/', managerController.getHome);
router.get('/search', managerController.getSearch);

module.exports = router;