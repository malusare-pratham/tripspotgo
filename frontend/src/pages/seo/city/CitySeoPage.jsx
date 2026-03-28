import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import SeoPageLayout from '../SeoPageLayout';
import '../SeoPageLayout.css';
import { citySeoConfigs } from './cityConfigs';

const CitySeoPage = () => {
  const { citySlug } = useParams();
  const pageConfig = citySeoConfigs[citySlug];

  if (!pageConfig) {
    return (
      <div className="seo-cms-root">
        <Navbar />
        <main className="seo-cms-main">
          <div className="seo-no-content">
            <h3>Page not found</h3>
            <p>This city page is not available right now.</p>
            <Link to="/" className="seo-bottom-btn">Back to Home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default CitySeoPage;
