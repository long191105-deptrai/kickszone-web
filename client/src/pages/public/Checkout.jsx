import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const totalOrderPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const currentUserId = user?._id || user?.id;

    if (!user || !currentUserId) {
      toast.error("⚠️ Hệ thống chưa nhận diện được bác. Bác thử Đăng xuất rồi Đăng nhập lại nhé!");
      return;
    }

    // --- CHỐT CHẶN BẢO VỆ: Quét xem giỏ hàng cũ có bị lỗi mất ID không ---
    const isMissingId = cartItems.some(item => !item._id && !item.id && !item.product);
    if (isMissingId) {
      toast.error("🚨 Lỗi: Giỏ hàng đang chứa dữ liệu cũ! Bác vui lòng quay lại Giỏ hàng, XÓA SẠCH rồi thêm lại nhé.", { autoClose: 5000 });
      return; // Khóa luôn không cho đặt gửi lên Server làm lỗi hệ thống
    }

    const orderData = {
      userId: currentUserId,
      orderItems: cartItems.map(item => ({
        // --- FIX TRIỆT ĐỂ: Quét sạch mọi tên gọi của ID để gửi cho đúng ---
        product: item._id || item.id || item.product, 
        name: item.name,
        qty: item.qty,
        price: item.price,
        size: item.size,
        images: Array.isArray(item.images) ? item.images : [item.image || item.images]
      })),
      shippingAddress: {
        fullName: user.name || "Khách hàng KicksZone",
        address: address,
        phone: phone,
      },
      paymentMethod: paymentMethod,
      totalPrice: totalOrderPrice,
      status: 'Chờ xử lý' 
    };

    try {
      // Gửi đơn hàng lên Server
      const response = await axios.post('http://localhost:3000/api/orders', orderData);

      if (response.status === 201) {
        toast.success('🎉 CHỐT ĐƠN THÀNH CÔNG! Đang cập nhật kho hàng...', {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });

        clearCart(); 

        // Đợi 2 giây để khách kịp đọc thông báo rồi chuyển trang
        setTimeout(() => {
          // Dùng window.location.href để ép KicksZone tải lại toàn bộ data kho mới
          window.location.href = '/my-orders';
        }, 2000);
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      toast.error('❌ Lỗi: ' + (error.response?.data?.message || "Không thể trừ kho, bác kiểm tra lại nhé!"));
    }
  };

  return (
    <>
      <Header />
      <div className="container" style={{ padding: '50px 20px', maxWidth: '1000px', minHeight: '85vh' }}>
        <h2 style={{ textAlign: 'center', fontWeight: '900', marginBottom: '40px', textTransform: 'uppercase' }}>
          🏁 Hoàn tất thủ tục chốt đơn
        </h2>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          
          {/* FORM THÔNG TIN */}
          <div style={{ flex: '1.5', minWidth: '350px' }}>
            <form onSubmit={handlePlaceOrder} style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 25px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #111', paddingBottom: '10px' }}>THÔNG TIN NHẬN HÀNG</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Địa chỉ chi tiết:</label>
                <input 
                  type="text" 
                  placeholder="Số nhà, tên đường, phường/xã..." 
                  required 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }} 
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Số điện thoại liên hệ:</label>
                <input 
                  type="text" 
                  placeholder="Số điện thoại để Shipper gọi bác" 
                  required 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }} 
                />
              </div>

              <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '10px', marginBottom: '20px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>Phương thức thanh toán:</p>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <input type="radio" name="pay" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} /> 
                  Thanh toán khi nhận hàng (COD)
                </label>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="radio" name="pay" value="Bank" checked={paymentMethod === 'Bank'} onChange={(e) => setPaymentMethod(e.target.value)} /> 
                  Chuyển khoản ngân hàng (Quét mã QR)
                </label>
              </div>

              <button type="submit" style={{ width: '100%', background: '#111', color: '#fff', padding: '20px', borderRadius: '10px', fontWeight: '900', cursor: 'pointer', border: 'none', fontSize: '18px', transition: '0.3s' }}>
                XÁC NHẬN ĐẶT HÀNG
              </button>
            </form>
          </div>

          {/* TÓM TẮT ĐƠN HÀNG */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ background: '#f4f4f4', padding: '25px', borderRadius: '15px', position: 'sticky', top: '120px' }}>
              <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>ĐƠN HÀNG CỦA BÁC</h3>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                {cartItems.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <img 
                        src={Array.isArray(item.images) ? item.images[0] : (item.image || item.images)} 
                        alt={item.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} 
                      />
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.name} (x{item.qty})</span>
                    </div>
                    <span style={{ fontSize: '14px' }}>{(item.price * item.qty).toLocaleString()}đ</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '2px dashed #ccc', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontWeight: '900', fontSize: '20px', color: '#ff5722' }}>
                  <span>TỔNG CỘNG:</span>
                  <span>{totalOrderPrice.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;