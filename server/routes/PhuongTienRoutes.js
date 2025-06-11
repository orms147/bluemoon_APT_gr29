import { Router } from "express";
import { getAllPhuongTien, addPhuongTien, updatePhuongTien, deletePhuongTien } from "../controllers/PhuongTienControllers.js";

const phuongTienRoutes = Router();

// GET 
phuongTienRoutes.get("/danh-sach-phuong-tien", getAllPhuongTien);
// POST 
phuongTienRoutes.post("/them-phuong-tien", addPhuongTien);
// PUT 
phuongTienRoutes.put("/cap-nhat-phuong-tien/:maPhuongTien", updatePhuongTien);
// DELETE
phuongTienRoutes.delete("/xoa-phuong-tien/:maPhuongTien", deletePhuongTien);

export default phuongTienRoutes;
