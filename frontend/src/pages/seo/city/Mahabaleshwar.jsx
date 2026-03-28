import React from 'react';
import SeoPageLayout from '../SeoPageLayout';

const Mahabaleshwar = () => {
  const pageConfig = {
  "slug": "mahabaleshwar-city",
  "metaTitle": "Mahabaleshwar | Tripspotgo Local Deals",
  "metaKeywords": "mahabaleshwar, venna lake, hotels, deals",
  "metaDescription": "Explore the best deals in Mahabaleshwar exclusively on Tripspotgo.",
  "heroTitle": "Experience Mahabaleshwar",
  "heroSubtitle": "Your gateway to thick forests, ancient temples, and unbeatable local savings.",
  "heroImage": "https://images.unsplash.com/photo-1601617466858-a53ec40c2ee5?auto=format&fit=crop&w=1920&q=80",
  "features": [
    {
      "title": "Venna Lake",
      "description": "Discounted boating and watersports for premium members."
    },
    {
      "title": "Heritage Temples",
      "description": "Cultural tours at a fraction of the cost."
    },
    {
      "title": "Luxury Stays",
      "description": "Deep discounts on jungle-view resorts."
    }
  ],
  "sections": [
    {
      "heading": "Nature's Perfect Paradise",
      "content": "Known for its captivating beauty and historical significance, Mahabaleshwar is the ultimate getaway. With Tripspotgo, you're guaranteed to find verified local businesses offering incredible value.",
      "image": "https://images.unsplash.com/photo-1604928131336-d7e793ba9198?auto=format&fit=crop&w=800&q=80",
      "bulletPoints": [
        "Exclusive boating deals",
        "Forest edge cafe vouchers",
        "Premium homestay savings"
      ]
    }
  ]
};

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default Mahabaleshwar;