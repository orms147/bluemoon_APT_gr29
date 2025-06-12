import { Router } from "express";
import { getAllPhiGuiXe, addPhiGuiXe, updatePhiGuiXe, deletePhiGuiXe, generateMonthlyFees, payVehicleFee } from "../controllers/PhiGuiXeControllers.js";

const phiGuiXeRoutes = Router();

phiGuiXeRoutes.get("/danh-sach-phi-gui-xe", getAllPhiGuiXe);
phiGuiXeRoutes.post("/them-phi-gui-xe", addPhiGuiXe);
phiGuiXeRoutes.post("/tao-phi-hang-thang", generateMonthlyFees);
phiGuiXeRoutes.put("/thanh-toan-phi/:maPhiGuiXe", payVehicleFee);
phiGuiXeRoutes.put("/cap-nhat-phi-gui-xe/:maPhiGuiXe", updatePhiGuiXe);
phiGuiXeRoutes.delete("/xoa-phi-gui-xe/:maPhiGuiXe", deletePhiGuiXe);


export default phiGuiXeRoutes;