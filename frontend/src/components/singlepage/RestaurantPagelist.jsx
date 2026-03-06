import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import './RestaurantPagelist.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const DEFAULT_RESTAURANT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

const normalizeImageUrl = (rawUrl) => {
  if (!rawUrl) return DEFAULT_RESTAURANT_IMAGE;
  const value = String(rawUrl).trim();
  if (!value) return DEFAULT_RESTAURANT_IMAGE;

  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) {
    return `${typeof window !== 'undefined' ? window.location.protocol : 'https:'}${value}`;
  }

  if (!API_BASE_URL) return value;
  const base = API_BASE_URL.replace(/\/+$/, '');
  const path = value.replace(/^\/+/, '');
  return `${base}/${path}`;
};

const RestaurantPagelist = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [partnerInfoById, setPartnerInfoById] = useState({});
  const [activeFilters, setActiveFilters] = useState({
    rating45: false,
    petFriendly: false,
    outdoorSeating: false,
    vegOnly: false,
    nonVegOnly: false
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/partners`);
        setPartners(Array.isArray(response?.data) ? response.data : []);
      } catch (_error) {
        setPartners([]);
      }
    };

    fetchPartners();
    const refreshTimer = setInterval(fetchPartners, 10000);
    return () => clearInterval(refreshTimer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPartnerInfo = async () => {
      const partnerIds = partners
        .map((partner) => String(partner?._id || '').trim())
        .filter(Boolean);

      if (!partnerIds.length) {
        if (isMounted) setPartnerInfoById({});
        return;
      }

      const responses = await Promise.all(
        partnerIds.map(async (partnerId) => {
          try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/partner-info/${partnerId}`);
            return [partnerId, res?.data?.data || null];
          } catch (_error) {
            return [partnerId, null];
          }
        })
      );

      if (!isMounted) return;
      setPartnerInfoById(Object.fromEntries(responses));
    };

    fetchPartnerInfo();
    return () => {
      isMounted = false;
    };
  }, [partners]);

  const restaurants = useMemo(
    () =>
      partners
        .filter((partner) => String(partner?.status || '').trim() !== 'Blocked')
        .map((partner, index) => {
          const partnerId = String(partner?._id || '').trim();
          const info = partnerInfoById[partnerId];
          const descriptionFromInfo = String(info?.description || '').trim();
          const descriptionFromPartner = String(partner?.description || '').trim();
          const addressFromPartner = String(partner?.address || '').trim();
          const categoryFromPartner = String(partner?.businessCategory || '').trim();

          return {
            id: partner?._id || index,
            name: partner?.restaurantName || 'Partner Restaurant',
            rating: Number(partner?.rating || 4.5).toFixed(1),
            foodType: String(partner?.foodType || 'Veg').trim().toLowerCase(),
            description:
              descriptionFromInfo ||
              descriptionFromPartner ||
              addressFromPartner ||
              categoryFromPartner ||
              'Great food and service',
            location: partner?.area || 'Panchgani',
            distance: partner?.distance || '1.2 km',
            img: normalizeImageUrl(partner?.imageUrl),
            hasOffer: true,
            petFriendly:
              Boolean(partner?.petFriendly) ||
              String(partner?.address || '').toLowerCase().includes('pet'),
            outdoorSeating:
              Boolean(partner?.outdoorSeating) ||
              String(partner?.address || '').toLowerCase().includes('outdoor')
          };
        }),
    [partners, partnerInfoById]
  );

  const filteredRestaurants = useMemo(() => {
    const hasPetData = restaurants.some((item) => item.petFriendly);
    const hasOutdoorData = restaurants.some((item) => item.outdoorSeating);
    const query = String(searchTerm || '').trim().toLowerCase();

    return restaurants.filter((item) => {
      if (activeFilters.rating45 && Number(item.rating) < 4.5) return false;
      if (activeFilters.petFriendly && hasPetData && !item.petFriendly) return false;
      if (activeFilters.outdoorSeating && hasOutdoorData && !item.outdoorSeating) return false;
      if (activeFilters.vegOnly && !(item.foodType.includes('veg') && !item.foodType.includes('non')) && !item.foodType.includes('both')) return false;
      if (activeFilters.nonVegOnly && !item.foodType.includes('non') && !item.foodType.includes('both')) return false;
      if (query) {
        const haystack = `${item.name} ${item.description} ${item.location}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [restaurants, activeFilters, searchTerm]);


  const activeFilterCount = useMemo(
    () => Object.values(activeFilters).filter(Boolean).length,
    [activeFilters]
  );

  const toggleFilter = (key) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetFilters = () => {
    setActiveFilters({
      rating45: false,
      petFriendly: false,
      outdoorSeating: false,
      vegOnly: false,
      nonVegOnly: false
    });
  };

  return (
    <div className="zomato-container">
      <div className="rl-top-nav">
        <button
          type="button"
          className="rl-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="rl-brand">magicpoint</h1>
        <div className="rl-search-wrap">
          <Search size={16} className="rl-search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search restaurants..."
            aria-label="Search restaurants"
          />
          <button type="button" className="rl-search-btn">
            Get Deal
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <button
          type="button"
          className={`f-btn ${activeFilterCount > 0 ? 'active' : ''}`}
          onClick={resetFilters}
        >
          <i className="fas fa-sliders-h"></i> Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
        <button type="button" className={`f-btn ${activeFilters.rating45 ? 'active' : ''}`} onClick={() => toggleFilter('rating45')}>
          Rating: 4.5+
        </button>
        <button type="button" className={`f-btn ${activeFilters.vegOnly ? 'active' : ''}`} onClick={() => toggleFilter('vegOnly')}>
          Veg
        </button>
        <button type="button" className={`f-btn ${activeFilters.nonVegOnly ? 'active' : ''}`} onClick={() => toggleFilter('nonVegOnly')}>
          Non-Veg
        </button>
        <button type="button" className={`f-btn ${activeFilters.petFriendly ? 'active' : ''}`} onClick={() => toggleFilter('petFriendly')}>
          Pet friendly
        </button>
        <button type="button" className={`f-btn ${activeFilters.outdoorSeating ? 'active' : ''}`} onClick={() => toggleFilter('outdoorSeating')}>
          Outdoor seating
        </button>
      </div>

      <div className="main-banner">
        <div className="banner-overlay">
          <div className="banner-txt">
            <p>Get up to</p>
            <h1 className="discount-val">10% OFF</h1>
            <p>on your dining bills with magicpoint</p>
            <button className="cta-btn">Check out all the restaurants</button>
          </div>
        </div>
      </div>

      <h2 className="city-title">Restaurants Near You</h2>
      <p className="city-subtitle">Discover great food spots around your location.</p>

      <div className="res-grid">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((item) => (
            <div
              key={item.id}
              className="restaurant-card"
              onClick={() => navigate('/restaurant', { state: { partnerId: item.id } })}
              style={{ cursor: 'pointer' }}
            >
              <div className="img-wrapper">
                <div className="rl-offer-badge">
                  <strong>10%</strong>
                  <span>OFF</span>
                </div>
                <img
                  src={item.img}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_RESTAURANT_IMAGE;
                  }}
                />
              </div>
              <div className="info-section">
                <div className="title-row">
                  <h4 className="res-name">{item.name}</h4>
                  <div className="food-type-icons" aria-label={`Food type: ${item.foodType}`}>
                    <span className="rl-rating-mini">
                      <i className="fas fa-star rl-rating-star" aria-hidden="true"></i>
                      {item.rating}
                    </span>
                    {item.foodType.includes('both') ? (
                      <>
                        <span className="food-type-logo veg" />
                        <span className="food-type-logo nonveg" />
                      </>
                    ) : (
                      <span className={`food-type-logo ${item.foodType.includes('non') ? 'nonveg' : 'veg'}`} />
                    )}
                  </div>
                </div>
                <div className="desc-row">
                  <span className="cuisine-txt">{item.description}</span>
                </div>
                <div className="loc-row">
                  <span className="loc-txt">{item.location}</span>
                  <span className="dist-txt">{item.distance}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No restaurants available for selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantPagelist;
