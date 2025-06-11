import mongoose from "mongoose";
import ActivityLog from "./ActivityLogModel.js";

const phuongTienSchema = new mongoose.Schema({
    maPhuongTien: {
        type: String,
        required: true,
        unique: true,
    },
    maHoKhau: {
        type: String,
        required: true,
        ref: "HoKhau",
    },
    loaiXe: {
        type: String,
        enum: ["Xe máy", "Ô tô"],
        required: true,
    },
    bienSo: {
        type: String,
        required: true,
    },
    tenChuXe: {
        type: String,
        required: true,
    },
    ngayDangKy: {
        type: Date,
        required: true,
    },
    ghiChu: {
        type: String,
    },
});

phuongTienSchema.post("save", async function (doc) {
    try {
        const content = `${doc.tenChuXe}: ${doc.loaiXe} - Biển số: ${doc.bienSo}`;
        await ActivityLog.create({
            model: "PhuongTien",
            action: "create",
            documentId: doc._id,
            title: "Thêm phương tiện mới",
            content,
        });

    } catch (error) {
        console.log("Lỗi ghi log khi thêm phương tiện", error);
    }
});

phuongTienSchema.post("findOneAndUpdate", async function (doc) {
    try {
        const content = `${doc.tenChuXe}: ${doc.loaiXe} - Biển số: ${doc.bienSo}`;

        await ActivityLog.create({
            model: "PhuongTien",
            action: "update",
            documentId: doc._id,
            title: "Cập nhật phương tiện",
            content,
        });

    } catch (error) {
        console.log("Lỗi ghi log khi cập nhật phương tiện", error);
    }
});

phuongTienSchema.post("findOneAndDelete", async function (doc) {
    try {
        const content = `${doc.tenChuXe}: ${doc.loaiXe} - Biển số: ${doc.bienSo}`;

        await ActivityLog.create({
            model: "PhuongTien",
            action: "delete",
            documentId: doc._id,
            title: "Xóa phương tiện",
            content,
        });

    } catch (error) {
        console.log("Lỗi ghi log khi xóa phương tiện", error);
    }
});

const PhuongTien = mongoose.model("PhuongTien", phuongTienSchema);

export default PhuongTien;