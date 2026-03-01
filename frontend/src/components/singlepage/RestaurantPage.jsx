import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Star, Camera, Video, Phone, Navigation, Leaf } from 'lucide-react';
import './RestaurantPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const DEFAULT_LOGO = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=320&q=80';

const normalizeAssetUrl = (rawUrl) => {
  if (!rawUrl) return '';
  const value = String(rawUrl).trim();
  if (!value) return '';

  if (/^https?:\/\//i.test(value)) {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && value.startsWith('http://')) {
      return value.replace(/^http:\/\//i, 'https://');
    }
    return value;
  }

  if (value.startsWith('//')) {
    return `${typeof window !== 'undefined' ? window.location.protocol : 'https:'}${value}`;
  }

  if (!API_BASE_URL) return value;
  const base = API_BASE_URL.replace(/\/+$/, '');
  const path = value.replace(/^\/+/, '');
  return `${base}/${path}`;
};

const defaultGallery = [
  { type: 'image', src: 'https://images.unsplash.com/photo-1513104890138-7c749659a591' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1544025162-d76694265947' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17' }
];

const defaultInfo = {
  email: '',
  memberSince: '2026',
  logo: '',
  restaurantName: 'Pizza Hut',
  subtitle: 'Pizza • Italian • Fast Food',
  foodType: 'Veg',
  description: "Experience the world's favorite pan pizza. Serving happiness one slice at a time.",
  rating: 4.2,
  location: 'Connaught Place, New Delhi',
  openTime: '11:00 AM',
  closeTime: '11:00 PM',
  callNumber: '+919876543210',
  directionLink: 'https://maps.google.com',
  menu: { vegMenu: [], nonVegMenu: [], cafeMenu: [] },
  photos: [],
  videos: []
};

