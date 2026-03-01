import React from 'react';
import './addvertisment.css';

const Advertisement = () => {
  return (
    <div className="ad-container">
      {/* १. पाचगणी व्हिज्युअल - टेबल लँड */}
      

      {/* २. महाबळेश्वर स्पेशल - स्ट्रॉबेरी (Gold Unit) */}
      <article className="ad-unit ad-unit-gold">
        <div className="ad-gold-logo">🍓</div>
        <div className="ad-gold-content">
          <h3>Mahabaleshwar Strawberry</h3>
          <p>Fresh Picking & Farm Tours</p>
          <button type="button">Book Tour</button>
        </div>
        <div className="ad-gold-badge">
          <span>Mapro Special</span>
          <strong>Fresh 2024</strong>
        </div>
      </article>

      {/* ३. पॅराग्लायडिंग ॲडवेंचर (Airtel Unit Structure) */}
      <article className="ad-unit ad-unit-airtel">
        <div className="ad-airtel-logo-wrap">
          <span style={{fontSize: '50px'}}>🪂</span>
        </div>
        <div className="ad-airtel-content">
          <h3 style={{color: '#0284c7'}}>Panchgani Paragliding</h3>
          <p>Fly high over the Sahyadri valleys</p>
          <button type="button" style={{background: '#0284c7'}}>Book Flight</button>
        </div>
      </article>

      {/* ४. हॉटेल स्टे (Airtel Unit Structure) */}
      <article className="ad-unit ad-unit-airtel">
        <div className="ad-airtel-logo-wrap">
          <span style={{fontSize: '50px'}}>🏨</span>
        </div>
        <div className="ad-airtel-content">
          <h3 style={{color: '#059669'}}>Luxury Valley View</h3>
          <p>Best Resorts in Mahabaleshwar</p>
          <button type="button" style={{background: '#059669'}}>View Deals</button>
        </div>
      </article>

      {/* ५. प्रतापगड दर्शन (Airtel Unit Structure) */}
      <article className="ad-unit ad-unit-airtel">
        <div className="ad-airtel-logo-wrap">
          <span style={{fontSize: '50px'}}>🚩</span>
        </div>
        <div className="ad-airtel-content">
          <h3 style={{color: '#e63946'}}>Pratapgad Fort Tour</h3>
          <p>Explore the history of Maratha Empire</p>
          <button type="button">Explore Now</button>
        </div>
      </article>
    </div>
  );
};

export default Advertisement;