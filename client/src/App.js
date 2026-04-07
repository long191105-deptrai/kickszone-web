import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; 

// --- IMPORT THƯ VIỆN THÔNG BÁO ---
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 1. Import dành cho Khách hàng
import { CartProvider } from './context/CartContext';
import Home from './pages/public/Home';
import ProductDetail from './pages/public/ProductDetail';
import Cart from './pages/public/Cart';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import BrandPage from './pages/public/BrandPage';
import Checkout from './pages/public/Checkout';
import Policy from './pages/public/Policy';
import MyOrders from './pages/public/MyOrders'; 
import Profile from './pages/public/Profile';
import CategoryPage from './pages/public/CategoryPage'; 

// 2. Import dành cho Admin
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';
import ManageSettings from './pages/admin/ManageSettings';

// --- HÀM KIỂM TRA QUYỀN ADMIN (BẢO VỆ ROUTE) ---
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  // Nếu là admin thì cho vào, không thì đá về trang chủ
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* --- ROUTES KHÁCH HÀNG --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/brand/:brandName" element={<BrandPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/category/:type" element={<CategoryPage />} />

            {/* --- ROUTES CHÍNH SÁCH --- */}
            <Route path="/policy/exchange" element={
              <Policy title="Chính sách đổi trả" content={
                <div>
                  <p>✓ Hỗ trợ đổi trả trong vòng <b>30 ngày</b> kể từ ngày nhận hàng.</p>
                  <p>✓ Sản phẩm phải còn nguyên tem mác, chưa qua sử dụng.</p>
                </div>
              } />
            } />

            <Route path="/policy/warranty" element={
              <Policy title="Chính sách bảo hành" content={
                <div>
                  <p>✓ <b>Bảo hành keo trọn đời</b> cho tất cả sản phẩm giày mua tại KicksZone.</p>
                </div>
              } />
            } />

            <Route path="/policy/privacy" element={
              <Policy title="Chính sách bảo mật" content={
                <div>
                  <p><b>KicksZone</b> cam kết bảo mật tuyệt đối thông tin khách hàng.</p>
                </div>
              } />
            } />

            <Route path="/policy/terms" element={
              <Policy title="Điều khoản dịch vụ" content={
                <div>
                  <p>Chào mừng bạn đến với <b>KicksZone</b>. Vui lòng tuân thủ quy định mua hàng.</p>
                </div>
              } />
            } />

            {/* --- ROUTES ADMIN (ĐÃ ĐƯỢC BẢO VỆ) --- */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<Dashboard />} /> 
              <Route path="users" element={<ManageUsers />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="settings" element={<ManageSettings />} />
            </Route>

            {/* --- ROUTE 404: NẾU GÕ SAI LINK THÌ VỀ HOME --- */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>

          {/* --- BOX THÔNG BÁO --- */}
          <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            theme="dark" 
          />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
