import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import {compare} from 'bcrypt';
import { renameSync } from 'fs';


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
        httpOnly: true,
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
        res.clearCookie("jwt", {
          httpOnly: true,
          secure: true,
          sameSite: 'none'
        });

        return res.status(200).json({message: 'Đăng xuất thành công'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server bị lỗi'});
    }
}

export const getUserInfo = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(400).json({ message: "User not authenticated." });
  }

  const user = await User.findById(userId);
  res.status(200).json(user);
};

export const updateUserInfo = async (req, res) => {
  const userId = req.user?.userId;
  console.log(req.user)
  if (!userId) {
    return res.status(400).json({ message: "User not authenticated." });
  }
  const { fullname, email, phone } = req.body;
  const user = await User.findOneAndUpdate({_id: userId}, {
    fullname,
    email,
    phone
  }, {new: true});
  res.status(200).json(user);
};

export const changePassword = async (req, res) => {
  try { 
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: "User not authenticated." });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword){
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu mới và xác nhận mật khẩu không khớp." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự." });
    }

    // Tìm user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
    }

    user.password = newPassword; // Set mật khẩu mới (chưa hash)
    await user.save(); // Middleware pre('save') sẽ tự động hash

    res.status(200).json({ message: "Đổi mật khẩu thành công." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server bị lỗi" });
  }
}


export const addProfileImage = async (req, res, next) => {
  try {
        if (!req.file) {
            return res.status(400).send("File is required");
        }

        const date = Date.now();
        let fileName = date + req.file.originalname;
        renameSync(req.file.path, `uploads/profiles/${fileName}`);

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            {avatar: `uploads/profiles/${fileName}`},
            {new: true, runValidators: true},
        );

        return res.status(200).json({
            avatar: updatedUser.avatar,
        });
  } catch(error){
    console.log(error);
    res.status(500).json({message: "Server bị lỗi"});
  }
}