const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Đảm bảo đường dẫn tới Model User đúng

// API: Lấy tất cả khách hàng
router.get('/all', async (req, res) => {
  try {
    // Lấy tất cả user, nhưng loại bỏ mật khẩu để bảo mật
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách khách hàng" });
  }
});

module.exports = router;