import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/Header';

// Tự động nhận diện môi trường để lấy link API chuẩn
const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://kickszone-web.onrender.com";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const currentUserId = user?._id || user?.id;

    if (!currentUserId) {
      toast.error("⚠️ Không tìm thấy ID người dùng. Bác thử đăng nhập lại nhé!");
      return;
    }

    try {
      // Đã thay localhost bằng ${API_URL}
      const res = await axios.put(`${API_URL}/api/users/profile`, { 
        userId: currentUserId, 
        name 
      });
      
      // Cập nhật lại local storage với dữ liệu mới từ server
      localStorage.setItem('user', JSON.stringify(res.data)); 
      toast.success("🎉 Đã cập nhật thông tin thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật profile:", err);
      toast.error(err.response?.data?.message || "Lỗi cập nhật!");
    }
  };

  return (
    <>
      <Header />
      <div className="container" style={{ maxWidth: '600px', padding: '100px 0', minHeight: '80vh' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 style={{ textAlign: 'center', fontWeight: '900', marginBottom: '30px', textTransform: 'uppercase' }}>
            👤 HỒ SƠ CỦA TÔI
          </h2>
          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email (Không thể sửa):</label>
              <input 
                type="text" 
                value={email} 
                disabled 
                style={{ width: '100%', padding: '15px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '10px', cursor: 'not-allowed', color: '#888' }} 
              />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Họ và tên:</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Nhập tên mới của bác"
                style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', outline: 'none', fontSize: '16px' }} 
              />
            </div>
            <button 
              type="submit" 
              style={{ 
                width: '100%', padding: '18px', background: '#111', color: '#fff', 
                border: 'none', borderRadius: '10px', fontWeight: 'bold', 
                cursor: 'pointer', fontSize: '16px', transition: '0.3s',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
              }}
            >
              LƯU THAY ĐỔI
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
