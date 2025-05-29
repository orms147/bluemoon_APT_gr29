import Router from 'express';
import {login, logout, getUserInfo, updateUserInfo, changePassword} from '../controllers/AuthControllers.js';
import { verifyToken } from '../middlewares/AuthMiddlewares.js';

const authRoutes = Router();

authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.get('/user-info', verifyToken, getUserInfo);
authRoutes.put('/update-user-info', verifyToken, updateUserInfo);
authRoutes.put('/change-password', verifyToken, changePassword);

export default authRoutes;