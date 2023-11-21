const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    name: { type: String },
    genre: { type: String },
    weight: { type: Number},
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
    senderStationEId: {type: String},
    senderStationId: {type: String},
    senderWarehouseId: {type: String},
    receiverStationId: {type: String},
    receiverWarehouseId: {type: String},
    status: {type:String, enum: ['received', 'on way to reveiver', 'at rStation', 'on way to rStation', 'at rWarehouse', 
            'on way to rWarehourse', 'at sWarehouse', 'on way to sWarehouse', 'at sStation'], default: 'in process'},
    timeReceived: {type: Date},
    id: {type: String}
}, { timestamps: true });

module.exports = mongoose.model('Post', Post);


