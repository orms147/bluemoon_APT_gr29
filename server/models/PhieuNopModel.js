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
    try {
        const khoanThu = await KhoanThu.findOne({ maKhoanThu: doc.maKhoanThu });

        const content = khoanThu
            ? `${doc.nguoiNop} - ${khoanThu.tenKhoanThu}`
            : `${doc.nguoiNop}`;

        await ActivityLog.create({
            model: 'PhieuNop',
            action: 'create',
            documentId: doc._id,
            title: 'Nộp phí dịch vụ',
            content,
        });
    } catch (error) {
        console.error('Lỗi ghi log khi tạo phiếu nộp:', error);
    }
});

// Log UPDATE
PhieuNopSchema.post('findOneAndUpdate', async function (doc) {
    if (!doc) return ;
    try {
        const khoanThu = await KhoanThu.findOne({maKhoanThu: doc.maKhoanThu});
        const content = khoanThu 
            ? `${doc.nguoiNop} - ${khoanThu.tenKhoanThu}` 
            : `${doc.nguoiNop}`;

        await ActivityLog.create({
            model: 'PhieuNop',
            action: 'update',
            documentId: doc._id,
            title: 'Cập nhật thông tin phiếu nộp',
            content
        });
    } catch (error) {
        console.log("Lỗi khi ghi log cập nhật phiếu nộp", error);
    }
})

// Log DELETE
PhieuNopSchema.post('findOneAndDelete', async function (doc) {
    if (!doc) return ;
    try {
        const khoanThu = await KhoanThu.findOne({maKhoanThu: doc.maKhoanThu});
        const content = khoanThu 
            ? `${doc.nguoiNop} - ${khoanThu.tenKhoanThu}` 
            : `${doc.nguoiNop}`;

        await ActivityLog.create({
            model: 'PhieuNop',
            action: 'delete',
            documentId: doc._id,
            title: 'Xóa phiếu nộp',
            content
        });
    } catch (error) {
        console.log("Lỗi khi ghi log xóa phiếu nộp:", error);
    }
})

const PhieuNop = mongoose.model("PhieuNop", PhieuNopSchema);

export default PhieuNop;