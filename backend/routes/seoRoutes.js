const express = require('express');
const router = express.Router();
const SeoPage = require('../models/SeoPage');

// GET all SEO pages (Admin usage)
router.get('/', async (req, res) => {
    try {
        const pages = await SeoPage.find({}).sort({ updatedAt: -1 });
        res.status(200).json({ success: true, pages });
    } catch (error) {
        console.error('Error fetching SEO pages:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET single SEO page by slug (Frontend dynamic hydration)
router.get('/:slug', async (req, res) => {
    try {
        const page = await SeoPage.findOne({ slug: req.params.slug });
        if (!page) {
            return res.status(404).json({ success: false, message: 'SEO page not found' });
        }
        res.status(200).json({ success: true, page });
    } catch (error) {
        console.error('Error fetching SEO page:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT (Upsert) SEO page (Admin save)
router.put('/:slug', async (req, res) => {
    try {
        const payload = req.body;
        
        // Find by slug and update, or create if it doesn't exist (upsert)
        const updatedPage = await SeoPage.findOneAndUpdate(
            { slug: req.params.slug },
            { $set: payload },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ success: true, message: 'SEO Page saved successfully', page: updatedPage });
    } catch (error) {
        console.error('Error saving SEO page:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
