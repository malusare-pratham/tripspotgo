import React from 'react';
import { useParams } from 'react-router-dom';
import SeoPageLayout from '../SeoPageLayout';
import { hotelSeoConfigs } from './hotelConfigs';

const HotelSeoPage = () => {
  const { slug } = useParams();
  const pageConfig = slug ? hotelSeoConfigs.details : hotelSeoConfigs.list;

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default HotelSeoPage;
