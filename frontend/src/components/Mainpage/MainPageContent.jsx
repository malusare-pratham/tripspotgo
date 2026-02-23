import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, ChevronRight } from "lucide-react";
import "./MainPageContent.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const offers = [
  {
    id: 1,
    name: "Pizza Hut",
    rating: "4.2",
    distance: "3.2 km",
    status: "Open Now",
    discount: "5% OFF",
    image: "https://images.unsplash.com/photo-1601924582975-7e16c1b3b3a0?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Delhi Darbar Dhaba",
    rating: "3.6",
    distance: "4.5 km",
    status: "Open Now",
    discount: "10% OFF",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Baskin Robbins",
    rating: "4.0",
    distance: "2.8 km",
    status: "Open Now",
    discount: "15% OFF",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Sai Ki Rasoi",
    rating: "4.9",
    distance: "1.2 km",
    status: "Open Now",
    discount: "20% OFF",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80",
  },
];

const placeholderImages = [
  "https://images.unsplash.com/photo-1601924582975-7e16c1b3b3a0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80",
];

const normalizeCategory = (category) => {
  const value = String(category || "").trim();
  if (
    value === "Food & Dining" ||
    value === "Activities & Adventure" ||
    value === "Local Stores & Gift House" ||
    value === "Stay & Hotels"
  ) {
    return value;
  }
  return "Food & Dining";
};

const resolvePartnerImage = (resImage, index) => {
  if (!resImage) return placeholderImages[index % placeholderImages.length];
  if (/^https?:\/\//i.test(resImage)) return resImage;
  let normalized = String(resImage).replace(/\\/g, "/").trim();
  normalized = normalized.replace(/^\.?\//, "");
  normalized = normalized.replace(/^backend\//i, "");
  if (!normalized.startsWith("uploads/")) {
    normalized = `uploads/${normalized.split("/").pop()}`;
  }
  return `${API_BASE_URL}/${normalized}`;
};

const OfferCard = ({ item, onClick }) => (
  <div className="mp-offer-card" onClick={onClick}>
    <div className="mp-image-box">
      <img src={item.image} alt={item.name} loading="eager" />
      <div className="mp-save-badge">{item.discount}</div>
    </div>

    <div className="mp-card-content">
      <div className="mp-card-header">
        <h3>{item.name}</h3>
        <span className={`mp-rating ${parseFloat(item.rating) >= 4 ? "high" : "mid"}`}>
          {item.rating} <Star size={12} fill="white" style={{ marginLeft: "2px" }} />
        </span>
      </div>

      <div className="mp-info-row">
        <span className="mp-distance">
          <MapPin size={14} style={{ marginRight: "4px" }} /> {item.distance}
        </span>
        <span className="mp-open-status">
          <Clock size={14} style={{ marginRight: "4px" }} /> {item.status}
        </span>
      </div>
    </div>
  </div>
);

const Section = ({ title, items, onCardClick }) => (
  <section className="mp-section">
    <div className="mp-section-header">
      <h2>{title}</h2>
      <button className="mp-view-all">
        See All <ChevronRight size={16} />
      </button>
    </div>
    <div className="mp-offers-container">
      {items.map((item, index) => (
        <OfferCard key={item.id || index} item={item} onClick={onCardClick} />
      ))}
    </div>
  </section>
);

const MainPageContent = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/partners`);
        setPartners(Array.isArray(response.data) ? response.data : []);
      } catch (_error) {
        setPartners([]);
      }
    };

    fetchPartners();
  }, []);

  const sectionItems = useMemo(() => {
    const addedPartners = partners.filter(
      (partner) =>
        Boolean(partner?.restaurantName) &&
        partner?.status === "Active" &&
        (partner?.businessStatus || "OPEN") === "OPEN"
    );
    const mapped = addedPartners.map((partner, index) => ({
      id: partner._id || index,
      name: partner.restaurantName || "Partner Restaurant",
      rating: "4.2",
      distance: partner.area || "Nearby",
      status: partner.businessStatus === "CLOSED" ? "Closed" : "Open Now",
      discount: "10% OFF",
      image: partner.imageUrl || resolvePartnerImage(partner.resImage, index),
      businessCategory: normalizeCategory(partner.businessCategory),
    }));

    return {
      food: mapped.filter((item) => item.businessCategory === "Food & Dining"),
      activity: mapped.filter((item) => item.businessCategory === "Activities & Adventure"),
      store: mapped.filter((item) => item.businessCategory === "Local Stores & Gift House"),
      stay: mapped.filter((item) => item.businessCategory === "Stay & Hotels"),
    };
  }, [partners]);

  return (
    <div className="mp-scope">
      <div className="mp-main-container">
        <header className="mp-page-header">
          <h1 className="mp-gradient-title">Explore nearby offers</h1>
          <p className="mp-sub-title">Lowest prices for all your favourite Magicpoints</p>
        </header>

        <Section title="Food & Dining" items={sectionItems.food} onCardClick={() => navigate("/restaurant")} />
        <Section title="Activities & Adventure" items={sectionItems.activity} />
        <Section title="Local Stores & Gift House" items={sectionItems.store} />
        <Section title="Stay & Hotels" items={sectionItems.stay} />
      </div>
    </div>
  );
};

export default MainPageContent;

