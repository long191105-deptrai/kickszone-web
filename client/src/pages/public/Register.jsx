// client/src/pages/public/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import { toast } from 'react-toastify'; // Dùng toast cho đẹp và đồng bộ

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra độ dài mật khẩu ngay trên trình duyệt
    if (formData.password.length < 6) {
      toast.warning('⚠️ Mật khẩu phải có ít nhất 6 ký tự bác nhé!');
      return;
    }

    try {
      // 2. Gửi dữ liệu lên Backend
      const res = await axios.post('http://localhost:3000/api/auth/register', formData);
      
      toast.success(res.data.message || '🎉 Đăng ký thành công! Đang chuyển sang đăng nhập...');
      
      // Đợi 1.5s cho khách đọc thông báo rồi mới chuyển trang
      setTimeout(() => {
        navigate('/login'); 
      }, 1500);

    } catch (err) {
      console.error("Lỗi đăng ký chi tiết:", err.response || err);
      // 3. Bắt chính xác câu lỗi từ Backend gửi lên
      const errorMessage = err.response?.data?.message || 'Lỗi Server cục bộ! Bác check lại Backend nhé.';
      toast.error(`❌ ${errorMessage}`);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <div className="auth-box">
          <h2 className="auth-title">Đăng ký tài khoản</h2>
          <form onSubmit={handleRegister}>
            <div className="auth-form-group">
              <label>Họ và tên</label>
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="Nhập họ tên" 
                onChange={handleChange} 
                value={formData.name}
              />
            </div>
            <div className="auth-form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                required 
                placeholder="Nhập email" 
                onChange={handleChange} 
                value={formData.email}
              />
            </div>
            <div className="auth-form-group">
              <label>Mật khẩu</label>
              <input 
                type="password" 
                name="password" 
                required 
                placeholder="Tạo mật khẩu (Ít nhất 6 ký tự)" 
                onChange={handleChange} 
                value={formData.password}
              />
            </div>
            <button type="submit" className="auth-btn">TẠO TÀI KHOẢN</button>
          </form>
          <div className="auth-switch">
            Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;