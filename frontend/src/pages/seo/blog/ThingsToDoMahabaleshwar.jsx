import React from 'react';
import SeoPageLayout from '../SeoPageLayout';

const ThingsToDoMahabaleshwar = () => {
  const pageConfig = {
  "slug": "blog-things-to-do-mahabaleshwar",
  "metaTitle": "Things To Do In Mahabaleshwar | Blog",
  "metaKeywords": "venna lake, elephant point, activities",
  "metaDescription": "The ultimate sightseeing guide for Mahabaleshwar.",
  "heroTitle": "Spectacular Sights of Mahabaleshwar",
  "heroSubtitle": "Discover the lakes, trails, and historic viewpoints.",
  "heroImage": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80",
  "features": [],
  "sections": []
};

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default ThingsToDoMahabaleshwar;