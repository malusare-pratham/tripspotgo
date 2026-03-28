import React from 'react';
import { useParams } from 'react-router-dom';
import SeoPageLayout from '../SeoPageLayout';
import { restaurantSeoConfigs } from './restaurantConfigs';

const RestaurantSeoPage = () => {
  const { slug } = useParams();
  const pageConfig = slug ? restaurantSeoConfigs.details : restaurantSeoConfigs.list;

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default RestaurantSeoPage;
