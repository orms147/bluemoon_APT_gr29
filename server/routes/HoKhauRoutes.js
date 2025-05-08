import { Router } from 'express';
import { getAllHk, getHkById, addHk, deleteHk, updateHk } from '../controllers/HoKhauControllers.js';

const hoKhauRoutes = Router();

// GET 
hoKhauRoutes.get('/danh-sach-ho-khau', getAllHk);
hoKhauRoutes.get('/:id', getHkById);
// POST
hoKhauRoutes.post('/them-ho-khau', addHk);
// DELETE
hoKhauRoutes.delete('/xoa-ho-khau/:id', deleteHk);
// PUT
hoKhauRoutes.put('/cap-nhat-ho-khau/:id', updateHk);

export default hoKhauRoutes;