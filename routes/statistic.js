const express = require('express');

const router = express.Router();
const managerController = require('../controllers/ManagerController');
const passwordController = require('../controllers/PasswordController');
const statisticController = require('../controllers/StatisticController');


//-----------------MANAGER--------------------------------
router.get('/statistic_manager', statisticController.postStatisticManagerDailyNationWide)
router.post('/statistic_manager/daily', statisticController.postStatisticManagerDailyNationWide)
router.post('/statistic_manager/week', statisticController.postStatisticManagerWeekNationWide)
router.post('/statistic_manager/month', statisticController.postStatisticManagerMonthNationWide)
router.post('/statistic_manager/year', statisticController.postStatisticManagerYearNationWide)
//--------
router.post('/statistic_manager_station', statisticController.postSearchStation)
router.get('/statistic_manager_station/:stationCode', statisticController.getStatisticManagerDailyStation)
router.get('/statistic_manager_station/daily/:stationCode', statisticController.getStatisticManagerDailyStation)
router.get('/statistic_manager_station/week/:stationCode', statisticController.getStatisticManagerWeekStation)
router.get('/statistic_manager_station/month/:stationCode', statisticController.getStatisticManagerMonthStation)
router.get('/statistic_manager_station/year/:stationCode', statisticController.getStatisticManagerYearStation)
//--------
router.post('/statistic_manager_warehouse', statisticController.postSearchWarehouse)
router.get('/statistic_manager_warehouse/:warehouseCode', statisticController.getStatisticManagerDailyWarehouse)
router.get('/statistic_manager_warehouse/daily/:warehouseCode', statisticController.getStatisticManagerDailyWarehouse)
router.get('/statistic_manager_warehouse/week/:warehouseCode', statisticController.getStatisticManagerWeekWarehouse)
router.get('/statistic_manager_warehouse/month/:warehouseCode', statisticController.getStatisticManagerMonthWarehouse)
router.get('/statistic_manager_warehouse/year/:warehouseCode', statisticController.getStatisticManagerYearWarehouse)
//-----------------STATION AD--------------------------------
router.get('/statistic_stationAd/:stationCode', statisticController.getStatisticDailyStation)
router.get('/statistic_stationAd/daily/:stationCode', statisticController.getStatisticDailyStation)
router.get('/statistic_stationAd/week/:stationCode',  statisticController.getStatisticWeekStation)
router.get('/statistic_stationAd/month/:stationCode', statisticController.getStatisticMonthStation)
router.get('/statistic_stationAd/year/:stationCode', statisticController.getStatisticYearStation)
//-----------------WAREHOUSE AD--------------------------------
router.get('/statistic_warehouseAd/:warehouseCode', statisticController.getStatisticDailyWarehouse)
router.get('/statistic_warehouseAd/daily/:warehouseCode', statisticController.getStatisticDailyWarehouse)
router.get('/statistic_warehouseAd/week/:warehouseCode', statisticController.getStatisticWeekWarehouse)
router.get('/statistic_warehouseAd/month/:warehouseCode', statisticController.getStatisticMonthWarehouse)
router.get('/statistic_warehouseAd/year/:warehouseCode', statisticController.getStatisticYearWarehouse)
//-----------------STATION EMPLOYEE--------------------------------
router.get('/statistic_stationE/:employeeId', statisticController.getStatisticStationEmployeeDaily)
router.get('/statistic_stationE/daily/:employeeId', statisticController.getStatisticStationEmployeeDaily)
router.get('/statistic_stationE/week/:employeeId', statisticController.getStatisticStationEmployeeWeek)
router.get('/statistic_stationE/month/:employeeId', statisticController.getStatisticStationEmployeeMonth)
router.get('/statistic_stationE/year/:employeeId', statisticController.getStatisticStationEmployeeYear)


module.exports = router;