// client/src/pages/public/Profile.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/Header';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:3000/api/users/profile`, { userId: user._id, name });
      localStorage.setItem('user', JSON.stringify(res.data)); // Cập nhật lại local storage
      toast.success("Đã cập nhật thông tin thành công!");
    } catch (err) {
      toast.error("Lỗi cập nhật!");
    }
  };

  return (
    <>
      <Header />
      <div className="container" style={{ maxWidth: '600px', padding: '100px 0' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 style={{ textAlign: 'center', fontWeight: '900', marginBottom: '30px' }}>👤 HỒ SƠ CỦA TÔI</h2>
          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email (Không thể sửa):</label>
              <input type="text" value={email} disabled style={{ width: '100%', padding: '12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Họ và tên:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '15px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              LƯU THAY ĐỔI
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;