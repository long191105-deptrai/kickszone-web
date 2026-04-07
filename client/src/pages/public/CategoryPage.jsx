import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Tự động nhận diện môi trường để lấy link API chuẩn
const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://kickszone-web.onrender.com";

const CategoryPage = () => {
  const { type } = useParams(); // Lấy giá trị 'nam', 'nữ' hoặc 'Accessories'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        // Đã thay localhost bằng ${API_URL} và thêm timestamp chống cache
        const res = await axios.get(`${API_URL}/api/products?t=${new Date().getTime()}`);
        
        let filtered = [];
        if (type === 'Accessories') {
          filtered = res.data.filter(p => p.brand === 'Accessories' || p.category === 'Accessories');
        } else {
          // Lọc theo giới tính (Nam/Nữ) và bao gồm Unisex
          filtered = res.data.filter(p => 
            (p.gender?.toLowerCase() === type.toLowerCase() || p.gender?.toLowerCase() === 'unisex') 
            && (p.brand !== 'Accessories' && p.category !== 'Accessories')
          );
        }
        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi load sản phẩm theo danh mục:", err);
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [type]);

  // Nhóm sản phẩm theo hãng để hiển thị đẹp hơn
  const brands = [...new Set(products.map(p => p.brand))];

  const getImageUrl = (images) => {
    const path = Array.isArray(images) ? images[0] : images;
    if (!path) return 'https://via.placeholder.com/300';
    if (path.startsWith('http')) return path;
    // Đã sửa trỏ về link Render
    return `${API_URL}${path}`;
  };

  return (
    <>
      <Header />
      <div className="container" style={{ padding: '50px 0', minHeight: '80vh' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '50px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px' }}>
          {type === 'Accessories' ? 'TẤT CẢ PHỤ KIỆN' : `TẤT CẢ GIÀY ${type.toUpperCase()}`}
        </h1>

        {loading ? (
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Đang tìm kiếm siêu phẩm...</p>
        ) : brands.length > 0 ? brands.map(brandName => (
          <div key={brandName} style={{ marginBottom: '60px' }}>
            <h2 style={{ borderLeft: '5px solid #111', paddingLeft: '15px', marginBottom: '30px', textTransform: 'uppercase', fontWeight: '800' }}>
              {brandName.toUpperCase()}
            </h2>
            <div className="product-grid">
              {products.filter(p => p.brand === brandName).map(shoe => {
                
                const isOutOfStock = Number(shoe.countInStock) <= 0;

                return (
                  <Link 
                    to={isOutOfStock ? "#" : `/product/${shoe._id}`} 
                    key={shoe._id} 
                    className="product-card hover-lift" 
                    style={{ 
                      textDecoration: 'none', 
                      color: 'inherit',
                      opacity: isOutOfStock ? 0.5 : 1,
                      filter: isOutOfStock ? 'grayscale(100%)' : 'none',
                      pointerEvents: isOutOfStock ? 'none' : 'auto',
                      position: 'relative',
                      display: 'block'
                    }}
                  >
                    {isOutOfStock && (
                      <div style={{
                          position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
                          background: 'rgba(255, 0, 0, 0.8)', color: '#fff', padding: '10px 15px',
                          borderRadius: '5px', fontWeight: '900', zIndex: 10, letterSpacing: '1px',
                          textAlign: 'center', width: 'max-content'
                      }}>
                          HẾT HÀNG
                      </div>
                    )}

                    <img src={getImageUrl(shoe.images || shoe.image)} alt={shoe.name} className="product-card-image" />
                    
                    <div className="product-card-info">
                      <h3 className="product-card-name" style={{ color: isOutOfStock ? '#666' : '#111', fontWeight: '700' }}>
                        {shoe.name}
                      </h3>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <p className="product-card-price" style={{ margin: 0, color: '#ff5722', fontWeight: 'bold' }}>
                          {shoe.price?.toLocaleString()}đ
                        </p>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: isOutOfStock ? 'red' : '#4caf50' }}>
                          {isOutOfStock ? 'Trống kho' : `Còn: ${shoe.countInStock}`}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ color: '#888' }}>Danh mục này đang chờ cập nhật sản phẩm bác ơi!</p>
            <Link to="/" style={{ color: '#111', fontWeight: 'bold' }}>Quay lại trang chủ</Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