const fallbackMenu = [
  {
    category: 'Signature Pizzas',
    items: [
      { name: 'Personal Pan Pizza', price: 299, desc: 'Fresh dough with signature sauce', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', type: 'nonveg' },
      { name: 'Tandoori Paneer Pizza', price: 449, desc: 'Spiced paneer with capsicum', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80', type: 'veg' }
    ]
  },
  {
    category: 'Sides & Desserts',
    items: [
      { name: 'Garlic Breadstix', price: 149, desc: 'Buttery & cheesy garlic sticks', img: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=400&q=80', type: 'veg' },
      { name: 'Choco Lava Cake', price: 99, desc: 'Warm cake with molten chocolate', img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80', type: 'veg' }
    ]
  }
];

const RestaurantPage = () => {
  const [activeTab, setActiveTab] = useState('MENU');
  const navigate = useNavigate();
  const location = useLocation();
  const [userRating, setUserRating] = useState(0);
  const [foodFilter, setFoodFilter] = useState('all');
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [restaurantInfo, setRestaurantInfo] = useState(defaultInfo);
  const [galleryItems, setGalleryItems] = useState(defaultGallery);

  const tabs = ['MENU', 'REVIEWS', 'PHOTOS'];
  const foodFilters = ['all', 'veg', 'nonveg'];

  const partnerIdFromState = location?.state?.partnerId;
  const partnerIdFromQuery = new URLSearchParams(location.search).get('partnerId');
  const partnerIdFromStorage = (() => {
    try {
      return JSON.parse(localStorage.getItem('partnerInfo') || '{}')?.id;
    } catch (_error) {
      return '';
    }
  })();
  const partnerIdFromSelection = localStorage.getItem('selectedPartnerId') || '';
  const partnerId = partnerIdFromState || partnerIdFromQuery || partnerIdFromSelection || partnerIdFromStorage;

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

  useEffect(() => {
    if (!partnerId) return;
    const fetchInfo = async () => {
      try {
        const partnersRes = await axios.get(`${API_BASE_URL}/api/admin/partners`);
        const partners = Array.isArray(partnersRes?.data) ? partnersRes.data : [];
        const basePartner = partners.find((p) => String(p?._id || '') === String(partnerId));

        if (basePartner) {
          setRestaurantInfo((prev) => ({
            ...prev,
            logo: normalizeAssetUrl(basePartner.imageUrl) || prev.logo,
            restaurantName: basePartner.restaurantName || prev.restaurantName,
            subtitle: basePartner.businessCategory || prev.subtitle,
            foodType: basePartner.foodType || prev.foodType,
            location: basePartner.area || prev.location,
            openTime: basePartner.openTime || prev.openTime,
            closeTime: basePartner.closeTime || prev.closeTime,
            directionLink: basePartner.locationLink || prev.directionLink
          }));
        }

        const res = await axios.get(`${API_BASE_URL}/api/admin/partner-info/${partnerId}`);
        const info = res?.data?.data;
        if (!info) return;

        setRestaurantInfo((prev) => ({
          ...prev,
          email: info.email || '',
          memberSince: info.memberSince || '2026',
          logo: normalizeAssetUrl(info.logo) || prev.logo,
          restaurantName: info.restaurantName || prev.restaurantName,
          subtitle: info.subtitle || prev.subtitle,
          foodType: info.foodType || prev.foodType,
          description: info.description || prev.description,
          rating: Number(info.rating ?? prev.rating),
          location: info.location || prev.location,
          openTime: info.openTime || prev.openTime,
          closeTime: info.closeTime || prev.closeTime,
          callNumber: info.callNumber || prev.callNumber,
          directionLink: info.directionLink || prev.directionLink,
          menu: {
            vegMenu: Array.isArray(info?.menu?.vegMenu) ? info.menu.vegMenu : [],
            nonVegMenu: Array.isArray(info?.menu?.nonVegMenu) ? info.menu.nonVegMenu : [],
            cafeMenu: Array.isArray(info?.menu?.cafeMenu) ? info.menu.cafeMenu : []
          },
          photos: Array.isArray(info.photos) ? info.photos.map((src) => normalizeAssetUrl(src) || src) : [],
          videos: Array.isArray(info.videos) ? info.videos.map((src) => normalizeAssetUrl(src) || src) : []
        }));

        const mediaItems = [
          ...(Array.isArray(info.photos) ? info.photos : []).map((src) => ({ type: 'image', src: normalizeAssetUrl(src) || src })),
          ...(Array.isArray(info.videos) ? info.videos : []).map((src) => ({ type: 'video', src: normalizeAssetUrl(src) || src }))
        ];
        if (mediaItems.length > 0) {
          setGalleryItems(mediaItems);
        }
      } catch (_error) {
        // Keep fallback UI data
      }
    };
    fetchInfo();
  }, [partnerId]);

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

  const menuData = useMemo(() => {
    const menu = restaurantInfo.menu || {};
    const vegItems = Array.isArray(menu.vegMenu) ? menu.vegMenu : [];
    const nonVegItems = Array.isArray(menu.nonVegMenu) ? menu.nonVegMenu : [];
    const cafeItems = Array.isArray(menu.cafeMenu) ? menu.cafeMenu : [];

    const hasCustom = vegItems.length || nonVegItems.length || cafeItems.length;
    if (!hasCustom) return fallbackMenu;

    const normalizeItem = (item, type) => ({
      name: item?.name || 'Menu Item',
      price: Number(item?.price) || 0,
      desc: item?.description || '',
      img: normalizeAssetUrl(item?.image) || defaultGallery[0].src,
      type
    });

    const sections = [];
    if (vegItems.length) sections.push({ category: 'Veg Menu', items: vegItems.map((it) => normalizeItem(it, 'veg')) });
    if (nonVegItems.length) sections.push({ category: 'Non-Veg Menu', items: nonVegItems.map((it) => normalizeItem(it, 'nonveg')) });
    if (cafeItems.length) sections.push({ category: 'Cafe Menu', items: cafeItems.map((it) => normalizeItem(it, 'veg')) });
    return sections;
  }, [restaurantInfo.menu]);

  return (
    <div className="rp-main-wrapper">
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
            <button
              className="rp-redeem-nav-btn"
              onClick={() =>
                navigate('/upload-bill', {
                  state: {
                    partnerId,
                    partnerName: restaurantInfo.restaurantName || 'Partner Restaurant'
                  }
                })
              }
            >
              Redeem
            </button>
          </div>
        </div>
      </header>

      <div className="rp-hero-cover">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80" alt="Cover" />
      </div>

      <main className="rp-content-container">
        <section className="rp-restaurant-card">
          <div className="rp-brand-content">
            {restaurantInfo.logo ? (
              <img
                src={restaurantInfo.logo}
                alt="Logo"
                className="rp-logo-preview"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_LOGO;
                }}
              />
            ) : null}
            <h1>{restaurantInfo.restaurantName || 'Restaurant'}</h1>
            <div className="rp-tags">
              <span>{restaurantInfo.subtitle || '-'}</span>
              <span className="rp-veg-badge">
                <Leaf size={13} />
                {restaurantInfo.foodType || 'Veg'}
              </span>
            </div>
            <p className="rp-description">{restaurantInfo.description || '-'}</p>
            {restaurantInfo.email ? <p className="rp-meta-line">Email: {restaurantInfo.email}</p> : null}
            <div className="rp-loc-pill">📍 {restaurantInfo.location || 'N/A'}</div>
          </div>

          <div className="rp-info-footer">
            <div className="rp-stats-grid">
              <div className="rp-stat-item">
                <div className="rp-rating-box">{Number(restaurantInfo.rating || 0).toFixed(1)} <Star size={14} fill="white" /></div>
                <span className="rp-stat-label">Live Rating</span>
              </div>
              <div className="rp-stat-item">
                <span className="rp-stat-val rp-open-text">Open Now</span>
                <span className="rp-stat-label">{restaurantInfo.openTime || '-'} - {restaurantInfo.closeTime || '-'}</span>
              </div>
            </div>

            <div className="rp-cta-buttons">
              <button className="rp-btn-call" onClick={() => window.open(`tel:${restaurantInfo.callNumber || ''}`)}>
                <Phone size={18} /> Call
              </button>
              <button className="rp-btn-dir" onClick={() => window.open(restaurantInfo.directionLink || 'https://maps.google.com')}>
                <Navigation size={18} /> Directions
              </button>
              <button
                className="rp-btn-redeem"
                onClick={() =>
                  navigate('/upload-bill', {
                    state: {
                      partnerId,
                      partnerName: restaurantInfo.restaurantName || 'Partner Restaurant'
                    }
                  })
                }
              >
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
                              <span className="rp-price">₹{item.price}</span>
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
                  <span className="rp-big-num">{Number(restaurantInfo.rating || 0).toFixed(1)}</span>
                  <div className="rp-stars-row">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill={s <= Math.round(Number(restaurantInfo.rating || 0)) ? '#f59e0b' : 'none'} stroke="#f59e0b" />)}
                  </div>
                  <p>Overall Rating</p>
                </div>
                <div className="rp-rate-action">
                  <h3>Rate your experience</h3>
                  <div className="rp-star-input">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={28}
                        onClick={() => setUserRating(s)}
                        fill={userRating >= s ? '#6d28d9' : 'none'}
                        stroke={userRating >= s ? '#6d28d9' : '#cbd5e1'}
                        style={{ cursor: 'pointer', transition: '0.2s' }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="rp-review-input-box">
                <textarea placeholder="Tell others about the food and service..."></textarea>
                <button className="rp-btn-submit">Post Review</button>
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
