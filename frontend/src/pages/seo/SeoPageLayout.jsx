import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './SeoPageLayout.css';
import { Sparkles, MapPin, Tag, CheckCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const SeoPageLayout = ({ slug, defaultData }) => {
  const [pageData, setPageData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        // Attempt to fetch override data from the backend CMS
        const response = await axios.get(`${API_BASE_URL}/api/seo-pages/${slug}`);
        if (response.data && response.data.page) {
          setPageData({ ...defaultData, ...response.data.page });
        }
      } catch (error) {
        // Fallback to defaultData effortlessly
        console.log("Using default SEO template data for", slug);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [slug, defaultData]);

  useEffect(() => {
    if (!pageData) return;
    
    document.title = pageData.metaTitle || defaultData.metaTitle;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = pageData.metaDescription || defaultData.metaDescription;

    let metaKw = document.querySelector('meta[name="keywords"]');
    if (!metaKw) {
      metaKw = document.createElement('meta');
      metaKw.name = "keywords";
      document.head.appendChild(metaKw);
    }
    metaKw.content = pageData.metaKeywords || defaultData.metaKeywords;
  }, [pageData, defaultData]);

  if (!pageData) return null;

  return (
    <div className="seo-cms-root">
      <Navbar />
      
      {/* Dynamic SEO Hero */}
      <section className="seo-cms-hero" style={{ backgroundImage: `url(${pageData.heroImage})` }}>
        <div className="seo-cms-hero-overlay"></div>
        <div className="seo-cms-hero-content">
          <span className="seo-cms-badge"><Sparkles size={16} /> Premium Guide</span>
          <h1>{pageData.heroTitle}</h1>
          <p>{pageData.heroSubtitle}</p>
          <button className="seo-cms-cta" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>
            Explore Now
          </button>
        </div>
      </section>

      <main className="seo-cms-main">
        {/* Statistics or Key Features */}
        {pageData.features && pageData.features.length > 0 && (
          <div className="seo-cms-features">
            {pageData.features.map((feat, idx) => (
              <div key={idx} className="seo-feature-card">
                <div className="seo-feature-icon">
                  {idx % 3 === 0 ? <MapPin /> : idx % 3 === 1 ? <Tag /> : <CheckCircle />}
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Content Sections injected by Admin / Default */}
        <div className="seo-cms-articles">
          {pageData.sections && pageData.sections.length > 0 ? (
             pageData.sections.map((section, idx) => (
               <article key={idx} className={`seo-article-row ${idx % 2 !== 0 ? 'seo-article-reverse' : ''}`}>
                 <div className="seo-article-text">
                   <h2>{section.heading}</h2>
                   <p>{section.content}</p>
                   {section.bulletPoints && (
                     <ul className="seo-article-bullets">
                       {section.bulletPoints.map((bp, i) => (
                         <li key={i}><CheckCircle size={16} /> {bp}</li>
                       ))}
                     </ul>
                   )}
                 </div>
                 <div className="seo-article-image">
                   <img src={section.image} alt={section.heading} />
                 </div>
               </article>
             ))
          ) : (
            <div className="seo-no-content">
              <h3>More content coming soon!</h3>
              <p>Our team is curating the best local deals and insights for this page.</p>
            </div>
          )}
        </div>
      </main>

      {/* Call to action ending */}
      <section className="seo-cms-bottom-cta">
        <h2>Ready to unlock maximum savings?</h2>
        <p>Join Tripspotgo today and get instant discounts at all our partner locations.</p>
        <a href="/signup" className="seo-bottom-btn">Get Your Membership</a>
      </section>

      <Footer />
    </div>
  );
};

export default SeoPageLayout;
