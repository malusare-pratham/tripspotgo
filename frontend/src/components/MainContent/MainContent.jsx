import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainContent.css';

const MainContent = () => {
  const navigate = useNavigate();
  const categories = [
    {
      title: "Food & Dining",
      items: [
        { name: "Veg Pahari Fresh", shop: "Wow! Momo", img: "https://images.unsplash.com/photo-1534422298391-e4f8c170db06?w=500" },
        { name: "Authentic Pizza", shop: "Domino's", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
        { name: "Classic Burger", shop: "Burger King", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500" },
        { name: "Cheese Pasta", shop: "Italy Cafe", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500" },
        { name: "Paneer Tikka", shop: "Desi Kitchen", img: "https://images.unsplash.com/photo-1567184102591-f178274386a5?w=500" },
        { name: "Cold Coffee", shop: "Starbucks", img: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=500" },
      ]
    },
    {
      title: "Activities",
      items: [
        { name: "Paragliding", shop: "Harrison's Folly", img: "https://images.unsplash.com/photo-1596752009228-569b30c90961?w=500" },
        { name: "Go Karting", shop: "Velocity Ent.", img: "https://images.unsplash.com/photo-1595122176149-65230919280d?w=500" },
        { name: "Venna Lake Boating", shop: "Venna Lake", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500" },
        { name: "Trekking Adventure", shop: "Nature Club", img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=500" },
        { name: "Horse Riding", shop: "Table Land", img: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=500" },
        { name: "Waterfall Rappelling", shop: "Adventure Hub", img: "https://images.unsplash.com/photo-1433086966358-54859d0ed711?w=500" },
      ]
    },
    {
      title: "Stores",
      items: [
        { name: "Leather Footwear", shop: "Bazar Peth", img: "https://images.unsplash.com/photo-1562273103-912067decb6a?w=500" },
        { name: "Pure Honey & Jams", shop: "Local Farm", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500" },
        { name: "Handmade Bags", shop: "Artisans Shop", img: "https://images.unsplash.com/photo-1544816153-199d84405304?w=500" },
        { name: "Wooden Artifacts", shop: "Craft Store", img: "https://images.unsplash.com/photo-1590413058203-02456e793910?w=500" },
        { name: "Antique Jewelry", shop: "Heritage Shop", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500" },
        { name: "Silk Sarees", shop: "Traditional Hub", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500" },
      ]
    },
    {
      title: "Hotels & Villas",
      items: [
        { name: "Luxury Valley Stay", shop: "Panchgani Heights", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500" },
        { name: "Hilltop Resort", shop: "Mahabaleshwar Inn", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500" },
        { name: "Forest View Villa", shop: "Nature Retreat", img: "https://images.unsplash.com/photo-1551882547-ff43c61f1c9c?w=500" },
        { name: "Blue Lake Resort", shop: "Lake View", img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500" },
        { name: "Mountain Edge", shop: "Eco Stay", img: "https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=500" },
        { name: "Heritage Villa", shop: "Royal Palms", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500" },
      ]
    }
  ];

  return (
    <div className="main-container">
      {/* नवीन टॉप हेडिंग */}
      <h1 className="main-top-heading">Lowest prices for all your favourite Magicpoints</h1>
      
      {categories.map((cat, idx) => (
        <section key={idx} className="category-section">
          <h2 className="section-title">{cat.title}</h2>
          <div className="sliding-row">
            {cat.items.map((item, i) => (
              <div key={i} className="deal-card" onClick={() => navigate('/signup')}>
                <div className="image-container">
                  <div className="discount-badge">10% OFF</div>
                  <img src={item.img} alt={item.name} loading="lazy" />
                </div>
                <div className="card-info">
                  <span className="shop-label">{item.shop}</span>
                  <h3 className="item-name">{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MainContent;
