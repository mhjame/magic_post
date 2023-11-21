const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Container = new Schema({
    employeeId: {type: String},
    type: {type: String, enum: ['station-warehouse', 'warehouse-warehouse', 'warehouse-station', 'station-receiver']}, 
    status: {type: String, enum: ['received', 'in process'], default: 'in process'},
    timeReceived: {type: Date},
    receiverAddressId: {type: String},
    senderAddressId: {type: String},
    postIds: {type: Array, default: []}
}, { timestamps: true });

module.exports = mongoose.model('Container', Container);
