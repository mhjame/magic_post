const Post = require('../models/Post');
const Container = require('../models/Container');
const Employee = require('../models/Employee');
const Station = require('../models/Station');
const Warehouse = require('../models/Warehouse');




class EmployeeController {


    createShipToWarehouseOrder(req, res, next) {

        Employee.findOne({ employeeId: "TKHN001" }).lean()
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

        let postIds = req.body.postIds;
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ id: postIds[i], status: 'at sStation' }, { status: 'on way to sWarehouse' }).then((post) => {
                    if (post) {

                        post.statusUpdateTime[1] = new Date();
                    }
                });
                Post.findOneAndUpdate({ id: postIds[i], status: 'at sWarehouse' }, { status: 'on way to rWarehouse' }).then((post) => {
                    if (post.statusUpdateTime) {

                        post.statusUpdateTime[3] = new Date();
                    }
                });

            };
        } else {
            Post.findOneAndUpdate({ id: postIds, status: 'at sStation' }, { status: 'on way to sWarehouse' }).then((post) => {
                if (post) {

                    post.statusUpdateTime[1] = new Date();
                    console.log(post.statusUpdateTime);
                }
            });
            Post.findOneAndUpdate({ id: postIds, status: 'at sWarehouse' }, { status: 'on way to rWarehouse' }).then((post) => {
                if (post) {

                    post.statusUpdateTime[3] = new Date();
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

        let postIds = req.body.postIds;
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ id: postIds[i], status: 'at rWarehouse' }, { status: 'on way to rStation' }).then((post) => {
                    if (post) {

                        post.statusUpdateTime[5] = new Date();
                        console.log(post.statusUpdateTime);
                    }
                });


            };
        } else {
            Post.findOneAndUpdate({ id: postIds, status: 'at rWarehouse' }, { status: 'on way to rStation' }).then((post) => {
                if (post) {

                    post.statusUpdateTime[5] = new Date();
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
        let postIds = req.body.postIds;
        if (Array.isArray(postIds)) {
            for (let i = 0; i < postIds.length; i++) {
                console.log(postIds[i])
                Post.findOneAndUpdate({ id: postIds[i], status: 'at rStation' }, { status: 'on way to receiver' }).then((post) => {
                    if (post) {

                        post.statusUpdateTime[7] = new Date();
                        console.log(post.statusUpdateTime);
                    }
                });


            };
        } else {
            Post.findOneAndUpdate({ id: postIds, status: 'at rStation' }, { status: 'on way to receiver' }).then((post) => {
                if (post) {

                    post.statusUpdateTime[7] = new Date();
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

}

module.exports = new EmployeeController;