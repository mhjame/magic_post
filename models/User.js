const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String },
    password: { type: String },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    // avatar: { type: String, default: '/img/default_avatar.jpg' },
    email: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    address: {type: String},
    posts: { type: Object, default: [] },
}, { timestamps: true });

module.exports = mongoose.model('User', User);
