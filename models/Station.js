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
    id: { type: String}
}, { timestamps: true });

// Tạo Model từ Schema
const Station = mongoose.model('Station', stationSchema);

// Tạo một danh sách các trạm
const stationList = [
    { name: 'Bưu cục Hà Nội 1', address: '140 Khâm Thiên, Phường Khâm Thiên, Quận Đống Đa, TP Hà Nội' },
    { name: 'Bưu cục Hà Nội 2', address: '46 Hàng Cháo, Đống Đa, Hà Nội' },
    { name: 'Bưu cục Hồ Chí Minh 1', address: '1130 Đông Hưng Thuận 5' },
    { name: 'Bưu cục Hồ Chí Minh 2', address: '35/6 Phan Văn Hớn, Q.12, HCM' },
    { name: 'Bưu cục Đà Nẵng 1', address: '123 Trần Phú, Hải Châu, Đà Nẵng' },
    { name: 'Bưu cục Đà Nẵng 2', address: '456 Nguyễn Văn Linh, Hòa An, Cẩm Lệ, Đà Nẵng' },
    { name: 'Bưu cục Hải Phòng 1', address: '789 Lê Lợi, Ngô Quyền, Hải Phòng' },
    { name: 'Bưu cục Hải Phòng 2', address: '321 Hàng Kênh, Lê Chân, Hải Phòng' },
    { name: 'Bưu cục Cần Thơ 1', address: '234 Cách Mạng Tháng Tám, Ninh Kiều, Cần Thơ' },
    { name: 'Bưu cục Cần Thơ 2', address: '567 Lý Tự Trọng, Bình Thủy, Cần Thơ' },
    { name: 'Bưu cục Huế 1', address: '789 Trần Hưng Đạo, Thừa Thiên Huế' },
    { name: 'Bưu cục Huế 2', address: '123 Điện Biên Phủ, Thừa Thiên Huế' },
    { name: 'Bưu cục Nha Trang 1', address: '456 Lê Thánh Tôn, Nha Trang' },
    { name: 'Bưu cục Nha Trang 2', address: '789 Phạm Văn Đồng, Nha Trang' },
    { name: 'Bưu cục Vũng Tàu 1', address: '234 Bà Rịa - Vũng Tàu' },
    { name: 'Bưu cục Vũng Tàu 2', address: '567 Hạ Long, Bà Rịa - Vũng Tàu' },
    { name: 'Bưu cục Đồng Nai 1', address: '789 Quốc Lộ 1A, Biên Hòa, Đồng Nai' },
    { name: 'Bưu cục Đồng Nai 2', address: '123 Phan Chu Trinh, Biên Hòa, Đồng Nai' },
    { name: 'Bưu cục Hà Nam 1', address: '456 Trần Phú, Phủ Lý, Hà Nam' },
    { name: 'Bưu cục Hà Nam 2', address: '789 Trần Hưng Đạo, Phủ Lý, Hà Nam' },
    { name: 'Bưu cục Ngọc Linh', address: '789 Trần Hưng Đạo, Phủ Lý, Hà Nam' },
    // Thêm các tỉnh thành khác nếu cần
  ];


// Lưu danh sách trạm vào cơ sở dữ liệu
// Station.insertMany(stationList, (error, result) => {
//     if (error) {
//         console.error(error);
//     } else {
//         console.log('Danh sách trạm đã được lưu trữ thành công:', result);
//     }
// });

module.exports = Station;
