import React from 'react';
import SeoPageLayout from '../SeoPageLayout';

const RestaurantList = () => {
  const pageConfig = {
  "slug": "restaurant-list",
  "metaTitle": "Restaurant Directory | Tripspotgo",
  "metaKeywords": "all restaurants, dining directory",
  "metaDescription": "Browse all premium and budget-friendly restaurants available on Tripspotgo.",
  "heroTitle": "Explore All Restaurants",
  "heroSubtitle": "Your complete directory for dining across our partner ecosystem.",
  "heroImage": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80",
  "features": [],
  "sections": []
};

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default RestaurantList;