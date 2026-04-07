const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

// --- 1. CẤU HÌNH LƯU TRỮ ẢNH (MULTER) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// --- 2. API: LẤY TẤT CẢ SẢN PHẨM ---
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy danh sách: " + err.message });
    }
});

// --- 3. API: LẤY CHI TIẾT 1 SẢN PHẨM ---
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "ID không hợp lệ hoặc lỗi server" });
    }
});

// --- 4. API: THÊM SẢN PHẨM MỚI (FIX LỖI ÉP KIỂU) ---
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, brand, price, description, countInStock, isNewArrival, gender, images } = req.body;
        
        let imagesArray = [];

        // 1. Xử lý link ảnh từ mảng JSON gửi xuống
        if (images) {
            try {
                imagesArray = JSON.parse(images);
            } catch (e) {
                imagesArray = images.split(',').map(img => img.trim()).filter(img => img !== "");
            }
        }

        // 2. Nếu có file upload từ máy, đẩy lên đầu mảng
        if (req.file) {
            imagesArray.unshift(`/uploads/${req.file.filename}`);
        }

        // --- ĐOẠN NÀY LÀ CỐT LÕI ĐỂ HIỆN TRANG CHỦ ---
        const newProduct = new Product({
            name,
            brand,
            price: Number(price),
            description,
            countInStock: Number(countInStock) || 0,
            images: imagesArray, 
            // Ép kiểu cực mạnh: Nếu là chuỗi "true" thì biến thành true (boolean)
            isNewArrival: String(isNewArrival).trim() === 'true', 
            gender: gender || 'Nam'
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error("Lỗi thêm sản phẩm:", err);
        res.status(400).json({ message: "Không thể thêm sản phẩm: " + err.message });
    }
});

// --- 5. API: XÓA SẢN PHẨM ---
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa sản phẩm thành công' });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi xóa: " + err.message });
    }
});

module.exports = router;