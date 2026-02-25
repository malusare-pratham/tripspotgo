import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Star, Camera, Video, Phone, Navigation, Plus, Leaf } from 'lucide-react';
import './RestaurantPage.css';

const RestaurantPage = () => {
  const [activeTab, setActiveTab] = useState('MENU');
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [foodFilter, setFoodFilter] = useState('all');
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [galleryItems, setGalleryItems] = useState([
    { type: 'image', src: 'https://images.unsplash.com/photo-1513104890138-7c749659a591' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1544025162-d76694265947' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17' }
  ]);

  const tabs = ['MENU', 'REVIEWS', 'PHOTOS'];
  const foodFilters = ['all', 'veg', 'nonveg'];

  const handleBack = () => {
    navigate('/DashboardPage');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    return () => {
      galleryItems.forEach((item) => {
        if (item?.isLocal && item?.src?.startsWith('blob:')) {
          URL.revokeObjectURL(item.src);
        }
      });
    };
  }, [galleryItems]);

  const addFilesToGallery = (fileList, type) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const newItems = files.map((file) => ({
      type,
      src: URL.createObjectURL(file),
      isLocal: true
    }));

    setGalleryItems((prev) => [...newItems, ...prev]);
  };

  const menuData = [
    {
      category: "Signature Pizzas",
      items: [
        { name: 'Personal Pan Pizza', price: '₹299', desc: 'Fresh dough with signature sauce', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', type: 'nonveg' },
        { name: 'Tandoori Paneer Pizza', price: '₹449', desc: 'Spiced paneer with capsicum', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80', type: 'veg' }
      ]
    },
    {
      category: "Sides & Desserts",
      items: [
        { name: 'Garlic Breadstix', price: '₹149', desc: 'Buttery & cheesy garlic sticks', img: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=400&q=80', type: 'veg' },
        { name: 'Choco Lava Cake', price: '₹99', desc: 'Warm cake with molten chocolate', img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80', type: 'veg' }
      ]
    }
  ];

  return (
    <div className="rp-main-wrapper">
      {/* --- NAVBAR --- */}
      <header className="rp-header">
        <div className="rp-header-content">
          <div className="rp-nav-left">
            <button className="rp-back-btn" onClick={handleBack}>
              <ArrowLeft size={20} />
            </button>
            <div className="rp-logo">MagicPoints</div>
          </div>
          <div className="rp-search-bar">
            <Search className="rp-s-icon" size={16} />
            <input type="text" placeholder="Search menu..." />
          </div>
          <div className="rp-nav-right">
            <button className="rp-redeem-nav-btn" onClick={() => navigate('/upload-bill')}>Redeem</button>
          </div>
        </div>
      </header>

      {/* --- HERO --- */}
      <div className="rp-hero-cover">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80" alt="Cover" />
      </div>

      <main className="rp-content-container">
        <section className="rp-restaurant-card">
          <div className="rp-brand-content">
            <h1>Pizza Hut</h1>
            <div className="rp-tags">
              <span>Pizza • Italian • Fast Food</span>
              <span className="rp-veg-badge">
                <Leaf size={13} />
                Veg
              </span>
            </div>
            <p className="rp-description">
              Experience the world's favorite pan pizza. Serving happiness one slice at a time.
            </p>
            <div className="rp-loc-pill">📍 Connaught Place, New Delhi</div>
          </div>

          <div className="rp-info-footer">
            <div className="rp-stats-grid">
              <div className="rp-stat-item">
                <div className="rp-rating-box">4.2 <Star size={14} fill="white" /></div>
                <span className="rp-stat-label">2,300+ Reviews</span>
              </div>
              <div className="rp-stat-item">
                <span className="rp-stat-val rp-open-text">Open Now</span>
                <span className="rp-stat-label">11:00 AM - 11:00 PM</span>
              </div>
            </div>
            
            <div className="rp-cta-buttons">
              <button className="rp-btn-call" onClick={() => window.open('tel:+919876543210')}>
                <Phone size={18} /> Call
              </button>
              <button className="rp-btn-dir" onClick={() => window.open('https://maps.google.com')}>
                <Navigation size={18} /> Directions
              </button>
              <button className="rp-btn-redeem" onClick={() => navigate('/upload-bill')}>
                Redeem Now
              </button>
            </div>
          </div>
        </section>

        <nav className="rp-tabs-nav">
          {tabs.map((tab) => (
            <button key={tab} className={`rp-tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </nav>

        <div className="rp-tab-panel">
          {activeTab === 'MENU' && (
            <div className="rp-menu-wrap">
              <div className="rp-food-filter-row">
                {foodFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={`rp-food-pill ${foodFilter === filter ? 'active' : ''}`}
                    onClick={() => setFoodFilter(filter)}
                  >
                    {filter === 'all' ? 'All' : filter === 'veg' ? 'Veg' : 'Non-Veg'}
                  </button>
                ))}
              </div>
              {menuData.map((section, idx) => (
                <div key={idx} className="rp-menu-section">
                  <h2 className="rp-cat-header">{section.category}</h2>
                  <div className="rp-menu-grid">
                    {section.items
                      .filter((item) => foodFilter === 'all' || item.type === foodFilter)
                      .map((item, i) => (
                      <div key={i} className="rp-menu-card">
                        <div className="rp-menu-img-box">
                          <img src={item.img} alt={item.name} />
                          <div className="rp-item-discount">10% OFF</div>
                        </div>
                        <div className="rp-menu-details">
                          <div className="rp-item-info">
                            <h3>
                              {item.name}
                              <span className={`rp-food-badge ${item.type}`}>
                                {item.type === 'veg' ? 'Veg' : 'Non-Veg'}
                              </span>
                            </h3>
                            <p>{item.desc}</p>
                          </div>
                          <div className="rp-item-price-action">
                            <span className="rp-price">{item.price}</span>
                            <button className="rp-add-item"><Plus size={16} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'REVIEWS' && (
            <div className="rp-reviews-section">
              <div className="rp-rating-summary-card">
                 <div className="rp-rating-big">
                    <span className="rp-big-num">4.2</span>
                    <div className="rp-stars-row">
                        {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= 4 ? "#f59e0b" : "none"} stroke="#f59e0b" />)}
                    </div>
                    <p>Overall Rating</p>
                 </div>
                 <div className="rp-rate-action">
                    <h3>Rate your experience</h3>
                    <div className="rp-star-input">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={28} onClick={() => setUserRating(s)} 
                                  fill={userRating >= s ? "#6d28d9" : "none"} 
                                  stroke={userRating >= s ? "#6d28d9" : "#cbd5e1"} 
                                  style={{cursor:'pointer', transition: '0.2s'}} />
                        ))}
                    </div>
                 </div>
              </div>

              <div className="rp-review-input-box">
                <textarea placeholder="Tell others about the food and service..."></textarea>
                <button className="rp-btn-submit">Post Review</button>
              </div>

              <div className="rp-reviews-list">
                {[{ name: "Rahul S.", text: "Best pizza in CP! The crust was perfect and the service was super fast.", stars: 5, date: "2 days ago" }].map((rev, i) => (
                  <div key={i} className="rp-review-item">
                    <div className="rp-rev-head">
                      <div className="rp-avatar">{rev.name[0]}</div>
                      <div className="rp-user-info">
                        <strong>{rev.name}</strong>
                        <span className="rp-rev-date">{rev.date}</span>
                      </div>
                      <div className="rp-rev-stars">
                        {Array(rev.stars).fill().map((_, i) => <Star key={i} size={12} fill="#f59e0b" stroke="#f59e0b" />)}
                      </div>
                    </div>
                    <p className="rp-rev-text">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'PHOTOS' && (
            <div className="rp-photos-wrap">
              <div className="rp-photo-actions">
                <button type="button" className="rp-upload-card" onClick={() => photoInputRef.current?.click()}>
                    <div className="rp-up-icon-box"><Camera size={24} /></div>
                    <span>Add Photo</span>
                </button>
                <button type="button" className="rp-upload-card" onClick={() => videoInputRef.current?.click()}>
                    <div className="rp-up-icon-box"><Video size={24} /></div>
                    <span>Add Video</span>
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    addFilesToGallery(e.target.files, 'image');
                    e.target.value = '';
                  }}
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    addFilesToGallery(e.target.files, 'video');
                    e.target.value = '';
                  }}
                />
              </div>
              <div className="rp-photo-gallery">
                {galleryItems.map((item, index) => (
                  <div className="rp-gallery-item" key={`${item.src}-${index}`}>
                    {item.type === 'video' ? (
                      <video src={item.src} controls playsInline preload="metadata" />
                    ) : (
                      <img src={item.src} alt={`G${index + 1}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RestaurantPage;

