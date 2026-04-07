import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Tự động nhận diện môi trường để lấy link API chuẩn
const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://kickszone-web.onrender.com";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Đã thay localhost bằng ${API_URL}
      const res = await axios.get(`${API_URL}/api/orders/all?t=${new Date().getTime()}`);
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- HÀM CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (ĐÃ FIX LINK) ---
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Gửi lệnh cập nhật lên server thật
      await axios.put(`${API_URL}/api/orders/${orderId}/status`, {
        status: newStatus
      });
      toast.success(`✅ Đã chuyển đơn #${orderId.slice(-6)} sang: ${newStatus.toUpperCase()}`);
      fetchOrders(); // Load lại để cập nhật giao diện
    } catch (err) {
      toast.error("❌ Lỗi không thể cập nhật trạng thái!");
      console.error(err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đã giao': return { bg: '#e8f5e9', text: '#2e7d32' }; 
      case 'Đang giao': return { bg: '#fff3e0', text: '#ef6c00' }; 
      case 'Đã hủy': return { bg: '#ffebee', text: '#c62828' }; 
      default: return { bg: '#e3f2fd', text: '#1976d2' }; 
    }
  };

  if (loading) return (
    <div style={{ padding: '50px', textAlign: 'center', fontWeight: 'bold' }}>
        ⏳ Đang tải danh sách đơn hàng cho sếp...
    </div>
  );

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontWeight: '900', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '1px', color: '#111' }}>
        📦 QUẢN LÝ ĐƠN HÀNG KICKSZONE
      </h2>
      
      <div style={{ background: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee', color: '#666', fontSize: '13px', textTransform: 'uppercase' }}>
              <th style={{ padding: '15px' }}>KHÁCH HÀNG</th>
              <th style={{ padding: '15px' }}>SẢN PHẨM</th>
              <th style={{ padding: '15px' }}>TỔNG TIỀN</th>
              <th style={{ padding: '15px' }}>TRẠNG THÁI</th>
              <th style={{ padding: '15px' }}>NGÀY ĐẶT</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? orders.map(order => {
              const style = getStatusStyle(order.status);
              return (
                <tr key={order._id} style={{ borderBottom: '1px solid #f1f1f1', transition: '0.3s' }}>
                  <td style={{ padding: '15px' }}>
                     <b style={{ fontSize: '15px', color: '#111' }}>{order.shippingAddress?.fullName || 'Khách lẻ'}</b><br/>
                     <span style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>📞 {order.shippingAddress?.phone}</span><br/>
                     <small style={{ color: '#888', display: 'block', marginTop: '4px' }}>📍 {order.shippingAddress?.address}</small>
                  </td>
                  <td style={{ padding: '15px', fontSize: '13px' }}>
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: '5px', color: '#333' }}>
                        • {item.name} <span style={{ color: '#888', fontWeight: 'bold' }}>x{item.qty}</span>
                        {item.size && <span style={{ marginLeft: '8px', color: '#ff5722', fontWeight: 'bold' }}>[Size {item.size}]</span>}
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: '15px', fontWeight: '900', color: '#ff5722', fontSize: '16px' }}>
                    {order.totalPrice?.toLocaleString()}đ
                  </td>
                  <td style={{ padding: '15px' }}>
                    <select 
                      value={order.status || 'Chờ xử lý'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid transparent',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        cursor: 'pointer',
                        background: style.bg,
                        color: style.text,
                        outline: 'none',
                        textTransform: 'uppercase'
                      }}
                    >
                      <option value="Chờ xử lý">⏳ CHỜ XỬ LÝ</option>
                      <option value="Đang giao">🚚 ĐANG GIAO</option>
                      <option value="Đã giao">✅ ĐÃ GIAO</option>
                      <option value="Đã hủy">❌ ĐÃ HỦY</option>
                    </select>
                  </td>
                  <td style={{ padding: '15px', color: '#888', fontSize: '12px' }}>
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '50px', color: '#888', fontWeight: '500' }}>Chưa có đơn hàng nào đổ về sếp ơi!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
