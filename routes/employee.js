const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/EmployeeController')


router.get('/create_to_wh_order', employeeController.createShipToWarehouseOrder); 
router.post('/stored/to_wh_order', employeeController.postShipToWarehouseOrder); 


module.exports = router;