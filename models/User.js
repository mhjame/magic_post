const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const User = new Schema({

    id: {type: String},
    username: { type: String },
    password: { type: String },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    avatar: { type: String, default: '/images/avatar.png' },
    email: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    address: {type: String},
    posts: { type: Array},
}, { timestamps: true });



module.exports = mongoose.model('User', User);
