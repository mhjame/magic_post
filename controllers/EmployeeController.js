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


                                                res.render('create_to_wh_order', {
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

                                                res.render('create_to_wh_order', {
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
            .then(() => res.redirect(200, '/create_to_wh_order'))
            .catch(next);
    }

}

module.exports = new EmployeeController;