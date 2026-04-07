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
const mongoURI = 'mongodb+srv://nguyenlong19112005_db_user:6Bwn3KCKDSFVGyPY@cluster0.ppqxaze.mongodb.net/shoesdb?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected thành công!'))
  .catch(err => console.log('❌ Lỗi kết nối DB:', err));

// --- 3. KHAI BÁO ROUTES API ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/users', require('./routes/user'));

// --- FIX LỖI TẠI ĐÂY ---
// Thay vì dùng '/api/*', ta dùng regex hoặc viết đơn giản để tránh lỗi PathError trên Render
app.use('/api', (req, res, next) => {
  // Nếu request vào /api mà không khớp các route trên thì báo 404 API
  if (req.url === '/') return next(); // Cho phép đi tiếp nếu là root api (nếu có)
  res.status(404).json({ message: "Không tìm thấy đường dẫn API này!" });
});


// ====================================================================
// --- 4. CẤU HÌNH HOSTING (TÍCH HỢP FRONTEND VÀO BACKEND) ---
// ====================================================================

// Trỏ thẳng vào thư mục 'build' của client
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Bắt mọi đường dẫn còn lại giao cho React Router
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


// --- 5. KHỞI CHẠY SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại cổng: ${PORT}`);
});
