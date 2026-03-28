import React from 'react';
import SeoPageLayout from '../SeoPageLayout';

const BestCafesPanchgani = () => {
  const pageConfig = {
  "slug": "blog-best-cafes-panchgani",
  "metaTitle": "Aesthetic Cafes in Panchgani | Blog",
  "metaKeywords": "aesthetic cafes panchgani, vlog, coffee",
  "metaDescription": "The most Instagram-worthy cafes to visit.",
  "heroTitle": "Aesthetic Cafes in Panchgani",
  "heroSubtitle": "Perfect spots for Instagram, relaxation, and coffee.",
  "heroImage": "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1920&q=80",
  "features": [],
  "sections": []
};

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default BestCafesPanchgani;