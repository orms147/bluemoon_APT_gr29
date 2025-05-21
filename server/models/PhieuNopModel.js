import mongoose from "mongoose";
import ActivityLog from "./ActivityLogModel.js";
import KhoanThu from "./KhoanThuModel.js"

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

// Log CREATE
PhieuNopSchema.post('save', async function (doc) {
    const khoanThu = await KhoanThu.findOne(doc.maKhoanThu)
    const content = `${doc.nguoiNop} - ${khoanThu.tenKhoanThu}`
    await ActivityLog.create({
        model: 'PhieuNop',
        action: 'create',
        documentId: doc._id,
        title: 'Nộp phí dịch vụ',
        content
    })
})

// Log UPDATE
PhieuNopSchema.post('findOneAndUpdate', async function (doc) {
    const khoanThu = await KhoanThu.findOne(doc.maKhoanThu)
    const content = `${doc.nguoiNop} - ${khoanThu.tenKhoanThu}`
    await ActivityLog.create({
        model: 'PhieuNop',
        action: 'update',
        documentId: doc._id,
        title: 'Cập nhật thông tin phiếu nộp',
        content
    })
})

// Log DELETE
PhieuNopSchema.post('findOneAndDelete', async function (doc) {
    const khoanThu = await KhoanThu.findOne(doc.maKhoanThu)
    const content = `${doc.nguoiNop} - ${khoanThu.tenKhoanThu}`
    await ActivityLog.create({
        model: 'PhieuNop',
        action: 'delete',
        documentId: doc._id,
        title: 'Xóa phiếu nộp',
        content
    })
})

const PhieuNop = mongoose.model("PhieuNop", PhieuNopSchema);

export default PhieuNop;