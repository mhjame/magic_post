const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Employee = new Schema({
    employeeId: {type: String},
    username: { type: String },
    password: { type: String },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    birth: {type: Date},
    role: {type: String, enum: ['StationE', 'StationAd', 'WarehouseAd', "WarehouseE", 'Manager'], default: 
'StationE'},
    avatar: { type: String, default: 'https://icones.pro/wp-content/uploads/2021/11/icone-vert-de-camion-d-expedition-et-de-livraison.png' },
    email: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    address: {type: String},
    workAddress: {type: String},
    workPlaceId: {type: String},
    resetToken: {type: String, default: ''},
    resetTokenExpiration: {type: Date, default: 0},
}, { timestamps: true });

module.exports = mongoose.model('Employee', Employee);
