import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Star, Camera, Video, Share2, Pencil, ChevronLeft, ChevronRight, Home, UtensilsCrossed, BookOpen, Phone, Navigation, MapPin, ThumbsUp } from 'lucide-react';
import './RestaurantPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
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

const buildGalleryItems = (photos = [], videos = []) => {
  const normalizedPhotos = Array.isArray(photos) ? photos.map((src) => normalizeAssetUrl(src) || src).filter(Boolean) : [];
  const normalizedVideos = Array.isArray(videos) ? videos.map((src) => normalizeAssetUrl(src) || src).filter(Boolean) : [];
  return [
    ...normalizedPhotos.map((src) => ({ type: 'image', src })),
    ...normalizedVideos.map((src) => ({ type: 'video', src }))
  ];
};

const formatTimeLabel = (value, fallbackMeridiem = 'AM') => {
  const raw = String(value || '').trim();
  if (!raw) return '';

  if (/\b(am|pm)\b/i.test(raw)) return raw.toUpperCase();

  const match = raw.match(/^(\d{1,2})([:.](\d{1,2}))?$/);
  if (!match) return raw;

  let hour = Number(match[1]);
  const minute = Number(match[3] || 0);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return raw;

  let meridiem = fallbackMeridiem;
  if (hour === 0) {
    hour = 12;
    meridiem = 'AM';
  } else if (hour === 12) {
    meridiem = 'PM';
  } else if (hour > 12) {
    hour -= 12;
    meridiem = 'PM';
  }

  const paddedMin = String(minute).padStart(2, '0');
  return `${hour}:${paddedMin} ${meridiem}`;
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
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const navigate = useNavigate();
  const location = useLocation();
  const [userRating, setUserRating] = useState(0);
  const [visitMonth, setVisitMonth] = useState('March 2026');
  const [visitWith, setVisitWith] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewAgree, setReviewAgree] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [foodFilter, setFoodFilter] = useState('all');
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const touchStartXRef = useRef(null);
  const [restaurantInfo, setRestaurantInfo] = useState(defaultInfo);
  const [galleryItems, setGalleryItems] = useState(defaultGallery);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const tabs = ['OVERVIEW', 'MENU', 'REVIEWS', 'PHOTOS'];
  const foodFilters = ['all', 'veg', 'nonveg'];
  const companionOptions = ['Business', 'Couples', 'Family', 'Friends', 'Solo'];

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

  const handleShare = async () => {
    const shareData = {
      title: restaurantInfo.restaurantName || 'Restaurant',
      text: `Check out ${restaurantInfo.restaurantName || 'this restaurant'}`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (_error) {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (_error) {
      // no-op
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const updateView = () => setIsMobileView(window.innerWidth <= 600);
    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
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

        const mediaItems = buildGalleryItems(info.photos, info.videos);
        if (mediaItems.length > 0) {
          setGalleryItems(mediaItems);
        }
      } catch (_error) {
        // Keep fallback UI data
      }
    };
    fetchInfo();
  }, [partnerId]);

  const addFilesToGallery = async (fileList, type) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    if (!partnerId) {
      const newItems = files.map((file) => ({
        type,
        src: URL.createObjectURL(file),
        isLocal: true
      }));
      setGalleryItems((prev) => [...newItems, ...prev]);
      return;
    }

    setIsUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append('photos', JSON.stringify(Array.isArray(restaurantInfo.photos) ? restaurantInfo.photos : []));
      formData.append('videos', JSON.stringify(Array.isArray(restaurantInfo.videos) ? restaurantInfo.videos : []));

      files.forEach((file) => {
        if (type === 'image') {
          formData.append('photoFiles', file);
        } else {
          formData.append('videoFiles', file);
        }
      });

      const res = await axios.put(`${API_BASE_URL}/api/admin/partner-info/${partnerId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const savedInfo = res?.data?.data;
      const nextPhotos = Array.isArray(savedInfo?.photos) ? savedInfo.photos.map((src) => normalizeAssetUrl(src) || src) : [];
      const nextVideos = Array.isArray(savedInfo?.videos) ? savedInfo.videos.map((src) => normalizeAssetUrl(src) || src) : [];
      setRestaurantInfo((prev) => ({
        ...prev,
        photos: nextPhotos,
        videos: nextVideos
      }));

      const mediaItems = buildGalleryItems(nextPhotos, nextVideos);
      if (mediaItems.length > 0) {
        setGalleryItems(mediaItems);
      }
    } catch (_error) {
      const newItems = files.map((file) => ({
        type,
        src: URL.createObjectURL(file),
        isLocal: true
      }));
      setGalleryItems((prev) => [...newItems, ...prev]);
    } finally {
      setIsUploadingMedia(false);
    }
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

  const showcaseImages = useMemo(() => {
    const images = (galleryItems || []).filter((item) => item.type === 'image').map((item) => item.src).filter(Boolean);
    const fallback = defaultGallery.filter((item) => item.type === 'image').map((item) => item.src);
    const base = images.length ? images : fallback;
    if (base.length >= 4) return base;
    const padded = [...base];
    let idx = 0;
    while (padded.length < 4 && fallback.length) {
      padded.push(fallback[idx % fallback.length]);
      idx += 1;
    }
    return padded;
  }, [galleryItems]);

  const showcaseCards = useMemo(
    () => [
      { label: 'Interior', count: 6, icon: Home },
      { label: 'Food', count: 41, icon: UtensilsCrossed },
      { label: 'Menu', count: 2, icon: BookOpen }
    ],
    []
  );

  const goToNextShowcase = () => {
    if (!showcaseImages.length) return;
    setShowcaseIndex((prev) => (prev + 1) % showcaseImages.length);
  };

  const goToPrevShowcase = () => {
    if (!showcaseImages.length) return;
    setShowcaseIndex((prev) => (prev - 1 + showcaseImages.length) % showcaseImages.length);
  };

  useEffect(() => {
    if (showcaseImages.length <= 1) return;
    const interval = setInterval(() => {
      setShowcaseIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [showcaseImages.length]);

  const getShowcaseImage = (offset = 0) => {
    const len = showcaseImages.length;
    if (!len) return '';
    return showcaseImages[(showcaseIndex + offset + len) % len];
  };

  const activeShowcaseCard = showcaseCards[showcaseIndex % showcaseCards.length];
  const ActiveBadgeIcon = activeShowcaseCard?.icon || Camera;
  const foodTypeText = String(restaurantInfo.foodType || '').toLowerCase().includes('non') ? 'Non-Veg' : 'Veg';
  const overviewReviews = useMemo(
    () => [
      {
        id: 'r1',
        name: 'SANKET BAGALI',
        location: 'Bijapur, India',
        title: 'best place to have food in panchgani',
        meta: 'Sept 2022 • Family',
        text: 'Went there for lunch with family. Nice ambience and super quick service. The choice of menu was good though we were Vegan. The range and quality food was great. We enjoyed the Parsi dal a lot. A must visit with family when you are in panchgani.',
        likes: 0,
        photos: [getShowcaseImage(1), getShowcaseImage(2), getShowcaseImage(3)]
      }
    ],
    [showcaseIndex]
  );

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

      <main className="rp-content-container">
        <section className="rp-restaurant-card">
          <div className="rp-summary-transparent-box">
            <div className="rp-summary-row">
              <div className="rp-summary-left">
                <div className="rp-summary-title-row">
                  <h1 className="rp-summary-title">{restaurantInfo.restaurantName || 'Restaurant'}</h1>
                </div>
                <div className="rp-summary-subtext-row">
                  <div className="rp-summary-subtext">panchagani femous food</div>
                  <span className={`rp-summary-food-badge rp-summary-food-badge-mobile-inline ${foodTypeText === 'Non-Veg' ? 'nonveg' : 'veg'}`}>
                    {foodTypeText}
                  </span>
                </div>
                <div className="rp-summary-rating">
                  <span className="rp-summary-rating-num">{Number(restaurantInfo.rating || 0).toFixed(1)}</span>
                  <div className="rp-summary-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className="rp-summary-star"
                        fill={star <= Math.round(Number(restaurantInfo.rating || 0)) ? '#7c3aed' : 'none'}
                        stroke="#7c3aed"
                      />
                    ))}
                  </div>
                  <button type="button" className="rp-summary-reviews-link">(201 reviews)</button>
                  <div className="rp-summary-inline-actions">
                    <button type="button" className="rp-summary-inline-action-btn" onClick={handleShare}>
                      <Share2 size={14} /> Share
                    </button>
                    <button type="button" className="rp-summary-inline-action-btn" onClick={() => setActiveTab('REVIEWS')}>
                      <Pencil size={14} /> Review
                    </button>
                  </div>
                </div>
              </div>
              <div className="rp-summary-actions">
                <button type="button" className="rp-summary-action-btn" onClick={handleShare}>
                  <Share2 size={18} /> Share
                </button>
                <button type="button" className="rp-summary-action-btn" onClick={() => setActiveTab('REVIEWS')}>
                  <Pencil size={18} /> Review
                </button>
                <span className={`rp-summary-food-badge ${foodTypeText === 'Non-Veg' ? 'nonveg' : 'veg'}`}>
                  {foodTypeText}
                </span>
              </div>
            </div>
          </div>

          <div className="rp-top-gallery-shell">
            <div className="rp-top-gallery">
              <div className="rp-top-main-image">
                <img
                  src={getShowcaseImage(0)}
                  alt="Restaurant showcase"
                  onTouchStart={(e) => {
                    touchStartXRef.current = e.touches?.[0]?.clientX ?? null;
                  }}
                  onTouchEnd={(e) => {
                    const startX = touchStartXRef.current;
                    const endX = e.changedTouches?.[0]?.clientX ?? null;
                    if (startX == null || endX == null) return;
                    const delta = endX - startX;
                    if (Math.abs(delta) < 40) return;
                    if (delta < 0) goToNextShowcase();
                    else goToPrevShowcase();
                    touchStartXRef.current = null;
                  }}
                />
                <button
                  type="button"
                  className="rp-showcase-nav rp-showcase-nav-left"
                  onClick={goToPrevShowcase}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  className="rp-showcase-nav rp-showcase-nav-right"
                  onClick={goToNextShowcase}
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="rp-showcase-count">
                  <ActiveBadgeIcon size={16} />
                  <span>{activeShowcaseCard?.label || 'Photos'}</span>
                  <span>{activeShowcaseCard?.count ?? showcaseImages.length}</span>
                </div>
              </div>
              <div className="rp-top-side-grid">
                {showcaseCards.map((item, idx) => (
                  <div key={item.label} className="rp-side-image-card">
                    <img src={getShowcaseImage(idx + 1)} alt={item.label} />
                    <div className="rp-side-image-overlay">
                      <span>{item.label}</span>
                      <span className="rp-side-image-meta">
                        <item.icon size={14} />
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
          {activeTab === 'OVERVIEW' && (
            <div className="rp-overview-wrap">
              <div className="rp-overview-card">
                <h3 className="rp-overview-about-title">About</h3>
                <p className="rp-overview-desc">{restaurantInfo.description || 'No overview available.'}</p>

                <div className="rp-overview-divider" />

                <div className="rp-overview-stats-row">
                  <div className="rp-overview-stat">
                    <div className="rp-overview-status-block">
                      <div className="rp-overview-place-row">
                        <span className="rp-overview-place-inline">
                          <MapPin size={14} />
                          {(restaurantInfo.location || 'mahabaleshwe').split(',')[0]}
                        </span>
                      </div>
                      <div className="rp-overview-open-inline">
                        <span className="rp-overview-open-text">Open Now</span>
                        <span className="rp-overview-time-text">
                          {formatTimeLabel(restaurantInfo.openTime, 'AM') || '9:00 AM'} - {formatTimeLabel(restaurantInfo.closeTime, 'PM') || '10:00 PM'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rp-overview-action-row">
                  <button type="button" className="rp-overview-action-btn" onClick={() => window.open(`tel:${restaurantInfo.callNumber || ''}`)}>
                    <Phone size={16} /> Call
                  </button>
                  <button type="button" className="rp-overview-action-btn" onClick={() => window.open(restaurantInfo.directionLink || 'https://maps.google.com')}>
                    <Navigation size={16} /> Directions
                  </button>
                  <button
                    type="button"
                    className="rp-overview-redeem-btn"
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

              <div className="rp-overview-reviews-list">
                {overviewReviews.map((review) => (
                  <article key={review.id} className="rp-overview-review-card">
                    <div className="rp-overview-review-head">
                      <div className="rp-overview-review-user">
                        <img
                          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                          alt={review.name}
                        />
                        <div>
                          <h4>{review.name}</h4>
                          <p>{review.location}</p>
                        </div>
                      </div>
                      <div className="rp-overview-review-like">
                        <ThumbsUp size={16} />
                        <span>{review.likes}</span>
                      </div>
                    </div>

                    <div className="rp-overview-review-stars">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={14} className="rp-overview-review-star" fill="currentColor" stroke="currentColor" />
                      ))}
                    </div>

                    <h5>{review.title}</h5>
                    <p className="rp-overview-review-meta">{review.meta}</p>
                    <p className="rp-overview-review-text">{review.text}</p>

                    {review.photos.filter(Boolean).length > 0 && (
                      <div className="rp-overview-review-photos">
                        {review.photos
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((src, idx) => (
                            <img key={`${review.id}-ph-${idx}`} src={src} alt={`Review ${idx + 1}`} />
                          ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

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
              <div className="rp-review-summary-card">
                <div className="rp-review-summary-head">
                  <h3>Reviews</h3>
                  <button type="button" className="rp-write-review-btn" onClick={() => setIsReviewFormOpen(true)}>
                    <Pencil size={16} /> Write a review
                  </button>
                </div>

                <div className="rp-review-summary-grid">
                  <div className="rp-review-score-col">
                    <div className="rp-review-score-num">{Number(restaurantInfo.rating || 0).toFixed(1)}</div>
                    <div className="rp-review-score-label">Good</div>
                    <div className="rp-review-score-dots">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={16}
                          className="rp-review-summary-star"
                          fill={n <= 4 ? '#7c3aed' : 'none'}
                          stroke="#7c3aed"
                        />
                      ))}
                      <span className="rp-review-total-count">(201)</span>
                    </div>
                  </div>

                  <div className="rp-review-bars-col">
                    {[
                      { label: 'Excellent', value: 76 },
                      { label: 'Good', value: 72 },
                      { label: 'Average', value: 32 },
                      { label: 'Poor', value: 10 },
                      { label: 'Terrible', value: 11 }
                    ].map((item) => (
                      <div key={item.label} className="rp-review-bar-row">
                        <span>{item.label}</span>
                        <div className="rp-review-track">
                          <div className="rp-review-fill" style={{ width: `${Math.max(8, Math.min(100, (item.value / 80) * 100))}%` }} />
                        </div>
                        <b>{item.value}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {isReviewFormOpen && <div className="rp-review-form-card">
                <div className="rp-review-group">
                  <h3>How would you rate your experience?</h3>
                  <div className="rp-star-rating">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        className={`rp-star-rate-btn ${userRating >= val ? 'active' : ''}`}
                        onClick={() => setUserRating(val)}
                        aria-label={`Rate ${val}`}
                      >
                        <Star size={28} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rp-review-group">
                  <h3>When did you go?</h3>
                  <select className="rp-visit-select" value={visitMonth} onChange={(e) => setVisitMonth(e.target.value)}>
                    <option>March 2026</option>
                    <option>February 2026</option>
                    <option>January 2026</option>
                    <option>December 2025</option>
                  </select>
                </div>

                <div className="rp-review-group">
                  <h3>Who did you go with?</h3>
                  <div className="rp-companion-pills">
                    {companionOptions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`rp-companion-pill ${visitWith === item ? 'active' : ''}`}
                        onClick={() => setVisitWith(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rp-review-group">
                  <div className="rp-write-review-head">
                    <h3>Write your review</h3>
                    <button type="button" className="rp-review-tips-btn">Review tips</button>
                  </div>
                  <div className="rp-review-tags">
                    {['Experience', 'Admission fee', 'Length of visit', 'Atmosphere', 'Crowd size', 'Staff', 'Best for'].map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <textarea
                    className="rp-review-textarea"
                    placeholder="Share your experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value.slice(0, 25))}
                  />
                  <p className="rp-char-count">{reviewText.length}/25 min characters</p>
                </div>

                <div className="rp-review-group">
                  <h3>Title your review</h3>
                  <input
                    className="rp-review-title-input"
                    type="text"
                    placeholder="Give us the gist of your experience"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value.slice(0, 120))}
                  />
                  <p className="rp-char-count">{reviewTitle.length}/120 max characters</p>
                </div>

                <div className="rp-review-group">
                  <h3>Add some photos</h3>
                  <p className="rp-optional-label">Optional</p>
                  <button type="button" className="rp-review-upload-box">
                    <Camera size={16} />
                    <strong>Click to add photos</strong>
                    <span>or drag and drop</span>
                  </button>
                </div>

                <label className="rp-review-consent">
                  <input type="checkbox" checked={reviewAgree} onChange={(e) => setReviewAgree(e.target.checked)} />
                  <span>
                    I certify that this review is based on my own experience and is my genuine opinion of this restaurant, and that I have no personal or business relationship with this establishment, and have not been offered any incentive or payment originating from the establishment to write this review. I understand that Tripadvisor has a zero-tolerance policy on fake reviews.
                  </span>
                </label>

                <button type="button" className="rp-review-continue-btn">Post Review</button>
              </div>}
            </div>
          )}

          {activeTab === 'PHOTOS' && (
            <div className="rp-photos-wrap">
              <div className="rp-photo-actions">
                <button type="button" className="rp-upload-card" disabled={isUploadingMedia} onClick={() => photoInputRef.current?.click()}>
                  <div className="rp-up-icon-box"><Camera size={24} /></div>
                  <span>{isUploadingMedia ? 'Uploading...' : 'Add Photo'}</span>
                </button>
                <button type="button" className="rp-upload-card" disabled={isUploadingMedia} onClick={() => videoInputRef.current?.click()}>
                  <div className="rp-up-icon-box"><Video size={24} /></div>
                  <span>{isUploadingMedia ? 'Uploading...' : 'Add Video'}</span>
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


