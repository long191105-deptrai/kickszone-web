import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Cart = () => {
  const { cartItems, removeFromCart, addToCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // --- HÀM XỬ LÝ ẢNH TRONG GIỎ HÀNG (FIX LỖI STARTSWITH) ---
  const getCartImage = (imagesData) => {
    if (!imagesData) return 'https://via.placeholder.com/100';
    
    // Nếu là mảng, lấy ảnh đầu tiên
    const path = Array.isArray(imagesData) ? imagesData[0] : imagesData;

    if (typeof path === 'string' && path.length > 0) {
      return path.startsWith('http') ? path : `http://localhost:3000${path}`;
    }
    return 'https://via.placeholder.com/100';
  };

  const handleIncrease = (item) => {
    addToCart(item, item.size, 1);
  };

  const handleDecrease = (item) => {
    if (item.qty > 1) {
      addToCart(item, item.size, -1);
    }
  };

  return (
    <>
      <Header />
      <div className="container" style={{ padding: '50px 0', minHeight: '70vh' }}>
        <h1 style={{ textAlign: 'center', fontWeight: '900', marginBottom: '40px', textTransform: 'uppercase' }}>
          Giỏ hàng của bác 🛒
        </h1>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>Giỏ hàng đang trống rỗng bác ơi! Đi lựa giày ngay thôi.</p>
            <Link to="/" style={{ display: 'inline-block', marginTop: '20px', padding: '15px 30px', background: '#111', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              QUAY LẠI CỬA HÀNG
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            
            {/* DANH SÁCH SẢN PHẨM */}
            <div style={{ flex: '2', minWidth: '400px' }}>
              {cartItems.map((item) => (
                <div key={item._id + item.size} style={{ display: 'flex', gap: '20px', padding: '20px', borderBottom: '1px solid #eee', alignItems: 'center', background: '#fff', marginBottom: '10px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  {/* SỬA LẠI ĐOẠN HIỂN THỊ ẢNH Ở ĐÂY */}
                  <img 
                    src={getCartImage(item.images)} 
                    alt={item.name} 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} 
                  />
                  
                  <div style={{ flex: '1' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{item.name}</h3>
                    <p style={{ color: '#888', margin: '0 0 10px 0' }}>Size: <span style={{ fontWeight: 'bold', color: '#111' }}>{item.size}</span></p>
                    <p style={{ fontWeight: '700', color: '#ff5722' }}>{item.price?.toLocaleString()}đ</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <button onClick={() => handleDecrease(item)} style={{ padding: '5px 12px', border: 'none', background: 'none', cursor: 'pointer' }}>-</button>
                    <span style={{ padding: '0 10px', fontWeight: 'bold' }}>{item.qty}</span>
                    <button onClick={() => handleIncrease(item)} style={{ padding: '5px 12px', border: 'none', background: 'none', cursor: 'pointer' }}>+</button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item._id, item.size)}
                    style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', padding: '10px' }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
              
              <button onClick={clearCart} style={{ marginTop: '20px', background: 'none', border: '1px solid #ccc', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', color: '#666' }}>
                Xóa sạch giỏ hàng
              </button>
            </div>

            {/* PHẦN TỔNG TIỀN & THANH TOÁN */}
            <div style={{ flex: '1', minWidth: '300px', background: '#f9f9f9', padding: '30px', borderRadius: '15px', height: 'fit-content' }}>
              <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #111', paddingBottom: '10px' }}>TỔNG ĐƠN HÀNG</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span>Tạm tính:</span>
                <span>{totalPrice.toLocaleString()}đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span>Phí vận chuyển:</span>
                <span style={{ color: '#4caf50', fontWeight: 'bold' }}>MIỄN PHÍ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                <span style={{ fontWeight: 'bold', fontSize: '20px' }}>TỔNG CỘNG:</span>
                <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#ff5722' }}>{totalPrice.toLocaleString()}đ</span>
              </div>

              <button 
                onClick={() => navigate('/checkout')} 
                style={{
                  width: '100%',
                  background: '#111',
                  color: '#fff',
                  padding: '18px',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginTop: '30px',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
              >
                TIẾN HÀNH THANH TOÁN
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;