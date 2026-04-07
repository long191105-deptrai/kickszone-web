import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  // Tự động nhận diện môi trường để lấy link API chuẩn
  const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://kickszone-web.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.warning('⚠️ Mật khẩu phải có ít nhất 6 ký tự bác nhé!');
      return;
    }

    try {
      // Đã đổi sang biến API_URL động
      const res = await axios.post(`${API_URL}/api/auth/register`, formData);
      
      toast.success(res.data.message || '🎉 Đăng ký thành công! Đang chuyển sang đăng nhập...');
      
      setTimeout(() => {
        navigate('/login'); 
      }, 1500);

    } catch (err) {
      console.error("Lỗi đăng ký chi tiết:", err.response || err);
      const errorMessage = err.response?.data?.message || 'Lỗi kết nối Server! Bác check lại mạng nhé.';
      toast.error(`❌ ${errorMessage}`);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <div className="auth-box">
          <h2 className="auth-title" style={{ textAlign: 'center', fontWeight: '900', textTransform: 'uppercase', marginBottom: '20px' }}>
             ĐĂNG KÝ TÀI KHOẢN
          </h2>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="auth-form-group">
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Họ và tên</label>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="Nhập họ tên" 
                onChange={handleChange} 
                value={formData.name}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>
            <div className="auth-form-group">
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Email</label>
              <input 
                type="email" 
                name="email" 
                required 
                placeholder="Nhập email" 
                onChange={handleChange} 
                value={formData.email}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>
            <div className="auth-form-group">
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Mật khẩu</label>
              <input 
                type="password" 
                name="password" 
                required 
                placeholder="Tạo mật khẩu (Ít nhất 6 ký tự)" 
                onChange={handleChange} 
                value={formData.password}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>
            <button type="submit" className="auth-btn" style={{ background: '#111', color: '#fff', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                TẠO TÀI KHOẢN
            </button>
          </form>
          <div className="auth-switch" style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
            Đã có tài khoản? <Link to="/login" style={{ color: '#ff5722', fontWeight: 'bold', textDecoration: 'none' }}>Đăng nhập tại đây</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
