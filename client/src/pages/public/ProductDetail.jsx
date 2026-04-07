import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext'; 
import { toast } from 'react-toastify';

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
        const res = await axios.get(`http://localhost:3000/api/products/${id}?t=${new Date().getTime()}`);
        setProduct(res.data);
        
        if (res.data.images && res.data.images.length > 0) {
          setMainImage(res.data.images[0]);
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
      return path.startsWith('http') ? path : `http://localhost:3000${path}`;
    }
    return 'https://via.placeholder.com/600';
  };

  const handleAddToCart = () => {
    if (Number(product.countInStock) <= 0) {
      toast.error("Sản phẩm đã cháy hàng rồi bác ơi!");
      return;
    }

    const isAccessories = product.brand === 'Accessories';
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

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Đang tìm siêu phẩm trong kho...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '100px' }}>Không tìm thấy sản phẩm!</div>;

  const isAccessories = product.brand === 'Accessories';
  
  // --- FIX CHỐT: Ép kiểu Số để chắc chắn nó bắt được kho = 0 ---
  const isOutOfStock = Number(product.countInStock) <= 0;

  return (
    <>
      <Header />
      <div className="container" style={{ padding: '60px 0', display: 'flex', gap: '50px', flexWrap: 'wrap', minHeight: '80vh' }}>
        
        {/* CỘT TRÁI: KHU VỰC ẢNH */}
        <div style={{ flex: '1.2', minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Bọc ảnh trong thẻ div relative để gắn nhãn Hết hàng lên trên */}
          <div style={{ position: 'relative' }}>
            <img 
              src={formatImageUrl(mainImage)} 
              alt={product.name} 
              style={{ 
                width: '100%', borderRadius: '20px', boxShadow: '0 15px 40px rgba(0,0,0,0.1)', 
                objectFit: 'cover', 
                // Mờ hẳn 60% và xám xịt luôn
                opacity: isOutOfStock ? 0.4 : 1, 
                filter: isOutOfStock ? 'grayscale(100%)' : 'none' 
              }} 
            />
            {/* Cảnh báo to bự chảng đè lên ảnh nếu hết hàng */}
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
          <p style={{ color: isOutOfStock ? '#888' : (isAccessories ? '#4caf50' : '#ff5722'), fontWeight: '800', textTransform: 'uppercase' }}>
            {isOutOfStock ? "SẢN PHẨM TẠM NGƯNG BÁN" : (isAccessories ? "PHỤ KIỆN TẠI KICKSZONE" : product.brand)}
          </p>
          <h1 style={{ fontSize: '42px', margin: '0 0 15px 0', fontWeight: '900', color: isOutOfStock ? '#666' : '#111', textDecoration: isOutOfStock ? 'line-through' : 'none' }}>
            {product.name}
          </h1>
          <h2 style={{ color: isOutOfStock ? '#999' : '#111', fontSize: '30px', fontWeight: '700' }}>
            {product.price?.toLocaleString()} VNĐ
          </h2>
          
          <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginBottom: '30px' }}>
            <h4 style={{ marginBottom: '10px' }}>MÔ TẢ SẢN PHẨM:</h4>
            <p style={{ color: '#555', lineHeight: '1.7' }}>{product.description}</p>
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
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer', fontWeight: '700'
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
                <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #eee', borderRadius: '8px' }}>
                    <button disabled={isOutOfStock} onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} style={{ padding: '10px 18px', border: 'none', background: '#f9f9f9', cursor: 'pointer' }}>-</button>
                    <span style={{ padding: '0 20px', fontWeight: '800' }}>{quantity}</span>
                    <button disabled={isOutOfStock} onClick={() => {
                        if (quantity < product.countInStock) setQuantity(quantity + 1);
                        else toast.info(`Kho chỉ còn ${product.countInStock} đôi.`);
                    }} style={{ padding: '10px 18px', border: 'none', background: '#f9f9f9', cursor: 'pointer' }}>+</button>
                </div>
              </div>
              <p style={{ marginTop: '10px', fontSize: '15px', color: isOutOfStock ? '#ff0000' : '#2e7d32', fontWeight: 'bold' }}>
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
              opacity: isOutOfStock ? 0.7 : 1
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