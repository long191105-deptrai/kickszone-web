// client/src/pages/public/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// --- PHẢI CÓ CÁC BIẾN NÀY Ở NGOÀI HÀM HOME ---
const bannerSlides = [
  { id: 1, image: 'https://4kwallpapers.com/images/wallpapers/adidas-golden-logo-3840x2160-17549.jpg', title: 'Bước chạy\nđột phá', btnText: 'Mua ngay' },
  { id: 2, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=2000', title: 'Đẳng cấp\nSneaker', btnText: 'Khám phá bộ sưu tập' },
  { id: 3, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=2000', title: 'Sắc màu\ncá tính', btnText: 'Săn Deal hot' }
];

const categoriesDummy = [
  { id: 1, name: 'Giày Nam', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000', path: 'nam' },
  { id: 2, name: 'Giày Nữ', img: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1000', path: 'nữ' },
  { id: 3, name: 'Phụ kiện', img: 'https://tamanh.net/wp-content/uploads/2023/05/phu-kien-thoi-trang-nam-pho-bien.jpg', path: 'Accessories' },
];

const brandsDummy = [
  { id: 1, name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { id: 2, name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { id: 3, name: 'Puma', logo: 'https://upload.wikimedia.org/wikipedia/fr/archive/7/72/20240428022210%21Puma.svg' },
  { id: 4, name: 'Jordan', logo: 'https://cdn.worldvectorlogo.com/logos/jordan-2.svg' },
  { id: 5, name: 'Converse', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg' },
  { id: 6, name: 'Vans', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Vans-logo.svg/1280px-Vans-logo.svg.png' },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        // Fix Cache: Luôn lấy dữ liệu mới nhất
        const res = await axios.get(`http://localhost:3000/api/products?t=${new Date().getTime()}`);
        const filtered = res.data.filter(p => 
          p.isNewArrival === true || p.isNewArrival === 'true'
        );
        setNewArrivals(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi load hàng mới:", err);
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const formatVND = (price) => {
    return price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price) : "Liên hệ";
  };

  const getImgUrl = (product) => {
    const images = product.images || product.image;
    if (images && (Array.isArray(images) ? images.length > 0 : true)) {
        const img = Array.isArray(images) ? images[0] : images;
        return img.startsWith('http') ? img : `http://localhost:3000${img}`;
    }
    return 'https://via.placeholder.com/300';
  };

  return (
    <div>
      <Header />

      {/* HERO SLIDER */}
      <section className="hero-slider">
        <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide * 33.3333}%)` }}>
          {bannerSlides.map((slide) => (
            <div className="slide" key={slide.id}>
              <img src={slide.image} alt={slide.title} className="slide-img" />
              <div className="slide-overlay">
                <h1 style={{ whiteSpace: 'pre-line' }}>{slide.title}</h1>
                <button className="btn-shop-now">{slide.btnText}</button>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-dots">
          {bannerSlides.map((_, index) => (
            <span key={index} className={`dot ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)}></span>
          ))}
        </div>
      </section>

      {/* HÀNG MỚI VỀ 🔥 */}
      <section className="product-section home-section container">
        <h2 className="section-title">Hàng mới về 🔥</h2>
        
        {loading ? (
           <p style={{ textAlign: 'center' }}>Đang tải siêu phẩm...</p>
        ) : (
          <div className="product-grid">
            {newArrivals.length > 0 ? (
              newArrivals.map((shoe) => {
                const isOutOfStock = Number(shoe.countInStock) <= 0;
                
                return (
                  <Link 
                    to={`/product/${shoe._id}`} 
                    key={shoe._id} 
                    className="product-card hover-lift"
                    style={{ 
                      opacity: isOutOfStock ? 0.5 : 1,
                      filter: isOutOfStock ? 'grayscale(100%)' : 'none',
                    }}
                  >
                    {isOutOfStock && (
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '8px 15px',
                            borderRadius: '5px', fontWeight: 'bold', zIndex: 10
                        }}>
                            HẾT HÀNG
                        </div>
                    )}

                    <div className="add-to-cart-overlay">{isOutOfStock ? 'HẾT HÀNG' : 'Xem chi tiết'}</div>
                    
                    <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 5 }}>
                      <div style={{ background: '#ff5722', color: '#fff', padding: '4px 10px', borderRadius: '5px', fontWeight: 'bold', fontSize: '12px' }}>
                        NEW
                      </div>
                    </div>

                    <img src={getImgUrl(shoe)} alt={shoe.name} className="product-card-image" />
                    
                    <div className="product-card-info">
                      <p className="product-card-brand">{shoe.brand}</p>
                      <h3 className="product-card-name">{shoe.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <p className="product-card-price">{formatVND(shoe.price)}</p>
                         <span style={{ fontSize: '11px', color: isOutOfStock ? 'red' : '#666' }}>
                            {isOutOfStock ? 'Tạm hết' : `Kho: ${shoe.countInStock}`}
                         </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>Chưa có hàng mới về!</p>
            )}
          </div>
        )}
      </section>

      {/* DANH MỤC */}
      <section className="category-section home-section container">
          <h2 className="section-title">Danh mục sản phẩm</h2>
          <div className="category-grid">
            {categoriesDummy.map((cat) => (
              <div className="category-card" key={cat.id}>
                <img src={cat.img} alt={cat.name} className="category-img" />
                <div className="category-content">
                  <h3>{cat.name}</h3>
                  <Link to={`/category/${cat.path}`} className="btn-category">Xem ngay</Link>
                </div>
              </div>
            ))}
          </div>
      </section>

      {/* THƯƠNG HIỆU */}
      <section className="brand-section home-section container">
        <h2 className="section-title">Thương hiệu</h2>
        <div className="brand-grid" style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          {brandsDummy.map((brand) => (
            <Link to={`/brand/${brand.name}`} key={brand.id}>
              <img src={brand.logo} alt={brand.name} style={{ width: '100px', filter: 'grayscale(100%)', opacity: 0.6 }} />
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;