import mongoose from "mongoose";
import ActivityLog from "./ActivityLogModel.js";
import NhanKhau from "./NhanKhauModel.js"

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



// Log CREATE
TamTruTamVangSchema.post('save', async function (doc) {
    try {
        const nhanKhau = await NhanKhau.findOne({maNhanKhau: doc.nhanKhauId});
        const content = nhanKhau 
            ? nhanKhau.hoTen
            : '';

        const title = doc.loai == "Tạm trú" ? "Đăng ký tạm trú" : "Đăng ký tạm vắng"
        await ActivityLog.create({
            model: 'PhieuNop',
            action: 'create',
            documentId: doc._id,
            title,
            content
        });
    } catch (error) {
        console.log("Lỗi ghi log khi tạo đăng ký tạm trú tạm vắng", error);
    }
});

// Log UPDATE
TamTruTamVangSchema.post('findOneAndUpdate', async function (doc) {
    if (!doc) return;
    try {
        const nhanKhau = await NhanKhau.findOne({maNhanKhau: doc.nhanKhauId});
        const content = nhanKhau 
            ? nhanKhau.hoTen
            : '';
        const title = doc.loai == "Tạm trú" ? "Cập nhật đăng ký tạm trú" : "Cập nhật đăng ký tạm vắng";

        await ActivityLog.create({
            model: 'PhieuNop',
            action: 'update',
            documentId: doc._id,
            title,
            content
        });
    } catch (error) {
        console.log("Lỗi ghi log khi cập nhật đăng ký tạm trú tạm vắng", error);
    }
});

// Log DELETE
TamTruTamVangSchema.post('findOneAndDelete', async function (doc) {
    if (!doc) return;
    try {
        const nhanKhau = await NhanKhau.findOne({maNhanKhau: doc.nhanKhauId});
        const content = nhanKhau 
            ? nhanKhau.hoTen
            : '';
        const title = doc.loai == "Tạm trú" ? "Xóa đăng ký tạm trú" : "Xóa đăng ký tạm vắng";

        await ActivityLog.create({
            model: 'PhieuNop',
            action: 'delete',
            documentId: doc._id,
            title,
            content
        });
    } catch (error) {
        console.log("Lỗi ghi log khi xóa đăng ký tạm trú tạm vắng", error);
    }    
});

const TamTruTamVang = mongoose.model("TamTruTamVang", TamTruTamVangSchema);

export default TamTruTamVang;