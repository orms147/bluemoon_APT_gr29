import mongoose from 'mongoose';

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

const KhoanThu = mongoose.model('KhoanThu', KhoanThuSchema);

export default KhoanThu;