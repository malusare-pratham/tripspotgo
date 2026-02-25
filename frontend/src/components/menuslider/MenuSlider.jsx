import React, { useRef } from "react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import "./MenuSlider.css";

const MenuSlider = () => {
  const scrollRef = useRef(null);

  const assetImages = import.meta.glob(
    "../../assets/menuslidebarimg/*.{png,jpg,jpeg,webp,avif,gif,svg}",
    { eager: true }
  );

  const menuItems = Object.entries(assetImages)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => ({
      img: typeof mod === "string" ? mod : mod?.default || "",
    }))
    .filter((item) => item.img);

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
                <img src={item.img} alt="cuisine" />
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
