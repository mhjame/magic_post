const express = require('express');
const router = express.Router();
const managerController = require('../controllers/ManagerController');
const passwordController = require('../controllers/PasswordController');
const statisticController = require('../controllers/StatisticController');

router.get('/login', managerController.getLogin); // get/post
router.post('/login', managerController.loginValidate, managerController.postLogin);

router.get('/', managerController.getHome);

router.get('/search', managerController.getSearch);
router.get('/admin', managerController.getAdmin);
router.get('/register', managerController.getRegister);
router.post('/register', managerController.registerValidate, managerController.postRegister)
router.get('/profile/view', managerController.getProfile);

router.get('/forgotPassword', passwordController.getForgotPassword);
router.post('/forgotPassword', passwordController.postForgotPassword);
router.get('/reset-password/:token', passwordController.getResetPassword)
router.post('/reset-password/', passwordController.postResetPassword)

router.get('/statistic', statisticController.getPostStatisticsStation)
router.get('/statistic_manager', statisticController.getStatisticManager)


router.get('/supervisor/humanResource', managerController.humanResource);
router.get('/supervisor/oldHR', managerController.oldHR);
router.post('/employees/handle-form-actions', managerController.handleFormActions);
router.post('/employees/:id/restore', managerController.restore);
router.post('/employees/:id/force',managerController.forceDestroy);
router.post('/createReceipt', managerController.postReceipt);
router.get('/receipt', managerController.getReceipt);
module.exports = router;