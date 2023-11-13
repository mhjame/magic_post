const User = require('../models/User');
const Employee = require('../models/Employee')
class ManagerController {
    getLogin(req, res) {
        res.render('home');
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


        // User.find({}, function (err, users){
        //     if(!err) res.json(users)
        //     else res.json('error')
        // })
        // res.json('hallo');
    }

    getSearch(req, res) {
        res.render('search');
    }

    getAdmin(req, res) {
        res.render('admin');
    }

    getRegister(req, res) {
        res.render('register');
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
}

module.exports = new ManagerController;