const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Employee = new Schema({
    employeeId: {type: String},
    username: { type: String },
    password: { type: String },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    birth: {type: Date},
    role: {type: String, enum: ['StationE', 'StationAd', 'WarehouseAd', 'Manager'], default: 
'StationE'},
    avatar: { type: String, default: '/images/avatar.png' },
    email: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    address: {type: String},
    workAddress: {type: String},
}, { timestamps: true });

module.exports = mongoose.model('Employee', Employee);
