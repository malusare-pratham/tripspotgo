import React, { useRef } from "react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import "./MenuSlider.css";

const MenuSlider = () => {
  const scrollRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const resolvedBaseUrl = (API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000" : "")).replace(/\/+$/, "");

  const imageNames = [
    "Aloo Tikki.webp",
    "Biryani.webp",
    "Burger.webp",
    "Butter Chicken.webp",
    "Cake.webp",
    "Cgili Potato.webp",
    "Chaap.webp",
    "Chaat.webp",
    "Chiken roll.webp",
    "Chinese.webp",
    "Chole Bharure.webp",
    "Cofee.webp",
    "Dal.webp",
    "Dhokla.webp",
    "Dosa.webp",
    "Egg Roll.webp",
    "Fish.webp",
    "Fried Rise.webp",
    "Fries.webp",
    "Healthy Dishes.webp",
    "Icecream.webp",
    "Idli.webp",
    "Juice.webp",
    "Kadai Paneer.webp",
    "Khichadi.webp",
    "Kulche.webp",
    "Lassi.webp",
    "Momos.webp",
    "Naan.webp",
    "Nachos.webp",
    "Noodles.webp",
    "North Indian.webp",
    "Pakora.webp",
    "Paneer.webp",
    "Parantha.webp",
    "Pasta.webp",
    "Pav Bhaji.webp",
    "Pizza.webp",
    "Poha.webp",
    "Rajma Rice.webp",
    "Rice Bowl.webp",
    "Rolls.webp",
    "Roti.webp",
    "Samosa.webp",
    "Sandwich.webp",
    "Shawarma.webp",
    "Soup.webp",
    "South ndian.webp",
    "Sweets.webp",
    "Tea.webp",
    "Thali.webp",
    "Upm.webp",
    "Vada Pav.webp",
    "Waffles.webp",
  ];

  const buildImageUrl = (folderName, fileName) =>
    `${resolvedBaseUrl}/uploads/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`;

  const menuItems = imageNames.map((name) => ({
    primaryImg: buildImageUrl("menusliderbar img", name),
    fallbackImg: buildImageUrl("menuslidebar img", name),
  }));

  const scroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = 480;
    current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="menu-slider-wrapper">
      <div className="menu-header-container">
        {/* टायटलला नवीन क्लास लावला आहे */}
        <h2 className="mp-gradient-title">Browse by favorite</h2>
      </div>

      <div className="slider-relative-box">
        <button className="nav-arrow left-arrow" onClick={() => scroll("left")}>
          <ArrowLeftCircle size={38} strokeWidth={1.2} />
        </button>

        <div className="menu-scroll-container" ref={scrollRef}>
          {menuItems.map((item, index) => (
            <div key={index} className="menu-card">
              <div className="menu-image-wrapper">
                <img
                  src={item.primaryImg}
                  alt="cuisine"
                  onError={(e) => {
                    if (e.currentTarget.src !== item.fallbackImg) {
                      e.currentTarget.src = item.fallbackImg;
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button className="nav-arrow right-arrow" onClick={() => scroll("right")}>
          <ArrowRightCircle size={38} strokeWidth={1.2} />
        </button>
      </div>
    </div>
  );
};

export default MenuSlider;

