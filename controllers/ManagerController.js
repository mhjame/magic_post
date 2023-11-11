const User = require('../models/User');

class ManagerController {
    
    getLogin(req, res) {
        res.render('login');
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
}

module.exports = new ManagerController;