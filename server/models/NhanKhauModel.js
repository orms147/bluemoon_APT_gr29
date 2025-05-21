import mongoose from 'mongoose'
import ActivityLog from './ActivityLogModel.js';

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
        required: true
    },
    hoKhauId: {
        type: String,
        ref: "HoKhau",
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

// Log CREATE
NhanKhauSchema.post('save', async function (doc) {
    const content = `${doc.hoTen} - ${doc.cccd}`
    await ActivityLog.create({
        model: 'NhanKhau',
        action: 'create',
        documentId: doc._id,
        title: 'Thêm nhân khẩu mới',
        content
    })
})

// Log UPDATE
NhanKhauSchema.post('findOneAndUpdate', async function (doc) {
    const content = `${doc.hoTen} - ${doc.cccd}` 
    await ActivityLog.create({
        model: 'NhanKhau',
        action: 'update',
        documentId: doc._id,
        title: 'Cập nhật thông tin nhân khẩu',
        content
    })
})

// Log DELETE
NhanKhauSchema.post('findOneAndDelete', async function (doc) {
    const content = `${doc.hoTen} - ${doc.cccd}` 
    await ActivityLog.create({
        model: 'NhanKhau',
        action: 'delete',
        documentId: doc._id,
        title: 'Xóa thông tin nhân khẩu',
        content
    })
})

const NhanKhau = mongoose.model('NhanKhau', NhanKhauSchema);

export default NhanKhau;