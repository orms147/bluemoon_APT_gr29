import TamTruTamVang from "../models/TamTruTamVangModel.js";

export const getAllTttv = async (req, res, next) => {
    try {
        const tttvs = await TamTruTamVang.find().sort({ createdAt: -1});
        res.status(200).json(tttvs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server bị lỗi'});
    }
}

export const addTttv = async (req, res, next) => {
    try {
        const { maDangKy, nhanKhauId, loai, tuNgay, denNgay, diaChi, lyDo } = req.body;
        const existedTttv = await TamTruTamVang.findOne({maDangKy});
        if (!existedTttv) {
            const newTttv = new TamTruTamVang({
                maDangKy,
                nhanKhauId,
                loai,
                tuNgay,
                denNgay,
                diaChi,
                lyDo
            });
            await newTttv.save();
            return res.status(201).json(newTttv);
        }
        return res.status(400).json({ message: 'Phiếu đăng ký đã tồn tại'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server bị lỗi'});
    }
}

export const updateTttv = async (req, res, next) => {

}

export const deleteTttv = async (req, res, next) => {
    try {
        const existedTttv = TamTruTamVang.findOne({maDangKy: req.params.maDangky});
        if (existedTttv) {
            await TamTruTamVang.findOneAndDelete(req.params.maDangky);
            return res.status(200).json({message: 'Xóa phiếu đăng ký thành công'});
        }
        return res.status(400).json({ message: 'Phiếu đăng ký không tồn tại'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server bị lỗi'});
    }
}