const User = require('../models/User');
const Employee = require('../models/Employee')
class ManagerController {
    
    getLogin(req, res) {
        res.render('login');
    }
    postLogin(req, res, next) {
        const { employeeId, password } = req.body
        Employee.findOne({ employeeId, password })
            .then(employee => {
                if (employee) {
                    return res.json({
                        message: 'Đăng nhập thành công!'
                    });
                } else return res.status(401).json({
                    message: 'Mã nhân viên hoặc mật khẩu không chính xác!'
                })
            })
            .catch(next)
    }

    getHome(req, res) {
        // User.find({})
        // .then((result) => {
        //     res.json(result);
        //     // Handle the query result here
        // })
        // .catch((error) => {
        //     res.json(error);
        //     // Handle any errors here
        // });


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
}

module.exports = new ManagerController;