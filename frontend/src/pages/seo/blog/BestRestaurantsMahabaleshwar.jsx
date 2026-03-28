import React from 'react';
import SeoPageLayout from '../SeoPageLayout';

const BestRestaurantsMahabaleshwar = () => {
  const pageConfig = {
  "slug": "blog-best-restaurants-mahabaleshwar",
  "metaTitle": "Top Restaurants in Mahabaleshwar | Blog",
  "metaKeywords": "mahabaleshwar blog, top food, travel",
  "metaDescription": "Read our curated list of Mahabaleshwar dining spots.",
  "heroTitle": "Ultimate Mahabaleshwar Dining Guide",
  "heroSubtitle": "Discover the culinary secrets of the dense forests.",
  "heroImage": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
  "features": [],
  "sections": []
};

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default BestRestaurantsMahabaleshwar;