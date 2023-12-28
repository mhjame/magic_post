const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Schema = mongoose.Schema;

const Post = new Schema({
    name: { type: String },
    genre: { type: [String] },
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
    senderStationCode: {type: String},
    senderWarehouseCode: {type: String},
    receiverStationCode: {type: String},
    receiverWarehouseCode: {type: String},
    convertedVolume:{type: Number},
    actualWeight: {type: Number},
    specialServices: {type: String},
    COD: {type: Number},
    othersPay: {type: Number},
    serviceNotes: {type: String},
    guidePending: {type: [String]},
    status: {type:String, enum: ['returned' ,'received', 'on way to receiver', 'at rStation', 'on way to rStation', 'at rWarehouse', 
            'on way to rWarehouse', 'at sWarehouse', 'on way to sWarehouse', 'at sStation'], default: 'at sStation'},
    statusCode: {type: [Number], default: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]},
    statusUpdateTime: {type: [Date], default: [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()]},
    timeSending: {type:Date},
    timeReceived: {type: Date, default: null},
}, { timestamps: true });



module.exports = mongoose.model('Post', Post);


