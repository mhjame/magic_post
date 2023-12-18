const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Schema = mongoose.Schema;

const Post = new Schema({
    name: { type: String },
    genre: { type: String },
    weight: { type: Number },
    cost: { type: Number },
    payState: { type: String, enum: ['done', 'not'], default: 'not' },
    senderName: { type: String },
    receiverName: { type: String },
    senderAddress: { type: String },
    receiverAddress: { type: String },
    senderPhoneNumber: { type: String },
    receiverPhoneNumber: { type: String },
    senderId: { type: String },
    receiverId: { type: String },
    senderStationEId: { type: String },
    senderStationId: { type: String },
    senderWarehouseId: { type: String },
    receiverStationId: { type: String },
    receiverWarehouseId: { type: String },
    convertedVolume: { type: Number },
    actualWeight: { type: Number },
    specialServices: { type: String },
    COD: { type: Number },
    othersPay: { type: Number },
    serviceNotes: { type: String },
    guidePending: { type: String },
    status: {
        type: String, enum: ['in process', 'received', 'on way to reveiver', 'at rStation', 'on way to rStation', 'at rWarehouse',
            'on way to rWarehourse', 'at sWarehouse', 'on way to sWarehouse', 'at sStation'], default: 'in process'
    },
    statusCode: { type: [Number], default: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
    statusUpdateTime: { type: [Date], default: [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()] },
    timeSending: { type: Date },
    timeReceived: { type: Date },
    id: { type: String },
    qrcodeContent: { type: String }
}, { timestamps: true });

// // Hàm tạo mã QR cho mỗi Post khi được tạo mới
// async function createQRCodeForNewPost(newPostData) {
//     try {
//         // Tạo nội dung mã QR từ thông tin của Post
//         const qrCodeContent = JSON.stringify({
//             postId: newPostData._id,
//             name: newPostData.name,
//             sender: newPostData.senderName,
//             receiver: newPostData.receiverName,
//             // ... thêm các trường khác nếu cần
//         });

//         // Tạo mã QR và lưu vào trường qrcodeContent của bài đăng
//         const qrCodeDataUrl = await QRCode.toDataURL(qrCodeContent);
//         newPostData.qrcodeContent = qrCodeDataUrl;

//         // Lưu bài đăng mới có chứa nội dung mã QR
//         const createdPost = new mongoose.model('Post', newPostData);
//         await createdPost.save();


//         console.log(`Mã QR cho bài đăng ${createdPost._id} đã được tạo.`);
//         return createdPost;
//     } catch (error) {
//         console.error('Lỗi khi tạo mã QR cho bài đăng mới:', error);
//         throw error;
//     }
// };
// // Hàm tạo và lưu bài đăng mới
// async function createAndSavePost(postData) {
//     try {
//         const createdPost = await createQRCodeForNewPost(postData);
//         console.log('Bài đăng mới đã được tạo và lưu thành công:', createdPost);
//     } catch (error) {
//         console.error('Lỗi khi tạo và lưu bài đăng mới:', error);
//     }
// }

// // Tạo và lưu một vài bài đăng
// const post1 = {
//     name: 'BuukiencuaA', // Đảm bảo giá trị của name là chuỗi hợp lệ
//     senderName: 'Người gửi A',
//     receiverName: 'Người nhận A',
//     // ... các trường khác
// };

// const post2 = {
//     name: 'BuukiencuaB', // Đảm bảo giá trị của name là chuỗi hợp lệ
//     senderName: 'Người gửi B',
//     receiverName: 'Người nhận B',
//     // ... các trường khác
// };


// createAndSavePost(post1);
// createAndSavePost(post2);

module.exports = mongoose.model('Post', Post);


