import PhiGuiXe from "../models/PhiGuiXeModel.js";
import PhuongTien from "../models/PhuongTienModel.js";

export const getAllPhiGuiXe = async (req, res, next) => {
    try {
        const phiGuiXes = await PhiGuiXe.find();
        res.status(200).json(phiGuiXes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}

export const addPhiGuiXe = async (req, res, next) => {
    try {
        const { maPhiGuiXe, maPhuongTien, maHoKhau, thang, nam, soTien, ngayTao, trangThai, ngayThu, nguoiThu, ghiChu } = req.body;
        const newPhiGuiXe = new PhiGuiXe({ maPhiGuiXe, maPhuongTien, maHoKhau, thang, nam, soTien, ngayTao, trangThai, ngayThu, nguoiThu, ghiChu });
        await newPhiGuiXe.save();
        res.status(201).json(newPhiGuiXe);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}

export const generateMonthlyFees = async (req, res, next) => {
    try {
        const { thang, nam } = req.body;
        
        // Lấy tất cả phương tiện đang hoạt động
        const phuongTiens = await PhuongTien.find();
        
        // Lấy tất cả phí gửi xe hiện tại của tháng
        const existingFees = await PhiGuiXe.find({ thang, nam });
        
        // Tạo Map để dễ dàng truy cập phí hiện tại
        const existingFeesMap = new Map(
            existingFees.map(fee => [fee.maPhuongTien, fee])
        );

        // Tạo Map để theo dõi phương tiện đang hoạt động
        const activeVehiclesMap = new Map(
            phuongTiens.map(pt => [pt.maPhuongTien, pt])
        );

        // Mảng chứa các thao tác cập nhật
        const bulkOps = [];

        // Xử lý cho từng phương tiện đang hoạt động
        for (const phuongTien of phuongTiens) {
            const soTien = phuongTien.loaiXe === "Xe máy" ? 70000 : 1200000;
            const maPhiGuiXe = `PGX${thang}${nam}${phuongTien.maPhuongTien}`;

            if (existingFeesMap.has(phuongTien.maPhuongTien)) {
                // Cập nhật phí hiện tại
                const existingFee = existingFeesMap.get(phuongTien.maPhuongTien);
                if (existingFee.soTien !== soTien || existingFee.maHoKhau !== phuongTien.maHoKhau) {
                    bulkOps.push({
                        updateOne: {
                            filter: { maPhiGuiXe: existingFee.maPhiGuiXe },
                            update: {
                                $set: {
                                    soTien,
                                    maHoKhau: phuongTien.maHoKhau,
                                    ngayCapNhat: new Date()
                                }
                            }
                        }
                    });
                }
            } else {
                // Tạo phí mới
                bulkOps.push({
                    insertOne: {
                        document: {
                            maPhiGuiXe,
                            maPhuongTien: phuongTien.maPhuongTien,
                            maHoKhau: phuongTien.maHoKhau,
                            thang,
                            nam,
                            soTien,
                            ngayTao: new Date(),
                            trangThai: "Chưa thu"
                        }
                    }
                });
            }
        }

        // Vô hiệu hóa phí của các phương tiện không còn hoạt động
        for (const existingFee of existingFees) {
            if (!activeVehiclesMap.has(existingFee.maPhuongTien)) {
                bulkOps.push({
                    updateOne: {
                        filter: { maPhiGuiXe: existingFee.maPhiGuiXe },
                        update: {
                            $set: {
                                trangThai: "Đã hủy",
                                ngayCapNhat: new Date(),
                                ghiChu: "Phương tiện không còn hoạt động"
                            }
                        }
                    }
                });
            }
        }

        // Thực hiện tất cả các thao tác cập nhật
        if (bulkOps.length > 0) {
            await PhiGuiXe.bulkWrite(bulkOps);
        }

        // Trả về danh sách phí sau khi cập nhật
        const updatedFees = await PhiGuiXe.find({ thang, nam });
        res.status(201).json({
            message: "Tạo phí gửi xe thành công",
            data: updatedFees
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}

export const payVehicleFee = async (req, res, next) => {
    try {
        const { maPhiGuiXe } = req.params;
        const phiGuiXe = await PhiGuiXe.findOne({ maPhiGuiXe });
        
        // Kiểm tra phí tồn tại
        if (!phiGuiXe) {
            return res.status(404).json({ message: "Phi gửi xe không tồn tại" });
        }

        // Kiểm tra trạng thái
        if (phiGuiXe.trangThai === "Đã thu") {
            return res.status(400).json({ message: "Phí gửi xe đã được thu trước đó" });
        }

        // Cập nhật thông tin
        phiGuiXe.trangThai = "Đã thu";
        phiGuiXe.ngayThu = new Date();
        phiGuiXe.nguoiThu = req.user ? req.user.fullName : "Admin"; // Lấy thông tin người thu từ session
        
        await phiGuiXe.save();
        
        // Chuyển đổi document thành plain object và trả về
        const updatedPhiGuiXe = phiGuiXe.toObject();
        
        res.status(200).json(updatedPhiGuiXe);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}

export const updatePhiGuiXe = async (req, res, next) => {
    try {
        const { maPhiGuiXe } = req.params;
        const { maPhuongTien, maHoKhau, thang, nam, soTien, ngayTao, trangThai, ngayThu, nguoiThu, ghiChu } = req.body;
        const updatedPhiGuiXe = await PhiGuiXe.findOneAndUpdate({ maPhiGuiXe }, { maPhuongTien, maHoKhau, thang, nam, soTien, ngayTao, trangThai, ngayThu, nguoiThu, ghiChu }, { new: true });
        res.status(200).json(updatedPhiGuiXe);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}

export const deletePhiGuiXe = async (req, res, next) => {
    try {
        const { maPhiGuiXe } = req.params;
        const deletedPhiGuiXe = await PhiGuiXe.findOneAndDelete({ maPhiGuiXe });
        res.status(200).json(deletedPhiGuiXe);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}