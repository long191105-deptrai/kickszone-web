import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Tự động nhận diện môi trường để lấy link API chuẩn
const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://kickszone-web.onrender.com";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    const fetchMyOrders = async () => {
      const currentUserId = user?._id || user?.id;

      try {
        if (currentUserId) {
          // Đã thay localhost bằng ${API_URL}
          const res = await axios.get(`${API_URL}/api/orders/mine/${currentUserId}`);
          setOrders(res.data);
        } else {
          console.warn("Không tìm thấy ID người dùng để lấy đơn hàng");
        }
      } catch (err) {
        console.error("Lỗi lấy đơn hàng cá nhân:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyOrders();
  }, [user?._id, user?.id]); 

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đã giao': return '#2e7d32';
      case 'Đang giao': return '#ef6c00';
      case 'Đã hủy': return '#c62828';
      default: return '#1976d2';
    }
  };

  const getDisplayImg = (item) => {
    const imgs = item.images || item.image;
    const path = Array.isArray(imgs) ? imgs[0] : imgs;
    if (!path) return 'https://via.placeholder.com/100';
    if (path.startsWith('http')) return path;
    // Đã sửa trỏ về link Render
    return `${API_URL}${path}`;
  };

  return (
    <>
      <Header />
      <div className="container" style={{ padding: '50px 20px', minHeight: '80vh' }}>
        <h2 style={{ fontWeight: '900', marginBottom: '40px', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '1px' }}>
          🚚 Lịch sử chốt đơn
        </h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
             <p style={{ fontWeight: 'bold' }}>Đang lục lại kho đơn hàng của bác...</p>
          </div>
        ) : orders.length > 0 ? (
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gap: '25px' }}>
            {orders.map(order => (
              <div key={order._id} style={{ border: '1px solid #eee', padding: '25px', borderRadius: '15px', background: '#fff', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #f5f5f5', paddingBottom: '15px', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <span style={{ fontSize: '14px' }}>Mã đơn: <b style={{ color: '#111' }}>#{order._id.slice(-8).toUpperCase()}</b></span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      color: getStatusColor(order.status), 
                      fontWeight: 'bold', 
                      background: `${getStatusColor(order.status)}15`, 
                      padding: '6px 15px', 
                      borderRadius: '20px',
                      fontSize: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {order.status || 'CHỜ XỬ LÝ'}
                    </span>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
                      Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gap: '15px' }}>
                  {order.orderItems.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <img 
                        src={getDisplayImg(item)} 
                        alt={item.name} 
                        style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #f0f0f0' }} 
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#111' }}>{item.name}</div>
                        <div style={{ color: '#666', fontSize: '13px', marginTop: '5px' }}>
                          Size: <b style={{ color: '#111' }}>{item.size}</b> | Số lượng: <b style={{ color: '#111' }}>{item.qty}</b>
                        </div>
                      </div>
                      <div style={{ fontWeight: '900', fontSize: '15px' }}>
                        {(item.price * item.qty).toLocaleString()}đ
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ textAlign: 'right', marginTop: '20px', paddingTop: '15px', borderTop: '1px dotted #ddd' }}>
                  <span style={{ color: '#666', marginRight: '10px', fontSize: '14px' }}>Tổng cộng:</span>
                  <span style={{ color: '#ff5722', fontWeight: '900', fontSize: '22px' }}>
                    {order.totalPrice?.toLocaleString()}đ
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📦</div>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>Bác chưa có đơn hàng nào trong lịch sử.</p>
            <Link to="/" style={{ background: '#111', color: '#fff', padding: '12px 30px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
                ĐI SẮM GIÀY NGAY
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
