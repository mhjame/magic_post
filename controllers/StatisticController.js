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

        res.render('statistic/statistic_manager', {
            message: "bodyManager"
        });
    }


    //-------------------------------------------------------------------
    //Quản lý toàn quốc theo ngày
    postStatisticManagerDailyNationWide(req, res) {

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let dailyInCount = 0;
        let dailyOutCount = 0;


        // Đếm số hàng vào trong ngày tại điểm giao dịch

        //do khách gửi tại điểm giao dịch
        let dailyCustomerReceivedCount = 0;
        Post.countDocuments({ status: 'at sStation', 'statusUpdateTime.1': { $gte: today, $lte: tomorrow } })
            .then(_dailyCustomerReceivedCount => {
                dailyCustomerReceivedCount = _dailyCustomerReceivedCount;
                console.log(_dailyCustomerReceivedCount);
            })


        dailyInCount = dailyCustomerReceivedCount

        // Đếm số hàng ra trong ngày tại điểm giao dịch

        //giao cho khách
        let dailySentToCustomerCount = 0;
        Post.countDocuments({ status: 'on way to reveiver', 'statusUpdateTime.8': { $gte: today, $lte: tomorrow } })
            .then(_dailySentToCustomerCount => {
                dailySentToCustomerCount += _dailySentToCustomerCount;
                console.log(_dailySentToCustomerCount);
            })

        dailyOutCount = dailySentToCustomerCount;

        //thống kê hàng gửi thành công/không thành công


        res.render('statistic/statistic_manager', {
            message: "bodyManagerNationWide",
            title: "Thống kê toàn quốc theo ngày",
            today,
            tomorrow,
            dailyInCount: 2,
            dailyOutCount: 3,
            weekInCount: false,
            monthInCount: false,
            yearInCount: false,

        });
    }

    //---------------------------
    //Quản lý toàn quốc theo tháng
    postStatisticManagerMonthNationWide(req, res) {

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const endOfMonth = new Date();
        endOfMonth.setMonth(startOfMonth.getMonth() + 1);

        let monthInCount = 0;
        let monthOutCount = 0;

        // Đếm số hàng vào trong tháng tại điểm giao dịch

        //do khách gửi tại điểm giao dịch
        let monthCustomerReceivedCount = 0;
        Post.countDocuments({ status: 'at sStation', 'statusUpdateTime.1': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_monthCustomerReceivedCount => {
                monthCustomerReceivedCount = _monthCustomerReceivedCount;
                console.log(_monthCustomerReceivedCount);
            })

        monthInCount = monthCustomerReceivedCount;
        // Đếm số hàng ra trong tháng tại điểm giao dịch

        //giao cho khách
        let monthSentToCustomerCount = 0;
        Post.countDocuments({ status: 'on way to reveiver', 'statusUpdateTime.8': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_monthSentToCustomerCount => {
                monthSentToCustomerCount += _monthSentToCustomerCount;
                console.log(_monthSentToCustomerCount);
            })

        monthOutCount = monthSentToCustomerCount;

        res.render('statistic/statistic_manager', {
            message: "bodyManagerNationWide",
            title: "Thống kê toàn quốc theo tháng",
            startOfMonth,
            endOfMonth,
            dailyInCount: false,
            weekInCount: false,
            monthInCount: 3,
            monthOutCount: 4,
            yearInCount: false,
        });
    }

    //Quản lý toàn quốc theo tuần
    postStatisticManagerWeekNationWide(req, res) {

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setUTCHours(0, 0, 0, 0);
        startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        let weekInCount = 0;
        let weekOutCount = 0;

        // Đếm số hàng vào trong ngày tại điểm giao dịch

        //do khách gửi tại điểm giao dịch
        let weekCustomerReceivedCount = 0;
        Post.countDocuments({ status: 'at sStation', 'statusUpdateTime.1': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_weekCustomerReceivedCount => {
                weekCustomerReceivedCount = _weekCustomerReceivedCount;
                console.log(_weekCustomerReceivedCount);
            })


        weekInCount = weekCustomerReceivedCount;

        // Đếm số hàng ra trong ngày tại điểm giao dịch

        //giao cho khách
        let weekSentToCustomerCount = 0;
        Post.countDocuments({ status: 'on way to reveiver', 'statusUpdateTime.8': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_weekSentToCustomerCount => {
                weekSentToCustomerCount += _weekSentToCustomerCount;
                console.log(_weekSentToCustomerCount);
            })

        weekOutCount = weekSentToCustomerCount;

        //thống kê hàng gửi thành công/không thành công


        res.render('statistic/statistic_manager', {
            message: "bodyManagerNationWide",
            title: "Thống kê toàn quốc theo tuần",
            startOfWeek,
            endOfWeek,
            weekInCount: 8,
            weekOutCount: 9,
            dailyInCount: false,
            monthInCount: false,
            yearInCount: false,

        });
    }

    //Quản lý toàn quốc theo năm
    postStatisticManagerYearNationWide(req, res) {

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

        let yearInCount = 0;
        let yearOutCount = 0;


        // Đếm số hàng vào trong ngày tại điểm giao dịch

        //do khách gửi tại điểm giao dịch
        let yearCustomerReceivedCount = 0;
        Post.countDocuments({ status: 'at sStation', 'statusUpdateTime.1': { $gte: startOfYear, $lte: endOfYear } })
            .then(_yearCustomerReceivedCount => {
                yearCustomerReceivedCount = _yearCustomerReceivedCount;
                console.log(_yearCustomerReceivedCount);
            })


        yearInCount = yearCustomerReceivedCount

        // Đếm số hàng ra trong ngày tại điểm giao dịch

        //giao cho khách
        let yearSentToCustomerCount = 0;
        Post.countDocuments({ status: 'on way to reveiver', 'statusUpdateTime.8': { $gte: startOfYear, $lte: endOfYear } })
            .then(_yearSentToCustomerCount => {
                yearSentToCustomerCount += _yearSentToCustomerCount;
                console.log(_yearSentToCustomerCount);
            })

        yearOutCount = yearSentToCustomerCount;

        //thống kê hàng gửi thành công/không thành công


        res.render('statistic/statistic_manager', {
            message: "bodyManagerNationWide",
            title: "Thống kê toàn quốc theo năm",
            startOfYear,
            endOfYear,
            yearInCount: 44,
            yearOutCount: 3,
            weekInCount: false,
            monthInCount: false,
            dailyInCount: false,

        });
    }



    getPostStatisticsWareHouse(req, res) {


    }

}
module.exports = new StatisticController;