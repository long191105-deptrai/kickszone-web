import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Tự động nhận diện môi trường để lấy link API chuẩn
const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://kickszone-web.onrender.com";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Đã thay localhost bằng ${API_URL}
        const res = await axios.get(`${API_URL}/api/users/all`);
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy danh sách khách hàng:", err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return (
    <div style={{ padding: '50px', textAlign: 'center', fontWeight: 'bold' }}>
      ⏳ Đang liệt kê danh sách khách hàng của KicksZone...
    </div>
  );

  return (
    <div style={{ padding: '30px 40px', background: '#f8f9fa', minHeight: '100vh' }}>
      <h2 style={{ fontWeight: '900', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '1px', color: '#111' }}>
        👥 Quản lý khách hàng
      </h2>
      
      <div style={{ 
        background: '#fff', 
        borderRadius: '20px', 
        padding: '25px', 
        boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
        border: '1px solid #f1f1f1'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee', color: '#666', fontSize: '13px', textTransform: 'uppercase' }}>
              <th style={{ padding: '15px 20px' }}>TÊN KHÁCH HÀNG</th>
              <th style={{ padding: '15px 20px' }}>EMAIL</th>
              <th style={{ padding: '15px 20px' }}>VAI TRÒ</th>
              <th style={{ padding: '15px 20px' }}>NGÀY THAM GIA</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #f1f1f1', transition: '0.2s' }}>
                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#111' }}>
                  {user.name}
                </td>
                <td style={{ padding: '15px 20px', color: '#555' }}>{user.email}</td>
                <td style={{ padding: '15px 20px' }}>
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontSize: '11px',
                    background: user.role === 'admin' ? '#fff3e0' : '#e8f5e9',
                    color: user.role === 'admin' ? '#ef6c00' : '#2e7d32',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                  </span>
                </td>
                <td style={{ padding: '15px 20px', color: '#888', fontSize: '13px' }}>
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  Chưa có khách hàng nào tham gia KicksZone sếp ơi!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
