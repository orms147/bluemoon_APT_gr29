import { Router } from 'express';
import { getAllKt, addKt, updateKt, deleteKt} from '../controllers/KhoanThuController.js';

const khoanThuRoutes = Router();

// GET 
khoanThuRoutes.get('/danh-sach-khoan-thu', getAllKt);
// POST
khoanThuRoutes.post('/them-khoan-thu',addKt);
// PUT
khoanThuRoutes.put('/cap-nhat-khoan-thu/:maKhoanThu', updateKt);
// DELETE
khoanThuRoutes.delete('/xoa-khoan-thu/:maKhoanThu', deleteKt);

export default khoanThuRoutes;