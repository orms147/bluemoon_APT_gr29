import mongoose from 'mongoose';
import ActivityLog from './ActivityLogModel.js';

const KhoanThuSchema = new mongoose.Schema({
    maKhoanThu: {
        type: String,
        required: true,
        unique: true
    },
    tenKhoanThu: {
        type: String,
        required: true
    },
    loai: {
        type: String,
        enum: ["Bắt buộc", "Tự nguyện"],
        required: true
    },
    soTien: {
        type: Number,
    },
    ghiChu: {
        type: String,
    },
    ngayTao: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// Log CREATE
KhoanThuSchema.post('save', async function (doc) {
    const content = `${doc.tenKhoanThu} - ${doc.soTien} VNĐ`
    await ActivityLog.create({
        model: 'KhoanThu',
        action: 'create',
        documentId: doc._id,
        title: 'Thêm khoản thu mới',
        content
    })
})

// Log UPDATE
KhoanThuSchema.post('findOneAndUpdate', async function (doc) {
    const content = `${doc.tenKhoanThu} - ${doc.soTien} VNĐ` 
    await ActivityLog.create({
        model: 'KhoanThu',
        action: 'update',
        documentId: doc._id,
        title: 'Cập nhật thông tin khoản thu',
        content
    })
})

// Log DELETE
KhoanThuSchema.post('findOneAndDelete', async function (doc) {
    const content = `${doc.tenKhoanThu} - ${doc.soTien} VNĐ` 
    await ActivityLog.create({
        model: 'KhoanThu',
        action: 'delete',
        documentId: doc._id,
        title: 'Xóa thông tin khoản thu',
        content
    })
})

const KhoanThu = mongoose.model('KhoanThu', KhoanThuSchema);

export default KhoanThu;