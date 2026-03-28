import React from 'react';
import { useParams } from 'react-router-dom';
import SeoPageLayout from '../SeoPageLayout';
import { shopsSeoConfigs } from './shopsConfigs';

const ShopsSeoPage = () => {
  const { slug } = useParams();
  const pageConfig = slug ? shopsSeoConfigs.details : shopsSeoConfigs.list;

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default ShopsSeoPage;
