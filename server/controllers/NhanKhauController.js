import NhanKhau from '../models/NhanKhauModel.js';

export const getAllNk = async (req, res, next) => {
    try {
        const nks = await NhanKhau.find();
        res.status(200).json(nks);
        console.log(res)
    } catch (error){
        console.log(error);
        res.status(500).json({
            message: 'Server bị lỗi'
        });
    }
};

export const addNk = async (req, res, next) => {
    try {
        const {maNhanKhau, hoTen, ngaySinh, gioiTinh, cccd } = req.body;
        const newNk = new NhanKhau({
            maNhanKhau,
            hoTen,
            ngaySinh,
            gioiTinh,
            cccd
        });
        await newNk.save();
        res.status(201).json(newNk);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server bị lỗi'
        });
    }
};

export const updateNk = async (req, res, next) => {

}

export const deleteNk = async (req, res, next) => {
    try {
        await NhanKhau.findOneAndDelete({maNhanKhau: req.params.maNhanKhau})
        res.status(200).json({
            message: 'Xóa thành công'
        });
    } catch (error){
        console.log(error);
        res.status(500).json({
            message: 'Server bị lỗi'
        });
    }
}