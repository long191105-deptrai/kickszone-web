import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Đồng bộ danh sách thương hiệu giống Header
  const brands = ["Nike", "Adidas", "Puma", "Jordan", "Vans", "Converse"];

  return (
    <footer className="main-footer" style={{ background: '#111', color: '#fff', padding: '60px 5% 20px', marginTop: '50px' }}>
      <div className="footer-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        
        {/* Cột 1: Thông tin shop */}
        <div className="footer-column">
          <h3 className="footer-logo" style={{ fontSize: '24px', fontWeight: '900', marginBottom: '20px', letterSpacing: '1px' }}>
            KICKS <span style={{ color: '#ff5722' }}>ZONE</span>
          </h3>
          <p className="footer-desc" style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
            Hệ thống phân phối giày sneaker chính hãng hàng đầu, mang đến phong cách khác biệt và sự tự tin cho đôi chân của bạn.
          </p>
          <div className="footer-contact" style={{ fontSize: '14px', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p>📍 <b style={{ color: '#fff' }}>Địa chỉ:</b> 69/68 Đặng Thùy Trâm, P. 13, Q. Bình Thạnh, Tp. HCM</p>
            <p>📧 <b style={{ color: '#fff' }}>Email:</b> support@kickszone.vn</p>
            <p>📞 <b style={{ color: '#fff' }}>Hotline:</b> 0123 568 9109</p>
          </div>
        </div>
        
        {/* Cột 2: Danh mục sản phẩm */}
        <div className="footer-column">
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '25px', borderLeft: '3px solid #ff5722', paddingLeft: '15px' }}>SẢN PHẨM</h3>
          <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {brands.map(brand => (
              <Link key={brand} to={`/brand/${brand.toLowerCase()}`} style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px', transition: '0.3s' }} onMouseEnter={(e) => e.target.style.color = '#ff5722'} onMouseLeave={(e) => e.target.style.color = '#aaa'}>
                Giày {brand}
              </Link>
            ))}
            <Link to="/category/Accessories" style={{ color: '#ff5722', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>
              Phụ kiện Sneaker
            </Link>
          </div>
        </div>

        {/* Cột 3: Chính sách khách hàng */}
        <div className="footer-column">
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '25px', borderLeft: '3px solid #ff5722', paddingLeft: '15px' }}>CHÍNH SÁCH</h3>
          <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/policy/exchange" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Chính sách đổi trả 30 ngày</Link>
            <Link to="/policy/warranty" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Bảo hành keo trọn đời</Link>
            <Link to="/policy/privacy" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Chính sách bảo mật</Link>
            <Link to="/policy/terms" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>

      {/* Phần bản quyền */}
      <div className="footer-bottom" style={{ borderTop: '1px solid #222', paddingTop: '30px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} <strong style={{ color: '#fff' }}>KICKS ZONE</strong>. Tất cả các quyền được bảo lưu.
        </p>
        <p style={{ fontSize: '11px', color: '#555', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Hệ thống vận hành bởi KicksZone Technology Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;
