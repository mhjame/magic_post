const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Container = new Schema({
    employeeId: {type: String},
    status: {type:String, enum: ['received', 'in process'], default: 'in process'},
    timeReceived: {type: Date},
    receiverAddress: {type: String},
    senderAddress: {type: String},
    posts: {type: Array, default: []}
}, { timestamps: true });

module.exports = mongoose.model('Container', Container);
