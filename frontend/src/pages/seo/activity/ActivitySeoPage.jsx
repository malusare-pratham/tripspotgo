import React from 'react';
import { useParams } from 'react-router-dom';
import SeoPageLayout from '../SeoPageLayout';
import { activitySeoConfigs } from './activityConfigs';

const ActivitySeoPage = () => {
  const { slug } = useParams();
  const pageConfig = slug ? activitySeoConfigs.details : activitySeoConfigs.list;

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default ActivitySeoPage;
