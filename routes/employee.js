const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/EmployeeController')


router.get('/create_order/create_station_to_wh', employeeController.createShipStationToWarehouse); 
router.post('/create_order/create_station_to_wh_order_form', employeeController.createStationToWhOrderForm); 
router.post('/stored/create_station_to_wh_order', employeeController.postShipStationToWarehouseOrder); 

router.get('/create_order/get_des_warehouses', employeeController.getDesWarehouses);
router.get('/create_order/:desWarehouseId/create_wh_to_wh', employeeController.createShipWarehouseToWarehouse);
router.post('/create_order/:desWarehouseId/create_wh_to_wh_order_form', employeeController.createWhToWhOrderForm);
router.post('/stored/create_wh_to_wh_order', employeeController.postShipWarehouseToWarehouseOrder); 

router.get('/create_order/get_des_stations', employeeController.getDesStations);
router.get('/create_order/:desStationId/create_wh_to_station', employeeController.createShipWarehouseToStation);
router.post('/create_order/:desStationId/create_wh_to_station_order_form', employeeController.createWhToStationOrderForm);
router.post('/stored/create_wh_to_station_order', employeeController.postShipWarehouseToStationOrder); 

router.get('/create_order/create_station_to_receiver', employeeController.createShipStationToReceiver);
router.post('/create_order/create_station_to_receiver_order_form', employeeController.createStationToReceiverOrderForm); 
router.post('/stored/create_station_to_receiver_order', employeeController.postShipStationToReceiverOrder); 

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
router.post('/stored/confirm_posts_station_receivers', employeeController.postConfirmPostsStationToReceivers); 

router.get('/station_employee_page', employeeController.getStationEmployeePage);
router.post('/logout', employeeController.logout);

module.exports = router;