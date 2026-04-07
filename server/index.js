const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

// --- 1. CẤU HÌNH MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 

// Cấp quyền truy cập công khai vào thư mục 'uploads' để xem ảnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 2. KẾT NỐI DATABASE ---
// Dùng MongoDB Atlas nên Hosting không bao giờ sợ mất dữ liệu bác nhé!
const mongoURI = 'mongodb+srv://nguyenlong19112005_db_user:6Bwn3KCKDSFVGyPY@cluster0.ppqxaze.mongodb.net/shoesdb?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected thành công!'))
  .catch(err => console.log('❌ Lỗi kết nối DB:', err));

// --- 3. KHAI BÁO ROUTES API ---
// Route xác thực (Đăng ký/Đăng nhập)
app.use('/api/auth', require('./routes/auth'));

// Route sản phẩm
app.use('/api/products', require('./routes/product'));

// Route đơn hàng
app.use('/api/orders', require('./routes/order'));

// Route khách hàng
app.use('/api/users', require('./routes/user'));

// Xử lý lỗi 404 DÀNH RIÊNG CHO API
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: "Không tìm thấy đường dẫn API này!" });
});


// ====================================================================
// --- 4. CẤU HÌNH HOSTING (TÍCH HỢP FRONTEND VÀO BACKEND) ---
// ====================================================================

// Bác đang dùng 1 thư mục 'client' chung cho cả web, nên ta trỏ thẳng vào 'client/build'
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Bắt mọi đường dẫn còn lại (Dấu *) và giao cho React Router tự xử lý 
// (Bao gồm cả '/admin', '/', '/product'...)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


// --- 5. KHỞI CHẠY SERVER ---
// Dùng process.env.PORT để Server tự lấy cổng động khi đưa lên Hosting (Render, Heroku...)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});