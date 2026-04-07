const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Dùng bcryptjs thay vì bcrypt để tránh lỗi cài đặt
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// MẬT KHẨU BÍ MẬT ĐỂ TẠO TOKEN (Thực tế nên giấu trong file .env)
const JWT_SECRET = 'kickszone_secret_key_2026';

// 1. API ĐĂNG KÝ TÀI KHOẢN (/api/auth/register)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Bước 1: Truy vết xem email đã tồn tại chưa
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email này đã được đăng ký! Vui lòng đăng nhập.' });
        }

        // Bước 2: Mã hóa mật khẩu (Không ai đọc được, kể cả Admin)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Bước 3: Lưu vào Database (Mặc định role là 'user')
        user = new User({ 
            name, 
            email, 
            password: hashedPassword,
            role: 'user' 
        });
        await user.save();

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (err) {
        console.error("❌ LỖI ĐĂNG KÝ BACKEND:", err); // In thẳng lỗi ra Terminal để dễ tìm
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});

// 2. API ĐĂNG NHẬP (/api/auth/login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Bước 1: Tìm khách hàng qua email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại! Vui lòng đăng ký.' });
        }

        // Bước 2: So sánh mật khẩu khách nhập với mật khẩu đã mã hóa
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Sai mật khẩu!' });
        }

        // Bước 3: Cấp "Thẻ thành viên" (Token) để khách giữ phiên đăng nhập
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Đăng nhập thành công!',
            token: token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error("❌ LỖI ĐĂNG NHẬP BACKEND:", err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});

// =======================================================================
// 3. API "ĐI CỬA SAU": NÂNG CẤP TÀI KHOẢN LÊN ADMIN (Dùng khi Compass lỗi)
// =======================================================================
router.get('/make-admin/:email', async (req, res) => {
    try {
        const userEmail = req.params.email;
        
        // Tìm user theo email và cập nhật role thành 'admin'
        const updatedUser = await User.findOneAndUpdate(
            { email: userEmail },
            { role: 'admin' },
            { new: true }
        );

        if (updatedUser) {
            res.send(`
                <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                    <h1 style="color: #4caf50;">🎉 CHÚC MỪNG BÁC! 🎉</h1>
                    <h2>Tài khoản <b>${updatedUser.email}</b> đã được nâng cấp thành ADMIN.</h2>
                    <p>Bây giờ bác hãy tắt tab này, quay lại trang web KicksZone, Đăng xuất và Đăng nhập lại nhé!</p>
                </div>
            `);
        } else {
            res.send(`
                <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                    <h1 style="color: #f44336;">❌ TÀI KHOẢN KHÔNG TỒN TẠI ❌</h1>
                    <h2>Không tìm thấy ai dùng email: <b>${userEmail}</b> trong hệ thống.</h2>
                    <p>Bác kiểm tra lại xem gõ đúng email chưa nhé!</p>
                </div>
            `);
        }
    } catch (err) {
        console.error("❌ LỖI NÂNG CẤP ADMIN:", err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});

module.exports = router;