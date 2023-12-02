const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Warehouse = new Schema({
    name: {type: String},
    address: {type: String},
    adminId: {type: String},
    id: {type: String},
}, {timestamps: true});

module.exports = mongoose.model('Warehouse', Warehouse);