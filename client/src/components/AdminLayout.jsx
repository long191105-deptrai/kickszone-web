import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại để tô sáng menu

  // Hàm kiểm tra xem menu nào đang được chọn để thêm class 'active'
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="admin-layout">
      {/* SIDEBAR BÊN TRÁI */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          KICKS<span>ZONE</span> ADMIN
        </div>
        
        <ul className="admin-nav">
          <li>
            <Link to="/admin" className={isActive('/admin')}>
              📊 Tổng quan
            </Link>
          </li>
          
          <li>
            <Link to="/admin/products" className={isActive('/admin/products')}>
              👟 Quản lý Sản phẩm
            </Link>
          </li>

          {/* GIỜ ĐÃ CÓ THỂ BẤM VÀO ĐƯỢC RỒI ĐÂY BÁC */}
          <li>
            <Link to="/admin/orders" className={isActive('/admin/orders')}>
              📦 Quản lý Đơn hàng
            </Link>
          </li>

          <li>
            <Link to="/admin/users" className={isActive('/admin/users')}>
              👥 Khách hàng
            </Link>
          </li>

          <li>
            <Link to="/admin/settings" className={isActive('/admin/settings')}>
              ⚙️ Cài đặt hệ thống
            </Link>
          </li>
          
          {/* Nút thoát về trang chủ cửa hàng */}
          <li style={{ marginTop: 'auto', borderTop: '1px solid #333', paddingTop: '20px' }}>
            <Link to="/" className="back-home">
              ⬅️ Về trang Cửa hàng
            </Link>
          </li>
        </ul>
      </aside>

      {/* KHU VỰC NỘI DUNG BÊN PHẢI */}
      <main className="admin-main">
        {/* Outlet sẽ hiển thị Dashboard, ManageProducts hoặc ManageOrders tương ứng */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;