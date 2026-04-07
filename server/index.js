const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongoURI = 'mongodb+srv://nguyenlong19112005_db_user:6Bwn3KCKDSFVGyPY@cluster0.ppqxaze.mongodb.net/shoesdb?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected thành công!'))
  .catch(err => console.log('❌ Lỗi kết nối DB:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/users', require('./routes/user'));

// Cấu hình hosting
app.use(express.static(path.resolve(__dirname, '../client/build')));

// SỬA TẠI ĐÂY: Dùng Regex để tránh lỗi PathError trên Express 5
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại cổng: ${PORT}`);
});
