const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Đảm bảo không ai đăng ký trùng email
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user' // Mặc định ai cũng là user
  }
}, { 
  timestamps: true // Tự động ghi lại thời gian tạo tài khoản
});

// LƯU Ý: Đã xóa đoạn userSchema.pre('save') bị lỗi ở đây
// Vì anh em mình đã mã hóa password trực tiếp trong file auth.js rồi!

module.exports = mongoose.model('User', userSchema);