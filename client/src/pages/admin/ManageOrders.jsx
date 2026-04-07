import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/orders/all');
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

  // --- HÀM CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ---
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, {
        status: newStatus
      });
      toast.success(`Đã chuyển trạng thái sang: ${newStatus}`);
      fetchOrders(); // Load lại để cập nhật giao diện
    } catch (err) {
      toast.error("Lỗi không thể cập nhật trạng thái!");
      console.error(err);
    }
  };

  // Hàm helper để đổ màu cho từng trạng thái
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đã giao': return { bg: '#e8f5e9', text: '#2e7d32' }; // Xanh lá
      case 'Đang giao': return { bg: '#fff3e0', text: '#ef6c00' }; // Cam
      case 'Đã hủy': return { bg: '#ffebee', text: '#c62828' }; // Đỏ
      default: return { bg: '#e3f2fd', text: '#1976d2' }; // Xanh dương (Chờ xử lý)
    }
  };

  if (loading) return <div style={{ padding: '30px' }}>Đang tải danh sách đơn hàng...</div>;

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontWeight: '900', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        📦 QUẢN LÝ ĐƠN HÀNG KICKSZONE
      </h2>
      
      <div style={{ background: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee', color: '#666', fontSize: '14px' }}>
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
                <tr key={order._id} style={{ borderBottom: '1px solid #f1f1f1', transition: '0.3s' }} className="order-row">
                  <td style={{ padding: '15px' }}>
                     <b style={{ fontSize: '15px' }}>{order.shippingAddress?.fullName || 'Khách lẻ'}</b><br/>
                     <span style={{ fontSize: '13px', color: '#555' }}>📞 {order.shippingAddress?.phone}</span><br/>
                     <small style={{ color: '#888' }}>📍 {order.shippingAddress?.address}</small>
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px' }}>
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: '5px' }}>
                        • {item.name} <span style={{ color: '#888' }}>x{item.qty}</span>
                        {item.size && <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>[Size {item.size}]</span>}
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: '15px', fontWeight: '900', color: '#111', fontSize: '16px' }}>
                    {order.totalPrice?.toLocaleString()}đ
                  </td>
                  <td style={{ padding: '15px' }}>
                    {/* --- THANH CHỌN TRẠNG THÁI --- */}
                    <select 
                      value={order.status || 'Chờ xử lý'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        cursor: 'pointer',
                        background: style.bg,
                        color: style.text,
                        outline: 'none'
                      }}
                    >
                      <option value="Chờ xử lý">⏳ CHỜ XỬ LÝ</option>
                      <option value="Đang giao">🚚 ĐANG GIAO</option>
                      <option value="Đã giao">✅ ĐÃ GIAO</option>
                      <option value="Đã hủy">❌ ĐÃ HỦY</option>
                    </select>
                  </td>
                  <td style={{ padding: '15px', color: '#888', fontSize: '13px' }}>
                    {new Date(order.createdAt).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '50px', color: '#888' }}>Chưa có đơn hàng nào được đặt.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;