const express = require('express');
const router = express.Router();
const managerController = require('../controllers/ManagerController');


router.get('/login', managerController.getLogin); // get/post
router.post('/login', managerController.loginValidate, managerController.postLogin);

router.get('/', managerController.getHome);
router.get('/search', managerController.getSearch);
router.get('/admin', managerController.getAdmin);
router.get('/register', managerController.getRegister);
router.post('/register', managerController.registerValidate, managerController.postRegister)
router.get('/profile/view', managerController.getProfile);

router.get('/forgotPassword', managerController.getForgotPassword);
module.exports = router;