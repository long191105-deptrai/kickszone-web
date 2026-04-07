import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext'; 
import { toast } from 'react-toastify';

// Tự động nhận diện môi trường để lấy link API chuẩn
const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://kickszone-web.onrender.com";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);

  const { addToCart } = useCart(); 
  const sizes = [38, 39, 40, 41, 42, 43];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Đã thay localhost bằng ${API_URL}
        const res = await axios.get(`${API_URL}/api/products/${id}?t=${new Date().getTime()}`);
        setProduct(res.data);
        
        if (res.data.images && res.data.images.length > 0) {
          setMainImage(res.data.images[0]);
        } else if (res.data.image) {
          setMainImage(res.data.image);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const formatImageUrl = (imgData) => {
    if (!imgData) return 'https://via.placeholder.com/600';
    const path = Array.isArray(imgData) ? imgData[0] : imgData;
    if (typeof path === 'string' && path.length > 0) {
      // Đã sửa trỏ về link Render
      return path.startsWith('http') ? path : `${API_URL}${path}`;
    }
    return 'https://via.placeholder.com/600';
  };

  const handleAddToCart = () => {
    if (Number(product.countInStock) <= 0) {
      toast.error("Sản phẩm đã cháy hàng rồi bác ơi!");
      return;
    }

    const isAccessories = product.brand === 'Accessories' || product.category === 'Accessories';
    if (!isAccessories && !selectedSize) {
      toast.warning("Bác ơi, chọn Size giày đã rồi mới cho vào giỏ được chứ! 😊", { theme: "colored" });
      return;
    }

    if (quantity > product.countInStock) {
      toast.error(`Ối bác ơi! Kho chỉ còn đúng ${product.countInStock} đôi thôi ạ.`, { theme: "colored" });
      return;
    }

    const finalSize = isAccessories ? "N/A" : selectedSize;
    
    addToCart(product, finalSize, quantity);
    
    toast.success(`👟 Đã thêm ${quantity} món vào giỏ hàng!`, { position: "top-right", autoClose: 2000, theme: "dark" });
  };

  if (loading) return (
    <>
      <Header />
      <div style={{ textAlign: 'center', padding: '100px', fontWeight: 'bold' }}>Đang tìm siêu phẩm trong kho...</div>
    </>
  );

  if (!product) return (
    <>
      <Header />
      <div style={{ textAlign: 'center', padding: '100px' }}>Không tìm thấy sản phẩm!</div>
    </>
  );

  const isAccessories = product.brand === 'Accessories' || product.category === 'Accessories';
  const isOutOfStock = Number(product.countInStock) <= 0;

  return (
    <>
      <Header />
      <div className="container" style={{ padding: '60px 0', display: 'flex', gap: '50px', flexWrap: 'wrap', minHeight: '80vh' }}>
        
        {/* CỘT TRÁI: KHU VỰC ẢNH */}
        <div style={{ flex: '1.2', minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={formatImageUrl(mainImage)} 
              alt={product.name} 
              style={{ 
                width: '100%', borderRadius: '20px', boxShadow: '0 15px 40px rgba(0,0,0,0.1)', 
                objectFit: 'cover', 
                opacity: isOutOfStock ? 0.4 : 1, 
                filter: isOutOfStock ? 'grayscale(100%)' : 'none' 
              }} 
            />
            {isOutOfStock && (
              <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  background: 'rgba(255, 0, 0, 0.8)', color: '#fff', padding: '15px 30px',
                  borderRadius: '8px', fontWeight: '900', fontSize: '24px', letterSpacing: '2px',
                  zIndex: 10, boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
              }}>
                  ĐÃ CHÁY HÀNG
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {Array.isArray(product.images) && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {product.images.map((img, index) => (
                <img 
                  key={index}
                  src={formatImageUrl(img)}
                  onClick={() => setMainImage(img)}
                  style={{ 
                    width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', cursor: 'pointer', 
                    border: mainImage === img ? '3px solid #111' : '1px solid #ddd',
                    opacity: isOutOfStock ? 0.4 : 1,
                    filter: isOutOfStock ? 'grayscale(100%)' : 'none'
                  }} 
                />
              ))}
            </div>
          )}
        </div>

        {/* CỘT PHẢI: THÔNG TIN SẢN PHẨM */}
        <div style={{ flex: '1', minWidth: '350px' }}>
          <p style={{ color: isOutOfStock ? '#888' : (isAccessories ? '#4caf50' : '#ff5722'), fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {isOutOfStock ? "SẢN PHẨM TẠM NGƯNG BÁN" : (isAccessories ? "PHỤ KIỆN TẠI KICKSZONE" : product.brand)}
          </p>
          <h1 style={{ fontSize: '42px', margin: '0 0 15px 0', fontWeight: '900', color: isOutOfStock ? '#666' : '#111', textDecoration: isOutOfStock ? 'line-through' : 'none', lineHeight: '1.2' }}>
            {product.name}
          </h1>
          <h2 style={{ color: isOutOfStock ? '#999' : '#111', fontSize: '30px', fontWeight: '700', marginBottom: '25px' }}>
            {product.price?.toLocaleString()} VNĐ
          </h2>
          
          <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginBottom: '30px' }}>
            <h4 style={{ marginBottom: '10px', fontWeight: '800' }}>MÔ TẢ SẢN PHẨM:</h4>
            <p style={{ color: '#555', lineHeight: '1.7', fontSize: '15px' }}>{product.description}</p>
          </div>

          {/* CHỌN SIZE */}
          {!isAccessories && (
            <div style={{ marginBottom: '30px', opacity: isOutOfStock ? 0.3 : 1, pointerEvents: isOutOfStock ? 'none' : 'auto' }}>
              <p style={{ fontWeight: '800', marginBottom: '15px' }}>CHỌN SIZE (EU):</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {sizes.map(size => (
                  <button 
                    key={size}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: '60px', height: '45px', borderRadius: '8px',
                      border: selectedSize === size ? '2px solid #111' : '1px solid #ddd',
                      background: selectedSize === size ? '#111' : '#fff',
                      color: selectedSize === size ? '#fff' : '#111',
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer', fontWeight: '700',
                      transition: '0.2s'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SỐ LƯỢNG */}
          <div style={{ marginBottom: '35px', opacity: isOutOfStock ? 0.3 : 1, pointerEvents: isOutOfStock ? 'none' : 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                <p style={{ fontWeight: '800' }}>SỐ LƯỢNG:</p>
                <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                    <button disabled={isOutOfStock} onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} style={{ padding: '12px 18px', border: 'none', background: '#f9f9f9', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                    <span style={{ padding: '0 20px', fontWeight: '800' }}>{quantity}</span>
                    <button disabled={isOutOfStock} onClick={() => {
                        if (quantity < product.countInStock) setQuantity(quantity + 1);
                        else toast.info(`Kho chỉ còn ${product.countInStock} món.`);
                    }} style={{ padding: '12px 18px', border: 'none', background: '#f9f9f9', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                </div>
              </div>
              <p style={{ marginTop: '12px', fontSize: '14px', color: isOutOfStock ? '#ff0000' : '#2e7d32', fontWeight: 'bold' }}>
                {isOutOfStock ? '⚠️ Khách mua hết sạch rồi bác ơi!' : `✓ Sẵn có ${product.countInStock} sản phẩm`}
              </p>
          </div>

          {/* NÚT THÊM VÀO GIỎ */}
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            style={{
              width: '100%',
              background: isOutOfStock ? '#d32f2f' : '#111',
              color: '#fff',
              padding: '22px', border: 'none', borderRadius: '12px',
              fontSize: '18px', fontWeight: '900',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              opacity: isOutOfStock ? 0.7 : 1,
              transition: '0.3s',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}
          >
            {isOutOfStock ? 'KHÔNG THỂ THÊM VÀO GIỎ' : 'THÊM VÀO GIỎ HÀNG'}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
