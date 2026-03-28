import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const SEO_PAGES = [
  { slug: 'panchgani-city', name: 'City: Panchgani' },
  { slug: 'mahabaleshwar-city', name: 'City: Mahabaleshwar' },
  { slug: 'category-restaurants', name: 'Category: Restaurants' },
  { slug: 'category-cafes', name: 'Category: Cafes' },
  { slug: 'category-pizza', name: 'Category: Pizza' },
  { slug: 'category-biryani', name: 'Category: Biryani' },
  { slug: 'category-streetfood', name: 'Category: Street Food' },
  { slug: 'restaurant-list', name: 'Restaurant List' },
  { slug: 'restaurant-details', name: 'Restaurant Details' },
  { slug: 'blog-best-restaurants-panchgani', name: 'Blog: Best Restaurants Panchgani' },
  { slug: 'blog-best-restaurants-mahabaleshwar', name: 'Blog: Best Restaurants Mahabaleshwar' },
  { slug: 'blog-best-cafes-panchgani', name: 'Blog: Best Cafes Panchgani' },
  { slug: 'blog-best-cafes-mahabaleshwar', name: 'Blog: Best Cafes Mahabaleshwar' },
  { slug: 'blog-things-to-do-panchgani', name: 'Blog: Things To Do Panchgani' },
  { slug: 'blog-things-to-do-mahabaleshwar', name: 'Blog: Things To Do Mahabaleshwar' }
];

const emptyFormData = {
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  heroTitle: '',
  heroSubtitle: '',
  heroImage: '',
  features: [],
  sections: []
};

const AdminSeoEditor = () => {
  const [selectedSlug, setSelectedSlug] = useState(SEO_PAGES[0].slug);
  const [formData, setFormData] = useState(emptyFormData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPageData(selectedSlug);
  }, [selectedSlug]);

  const fetchPageData = async (slug) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/seo-pages/${slug}`);
      if (response.data && response.data.page) {
        setFormData(response.data.page);
      } else {
        setFormData(emptyFormData);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("No override found, using default empty form.");
        setFormData(emptyFormData);
      } else {
        alert('Error fetching SEO page data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...(formData.features || []), { title: '', description: '' }]
    });
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...(formData.sections || [])];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData({ ...formData, sections: newSections });
  };

  const handleAddSection = () => {
    setFormData({
      ...formData,
      sections: [...(formData.sections || []), { heading: '', content: '', image: '', bulletPoints: [] }]
    });
  };

  const handleRemoveSection = (index) => {
    const newSections = [...(formData.sections || [])];
    newSections.splice(index, 1);
    setFormData({ ...formData, sections: newSections });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/api/seo-pages/${selectedSlug}`, formData);
      alert('SEO Page saved successfully!');
    } catch (error) {
      alert('Error saving SEO page');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="partners-card" style={{ padding: '30px' }}>
      <div className="partners-card-header" style={{ marginBottom: '20px' }}>
        <h3>SEO Form Editor</h3>
        <select 
          className="form-input" 
          value={selectedSlug} 
          onChange={(e) => setSelectedSlug(e.target.value)}
          style={{ width: '300px', padding: '10px', borderRadius: '8px' }}
        >
          {SEO_PAGES.map((page) => (
            <option key={page.slug} value={page.slug}>{page.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading page data...</p>
      ) : (
        <form className="professional-form" onSubmit={handleSave}>
          <h4 style={{ marginBottom: '15px', color: '#1e293b' }}>Meta Information (Hidden)</h4>
          <div className="form-grid">
            <div className="form-field">
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Meta Title</label>
              <input name="metaTitle" placeholder="Meta Title" value={formData.metaTitle || ''} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Meta Keywords</label>
              <input name="metaKeywords" placeholder="Meta Keywords" value={formData.metaKeywords || ''} onChange={handleChange} />
            </div>
            <div className="form-field" style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Meta Description</label>
              <input name="metaDescription" placeholder="Meta Description" value={formData.metaDescription || ''} onChange={handleChange} />
            </div>
          </div>

          <h4 style={{ margin: '30px 0 15px', color: '#1e293b' }}>Hero Section (Visible Top)</h4>
          <div className="form-grid">
            <div className="form-field">
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Hero Big Title</label>
              <input name="heroTitle" placeholder="Hero Big Title" value={formData.heroTitle || ''} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Hero Subtitle</label>
              <input name="heroSubtitle" placeholder="Hero Subtitle" value={formData.heroSubtitle || ''} onChange={handleChange} />
            </div>
            <div className="form-field" style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Hero Image URL</label>
              <input name="heroImage" placeholder="Hero Image URL (e.g., Unsplash Link)" value={formData.heroImage || ''} onChange={handleChange} />
            </div>
          </div>

          <h4 style={{ margin: '30px 0 15px', color: '#1e293b' }}>Features Highlights</h4>
          {formData.features && formData.features.map((feature, index) => (
             <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Feature Title</label>
                  <input placeholder="Feature Title" value={feature.title} onChange={(e) => handleFeatureChange(index, 'title', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Feature Description</label>
                  <input placeholder="Feature Description" value={feature.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                </div>
                <button type="button" onClick={() => handleRemoveFeature(index)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '0 15px', cursor: 'pointer', alignSelf: 'flex-end', height: '42px' }}>Remove</button>
             </div>
          ))}
          <button type="button" onClick={handleAddFeature} style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', marginBottom: '20px' }}>+ Add Feature</button>

          <h4 style={{ margin: '30px 0 15px', color: '#1e293b' }}>Page Article Sections</h4>
          {formData.sections && formData.sections.map((section, index) => (
             <div key={index} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div className="form-grid" style={{ marginBottom: '15px' }}>
                  <div className="form-field">
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Section Heading</label>
                    <input placeholder="Section Heading" value={section.heading} onChange={(e) => handleSectionChange(index, 'heading', e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  </div>
                  <div className="form-field">
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Image URL for Section</label>
                    <input placeholder="Image URL for Section" value={section.image} onChange={(e) => handleSectionChange(index, 'image', e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  </div>
                </div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Section Paragraph Content</label>
                <textarea placeholder="Section Paragraph Content" value={section.content} onChange={(e) => handleSectionChange(index, 'content', e.target.value)} style={{ width: '100%', minHeight: '100px', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px' }} />
                <button type="button" onClick={() => handleRemoveSection(index)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 15px', cursor: 'pointer' }}>Remove Section</button>
             </div>
          ))}
          <div style={{ paddingBottom: '30px' }}>
             <button type="button" onClick={handleAddSection} style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>+ Add Content Section</button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />
          
          <button type="submit" className="save-btn" disabled={saving} style={{ width: '100%', padding: '15px', fontSize: '1.2rem' }}>
            {saving ? 'Saving...' : 'Publish Override'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminSeoEditor;
