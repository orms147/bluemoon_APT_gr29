import mongoose from 'mongoose'

const NhanKhauSchema = new mongoose.Schema({
    maNhanKhau: {
        type: String,
        required: true,
        unique: true
    },
    hoTen: {
        type: String,
        required: true
    },
    ngaySinh: {
        type: Date,
        required: true
    },
    gioiTinh: {
        type: String,
        enum: ["Nam", "Nữ"],
        required: true
    },
    cccd: {
        type: String,
        // required: true
    },
    hoKhauId: {
        type: String,
        ref: "HoKhau",
        // required: true
    },
    tonGiao: {
        type: String,
    },
    ngheNghiep: {
        type: String,
    },
    noiLamViec: {
        type: String,
    },
    quanHe: {
        type: String,
    }
});

const NhanKhau = mongoose.model('NhanKhau', NhanKhauSchema);

export default NhanKhau;