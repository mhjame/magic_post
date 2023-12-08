const User = require('../models/User');
const Employee = require('../models/Employee')

const { multipleMongooseToObject } = require('../util/mongoose');
const { mongooseToObject } = require('../util/mongoose');

class ManagerController {

    getLogin(req, res) {
        res.render('login');
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
        // console.log(formData)
        Employee.findOne(formData)
            .then(employee => {
                if (!employee) {
                    // console.log("success")
                    return res.json({
                        loginSuccess: false,
                        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
                    });
                }
                // console.log("error"),
                req.session.regenerate(err => {
                    if (err) return err;
                    req.session.employee = mongooseToObject(employee);
                    req.session.save(err => {
                        if (err) return err;
                        res.json({
                            loginSuccess: true,
                            message: 'Đăng nhập thành công'
                        });
                    });
                });
            })
            .catch(next);
    }

    getHome(req, res) {
        Employee.findOne({_id:'65599ec015476e96d3c953ff'})
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
        Employee.findOne({ username: formData.username })
            .then(employee => {
                if (employee) return res.json({
                    registerSuccess: false,
                    message: 'Tên đăng nhập đã tồn tại'
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
        });
        // console.log(req.session.employee)
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
                Promise.all([Employee.find({ role: { $in: ['StationAd', 'WarehouseAd']}}), Employee.find({ deleted: true, role: { $in: ['StationAd', 'WarehouseAd'] } }).countDocuments()])
                    .then(
                        ([employees, deleteCount]) => {

                        
                        res.render('supervisor/humanResource', {
                            employee: req.session.employee,
                            deleteCount,
                            employees: multipleMongooseToObject(employees)
                        })
                        console.log("employee:", employees)
                    }
                    )
                    .catch(next)
             } else if (userRole == 'StationAd') {
               
                    Promise.all([Employee.find({ role: { $in: ['StationE']}, workAddress: userWorkPlace}), Employee.find({ deleted: true, role: { $in: ['StationE'] } }).countDocuments()])
                        .then(
                            ([employees, deleteCount]) => {
    
                            
                            res.render('supervisor/humanResource', {
                                employee: req.session.employee,
                                deleteCount,
                                employees: multipleMongooseToObject(employees)
                            })
                            console.log("employee:", employees)
                        }
                        )
                        .catch(next)
                 
             } else if (userRole == 'WarehouseAd') {
                Promise.all([Employee.find({ role: { $in: ['WarehouseE']}, workAddress: userWorkPlace}), Employee.find({ deleted: true, role: { $in: ['WarehouseE'] } }).countDocuments()])
                        .then(
                            ([employees, deleteCount]) => {
    
                            
                            res.render('supervisor/humanResource', {
                                employee: req.session.employee,
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
                Employee.findDeleted({ role: { $in: ['StationAd', 'WarehouseAd']}})
                    .then((employees) =>
                        res.render('supervisor/oldHR', {
                            employee: req.session.employee,
                            employees: multipleMongooseToObject(employees),
                        }),
                    )
                    .catch(next)
            } else if(userRole == 'StationAd') {
                Employee.findDeleted({ role: { $in: ['StationE']}})
                    .then((employees) =>
                        res.render('supervisor/oldHR', {
                            employee: req.session.employee,
                            employees: multipleMongooseToObject(employees),
                        }),
                    )
                    .catch(next)

            } else if(userRole == 'WarehouseAd') {
                Employee.findDeleted({ role: { $in: ['WarehouseE']}})
                    .then((employees) =>
                        res.render('supervisor/oldHR', {
                            employee: req.session.employee,
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

    //DELETE /product/:id/force
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
}

module.exports = new ManagerController;