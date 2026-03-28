import React from 'react';
import SeoPageLayout from '../SeoPageLayout';

const RestaurantDetails = () => {
  const pageConfig = {
  "slug": "restaurant-details",
  "metaTitle": "Restaurant Profile | Tripspotgo",
  "metaKeywords": "restaurant profile, book a table",
  "metaDescription": "Detailed view and reviews for our partner restaurants.",
  "heroTitle": "Partner Profile",
  "heroSubtitle": "View menus, reviews, and dynamic live discounts.",
  "heroImage": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80",
  "features": [],
  "sections": [
    {
      "heading": "Why dine here?",
      "content": "Our partnered restaurants maintain the highest hospitality standards. Expect exceptional table-service, stunning architecture, and amazing dishes.",
      "image": "https://images.unsplash.com/photo-1466978913421-bac2e5e4d6a4?auto=format&fit=crop&w=800&q=80"
    }
  ]
};

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default RestaurantDetails;