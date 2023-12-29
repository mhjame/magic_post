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
    { name: 'Bưu cục Hà Nội', address: 'Hà Nội', stationCode: 'S001', detailAddress: '140 Khâm Thiên, Phường Khâm Thiên, Quận Đống Đa, TP Hà Nội' },
    { name: 'Bưu cục Thái Nguyên', address: 'Thái Nguyên', stationCode: 'S002', detailAddress: 'Hoà Bình, Đồng Hỷ, Thái Nguyên' },
    { name: 'Bưu cục Hải Dương', address: 'Hải Dương', stationCode: 'S003', detailAddress: '1130 Đông Hải, Hải Dương' },
    { name: 'Bưu cục Hồ Chí Minh', address: 'Hồ Chí Minh', stationCode: 'S004', detailAddress: '35/6 Phan Văn Hớn, Q.12, HCM' },
    { name: 'Bưu cục Hải Phòng', address: 'Hải Phòng', stationCode: 'S005', detailAddress: '130-177 P. Tôn Thất Thuyết, Phan Bội Châu, Hồng Bàng, Hải Phòng' },
    { name: 'Bưu cục Tuyên Quang', address: 'Tuyên Quang', stationCode: 'S006', detailAddress: 'An Khang, Tuyên Quang' },
    { name: 'Bưu cục Yên Bái', address: 'Yên Bái', stationCode: 'S007', detailAddress: 'Cường Thịnh, Tp. Yên Bái, Yên Bái' },
    { name: 'Bưu cục Phú Thọ', address: 'Phú Thọ', stationCode: 'S008', detailAddress: 'Hà Lộc, Phú Thọ' },
    { name: 'Bưu cục Cần Thơ', address: 'Cần Thơ', stationCode: 'S009', detailAddress: '234 Cách Mạng Tháng Tám, Ninh Kiều, Cần Thơ' },
    { name: 'Bưu cục Bắc Kan', address: 'Bắc Kan', stationCode: 'S0010', detailAddress: 'Đôn Phong, Bạch Thông, Bắc Kạn' },
    { name: 'Bưu cục Lạng Sơn', address: 'Lạng Sơn', stationCode: 'S0011', detailAddress: 'Tân Mỹ, Văn Lãng, Lạng Sơn' }
  
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
