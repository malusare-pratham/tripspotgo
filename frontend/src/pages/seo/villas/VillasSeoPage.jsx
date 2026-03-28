import React from 'react';
import { useParams } from 'react-router-dom';
import SeoPageLayout from '../SeoPageLayout';
import { villasSeoConfigs } from './villasConfigs';

const VillasSeoPage = () => {
  const { slug } = useParams();
  const pageConfig = slug ? villasSeoConfigs.details : villasSeoConfigs.list;

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default VillasSeoPage;
