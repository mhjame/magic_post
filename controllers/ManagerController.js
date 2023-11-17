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
        console.log(formData)
        Employee.findOne(formData)
            .then(employee => {
                if (!employee) {
                    console.log("success")
                    return res.json({
                        loginSuccess: false,
                        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
                    });
                }
                console.log("error"),
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
        User.find({})
            .then((result) => {
                res.json(result);
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
            const userRole = req.session.employee.role;
            if (userRole == 'Manager') {
                Promise.all([Employee.find({}), Employee.find({ deleted: true }).countDocuments()])
                    .then(
                        ([employees, deleteCount]) => {

                        
                        res.render('supervisor/humanResource', {
                            // user: req.session.user,
                            deleteCount,
                            employees: multipleMongooseToObject(employees)
                        })
                        console.log("employee:", employees)
                    }
                    )
                    .catch(next)
            } else {
                res.json('Bạn không có quyền truy cập chức năng này');
            }
        } catch (e) {
            res.render('error');
        }
    }
}

module.exports = new ManagerController;