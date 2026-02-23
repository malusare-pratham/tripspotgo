import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Steps from './components/steps/Steps'; 
import Benefits from './components/benefits/Benefits'; 
import Categories from './components/categories/Categories'; 
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login'; 
import ForgotPassword from './pages/ForgotPassword'; 
import BillPage from './pages/BillPage'; 
import VerifyOTP from './pages/VerifyOTP'; 
import Confirmation from './pages/Confirmation'; 
import Footer from './components/Footer/Footer'; 
import MainContent from './components/MainContent/MainContent'; 
import Dashboard from './pages/DashboardPage'; 
import Restaurant from './components/singlepage/RestaurantPage'; 

// --- Admin Portal Components ---
import AdminLogin from './AdminPortal/AdminLogin';
import AdminDashboard from './AdminPortal/AdminDashboard';

// --- Partner Portal Components ---
import PartnerLogin from './PartnerPortal/PartnerLogin';
import PartnerDashboard from './PartnerPortal/PartnerDashboard';

const AppLayout = () => {
  const location = useLocation();
  
  const hideHeaderFooter = 
    location.pathname === '/upload-bill' || 
    location.pathname === '/verify-otp' || 
    location.pathname === '/confirmation' ||
    location.pathname === '/login' ||
    location.pathname === '/forgot-password' || 
    location.pathname === '/DashboardPage' || 
    location.pathname === '/signup' ||
    location.pathname === '/restaurant' ||
    location.pathname === '/admin-login' ||
    location.pathname === '/admin-dashboard' ||
    location.pathname === '/admin/dashboard' ||
    location.pathname === '/partner-login' ||    // Partner Login साठी लपवले
    location.pathname === '/partner-dashboard' ||
    location.pathname === '/partner/dashboard';  // Partner Dashboard साठी लपवले

  return (
    <div className="app-container">
      {/* {!hideHeaderFooter && <Navbar />} */}
      
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/upload-bill" element={<BillPage />} /> 
          <Route path="/verify-otp" element={<VerifyOTP />} /> 
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/DashboardPage" element={<Dashboard />} />
          <Route path="/restaurant" element={<Restaurant />} />

          {/* --- Admin Portal Routes --- */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* --- Partner Portal Routes --- */}
          <Route path="/partner-login" element={<PartnerLogin />} />
          <Route path="/partner-dashboard" element={<PartnerDashboard />} />
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        </Routes>
      </main>

      {/* {!hideHeaderFooter && <Footer />} */}
    </div>
  );
};

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <MainContent/>
      <Categories /> 
      <Benefits />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
