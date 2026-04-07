import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      
      const userData = res.data.user ? res.data.user : res.data;

      // Lưu vào LocalStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success(`Chào mừng bác ${userData.name} đã trở lại! 🔥`, { autoClose: 1500 });

      // --- FIX CHỐT: Bỏ check Admin, ép tất cả mọi người bay thẳng ra Trang Chủ ---
      // Dùng window.location.href để web tải lại từ đầu, giúp Header nhận diện quyền Admin ngay lập tức
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Email hoặc mật khẩu không khớp bác ơi!');
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: '80px 20px', background: '#f4f4f4', minHeight: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '450px', width: '100%', background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
          
          <h2 style={{ textAlign: 'center', fontWeight: '900', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            ĐĂNG NHẬP
          </h2>
          <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px', fontSize: '14px' }}>Mừng bác quay lại với KicksZone</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div>
              <label style={{ fontWeight: '800', display: 'block', marginBottom: '8px', fontSize: '13px' }}>EMAIL CỦA BÁC:</label>
              <input 
                type="email" 
                required 
                placeholder="nguyenvanA@gmail.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #eee', background: '#f9f9f9', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontWeight: '800', display: 'block', marginBottom: '8px', fontSize: '13px' }}>MẬT KHẨU:</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #eee', background: '#f9f9f9', outline: 'none' }}
              />
            </div>

            <button type="submit" style={{ background: '#111', color: '#fff', padding: '18px', borderRadius: '10px', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '16px', transition: '0.3s', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
              VÀO CỬA HÀNG NGAY
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px', color: '#666' }}>
            Chưa có thẻ thành viên? <Link to="/register" style={{ color: '#ff5722', fontWeight: 'bold', textDecoration: 'none' }}>Đăng ký tại đây</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;