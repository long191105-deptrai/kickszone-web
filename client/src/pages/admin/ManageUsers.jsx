import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/users/all');
        setUsers(res.data);
      } catch (err) {
        console.error("Lỗi lấy danh sách khách hàng:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontWeight: '900', marginBottom: '20px', textTransform: 'uppercase' }}>
        👥 Quản lý khách hàng
      </h2>
      
      <div style={{ background: '#fff', borderRadius: '15px', padding: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '15px' }}>TÊN KHÁCH HÀNG</th>
              <th style={{ padding: '15px' }}>EMAIL</th>
              <th style={{ padding: '15px' }}>VAI TRÒ</th>
              <th style={{ padding: '15px' }}>NGÀY THAM GIA</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{user.name}</td>
                <td style={{ padding: '15px' }}>{user.email}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '12px',
                    background: user.role === 'admin' ? '#fff3e0' : '#e8f5e9',
                    color: user.role === 'admin' ? '#ef6c00' : '#2e7d32',
                    fontWeight: 'bold'
                  }}>
                    {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                  </span>
                </td>
                <td style={{ padding: '15px', color: '#888' }}>
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;