import React, { useState } from 'react';

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
    alert("🎉 Đã cập nhật cấu hình hệ thống thành công!");
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontWeight: '900', marginBottom: '25px', textTransform: 'uppercase' }}>
        ⚙️ Cài đặt hệ thống
      </h2>

      <div style={{ background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 5px 25px rgba(0,0,0,0.05)', maxWidth: '800px' }}>
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Tên cửa hàng:</label>
              <input type="text" value={shopInfo.name} onChange={(e) => setShopInfo({...shopInfo, name: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Hotline:</label>
              <input type="text" value={shopInfo.hotline} onChange={(e) => setShopInfo({...shopInfo, hotline: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Địa chỉ cửa hàng:</label>
            <input type="text" value={shopInfo.address} onChange={(e) => setShopInfo({...shopInfo, address: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Email liên hệ:</label>
            <input type="email" value={shopInfo.email} onChange={(e) => setShopInfo({...shopInfo, email: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
          </div>

          <div style={{ padding: '20px', background: '#fff3e0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 'bold', margin: 0, color: '#e65100' }}>Chế độ bảo trì</p>
              <small>Khi bật, khách hàng sẽ không thể đặt hàng.</small>
            </div>
            <input type="checkbox" checked={shopInfo.maintenance} onChange={(e) => setShopInfo({...shopInfo, maintenance: e.target.checked})} style={{ width: '20px', height: '20px' }} />
          </div>

          <button type="submit" style={{ background: '#111', color: '#fff', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
            LƯU THIẾT LẬP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageSettings;