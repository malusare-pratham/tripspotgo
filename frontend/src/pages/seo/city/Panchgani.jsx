import React from 'react';
import SeoPageLayout from '../SeoPageLayout';

const Panchgani = () => {
  const pageConfig = {
  "slug": "panchgani-city",
  "metaTitle": "Panchgani | Tripspotgo Local Deals",
  "metaKeywords": "panchgani, tourism, hill station, deals",
  "metaDescription": "Explore the best deals in Panchgani exclusively on Tripspotgo.",
  "heroTitle": "Discover Panchgani's Best",
  "heroSubtitle": "Unlock premium local discounts at the most stunning valley in Maharashtra.",
  "heroImage": "https://images.unsplash.com/photo-1620614294025-fb3557e931ed?auto=format&fit=crop&w=1920&q=80",
  "features": [
    {
      "title": "Valley Views",
      "description": "Experience serene sunsets with exclusive cafe discounts."
    },
    {
      "title": "Local Strawberry Farms",
      "description": "Get massive cashback when you buy fresh strawberries."
    },
    {
      "title": "Premium Hotels",
      "description": "Stay at top-rated resorts for half the usual price."
    }
  ],
  "sections": [
    {
      "heading": "The Jewel of Sahyadri",
      "content": "Panchgani is renowned for its vast plateaus, pleasant weather, and lush green strawberry farms. Tripspotgo partners with the most iconic local establishments to ensure you don't overpay for your experiences.",
      "image": "https://images.unsplash.com/photo-1547703816-7eed5eac5d3a?auto=format&fit=crop&w=800&q=80",
      "bulletPoints": [
        "Table Land access",
        "Mapro Garden discounts",
        "Sunset Point photography"
      ]
    }
  ]
};

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default Panchgani;