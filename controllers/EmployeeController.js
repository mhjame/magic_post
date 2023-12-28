const Post = require('../models/Post');
const Container = require('../models/Container');
const Employee = require('../models/Employee');
const Station = require('../models/Station');
const Warehouse = require('../models/Warehouse');



class EmployeeController {


    createShipStationToWarehouse(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'StationE') {
            Employee.findOne({ _id: req.session.employee._id }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;

                    } else {
                        Station.findOne({ address: employee.workAddress }).lean()
                            .then((station) => {
                                if (!station) {
                                    res.status(404).send({ message: 'Station not found' });
                                    return;
                                }
                                Warehouse.findOne({ warehouseCode: station.warehouseId }).lean()
                                    .then((warehouse) => {
                                        if (!warehouse) {
                                            res.status(404).send({ message: 'Warehouse not found' });
                                            return;
                                        }

                                        Post.find({ senderStationId: station.stationCode, status: 'at sStation' }).lean()
                                            .then((posts) => {
                                                res.render('create_order/create_station_to_wh', {
                                                    employee: employee,
                                                    workPlace: station,
                                                    desWarehouse: warehouse,
                                                    posts: posts,
                                                    noHeader: 'yes'
                                                });
                                            })


                                    })


                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này')
        }
    }

    createStationToWhOrderForm(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'StationE') {
            const employeeId = req.body.employeeId;
            const employeeName = req.body.employeeName;
            const senderStationId = req.body.senderStationId;
            const senderStationName = req.body.senderStationName;
            const senderWarehouseId = req.body.senderWarehouseId;
            const senderWarehouseName = req.body.senderWarehouseName;
            const postIds = req.body.postIds;
            let postIdsLength = 1;
            let isArray = false;
            const containerCode = senderStationId + senderWarehouseId + Date.now().toString().slice(-5) + Math.random().toString(16).slice(-7);
            console.log(Date.now().toString().slice(-5));
            console.log(Math.random().toString(16).slice(-7));
            if (Array.isArray(postIds)) {
                postIdsLength = postIds.length;
                isArray = true;
            }

            res.render('create_order/create_station_to_wh_order_form', {
                employeeId,
                employeeName,
                senderStationId,
                senderStationName,
                senderWarehouseId,
                senderWarehouseName,
                postIds,
                postIdsLength,
                containerCode,
                isArray,

                noHeader: 'yes'
            });
        } else {
            res.json('Bạn không có quyền truy cập chức năng này')
        }

    }

    postShipStationToWarehouseOrder(req, res, next) {

        const postIds = req.body.postIds;
        console.log(req.body)
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ _id: postIds[i], status: 'at sStation' }, { status: 'on way to sWarehouse' }).then((post) => {
                    if (post) {
                        post.statusUpdateTime[1] = new Date();
                        post.save();
                    }
                });
            };
        } else {
            Post.findOneAndUpdate({ _id: postIds, status: 'at sStation' }, { status: 'on way to sWarehouse' }).then((post) => {
                if (post) {
                    post.statusUpdateTime[1] = new Date();
                    post.save();
                    console.log(post.statusUpdateTime);
                }
            });
        }

        const container = new Container({
            employeeId: req.body.employeeId,
            type: req.body.typeOfOrder,
            status: 'in process',
            receiverAddressId: req.body.receiverAddressId,
            senderAddressId: req.body.senderAddressId,
            postIds: req.body.postIds,
            containerCode: req.body.containerCode
        });
        container.save()
            .then(() => res.json({
                message: 'Tạo đơn thành công'
            }))
            .catch(next);
    }

    getDesWarehouses(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'WarehouseE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;

                    } else {


                        Warehouse.findOne({ address: employee.workAddress }).lean()
                            .then((warehouse) => {
                                if (!warehouse) {
                                    res.status(404).send({ message: 'Warehouse not found' });
                                    return;
                                }
                                Warehouse.find({}).lean()
                                    .then((desWarehouses) => {
                                        const totalPostsFromWarehouse = {};
                                        const desWarehousesHavePosts = [];
                                        for (const desWarehouse of desWarehouses) {
                                            const desWarehouseId = desWarehouse.warehouseCode;
                                            Post.find({ senderWarehouseId: warehouse.warehouseCode, receiverWarehouseId: desWarehouseId, status: 'at sWarehouse' }).lean()
                                                .then((posts) => {
                                                    if (posts.length !== 0) {
                                                        totalPostsFromWarehouse[desWarehouseId] = posts.length;
                                                        desWarehousesHavePosts.push(desWarehouse);
                                                        console.log(totalPostsFromWarehouse);
                                                    }
                                                })
                                        }


                                        res.render('create_order/get_des_warehouses', {
                                            thisWarehouse: warehouse,
                                            desWarehousesHavePosts,
                                            totalPostsFromWarehouse,

                                            workPlace: warehouse,
                                            employee,
                                            noHeader: 'yes'
                                        });

                                    })
                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này')
        }
    }

    createShipWarehouseToWarehouse(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'WarehouseE') {

            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;

                    } else {
                        Warehouse.findOne({ address: employee.workAddress }).lean()
                            .then((warehouse) => {
                                if (!warehouse) {
                                    res.status(404).send({ message: 'Warehouse not found' });
                                    return;
                                }
                                Warehouse.findOne({ warehouseCode: req.params.desWarehouseId }).lean()
                                    .then((desWarehouse) => {
                                        Post.find({ senderWarehouseId: warehouse.warehouseCode, receiverWarehouseId: desWarehouse.warehouseCode, status: 'at sWarehouse' }).lean()
                                            .then((posts) => {

                                                res.render('create_order/create_wh_to_wh', {
                                                    employee: employee,
                                                    workPlace: warehouse,
                                                    desWarehouse,
                                                    posts,
                                                    noHeader: 'yes'
                                                });

                                            })
                                    })

                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này')
        }
    }

    createWhToWhOrderForm(req, res, next) {
        const employeeId = req.body.employeeId;
        const employeeName = req.body.employeeName;
        const senderWarehouseId = req.body.senderWarehouseId;
        const senderWarehouseName = req.body.senderWarehouseName;
        const receiverWarehouseId = req.body.receiverWarehouseId;
        const receiverWarehouseName = req.body.receiverWarehouseName;
        const postIds = req.body.postIds;
        let postIdsLength = 1;
        let isArray = false;
        const containerCode = senderWarehouseId + receiverWarehouseId + Date.now().toString().slice(-5) + Math.random().toString(16).slice(-7);
        console.log(Date.now().toString().slice(-5));
        console.log(Math.random().toString(16).slice(-7));
        if (Array.isArray(postIds)) {
            postIdsLength = postIds.length;
            isArray = true;
        }

        res.render('create_order/create_wh_to_wh_order_form', {
            employeeId,
            employeeName,
            senderWarehouseId,
            senderWarehouseName,
            receiverWarehouseId,
            receiverWarehouseName,
            postIds,
            postIdsLength,
            containerCode,
            isArray,

            noHeader: 'yes'
        });

    }

    postShipWarehouseToWarehouseOrder(req, res, next) {
        console.log(req.body)
        const postIds = req.body.postIds;
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ _id: postIds[i], status: 'at sWarehouse' }, { status: 'on way to rWarehouse' }).then((post) => {
                    if (post) {
                        post.statusUpdateTime[3] = new Date();
                        post.save();
                    }
                });

            };
        } else {
            Post.findOneAndUpdate({ _id: postIds, status: 'at sWarehouse' }, { status: 'on way to rWarehouse' }).then((post) => {
                if (post) {
                    post.statusUpdateTime[3] = new Date();
                    post.save();
                }
            });
        }

        const container = new Container({
            employeeId: req.body.employeeId,
            type: req.body.typeOfOrder,
            status: 'in process',
            receiverAddressId: req.body.receiverAddressId,
            senderAddressId: req.body.senderAddressId,
            postIds: req.body.postIds,
            containerCode: req.body.containerCode
        });
        container.save()
            .then(() => res.json({
                message: 'Tạo đơn thành công'
            }))
            .catch(next);
    }

    getDesStations(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'WarehouseE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;

                    } else {


                        Warehouse.findOne({ address: employee.workAddress }).lean()
                            .then((warehouse) => {
                                if (!warehouse) {
                                    res.status(404).send({ message: 'Warehouse not found' });
                                    return;
                                }
                                Station.find({ warehouseId: warehouse.warehouseCode }).lean()
                                    .then((desStations) => {
                                        const totalPostsFromStation = {};
                                        const desStationsHavePosts = [];
                                        for (const desStation of desStations) {
                                            const desStationId = desStation.stationCode;
                                            Post.find({ receiverWarehouseId: warehouse.warehouseCode, receiverStationId: desStationId, status: 'at rWarehouse' }).lean()
                                                .then((posts) => {
                                                    if (posts.length !== 0) {
                                                        totalPostsFromStation[desStationId] = posts.length;
                                                        desStationsHavePosts.push(desStation);
                                                        console.log(totalPostsFromStation);
                                                    }
                                                })
                                        }


                                        res.render('create_order/get_des_stations', {
                                            thisWarehouse: warehouse,
                                            desStationsHavePosts,
                                            totalPostsFromStation,

                                            workPlace: warehouse,
                                            employee,
                                            noHeader: 'yes'
                                        });

                                    })
                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này')
        }
    }



    createShipWarehouseToStation(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'WarehouseE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;
                    } else {
                        Warehouse.findOne({ address: employee.workAddress }).lean()
                            .then((warehouse) => {
                                if (!warehouse) {
                                    res.status(404).send({ message: 'Warehouse not found' });
                                    return;
                                }
                                Station.findOne({ stationCode: req.params.desStationId }).lean()
                                    .then((desStation) => {
                                        Post.find({ receiverWarehouseId: warehouse.warehouseCode, receiverStationId: desStation.stationCode, status: 'at rWarehouse' }).lean()
                                            .then((posts) => {

                                                res.render('create_order/create_wh_to_station', {
                                                    employee,
                                                    workPlace: warehouse,
                                                    desStation,
                                                    posts,
                                                    noHeader: 'yes'
                                                });

                                            })
                                    })

                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này')
        }
    }

    createWhToStationOrderForm(req, res, next) {
        const employeeId = req.body.employeeId;
        const employeeName = req.body.employeeName;
        const receiverWarehouseId = req.body.receiverWarehouseId;
        const receiverWarehouseName = req.body.receiverWarehouseName;
        const receiverStationId = req.body.receiverStationId;
        const receiverStationName = req.body.receiverStationName;
        const postIds = req.body.postIds;
        let postIdsLength = 1;
        let isArray = false;
        const containerCode = receiverWarehouseId + receiverStationId + Date.now().toString().slice(-5) + Math.random().toString(16).slice(-7);
        console.log(Date.now().toString().slice(-5));
        console.log(Math.random().toString(16).slice(-7));
        if (Array.isArray(postIds)) {
            postIdsLength = postIds.length;
            isArray = true;
        }

        res.render('create_order/create_wh_to_station_order_form', {
            employeeId,
            employeeName,
            receiverWarehouseId,
            receiverWarehouseName,
            receiverStationId,
            receiverStationName,
            postIds,
            postIdsLength,
            containerCode,
            isArray,
            noHeader: 'yes'
        });

    }

    postShipWarehouseToStationOrder(req, res, next) {
        console.log(req.body)
        const postIds = req.body.postIds;
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ _id: postIds[i], status: 'at rWarehouse' }, { status: 'on way to rStation' }).then((post) => {
                    if (post) {
                        post.statusUpdateTime[5] = new Date();
                        post.save();
                    }
                });


            };
        } else {
            Post.findOneAndUpdate({ _id: postIds, status: 'at rWarehouse' }, { status: 'on way to rStation' }).then((post) => {
                if (post) {
                    post.statusUpdateTime[5] = new Date();
                    post.save();
                }
            });
        }


        const container = new Container({
            employeeId: req.body.employeeId,
            type: req.body.typeOfOrder,
            status: 'in process',
            receiverAddressId: req.body.receiverAddressId,
            senderAddressId: req.body.senderAddressId,
            postIds: req.body.postIds,
            containerCode: req.body.containerCode
        });
        container.save()
            // .then(() => res.redirect(200, '/create_order/' + req.body.receiverAddressId + '/create_wh_to_station'))
            .then(() => res.json({
                message: 'Tạo đơn thành công'
            }))
            .catch(next);
    }

    createShipStationToReceiver(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'StationE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;
                    } else {
                        Station.findOne({ address: employee.workAddress }).lean()
                            .then((station) => {
                                if (!station) {
                                    res.status(404).send({ message: 'Station not found' });
                                    return;
                                }

                                Post.find({ receiverStationId: station.stationCode, status: 'at rStation' }).lean()
                                    .then((posts) => {
                                        Warehouse.findOne({ warehouseCode: station.warehouseId }).lean().then((warehouse) => {
                                            res.render('create_order/create_station_to_receiver', {
                                                employee,
                                                workPlace: station,
                                                desWarehouse: warehouse,
                                                posts: posts,
                                                noHeader: 'yes'
                                            });
                                        })
                                    })
                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này');
        }
    }

    createStationToReceiverOrderForm(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'StationE') {
            const employeeId = req.body.employeeId;
            const employeeName = req.body.employeeName;
            const receiverStationId = req.body.receiverStationId;
            const receiverStationName = req.body.receiverStationName;
            const postIds = req.body.postIds;
            let postIdsLength = 1;
            let isArray = false;
            const containerCode = receiverStationId + 'rcv' + Date.now().toString().slice(-5) + Math.random().toString(16).slice(-7);
            console.log(Date.now().toString().slice(-5));
            console.log(Math.random().toString(16).slice(-7));
            if (Array.isArray(postIds)) {
                postIdsLength = postIds.length;
                isArray = true;
            }

            res.render('create_order/create_station_to_receiver_order_form', {
                employeeId,
                employeeName,
                receiverStationId,
                receiverStationName,
                postIds,
                postIdsLength,
                containerCode,
                isArray,
                noHeader: 'yes'
            });
        } else {
            res.json('Bạn không có quyền truy cập chức năng này');
        }
    }

    postShipStationToReceiverOrder(req, res, next) {
        const postIds = req.body.postIds;
        console.log(req.body)
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ _id: postIds[i], status: 'at rStation' }, { status: 'on way to receiver' }).then((post) => {
                    if (post) {
                        post.statusUpdateTime[7] = new Date();
                        post.save();
                    }
                });
            };
        } else {
            Post.findOneAndUpdate({ _id: postIds, status: 'at rStation' }, { status: 'on way to receiver' }).then((post) => {
                if (post) {
                    post.statusUpdateTime[7] = new Date();
                    post.save();
                }
            });
        }

        const container = new Container({
            employeeId: req.body.employeeId,
            type: req.body.typeOfOrder,
            status: 'in process',
            receiverAddressId: req.body.receiverAddressId,
            senderAddressId: req.body.senderAddressId,
            postIds: req.body.postIds,
            containerCode: req.body.containerCode
        });
        container.save()
            .then(() => res.json({
                message: 'Tạo đơn thành công'
            }))
            .catch(next);
    }

    getUpdateProfile(req, res) {
        res.render('profile/update', {
            employee: req.session.employee
        });
    }

    postUpdateProfile(req, res, nex) {
        Employee.updateOne({ _id: req.params.id }, req.body)
            .then(() => Employee.findOne({ _id: req.params.id }).lean())
            .then(employee => {
                req.session.regenerate(err => {
                    if (err) return next(err);
                    req.session.employee = employee;
                    req.session.save(err => {
                        if (err) return next(err);
                        res.redirect('/profile/view');
                    });
                });
            })
            .catch(err => {
                console.log(err.message);
            });
    }

    getConfirmFromWarehouseToStation(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'StationE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;

                    } else {


                        Station.findOne({ address: employee.workAddress }).lean()
                            .then((station) => {
                                if (!station) {
                                    res.status(404).send({ message: 'Station not found' });
                                    return;
                                }
                                Warehouse.findOne({ warehouseCode: station.warehouseId }).lean()
                                    .then((warehouse) => {
                                        Container.find({ receiverAddressId: station.stationCode, type: 'warehouse-station', status: 'in process' }).lean()
                                            .then((containers) => {
                                                res.render('confirm_order/confirm_from_wh_to_station', {
                                                    desStation: station,
                                                    originWarehouse: warehouse,
                                                    containers: containers,

                                                    workPlace: station,
                                                    desWarehouse: warehouse,
                                                    employee,
                                                    noHeader: 'yes',
                                                    employee
                                                });
                                            })
                                    })

                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này');
        }
    }


    getConfirmEachOrderWarehouseToStation(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'StationE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;

                    } else {


                        Station.findOne({ address: employee.workAddress }).lean()
                            .then((station) => {
                                if (!station) {
                                    res.status(404).send({ message: 'Station not found' });
                                    return;
                                }
                                Warehouse.findOne({ warehouseCode: station.warehouseId }).lean()
                                    .then((warehouse) => {
                                        Container.findOne({ containerCode: req.params.containerCode }).lean()
                                            .then((container) => {
                                                const posts = [];
                                                if (Array.isArray(container.postIds)) {
                                                    for (let i = 0; i < container.postIds.length; i++) {
                                                        Post.findOne({ _id: container.postIds[i] }).lean().then((post) => {
                                                            posts.push(post);
                                                        });
                                                    };
                                                } else {
                                                    Post.findOne({ _id: container.postIds }).lean().then((post) => {
                                                        posts.push(post)
                                                    });
                                                }

                                                res.render('confirm_order/confirm_each_order_wh_station', {
                                                    desStation: station,
                                                    originWarehouse: warehouse,
                                                    container: container,
                                                    posts: posts,

                                                    noHeader: 'yes',
                                                    workPlace: station,
                                                    desWarehouse: warehouse,
                                                    employee
                                                });
                                            })
                                    })

                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này');
        }
    }

    postConfirmPostsWarehouseToStation(req, res, next) {
        const postIds = req.body.postIds;
        const containerCode = req.body.containerCode;
        let postIdsLength;

        console.log(req.body);
        console.log(req.body.postIds);
        if (Array.isArray(postIds)) {
            postIdsLength = postIds.length;
            for (let i = 0; i < postIdsLength; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ _id: postIds[i], status: 'on way to rStation' }, { status: 'at rStation' }).then((post) => {
                    if (post) {

                        post.statusUpdateTime[6] = new Date();
                        console.log(post.statusUpdateTime);
                        post.save();
                    }
                });


            };
        } else {
            postIdsLength = 1;
            Post.findOneAndUpdate({ _id: postIds, status: 'on way to rStation' }, { status: 'at rStation' }).then((post) => {
                if (post) {

                    post.statusUpdateTime[6] = new Date();
                    post.save();
                    console.log(post.statusUpdateTime);
                }
            });
        }

        Container.findOne({ containerCode: containerCode }).then((container) => {
            if (!container) {
                res.status(404).send({ message: 'Container not found' });
                return;
            }
            console.log(postIdsLength + '; length of posts in container: ' + container.postIds.length + '; posts received: ' + container.postsReceived.length);
            container.postsReceived = container.postsReceived.concat(postIds);
            if (container.postsReceived.length === container.postIds.length) {
                container.status = 'received';
                container.timeReceived = new Date();
                container.save();
                res.json({
                    noPostLeft: 'yes',
                    message: 'Tất cả các mã hàng trong lô đã được xác nhận thành công'
                })

            } else {
                container.save();
                res.json({
                    noPostLeft: 'no',
                    message: 'Xác nhận thành công'
                })
            }

        }).catch(next);
    }

    getOriginWarehouses(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'WarehouseE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;

                    } else {


                        Warehouse.findOne({ address: employee.workAddress }).lean()
                            .then((warehouse) => {
                                if (!warehouse) {
                                    res.status(404).send({ message: 'Warehouse not found' });
                                    return;
                                }
                                Warehouse.find({}).lean()
                                    .then((originWarehouses) => {
                                        const totalContainersFromWarehouse = {};
                                        const originWarehousesNeedConfirm = [];
                                        for (const originWarehouse of originWarehouses) {
                                            const originWarehouseId = originWarehouse.warehouseCode;
                                            Container.find({ receiverAddressId: warehouse.warehouseCode, senderAddressId: originWarehouseId, type: 'warehouse-warehouse', status: 'in process' }).lean()
                                                .then((containers) => {
                                                    if (containers.length !== 0) {
                                                        totalContainersFromWarehouse[originWarehouseId] = containers.length;
                                                        originWarehousesNeedConfirm.push(originWarehouse);
                                                        console.log(containers)
                                                        console.log(totalContainersFromWarehouse);
                                                    }
                                                })
                                        }


                                        res.render('confirm_order/get_origin_warehouses_need_confirm', {
                                            thisWarehouse: warehouse,
                                            originWarehousesNeedConfirm: originWarehousesNeedConfirm,
                                            totalContainersFromWarehouse: totalContainersFromWarehouse,

                                            workPlace: warehouse,
                                            employee,
                                            noHeader: 'yes'
                                        });

                                    })
                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này')
        }
    }

    getConfirmWarehouseToWarehouse(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'WarehouseE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;

                    } else {


                        Warehouse.findOne({ address: employee.workAddress }).lean()
                            .then((warehouse) => {
                                if (!warehouse) {
                                    res.status(404).send({ message: 'Warehouse not found' });
                                    return;
                                }
                                Warehouse.findOne({ warehouseCode: req.params.originWarehouseId }).lean()
                                    .then((originWarehouse) => {
                                        Container.find({ receiverAddressId: warehouse.warehouseCode, senderAddressId: originWarehouse.warehouseCode, type: 'warehouse-warehouse', status: 'in process' }).lean()
                                            .then((containers) => {
                                                res.render('confirm_order/confirm_wh_wh', {
                                                    desWarehouse: warehouse,
                                                    originWarehouse,
                                                    containers: containers,

                                                    employee,
                                                    workPlace: warehouse,
                                                    noHeader: 'yes'
                                                });
                                            })
                                    })

                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này')
        }
    }

    getConfirmEachOrderWarehouseToWarehouse(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'WarehouseE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;

                    } else {


                        Warehouse.findOne({ address: employee.workAddress }).lean()
                            .then((warehouse) => {
                                if (!warehouse) {
                                    res.status(404).send({ message: 'Warehouse not found' });
                                    return;
                                }

                                Container.findOne({ containerCode: req.params.containerCode }).lean()
                                    .then((container) => {
                                        Warehouse.findOne({ warehouseCode: container.senderAddressId }).lean()
                                            .then((originWarehouse) => {
                                                const posts = [];
                                                if (Array.isArray(container.postIds)) {
                                                    for (let i = 0; i < container.postIds.length; i++) {
                                                        Post.findOne({ _id: container.postIds[i] }).lean().then((post) => {
                                                            posts.push(post);
                                                        });
                                                    };
                                                } else {
                                                    Post.findOne({ _id: container.postIds }).lean().then((post) => {
                                                        posts.push(post)
                                                    });
                                                }

                                                res.render('confirm_order/confirm_each_order_wh_wh', {
                                                    desWarehouse: warehouse,
                                                    originWarehouse,
                                                    container,
                                                    posts,

                                                    employee,
                                                    workPlace: warehouse,
                                                    noHeader: 'yes'

                                                });
                                            })
                                    })

                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này')
        }
    }

    postConfirmPostsWarehouseToWarehouse(req, res, next) {
        const postIds = req.body.postIds;
        const containerCode = req.body.containerCode;
        let postIdsLength;

        console.log(req.body);
        if (Array.isArray(postIds)) {
            postIdsLength = postIds.length;
            for (let i = 0; i < postIdsLength; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ _id: postIds[i], status: 'on way to rWarehouse' }, { status: 'at rWarehouse' }).then((post) => {
                    if (post) {

                        post.statusUpdateTime[4] = new Date();
                        console.log(post.statusUpdateTime);
                        post.save();
                    }
                });


            };
        } else {
            postIdsLength = 1;
            Post.findOneAndUpdate({ _id: postIds, status: 'on way to rWarehouse' }, { status: 'at rWarehouse' }).then((post) => {
                if (post) {

                    post.statusUpdateTime[4] = new Date();
                    post.save();
                    console.log(post.statusUpdateTime);
                }
            });
        }

        Container.findOne({ containerCode: containerCode }).then((container) => {
            if (!container) {
                res.status(404).send({ message: 'Container not found' });
                return;
            }
            console.log(postIdsLength + '; length of posts in container: ' + container.postIds.length + '; posts received: ' + container.postsReceived.length);
            container.postsReceived = container.postsReceived.concat(postIds);
            if (container.postsReceived.length === container.postIds.length) {
                container.status = 'received';
                container.timeReceived = new Date();
                container.save();
                res.json({
                    noPostLeft: 'yes',
                    message: 'Tất cả các mã hàng trong lô đã được xác nhận thành công'
                })

            } else {
                container.save();
                res.json({
                    noPostLeft: 'no',
                    message: 'Xác nhận thành công'
                })
            }

        }).catch(next);
    }

    getOriginStations(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'WarehouseE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;

                    } else {


                        Warehouse.findOne({ address: employee.workAddress }).lean()
                            .then((warehouse) => {
                                if (!warehouse) {
                                    res.status(404).send({ message: 'Warehouse not found' });
                                    return;
                                }
                                Station.find({ warehouseId: warehouse.warehouseCode }).lean()
                                    .then((originStations) => {
                                        const totalContainersFromStation = {};
                                        const originStationsNeedConfirm = [];
                                        for (const originStation of originStations) {
                                            const originStationId = originStation.stationCode;
                                            Container.find({ receiverAddressId: warehouse.warehouseCode, senderAddressId: originStationId, type: 'station-warehouse', status: 'in process' }).lean()
                                                .then((containers) => {
                                                    if (containers.length !== 0) {
                                                        totalContainersFromStation[originStationId] = containers.length;
                                                        originStationsNeedConfirm.push(originStation);
                                                        console.log(totalContainersFromStation);
                                                    }
                                                })
                                        }

                                        res.render('confirm_order/get_origin_stations_need_confirm', {
                                            thisWarehouse: warehouse,
                                            originStationsNeedConfirm,
                                            totalContainersFromStation,

                                            workPlace: warehouse,
                                            employee,
                                            noHeader: 'yes'
                                        });

                                    })
                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này')
        }
    }

    getConfirmStationToWarehouse(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'WarehouseE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;

                    } else {


                        Warehouse.findOne({ address: employee.workAddress }).lean()
                            .then((warehouse) => {
                                if (!warehouse) {
                                    res.status(404).send({ message: 'Warehouse not found' });
                                    return;
                                }
                                Station.findOne({ stationCode: req.params.originStationId }).lean()
                                    .then((originStation) => {
                                        Container.find({ receiverAddressId: warehouse.warehouseCode, senderAddressId: originStation.stationCode, type: 'station-warehouse', status: 'in process' }).lean()
                                            .then((containers) => {
                                                res.render('confirm_order/confirm_station_wh', {
                                                    thisWarehouse: warehouse,
                                                    originStation,
                                                    containers,

                                                    workPlace: warehouse,
                                                    employee,
                                                    noHeader: 'yes'
                                                });
                                            })
                                    })

                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này')
        }
    }

    getConfirmEachOrderStationToWarehouse(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'WarehouseE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;

                    } else {


                        Warehouse.findOne({ address: employee.workAddress }).lean()
                            .then((warehouse) => {
                                if (!warehouse) {
                                    res.status(404).send({ message: 'Warehouse not found' });
                                    return;
                                }

                                Container.findOne({ containerCode: req.params.containerCode }).lean()
                                    .then((container) => {
                                        Station.findOne({ stationCode: req.params.originStationId }).lean()
                                            .then((originStation) => {
                                                const posts = [];
                                                if (Array.isArray(container.postIds)) {
                                                    for (let i = 0; i < container.postIds.length; i++) {
                                                        Post.findOne({ _id: container.postIds[i] }).lean().then((post) => {
                                                            posts.push(post);
                                                        });
                                                    };
                                                } else {
                                                    Post.findOne({ _id: container.postIds }).lean().then((post) => {
                                                        posts.push(post)
                                                    });
                                                }

                                                res.render('confirm_order/confirm_each_order_station_wh', {
                                                    thisWarehouse: warehouse,
                                                    originStation,
                                                    container,
                                                    posts,

                                                    workPlace: warehouse,
                                                    employee,
                                                    noHeader: 'yes'
                                                });
                                            })
                                    })

                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này')
        }
    }

    postConfirmPostsStationToWarehouse(req, res, next) {
        const postIds = req.body.postIds;
        const containerCode = req.body.containerCode;
        let postIdsLength;

        console.log(req.body);
        if (Array.isArray(postIds)) {
            postIdsLength = postIds.length;
            for (let i = 0; i < postIdsLength; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ _id: postIds[i], status: 'on way to sWarehouse' }, { status: 'at sWarehouse' }).then((post) => {
                    if (post) {

                        post.statusUpdateTime[2] = new Date();
                        console.log(post.statusUpdateTime);
                        post.save();
                    }
                });


            };
        } else {
            postIdsLength = 1;
            Post.findOneAndUpdate({ _id: postIds, status: 'on way to sWarehouse' }, { status: 'at sWarehouse' }).then((post) => {
                if (post) {

                    post.statusUpdateTime[2] = new Date();
                    post.save();
                    console.log(post.statusUpdateTime);
                }
            });
        }

        Container.findOne({ containerCode: containerCode }).then((container) => {
            if (!container) {
                res.status(404).send({ message: 'Container not found' });
                return;
            }
            console.log(postIdsLength + '; length of posts in container: ' + container.postIds.length + '; posts received: ' + container.postsReceived.length);
            container.postsReceived = container.postsReceived.concat(postIds);
            if (container.postsReceived.length === container.postIds.length) {
                container.status = 'received';
                container.timeReceived = new Date();
                container.save();
                res.json({
                    noPostLeft: 'yes',
                    message: 'Tất cả các mã hàng trong lô đã được xác nhận thành công'
                })

            } else {
                container.save();
                res.json({
                    noPostLeft: 'no',
                    message: 'Xác nhận thành công'
                })
            }

        }).catch(next);
    }

    getConfirmStationToReceivers(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'StationE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;

                    } else {

                        Station.findOne({ address: employee.workAddress }).lean()
                            .then((station) => {
                                if (!station) {
                                    res.status(404).send({ message: 'Station not found' });
                                    return;
                                }

                                Container.find({ senderAddressId: station.stationCode, type: 'station-receiver', status: 'in process' }).lean()
                                    .then((containers) => {
                                        Warehouse.findOne({ warehouseCode: station.warehouseId }).lean().then((warehouse) => {
                                            res.render('confirm_order/confirm_station_receivers', {
                                                thisStation: station,
                                                containers: containers,

                                                workPlace: station,
                                                desWarehouse: warehouse,
                                                noHeader: 'yes',
                                                employee
                                            });
                                        })

                                    })

                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập chức năng này');
        }
    }

    getConfirmEachOrderStationToReceivers(req, res, next) {
        if (req.session.employee && req.session.employee.role === 'StationE') {
            Employee.findOne({ employeeId: req.session.employee.employeeId }).lean()
                .then((employee) => {
                    if (!employee) {
                        res.status(404).send({ message: 'Employee not found' });
                        return;
                    } else {
                        Station.findOne({ address: employee.workAddress }).lean()
                            .then((station) => {
                                if (!station) {
                                    res.status(404).send({ message: 'Station not found' });
                                    return;
                                }

                                Container.findOne({ containerCode: req.params.containerCode }).lean()
                                    .then((container) => {
                                        const posts = [];
                                        if (Array.isArray(container.postIds)) {
                                            for (let i = 0; i < container.postIds.length; i++) {
                                                Post.findOne({ _id: container.postIds[i] }).lean().then((post) => {
                                                    posts.push(post);
                                                });
                                            };
                                        } else {
                                            Post.findOne({ _id: container.postIds }).lean().then((post) => {
                                                posts.push(post)
                                            });
                                        }

                                        Warehouse.findOne({ warehouseCode: station.warehouseId }).lean().then((warehouse) => {
                                            res.render('confirm_order/confirm_each_order_station_receivers', {
                                                thisStation: station,
                                                container: container,
                                                posts: posts,

                                                workPlace: station,
                                                desWarehouse: warehouse,
                                                noHeader: 'yes',
                                                employee
                                            });
                                        })

                                    })
                            })
                    }

                })
                .catch(next);
        } else {
            res.json('Bạn không có quyền truy cập vào chức năng này')
        }
    }

    postConfirmPostsStationToReceivers(req, res, next) {
        const receivedPostIds = req.body.receivedPostIds;
        const failedPostIds = req.body.failedPostIds;
        const containerCode = req.body.containerCode;
        let receivedPostIdsLength;
        let failedPostIdsLength;

        console.log(req.body);

        if (Array.isArray(receivedPostIds)) {
            receivedPostIdsLength = receivedPostIds.length;
            for (let i = 0; i < receivedPostIdsLength; i++) {
                Post.findOneAndUpdate({ _id: receivedPostIds[i], status: 'on way to receiver' }, { status: 'received' }).then((post) => {
                    if (post) {
                        post.timeReceived = new Date();
                        post.statusUpdateTime[8] = new Date();
                        console.log(post.statusUpdateTime[8]);
                        post.save();
                    }
                });
            };
        } else {
            receivedPostIdsLength = 1;
            Post.findOneAndUpdate({ _id: receivedPostIds, status: 'on way to receiver' }, { status: 'received' }).then((post) => {
                if (post) {
                    post.timeReceived = new Date();
                    post.statusUpdateTime[8] = new Date();
                    post.save();
                    console.log(post.statusUpdateTime[8]);
                }
            });
        }

        if (Array.isArray(failedPostIds)) {
            failedPostIdsLength = failedPostIds.length;
            for (let i = 0; i < failedPostIdsLength; i++) {
                Post.findOneAndUpdate({ _id: failedPostIds[i], status: 'on way to receiver' }, { status: 'returned' }).then((post) => {
                    if (post) {
                        post.statusUpdateTime[9] = new Date();
                        console.log(post.statusUpdateTime[9]);
                        post.save();
                    }
                });
            };
        } else {
            failedPostIdsLength = 1;
            Post.findOneAndUpdate({ _id: failedPostIds, status: 'on way to receiver' }, { status: 'returned' }).then((post) => {
                if (post) {
                    post.statusUpdateTime[9] = new Date();
                    post.save();
                    console.log(post.statusUpdateTime[9]);
                }
            });
        }

        Container.findOne({ containerCode: containerCode }).then((container) => {
            if (!container) {
                res.status(404).send({ message: 'Container not found' });
                return;
            }
            console.log('received: ' + receivedPostIds + '; failed: ' + failedPostIds + '; length of posts in container: ' + container.postIds.length + '; posts received: ' + container.postsReceived.length);
            if (receivedPostIds) {
                container.postsReceived = container.postsReceived.concat(receivedPostIds);
            }

            if (failedPostIds) {
                container.postsReturned = container.postsReturned.concat(failedPostIds);
            }

            if (container.postsReceived.length + container.postsReturned.length === container.postIds.length) {
                container.status = 'received';
                container.timeReceived = new Date();
                container.save();
                res.json({
                    noPostLeft: 'yes',
                    message: 'Tất cả các mã hàng trong lô đã được xác nhận tình trạng giao hàng thành công'
                })

            } else {
                container.save();
                res.json({
                    noPostLeft: 'no',
                    message: 'Xác nhận tình trạng giao hàng thành công'
                })
            }

        }).catch(next);
    }

    getStationEmployeePage(req, res, next) {
        try {
            const employee = req.session.employee;
            let numOfsStationPosts = 0;
            let numOfrStationPosts = 0;
            let numOfTorStationPosts = 0;
            let numOfToReceiverPosts = 0;
            console.log(req.session.employee);
            if (employee && employee.role === 'StationE') {

                Station.findOne({ address: employee.workAddress }).lean().then((station) => {
                    Post.find({ senderStationId: station.stationCode, status: 'at sStation' }).lean().then((posts1) => {
                        if (posts1) {
                            let count = 0;
                            for (const post of posts1) {
                                count++;
                            }
                            numOfsStationPosts = count;
                        }
                        console.log(numOfsStationPosts);
                        Post.find({ receiverStationId: station.stationCode, status: 'at rStation' }).lean().then((posts2) => {
                            if (posts2) {
                                let count = 0;
                                for (const post of posts2) {
                                    count++;
                                }
                                numOfrStationPosts = count;
                            }
                            console.log(numOfrStationPosts);
                            Post.find({ receiverStationId: station.stationCode, status: 'on way to rStation' }).lean().then((posts3) => {
                                if (posts1) {
                                    let count = 0;
                                    for (const post of posts3) {
                                        count++;
                                    }
                                    numOfTorStationPosts = count;
                                }
                                console.log(numOfTorStationPosts);
                                Post.find({ receiverStationId: station.stationCode, status: 'on way to receiver' }).lean().then((posts4) => {
                                    if (posts4) {
                                        let count = 0;
                                        for (const post of posts4) {
                                            count++;
                                        }
                                        numOfToReceiverPosts = count;
                                    }
                                    console.log(numOfToReceiverPosts);
                                    Warehouse.findOne({ warehouseCode: station.warehouseId }).lean().then((warehouse) => {
                                        res.render('station_employee_page', {
                                            employee,
                                            workPlace: station,
                                            desWarehouse: warehouse,
                                            numOfsStationPosts,
                                            numOfrStationPosts,
                                            numOfTorStationPosts,
                                            numOfToReceiverPosts,
                                            noHeader: 'yes'
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            } else {
                res.json('Bạn không có quyền truy cập chức năng này')
            }

        } catch (e) {
            res.json('error')
        }

    }

    logout(req, res, next) {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error logging out');
            } else {
                res.json({
                    message: 'Đăng xuất thành công'
                })
            }
        })
    }

    getWarehouseEmployeePage(req, res, next) {
        try {
            const employee = req.session.employee;
            let numOfsWarehousePosts = 0;
            let numOfrWarehousePosts = 0;
            let numOfTorWarehousePosts = 0;
            let numOfTosWarehousePosts = 0;
            console.log(req.session.employee);
            if (employee && employee.role === 'WarehouseE') {

                Warehouse.findOne({ address: employee.workAddress }).lean().then((warehouse) => {
                    Post.find({ senderWarehouseId: warehouse.warehouseCode, status: 'at sWarehouse' }).lean().then((posts1) => {
                        if (posts1) {
                            let count = 0;
                            for (const post of posts1) {
                                count++;
                            }
                            numOfsWarehousePosts = count;
                        }
                        console.log(numOfsWarehousePosts);
                        Post.find({ receiverWarehouseId: warehouse.warehouseCode, status: 'at rWarehouse' }).lean().then((posts2) => {
                            if (posts2) {
                                let count = 0;
                                for (const post of posts2) {
                                    count++;
                                }
                                numOfrWarehousePosts = count;
                            }
                            console.log(numOfrWarehousePosts);
                            Post.find({ receiverWarehouseId: warehouse.warehouseCode, status: 'on way to rWarehouse' }).lean().then((posts3) => {
                                if (posts1) {
                                    let count = 0;
                                    for (const post of posts3) {
                                        count++;
                                    }
                                    numOfTorWarehousePosts = count;
                                }
                                console.log(numOfTorWarehousePosts);
                                Post.find({ senderWarehouseId: warehouse.warehouseCode, status: 'on way to sWarehouse' }).lean().then((posts4) => {
                                    if (posts4) {
                                        let count = 0;
                                        for (const post of posts4) {
                                            count++;
                                        }
                                        numOfTosWarehousePosts = count;
                                    }
                                    console.log(numOfTosWarehousePosts);

                                    res.render('warehouse_employee_page', {
                                        employee,
                                        workPlace: warehouse,
                                        numOfsWarehousePosts,
                                        numOfrWarehousePosts,
                                        numOfTorWarehousePosts,
                                        numOfTosWarehousePosts,
                                        noHeader: 'yes'
                                    })

                                })
                            })
                        })
                    })
                })
            } else {
                res.json('Bạn không có quyền truy cập chức năng này')
            }

        } catch (e) {
            res.json('error')
        }

    }

}

module.exports = new EmployeeController;