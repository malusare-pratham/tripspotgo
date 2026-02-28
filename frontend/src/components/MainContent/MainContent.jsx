import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import './MainContent.css';

const MainContent = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Food & Dining");

  const categories = [
    {
      title: "Food & Dining",
      items: [
        { name: "Veg Pahari Fresh", shop: "Wow! Momo", img: "https://images.unsplash.com/photo-1534422298391-e4f8c170db06?w=500" },
        { name: "Authentic Pizza", shop: "Domino's", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
        { name: "Classic Burger", shop: "Burger King", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500" },
        { name: "Cheese Pasta", shop: "Italy Cafe", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500" },
      ]
    },
    {
      title: "Activities",
      items: [
        { name: "Paragliding", shop: "Harrison's Folly", img: "https://images.unsplash.com/photo-1596752009228-569b30c90961?w=500" },
        { name: "Go Karting", shop: "Velocity Ent.", img: "https://images.unsplash.com/photo-1595122176149-65230919280d?w=500" },
        { name: "Venna Lake Boating", shop: "Venna Lake", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500" },
        { name: "Trekking Adventure", shop: "Nature Club", img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=500" },
      ]
    },
    {
      title: "Stores",
      items: [
        { name: "Leather Footwear", shop: "Bazar Peth", img: "https://images.unsplash.com/photo-1562273103-912067decb6a?w=500" },
        { name: "Pure Honey & Jams", shop: "Local Farm", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500" },
        { name: "Handmade Bags", shop: "Artisans Shop", img: "https://images.unsplash.com/photo-1544816153-199d84405304?w=500" },
        { name: "Wooden Artifacts", shop: "Craft Store", img: "https://images.unsplash.com/photo-1590413058203-02456e793910?w=500" },
      ]
    },
    {
      title: "Hotels & Villas",
      items: [
        { name: "Luxury Valley Stay", shop: "Panchgani Heights", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500" },
        { name: "Hilltop Resort", shop: "Mahabaleshwar Inn", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500" },
        { name: "Forest View Villa", shop: "Nature Retreat", img: "https://images.unsplash.com/photo-1551882547-ff43c61f1c9c?w=500" },
        { name: "Blue Lake Resort", shop: "Lake View", img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500" },
      ]
    }
  ];

  const visibleCategory = useMemo(
    () => categories.find((cat) => cat.title === activeCategory) || categories[0],
    [activeCategory]
  );

  return (
    <div className="mc-main-container">
      <h1 className="mc-main-top-heading">Lowest prices for your favorite Magicpoints</h1>

      <div className="mc-tab-row">
        {categories.map((cat) => (
          <button
            key={cat.title}
            type="button"
            className={`mc-tab-btn ${activeCategory === cat.title ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.title)}
          >
            {cat.title}
          </button>
        ))}
      </div>

      <section className="mc-category-section">
        <div className="mc-section-header">
          <h2 className="mc-section-title">{visibleCategory.title}</h2>
          <button type="button" className="mc-view-all" onClick={() => navigate('/signup')}>View All</button>
        </div>

        <div className="mc-sliding-row">
          {visibleCategory.items.map((item, i) => (
            <div key={i} className="mc-deal-card" onClick={() => navigate('/signup')}>
              <div className="mc-image-container">
                <div className="mc-discount-badge">10% OFF</div>
                <img src={item.img} alt={item.name} loading="lazy" />
              </div>
              <div className="mc-card-info">
                <span className="mc-shop-label">
                  <MapPin size={12} />
                  Mahabaleshwer
                </span>
                <h3 className="mc-item-name">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainContent;
