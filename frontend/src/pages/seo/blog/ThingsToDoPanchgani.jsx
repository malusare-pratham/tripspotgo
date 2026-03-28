import React from 'react';
import SeoPageLayout from '../SeoPageLayout';

const ThingsToDoPanchgani = () => {
  const pageConfig = {
  "slug": "blog-things-to-do-panchgani",
  "metaTitle": "Things To Do In Panchgani | Blog",
  "metaKeywords": "paragliding, table land, panchgani activities",
  "metaDescription": "Action packed adventures and sightseeing guide for Panchgani.",
  "heroTitle": "Top Activities in Panchgani",
  "heroSubtitle": "From high-altitude paragliding to serene boating.",
  "heroImage": "https://images.unsplash.com/photo-1533587851505-d119e1319b7f?auto=format&fit=crop&w=1920&q=80",
  "features": [],
  "sections": [
    {
      "heading": "Table Land Excursions",
      "content": "Explore Asia's second-longest mountain plateau. Rent a horse or take a peaceful walk across the vast volcanic rock formations.",
      "image": "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80"
    }
  ]
};

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default ThingsToDoPanchgani;