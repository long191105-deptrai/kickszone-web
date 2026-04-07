import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 1. Tải giỏ hàng từ LocalStorage khi khởi động
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  // 2. Lưu vào LocalStorage mỗi khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 3. Hàm thêm vào giỏ (Đã chuẩn hóa ID và Số lượng)
  const addToCart = (product, selectedSize, quantity) => {
    setCartItems((prevItems) => {
      // Đảm bảo lấy đúng ID bất kể Backend trả về _id hay id
      const productId = product._id || product.id;
      
      // Kiểm tra xem đôi giày cùng size đó đã có trong giỏ chưa
      const isExist = prevItems.find(item => 
        (item._id === productId || item.id === productId) && item.size === selectedSize
      );

      if (isExist) {
        return prevItems.map(item =>
          ((item._id === productId || item.id === productId) && item.size === selectedSize)
            ? { ...item, qty: Number(item.qty) + Number(quantity) } // Ép kiểu số tránh lỗi cộng chuỗi
            : item
        );
      }

      // Khi thêm mới, ta chỉ trích xuất những trường thực sự cần thiết
      const newItem = {
        _id: productId, // Luôn giữ tên là _id cho đồng bộ
        id: productId,  // Dự phòng thêm id cho chắc
        name: product.name,
        image: Array.isArray(product.images) ? product.images[0] : (product.image || product.images),
        images: product.images || [product.image],
        price: Number(product.price),
        size: selectedSize,
        qty: Number(quantity),
        countInStock: product.countInStock // Giữ lại để kiểm tra ở trang Cart
      };

      return [...prevItems, newItem];
    });
  };

  // 4. Hàm xóa sản phẩm
  const removeFromCart = (id, size) => {
    setCartItems(cartItems.filter(item => !((item._id === id || item.id === id) && item.size === size)));
  };

  // 5. Hàm xóa sạch giỏ hàng (Dùng khi thanh toán xong)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);