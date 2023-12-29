const User = require('../models/User');
const Employee = require('../models/Employee')
const Station = require('../models/Station')
const Post = require('../models/Post');

const { multipleMongooseToObject } = require('../util/mongoose');
const { mongooseToObject } = require('../util/mongoose');
const Warehouse = require('../models/Warehouse');

class ManagerController {

    getLogin(req, res) {
        res.render('login');
    }

    getMaps(req, res) {
        res.render('map');
    }

    getPriceList(req, res) {
        res.render('home_page/priceList')
    }
    getRecruitment(req, res) {
        res.render('home_page/recruitment')
    }
    getServiceHome(req, res) {
        res.render('home_page/service')
    }
    getQRCode(req, res) {
        // const newPostData = req.body;

        // // Gọi phương thức tạo mã QR từ mô hình Post
        // const createdPost = await Post.createQRCodeForNewPost(newPostData);

        // Trả về thông tin mã QR cho client
        res.json({
            qrcodeContent: createdPost.qrcodeContent,
        });
    }

    getSearchStation(req, res) {
        res.render('searchStation');
    }
    postSearchStation(req, res) {
        const address = req.body.stationProvince;
        console.log("postS0" + req.body)
        console.log("postS" + req.body.stationProvince);
        console.log("postS" + address);

        Station.find({ address: address })
            .then(stations => {
                console.log("find" + address + "+" + stations)
                if (!stations || stations.length === 0) {
                    return res.json({
                        message: 'Magic post hiện chưa có bưu cục nào ở vị trí này!'
                    });
                }

                const result = stations.map(station => ({
                    name: station.name,
                    stationCode: station.stationCode,
                    detailAddress: station.detailAddress
                }));

                return res.json(result);
            })
            .catch(error => {
                console.error('Lỗi truy vấn database:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });

    }

    loginValidate(req, res, next) {
        if (!req.body.username)
            return res.json({
                loginSuccess: false,
                message: 'Chưa nhập tên đăng nhập'
            });
        if (!req.body.password)
            return res.json({
                loginSuccess: false,
                message: 'Chưa nhập mật khẩu'
            });
        next();
    }

    postLogin(req, res, next) {
        const formData = req.body;

        // Create promises
        const findEmployeePromise = Employee.findOne(formData).exec();

        console.log("formData", formData);

        // Use Promise.all with an array of promises
        Promise.all([findEmployeePromise])
            .then(([employee]) => {
                if (!employee) {
                    return res.json({
                        loginSuccess: false,
                        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
                    });
                }

                const findStationPromise = Station.findOne({ address: employee.workAddress }).exec();
                const findWareHousePromise = Warehouse.findOne({ address: employee.workAddress }).exec();

                Promise.all([findStationPromise, findWareHousePromise])
                    .then(([station, warehouse]) => {
                        console.log("employee:", employee);
                        console.log("station", station);
                        console.log("warehouse", warehouse);

                        req.session.regenerate(err => {
                            if (err) return next(err);

                            req.session.employee = mongooseToObject(employee);
                            // StationE', 'StationAd', 'WarehouseAd', "WarehouseE", 'Manager'
                            req.session.station = mongooseToObject(station);
                            if (employee.role === 'WarehouseAd' || employee.role === 'WarehouseE') {
                                req.session.station = mongooseToObject(warehouse);
                            }

                            req.session.save(err => {
                                if (err) return next(err);

                                let response = {
                                    loginSuccess: true,
                                    message: 'Đăng nhập thành công'
                                };

                                if (employee.role === 'StationE') {
                                    response.stationE = 'yes';
                                } else if (employee.role === 'WarehouseE') {
                                    response.warehouseE = 'yes';
                                }

                                res.json(response);
                            });
                        });
                    })
                    .catch(next);
            })
            .catch(next);
    }


    // postLogin(req, res, next) {
    //     const formData = req.body;
    //     // console.log(formData)
    //     Promise.all(Employee.findOne(formData), Station.findOne({address: formData.workAddress}))
    //         .then(([employee, station]) => {
    //             if (!employee) {
    //                 // console.log("success")
    //                 return res.json({
    //                     loginSuccess: false,
    //                     message: 'Tên đăng nhập hoặc mật khẩu không đúng'
    //                 });
    //             }
    //             // console.log("error"),
    //             req.session.regenerate(err => {
    //                 if (err) return err;
    //                 req.session.employee = mongooseToObject(employee);
    //                 req.session.station = mongooseToObject(station);
    //                 req.session.save(err => {
    //                     if (err) return err;
    //                     if (employee.role === "StationE") {
    //                         res.json({
    //                             loginSuccess: true,
    //                             message: 'Đăng nhập thành công',
    //                             stationE: 'yes'
    //                         });
    //                     } else if (employee.role === "WarehouseE") {
    //                         res.json({
    //                             loginSuccess: true,
    //                             message: 'Đăng nhập thành công',
    //                             warehouseE: 'yes'
    //                         });
    //                     } else {
    //                         res.json({
    //                             loginSuccess: true,
    //                             message: 'Đăng nhập thành công',
    //                         });
    //                     }

    //                 });
    //             });
    //         })
    //         .catch(next);
    // }

    getHome(req, res) {
        Employee.findOne({ _id: '65599ec015476e96d3c953ff' })
            .then((result) => {
                console.log(result);
                console.log('success to find');
                // Handle the query result here
            })
            .catch((error) => {
                res.json(error);
                // Handle any errors here
            });


        // // User.find({}, function (err, users){
        // //     if(!err) res.json(users)
        // //     else res.json('error')
        // // })
        // // res.json('hallo');
        res.render('home');
    }



    getSearch(req, res) {
        res.render('search');
    }

    getAdmin(req, res) {
        res.render('admin');
    }

    getRegister(req, res) {
        res.render('register', {
            employee: req.session.employee,
            station: req.session.station,
        });
    }

    registerValidate(req, res, next) {
        console.log('req.body:', req.body);  // Add this line for debugging
        for (var key in req.body)
            if (!req.body[key]) return res.json({
                registerSuccess: false,
                message: 'Vui lòng nhập đầy đủ thông tin'
            });

        // Check if both password and retype exist before comparing
        if (req.body.password && req.body.password !== req.body.retype) {
            return res.json({
                registerSuccess: false,
                message: 'Mật khẩu nhập không khớp'
            });
        }

        next();
    }

    postRegister(req, res, next) {
        const { retype, ...formData } = req.body;
        Promise.all([Employee.findOne({ username: formData.username }), Employee.find({ workAddress: formData.workAddress, role: formData.role }).countDocuments()])
            .then(([employee, countEmployee]) => {
                if (employee) return res.json({
                    registerSuccess: false,
                    message: 'Tên đăng nhập đã tồn tại'
                });

                const userRole = req.session.employee.role;
                if (userRole == 'Manager' && countEmployee > 0) return res.json({
                    registerSuccess: false,
                    message: 'Chức vụ này đã có người nắm giữ'
                });

                const employeeCreate = new Employee(formData);
                employeeCreate.save();
                res.json({
                    registerSuccess: true,
                    message: 'Đăng kí tài khoản thành công'
                });
            })
            .catch(next);
    }

    getProfile(req, res) {
        res.render('profile/view', {
            employee: req.session.employee,
            station: req.session.station,
        });
        // console.log(req.session.employee)
    }

    getEmployeeProfile(req, res, next) {
        // Employee.findById({ _id: req.params.id })
        console.log(req.params.id)
        Employee.findById(req.params.id).lean()
            .then(employee2 => {
                res.render('supervisor/viewEmployeeProfile', {
                    employee: req.session.employee,
                    employee2: employee2,
                    station: req.session.station,
                })
            })
            .catch(next)
    }

    getForgotPassword(req, res) {
        res.render('forgotPassword');
    }

    humanResource(req, res, next) {
        try {
            // res.render('supervisor/humanResource')
            // console.log(Employee.countDocumentsDeleted())
            // res.render(Employee.countDocumentsDeleted())

            // const userRole = req.session.employee.role;
            // if (userRole == 'Manager') {

            const userRole = req.session.employee.role;
            const userWorkPlace = req.session.employee.workAddress;
            if (userRole == 'Manager') {
                Promise.all([Employee.find({ role: { $in: ['StationAd', 'WarehouseAd'] } }), Employee.find({ deleted: true, role: { $in: ['StationAd', 'WarehouseAd'] } }).countDocuments()])
                    .then(
                        ([employees, deleteCount]) => {


                            res.render('supervisor/humanResource', {
                                employee: req.session.employee,
                                station: req.session.station,
                                deleteCount,
                                employees: multipleMongooseToObject(employees)
                            })
                            console.log("employee:", employees)
                        }
                    )
                    .catch(next)
            } else if (userRole == 'StationAd') {

                Promise.all([Employee.find({ role: { $in: ['StationE'] }, workAddress: userWorkPlace }), Employee.find({ deleted: true, role: { $in: ['StationE'] } }).countDocuments()])
                    .then(
                        ([employees, deleteCount]) => {


                            res.render('supervisor/humanResource', {
                                employee: req.session.employee,
                                station: req.session.station,
                                deleteCount,
                                employees: multipleMongooseToObject(employees)
                            })
                            console.log("employee:", employees)
                        }
                    )
                    .catch(next)

            } else if (userRole == 'WarehouseAd') {
                Promise.all([Employee.find({ role: { $in: ['WarehouseE'] }, workAddress: userWorkPlace }), Employee.find({ deleted: true, role: { $in: ['WarehouseE'] } }).countDocuments()])
                    .then(
                        ([employees, deleteCount]) => {


                            res.render('supervisor/humanResource', {
                                employee: req.session.employee,
                                station: req.session.station,
                                deleteCount,
                                employees: multipleMongooseToObject(employees)
                            })
                            console.log("employee:", employees)
                        }
                    )
                    .catch(next)
            }
            else {
                res.json('Bạn không có quyền truy cập chức năng này');
            }
        } catch (e) {
            res.render('error');
        }
    }

    oldHR(req, res, next) {
        try {
            const userRole = req.session.employee.role;
            if (userRole == 'Manager') {
                Employee.findDeleted({ role: { $in: ['StationAd', 'WarehouseAd'] } })
                    .then((employees) =>
                        res.render('supervisor/oldHR', {
                            employee: req.session.employee,
                            station: req.session.station,
                            employees: multipleMongooseToObject(employees),
                        }),
                    )
                    .catch(next)
            } else if (userRole == 'StationAd') {
                Employee.findDeleted({ role: { $in: ['StationE'] } })
                    .then((employees) =>
                        res.render('supervisor/oldHR', {
                            employee: req.session.employee,
                            station: req.session.station,
                            employees: multipleMongooseToObject(employees),
                        }),
                    )
                    .catch(next)

            } else if (userRole == 'WarehouseAd') {
                Employee.findDeleted({ role: { $in: ['WarehouseE'] } })
                    .then((employees) =>
                        res.render('supervisor/oldHR', {
                            employee: req.session.employee,
                            station: req.session.station,
                            employees: multipleMongooseToObject(employees),
                        }),
                    )
                    .catch(next)

            }
            else {
                res.json('Bạn không có quyền truy cập chức năng này')
            }
        } catch (e) {
            res.render('error');
        }
    }

    edit(req, res, next) {
        try {
            const userRole = req.session.employee.role;
            if (userRole != 'Manager') {
                res.json('Bạn không có quyền truy cập chức năng này');
                return;
            }

            Employee.findById(req.params.id)
                .then(employee => res.render('profile/edit', {
                    employee: mongooseToObject(employee)
                }))
                .catch(next);
        } catch (e) {
            res.render('error')
        }
    }

    update(req, res, next) {
        try {
            const userRole = req.session.employee.role;
            if (userRole != 'Manager') {
                res.json('Bạn không có quyền truy cập chức năng này');
                return;
            }

            Employee.updateOne({ _id: req.params.id }, req.body)
                .then(() => res.redirect('supervisor/humanResource'))
                .catch(next);
        } catch (e) {
            res.render('error')
        }

    }

    destroy(req, res, next) {
        try {
            const userRole = req.session.employee.role;
            if (userRole != 'Manager') {
                res.json('Bạn không có quyền truy cập chức năng này')
                return;
            }

            /*sofe delete*/
            Employee.delete({ _id: req.params.id })
                .then(() => res.redirect('back'))
                .catch(next);
        } catch (e) {
            res.render('error');
        }
    }

    //DELETE /employee/:id/force
    forceDestroy(req, res, next) {
        try {
            const userRole = req.session.employee.role;
            if (userRole != 'Manager') {
                res.json('Bạn không có quyền truy cập chức năng này');
                return;
            }

            Employee.deleteOne({ _id: req.params.id })
                .then(() => res.redirect('back'))
                .catch(next);
        } catch (e) {
            res.render('error')
        }
    }

    restore(req, res, next) {
        try {
            const userRole = req.session.employee.role;
            if (userRole != 'Manager') {
                res.json('Bạn không có quyền truy cập chức năng này');
                return;
            }
            Employee.restore({ _id: req.params.id })
                .then(() => res.redirect('back'))
                .catch(next);
        } catch (e) {
            res.render('error')
        }

    }

    handleFormActions(req, res, next) {
        try {
            // const userRole = req.session.user.role;
            // if (userRole != 'Manager') {
            //     res.json('Bạn không có quyền truy cập chức năng này');
            //     return;
            // }

            switch (req.body.action) {
                case 'delete':
                    Employee.delete({ _id: { $in: req.body.employeeIds } })
                        .then(() => res.redirect('back'))
                        .catch(next);
                    break;
                default:
                    res.json({ message: 'Tính năng chưa được mở khóa' });
            }
        } catch (e) {
            res.render(e.message)
        }
    }

    // handleFormActions(req, res, next) {
    //     try {
    //         // const userRole = req.session.user.role;
    //         // if (userRole != 'Manager') {
    //         //     res.json('Bạn không có quyền truy cập chức năng này');
    //         //     return;
    //         // }

    //         switch (req.body.action) {
    //             case 'delete':
    //                 console.log("mannyId", req.body)
    //                 Employee.updateMany(
    //                     { _id: { $in: req.body.employeeIds } },
    //                     { $set: { deleted: true } }
    //                 )
    //                     .then(() => res.redirect('back'))
    //                     .catch(next);
    //                 break;
    //             default:
    //                 return res.json({ message: 'Tính năng chưa được mở khóa' });
    //         }
    //     } catch (e) {
    //         res.render(e.message)
    //     }
    // }   


    postReceipt(req, res, next) {
        const { retype, ...formData } = req.body;
        try {
            // console.log(formData);
            const postCreate = new Post(formData);
            postCreate.save();

            //console.log(postCreate);
            res.render('receipt', {
                post: mongooseToObject(postCreate)
            })

        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    getCreateReceipt(req, res, next) {
        res.render('createReceipt');
    }




    getAddWarehouse(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'Manager') {
            const employee = req.session.employee;
            res.render('manage_warehouse/add_warehouse', {
                employee,
                station: req.session.station,
            })
        } else {
            res.json('Bạn không có quyền truy cập chức năng này');
        }
    }

    postAddWarehouse(req, res, next) {
        const newWarehouse = new Warehouse({
            warehouseCode: req.body.warehouseCode,
            name: req.body.name,
            address: req.body.address,
            detailAddress: req.body.detailAddress
        });
        newWarehouse.save()
            .then(() => res.json({
                message: 'Tạo điểm tập kết mới thành công'
            }))
            .catch(next);
    }

    getAddStation(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'Manager') {
            const employee = req.session.employee;
            res.render('manage_station/add_station', {
                employee,
                station: req.session.station,
            })
        } else {
            res.json('Bạn không có quyền truy cập chức năng này');
        }
    }

    postAddStation(req, res, next) {
        const newStation = new Station({
            stationCode: req.body.stationCode,
            name: req.body.name,
            address: req.body.address,
            detailAddress: req.body.detailAddress,
            warehouseId: req.body.warehouseId
        });
        newStation.save()
            .then(() => res.json({
                message: 'Tạo điểm giao dịch mới thành công'
            }))
            .catch(next);
    }

    getViewWarehouses(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'Manager') {
            const employee = req.session.employee;
            Warehouse.find({}).lean().then((warehouses) => {
                if (warehouses) {
                    const countStationsEachWarehouse = {};
                    for (const warehouse of warehouses) {

                        Station.find({ warehouseId: warehouse.warehouseCode }).lean().then((stations) => {
                            let numOfStations = 0;
                            for (const station of stations) {
                                numOfStations++;
                            }
                            countStationsEachWarehouse[warehouse.warehouseCode] = numOfStations;

                        })
                    }
                    res.render('manage_warehouse/view_warehouses', {
                        warehouses,
                        countStationsEachWarehouse,
                        employee,
                        station: req.session.station,
                    })

                } else {
                    res.render('manage_warehouse/view_warehouses', {
                        employee,
                        station: req.session.station,
                    })
                }
            }).catch(next)
        } else {
            res.json('Bạn không có quyền truy cập chức năng này');
        }
    }

    getViewStationsOfWh(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'Manager') {
            const employee = req.session.employee;
            Warehouse.findOne({ warehouseCode: req.params.warehouseCode }).lean().then((warehouse) => {
                Station.find({ warehouseId: req.params.warehouseCode }).lean().then((stations) => {
                    if (stations) {

                        res.render('manage_station/view_stations_of_wh', {
                            stations,
                            warehouse,
                            employee,
                            station: req.session.station,
                        })


                    } else {
                        res.render('manage_station/view_stations_of_wh', {
                            warehouse,
                            employee,
                            station: req.session.station,
                        })
                    }
                })
            }).catch(next)
        } else {
            res.json('Bạn không có quyền truy cập chức năng này');
        }
    }

    getUpdateWarehouse(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'Manager') {
            const employee = req.session.employee;
            Warehouse.findOne({ warehouseCode: req.params.warehouseCode }).lean().then((warehouse) => {
                res.render('manage_warehouse/update_warehouse', {
                    warehouse,
                    employee,
                    station: req.session.station,
                })
            }).catch(next)
        } else {
            res.json('Bạn không có quyền truy cập chức năng này');
        }
    }

