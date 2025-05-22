import { Router } from 'express';
import { getAllTttv, addTttv, updateTttv, deleteTttv } from '../controllers/TamTruTamVangControllers.js';

const tttvRoutes = Router();

// GET 
tttvRoutes.get('/danh-sach-tam-tru-tam-vang', getAllTttv);
// POST 
tttvRoutes.post('/them-tam-tru-tam-vang', addTttv);
// PUT  
tttvRoutes.put('/cap-nhat-tam-tru-tam-vang', updateTttv);
// DELETE
tttvRoutes.delete('/xoa-tam-tru-tam-vang/:maDangKy', deleteTttv);

export default tttvRoutes;