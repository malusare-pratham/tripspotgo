import React from 'react';
import SeoPageLayout from '../SeoPageLayout';

const BestCafesMahabaleshwar = () => {
  const pageConfig = {
  "slug": "blog-best-cafes-mahabaleshwar",
  "metaTitle": "Top Cafes Mahabaleshwar | Blog",
  "metaKeywords": "mahabaleshwar cafes blog",
  "metaDescription": "Read about the coziest corners in the mountains.",
  "heroTitle": "Cozy Corners of Mahabaleshwar",
  "heroSubtitle": "Where to get the best hot chocolate and local pastries.",
  "heroImage": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1920&q=80",
  "features": [],
  "sections": []
};

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default BestCafesMahabaleshwar;