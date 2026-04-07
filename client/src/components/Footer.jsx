import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Đồng bộ danh sách thương hiệu giống Header
  const brands = ["Nike", "Adidas", "Puma", "Jordan", "Vans", "Converse"];

  return (
    <footer className="main-footer">
      <div className="footer-content">
        
        {/* Cột 1: Thông tin shop - Cập nhật địa chỉ & Hotline mới */}
        <div className="footer-column">
          <h3 className="footer-logo">KICKS <span>ZONE</span></h3>
          <p className="footer-desc">Hệ thống phân phối giày sneaker chính hãng hàng đầu, mang đến phong cách khác biệt cho đôi chân của bạn.</p>
          <div className="footer-contact">
            <p>📍 <b>Địa chỉ:</b> 69/68 Đặng Thùy Trâm, P. 13, Q. Bình Thạnh, Tp. HCM</p>
            <p>📧 <b>Email:</b> support@kickszone.vn</p>
            <p>📞 <b>Hotline:</b> 0123 568 9109</p>
          </div>
        </div>
        
        {/* Cột 2: Danh mục - Đồng bộ với Header */}
        <div className="footer-column">
          <h3>SẢN PHẨM</h3>
          <div className="footer-links">
            {brands.map(brand => (
              <Link key={brand} to={`/brand/${brand.toLowerCase()}`}>
                Giày {brand}
              </Link>
            ))}
            {/* Thêm mục Phụ kiện để đồng bộ hoàn toàn */}
            <Link to="/brand/accessories" style={{ color: '#ff5722', fontWeight: 'bold' }}>
              Phụ kiện Sneaker
            </Link>
          </div>
        </div>

        {/* Cột 3: Chính sách - Thiết lập Link chuyên nghiệp */}
        <div className="footer-column">
          <h3>CHÍNH SÁCH KHÁCH HÀNG</h3>
          <div className="footer-links">
            <Link to="/policy/exchange">Chính sách đổi trả 30 ngày</Link>
            <Link to="/policy/warranty">Bảo hành keo trọn đời</Link>
            <Link to="/policy/privacy">Chính sách bảo mật thông tin</Link>
            <Link to="/policy/terms">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>

      {/* Phần bản quyền */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} <strong>KICKS ZONE</strong>. Tất cả các quyền được bảo lưu.</p>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Thiết kế bởi KicksZone Team</p>
      </div>
    </footer>
  );
};

export default Footer;