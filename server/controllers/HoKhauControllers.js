import HoKhau from '../models/HoKhauModel.js'

export const getAllHk = async (req, res) => {
    try {
        const hks = await HoKhau.find().sort({maHoKhau: -1});
        res.status(200).json(hks)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}

export const getHkById = async (req, res) => {
    try {
        const hk = await HoKhau.findOne({maHoKhau: req.params.maHoKhau});
        res.status(200).json(hk);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}

export const addHk = async (req, res) => {
    try {
        const {maHoKhau, tenChuHo, diaChi, soThanhVien, ngayLap} = req.body;
        const newHk = new HoKhau({
            maHoKhau,
            tenChuHo,
            diaChi,
            soThanhVien,
            ngayLap
        });
        await newHk.save();
        res.status(201).json(newHk);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}

export const deleteHk = async (req, res) => {
    try {
        const hk = await HoKhau.findOneAndDelete({maHoKhau: req.params.maHoKhau});
        res.status(200).json(hk);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}

export const updateHk = async (req, res) => {
    try {
        const {maHoKhau, tenChuHo, diaChi, soThanhVien, ngayLap} = req.body;
        const updatedHk = await HoKhau.findOneAndUpdate(
            { maHoKhau },
            { tenChuHo, diaChi, soThanhVien, ngayLap },
            { new: true }
        );
        res.status(200).json(updatedHk);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server bị lỗi" });
    }
}