import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import {compare} from 'bcrypt';
import { Types } from 'mongoose';

const maxAge = 3 * 24 * 60 * 60 * 1000; 

const createToken = (username, userId) => {
    return jwt.sign({username, userId}, process.env.JWT_KEY, {expiresIn: maxAge});
}

export const login = async (req, res, next) => {
  try {
    const {username, password} = req.body;
    if (!username || !password){
        return res.status(400).json({message: 'Tên tài khoản và mật khẩu không được để trống'});
    }
    const user = await User.findOne({username});
    if (!user) {
        return res.status(404).json({message: 'Tài khoản không tồn tại'});
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({message: 'Mật khẩu không đúng'});
    }
    res.cookie("jwt", createToken(username, user._id),{
        maxAge,
        secure: true,
        sameSite: 'none',
    });

    return res.json({
        message: 'Đăng nhập thành công',
        user: {
            username: user.username,
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        }
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Server bị lỗi'});
  }
};

export const logout = async (req, res, next) => {
    try {
        res.cookie("jwt", "", {maxAge:1, secure:true, sameSite: 'none'});
        
        return res.status(200).json({message: 'Đăng xuất thành công'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server bị lỗi'});
    }
}

export const getUserInfo = async (req, res) => {
  const userId = req.user?.id; // req.user có tồn tại chưa?

  if (!userId) {
    return res.status(400).json({ message: "User not authenticated." });
  }

  const user = await User.findById(userId);
  res.json(user);
};