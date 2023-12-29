const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
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


const postList = [
    {
        name: 'Package siêu cấp',
        cost: 20,
        senderStationCode: 'W001',
        senderWarehouseCode: 'W001',
        receiverStationCode: 'S002',
        receiverWarehouseCode: 'W002',
        status: 'on way to receiver',
        statusCode: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        statusUpdateTime: [
            new Date('2023-01-01T12:00:00+07:00'),
            new Date('2023-01-02T09:30:00+07:00'),
            new Date('2023-01-03T15:45:00+07:00'),
            new Date('2023-01-04T18:20:00+07:00'),
            new Date('2023-01-05T11:10:00+07:00'),
            new Date('2023-01-06T14:30:00+07:00'),
            new Date('2023-01-07T08:45:00+07:00'),
            new Date('2023-01-08T16:00:00+07:00'),
            new Date('2023-01-09T10:15:00+07:00'),
            new Date('2023-01-10T13:40:00+07:00')
        ]
    },
    {
        name: 'Package 2',
        cost: 30,
        senderStationCode: 'W001',
        senderWarehouseCode: 'W001',
        receiverStationCode: 'S002',
        receiverWarehouseCode: 'W002',
        status: 'on way to receiver',
        statusCode: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        statusUpdateTime: [
            new Date('2023-02-01T10:00:00+07:00'),
            new Date('2023-02-02T12:45:00+07:00'),
            new Date('2023-02-03T17:30:00+07:00'),
            new Date('2023-02-04T14:20:00+07:00'),
            new Date('2023-02-05T09:40:00+07:00'),
            new Date('2023-02-06T11:15:00+07:00'),
            new Date('2023-02-07T13:50:00+07:00'),
            new Date('2023-02-08T15:25:00+07:00'),
            new Date('2023-02-09T19:00:00+07:00'),
            new Date('2023-02-10T08:30:00+07:00')
        ]
    },
    // Thêm các bài đăng khác nếu cần
];
const Post = mongoose.model('Post', PostSchema);
// Post.insertMany(postList)
//     .then(result => {
//         console.log('Danh sách kho đã được lưu trữ thành công:', result);
//     })
//     .catch(error => {
//         console.error(error);
//     });

module.exports = Post 


