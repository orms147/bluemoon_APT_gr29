import { Router } from 'express';
import { getAllNk, addNk, updateNk, deleteNk, addNktoHk } from '../controllers/NhanKhauController.js'

const nhanKhauRoutes = Router();

// GET
nhanKhauRoutes.get('/danh-sach-nhan-khau', getAllNk);
// POST 
nhanKhauRoutes.post('/them-nhan-khau', addNk);
// PUT 
nhanKhauRoutes.put('/cap-nhat-nhan-khau/:maNhanKhau', updateNk);
nhanKhauRoutes.put('/them-vao-ho-khau/:maNhanKhau', addNktoHk);
// DELETE
nhanKhauRoutes.delete('/xoa-nhan-khau/:maNhanKhau', deleteNk);

export default nhanKhauRoutes;