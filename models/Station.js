const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Station = new Schema({
    name: {type: String},
    address: {type: String},
    adminId: {type: String},
    warehouseId: {type: String},
}, {timestamps: true})

module.exports = mongoose.model('Station', Station);