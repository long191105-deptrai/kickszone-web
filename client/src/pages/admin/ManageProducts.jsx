import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Tự động nhận diện môi trường để lấy link API chuẩn
const API_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "https://kickszone-web.onrender.com";

const ManageProducts = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    brand: '', 
    price: '', 
    description: '', 
    countInStock: 10,
    imageLinks: '', 
    isNewArrival: false,
    gender: 'Nam' 
  });
  const [imageFile, setImageFile] = useState(null);
  const [products, setProducts] = useState([]); 

  const fetchProducts = async () => {
    try {
      // Đã thay localhost bằng ${API_URL}
      const res = await axios.get(`${API_URL}/api/products?t=${new Date().getTime()}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bác có chắc chắn muốn xóa "${name}" khỏi hệ thống không?`)) {
      try {
        // Đã thay localhost bằng ${API_URL}
        await axios.delete(`${API_URL}/api/products/${id}`);
        toast.success('🗑️ Đã xóa thành công!');
        fetchProducts(); 
      } catch (err) {
        toast.error('❌ Lỗi! Không thể xóa sản phẩm này.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const imagesArray = formData.imageLinks
      .split(',')
      .map(img => img.trim())
      .filter(img => img !== "");

    const data = new FormData();
    data.append('name', formData.name);
    data.append('brand', formData.brand);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('countInStock', formData.countInStock);
    data.append('isNewArrival', String(formData.isNewArrival));
    data.append('gender', formData.gender); 
    data.append('images', JSON.stringify(imagesArray));

    if (imageFile) {
      data.append('image', imageFile); 
    }

    try {
      // Gửi yêu cầu POST tới server thật kèm theo headers multipart
      await axios.post(`${API_URL}/api/products`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success(`🎉 Siêu phẩm "${formData.name}" đã cập bến KicksZone!`);
      
      setFormData({ 
        name: '', brand: '', price: '', description: '', 
        countInStock: 10, imageLinks: '', isNewArrival: false, gender: 'Nam' 
      });
      setImageFile(null);
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
      fetchProducts(); 
    } catch (error) {
      console.error(error);
      toast.error('❌ Lỗi! Kiểm tra lại kết nối Server bác nhé.');
    }
  };

  return (
    <div style={{ padding: '30px 40px', width: '100%', background: '#f8f9fa', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#111', fontWeight: '900', textTransform: 'uppercase' }}>
          👟 QUẢN LÝ KHO HÀNG
        </h1>
        <p style={{ margin: 0, color: '#666' }}>Thêm mới và kiểm soát toàn bộ sản phẩm của KicksZone.</p>
      </div>
      
      {/* FORM NHẬP HÀNG */}
      <div style={{ background: '#fff', padding: '35px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f1f1', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', fontWeight: '800', color: '#111', borderBottom: '2px solid #f1f1f1', paddingBottom: '15px' }}>
          ➕ THÊM SẢN PHẨM MỚI
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div>
            <label style={{ fontWeight: '700', display: 'block', marginBottom: '10px', fontSize: '13px', color: '#555' }}>TÊN SẢN PHẨM:</label>
            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="VD: Nike Air Jordan 1 Low" style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#f9f9f9', outline: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ fontWeight: '700', display: 'block', marginBottom: '10px', fontSize: '13px', color: '#555' }}>THƯƠNG HIỆU:</label>
              <select name="brand" required value={formData.brand} onChange={handleInputChange} style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#f9f9f9', outline: 'none', cursor: 'pointer' }}>
                <option value="">-- Chọn --</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Puma">Puma</option>
                <option value="Jordan">Jordan</option>
                <option value="Vans">Vans</option>
                <option value="Converse">Converse</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            
            <div>
              <label style={{ fontWeight: '700', display: 'block', marginBottom: '10px', fontSize: '13px', color: '#555' }}>GIỚI TÍNH:</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#f9f9f9', outline: 'none', cursor: 'pointer' }}>
                <option value="Nam">Giày Nam</option>
                <option value="Nữ">Giày Nữ</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label style={{ fontWeight: '700', display: 'block', marginBottom: '10px', fontSize: '13px', color: '#555' }}>GIÁ BÁN (VNĐ):</label>
              <input type="number" name="price" required value={formData.price} onChange={handleInputChange} placeholder="VD: 2500000" style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#f9f9f9', outline: 'none' }} />
            </div>
          </div>

          <div>
            <label style={{ fontWeight: '700', display: 'block', marginBottom: '10px', fontSize: '13px', color: '#555' }}>MÔ TẢ:</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Mô tả chi tiết sản phẩm..." style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#f9f9f9', outline: 'none', minHeight: '80px' }} />
          </div>

          <div>
            <label style={{ fontWeight: '700', display: 'block', marginBottom: '10px', fontSize: '13px', color: '#555' }}>LINK ẢNH (Dấu phẩy ngăn cách):</label>
            <input type="text" name="imageLinks" value={formData.imageLinks} onChange={handleInputChange} placeholder="Link 1, Link 2..." style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#f9f9f9', outline: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'center' }}>
            <div>
              <label style={{ fontWeight: '700', display: 'block', marginBottom: '10px', fontSize: '13px', color: '#555' }}>SỐ LƯỢNG KHO:</label>
              <input type="number" name="countInStock" value={formData.countInStock} onChange={handleInputChange} style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#f9f9f9', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontWeight: '700', display: 'block', marginBottom: '10px', fontSize: '13px', color: '#555' }}>HOẶC TẢI ẢNH TỪ MÁY:</label>
              <input type="file" onChange={handleFileChange} style={{ width: '100%', cursor: 'pointer' }} />
            </div>
          </div>

          <div style={{ padding: '15px', background: '#fff8e1', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px dashed #ffb300' }}>
            <input type="checkbox" name="isNewArrival" id="newArrival" checked={formData.isNewArrival} onChange={handleInputChange} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            <label htmlFor="newArrival" style={{ fontWeight: 'bold', color: '#f57c00', cursor: 'pointer', fontSize: '13px' }}>
              🔥 ĐÁNH DẤU "HÀNG MỚI VỀ"
            </label>
          </div>

          <button type="submit" style={{ background: '#111', color: 'white', padding: '18px', border: 'none', fontWeight: '900', cursor: 'pointer', borderRadius: '10px', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
            XÁC NHẬN LƯU VÀO KHO
          </button>
        </form>
      </div>

      {/* DANH SÁCH TỔNG KHO */}
      <div style={{ background: '#fff', padding: '35px', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.04)', border: '1px solid #f1f1f1' }}>
        <h3 style={{ margin: '0 0 25px 0', fontSize: '18px', fontWeight: '800', color: '#111' }}>📋 TỔNG KHO KICKSZONE</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '12px', fontWeight: '800' }}>ẢNH</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '12px', fontWeight: '800' }}>SẢN PHẨM</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '12px', fontWeight: '800' }}>PHÂN LOẠI</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '12px', fontWeight: '800' }}>GIÁ BÁN</th>
                <th style={{ padding: '15px 20px', color: '#666', fontSize: '12px', fontWeight: '800', textAlign: 'center' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? products.map((p) => {
                const displayImg = Array.isArray(p.images) ? p.images[0] : (p.image || p.images);
                return (
                  <tr key={p._id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                    <td style={{ padding: '15px 20px' }}>
                      <img 
                        src={displayImg?.startsWith('http') ? displayImg : `${API_URL}${displayImg}`} 
                        alt={p.name} 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} 
                      />
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ fontWeight: '700', color: '#111', fontSize: '14px' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>{p.brand}</div>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      <span style={{ 
                        padding: '5px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                        background: p.gender === 'Nữ' ? '#fce4ec' : (p.gender === 'Unisex' ? '#f3e5f5' : '#e3f2fd'),
                        color: p.gender === 'Nữ' ? '#d81b60' : (p.gender === 'Unisex' ? '#8e24aa' : '#1976d2')
                      }}>
                        {p.gender || 'Nam'}
                      </span>
                    </td>
                    <td style={{ padding: '15px 20px', fontWeight: '900', color: '#111' }}>{p.price?.toLocaleString()} đ</td>
                    <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                      <button onClick={() => handleDelete(p._id, p.name)} style={{ background: '#ffebee', color: '#c62828', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        XÓA
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Chưa có hàng trong kho sếp ơi!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
