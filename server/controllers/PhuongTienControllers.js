import PhuongTien from "../models/PhuongTienModel.js";

export const getAllPhuongTien = async (req, res, next) => {
    try {
        const phuongTiens = await PhuongTien.find();
        res.status(200).json(phuongTiens);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}

export const addPhuongTien = async (req, res, next) => {
    try {
        const { maPhuongTien, maHoKhau, loaiXe, bienSo, tenChuXe, ngayDangKy, ghiChu } = req.body;
        const newPhuongTien = new PhuongTien({ maPhuongTien, maHoKhau, loaiXe, bienSo, tenChuXe, ngayDangKy, ghiChu });
        await newPhuongTien.save();
        res.status(201).json(newPhuongTien);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}

export const updatePhuongTien = async (req, res, next) => {
    try {
        const { maPhuongTien } = req.params;
        const { maHoKhau, loaiXe, bienSo, tenChuXe, ngayDangKy, ghiChu } = req.body;
        const updatedPhuongTien = await PhuongTien.findOneAndUpdate({ maPhuongTien }, { maHoKhau, loaiXe, bienSo, tenChuXe, ngayDangKy, ghiChu }, { new: true });
        res.status(200).json(updatedPhuongTien);
    } catch (error){
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}

export const deletePhuongTien = async (req, res, next) => {
    try {
        const { maPhuongTien } = req.params;
        const phuongTien = await PhuongTien.findOneAndDelete({ maPhuongTien });
        res.status(200).json(phuongTien);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}