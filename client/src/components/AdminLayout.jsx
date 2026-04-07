import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  // Hàm kiểm tra active class (Dùng startsWith để khi vào các trang con của products nó vẫn sáng menu)
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f4f7f6' }}>
      {/* SIDEBAR BÊN TRÁI */}
      <aside className="admin-sidebar" style={{ 
        width: '260px', 
        background: '#111', 
        color: '#fff', 
        padding: '30px 20px', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }}>
        <div className="admin-sidebar-logo" style={{ 
          fontSize: '20px', 
          fontWeight: '900', 
          marginBottom: '40px', 
          textAlign: 'center',
          letterSpacing: '1px'
        }}>
          KICKS<span style={{ color: '#ff5722' }}>ZONE</span> ADMIN
        </div>
        
        <ul className="admin-nav" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <li>
            <Link to="/admin" className={isActive('/admin')} style={navLinkStyle(isActive('/admin'))}>
              📊 Tổng quan
            </Link>
          </li>
          
          <li>
            <Link to="/admin/products" className={isActive('/admin/products')} style={navLinkStyle(isActive('/admin/products'))}>
              👟 Quản lý Sản phẩm
            </Link>
          </li>

          <li>
            <Link to="/admin/orders" className={isActive('/admin/orders')} style={navLinkStyle(isActive('/admin/orders'))}>
              📦 Quản lý Đơn hàng
            </Link>
          </li>

          <li>
            <Link to="/admin/users" className={isActive('/admin/users')} style={navLinkStyle(isActive('/admin/users'))}>
              👥 Khách hàng
            </Link>
          </li>

          <li>
            <Link to="/admin/settings" className={isActive('/admin/settings')} style={navLinkStyle(isActive('/admin/settings'))}>
              ⚙️ Cài đặt hệ thống
            </Link>
          </li>
        </ul>

        {/* Nút thoát về trang chủ cửa hàng */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #333', paddingTop: '20px' }}>
          <Link to="/" className="back-home" style={{ 
            textDecoration: 'none', 
            color: '#aaa', 
            fontSize: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            transition: '0.3s'
          }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#aaa'}>
            ⬅️ Về trang Cửa hàng
          </Link>
        </div>
      </aside>

      {/* KHU VỰC NỘI DUNG BÊN PHẢI */}
      <main className="admin-main" style={{ 
        marginLeft: '260px', // Đẩy nội dung sang phải tránh bị Sidebar che
        width: 'calc(100% - 260px)', 
        padding: '20px',
        minHeight: '100vh'
      }}>
        <Outlet /> 
      </main>
    </div>
  );
};

// CSS Inline cho các link menu
const navLinkStyle = (activeStatus) => ({
  display: 'block',
  padding: '12px 15px',
  textDecoration: 'none',
  color: activeStatus ? '#fff' : '#aaa',
  background: activeStatus ? '#ff5722' : 'transparent',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: activeStatus ? 'bold' : 'normal',
  transition: 'all 0.3s ease',
});

export default AdminLayout;
