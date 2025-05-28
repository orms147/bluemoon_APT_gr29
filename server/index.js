import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';
import hoKhauRoutes from './routes/HoKhauRoutes.js';
import nhanKhauRoutes from './routes/NhanKhauRoutes.js';
import khoanThuRoutes from './routes/KhoanThuRoutes.js';
import phieuNopRoutes from './routes/PhieuNopRoutes.js';
import tttvRoutes from './routes/TamTruTamVangRoutes.js';
import activityRoutes from './routes/ActivityLogRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/ho-khau', hoKhauRoutes);
app.use('/api/nhan-khau', nhanKhauRoutes);
app.use('/api/khoan-thu', khoanThuRoutes);
app.use('/api/phieu-nop', phieuNopRoutes);
app.use('/api/tam-tru-tam-vang', tttvRoutes);
app.use('/api/activity', activityRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose.connect(databaseURL)
    .then(() => console.log('Connected to DB successfully.'))
    .catch((err) => console.log(err.message));
