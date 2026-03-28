import React from 'react';
import SeoPageLayout from '../SeoPageLayout';

const BestRestaurantsPanchgani = () => {
  const pageConfig = {
  "slug": "blog-best-restaurants-panchgani",
  "metaTitle": "Top 10 Restaurants in Panchgani | Blog",
  "metaKeywords": "panchgani blog, top 10 food, mapro garden",
  "metaDescription": "Read our blog post on the best restaurants in Panchgani.",
  "heroTitle": "10 Best Restaurants in Panchgani",
  "heroSubtitle": "Where to eat, what to order, and how to save.",
  "heroImage": "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1920&q=80",
  "features": [],
  "sections": [
    {
      "heading": "1. The Valley View Diner",
      "content": "Famous for its continental spreads and glass walls facing the Sahyadris.",
      "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
    },
    {
      "heading": "2. Historic Mapro Cafe",
      "content": "You cannot miss their iconic strawberry cream and massive wood-fired pizzas.",
      "image": "https://images.unsplash.com/photo-1465014925804-7b9ede58d0d7?auto=format&fit=crop&w=800&q=80"
    }
  ]
};

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default BestRestaurantsPanchgani;