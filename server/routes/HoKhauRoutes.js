import { Router } from 'express';
import { getAllHk, getHkById, addHk, deleteHk, updateHk } from '../controllers/HoKhauControllers.js';

const hoKhauRoutes = Router();

// GET 
hoKhauRoutes.get('/danh-sach-ho-khau', getAllHk);
hoKhauRoutes.get('/:maHoKhau', getHkById);
// POST
hoKhauRoutes.post('/them-ho-khau', addHk);
// DELETE
hoKhauRoutes.delete('/xoa-ho-khau/:maHoKhau', deleteHk);
// PUT
hoKhauRoutes.put('/cap-nhat-ho-khau/:maHoKhau', updateHk);

export default hoKhauRoutes;