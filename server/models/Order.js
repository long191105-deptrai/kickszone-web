const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  }, 
  // --- CẬP NHẬT 1: Thêm tên đầy đủ để hiện ở trang Quản lý đơn hàng ---
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  orderItems: { 
    type: Array, 
    required: true 
  }, 
  paymentMethod: { 
    type: String, 
    required: true,
    default: 'COD'
  },
  totalPrice: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  // --- CẬP NHẬT 2: TRẠNG THÁI ĐƠN HÀNG ---
  status: {
    type: String,
    required: true,
    // Chỉ cho phép các giá trị này để tránh lỗi dữ liệu
    enum: ['Chờ xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'],
    default: 'Chờ xử lý'
  },
  // --- CẬP NHẬT 3: Thời gian thanh toán/giao hàng (Nếu cần sau này) ---
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date }
}, { 
  timestamps: true // Tự động tạo createdAt (Ngày đặt hàng)
});

module.exports = mongoose.model('Order', orderSchema);