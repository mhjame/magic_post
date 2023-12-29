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
            employee: req.session.employee,
            message: "bodyManager"
        });
    }

    //thống kê nhân viên theo ngày DONEE
    getStatisticStationEmployeeDaily(req, res) {

        const employeeId = req.params.employeeId

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let stationCode;
        let postSuccess = 0;
        let postFail = 0;
        let code = 1;

        console.log(employeeId)


        Employee.findOne({ employeeId: employeeId }).lean()
            .then(employee => {

                if (employee && employee.workstationCode) {
                    stationCode = employee.workstationCode;
                    console.log("Employee found:", employee);
                    console.log("stationCode:", stationCode);

                    //giao thành công
                    Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: today, $lte: tomorrow } })
                        .then(count1 => {
                            console.log(count1)
                            postSuccess = count1;
                        })
                    //giao thất bại
                    Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: today, $lte: tomorrow } })
                        .then(count2 => {
                            console.log(count2)
                            postFail = count2;
                        })
                } else if (employee) {
                    Station.findOne({ address: employee.workAddress }).lean().then((station) => {
                        if (station) {
                            Warehouse.findOne({ warehouseCode: station.warehouseId }).lean().then((warehouse) => {

                                //giao thành công
                                let P1 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: today, $lte: tomorrow } })
                                    .then(count1 => {
                                        console.log(count1)
                                        postSuccess = count1;
                                    })
                                //giao thành công
                                let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: today, $lte: tomorrow } })
                                    .then(count2 => {
                                        console.log(count2)
                                        postFail = count2;
                                    })

                                Promise.all([P1, P2])
                                    .then(result => {
                                        res.render('statistic/statistic_stationE', {
                                            title: "Thống kê đơn hàng trong ngày",
                                            employeeId,
                                            stationCode,
                                            today,
                                            tomorrow,
                                            code,
                                            postSuccess: 9,
                                            postFail: 3,

                                            noHeader: 'yes',
                                            employee,
                                            workPlace: station,
                                            desWarehouse: warehouse

                                        })
                                    })

                            })
                        }
                    })
                } else {
                    console.log("Không tìm thấy nhân viên hoặc 'workstationCode' không tồn tại");
                    res.render('statistic/statistic_stationE', {
                        title: "Thống kê đơn hàng trong ngày",
                        employeeId,
                        stationCode,
                        today,
                        tomorrow,
                        code,
                        postSuccess,
                        postFail
                    })
                }



            })

    }

    //thống kê nhân viên theo tháng DONEE
    getStatisticStationEmployeeMonth(req, res) {

        const employeeId = req.params.employeeId

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const endOfMonth = new Date();
        endOfMonth.setMonth(startOfMonth.getMonth() + 1);

        let stationCode;
        let postSuccess = 0;
        let postFail = 0;
        let code = 3;

        Employee.findOne({ employeeId: employeeId }).lean()
            .then(employee => {
                stationCode = employee.workstationCode;
                Station.findOne({ address: employee.workAddress }).lean().then((station) => {
                    if (station) {
                        Warehouse.findOne({ warehouseCode: station.warehouseId }).lean().then((warehouse) => {


                            //giao thành công
                            let P1 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: startOfMonth, $lte: endOfMonth } })
                                .then(count1 => {
                                    postSuccess = count1;
                                })
                            //giao thành công
                            let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: startOfMonth, $lte: endOfMonth } })
                                .then(count2 => {
                                    postFail = count2;
                                })


                            Promise.all([P1, P2])
                                .then(result => {
                                    res.render('statistic/statistic_stationE', {
                                        title: "Thống kê đơn hàng trong tháng",
                                        employeeId,
                                        stationCode,
                                        startOfMonth,
                                        endOfMonth,
                                        code,
                                        postSuccess: 1,
                                        postFail: 9,
                                        noHeader: 'yes',

                                        employee,
                                        workPlace: station,
                                        desWarehouse: warehouse

                                    })
                                })
                        })
                    } else {

                        //giao thành công
                        let P1 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: startOfMonth, $lte: endOfMonth } })
                            .then(count1 => {
                                postSuccess = count1;
                            })
                        //giao thành công
                        let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: startOfMonth, $lte: endOfMonth } })
                            .then(count2 => {
                                postFail = count2;
                            })

                        Promise.all([P1, P2])
                            .then(result => {
                                res.render('statistic/statistic_stationE', {
                                    title: "Thống kê đơn hàng trong tháng",
                                    employeeId,
                                    stationCode,
                                    startOfMonth,
                                    endOfMonth,
                                    code,
                                    postSuccess,
                                    postFail
                                })
                            })
                    }
                })

            })





    }

    //thống kê nhân viên theo tuần DONEE
    getStatisticStationEmployeeWeek(req, res) {

        const employeeId = req.params.employeeId

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setUTCHours(0, 0, 0, 0);
        startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        let stationCode;
        let postSuccess = 0;
        let postFail = 0;
        let code = 2;

        Employee.findOne({ employeeId: employeeId }).lean()
            .then(employee => {
                stationCode = employee.workstationCode;
                Station.findOne({ address: employee.workAddress }).lean().then((station) => {
                    if (station) {
                        Warehouse.findOne({ warehouseCode: station.warehouseId }).lean().then((warehouse) => {

                            //giao thành công
                            let P1 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: startOfWeek, $lte: endOfWeek } })
                                .then(count1 => {
                                    postSuccess = count1;
                                })
                            //giao thất bại
                            let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: startOfWeek, $lte: endOfWeek } })
                                .then(count2 => {
                                    postFail = count2;
                                })


                            Promise.all([P1, P2])
                                .then(result => {
                                    res.render('statistic/statistic_stationE', {
                                        title: "Thống kê đơn hàng trong tuần",
                                        employeeId,
                                        stationCode,
                                        startOfWeek,
                                        endOfWeek,
                                        code,
                                        postSuccess: 1,
                                        postFail: 2,

                                        noHeader: 'yes',
                                        employee,
                                        workPlace: station,
                                        desWarehouse: warehouse

                                    })
                                })
                        })
                    } else {

                        //giao thành công
                        let P1 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: startOfWeek, $lte: endOfWeek } })
                            .then(count1 => {
                                postSuccess = count1;
                            })
                        //giao thành công
                        let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: startOfWeek, $lte: endOfWeek } })
                            .then(count2 => {
                                postFail = count2;
                            })

                        Promise.all([P1, P2])
                            .then(result => {
                                res.render('statistic/statistic_stationE', {
                                    title: "Thống kê đơn hàng trong tuần",
                                    employeeId,
                                    stationCode,
                                    startOfWeek,
                                    endOfWeek,
                                    code,
                                    postSuccess,
                                    postFail
                                })
                            })
                    }
                })

            })




    }

    //thống kê nhân viên theo năm DONEE
    getStatisticStationEmployeeYear(req, res) {

        const employeeId = req.params.employeeId

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

        let stationCode;
        let postSuccess = 0;
        let postFail = 0;
        let code = 4;


        Employee.findOne({ employeeId: employeeId }).lean()
            .then(employee => {
                stationCode = employee.workstationCode;
                Station.findOne({ address: employee.workAddress }).lean().then((station) => {
                    if (station) {
                        Warehouse.findOne({ warehouseCode: station.warehouseId }).lean().then((warehouse) => {
                            //giao thành công
                            let P1 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: startOfYear, $lte: endOfYear } })
                                .then(count1 => {
                                    postSuccess = count1;
                                })
                            //giao thành công
                            let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: startOfYear, $lte: endOfYear } })
                                .then(count2 => {
                                    postFail = count2;
                                })


                            Promise.all([P1, P2])
                                .then(result => {
                                    res.render('statistic/statistic_stationE', {
                                        title: "Thống kê đơn hàng trong năm",
                                        employeeId,
                                        stationCode,
                                        startOfYear,
                                        endOfYear,
                                        code,
                                        postSuccess: 2,
                                        postFail: 2,

                                        noHeader: 'yes',
                                        employee,
                                        workPlace: station,
                                        desWarehouse: warehouse

                                    })
                                })
                        })
                    } else {
                        //giao thành công
                        let P1 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: startOfYear, $lte: endOfYear } })
                            .then(count1 => {
                                postSuccess = count1;
                            })
                        //giao ko thành công
                        let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: startOfYear, $lte: endOfYear } })
                            .then(count2 => {
                                postFail = count2;
                            })

                        Promise.all([P1, P2])
                            .then(result => {
                                res.render('statistic/statistic_stationE', {
                                    title: "Thống kê đơn hàng trong năm",
                                    employeeId,
                                    stationCode,
                                    startOfYear,
                                    endOfYear,
                                    code,
                                    postSuccess,
                                    postFail
                                })
                            })
                    }
                })


            })
    }


    //-------------------------------------------------------------------
    //Quản lý toàn quốc theo ngày DONEE
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
        let P1 = Post.countDocuments({ status: 'at sStation', 'statusUpdateTime.0': { $gte: today, $lte: tomorrow } })
            .then(_dailyCustomerReceivedCount => {
                dailyCustomerReceivedCount = _dailyCustomerReceivedCount;
                console.log(_dailyCustomerReceivedCount);
            })


        dailyInCount = dailyCustomerReceivedCount

        // Đếm số hàng ra trong ngày tại điểm giao dịch

        //giao cho khách
        let dailySentToCustomerCount = 0;
        let P2 = Post.countDocuments({ status: 'on way to reveiver', 'statusUpdateTime.7': { $gte: today, $lte: tomorrow } })
            .then(_dailySentToCustomerCount => {
                dailySentToCustomerCount += _dailySentToCustomerCount;
                console.log(_dailySentToCustomerCount);
            })

        dailyOutCount = dailySentToCustomerCount;

        //thống kê hàng gửi thành công/không thành công
        let postSuccess = 0;
        let postFail = 0;
        let code = 1;

        //giao thành công
        let P3 = Post.countDocuments({ status: 'received', 'statusUpdateTime.8': { $gte: today, $lte: tomorrow } })
            .then(count1 => {
                console.log(count1)
                postSuccess = count1;
            })
        //giao thất bại
        let P4 = Post.countDocuments({ status: 'returned', 'statusUpdateTime.9': { $gte: today, $lte: tomorrow } })
            .then(count2 => {
                console.log(count2)
                postFail = count2;
            })



        Promise.all([P1, P2, P3, P4])
            .then(result => {
                res.render('statistic/statistic_manager', {
                    message: "bodyManagerNationWide",
                    title: "Thống kê toàn quốc theo ngày",
                    today,
                    tomorrow,
                    dailyInCount,
                    dailyOutCount,
                    code,
                    postSuccess,
                    postFail,
                    weekInCount: false,
                    monthInCount: false,
                    yearInCount: false,
                    employee: req.session.employee,
                });
            })
    }

    //---------------------------
    //Quản lý toàn quốc theo tháng DONEE
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
        let P1 = Post.countDocuments({ status: 'at sStation', 'statusUpdateTime.0': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_monthCustomerReceivedCount => {
                monthCustomerReceivedCount = _monthCustomerReceivedCount;
                console.log(_monthCustomerReceivedCount);
            })



        //giao cho khách
        let monthSentToCustomerCount = 0;
        let P2 = Post.countDocuments({ status: 'on way to reveiver', 'statusUpdateTime.7': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_monthSentToCustomerCount => {
                monthSentToCustomerCount += _monthSentToCustomerCount;
                console.log(_monthSentToCustomerCount);
            })


        //thống kê giao nhận sucess/fail
        let postSuccess = 0;
        let postFail = 0;
        let code = 3;

        //giao thành công
        let P3 = Post.countDocuments({ status: 'received', 'statusUpdateTime.8': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(count1 => {
                postSuccess = count1;
            })
        //giao thành công
        let P4 = Post.countDocuments({ status: 'returned', 'statusUpdateTime.9': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(count2 => {
                postFail = count2;
            })

        Promise.all([P1, P2, P3, P4])
            .then(result => {
                monthInCount = monthCustomerReceivedCount;
                monthOutCount = monthSentToCustomerCount;
                // Đếm số hàng ra trong tháng tại điểm giao dịch

                res.render('statistic/statistic_manager', {
                    message: "bodyManagerNationWide",
                    title: "Thống kê toàn quốc theo tháng",
                    startOfMonth,
                    endOfMonth,
                    dailyInCount: false,
                    weekInCount: false,
                    monthInCount,
                    monthOutCount,
                    code,
                    postSuccess,
                    postFail,
                    yearInCount: false,
                });
            })
    }

    //Quản lý toàn quốc theo tuần DONEE
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
        let P1 = Post.countDocuments({ status: 'at sStation', 'statusUpdateTime.0': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_weekCustomerReceivedCount => {
                weekCustomerReceivedCount = _weekCustomerReceivedCount;
                console.log(_weekCustomerReceivedCount);
            })




        // Đếm số hàng ra trong ngày tại điểm giao dịch

        //giao cho khách
        let weekSentToCustomerCount = 0;
        let P2 = Post.countDocuments({ status: 'on way to reveiver', 'statusUpdateTime.7': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_weekSentToCustomerCount => {
                weekSentToCustomerCount += _weekSentToCustomerCount;
                console.log(_weekSentToCustomerCount);
            })



        //thống kê hàng gửi thành công/không thành công
        let postSuccess = 0;
        let postFail = 0;
        let code = 2;

        //giao thành công
        let P3 = Post.countDocuments({ status: 'received', 'statusUpdateTime.8': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(count1 => {
                postSuccess = count1;
            })
        //giao thành công
        let P4 = Post.countDocuments({ status: 'returned', 'statusUpdateTime.9': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(count2 => {
                postFail = count2;
            })


        Promise.all([P1, P2, P3, P4])
            .then(result => {
                weekInCount = weekCustomerReceivedCount;
                weekOutCount = weekSentToCustomerCount;

                res.render('statistic/statistic_manager', {
                    message: "bodyManagerNationWide",
                    title: "Thống kê toàn quốc theo tuần",
                    startOfWeek,
                    endOfWeek,
                    weekInCount,
                    weekOutCount,
                    code,
                    postSuccess,
                    postFail,
                    dailyInCount: false,
                    monthInCount: false,
                    yearInCount: false,

                });
            })
    }

    //Quản lý toàn quốc theo năm DONEE
    postStatisticManagerYearNationWide(req, res) {

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

        let yearInCount = 0;
        let yearOutCount = 0;

        console.log(startOfYear + "--" + endOfYear)


        // Đếm số hàng vào trong ngày tại điểm giao dịch

        //do khách gửi tại điểm giao dịch
        let yearCustomerReceivedCount = 0;
        let P1 = Post.countDocuments({ status: 'at sStation', 'statusUpdateTime.0': { $gte: startOfYear, $lte: endOfYear } })
            .then(_yearCustomerReceivedCount => {
                yearCustomerReceivedCount = _yearCustomerReceivedCount;
                yearInCount = yearCustomerReceivedCount
                console.log("yearInCount" + yearInCount);
            })





        // Đếm số hàng ra trong ngày tại điểm giao dịch

        //giao cho khách
        let yearSentToCustomerCount = 0;
        let P2 = Post.countDocuments({ status: 'on way to reveiver', 'statusUpdateTime.7': { $gte: startOfYear, $lte: endOfYear } })
            .then(_yearSentToCustomerCount => {
                yearSentToCustomerCount = _yearSentToCustomerCount;
                yearOutCount = yearSentToCustomerCount;
                console.log("yearOutCount" + yearOutCount);

            })



        //thống kê hàng gửi thành công/không thành công
        let postSuccess = 0;
        let postFail = 0;
        let code = 4;

        //giao thành công
        let P3 = Post.countDocuments({ status: 'received', 'statusUpdateTime.8': { $gte: startOfYear, $lte: endOfYear } })
            .then(count1 => {
                postSuccess = count1;
                console.log("postSuccess = count1;" + postSuccess)
            })
        //giao thành công
        let P4 = Post.countDocuments({ status: 'returned', 'statusUpdateTime.9': { $gte: startOfYear, $lte: endOfYear } })
            .then(count2 => {
                postFail = count2;
                console.log("postFail = count2;" + postFail)

            })


        Promise.all([P1, P2, P3, P4])
            .then(result => {
                yearInCount = yearCustomerReceivedCount
                yearOutCount = yearSentToCustomerCount;
                res.render('statistic/statistic_manager', {
                    message: "bodyManagerNationWide",
                    title: "Thống kê toàn quốc theo năm",
                    startOfYear,
                    endOfYear,
                    yearInCount,
                    yearOutCount,
                    code,
                    postSuccess,
                    postFail,
                    weekInCount: false,
                    monthInCount: false,
                    dailyInCount: false,

                });
            })
    }


    getStatisticStation(req, res) {

    }

    getStatisticsWareHouse(req, res) {


    }

    postSearchStation(req, res) {
        const stationCode = req.body.stationCode;
        console.log(stationCode)

        Station.findOne({ stationCode: stationCode })
            .then(station => {
                console.log("find" + stationCode + "+" + station)
                if (!station) {
                    return res.json({
                        message: 'Magic post hiện chưa có bưu cục nào ở vị trí này!'
                    });
                }

                const result = {
                    name: station.name,
                    stationCode: station.stationCode,
                    detailAddress: station.detailAddress
                };

                return res.json(result);
            })
            .catch(error => {
                console.error('Lỗi truy vấn database:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }
    postSearchWarehouse(req, res) {
        const warehouseCode = req.body.warehouseCode;
        console.log(warehouseCode)

        Warehouse.findOne({ warehouseCode: warehouseCode })
            .then(warehouse => {
                console.log("find" + warehouseCode + "+" + warehouse)
                if (!warehouse) {
                    return res.json({
                        message: 'Magic post hiện chưa có bưu cục nào ở vị trí này!'
                    });
                }

                const result = {
                    name: warehouse.name,
                    warehouseCode: warehouse.warehouseCode,
                    detailAddress: warehouse.detailAddress
                };

                return res.json(result);
            })
            .catch(error => {
                console.error('Lỗi truy vấn database:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }

    //-------------------------------------------------------------------
    //Quản lý station theo ngày DONEE
    getStatisticManagerDailyStation(req, res) {

        const stationCode = req.params.stationCode;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let dailyInCount = 0;
        let dailyOutCount = 0;

        console.log(stationCode)


        // Đếm số hàng vào trong ngày tại điểm giao dịch

        //do khách gửi tại điểm giao dịch
        let dailyCustomerReceivedCount = 0;
        let P1 = Post.countDocuments({ senderStationCode: stationCode, status: 'at sStation', 'statusUpdateTime.0': { $gte: today, $lte: tomorrow } })
            .then(_dailyCustomerReceivedCount => {
                dailyCustomerReceivedCount = _dailyCustomerReceivedCount;
                console.log(_dailyCustomerReceivedCount);
            })

        //do nhận về từ điểm tập kết
        let stationDailyWarehouseReceivedCount = 0;
        let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'at rStation', 'statusUpdateTime.6': { $gte: today, $lte: tomorrow } })
            .then(_stationDailyWarehouseReceivedCount => {
                stationDailyWarehouseReceivedCount = _stationDailyWarehouseReceivedCount;
                console.log(_stationDailyWarehouseReceivedCount);
            })



        // Đếm số hàng ra trong ngày tại điểm giao dịch

        //gửi đi điểm tập kết
        let stationDailySendtoWarehouseCount = 0;
        let P3 = Post.countDocuments({ senderStationCode: stationCode, status: 'on way to sWarehouse', 'statusUpdateTime.1': { $gte: today, $lte: tomorrow } })
            .then(_stationDailySendtoWarehouseCount => {
                stationDailySendtoWarehouseCount = _stationDailySendtoWarehouseCount;
                console.log(_stationDailySendtoWarehouseCount);
            })
        //giao cho khách
        let dailySentToCustomerCount = 0;
        let P4 = Post.countDocuments({ receiverStationCode: stationCode, status: 'on way to reveiver', 'statusUpdateTime.7': { $gte: today, $lte: tomorrow } })
            .then(_dailySentToCustomerCount => {
                dailySentToCustomerCount += _dailySentToCustomerCount;
                console.log(_dailySentToCustomerCount);
            })

        //thống kê hàng gửi thành công/không thành công
        let postSuccess = 0;
        let postFail = 0;
        let code = 1;

        //giao thành công
        let P5 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: today, $lte: tomorrow } })
            .then(count1 => {
                console.log(count1)
                postSuccess = count1;
            })
        //giao thất bại
        let P6 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: today, $lte: tomorrow } })
            .then(count2 => {
                console.log(count2)
                postFail = count2;
            })


        Promise.all([P1, P2, P3, P4, P5, P6])
            .then(result => {
                dailyInCount = dailyCustomerReceivedCount + stationDailyWarehouseReceivedCount

                dailyOutCount = dailySentToCustomerCount + stationDailySendtoWarehouseCount;

                res.render('statistic/statistic_manager', {
                    message: "bodyManagerStation",
                    title: "Thống kê tại điểm giao dịch theo ngày",
                    stationCode,
                    today,
                    tomorrow,
                    dailyInCount,
                    dailyCustomerReceivedCount,
                    stationDailyWarehouseReceivedCount,
                    dailyOutCount,
                    stationDailySendtoWarehouseCount,
                    dailySentToCustomerCount,
                    code,
                    postSuccess,
                    postFail,
                    weekInCount: false,
                    monthInCount: false,
                    yearInCount: false,

                });
            })
    }

    //---------------------------
    //Quản lý station theo tháng DONEE
    getStatisticManagerMonthStation(req, res) {

        const stationCode = req.params.stationCode;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const endOfMonth = new Date();
        endOfMonth.setMonth(startOfMonth.getMonth() + 1);

        let monthInCount = 0;
        let monthOutCount = 0;


        // Đếm số hàng vào trong tháng tại điểm giao dịch

        //do khách gửi tại điểm giao dịch
        let monthCustomerReceivedCount = 0;
        let P1 = Post.countDocuments({ senderStationCode: stationCode, status: 'at sStation', 'statusUpdateTime.0': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_monthCustomerReceivedCount => {
                monthCustomerReceivedCount = _monthCustomerReceivedCount;
                console.log(_monthCustomerReceivedCount);
            })

        //do nhận về từ điểm tập kết
        let stationMonthWarehouseReceivedCount = 0;
        let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'at rStation', 'statusUpdateTime.6': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_stationDailyWarehouseReceivedCount => {
                stationMonthWarehouseReceivedCount = _stationDailyWarehouseReceivedCount;
                console.log(_stationDailyWarehouseReceivedCount);
            })



        //gửi đi điểm tập kết
        let stationMonthSendtoWarehouseCount = 0;
        let P3 = Post.countDocuments({ senderStationCode: stationCode, status: 'on way to sWarehouse', 'statusUpdateTime.1': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_stationDailySendtoWarehouseCount => {
                stationMonthSendtoWarehouseCount = _stationDailySendtoWarehouseCount;
                console.log(_stationDailySendtoWarehouseCount);
            })
        //giao cho khách
        let monthSentToCustomerCount = 0;
        let P4 = Post.countDocuments({ receiverStationCode: stationCode, status: 'on way to reveiver', 'statusUpdateTime.7': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_monthSentToCustomerCount => {
                monthSentToCustomerCount += _monthSentToCustomerCount;
                console.log(_monthSentToCustomerCount);
            })


        //thống kê nhận gửi thành công/không thành công

        let postSuccess = 0;
        let postFail = 0;
        let code = 3;


        //giao thành công
        let P5 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(count1 => {
                console.log(count1)
                postSuccess = count1;
            })
        //giao thất bại
        let P6 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(count2 => {
                console.log(count2)
                postFail = count2;
            })



        Promise.all([P1, P2, P3, P4, P5, P6])
            .then(result => {
                monthInCount = monthCustomerReceivedCount + stationMonthWarehouseReceivedCount
                // Đếm số hàng ra trong tháng tại điểm giao dịch

                monthOutCount = monthSentToCustomerCount + stationMonthSendtoWarehouseCount;


                res.render('statistic/statistic_manager', {
                    message: "bodyManagerStation",
                    title: "Thống kê tại điểm giao dịch theo tháng",
                    stationCode,
                    startOfMonth,
                    endOfMonth,
                    dailyInCount: false,
                    monthCustomerReceivedCount,
                    stationMonthWarehouseReceivedCount,
                    stationMonthSendtoWarehouseCount,
                    monthSentToCustomerCount,
                    code,
                    postSuccess,
                    postFail,
                    weekInCount: false,
                    monthInCount,
                    monthOutCount,
                    yearInCount: false,
                });
            })
    }

    //Quản lý station theo tuần DONEE
    getStatisticManagerWeekStation(req, res) {

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setUTCHours(0, 0, 0, 0);
        startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        let weekInCount = 0;
        let weekOutCount = 0;

        const stationCode = req.params.stationCode;

        // Đếm số hàng vào trong ngày tại điểm giao dịch

        //do khách gửi tại điểm giao dịch
        let weekCustomerReceivedCount = 0;
        let P1 = Post.countDocuments({ senderStationCode: stationCode, status: 'at sStation', 'statusUpdateTime.0': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_weekCustomerReceivedCount => {
                weekCustomerReceivedCount = _weekCustomerReceivedCount;
                console.log(_weekCustomerReceivedCount);
            })

        //do nhận về từ điểm tập kết
        let stationWeekWarehouseReceivedCount = 0;
        let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'at rStation', 'statusUpdateTime.6': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_stationweekWarehouseReceivedCount => {
                stationWeekWarehouseReceivedCount = _stationweekWarehouseReceivedCount;
                console.log(_stationweekWarehouseReceivedCount);
            })



        // Đếm số hàng ra trong ngày tại điểm giao dịch

        //gửi đi điểm tập kết
        let stationWeekSendtoWarehouseCount = 0;
        let P3 = Post.countDocuments({ senderStationCode: stationCode, status: 'on way to sWarehouse', 'statusUpdateTime.1': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_stationweekSendtoWarehouseCount => {
                stationWeekSendtoWarehouseCount = _stationweekSendtoWarehouseCount;
                console.log(_stationweekSendtoWarehouseCount);
            })
        //giao cho khách
        let weekSentToCustomerCount = 0;
        let P4 = Post.countDocuments({ receiverStationCode: stationCode, status: 'on way to reveiver', 'statusUpdateTime.7': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_weekSentToCustomerCount => {
                weekSentToCustomerCount += _weekSentToCustomerCount;
                console.log(_weekSentToCustomerCount);
            })


        //thống kê hàng gửi thành công/không thành công
        let postSuccess = 0;
        let postFail = 0;
        let code = 2;

        //giao thành công
        let P5 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(count1 => {
                console.log(count1)
                postSuccess = count1;
            })
        //giao thất bại
        let P6 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(count2 => {
                console.log(count2)
                postFail = count2;
            })


        Promise.all([P1, P2, P3, P4, P5, P6])
            .then(result => {
                weekInCount = weekCustomerReceivedCount + stationWeekWarehouseReceivedCount
                weekOutCount = weekSentToCustomerCount + stationWeekSendtoWarehouseCount;


                res.render('statistic/statistic_manager', {
                    message: "bodyManagerStation",
                    title: "Thống kê tại điểm giao dịch theo tuần",
                    stationCode,
                    startOfWeek,
                    endOfWeek,
                    weekInCount,
                    weekOutCount,
                    weekCustomerReceivedCount,
                    stationWeekWarehouseReceivedCount,
                    stationWeekSendtoWarehouseCount,
                    weekSentToCustomerCount,
                    code,
                    postSuccess,
                    postFail,
                    dailyInCount: false,
                    monthInCount: false,
                    yearInCount: false,

                });
            })
    }

    //Quản lý station theo năm DONEE
    getStatisticManagerYearStation(req, res) {

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

        let yearInCount = 0;
        let yearOutCount = 0;

        const stationCode = req.params.stationCode;

        // Đếm số hàng vào trong ngày tại điểm giao dịch

        //do khách gửi tại điểm giao dịch
        let yearCustomerReceivedCount = 0;
        let P1 = Post.countDocuments({ senderStationCode: stationCode, status: 'at sStation', 'statusUpdateTime.0': { $gte: startOfYear, $lte: endOfYear } })
            .then(_YearCustomerReceivedCount => {
                yearCustomerReceivedCount = _YearCustomerReceivedCount;
                console.log(_YearCustomerReceivedCount);
            })

        //do nhận về từ điểm tập kết
        let stationYearWarehouseReceivedCount = 0;
        let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'at rStation', 'statusUpdateTime.6': { $gte: startOfYear, $lte: endOfYear } })
            .then(_stationYearWarehouseReceivedCount => {
                stationYearWarehouseReceivedCount = _stationYearWarehouseReceivedCount;
                console.log(_stationYearWarehouseReceivedCount);
            })


        // Đếm số hàng ra trong ngày tại điểm giao dịch

        //gửi đi điểm tập kết
        let stationYearSendtoWarehouseCount = 0;
        let P3 = Post.countDocuments({ senderStationCode: stationCode, status: 'on way to sWarehouse', 'statusUpdateTime.1': { $gte: startOfYear, $lte: endOfYear } })
            .then(_stationYearSendtoWarehouseCount => {
                stationYearSendtoWarehouseCount = _stationYearSendtoWarehouseCount;
                console.log(_stationYearSendtoWarehouseCount);
            })
        //giao cho khách
        let yearSentToCustomerCount = 0;
        let P4 = Post.countDocuments({ receiverStationCode: stationCode, status: 'on way to reveiver', 'statusUpdateTime.7': { $gte: startOfYear, $lte: endOfYear } })
            .then(_YearSentToCustomerCount => {
                yearSentToCustomerCount += _YearSentToCustomerCount;
                console.log(_YearSentToCustomerCount);
            })


        //thống kê hàng gửi thành công/không thành công
        let postSuccess = 0;
        let postFail = 0;
        let code = 4;

        //giao thành công
        let P5 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: startOfYear, $lte: endOfYear } })
            .then(count1 => {
                console.log(count1)
                postSuccess = count1;
            })
        //giao thất bại
        let P6 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: startOfYear, $lte: endOfYear } })
            .then(count2 => {
                console.log(count2)
                postFail = count2;
            })

        Promise.all([P1, P2, P3, P4, P5, P6])
            .then(result => {
                yearInCount = yearCustomerReceivedCount + stationYearWarehouseReceivedCount
                yearOutCount = yearSentToCustomerCount + stationYearSendtoWarehouseCount;

                res.render('statistic/statistic_manager', {
                    message: "bodyManagerStation",
                    title: "Thống kê tại điểm giao dịch theo năm",
                    stationCode,
                    startOfYear,
                    endOfYear,
                    yearCustomerReceivedCount,
                    stationYearWarehouseReceivedCount,
                    stationYearSendtoWarehouseCount,
                    yearSentToCustomerCount,
                    yearInCount,
                    yearOutCount,
                    code,
                    postSuccess,
                    postFail,
                    weekInCount: false,
                    monthInCount: false,
                    dailyInCount: false,

                });
            })
    }

    //-------------------------------------------------------------------
    //Quản lý warehouse theo ngày DONEE
    getStatisticManagerDailyWarehouse(req, res) {

        const warehouseCode = req.params.warehouseCode;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let dailyInCount = 0;
        let dailyOutCount = 0;

        console.log(warehouseCode)


        // Đếm số hàng vào trong ngày tại điểm tập kết


        let warehouseDailyWarehouseReceivedCount = 0;
        let P1 = Post.countDocuments({ receiverWarehouseCode: warehouseCode, status: 'at rWarehouse', 'statusUpdateTime.4': { $gte: today, $lte: tomorrow } })
            .then(_warehouseDailyWarehouseReceivedCount => {
                warehouseDailyWarehouseReceivedCount = _warehouseDailyWarehouseReceivedCount;
                console.log(_warehouseDailyWarehouseReceivedCount);
                dailyInCount = warehouseDailyWarehouseReceivedCount
            })

        // Đếm số hàng ra trong ngày tại điểm tập kết

        //gửi đi điểm giao dịch
        let warehouseDailySendtoStationCount = 0;
        let P2 = Post.countDocuments({ senderWarehouseCode: warehouseCode, status: 'on way to rWarehouse', 'statusUpdateTime.3': { $gte: today, $lte: tomorrow } })
            .then(_warehouseDailySendtoWarehouseCount => {
                warehouseDailySendtoStationCount = _warehouseDailySendtoWarehouseCount;
                console.log(_warehouseDailySendtoWarehouseCount);
                dailyOutCount = warehouseDailySendtoStationCount;
            })


        Promise.all([P1, P2])
            .then(result => {
                res.render('statistic/statistic_manager', {
                    message: "bodyManagerWarehouse",
                    title: "Thống kê tại điểm tập kết theo ngày",
                    warehouseCode,
                    today,
                    tomorrow,
                    dailyInCount,
                    dailyOutCount,
                    weekInCount: false,
                    monthInCount: false,
                    yearInCount: false,

                });
            })
    }

    //---------------------------
    //Quản lý warehouse theo tháng DONEE
    getStatisticManagerMonthWarehouse(req, res) {

        const warehouseCode = req.params.warehouseCode;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const endOfMonth = new Date();
        endOfMonth.setMonth(startOfMonth.getMonth() + 1);

        let monthInCount = 0;
        let monthOutCount = 0;


        // Đếm số hàng vào trong tháng tại điểm giao dịch

        //gửi đi điểm giao dịch
        let warehouseMonthWarehouseReceivedCount = 0;
        let P1 = Post.countDocuments({ receiverWarehouseCode: warehouseCode, status: 'at rWarehouse', 'statusUpdateTime.4': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_warehouseMonthWarehouseReceivedCount => {
                warehouseMonthWarehouseReceivedCount = _warehouseMonthWarehouseReceivedCount;
                console.log(_warehouseMonthWarehouseReceivedCount);
                monthInCount = warehouseMonthWarehouseReceivedCount;
            })

        // Đếm số hàng ra trong tháng tại điểm giao dịch

        //gửi đi điểm giao dịch
        let warehouseMonthSendtoStationCount = 0;
        let P2 = Post.countDocuments({ senderWarehouseCode: warehouseCode, status: 'on way to rWarehouse', 'statusUpdateTime.3': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_warehouseMonthSendtoStationCount => {
                warehouseMonthSendtoStationCount += _warehouseMonthSendtoStationCount;
                console.log(_warehouseMonthSendtoStationCount);
                monthOutCount = warehouseMonthSendtoStationCount;
            })

        Promise.all([P1, P2])
            .then(result => {
                res.render('statistic/statistic_manager', {
                    message: "bodyManagerWarehouse",
                    title: "Thống kê tại điểm tập kết theo tháng",
                    warehouseCode,
                    startOfMonth,
                    endOfMonth,
                    dailyInCount: false,
                    weekInCount: false,
                    monthInCount,
                    monthOutCount,
                    yearInCount: false,
                });
            })
    }

    //Quản lý warehouse theo tuần DONEE
    getStatisticManagerWeekWarehouse(req, res) {

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setUTCHours(0, 0, 0, 0);
        startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        let weekInCount = 0;
        let weekOutCount = 0;

        const warehouseCode = req.params.warehouseCode;



        // Đếm số hàng vào trong tuần tại điểm tập kết
        let warehouseWeekWarehouseReceivedCount = 0;
        let P1 = Post.countDocuments({ receiverWarehouseCode: warehouseCode, status: 'at rWarehouse', 'statusUpdateTime.4': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_warehouseWeekWarehouseReceivedCount => {
                warehouseWeekWarehouseReceivedCount = _warehouseWeekWarehouseReceivedCount;
                console.log(_warehouseWeekWarehouseReceivedCount);
                weekInCount = warehouseWeekWarehouseReceivedCount;
            })




        // Đếm số hàng ra trong ngày tại điểm giao dịch

        //gửi đi điểm giao dịch
        let warehouseDailySendtoStationCount = 0;
        let P2 = Post.countDocuments({ senderWarehouseCode: warehouseCode, status: 'on way to rWarehouse', 'statusUpdateTime.3': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_warehouseDailySendtoWarehouseCount => {
                warehouseDailySendtoStationCount = _warehouseDailySendtoWarehouseCount;
                console.log(_warehouseDailySendtoWarehouseCount);
                weekOutCount = warehouseDailySendtoStationCount;
            })



        //thống kê hàng gửi thành công/không thành công

        Promise.all([P1, P2])
            .then(result => {
                res.render('statistic/statistic_manager', {
                    message: "bodyManagerWarehouse",
                    title: "Thống kê tại điểm tập kết theo tuần",
                    warehouseCode,
                    startOfWeek,
                    endOfWeek,
                    weekInCount,
                    weekOutCount,
                    dailyInCount: false,
                    monthInCount: false,
                    yearInCount: false,

                });
            })
    }

    //Quản lý warehouse theo năm DONEE
    getStatisticManagerYearWarehouse(req, res) {

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

        let yearInCount = 0;
        let yearOutCount = 0;

        const warehouseCode = req.params.warehouseCode;

        // Đếm số hàng vào trong năm 


        let yearCustomerReceivedCount = 0;
        let P1 = Post.countDocuments({ status: 'at sWarehouse', 'statusUpdateTime.4': { $gte: startOfYear, $lte: endOfYear } })
            .then(_yearCustomerReceivedCount => {
                yearCustomerReceivedCount = _yearCustomerReceivedCount;
                console.log(_yearCustomerReceivedCount);
                yearInCount = yearCustomerReceivedCount;
            })



        // Đếm số hàng ra 


        let yearSentToCustomerCount = 0;
        let P2 = Post.countDocuments({ senderWarehouseCode: warehouseCode, status: 'on way to rWarehouse', 'statusUpdateTime.3': { $gte: startOfYear, $lte: endOfYear } })
            .then(_yearSentToCustomerCount => {
                yearSentToCustomerCount += _yearSentToCustomerCount;
                console.log(_yearSentToCustomerCount);
                yearOutCount = yearSentToCustomerCount;
            })



        Promise.all([P1, P2])
            .then(result => {
                res.render('statistic/statistic_manager', {
                    message: "bodyManagerWarehouse",
                    title: "Thống kê tại điểm tập kết theo năm",
                    warehouseCode,
                    startOfYear,
                    endOfYear,
                    yearInCount,
                    yearOutCount,
                    weekInCount: false,
                    monthInCount: false,
                    dailyInCount: false,

                });
            })
    }

    ///---------------------------------------------------
    //-------------------------------------------------------------------
    //Quản lý station theo ngày DONEE
    getStatisticDailyStation(req, res) {

        const stationCode = req.params.stationCode;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let dailyInCount = 0;
        let dailyOutCount = 0;

        console.log(stationCode)


        // Đếm số hàng vào trong ngày tại điểm giao dịch

        //do khách gửi tại điểm giao dịch
        let dailyCustomerReceivedCount = 0;
        let P1 = Post.countDocuments({ senderStationCode: stationCode, status: 'at sStation', 'statusUpdateTime.0': { $gte: today, $lte: tomorrow } })
            .then(_dailyCustomerReceivedCount => {
                dailyCustomerReceivedCount = _dailyCustomerReceivedCount;
                console.log(_dailyCustomerReceivedCount);
            })

        //do nhận về từ điểm tập kết
        let stationDailyWarehouseReceivedCount = 0;
        let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'at rStation', 'statusUpdateTime.6': { $gte: today, $lte: tomorrow } })
            .then(_stationDailyWarehouseReceivedCount => {
                stationDailyWarehouseReceivedCount = _stationDailyWarehouseReceivedCount;
                console.log(_stationDailyWarehouseReceivedCount);
            })



        //gửi đi điểm tập kết
        let stationDailySendtoWarehouseCount = 0;
        let P3 = Post.countDocuments({ senderStationCode: stationCode, status: 'on way to sWarehouse', 'statusUpdateTime.1': { $gte: today, $lte: tomorrow } })
            .then(_stationDailySendtoWarehouseCount => {
                stationDailySendtoWarehouseCount = _stationDailySendtoWarehouseCount;
                console.log(_stationDailySendtoWarehouseCount);
            })
        //giao cho khách
        let dailySentToCustomerCount = 0;
        let P4 = Post.countDocuments({ receiverStationCode: stationCode, status: 'on way to reveiver', 'statusUpdateTime.7': { $gte: today, $lte: tomorrow } })
            .then(_dailySentToCustomerCount => {
                dailySentToCustomerCount += _dailySentToCustomerCount;
                console.log(_dailySentToCustomerCount);
            })


        //thống kê hàng gửi thành công/không thành công
        let postSuccess = 0;
        let postFail = 0;
        let code = 1;

        //giao thành công
        let P5 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: today, $lte: tomorrow } })
            .then(count1 => {
                console.log(count1)
                postSuccess = count1;
            })
        //giao thất bại
        let P6 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: today, $lte: tomorrow } })
            .then(count2 => {
                console.log(count2)
                postFail = count2;
            })

        Promise.all([P1, P2, P3, P4, P5, P6])
            .then(result => {
                dailyInCount = dailyCustomerReceivedCount + stationDailyWarehouseReceivedCount

                // Đếm số hàng ra trong ngày tại điểm giao dịch
                dailyOutCount = dailySentToCustomerCount + stationDailySendtoWarehouseCount;


                res.render('statistic/statistic_stationAd', {
                    title: "Thống kê tại điểm giao dịch theo ngày",
                    stationCode,
                    today,
                    tomorrow,
                    dailyInCount,
                    dailyCustomerReceivedCount,
                    stationDailyWarehouseReceivedCount,
                    dailyOutCount,
                    stationDailySendtoWarehouseCount,
                    dailySentToCustomerCount,
                    code,
                    postSuccess,
                    postFail,
                    weekInCount: false,
                    monthInCount: false,
                    yearInCount: false,

                });
            })
    }

    //---------------------------
    //Quản lý station theo tháng DONEE
    getStatisticMonthStation(req, res) {

        const stationCode = req.params.stationCode;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const endOfMonth = new Date();
        endOfMonth.setMonth(startOfMonth.getMonth() + 1);

        let monthInCount = 0;
        let monthOutCount = 0;


        // Đếm số hàng vào trong tháng tại điểm giao dịch

        //do khách gửi tại điểm giao dịch
        let monthCustomerReceivedCount = 0;
        let P1 = Post.countDocuments({ senderStationCode: stationCode, status: 'at sStation', 'statusUpdateTime.0': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_monthCustomerReceivedCount => {
                monthCustomerReceivedCount = _monthCustomerReceivedCount;
                console.log(_monthCustomerReceivedCount);
            })

        //do nhận về từ điểm tập kết
        let stationMonthWarehouseReceivedCount = 0;
        let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'at rStation', 'statusUpdateTime.6': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_stationDailyWarehouseReceivedCount => {
                stationMonthWarehouseReceivedCount = _stationDailyWarehouseReceivedCount;
                console.log(_stationDailyWarehouseReceivedCount);
            })




        //gửi đi điểm tập kết
        let stationMonthSendtoWarehouseCount = 0;
        let P3 = Post.countDocuments({ senderStationCode: stationCode, status: 'on way to sWarehouse', 'statusUpdateTime.1': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_stationDailySendtoWarehouseCount => {
                stationMonthSendtoWarehouseCount = _stationDailySendtoWarehouseCount;
                console.log(_stationDailySendtoWarehouseCount);
            })
        //giao cho khách
        let monthSentToCustomerCount = 0;
        let P4 = Post.countDocuments({ receiverStationCode: stationCode, status: 'on way to reveiver', 'statusUpdateTime.7': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_monthSentToCustomerCount => {
                monthSentToCustomerCount += _monthSentToCustomerCount;
                console.log(_monthSentToCustomerCount);
            })

        let postSuccess = 0;
        let postFail = 0;
        let code = 3;

        //giao thành công
        let P5 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(count1 => {
                console.log(count1)
                postSuccess = count1;
            })
        //giao thất bại
        let P6 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(count2 => {
                console.log(count2)
                postFail = count2;
            })

        Promise.all([P1, P2, P3, P4, P5, P6])
            .then(result => {
                monthInCount = monthCustomerReceivedCount + stationMonthWarehouseReceivedCount
                // Đếm số hàng ra trong tháng tại điểm giao dịch


                monthOutCount = monthSentToCustomerCount + stationMonthSendtoWarehouseCount;

                //thống kê hàng gửi thành công/không thành công
                res.render('statistic/statistic_stationAd', {
                    title: "Thống kê tại điểm giao dịch theo tháng",
                    stationCode,
                    startOfMonth,
                    endOfMonth,
                    dailyInCount: false,
                    monthCustomerReceivedCount,
                    stationMonthWarehouseReceivedCount,
                    stationMonthSendtoWarehouseCount,
                    monthSentToCustomerCount,
                    code,
                    postSuccess,
                    postFail,
                    weekInCount: false,
                    monthInCount,
                    monthOutCount,
                    yearInCount: false,
                });
            })
    }

    //Quản lý station theo tuần DONEE
    getStatisticWeekStation(req, res) {

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setUTCHours(0, 0, 0, 0);
        startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        let weekInCount = 0;
        let weekOutCount = 0;

        const stationCode = req.params.stationCode;

        // Đếm số hàng vào trong ngày tại điểm giao dịch

        //do khách gửi tại điểm giao dịch
        let weekCustomerReceivedCount = 0;
        let P1 = Post.countDocuments({ senderStationCode: stationCode, status: 'at sStation', 'statusUpdateTime.0': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_weekCustomerReceivedCount => {
                weekCustomerReceivedCount = _weekCustomerReceivedCount;
                console.log(_weekCustomerReceivedCount);
            })

        //do nhận về từ điểm tập kết
        let stationWeekWarehouseReceivedCount = 0;
        let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'at rStation', 'statusUpdateTime.6': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_stationweekWarehouseReceivedCount => {
                stationWeekWarehouseReceivedCount = _stationweekWarehouseReceivedCount;
                console.log(_stationweekWarehouseReceivedCount);
            })



        // Đếm số hàng ra trong ngày tại điểm giao dịch

        //gửi đi điểm tập kết
        let stationWeekSendtoWarehouseCount = 0;
        let P3 = Post.countDocuments({ senderStationCode: stationCode, status: 'on way to sWarehouse', 'statusUpdateTime.1': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_stationweekSendtoWarehouseCount => {
                stationWeekSendtoWarehouseCount = _stationweekSendtoWarehouseCount;
                console.log(_stationweekSendtoWarehouseCount);
            })
        //giao cho khách
        let weekSentToCustomerCount = 0;
        let P4 = Post.countDocuments({ receiverStationCode: stationCode, status: 'on way to reveiver', 'statusUpdateTime.7': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_weekSentToCustomerCount => {
                weekSentToCustomerCount += _weekSentToCustomerCount;
                console.log(_weekSentToCustomerCount);
            })

        //thống kê hàng gửi thành công/không thành công
        let postSuccess = 0;
        let postFail = 0;
        let code = 2;

        //giao thành công
        let P5 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(count1 => {
                postSuccess = count1;
            })
        //giao thành công
        let P6 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(count2 => {
                postFail = count2;
            })

        Promise.all([P1, P2, P3, P4, P5, P6])
            .then(result => {
                weekInCount = weekCustomerReceivedCount + stationWeekWarehouseReceivedCount

                weekOutCount = weekSentToCustomerCount + stationWeekSendtoWarehouseCount;


                res.render('statistic/statistic_stationAd', {
                    title: "Thống kê tại điểm giao dịch theo tuần",
                    stationCode,
                    startOfWeek,
                    endOfWeek,
                    weekInCount,
                    weekOutCount,
                    weekCustomerReceivedCount,
                    stationWeekWarehouseReceivedCount,
                    stationWeekSendtoWarehouseCount,
                    weekSentToCustomerCount,
                    code,
                    postSuccess,
                    postFail,
                    dailyInCount: false,
                    monthInCount: false,
                    yearInCount: false,

                });
            })
    }

    //Quản lý station theo năm DONEE
    getStatisticYearStation(req, res) {

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

        let yearInCount = 0;
        let yearOutCount = 0;

        const stationCode = req.params.stationCode;

        // Đếm số hàng vào trong ngày tại điểm giao dịch

        //do khách gửi tại điểm giao dịch
        let yearCustomerReceivedCount = 0;
        let P1 = Post.countDocuments({ senderStationCode: stationCode, status: 'at sStation', 'statusUpdateTime.0': { $gte: startOfYear, $lte: endOfYear } })
            .then(_YearCustomerReceivedCount => {
                yearCustomerReceivedCount = _YearCustomerReceivedCount;
                console.log(_YearCustomerReceivedCount);
            })

        //do nhận về từ điểm tập kết
        let stationYearWarehouseReceivedCount = 0;
        let P2 = Post.countDocuments({ receiverStationCode: stationCode, status: 'at rStation', 'statusUpdateTime.6': { $gte: startOfYear, $lte: endOfYear } })
            .then(_stationYearWarehouseReceivedCount => {
                stationYearWarehouseReceivedCount = _stationYearWarehouseReceivedCount;
                console.log(_stationYearWarehouseReceivedCount);
            })


        // Đếm số hàng ra trong ngày tại điểm giao dịch

        //gửi đi điểm tập kết
        let stationYearSendtoWarehouseCount = 0;
        let P3 = Post.countDocuments({ senderStationCode: stationCode, status: 'on way to sWarehouse', 'statusUpdateTime.1': { $gte: startOfYear, $lte: endOfYear } })
            .then(_stationYearSendtoWarehouseCount => {
                stationYearSendtoWarehouseCount = _stationYearSendtoWarehouseCount;
                console.log(_stationYearSendtoWarehouseCount);
            })
        //giao cho khách
        let yearSentToCustomerCount = 0;
        let P4 = Post.countDocuments({ receiverStationCode: stationCode, status: 'on way to reveiver', 'statusUpdateTime.7': { $gte: startOfYear, $lte: endOfYear } })
            .then(_YearSentToCustomerCount => {
                yearSentToCustomerCount += _YearSentToCustomerCount;
                console.log(_YearSentToCustomerCount);
            })



        //thống kê hàng gửi thành công/không thành công
        let postSuccess = 0;
        let postFail = 0;
        let code = 4;

        //giao thành công
        let P5 = Post.countDocuments({ receiverStationCode: stationCode, status: 'received', 'statusUpdateTime.8': { $gte: startOfYear, $lte: endOfYear } })
            .then(count1 => {
                postSuccess = count1;
            })
        //giao thành công
        let P6 = Post.countDocuments({ receiverStationCode: stationCode, status: 'returned', 'statusUpdateTime.9': { $gte: startOfYear, $lte: endOfYear } })
            .then(count2 => {
                postFail = count2;
            })

        Promise.all([P1, P2, P3, P4, P5, P6])
            .then(result => {
                yearInCount = yearCustomerReceivedCount + stationYearWarehouseReceivedCount

                yearOutCount = yearSentToCustomerCount + stationYearSendtoWarehouseCount;

                res.render('statistic/statistic_stationAd', {
                    title: "Thống kê tại điểm giao dịch theo năm",
                    stationCode,
                    startOfYear,
                    endOfYear,
                    yearInCount,
                    yearOutCount,
                    yearCustomerReceivedCount,
                    stationYearWarehouseReceivedCount,
                    stationYearSendtoWarehouseCount,
                    yearSentToCustomerCount,
                    code,
                    postSuccess,
                    postFail,
                    weekInCount: false,
                    monthInCount: false,
                    dailyInCount: false,

                });
            })
    }
    //-----------------------------
    //-------------------------------------------------------------------
    //Quản lý warehouse theo ngày DONEE
    getStatisticDailyWarehouse(req, res) {

        const warehouseCode = req.params.warehouseCode;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let dailyInCount = 0;
        let dailyOutCount = 0;

        console.log(warehouseCode)


        // Đếm số hàng vào trong ngày tại điểm tập kết


        let warehouseDailyWarehouseReceivedCount = 0;
        let P1 = Post.countDocuments({ receiverWarehouseCode: warehouseCode, status: 'at rWarehouse', 'statusUpdateTime.4': { $gte: today, $lte: tomorrow } })
            .then(_warehouseDailyWarehouseReceivedCount => {
                warehouseDailyWarehouseReceivedCount = _warehouseDailyWarehouseReceivedCount;
                console.log(_warehouseDailyWarehouseReceivedCount);
                dailyInCount = warehouseDailyWarehouseReceivedCount
            })



        // Đếm số hàng ra trong ngày tại điểm tập kết

        //gửi đi điểm giao dịch
        let warehouseDailySendtoStationCount = 0;
        let P2 = Post.countDocuments({ senderWarehouseCode: warehouseCode, status: 'on way to rWarehouse', 'statusUpdateTime.3': { $gte: today, $lte: tomorrow } })
            .then(_warehouseDailySendtoWarehouseCount => {
                warehouseDailySendtoStationCount = _warehouseDailySendtoWarehouseCount;
                console.log(_warehouseDailySendtoWarehouseCount);
                dailyOutCount = warehouseDailySendtoStationCount;
            })



        Promise.all([P1, P2])
            .then(result => {
                res.render('statistic/statistic_warehouseAd', {
                    message: "bodyManagerWarehouse",
                    title: "Thống kê tại điểm tập kết theo ngày",
                    warehouseCode,
                    today,
                    tomorrow,
                    dailyInCount,
                    dailyOutCount,
                    weekInCount: false,
                    monthInCount: false,
                    yearInCount: false,

                });
            })
    }

    //---------------------------
    //Quản lý warehouse theo tháng DONEE
    getStatisticMonthWarehouse(req, res) {

        const warehouseCode = req.params.warehouseCode;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const endOfMonth = new Date();
        endOfMonth.setMonth(startOfMonth.getMonth() + 1);

        let monthInCount = 0;
        let monthOutCount = 0;


        // Đếm số hàng vào trong tháng tại điểm giao dịch

        //gửi đi điểm giao dịch
        let warehouseMonthWarehouseReceivedCount = 0;
        let P1 = Post.countDocuments({ receiverWarehouseCode: warehouseCode, status: 'at rWarehouse', 'statusUpdateTime.4': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_warehouseMonthWarehouseReceivedCount => {
                warehouseMonthWarehouseReceivedCount = _warehouseMonthWarehouseReceivedCount;
                console.log(_warehouseMonthWarehouseReceivedCount);
                monthInCount = warehouseMonthWarehouseReceivedCount;
            })


        // Đếm số hàng ra trong tháng tại điểm giao dịch

        //gửi đi điểm giao dịch
        let warehouseMonthSendtoStationCount = 0;
        let P2 = Post.countDocuments({ senderWarehouseCode: warehouseCode, status: 'on way to rWarehouse', 'statusUpdateTime.3': { $gte: startOfMonth, $lte: endOfMonth } })
            .then(_warehouseMonthSendtoStationCount => {
                warehouseMonthSendtoStationCount += _warehouseMonthSendtoStationCount;
                console.log(_warehouseMonthSendtoStationCount);
                monthOutCount = warehouseMonthSendtoStationCount;
            })


        Promise.all([P1, P2])
            .then(result => {
                res.render('statistic/statistic_warehouseAd', {
                    message: "bodyManagerWarehouse",
                    title: "Thống kê tại điểm tập kết theo tháng",
                    warehouseCode,
                    startOfMonth,
                    endOfMonth,
                    dailyInCount: false,
                    weekInCount: false,
                    monthInCount,
                    monthOutCount,
                    yearInCount: false,
                });
            })
    }

    //Quản lý warehouse theo tuần DONEE
    getStatisticWeekWarehouse(req, res) {

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setUTCHours(0, 0, 0, 0);
        startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        let weekInCount = 0;
        let weekOutCount = 0;

        const warehouseCode = req.params.warehouseCode;



        // Đếm số hàng vào trong tuần tại điểm tập kết
        let warehouseWeekWarehouseReceivedCount = 0;
        let P1 = Post.countDocuments({ receiverWarehouseCode: warehouseCode, status: 'at rWarehouse', 'statusUpdateTime.4': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_warehouseWeekWarehouseReceivedCount => {
                warehouseWeekWarehouseReceivedCount = _warehouseWeekWarehouseReceivedCount;
                console.log(_warehouseWeekWarehouseReceivedCount);
                weekInCount = warehouseWeekWarehouseReceivedCount;

            })



        // Đếm số hàng ra trong ngày tại điểm giao dịch

        //gửi đi điểm giao dịch
        let warehouseDailySendtoStationCount = 0;
        let P2 = Post.countDocuments({ senderWarehouseCode: warehouseCode, status: 'on way to rWarehouse', 'statusUpdateTime.3': { $gte: startOfWeek, $lte: endOfWeek } })
            .then(_warehouseDailySendtoWarehouseCount => {
                warehouseDailySendtoStationCount = _warehouseDailySendtoWarehouseCount;
                console.log(_warehouseDailySendtoWarehouseCount);
                weekOutCount = warehouseDailySendtoStationCount;
            })



        //thống kê hàng gửi thành công/không thành công

        Promise.all([P1, P2])
            .then(result => {
                res.render('statistic/statistic_warehouseAd', {
                    message: "bodyManagerWarehouse",
                    title: "Thống kê tại điểm tập kết theo tuần",
                    warehouseCode,
                    startOfWeek,
                    endOfWeek,
                    weekInCount,
                    weekOutCount,
                    dailyInCount: false,
                    monthInCount: false,
                    yearInCount: false,

                });
            })
    }

    //Quản lý warehouse theo năm DONEE
    getStatisticYearWarehouse(req, res) {

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);

        let yearInCount = 0;
        let yearOutCount = 0;

        const warehouseCode = req.params.warehouseCode;

        // Đếm số hàng vào trong năm 


        let yearCustomerReceivedCount = 0;
        let P1 = Post.countDocuments({ receiverWarehouseCode: warehouseCode, status: 'at sWarehouse', 'statusUpdateTime.4': { $gte: startOfYear, $lte: endOfYear } })
            .then(_yearCustomerReceivedCount => {
                yearCustomerReceivedCount = _yearCustomerReceivedCount;
                console.log(_yearCustomerReceivedCount);
                yearInCount = yearCustomerReceivedCount
            })



        // Đếm số hàng ra 


        let yearSentToCustomerCount = 0;
        let P2 = Post.countDocuments({ senderWarehouseCode: warehouseCode, status: 'on way to rWarehouse', 'statusUpdateTime.3': { $gte: startOfYear, $lte: endOfYear } })
            .then(_yearSentToCustomerCount => {
                yearSentToCustomerCount += _yearSentToCustomerCount;
                console.log(_yearSentToCustomerCount);
                yearOutCount = yearSentToCustomerCount;
            })



        Promise.all([P1, P2])
            .then(result => {


                res.render('statistic/statistic_warehouseAd', {
                    message: "bodyManagerWarehouse",
                    title: "Thống kê tại điểm tập kết theo năm",
                    warehouseCode,
                    startOfYear,
                    endOfYear,
                    yearInCount,
                    yearOutCount,
                    weekInCount: false,
                    monthInCount: false,
                    dailyInCount: false,

                });
            })
    }

}
module.exports = new StatisticController;