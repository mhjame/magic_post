const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    name: { type: String },
    genre: { type: String },
    weigh: { type: Number},
    cost: {type: Number},
    payState: {type: String, enum: ['done', 'not'], default: 'not'},
    senderName: {type: String},
    receiverName: {type: String},
    senderAddress: {type: String},
    receiverAddress: {type: String},
    senderPhoneNumber: {type: String},
    receiverPhoneNumber: {type: String},
    senderId: {type: String},
    receiverId: {type: String},
    stationId: {type: String},
    stationEId: {type: String},
    Status: {type:String, enum: ['received', 'in process'], default: 'in process'},
    timeReceive: {type: Date}
}, { timestamps: true });

module.exports = mongoose.model('Post', Post);
