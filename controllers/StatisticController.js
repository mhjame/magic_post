const User = require('../models/User');
const Employee = require('../models/Employee')
const Post = require('../models/Post')
const Station = require('../models/Station')
const Warehouse = require('../models/Warehouse')

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const { multipleMongooseToObject } = require('../util/mongoose');
const { mongooseToObject } = require('../util/mongoose');

class StatisticController {

    getStatistic(req, res) {
        res.render('statistic');
    }

    getStatisticManager(req, res) {
        res.render('statistic/statistic_manager')
    }

    getPostStatisticsStation(req, res) {
        // const today = new Date();
        // today.setHours(0, 0, 0, 0);
        // const tomorrow = new Date(today);
        // tomorrow.setDate(today.getDate() + 1);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const endOfMonth = new Date();
        endOfMonth.setMonth(startOfMonth.getMonth() + 1);

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

        let stationDailyInCount = 0;
        let stationDailyOutCount = 0;
        let stationMonthInCount = 0;
        let stationMonthOutCount = 0;
        let stationYearInCount = 0;
        let stationYearOutCount = 0;

        const sendstationID = "SSID1";
        const receiverstationID = "RSID1";

        Post.findOne({ 'statusCode.1': { $gte: 0, $lte: 2 } })
            .then(post => {
                console.log(post)
            })

// Đếm số hàng vào trong ngày tại điểm giao dịch
            
            //do khách gửi tại điểm giao dịch
        let stationDailyCustomerReceivedCount = 0;
        Post.countDocuments({ senderStationId: sendstationID, status: 'at sStation', 'statusUpdateTime.1': { $gte: today, $lte: tomorrow } })
            .then(_stationDailyCustomerReceivedCount => {
                stationDailyCustomerReceivedCount = _stationDailyCustomerReceivedCount;
                console.log(_stationDailyCustomerReceivedCount);
            })

            //do nhận về từ điểm tập kết
        let stationDailyWarehouseReceivedCount = 0;
        Post.countDocuments({ receiverStationId: receiverstationID, status: 'at rStation', 'statusUpdateTime.7': { $gte: today, $lte: tomorrow } })
            .then(_stationDailyWarehouseReceivedCount => {
                stationDailyWarehouseReceivedCount = _stationDailyWarehouseReceivedCount;
                console.log(_stationDailyWarehouseReceivedCount);
            })

        stationDailyInCount = stationDailyCustomerReceivedCount + stationDailyWarehouseReceivedCount;
// Đếm số hàng ra trong ngày tại điểm giao dịch
            
            //gửi đi điểm tập kết
        let stationDailySendtoWarehouseCount = 0;
        Post.countDocuments({ senderStationId: sendstationID, status: 'on way to sWarehouse', 'statusUpdateTime.2': { $gte: today, $lte: tomorrow } })
            .then(_stationDailySendtoWarehouseCount => {
                stationDailySendtoWarehouseCount = _stationDailySendtoWarehouseCount;
                console.log(_stationDailySendtoWarehouseCount);
            })
            //giao cho khách
        let stationDailySentToCustomerCount = 0;
        Post.countDocuments({ receiverStationId: receiverstationID, status: 'on way to reveiver', 'statusUpdateTime.8': { $gte: today, $lte: tomorrow } })
            .then(_stationDailySentToCustomerCount => {
                stationDailySentToCustomerCount += _stationDailySentToCustomerCount;
                console.log(_stationDailySentToCustomerCount);
            })
        
        stationDailyOutCount = stationDailySendtoWarehouseCount + stationDailySentToCustomerCount;

//----------------------------------------------------------------------------------------------------------------------------------------------//
        
// Đếm số hàng vào trong tháng tại điểm giao dịch
            
            //do khách gửi tại điểm giao dịch
            let stationMonthCustomerReceivedCount = 0;
            Post.countDocuments({ senderStationId: sendstationID, status: 'at sStation', 'statusUpdateTime.1': { $gte: startOfMonth, $lte: endOfMonth } })
                .then(_stationMonthCustomerReceivedCount => {
                    stationMonthCustomerReceivedCount = _stationMonthCustomerReceivedCount;
                    console.log(_stationMonthCustomerReceivedCount);
                })
    
                //do nhận về từ điểm tập kết
            let stationMonthWarehouseReceivedCount = 0;
            Post.countDocuments({ receiverStationId: receiverstationID, status: 'at rStation', 'statusUpdateTime.7': { $gte: startOfMonth, $lte: endOfMonth } })
                .then(_stationMonthWarehouseReceivedCount => {
                    stationMonthWarehouseReceivedCount = _stationMonthWarehouseReceivedCount;
                    console.log(_stationMonthWarehouseReceivedCount);
                })
    
            stationMonthInCount = stationMonthCustomerReceivedCount + stationMonthWarehouseReceivedCount;
 // Đếm số hàng ra trong tháng tại điểm giao dịch
                
                //gửi đi điểm tập kết
            let stationMonthSendtoWarehouseCount = 0;
            Post.countDocuments({ senderStationId: sendstationID, status: 'on way to sWarehouse', 'statusUpdateTime.2': { $gte: startOfMonth, $lte: endOfMonth } })
                .then(_stationMonthSendtoWarehouseCount => {
                    stationMonthSendtoWarehouseCount = _stationMonthSendtoWarehouseCount;
                    console.log(_stationMonthSendtoWarehouseCount);
                })
                //giao cho khách
            let stationMonthSentToCustomerCount = 0;
            Post.countDocuments({ receiverStationId: receiverstationID, status: 'on way to reveiver', 'statusUpdateTime.8': { $gte: startOfMonth, $lte: endOfMonth } })
                .then(_stationMonthSentToCustomerCount => {
                    stationMonthSentToCustomerCount += _stationMonthSentToCustomerCount;
                    console.log(_stationMonthSentToCustomerCount);
                })
            
            stationMonthOutCount = stationMonthSendtoWarehouseCount + stationMonthSentToCustomerCount;

//----------------------------------------------------------------------------------------------------------------------------------------------//
        
// Đếm số hàng vào trong năm tại điểm giao dịch
            
            //do khách gửi tại điểm giao dịch
            let stationYearCustomerReceivedCount = 0;
            Post.countDocuments({ senderStationId: sendstationID, status: 'at sStation', 'statusUpdateTime.1': { $gte: startOfYear, $lte: endOfYear } })
                .then(_stationYearCustomerReceivedCount => {
                    stationYearCustomerReceivedCount = _stationYearCustomerReceivedCount;
                    console.log(_stationYearCustomerReceivedCount);
                })
    
                //do nhận về từ điểm tập kết
            let stationYearWarehouseReceivedCount = 0;
            Post.countDocuments({ receiverStationId: receiverstationID, status: 'at rStation', 'statusUpdateTime.7': { $gte: startOfYear, $lte: endOfYear } })
                .then(_stationYearWarehouseReceivedCount => {
                    stationYearWarehouseReceivedCount = _stationYearWarehouseReceivedCount;
                    console.log(_stationYearWarehouseReceivedCount);
                })
    
            stationMonthInCount = stationMonthCustomerReceivedCount + stationMonthWarehouseReceivedCount;
 // Đếm số hàng ra trong năm tại điểm giao dịch
                
                //gửi đi điểm tập kết
            let stationYearSendtoWarehouseCount = 0;
            Post.countDocuments({ senderStationId: sendstationID, status: 'on way to sWarehouse', 'statusUpdateTime.2': { $gte: startOfYear, $lte: endOfYear } })
                .then(_stationYearSendtoWarehouseCount => {
                    stationYearSendtoWarehouseCount = _stationYearSendtoWarehouseCount;
                    console.log(_stationYearSendtoWarehouseCount);
                })
                //giao cho khách
            let stationYearSentToCustomerCount = 0;
            Post.countDocuments({ receiverStationId: receiverstationID, status: 'on way to reveiver', 'statusUpdateTime.8': { $gte: startOfYear, $lte: endOfYear } })
                .then(_stationYearSentToCustomerCount => {
                    stationYearSentToCustomerCount += _stationYearSentToCustomerCount;
                    console.log(_stationYearSentToCustomerCount);
                })
            
            stationYearOutCount = stationYearSendtoWarehouseCount + stationYearSentToCustomerCount;



//Số hàng đang còn trong kho

        // stationDailyReceivedCount = 10;
        // stationDailySentCount = 10;
        res.render('statistic/statistic_stationAd', {
            today,
            tomorrow,
            startOfMonth,
            endOfMonth,
            startOfYear,
            endOfYear,
            stationDailyInCount,
            stationDailyOutCount,
            stationMonthInCount,
            stationMonthOutCount,
            stationYearInCount,
            stationYearOutCount
        });

    }

    getPostStatisticsWareHouse(req, res) {


    }

}
module.exports = new StatisticController;