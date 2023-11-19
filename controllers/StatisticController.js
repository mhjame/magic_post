const User = require('../models/User');
const Employee = require('../models/Employee')
const Post = require('../models/Post')
const Station = require('../models/Station')
const Warehouse = require('../models/Warehouse')

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const { multipleMongooseToObject } = require('../util/mongoose');
const { mongooseToObject } = require('../util/mongoose');

class StatisticController {

    
    getPostStatisticsStation(req, res) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const sendstationID = SSID1;

        Post.countDocuments( {senderStationId: sendstationID, status: 'at sStation'} )
            .then(count => {
                console.log(count)
            })

    }

}
module.exports = new StatisticController;