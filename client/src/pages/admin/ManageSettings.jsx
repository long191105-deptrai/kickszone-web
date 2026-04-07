import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ManageSettings = () => {
  const [shopInfo, setShopInfo] = useState({
    name: 'KicksZone',
    hotline: '0969304028',
    address: 'Hồ Chí Minh, Việt Nam',
    email: 'contact@kickszone.com',
    maintenance: false
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    // Sau này nếu bác có API lưu setting thì dùng axios.put tại đây
    toast.success("🎉 Đã cập nhật cấu hình hệ thống KicksZone thành công!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark"
    });
  };

  return (
    <div style={{ padding: '30px 40px', background: '#f8f9fa', minHeight: '100vh' }}>
      <h2 style={{ fontWeight: '900', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '1px', color: '#111' }}>
        ⚙️ CÀI ĐẶT HỆ THỐNG
      </h2>

      <div style={{ 
        background: '#fff', 
        padding: '40px', 
        borderRadius: '20px', 
        boxShadow: '0 8px 25px rgba(0,0,0,0.04)', 
        maxWidth: '800px',
        border: '1px solid #f1f1f1' 
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '25px', borderBottom: '2px solid #f8f9fa', paddingBottom: '15px' }}>
            THÔNG TIN CỬA HÀNG
        </h3>

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ fontWeight: '700', display: 'block', marginBottom: '10px', fontSize: '13px', color: '#555' }}>TÊN CỬA HÀNG:</label>
              <input 
                type="text" 
                value={shopInfo.name} 
                onChange={(e) => setShopInfo({...shopInfo, name: e.target.value})} 
                style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#f9f9f9', outline: 'none' }} 
              />
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ fontWeight: '700', display: 'block', marginBottom: '10px', fontSize: '13px', color: '#555' }}>HOTLINE HỖ TRỢ:</label>
              <input 
                type="text" 
                value={shopInfo.hotline} 
                onChange={(e) => setShopInfo({...shopInfo, hotline: e.target.value})} 
                style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#f9f9f9', outline: 'none' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ fontWeight: '700', display: 'block', marginBottom: '10px', fontSize: '13px', color: '#555' }}>ĐỊA CHỈ TRỤ SỞ:</label>
            <input 
                type="text" 
                value={shopInfo.address} 
                onChange={(e) => setShopInfo({...shopInfo, address: e.target.value})} 
                style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#f9f9f9', outline: 'none' }} 
            />
          </div>

          <div>
            <label style={{ fontWeight: '700', display: 'block', marginBottom: '10px', fontSize: '13px', color: '#555' }}>EMAIL LIÊN HỆ:</label>
            <input 
                type="email" 
                value={shopInfo.email} 
                onChange={(e) => setShopInfo({...shopInfo, email: e.target.value})} 
                style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#f9f9f9', outline: 'none' }} 
            />
          </div>

          <div style={{ 
            padding: '25px', 
            background: '#fff3e0', 
            borderRadius: '15px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            border: '1px dashed #ffb300' 
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '900', margin: '0 0 5px 0', color: '#e65100', fontSize: '15px' }}>CHẾ ĐỘ BẢO TRÌ (MAINTENANCE)</p>
              <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>Khi bật, hệ thống sẽ tạm dừng các chức năng đặt hàng để kiểm kê kho.</p>
            </div>
            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                <input 
                    type="checkbox" 
                    checked={shopInfo.maintenance} 
                    onChange={(e) => setShopInfo({...shopInfo, maintenance: e.target.checked})} 
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
            </label>
          </div>

          <button 
            type="submit" 
            style={{ 
                background: '#111', 
                color: '#fff', 
                padding: '20px', 
                border: 'none', 
                borderRadius: '12px', 
                fontWeight: '900', 
                cursor: 'pointer', 
                fontSize: '16px',
                transition: '0.3s',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                letterSpacing: '1px'
            }}
          >
            LƯU THIẾT LẬP HỆ THỐNG
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageSettings;
