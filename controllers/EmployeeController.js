const Post = require('../models/Post');
const Container = require('../models/Container');
const Employee = require('../models/Employee');
const Station = require('../models/Station');
const Warehouse = require('../models/Warehouse');



class EmployeeController {


    createShipStationToWarehouse(req, res, next) {

        Employee.findOne({ employeeId: "TN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {
                    Station.findOne({ id: employee.workPlaceId }).lean()
                        .then((station) => {
                            if (!station) {
                                res.status(404).send({ message: 'Station not found' });
                                return;
                            }
                            Warehouse.findOne({ id: station.warehouseId }).lean()
                                .then((warehouse) => {
                                    if (!warehouse) {
                                        res.status(404).send({ message: 'Warehouse not found' });
                                        return;
                                    }

                                    Post.find({ senderStationId: station.id, status: 'at sStation' }).lean()
                                        .then((posts) => {
                                            res.render('create_order/create_station_to_wh', {
                                                employee: employee,
                                                workPlace: station,
                                                desWarehouse: warehouse,
                                                posts: posts
                                            });
                                        })


                                })


                        })
                }

            })
            .catch(next);
    }

    createStationToWhOrderForm(req, res, next) {
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
            isArray
        });

    }

    postShipStationToWarehouseOrder(req, res, next) {

        const postIds = req.body.postIds;
        console.log(req.body)
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ id: postIds[i], status: 'at sStation' }, { status: 'on way to sWarehouse' }).then((post) => {
                    if (post) {
                        post.statusUpdateTime[1] = new Date();
                        post.save();
                    }
                });
            };
        } else {
            Post.findOneAndUpdate({ id: postIds, status: 'at sStation' }, { status: 'on way to sWarehouse' }).then((post) => {
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
        Employee.findOne({ employeeId: "TKHN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {


                    Warehouse.findOne({ id: employee.workPlaceId }).lean()
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
                                        const desWarehouseId = desWarehouse.id;
                                        Post.find({ senderWarehouseId: warehouse.id, receiverWarehouseId: desWarehouseId, status: 'at sWarehouse' }).lean()
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
                                        totalPostsFromWarehouse
                                    });

                                })
                        })
                }

            })
            .catch(next);
    }

    createShipWarehouseToWarehouse(req, res, next) {

        Employee.findOne({ employeeId: "TKHN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {
                    Warehouse.findOne({ id: employee.workPlaceId }).lean()
                        .then((warehouse) => {
                            if (!warehouse) {
                                res.status(404).send({ message: 'Warehouse not found' });
                                return;
                            }
                            Warehouse.findOne({ id: req.params.desWarehouseId }).lean()
                                .then((desWarehouse) => {
                                    Post.find({ senderWarehouseId: warehouse.id, receiverWarehouseId: desWarehouse.id, status: 'at sWarehouse' }).lean()
                                        .then((posts) => {

                                            res.render('create_order/create_wh_to_wh', {
                                                employee: employee,
                                                workPlace: warehouse,
                                                desWarehouse,
                                                posts
                                            });

                                        })
                                })

                        })
                }

            })
            .catch(next);
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
            isArray
        });

    }

    postShipWarehouseToWarehouseOrder(req, res, next) {
        console.log(req.body)
        const postIds = req.body.postIds;
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ id: postIds[i], status: 'at sWarehouse' }, { status: 'on way to rWarehouse' }).then((post) => {
                    if (post) {
                        post.statusUpdateTime[3] = new Date();
                        post.save();
                    }
                });

            };
        } else {
            Post.findOneAndUpdate({ id: postIds, status: 'at sWarehouse' }, { status: 'on way to rWarehouse' }).then((post) => {
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
        Employee.findOne({ employeeId: "TKHN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {


                    Warehouse.findOne({ id: employee.workPlaceId }).lean()
                        .then((warehouse) => {
                            if (!warehouse) {
                                res.status(404).send({ message: 'Warehouse not found' });
                                return;
                            }
                            Station.find({ warehouseId: warehouse.id }).lean()
                                .then((desStations) => {
                                    const totalPostsFromStation = {};
                                    const desStationsHavePosts = [];
                                    for (const desStation of desStations) {
                                        const desStationId = desStation.id;
                                        Post.find({ receiverWarehouseId: warehouse.id, receiverStationId: desStationId, status: 'at rWarehouse' }).lean()
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
                                        totalPostsFromStation
                                    });

                                })
                        })
                }

            })
            .catch(next);
    }



    createShipWarehouseToStation(req, res, next) {
        Employee.findOne({ employeeId: "TKHN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;
                } else {
                    Warehouse.findOne({ id: employee.workPlaceId }).lean()
                        .then((warehouse) => {
                            if (!warehouse) {
                                res.status(404).send({ message: 'Warehouse not found' });
                                return;
                            }
                            Station.findOne({ id: req.params.desStationId }).lean()
                                .then((desStation) => {
                                    Post.find({ receiverWarehouseId: warehouse.id, receiverStationId: desStation.id, status: 'at rWarehouse' }).lean()
                                        .then((posts) => {

                                            res.render('create_order/create_wh_to_station', {
                                                employee,
                                                workPlace: warehouse,
                                                desStation,
                                                posts,
                                            });

                                        })
                                })

                        })
                }

            })
            .catch(next);
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
            isArray
        });

    }

    postShipWarehouseToStationOrder(req, res, next) {
        console.log(req.body)
        const postIds = req.body.postIds;
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ id: postIds[i], status: 'at rWarehouse' }, { status: 'on way to rStation' }).then((post) => {
                    if (post) {
                        post.statusUpdateTime[5] = new Date();
                        post.save();
                    }
                });


            };
        } else {
            Post.findOneAndUpdate({ id: postIds, status: 'at rWarehouse' }, { status: 'on way to rStation' }).then((post) => {
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

        Employee.findOne({ employeeId: "HN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;
                } else {
                    Station.findOne({ id: employee.workPlaceId }).lean()
                        .then((station) => {
                            if (!station) {
                                res.status(404).send({ message: 'Station not found' });
                                return;
                            }
                            console.log(station.id)
                            Post.find({ receiverStationId: station.id, status: 'at rStation' }).lean()
                                .then((posts) => {
                                    res.render('create_order/create_station_to_receiver', {
                                        employee,
                                        workPlace: station,
                                        posts: posts
                                    });
                                })
                        })
                }

            })
            .catch(next);
    }

    createStationToReceiverOrderForm(req, res, next) {
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
            isArray
        });

    }

    postShipStationToReceiverOrder(req, res, next) {
        const postIds = req.body.postIds;
        console.log(req.body)
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ id: postIds[i], status: 'at rStation' }, { status: 'on way to receiver' }).then((post) => {
                    if (post) {
                        post.statusUpdateTime[7] = new Date();
                        post.save();
                    }
                });
            };
        } else {
            Post.findOneAndUpdate({ id: postIds, status: 'at rStation' }, { status: 'on way to receiver' }).then((post) => {
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
        Employee.findOne({ employeeId: "HN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {


                    Station.findOne({ id: employee.workPlaceId }).lean()
                        .then((station) => {
                            if (!station) {
                                res.status(404).send({ message: 'Station not found' });
                                return;
                            }
                            Warehouse.findOne({ id: station.warehouseId }).lean()
                                .then((warehouse) => {
                                    Container.find({ receiverAddressId: station.id, type: 'warehouse-station', status: 'in process' }).lean()
                                        .then((containers) => {
                                            res.render('confirm_order/confirm_from_wh_to_station', {
                                                desStation: station,
                                                originWarehouse: warehouse,
                                                containers: containers
                                            });
                                        })
                                })

                        })
                }

            })
            .catch(next);

    }


    getConfirmEachOrderWarehouseToStation(req, res, next) {
        Employee.findOne({ employeeId: "HN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {


                    Station.findOne({ id: employee.workPlaceId }).lean()
                        .then((station) => {
                            if (!station) {
                                res.status(404).send({ message: 'Station not found' });
                                return;
                            }
                            Warehouse.findOne({ id: station.warehouseId }).lean()
                                .then((warehouse) => {
                                    Container.findOne({ containerCode: req.params.containerCode }).lean()
                                        .then((container) => {
                                            const posts = [];
                                            if (Array.isArray(container.postIds)) {
                                                for (let i = 0; i < container.postIds.length; i++) {
                                                    Post.findOne({ id: container.postIds[i] }).lean().then((post) => {
                                                        posts.push(post);
                                                    });
                                                };
                                            } else {
                                                Post.findOne({ id: container.postIds }).lean().then((post) => {
                                                    posts.push(post)
                                                });
                                            }

                                            res.render('confirm_order/confirm_each_order_wh_station', {
                                                desStation: station,
                                                originWarehouse: warehouse,
                                                container: container,
                                                posts: posts
                                            });
                                        })
                                })

                        })
                }

            })
            .catch(next);
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
                Post.findOneAndUpdate({ id: postIds[i], status: 'on way to rStation' }, { status: 'at rStation' }).then((post) => {
                    if (post) {

                        post.statusUpdateTime[6] = new Date();
                        console.log(post.statusUpdateTime);
                        post.save();
                    }
                });


            };
        } else {
            postIdsLength = 1;
            Post.findOneAndUpdate({ id: postIds, status: 'on way to rStation' }, { status: 'at rStation' }).then((post) => {
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
        Employee.findOne({ employeeId: "TKHN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {


                    Warehouse.findOne({ id: employee.workPlaceId }).lean()
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
                                        const originWarehouseId = originWarehouse.id;
                                        Container.find({ receiverAddressId: warehouse.id, senderAddressId: originWarehouseId, type: 'warehouse-warehouse', status: 'in process' }).lean()
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
                                    });

                                })
                        })
                }

            })
            .catch(next);
    }

    getConfirmWarehouseToWarehouse(req, res, next) {
        Employee.findOne({ employeeId: "TKHN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {


                    Warehouse.findOne({ id: employee.workPlaceId }).lean()
                        .then((warehouse) => {
                            if (!warehouse) {
                                res.status(404).send({ message: 'Warehouse not found' });
                                return;
                            }
                            Warehouse.findOne({ id: req.params.originWarehouseId }).lean()
                                .then((originWarehouse) => {
                                    Container.find({ receiverAddressId: warehouse.id, senderAddressId: originWarehouse.id, type: 'warehouse-warehouse', status: 'in process' }).lean()
                                        .then((containers) => {
                                            res.render('confirm_order/confirm_wh_wh', {
                                                desWarehouse: warehouse,
                                                originWarehouse,
                                                containers: containers
                                            });
                                        })
                                })

                        })
                }

            })
            .catch(next);
    }

    getConfirmEachOrderWarehouseToWarehouse(req, res, next) {
        Employee.findOne({ employeeId: "TKHN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {


                    Warehouse.findOne({ id: employee.workPlaceId }).lean()
                        .then((warehouse) => {
                            if (!warehouse) {
                                res.status(404).send({ message: 'Warehouse not found' });
                                return;
                            }

                            Container.findOne({ containerCode: req.params.containerCode }).lean()
                                .then((container) => {
                                    Warehouse.findOne({ id: container.senderAddressId }).lean()
                                        .then((originWarehouse) => {
                                            const posts = [];
                                            if (Array.isArray(container.postIds)) {
                                                for (let i = 0; i < container.postIds.length; i++) {
                                                    Post.findOne({ id: container.postIds[i] }).lean().then((post) => {
                                                        posts.push(post);
                                                    });
                                                };
                                            } else {
                                                Post.findOne({ id: container.postIds }).lean().then((post) => {
                                                    posts.push(post)
                                                });
                                            }

                                            res.render('confirm_order/confirm_each_order_wh_wh', {
                                                desWarehouse: warehouse,
                                                originWarehouse,
                                                container,
                                                posts
                                            });
                                        })
                                })

                        })
                }

            })
            .catch(next);
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
                Post.findOneAndUpdate({ id: postIds[i], status: 'on way to rWarehouse' }, { status: 'at rWarehouse' }).then((post) => {
                    if (post) {

                        post.statusUpdateTime[4] = new Date();
                        console.log(post.statusUpdateTime);
                        post.save();
                    }
                });


            };
        } else {
            postIdsLength = 1;
            Post.findOneAndUpdate({ id: postIds, status: 'on way to rWarehouse' }, { status: 'at rWarehouse' }).then((post) => {
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
        Employee.findOne({ employeeId: "TKHN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {


                    Warehouse.findOne({ id: employee.workPlaceId }).lean()
                        .then((warehouse) => {
                            if (!warehouse) {
                                res.status(404).send({ message: 'Warehouse not found' });
                                return;
                            }
                            Station.find({ warehouseId: warehouse.id }).lean()
                                .then((originStations) => {
                                    const totalContainersFromStation = {};
                                    const originStationsNeedConfirm = [];
                                    for (const originStation of originStations) {
                                        const originStationId = originStation.id;
                                        Container.find({ receiverAddressId: warehouse.id, senderAddressId: originStationId, type: 'station-warehouse', status: 'in process' }).lean()
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
                                    });

                                })
                        })
                }

            })
            .catch(next);
    }

    getConfirmStationToWarehouse(req, res, next) {
        Employee.findOne({ employeeId: "TKHN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {


                    Warehouse.findOne({ id: employee.workPlaceId }).lean()
                        .then((warehouse) => {
                            if (!warehouse) {
                                res.status(404).send({ message: 'Warehouse not found' });
                                return;
                            }
                            Station.findOne({ id: req.params.originStationId }).lean()
                                .then((originStation) => {
                                    Container.find({ receiverAddressId: warehouse.id, senderAddressId: originStation.id, type: 'station-warehouse', status: 'in process' }).lean()
                                        .then((containers) => {
                                            res.render('confirm_order/confirm_station_wh', {
                                                thisWarehouse: warehouse,
                                                originStation,
                                                containers,
                                            });
                                        })
                                })

                        })
                }

            })
            .catch(next);
    }

    getConfirmEachOrderStationToWarehouse(req, res, next) {
        Employee.findOne({ employeeId: "TKHN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {


                    Warehouse.findOne({ id: employee.workPlaceId }).lean()
                        .then((warehouse) => {
                            if (!warehouse) {
                                res.status(404).send({ message: 'Warehouse not found' });
                                return;
                            }

                            Container.findOne({ containerCode: req.params.containerCode }).lean()
                                .then((container) => {
                                    Station.findOne({ id: req.params.originStationId }).lean()
                                        .then((originStation) => {
                                            const posts = [];
                                            if (Array.isArray(container.postIds)) {
                                                for (let i = 0; i < container.postIds.length; i++) {
                                                    Post.findOne({ id: container.postIds[i] }).lean().then((post) => {
                                                        posts.push(post);
                                                    });
                                                };
                                            } else {
                                                Post.findOne({ id: container.postIds }).lean().then((post) => {
                                                    posts.push(post)
                                                });
                                            }

                                            res.render('confirm_order/confirm_each_order_station_wh', {
                                                thisWarehouse: warehouse,
                                                originStation,
                                                container,
                                                posts
                                            });
                                        })
                                })

                        })
                }

            })
            .catch(next);
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
                Post.findOneAndUpdate({ id: postIds[i], status: 'on way to sWarehouse' }, { status: 'at sWarehouse' }).then((post) => {
                    if (post) {

                        post.statusUpdateTime[2] = new Date();
                        console.log(post.statusUpdateTime);
                        post.save();
                    }
                });


            };
        } else {
            postIdsLength = 1;
            Post.findOneAndUpdate({ id: postIds, status: 'on way to sWarehouse' }, { status: 'at sWarehouse' }).then((post) => {
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
        Employee.findOne({ employeeId: "HN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {

                    Station.findOne({ id: employee.workPlaceId }).lean()
                        .then((station) => {
                            if (!station) {
                                res.status(404).send({ message: 'Station not found' });
                                return;
                            }

                            Container.find({ senderAddressId: station.id, type: 'station-receiver', status: 'in process' }).lean()
                                .then((containers) => {
                                    res.render('confirm_order/confirm_station_receivers', {
                                        thisStation: station,
                                        containers: containers
                                    });
                                })

                        })
                }

            })
            .catch(next);

    }

    getConfirmEachOrderStationToReceivers(req, res, next) {
        Employee.findOne({ employeeId: "HN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;
                } else {
                    Station.findOne({ id: employee.workPlaceId }).lean()
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
                                            Post.findOne({ id: container.postIds[i] }).lean().then((post) => {
                                                posts.push(post);
                                            });
                                        };
                                    } else {
                                        Post.findOne({ id: container.postIds }).lean().then((post) => {
                                            posts.push(post)
                                        });
                                    }

                                    res.render('confirm_order/confirm_each_order_station_receivers', {
                                        thisStation: station,
                                        container: container,
                                        posts: posts
                                    });
                                })
                        })
                }

            })
            .catch(next);
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
                Post.findOneAndUpdate({ id: receivedPostIds[i], status: 'on way to receiver' }, { status: 'received' }).then((post) => {
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
            Post.findOneAndUpdate({ id: receivedPostIds, status: 'on way to receiver' }, { status: 'received' }).then((post) => {
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
                Post.findOneAndUpdate({ id: failedPostIds[i], status: 'on way to receiver' }, { status: 'returned' }).then((post) => {
                    if (post) {
                        post.statusUpdateTime[9] = new Date();
                        console.log(post.statusUpdateTime[9]);
                        post.save();
                    }
                });
            };
        } else {
            failedPostIdsLength = 1;
            Post.findOneAndUpdate({ id: failedPostIds, status: 'on way to receiver' }, { status: 'returned' }).then((post) => {
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


}

module.exports = new EmployeeController;