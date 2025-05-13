import mongoose from "mongoose";

const PhieuNopSchema = new mongoose.Schema({
    maPhieu: {
        type: String,
        required: true,
        unique: true
    },
    maKhoanThu: {
        type: String, 
        ref: 'KhoanThu',
        required: true, 
    },
    maHoKhau: {
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
        type: String,
        required: true,
    },
    ghiChu: {
        type: String, 
    }
});

const PhieuNop = mongoose.model("PhieuNop", PhieuNopSchema);

export default PhieuNop;