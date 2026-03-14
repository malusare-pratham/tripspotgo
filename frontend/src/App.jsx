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

// --- नवीन RestaurantPagelist कंपोनंट Import केला ---
import RestaurantPagelist from './components/singlepage/RestaurantPagelist';

// नवीन Advertisement कंपोनंट Import केला
import Advertisement from './components/addvertisment/addvertisment';

// --- Transaction Page Import ---
import TransactionPage from './components/transaction/TransactionPage'; 

// --- Admin Portal Components ---
import AdminLogin from './AdminPortal/AdminLogin';
import AdminDashboard from './AdminPortal/AdminDashboard';

// --- Partner Portal Components ---
import PartnerLogin from './PartnerPortal/PartnerLogin';
import PartnerDashboard from './PartnerPortal/PartnerDashboard';

// --- नवीन Info कंपोनंट Import ---
import Info from './AdminPortal/info';

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
    location.pathname === '/restaurant-list' || 
    location.pathname === '/transaction-history' || 
    location.pathname === '/admin-login' ||
    location.pathname === '/admin-dashboard' ||
    location.pathname === '/admin/dashboard' ||
    location.pathname === '/partner-login' ||   
    location.pathname === '/admin/info' || 
    location.pathname === '/partner-dashboard' ||
    location.pathname === '/partner/dashboard';  

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
          
          {/* नवीन RestaurantPagelist रूट */}
          <Route path="/restaurant-list" element={<RestaurantPagelist />} />

          {/* --- नवीन Admin Info रूट अ‍ॅड केला --- */}
          <Route path="/admin/info" element={<Info />} />
          
          <Route path="/transaction-history" element={<TransactionPage />} />

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

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
      <Navbar fixed />
      <div style={{ paddingTop: '70px' }}>
        <Hero />
        <MainContent/>
        {/* --- इथे तुझा जाहिरात कंपोनंट टाकला आहे --- */}
        <Advertisement />
        <Categories /> 
        <Benefits />
        <Footer />
      </div>
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