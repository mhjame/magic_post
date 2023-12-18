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
router.get('/confirm_order/confirm_from_wh_to_station', employeeController.getConfirmFromWarehouseToStation); 
router.get('/confirm_order/:containerCode/confirm_each_order_wh_station', employeeController.getConfirmEachOrderWarehouseToStation); 
router.post('/stored/confirm_posts_wh_station', employeeController.postConfirmPostsWarehouseToStation); 
router.get('/confirm_order/get_origin_warehouses_need_confirm', employeeController.getOriginWarehouses);
router.get('/confirm_order/:originWarehouseId/confirm_wh_wh', employeeController.getConfirmWarehouseToWarehouse);
router.get('/confirm_order/:originWarehouseId/:containerCode/confirm_each_order_wh_wh', employeeController.getConfirmEachOrderWarehouseToWarehouse);
router.post('/stored/confirm_posts_wh_wh', employeeController.postConfirmPostsWarehouseToWarehouse);
router.get('/confirm_order/get_origin_stations_need_confirm', employeeController.getOriginStations);
router.get('/confirm_order/:originStationId/confirm_station_wh', employeeController.getConfirmStationToWarehouse);
router.get('/confirm_order/:originStationId/:containerCode/confirm_each_order_station_wh', employeeController.getConfirmEachOrderStationToWarehouse);
router.post('/stored/confirm_posts_station_wh', employeeController.postConfirmPostsStationToWarehouse);
router.get('/confirm_order/confirm_station_receivers', employeeController.getConfirmStationToReceivers);
router.get('/confirm_order/:containerCode/confirm_each_order_station_receivers', employeeController.getConfirmEachOrderStationToReceivers); 

module.exports = router;