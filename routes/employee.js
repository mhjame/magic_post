const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/EmployeeController')


router.get('/create_order/create_to_wh_order', employeeController.createShipToWarehouseOrder); 
router.post('/stored/to_wh_order', employeeController.postShipToWarehouseOrder); 
router.get('/create_order/create_to_station_order', employeeController.createShipToStationOrder);
router.post('/stored/to_station_order', employeeController.postShipToStationOrder); 
router.get('/create_order/create_to_receiver_order', employeeController.createShipToReceiverOrder);
router.post('/stored/to_receiver_order', employeeController.postShipToReceiverOrder); 
router.get('/profile/update', employeeController.getUpdateProfile);
router.post('/profile/update/:id', employeeController.postUpdateProfile);

module.exports = router;