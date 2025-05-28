import PhieuNop from '../models/PhieuNopModel.js';

export const getAllPn = async (req, res, next) => {
    try {
        const pns = await PhieuNop.find();
        res.status(200).json(pns);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server bị lỗi'
        });
    }
}

export const addPn = async (req, res, next) => {
    try {
       const {maPhieu, maKhoanThu, maHoKhau, nguoiNop, soTien, ngayNop, ghiChu} = req.body;
        const newPn = new PhieuNop({
            maPhieu,
            maKhoanThu,
            maHoKhau,
            nguoiNop,
            nguoiThu : "Admin",
            soTien,
            ngayNop,
            ghiChu
        })
        await newPn.save();
        res.status(201).json(newPn);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server bị lỗi'
        });
    }
}

export const updatePn = async (req, res, next) => {

}

export const deletePn = async (req, res, next) => {
    try {
        await PhieuNop.findOneAndDelete({maPhieu: req.params.maPhieu});
        res.status(200).json({
            message: 'Xóa phiếu nộp thành công'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server bị lỗi'
        })
    }
}