import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import MenuSlider from "../menuslider/MenuSlider"; // MenuSlider इम्पॉर्ट केला
import "./MainPageContent.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const FilterBar = ({ activeCategory, setActiveCategory }) => {
  const categories = ["Food & Dining", "Activities & Adventure", "Local Stores & Gift House", "Stay & Hotels"];

  return (
    <div className="mp-filter-section">
      <div className="mp-category-tabs">
        {categories.map((cat) => (
          <button 
            key={cat} 
            className={`mp-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

const OfferCard = ({ item, onClick, onOpenLocation }) => (
    <div className="mp-offer-card" onClick={onClick}>
      <div className="mp-image-box">
        <img src={item.image} alt={item.name} loading="eager" />
        <div className="mp-save-badge">
          <span>Save</span>
          <strong>{item.discountValue}</strong>
        </div>
      </div>
      <div className="mp-card-content">
        <div className="mp-card-header">
          <div className="mp-name-block">
            <div className="mp-name-row">
              <h3>{item.name}</h3>
              <span className="mp-veg-badge">Veg</span>
            </div>
            <button
              type="button"
              className="mp-location-below"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLocation();
              }}
            >
              <MapPin size={13} />
              <span>{item.distanceLabel}</span>
            </button>
          </div>
          <div className="mp-status-rating">
            <span className={`mp-rating ${parseFloat(item.rating) >= 4 ? "high" : "mid"}`}>
              <Star size={12} fill="white" style={{ marginRight: "3px" }} />
              {item.rating}
            </span>
            <span className="mp-open-now">Open Now</span>
          </div>
        </div>
      </div>
    </div>
);

const MainPageContent = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Food & Dining");

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/partners`);
        setPartners(Array.isArray(response.data) ? response.data : []);
      } catch (_error) { setPartners([]); }
    };
    fetchPartners();
  }, []);

  const filteredItems = useMemo(() => {
    return partners
      .filter(p => p.status === "Active" && (p.businessStatus || "OPEN") === "OPEN")
      .map((partner, index) => ({
        id: partner._id || index,
        name: partner.restaurantName || "Partner Restaurant",
        rating: "4.2",
        distanceLabel: `4km, ${partner.area || "Panchgani"}`,
        locationUrl: partner.locationLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(partner.area || "Panchgani")}`,
        discountValue: "10%",
        image: partner.imageUrl || "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80",
        businessCategory: partner.businessCategory || "Food & Dining",
      }))
      .filter(item => item.businessCategory === activeCategory);
  }, [partners, activeCategory]);

  return (
    <div className="mp-scope">
      <div className="mp-main-container">
        {/* नवीन MenuSlider कॉम्पोनंट */}
        <MenuSlider />

        <header className="mp-page-header">
          <h1 className="mp-gradient-title">Explore nearby offers</h1>
          <p className="mp-sub-title">Lowest prices for all your favourite Magicpoints</p>
        </header>

        <FilterBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

        <section className="mp-section">
          <div className="mp-section-header">
            <h2>{activeCategory}</h2>
          </div>

          <div className="mp-offers-container">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <OfferCard
                  key={item.id}
                  item={item}
                  onClick={() => navigate("/restaurant")}
                  onOpenLocation={() => window.open(item.locationUrl, "_blank", "noopener,noreferrer")}
                />
              ))
            ) : ( <p className="no-data">No offers available.</p> )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainPageContent;


