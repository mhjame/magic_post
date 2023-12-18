const Post = require('../models/Post');
const Container = require('../models/Container');
const Employee = require('../models/Employee');
const Station = require('../models/Station');
const Warehouse = require('../models/Warehouse');



class EmployeeController {


    createShipToWarehouseOrder(req, res, next) {

        Employee.findOne({ employeeId: "HN001" }).lean()
            .then((employee) => {
                if (!employee) {
                    res.status(404).send({ message: 'Employee not found' });
                    return;

                } else {

                    if (employee.role === 'StationE') {
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


                                                res.render('create_order/create_to_wh_order', {
                                                    employee: employee,
                                                    workPlace: station,
                                                    desWarehouse: warehouse,
                                                    posts: posts
                                                });
                                            })


                                    })


                            })

                    } else if (employee.role === 'WarehouseE') {
                        Warehouse.findOne({ id: employee.workPlaceId }).lean()
                            .then((warehouse) => {
                                if (!warehouse) {
                                    res.status(404).send({ message: 'Warehouse not found' });
                                    return;
                                }
                                Warehouse.find({}).lean()
                                    .then((desWarehouses) => {
                                        Post.find({ senderWarehouseId: warehouse.id, status: 'at sWarehouse' }).lean()
                                            .then((posts) => {

                                                res.render('create_order/create_to_wh_order', {
                                                    employee: employee,
                                                    workPlace: warehouse,
                                                    desWarehouses: desWarehouses,
                                                    posts: posts
                                                });

                                            })




                                    })

                            })
                    }



                }

            })
            .catch(next);
    }

    postShipToWarehouseOrder(req, res, next) {

        const postIds = req.body.postIds;
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ id: postIds[i], status: 'at sStation' }, { status: 'on way to sWarehouse' }).then((post) => {
                    if (post) {

                        post.statusUpdateTime[1] = new Date();
                        post.save();
                    }
                });
                Post.findOneAndUpdate({ id: postIds[i], status: 'at sWarehouse' }, { status: 'on way to rWarehouse' }).then((post) => {
                    if (post.statusUpdateTime) {

                        post.statusUpdateTime[3] = new Date();
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
            timeReceived: null,
            receiverAddressId: req.body.receiverAddressId,
            senderAddressId: req.body.senderAddressId,
            postIds: req.body.postIds
        });
        container.save()
            .then(() => res.redirect(200, '/create_order/create_to_wh_order'))
            .catch(next);
    }



    createShipToStationOrder(req, res, next) {

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
                                    if (!desStations) {
                                        res.status(404).send({ message: 'Stations belong to this warehouse not found' });
                                        return;
                                    }
                                    Post.find({ receiverWarehouseId: warehouse.id, status: 'at rWarehouse' }).lean()
                                        .then((posts) => {

                                            res.render('create_order/create_to_station_order', {
                                                employee: employee,
                                                workPlace: warehouse,
                                                desStations: desStations,
                                                posts: posts
                                            });

                                        })




                                })

                        })




                }

            })
            .catch(next);
    }



    postShipToStationOrder(req, res, next) {

        const postIds = req.body.postIds;
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ id: postIds[i], status: 'at rWarehouse' }, { status: 'on way to rStation' }).then((post) => {
                    if (post) {

                        post.statusUpdateTime[5] = new Date();
                        post.save();
                        console.log(post.statusUpdateTime);
                    }
                });


            };
        } else {
            Post.findOneAndUpdate({ id: postIds, status: 'at rWarehouse' }, { status: 'on way to rStation' }).then((post) => {
                if (post) {

                    post.statusUpdateTime[5] = new Date();
                    post.save();
                    console.log(post.statusUpdateTime);
                }
            });
        }


        const container = new Container({
            employeeId: req.body.employeeId,
            type: req.body.typeOfOrder,
            status: 'in process',
            timeReceived: null,
            receiverAddressId: req.body.receiverAddressId,
            senderAddressId: req.body.senderAddressId,
            postIds: req.body.postIds
        });
        container.save()
            .then(() => res.redirect(200, '/create_order/create_to_station_order'))
            .catch(next);
    }






    createShipToReceiverOrder(req, res, next) {

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


                                    res.render('create_order/create_to_receiver_order', {
                                        employee: employee,
                                        workPlace: station,
                                        posts: posts
                                    });
                                })


                        })



                }

            })
            .catch(next);
    }

    postShipToReceiverOrder(req, res, next) {
        const postIds = req.body.postIds;
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ id: postIds[i], status: 'at rStation' }, { status: 'on way to receiver' }).then((post) => {
                    if (post) {

                        post.statusUpdateTime[7] = new Date();
                        post.save();
                        console.log(post.statusUpdateTime);
                    }
                });


            };
        } else {
            Post.findOneAndUpdate({ id: postIds, status: 'at rStation' }, { status: 'on way to receiver' }).then((post) => {
                if (post) {

                    post.statusUpdateTime[7] = new Date();
                    post.save();
                    console.log(post.statusUpdateTime);
                }
            });
        }


        const container = new Container({
            employeeId: req.body.employeeId,
            type: req.body.typeOfOrder,
            status: 'in process',
            timeReceived: null,
            receiverAddressId: req.body.receiverAddressId,
            senderAddressId: req.body.senderAddressId,
            postIds: req.body.postIds
        });
        container.save()
            .then(() => res.redirect(200, '/create_order/create_to_receiver_order'))
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
                container.save();
                res.redirect(200, '/confirm_order/confirm_from_wh_to_station');

            } else {
                container.save();
                res.redirect(200, '/confirm_order/' + containerCode + '/confirm_each_order_wh_station');
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
        const originWarehouseId = req.body.originWarehouseId;
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
                container.save();
                res.redirect(200, '/confirm_order/' + originWarehouseId + '/confirm_wh_wh');

            } else {
                container.save();
                res.redirect(200, '/confirm_order/' + originWarehouseId + '/' + containerCode + '/confirm_each_order_wh_wh');
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
        const originStationId = req.body.originStationId;
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
                container.save();
                res.redirect(200, '/confirm_order/' + originStationId + '/confirm_station_wh');

            } else {
                container.save();
                res.redirect(200, '/confirm_order/' + originStationId + '/' + containerCode + '/confirm_each_order_station_wh');
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


}

module.exports = new EmployeeController;