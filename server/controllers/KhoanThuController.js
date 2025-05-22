import KhoanThu from '../models/KhoanThuModel.js';

export const getAllKt = async (req, res, next) => {
    try {
        const kts = await KhoanThu.find();
        res.status(200).json(kts);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server bị lỗi"});
    }
}

export const addKt = async (req, res, next) => {
    try {
        const {maKhoanThu, tenKhoanThu, loai, soTien, ngayTao, ghiChu} = req.body;
        const newKt = new KhoanThu({
            maKhoanThu,
            tenKhoanThu,
            loai,
            soTien,
            ngayTao,
            ghiChu
        });
        await newKt.save();
        res.status(201).json(newKt);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server bị lỗi"});
    }
}

export const updateKt = async (req, res, next) => {

}

export const deleteKt = async (req, res, next) => {
    try {
        await KhoanThu.findOneAndDelete({maHoKhau: req.params.maHoKhau});
        res.status(200).json({message: "Xóa khoản thu thành công"});
    } catch {       
        console.log(error);
        res.status(500).json({message: "Server bị lỗi"});
    }
}