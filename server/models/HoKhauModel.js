<<<<<<< HEAD
import mongoose from 'mongoose';
import ActivityLog from './ActivityLogModel.js';

const HoKhauSchema = new mongoose.Schema({
    maHoKhau: { type: String, required: true, unique: true },
    tenChuHo: { type: String, required: true },
    diaChi: { type: String, required: true },
    soThanhVien: { type: Number, required: true },
    ngayLap: { type: Date, required: true },
});

// Log CREATE
HoKhauSchema.post('save', async function (doc) {
    const content = `${doc.tenChuHo} - ${doc.diaChi}`
    await ActivityLog.create({
        model: 'HoKhau',
        action: 'create',
        documentId: doc._id,
        title: 'Thêm hộ khẩu mới',
        content
    })
})

// Log UPDATE
HoKhauSchema.post('findOneAndUpdate', async function (doc) {
    const content = `${doc.tenChuHo} - ${doc.diaChi}` 
    if (!doc) return
    await ActivityLog.create({
        model: 'HoKhau',
        action: 'update',
        documentId: doc._id,
        title: 'Cập nhật thông tin hộ khẩu',
        content
    })
})

// Log DELETE
HoKhauSchema.post('findOneeAndDelete', async function (doc) {
    const content = `${doc.tenChuHo} - ${doc.diaChi}` 
    if (!doc) return
    await ActivityLog.create({
        model: 'HoKhau',
        action: 'delete',
        documentId: doc._id,
        title: 'Xóa thông tin hộ khẩu',
        content
    })
})


const HoKhau = mongoose.model('HoKhau', HoKhauSchema);

=======
import mongoose from 'mongoose';
import ActivityLog from './ActivityLogModel.js';

const HoKhauSchema = new mongoose.Schema({
    maHoKhau: { type: String, required: true, unique: true },
    tenChuHo: { type: String, required: true },
    diaChi: { type: String, required: true },
    soThanhVien: { type: Number, required: true },
    ngayLap: { type: Date, required: true },
});

// Log CREATE
HoKhauSchema.post('save', async function (doc) {
    try {   
        const content = `${doc.tenChuHo} - ${doc.diaChi}`;
        await ActivityLog.create({
            model: 'HoKhau',
            action: 'create',
            documentId: doc._id,
            title: 'Thêm hộ khẩu mới',
            content
        });
    } catch (error) {
        console.log("Lỗi ghi log khi thêm hộ khẩu", error);
    }
});

// Log UPDATE
HoKhauSchema.post('findOneAndUpdate', async function (doc) {
    if (!doc) return;
    try {   
        const content = `${doc.tenChuHo} - ${doc.diaChi}`;
        
        await ActivityLog.create({
            model: 'HoKhau',
            action: 'update',
            documentId: doc._id,
            title: 'Cập nhật thông tin hộ khẩu',
            content
        });
    } catch (error) {
        console.log("Lỗi ghi log khi cập nhật hộ khẩu", error);
    }
});

// Log DELETE
HoKhauSchema.post('findOneAndDelete', async function (doc) {
    if (!doc) return;
    try {   
        const content = `${doc.tenChuHo} - ${doc.diaChi}`;
        
        await ActivityLog.create({
            model: 'HoKhau',
            action: 'delete',
            documentId: doc._id,
            title: 'Xóa thông tin hộ khẩu',
            content
        });
    } catch (error) {
        console.log("Lỗi ghi log khi xoá hộ khẩu", error);
    }
});


const HoKhau = mongoose.model('HoKhau', HoKhauSchema);

>>>>>>> quanna
export default HoKhau;