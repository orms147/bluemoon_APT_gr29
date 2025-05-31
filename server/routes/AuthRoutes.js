import Router from 'express';
import {login, logout, getUserInfo, updateUserInfo, changePassword, addProfileImage} from '../controllers/AuthControllers.js';
import { verifyToken } from '../middlewares/AuthMiddlewares.js';
import multer from 'multer';

const authRoutes = Router();
const upload = multer({dest: "uploads/profiles/"});

authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.get('/user-info', verifyToken, getUserInfo);
authRoutes.put('/update-user-info', verifyToken, updateUserInfo);
authRoutes.put('/change-password', verifyToken, changePassword);
authRoutes.post(
    '/upload-avatar', 
    verifyToken,
    upload.single("avatar"), 
    addProfileImage
);


export default authRoutes;