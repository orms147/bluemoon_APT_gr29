import mongoose from "mongoose";

const PhieuNopTienSchema = new mongoose.Schema({
    maPhieu: {
        type: String,
        required: true,
        unique: true
    },
    khoanThuId: {
        type: String, 
        ref: 'KhoanThu',
        required: true, 
    },
    hoKhauId: {
        type: String,
        ref: 'HoKhau',
        required: true, 
    },
    nguoiNop: {
        type: String,
        required: true, 
    }, 
    soTien: {
        type: Number,
        required: true, 
    },
    ngayNop: {
        type: Date,
        required: true, 
        default: Date.now,
    },
    nguoiThu: {
        type: Date,
        required: true,
    },
    ghiChu: {
        type: String, 
    }
});

const PhieuNopTien = mongoose.model("PhieuNopTien", PhieuNopTienSchema);

export default PhieuNopTien;