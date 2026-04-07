const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  brand: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  description: { 
    type: String,
    default: "Sản phẩm chất lượng cao từ KicksZone." 
  },
  countInStock: { 
    type: Number, 
    required: true, 
    default: 0,
    min: 0 
  },
  images: [{ 
    type: String,
    required: true 
  }],
  isNewArrival: { 
    type: Boolean, 
    default: false 
  },
  // --- THAY ĐỔI MỚI: Thêm giới tính để chia danh mục Nam/Nữ ---
  gender: {
    type: String,
    required: true,
    enum: ['Nam', 'Nữ', 'Unisex'], // Chỉ cho phép nhập 1 trong 3 giá trị này
    default: 'Nam'
  },
  category: {
    type: String,
    default: "Sneaker"
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);