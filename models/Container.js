const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Container = new Schema({
    employeeId: {type: String},
    Status: {type:String, enum: ['received', 'in process'], default: 'in process'},
    timeReceive: {type: Date},
    receiverAddress: {type: String},
    senderAddress: {type: String},
    posts: {type: Object, default: []}
}, { timestamps: true });

module.exports = mongoose.model('Container', Container);
