const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa Schema cho trạm
const stationSchema = new Schema({
    name: { type: String },
    address: { type: String },
    stationCode: { type: String },
    warehouseId: { type: String },
    detailAddress: { type: String },
    adminId: { type: String },
}, { timestamps: true });

// Tạo Model từ Schema
const Station = mongoose.model('Station', stationSchema);

// Tạo một danh sách các trạm
const stationList = [
    { name: 'Bưu cục Hà Nội 1', detailAddress: '140 Khâm Thiên, Phường Khâm Thiên, Quận Đống Đa, TP Hà Nội' },
    { name: 'Bưu cục Hà Nội 2', detailAddress: '46 Hàng Cháo, Đống Đa, Hà Nội' },
    { name: 'Bưu cục Hồ Chí Minh 1', detailAddress: '1130 Đông Hưng Thuận 5' },
    { name: 'Bưu cục Hồ Chí Minh 2', detailAddress: '35/6 Phan Văn Hớn, Q.12, HCM' },
    { name: 'Bưu cục Đà Nẵng 1', detailAddress: '123 Trần Phú, Hải Châu, Đà Nẵng' },
    { name: 'Bưu cục Đà Nẵng 2', detailAddress: '456 Nguyễn Văn Linh, Hòa An, Cẩm Lệ, Đà Nẵng' },
    { name: 'Bưu cục Hải Phòng 1', detailAddress: '789 Lê Lợi, Ngô Quyền, Hải Phòng' },
    { name: 'Bưu cục Hải Phòng 2', detailAddress: '321 Hàng Kênh, Lê Chân, Hải Phòng' },
    { name: 'Bưu cục Cần Thơ 1', detailAddress: '234 Cách Mạng Tháng Tám, Ninh Kiều, Cần Thơ' },
    { name: 'Bưu cục Cần Thơ 2', detailAddress: '567 Lý Tự Trọng, Bình Thủy, Cần Thơ' },
    { name: 'Bưu cục Huế 1', detailAddress: '789 Trần Hưng Đạo, Thừa Thiên Huế' },
    { name: 'Bưu cục Huế 2', detailAddress: '123 Điện Biên Phủ, Thừa Thiên Huế' }

    // Thêm các tỉnh thành khác nếu cần
  ];



// Station.insertMany(stationList, (error, result) => {
//     if (error) {
//         console.error(error);
//     } else {
//         console.log('Danh sách trạm đã được lưu trữ thành công:', result);
//     }
// });

module.exports = Station;
