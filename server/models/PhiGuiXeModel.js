import mongoose from "mongoose";
import ActivityLog from "./ActivityLogModel.js";    

const phiGuiXeSchema = new mongoose.Schema({
    maPhiGuiXe: {
        type: String,
        required: true,
        unique: true,
    },
    maPhuongTien: {
        type: String,
        required: true,
        ref: "PhuongTien",
    },
    maHoKhau: {
        type: String,
        required: true,
        ref: "HoKhau",
    },
    thang: {
        type: Number,
        required: true,
    },
    nam: {
        type: Number,
        required: true,
    },
    soTien: {
        type: Number,
        required: true,
    },
    ngayTao: {
        type: Date,
        required: true,
    },
    trangThai: {
        type: String,
        enum: ["Chưa thu", "Đã thu"],
        default: "Chưa thu",
    },
    ngayThu: {
        type: Date,
        default: Date.now,
    },
    nguoiThu: {
        type: String,
    },
    ghiChu: {
        type: String,
    },
});

phiGuiXeSchema.post("save", async function (doc) {
    try {
        const content = `${doc.maPhiGuiXe} - ${doc.soTien} VNĐ`;

        await ActivityLog.create({
            model: "PhiGuiXe",
            action: "create",
            documentId: doc._id,
            title: "Thêm phí gửi xe",
            content,
        });
        
    } catch (error) {
        console.log("Lỗi ghi log khi thêm phí gửi xe", error);
    }
});

phiGuiXeSchema.post("findOneAndUpdate", async function (doc) {
    try {
        const content = `${doc.maPhiGuiXe} - ${doc.soTien} VNĐ`;

        await ActivityLog.create({
            model: "PhiGuiXe",
            action: "update",
            documentId: doc._id,
            title: "Cập nhật phí gửi xe",
            content,
        });

    } catch (error) {
        console.log("Lỗi ghi log khi cập nhật phí gửi xe", error);
    }
});

phiGuiXeSchema.post("findOneAndDelete", async function (doc) {
    try {
        const content = `${doc.maPhiGuiXe} - ${doc.soTien} VNĐ`;

        await ActivityLog.create({  
            model: "PhiGuiXe",
            action: "delete",
            documentId: doc._id,
            title: "Xóa phí gửi xe",
            content,
        });

    } catch (error) {
        console.log("Lỗi ghi log khi xóa phí gửi xe", error);
    }
});

const PhiGuiXe = mongoose.model("PhiGuiXe", phiGuiXeSchema);

export default PhiGuiXe;