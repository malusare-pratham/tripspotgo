const mongoose = require('mongoose');

const seoPageSchema = new mongoose.Schema({
    slug: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },
    heroTitle: { type: String, default: '' },
    heroSubtitle: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    features: [{
        title: { type: String, default: '' },
        description: { type: String, default: '' }
    }],
    sections: [{
        heading: { type: String, default: '' },
        content: { type: String, default: '' },
        image: { type: String, default: '' },
        bulletPoints: [{ type: String }]
    }]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('SeoPage', seoPageSchema);
