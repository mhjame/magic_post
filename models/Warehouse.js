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

// Định nghĩa hàm sinh mã tự động không trùng lặp, bao gồm cả chữ và số
function generateUniqueWarehouseCode(usedCodes) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    let newCode;

    do {
        // Sinh ngẫu nhiên một chữ cái và ba chữ số
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        const randomDigits = Math.floor(100 + Math.random() * 900);

        newCode = `${randomChar}${randomDigits}`;
    } while (usedCodes.has(newCode));

    // Đánh dấu mã mới đã được sử dụng
    usedCodes.add(newCode);

    return newCode;
}
// Tạo Model từ Schema
const Warehouse = mongoose.model('Warehouse', warehouseSchema);

// Tạo một danh sách các kho
const warehouses = [
    { name: 'Kho Hà Nội', detailAddress: '256 Nguyễn Văn Cừ, Long Biên, Hà Nội', address: 'Hà Nội' },
    { name: 'Kho Hồ Chí Minh', detailAddress: '789 Lê Lợi, Quận 1, Hồ Chí Minh', address: 'Hồ Chí Minh' },
    { name: 'Kho Đà Nẵng', detailAddress: '123 Trần Phú, Hải Châu, Đà Nẵng', address: 'Đà Nẵng' },
    { name: 'Kho Hải Phòng', detailAddress: '456 Đào Duy Anh, Kiến An, Hải Phòng', address: 'Hải Phòng' },
    { name: 'Kho Cần Thơ', detailAddress: '789 Cách Mạng Tháng Tám, Ninh Kiều, Cần Thơ', address: 'Cần Thơ' },
    { name: 'Kho Huế', detailAddress: '234 Hùng Vương, Huế', address: 'Huế' },
    { name: 'Kho Nha Trang', detailAddress: '567 Lê Thánh Tôn, Nha Trang', address: 'Nha Trang' },
    { name: 'Kho Vũng Tàu', detailAddress: '123 Trần Phú, Bà Rịa - Vũng Tàu', address: 'Vũng Tàu' },
    { name: 'Kho Đồng Nai', detailAddress: '456 Quốc Lộ 1A, Biên Hòa, Đồng Nai', address: 'Đồng Nai' },
    { name: 'Kho Hà Nam', detailAddress: '789 Trần Hưng Đạo, Phủ Lý, Hà Nam', address: 'Hà Nam' },
];

// Sử dụng Set để theo dõi mã đã được sử dụng
const usedCodes = new Set();

warehouses.forEach(warehouse => {
    // Gọi hàm sinh mã tự động không trùng lặp và thêm vào thông tin kho
    warehouse.warehouseCode = generateUniqueWarehouseCode(usedCodes);
});

// // Lưu danh sách kho vào cơ sở dữ liệu
// Warehouse.insertMany(warehouses)
//     .then(result => {
//         console.log('Danh sách kho đã được lưu trữ thành công:', result);
//     })
//     .catch(error => {
//         console.error(error);
//     });

module.exports = Warehouse;
