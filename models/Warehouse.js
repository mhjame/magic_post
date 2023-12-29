const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa Schema cho kho
const warehouseSchema = new Schema({
    name: { type: String },
    warehouseCode: { type: String },
    address: { type: String },
    detailAddress: { type: String },
    adminId: { type: String }, 
}, { timestamps: true });


const Warehouse = mongoose.model('Warehouse', warehouseSchema);

const warehouses = [
    { name: 'Kho Hà Nội', warehouseCode: 'W001', detailAddress: '256 Nguyễn Văn Cừ, Long Biên, Hà Nội', address: 'Hà Nội' },
    { name: 'Kho Thái Nguyên', warehouseCode: 'W002', detailAddress: 'Hoà Bình, Đồng Hỷ, Thái Nguyên', address: 'Thái Nguyên' },
    { name: 'Kho Hải Dương', warehouseCode: 'W003', detailAddress: '123 Trần Phú, Hải Châu, Hải Dương', address: 'Hải Dương' },
    { name: 'Kho Hồ Chí Minh', warehouseCode: 'W004', detailAddress: '789 Lê Lợi, Quận 1, Hồ Chí Minh', address: 'Hồ Chí Minh' },
    { name: 'Kho Hải Phòng', warehouseCode: 'W005', detailAddress: '456 Đào Duy Anh, Kiến An, Hải Phòng', address: 'Hải Phòng' },
    { name: 'Kho Tuyên Quang', warehouseCode: 'W006', detailAddress: 'An Khang, Tuyên Quang', address: 'Tuyên Quang' },
    { name: 'Kho Yên Bái', warehouseCode: 'W007', detailAddress: 'Cường Thịnh, Tp. Yên Bái, Yên Bái', address: 'Yên Bái' },
    { name: 'Kho Phú Thọ', warehouseCode: 'W008', detailAddress: 'Hà Lộc, Phú Thọ', address: 'Phú Thọ' },
    { name: 'Kho Cần Thơ', warehouseCode: 'W009', detailAddress: '789 Cách Mạng Tháng Tám, Ninh Kiều, Cần Thơ', address: 'Cần Thơ' },
    { name: 'Kho Bắc Kan', warehouseCode: 'W0010', detailAddress: 'Đôn Phong, Bạch Thông, Bắc Kạn', address: 'Bắc Kan' },
    { name: 'Kho Lạng Sơn', warehouseCode: 'W0011', detailAddress: 'Tân Mỹ, Văn Lãng, Lạng Sơn', address: 'Lạng Sơn' },
    
];


// Warehouse.insertMany(warehouses)
//     .then(result => {
//         console.log('Danh sách kho đã được lưu trữ thành công:', result);
//     })
//     .catch(error => {
//         console.error(error);
//     });

module.exports = Warehouse;
