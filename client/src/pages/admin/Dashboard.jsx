import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Tự động nhận diện môi trường để lấy link API chuẩn
const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://kickszone-web.onrender.com";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);

  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : { name: 'Admin' };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Đã thay localhost bằng ${API_URL}
        const res = await axios.get(`${API_URL}/api/orders/all?t=${new Date().getTime()}`);
        const data = res.data;
        setOrders(data);
        
        const revenue = data.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        const pending = data.filter(order => order.status === 'Chờ xử lý' || order.status === 'Pending').length;

        setStats({
          totalRevenue: revenue,
          totalOrders: data.length,
          pendingOrders: pending
        });
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy đơn hàng hệ thống:", err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const renderStatusBadge = (status) => {
    let bgColor = '#f5f5f5';
    let textColor = '#333';

    if (status === 'Chờ xử lý' || status === 'Pending') {
      bgColor = '#fff3e0'; textColor = '#e65100'; 
    } else if (status === 'Đang giao' || status === 'Shipping') {
      bgColor = '#e3f2fd'; textColor = '#1565c0'; 
    } else if (status === 'Hoàn thành' || status === 'Delivered') {
      bgColor = '#e8f5e9'; textColor = '#2e7d32'; 
    } else if (status === 'Đã hủy' || status === 'Cancelled') {
      bgColor = '#ffebee'; textColor = '#c62828'; 
    }

    return (
      <span style={{ background: bgColor, color: textColor, padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
        {status || 'Chờ xử lý'}
      </span>
    );
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px', fontWeight: 'bold', color: '#111' }}>
        ⏳ Đang tổng hợp dữ liệu kinh doanh cho sếp...
    </div>
  );

  return (
    <div style={{ padding: '30px 40px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", width: '100%', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Lời chào sếp */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#111', fontWeight: '900', textTransform: 'uppercase' }}>
          Chào sếp {user.name?.split(' ').pop()}! 👋
        </h1>
        <p style={{ margin: 0, color: '#666' }}>Tình hình KicksZone đang rất "nhiệt", sếp kiểm tra nhé!</p>
      </div>

      {/* THẺ THỐNG KÊ (CARDS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '40px' }}>
        
        {/* Card 1: Doanh Thu */}
        <div style={{ background: 'linear-gradient(135deg, #111 0%, #333 100%)', color: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', opacity: 0.8, letterSpacing: '1px' }}>TỔNG DOANH THU</p>
            <span style={{ fontSize: '24px' }}>💰</span>
          </div>
          <h2 style={{ margin: '15px 0 0 0', fontSize: '32px', fontWeight: '900' }}>{stats.totalRevenue.toLocaleString()} đ</h2>
        </div>

        {/* Card 2: Tổng Đơn */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f1f1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#888', letterSpacing: '1px' }}>TỔNG ĐƠN HÀNG</p>
            <span style={{ fontSize: '24px' }}>📦</span>
          </div>
          <h2 style={{ margin: '15px 0 0 0', fontSize: '32px', fontWeight: '900', color: '#111' }}>{stats.totalOrders} <span style={{fontSize: '16px', color: '#888'}}>đơn</span></h2>
        </div>

        {/* Card 3: Đơn Chờ Xử Lý */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f1f1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#888', letterSpacing: '1px' }}>CHỜ XỬ LÝ</p>
            <span style={{ fontSize: '24px' }}>⏳</span>
          </div>
          <h2 style={{ margin: '15px 0 0 0', fontSize: '32px', fontWeight: '900', color: '#ff5722' }}>{stats.pendingOrders} <span style={{fontSize: '16px', color: '#888'}}>đơn</span></h2>
        </div>

      </div>

      {/* BẢNG DANH SÁCH ĐƠN HÀNG */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f1f1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#111' }}>10 ĐƠN HÀNG GẦN NHẤT</h3>
          <Link to="/admin/orders" style={{ color: '#ff5722', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>Xem chi tiết tất cả →</Link>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '12px', fontWeight: '800' }}>MÃ ĐƠN</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '12px', fontWeight: '800' }}>SĐT KHÁCH</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '12px', fontWeight: '800' }}>SL MÓN</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '12px', fontWeight: '800' }}>THÀNH TIỀN</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '12px', fontWeight: '800' }}>TRẠNG THÁI</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '12px', fontWeight: '800' }}>NGÀY ĐẶT</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.slice(0, 10).map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                  <td style={{ padding: '15px 20px', color: '#888', fontSize: '12px', fontFamily: 'monospace' }}>#{order._id.slice(-6).toUpperCase()}</td>
                  <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#111', fontSize: '14px' }}>{order.shippingAddress?.phone || 'N/A'}</td>
                  <td style={{ padding: '15px 20px', color: '#555' }}>{order.orderItems?.length || 0} món</td>
                  <td style={{ padding: '15px 20px', color: '#111', fontWeight: '800' }}>{order.totalPrice?.toLocaleString()} đ</td>
                  <td style={{ padding: '15px 20px' }}>{renderStatusBadge(order.status)}</td>
                  <td style={{ padding: '15px 20px', color: '#666', fontSize: '13px' }}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Chưa có đơn hàng nào đổ về sếp ơi!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
