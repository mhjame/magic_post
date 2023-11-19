const User = require('../models/User');
const Employee = require('../models/Employee')

const { multipleMongooseToObject } = require('../util/mongoose');
const { mongooseToObject } = require('../util/mongoose');

class ManagerController {

    getResetPassword(req, res) {
        // Lấy token từ đường dẫn
        const token = req.params.token;
        console.log("getreset" + token)
    
        // Tìm người dùng với token tương ứng và kiểm tra xem token có hiệu lực không
        // const employee = Employee.find((employee) => employee.resetToken === token && employee.resetTokenExpiration > Date.now());
    
        Employee.findOne({ resetToken: token })
          .then(employee => {
    
            if (!employee) {
              return res.status(401).send('Invalid or expired token');
            }
    
            console.log("getreset2" + (employee.resetToken || 'No resetToken found'));
    
            console.log(employee)
            // Hiển thị form để người dùng đặt lại mật khẩu
            res.render('resetPassword', {
              token: token
            });
          })
}
    
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
        Employee.findOne(formData)
            .then(employee => {
                if (!employee) return res.json({
                    loginSuccess: false,
                    message: 'Tên đăng nhập hoặc mật khẩu không đúng'
                });
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
        // User.find({})
        //     .then((result) => {
        //         res.json(result);
        //         // Handle the query result here
        //     })
        //     .catch((error) => {
        //         res.json(error);
        //         // Handle any errors here
        //     });


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
}

module.exports = new ManagerController;