    postUpdateWarehouse(req, res, next) {
        Warehouse.findOneAndUpdate({ warehouseCode: req.body.oldWarehouseCode },
            {
                warehouseCode: req.body.warehouseCode,
                name: req.body.name,
                address: req.body.address,
                detailAddress: req.body.detailAddress
            }).lean().then((warehouse) => {
                if (req.body.address !== req.body.oldAddress) {
                    Employee.updateMany({ workAddress: req.body.oldAddress, role: 'WarehouseE' }, { workAddress: req.body.address }).then(() => { });

                }

                if (req.body.warehouseCode !== req.body.oldWarehouseCode) {
                    Post.updateMany({ receiverWarehouseCode: req.body.oldWarehouseCode }, { receiverWarehouseCode: req.body.warehouseCode }).then(() => { });
                    Post.updateMany({ senderWarehouseCode: req.body.oldWarehouseCode }, { senderWarehouseCode: req.body.stationCode }).then(() => { });
                    Station.updateMany({ warehouseId: req.body.oldWarehouseCode }, { warehouseId: req.body.warehouseCode })
                }


                console.log(req.body)
                console.log(warehouse)
                res.json({
                    message: 'Cập nhật thành công'
                })

            }).catch(next);
    }

    getUpdateStation(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'Manager') {
            const employee = req.session.employee;
            Station.findOne({ stationCode: req.params.stationCode }).lean().then((stations) => {
                Warehouse.findOne({ warehouseCode: stations.warehouseId }).lean().then((warehouse) => {
                    if (warehouse) {
                        res.render('manage_station/update_station', {
                            stations,
                            warehouse,
                            employee,
                            station: req.session.station,

                        })
                    } else {
                        res.render('manage_station/update_station', {
                            stations,
                            employee,
                            station: req.session.station,
                        })
                    }

                })
            }).catch(next)
        } else {
            res.json('Bạn không có quyền truy cập chức năng này');
        }
    }

    postUpdateStation(req, res, next) {
        Station.findOneAndUpdate({ stationCode: req.body.oldStationCode },
            {

                stationCode: req.body.stationCode,
                name: req.body.name,
                address: req.body.address,
                detailAddress: req.body.detailAddress
            }).lean().then((station) => {
                if (req.body.address !== req.body.oldAddress) {
                    Employee.updateMany({ workAddress: req.body.oldAddress, role: 'StationE' }, { workAddress: req.body.address }).then(() => { });

                }

                if (req.body.stationCode !== req.body.oldStationCode) {
                    Post.updateMany({ receiverStationCode: req.body.oldStationCode }, { receiverStationCode: req.body.stationCode }).then(() => { });
                    Post.updateMany({ senderStationCode: req.body.oldStationCode }, { senderStationCode: req.body.stationCode }).then(() => { });
                }

                console.log(req.body)
                console.log(station)
                res.json({
                    message: 'Cập nhật thành công'
                })


            }).catch(next);
    }

    getViewStations(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'Manager') {
            const employee = req.session.employee;
            Station.find({}).lean().then((stations) => {
                if (stations) {
                    const warehouseStationBelongTo = {};
                    for (const station of stations) {

                        Warehouse.findOne({ warehouseCode: station.warehouseId }).lean().then((warehouse) => {
                            if (warehouse) {
                                warehouseStationBelongTo[station.stationCode] = warehouse.name;
                            }

                        })
                    }
                    res.render('manage_station/view_stations', {
                        stations,
                        warehouseStationBelongTo,
                        employee,
                        station: req.session.station,
                    })

                } else {
                    res.render('manage_station/view_stations', {
                        employee,
                        station: req.session.station,
                    })
                }


            }).catch(next)
        } else {
            res.json('Bạn không có quyền truy cập chức năng này');
        }
    }
}

module.exports = new ManagerController;