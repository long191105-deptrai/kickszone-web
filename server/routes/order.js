const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// --- 1. API: TẠO ĐƠN HÀNG MỚI ---
router.post('/', async (req, res) => {
  try {
    const { userId, orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    console.log("--- BẮT ĐẦU XỬ LÝ ĐƠN HÀNG ---");
    console.log("User ID:", userId);

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống bác ơi!" });
    }

    // BƯỚC 1: KIỂM TRA TỒN KHO THẬT KỸ
    for (const item of orderItems) {
      const productId = item.product || item._id;
      const product = await Product.findById(productId);
      
      if (!product) {
        console.log(`❌ Không tìm thấy sản phẩm ID: ${productId}`);
        return res.status(404).json({ message: `Sản phẩm ${item.name} không tồn tại!` });
      }

      // Ép kiểu số để so sánh cho chuẩn
      if (Number(product.countInStock) < Number(item.qty)) {
        return res.status(400).json({ 
          message: `Đôi ${product.name} chỉ còn ${product.countInStock} đôi, không đủ ${item.qty} đôi bác đặt!` 
        });
      }
    }

    // BƯỚC 2: LƯU ĐƠN HÀNG VÀO DATABASE
    const newOrder = new Order({
      userId, 
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      status: 'Chờ xử lý' 
    });

    const savedOrder = await newOrder.save();
    console.log("✅ Đã lưu đơn hàng thành công!");

    // BƯỚC 3: TRỪ KHO (ĐOẠN QUAN TRỌNG NHẤT)
    const updatePromises = orderItems.map(async (item) => {
      const productId = item.product || item._id;
      
      // Dùng $inc với số âm để trừ, dùng Number() để ép kiểu số
      const updated = await Product.findByIdAndUpdate(
        productId,
        { $inc: { countInStock: -Number(item.qty) } },
        { new: true } // Trả về data mới sau khi trừ
      );

      if (updated) {
        console.log(`🚀 Đã trừ kho! ${updated.name} còn lại: ${updated.countInStock}`);
      } else {
        console.log(`⚠️ Cảnh báo: Không tìm thấy ID ${productId} để trừ kho`);
      }
    });

    await Promise.all(updatePromises);

    res.status(201).json(savedOrder);

  } catch (error) {
    console.error("❌ LỖI HỆ THỐNG:", error.message);
    res.status(500).json({ message: "Lỗi tạo đơn hàng: " + error.message });
  }
});

// ... (Giữ nguyên các API get mine, all và put status bên dưới của bác)
// --- 2. API: LẤY ĐƠN HÀNG CỦA RIÊNG KHÁCH ---
router.get('/mine/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy đơn hàng cá nhân" });
  }
});

router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy đơn hàng Admin" });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
  }
});

module.exports = router;