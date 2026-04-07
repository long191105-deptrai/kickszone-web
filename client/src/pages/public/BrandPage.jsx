import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Tự động nhận diện môi trường để lấy link API chuẩn
const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://kickszone-web.onrender.com";

const BrandPage = () => {
  const { brandName } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        setLoading(true);
        // Đã thay localhost bằng ${API_URL}
        const res = await axios.get(`${API_URL}/api/products?t=${new Date().getTime()}`);
        
        const filtered = res.data.filter(p => {
          const brandValue = p.brand || p.category;
          return (
            brandValue && 
            brandValue.trim().toLowerCase() === brandName.trim().toLowerCase()
          );
        });
        
        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm theo hãng:", err);
        setLoading(false);
      }
    };
    fetchBrandProducts();
  }, [brandName]);

  const getImageUrl = (imagesData) => {
    if (!imagesData) return 'https://via.placeholder.com/300';
    let imagePath = Array.isArray(imagesData) ? imagesData[0] : imagesData;
    if (typeof imagePath === 'string' && imagePath.length > 0) {
      if (imagePath.startsWith('http')) return imagePath;
      // Đã thay localhost bằng ${API_URL} để lấy ảnh từ server hosting
      return `${API_URL}${imagePath}`;
    }
    return 'https://via.placeholder.com/300';
  };

  const menProducts = products.filter(p => {
    const g = p.gender ? p.gender.toLowerCase() : 'nam'; 
    return g === 'nam' || g === 'unisex';
  });

  const womenProducts = products.filter(p => {
    const g = p.gender ? p.gender.toLowerCase() : '';
    return g === 'nữ' || g === 'unisex';
  });

  if (loading) return (
    <>
      <Header />
      <div style={{textAlign:'center', padding:'100px', fontWeight: 'bold'}}>Đang tải bộ sưu tập {brandName}...</div>
    </>
  );

  return (
    <>
      <Header />
      <div className="container" style={{ padding: '40px 0', minHeight: '80vh' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '60px', textTransform: 'uppercase', fontSize: '32px', fontWeight: '900' }}>
          KHÁM PHÁ THẾ GIỚI {brandName}
        </h2>

        {products.length > 0 ? (
          <>
            {/* --- KHU VỰC GIÀY NAM --- */}
            <div style={{ marginBottom: '80px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                 <h3 style={{ margin: 0, textTransform: 'uppercase', fontSize: '24px', fontWeight: '800' }}>👟 GIÀY NAM {brandName}</h3>
                 <div style={{ flex: 1, height: '2px', background: '#eee' }}></div>
              </div>
              
              {menProducts.length > 0 ? (
                <div className="product-grid">
                  {menProducts.map(shoe => (
                    <ProductItem key={shoe._id} shoe={shoe} getImageUrl={getImageUrl} />
                  ))}
                </div>
              ) : (
                <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center' }}>Hiện chưa có sản phẩm dành cho Nam.</p>
              )}
            </div>

            {/* --- KHU VỰC GIÀY NỮ --- */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                 <h3 style={{ margin: 0, textTransform: 'uppercase', fontSize: '24px', fontWeight: '800', color: '#ff5722' }}>👠 GIÀY NỮ {brandName}</h3>
                 <div style={{ flex: 1, height: '2px', background: '#ffe0b2' }}></div>
              </div>
              
              {womenProducts.length > 0 ? (
                <div className="product-grid">
                  {womenProducts.map(shoe => (
                    <ProductItem key={shoe._id} shoe={shoe} getImageUrl={getImageUrl} />
                  ))}
                </div>
              ) : (
                <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center' }}>Hiện chưa có sản phẩm dành cho Nữ.</p>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p style={{ color: '#888', fontSize: '1.2rem' }}>
              Thương hiệu <strong>{brandName?.toUpperCase()}</strong> đang cập nhật hàng mới...
            </p>
            <Link to="/" style={{ color: '#ff5722', fontWeight: 'bold', textDecoration: 'none' }}>Quay lại trang chủ</Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

// --- COMPONENT CON: PRODUCT ITEM ---
const ProductItem = ({ shoe, getImageUrl }) => {
  const isOutOfStock = Number(shoe.countInStock) <= 0;

  return (
    <div 
      className="product-card hover-lift" 
      style={{ 
        opacity: isOutOfStock ? 0.5 : 1, 
        filter: isOutOfStock ? 'grayscale(100%)' : 'none',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}
    >
      <Link 
        to={isOutOfStock ? "#" : `/product/${shoe._id}`} 
        style={{ 
          textDecoration: 'none', 
          color: 'inherit',
          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
          display: 'block'
        }}
      >
        <div style={{ position: 'relative' }}>
          {shoe.isNewArrival && !isOutOfStock && (
            <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#ff5722', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', zIndex: 2 }}>NEW</span>
          )}
          
          {isOutOfStock && (
             <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                background: 'rgba(255, 0, 0, 0.8)', color: '#fff', padding: '10px 20px',
                borderRadius: '5px', fontWeight: '900', zIndex: 10, letterSpacing: '1px'
             }}>
                HẾT HÀNG
             </div>
          )}

          <img 
            src={getImageUrl(shoe.images || shoe.image)} 
            alt={shoe.name} 
            className="product-card-image" 
          />
        </div>

        <div className="product-card-info">
          <p className="product-card-brand">{shoe.brand || shoe.category} | {shoe.gender || 'Nam'}</p>
          <h3 className="product-card-name" style={{ color: isOutOfStock ? '#666' : '#111' }}>{shoe.name}</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <p className="product-card-price" style={{ margin: 0 }}>{shoe.price?.toLocaleString()} đ</p>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: isOutOfStock ? 'red' : '#4caf50' }}>
              {isOutOfStock ? 'Trống kho' : `Còn: ${shoe.countInStock}`}
            </span>
          </div>

          <button 
            className="auth-btn" 
            disabled={isOutOfStock}
            style={{ 
              width: '100%', marginTop: '15px', 
              background: isOutOfStock ? '#ccc' : '#111', 
              color: isOutOfStock ? '#666' : '#fff', 
              border: 'none', padding: '10px', borderRadius: '5px', 
              cursor: isOutOfStock ? 'not-allowed' : 'pointer' 
            }}
          >
            {isOutOfStock ? 'KHÔNG THỂ MUA' : 'XEM CHI TIẾT'}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default BrandPage;
