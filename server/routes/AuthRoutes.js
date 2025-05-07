import Router from 'express';
import {login, logout} from '../controllers/AuthControllers.js';
const authRoutes = Router();

authRoutes.post('/login', login);
authRoutes.post('/logout', logout);

export default authRoutes;