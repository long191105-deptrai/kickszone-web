import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);

  // Lấy thông tin sếp từ LocalStorage để chào hỏi
  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : { name: 'Admin' };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/orders/all?t=${new Date().getTime()}`);
        const data = res.data;
        setOrders(data);
        
        // Tính toán thống kê chuyên sâu hơn
        const revenue = data.reduce((acc, order) => acc + order.totalPrice, 0);
        const pending = data.filter(order => order.status === 'Chờ xử lý' || order.status === 'Pending').length;

        setStats({
          totalRevenue: revenue,
          totalOrders: data.length,
          pendingOrders: pending
        });
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Hàm tạo nhãn (Badge) trạng thái đơn hàng cho đẹp mắt
  const renderStatusBadge = (status) => {
    let bgColor = '#f5f5f5';
    let textColor = '#333';

    if (status === 'Chờ xử lý' || status === 'Pending') {
      bgColor = '#fff3e0'; textColor = '#e65100'; // Cam
    } else if (status === 'Đang giao' || status === 'Shipping') {
      bgColor = '#e3f2fd'; textColor = '#1565c0'; // Xanh dương
    } else if (status === 'Hoàn thành' || status === 'Delivered') {
      bgColor = '#e8f5e9'; textColor = '#2e7d32'; // Xanh lá
    } else if (status === 'Đã hủy' || status === 'Cancelled') {
      bgColor = '#ffebee'; textColor = '#c62828'; // Đỏ
    }

    return (
      <span style={{ background: bgColor, color: textColor, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
        {status || 'Chờ xử lý'}
      </span>
    );
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontSize: '20px', fontWeight: 'bold' }}>⏳ Đang tải dữ liệu hệ thống...</div>;

  return (
    <div style={{ padding: '30px 40px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", width: '100%', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Lời chào sếp */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#111', fontWeight: '900', textTransform: 'uppercase' }}>
          Chào sếp {user.name.split(' ').pop()}! 👋
        </h1>
        <p style={{ margin: 0, color: '#666' }}>Đây là tình hình kinh doanh của KicksZone hôm nay.</p>
      </div>

      {/* THẺ THỐNG KÊ (CARDS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '40px' }}>
        
        {/* Card 1: Doanh Thu */}
        <div style={{ background: 'linear-gradient(135deg, #ff5722 0%, #ff9800 100%)', color: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(255, 87, 34, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', opacity: 0.9 }}>TỔNG DOANH THU</p>
            <span style={{ fontSize: '24px', background: 'rgba(255,255,255,0.2)', padding: '5px 10px', borderRadius: '10px' }}>💰</span>
          </div>
          <h2 style={{ margin: '15px 0 0 0', fontSize: '36px', fontWeight: '900' }}>{stats.totalRevenue.toLocaleString()} đ</h2>
        </div>

        {/* Card 2: Tổng Đơn */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f1f1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#888' }}>TỔNG ĐƠN HÀNG</p>
            <span style={{ fontSize: '24px', background: '#f5f5f5', padding: '5px 10px', borderRadius: '10px' }}>📦</span>
          </div>
          <h2 style={{ margin: '15px 0 0 0', fontSize: '36px', fontWeight: '900', color: '#111' }}>{stats.totalOrders} <span style={{fontSize: '18px', color: '#888'}}>đơn</span></h2>
        </div>

        {/* Card 3: Đơn Chờ Xử Lý */}
        <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f1f1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#888' }}>CHỜ XỬ LÝ</p>
            <span style={{ fontSize: '24px', background: '#fff3e0', padding: '5px 10px', borderRadius: '10px' }}>⏳</span>
          </div>
          <h2 style={{ margin: '15px 0 0 0', fontSize: '36px', fontWeight: '900', color: '#e65100' }}>{stats.pendingOrders} <span style={{fontSize: '18px', color: '#888'}}>đơn</span></h2>
        </div>

      </div>

      {/* BẢNG DANH SÁCH ĐƠN HÀNG */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f1f1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111' }}>ĐƠN HÀNG MỚI NHẤT</h3>
          <Link to="/admin/orders" style={{ color: '#ff5722', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Xem tất cả →</Link>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '13px', borderRadius: '10px 0 0 10px' }}>MÃ ĐƠN HÀNG</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '13px' }}>SĐT KHÁCH</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '13px' }}>SỐ LƯỢNG</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '13px' }}>TỔNG TIỀN</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '13px' }}>TRẠNG THÁI</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '13px', borderRadius: '0 10px 10px 0' }}>NGÀY ĐẶT</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.slice(0, 10).map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #f1f1f1', transition: '0.2s' }}>
                  <td style={{ padding: '18px 20px', color: '#888', fontSize: '13px', fontFamily: 'monospace' }}>#{order._id.substring(0, 8)}...</td>
                  <td style={{ padding: '18px 20px', fontWeight: 'bold', color: '#111' }}>{order.shippingAddress?.phone || 'N/A'}</td>
                  <td style={{ padding: '18px 20px', color: '#555', fontWeight: '600' }}>{order.orderItems?.length || 0} sản phẩm</td>
                  <td style={{ padding: '18px 20px', color: '#ff5722', fontWeight: '900' }}>{order.totalPrice?.toLocaleString()} đ</td>
                  <td style={{ padding: '18px 20px' }}>{renderStatusBadge(order.status)}</td>
                  <td style={{ padding: '18px 20px', color: '#666', fontSize: '14px' }}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Chưa có đơn hàng nào trong hệ thống.</td>
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