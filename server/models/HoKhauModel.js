import mongoose from 'mongoose';

const HoKhauSchema = new mongoose.Schema({
    maHoKhau: { type: String, required: true, unique: true },
    tenChuHo: { type: String, required: true },
    diaChi: { type: String, required: true },
    soThanhVien: { type: Number, required: true },
    ngayLap: { type: Date, required: true },
});

const HoKhau = mongoose.model('HoKhau', HoKhauSchema);

export default HoKhau;