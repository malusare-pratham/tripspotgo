import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import SeoPageLayout from '../SeoPageLayout';
import '../SeoPageLayout.css';
import { blogSeoConfigs } from './blogConfigs';

const BlogSeoPage = () => {
  const { slug } = useParams();
  const pageConfig = blogSeoConfigs[slug];

  if (!pageConfig) {
    return (
      <div className="seo-cms-root">
        <Navbar />
        <main className="seo-cms-main">
          <div className="seo-no-content">
            <h3>Page not found</h3>
            <p>This blog page is not available right now.</p>
            <Link to="/blog" className="seo-bottom-btn">Back to Blog</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <SeoPageLayout slug={pageConfig.slug} defaultData={pageConfig} />;
};

export default BlogSeoPage;
