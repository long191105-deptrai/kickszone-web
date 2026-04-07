import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'; 

// Import logo
import logoKicksZone from '../assets/images/logo.png'; 

// Tự động nhận diện môi trường để lấy link API chuẩn
const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://kickszone-web.onrender.com";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const brands = ["Nike", "Adidas", "Puma", "Jordan", "Vans", "Converse"];

  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Đã thay localhost bằng ${API_URL}
        const res = await axios.get(`${API_URL}/api/products`);
        setAllProducts(res.data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu tìm kiếm");
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResults([]);
      return;
    }
    const results = allProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
    setFilteredResults(results);
  }, [searchTerm, allProducts]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('Hẹn gặp lại bác tại KicksZone! 👋');
    navigate('/');
    // Ép tải lại trang để xóa sạch trạng thái cũ
    window.location.reload(); 
  };

  const getImgSearch = (images) => {
    const path = Array.isArray(images) ? images[0] : images;
    if (!path) return 'https://via.placeholder.com/40';
    if (path.startsWith('http')) return path;
    // Đã sửa trỏ về link Render
    return `${API_URL}${path}`;
  };

  const dropdownLinkStyle = {
    display: 'block',
    padding: '10px 15px',
    textDecoration: 'none',
    color: '#333',
    fontSize: '13px',
    transition: '0.2s',
    borderBottom: '1px solid #f9f9f9'
  };

  return (
    <header className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 5%', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
      
      {/* LOGO */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' }}>
        <img src={logoKicksZone} alt="KicksZone Logo" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
        <span style={{ fontSize: '20px', fontWeight: '900', color: '#111', textTransform: 'uppercase', letterSpacing: '1px' }}>
          KICKS<span style={{ color: '#ff5722' }}>ZONE</span>
        </span>
      </Link>
      
      {/* THANH TÌM KIẾM */}
      <div style={{ position: 'relative', width: '280px' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f1f1f1', borderRadius: '20px', padding: '5px 15px' }}>
          <input 
            type="text" 
            placeholder="Tìm giày, phụ kiện..." 
            style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '13px', padding: '5px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span style={{ color: '#888', cursor: 'pointer' }}>🔍</span>
        </div>

        {filteredResults.length > 0 && (
          <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden', zIndex: 1000 }}>
            {filteredResults.map(p => (
              <Link to={`/product/${p._id}`} key={p._id} onClick={() => setSearchTerm('')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', textDecoration: 'none', color: '#111', borderBottom: '1px solid #f1f1f1' }}>
                <img src={getImgSearch(p.images || p.image)} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px' }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: '#ff5722' }}>{p.price?.toLocaleString()}đ</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* MENU CHÍNH */}
      <nav>
        <ul className="nav-menu" style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
          <li><Link to="/" style={{ textDecoration: 'none', color: '#111', fontWeight: 'bold', fontSize: '14px' }}>Trang chủ</Link></li>
          
          <li onMouseEnter={() => setIsBrandDropdownOpen(true)} onMouseLeave={() => setIsBrandDropdownOpen(false)} style={{ position: 'relative' }}>
            <span style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Sneaker ▼</span>
            {isBrandDropdownOpen && (
              <ul style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', padding: '10px', borderRadius: '8px', listStyle: 'none', minWidth: '150px' }}>
                {brands.map(brand => (
                  <li key={brand}><Link to={`/brand/${brand.toLowerCase()}`} style={dropdownLinkStyle}>{brand}</Link></li>
                ))}
              </ul>
            )}
          </li>

          <li><Link to="/category/Accessories" style={{ textDecoration: 'none', color: '#111', fontWeight: 'bold', fontSize: '14px' }}>Phụ kiện</Link></li>
          
          <li>
            <Link to="/cart" style={{ textDecoration: 'none', color: '#111', fontWeight: 'bold', fontSize: '14px' }}>
              Giỏ hàng <span style={{ color: '#ff5722' }}>({totalItems})</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* KHU VỰC USER / AUTH */}
      <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {user ? (
          <div 
            onMouseEnter={() => setIsUserDropdownOpen(true)} 
            onMouseLeave={() => setIsUserDropdownOpen(false)}
            style={{ position: 'relative', cursor: 'pointer', padding: '5px 0' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#888' }}>Xin chào,</div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111' }}>{user.name.split(' ').pop()} ▼</div>
              </div>
              <div style={{ width: '35px', height: '35px', background: '#111', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#fff' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {isUserDropdownOpen && (
              <ul style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', padding: '10px', borderRadius: '10px', listStyle: 'none', minWidth: '180px', border: '1px solid #eee' }}>
                {isAdmin ? (
                  <>
                    <li style={{ padding: '8px 15px', fontSize: '10px', color: '#ff5722', fontWeight: '900', textTransform: 'uppercase' }}>Quản trị viên</li>
                    <li><Link to="/admin" style={dropdownLinkStyle}>📊 Bảng điều khiển</Link></li>
                    <li><Link to="/admin/products" style={dropdownLinkStyle}>👟 Quản lý kho</Link></li>
                    <li><Link to="/admin/orders" style={dropdownLinkStyle}>📦 Quản lý đơn hàng</Link></li>
                  </>
                ) : (
                  <>
                    <li style={{ padding: '8px 15px', fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>Khách hàng</li>
                    <li><Link to="/profile" style={dropdownLinkStyle}>👤 Sửa thông tin</Link></li>
                    <li><Link to="/my-orders" style={dropdownLinkStyle}>🚚 Đơn hàng của tôi</Link></li>
                  </>
                )}
                <li style={{ marginTop: '5px' }}>
                  <button onClick={handleLogout} style={{ ...dropdownLinkStyle, width: '100%', textAlign: 'left', border: 'none', background: 'none', color: '#ff4d4d', fontWeight: 'bold', cursor: 'pointer' }}>
                    🚪 Đăng xuất
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#111', fontWeight: 'bold', fontSize: '13px' }}>ĐĂNG NHẬP</Link>
            <Link to="/register" style={{ textDecoration: 'none', color: '#fff', background: '#111', padding: '8px 18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px' }}>ĐĂNG KÝ</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
