import mongoose from "mongoose";

const TamTruTamVangSchema = new mongoose.Schema({
    maDangKy: {
        type: String, 
        required: true, 
        unique: true,
    },
    nhanKhauId: {
        type: String,
        ref: "Nhan Khau",
        required: true
    }, 
    loai: {
        type: String,
        enum: ["Tạm trú", "Tạm vắng"],
        required: true,
    },
    tuNgay: {
        type: Date,
        required: true,
        default: Date.now()
    },
    denNgay: {
        type: Date,
        required: true
    },
    diaChi: {
        type: String,
        required: true
    },
    lyDo: {
        type: String,
        required: true
    },
});

const TamTruTamVang = mongoose.model("TamTruTamVang", TamTruTamVangSchema);

export default TamTruTamVang;