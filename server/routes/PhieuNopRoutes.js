import { Router } from 'express';
import { getAllPn, addPn, updatePn, deletePn} from '../controllers/PhieuNopControllers.js';

const phieuNopRoutes = Router();

// GET 
phieuNopRoutes.get('/danh-sach-phieu-nop', getAllPn);
// POST 
phieuNopRoutes.post('/them-phieu-nop', addPn);
// PUT 
phieuNopRoutes.put('/cap-nhat-phieu-nop', updatePn);
// DELETE
phieuNopRoutes.delete('/xoa-phieu-nop/:maPhieu', deletePn);

export default phieuNopRoutes;