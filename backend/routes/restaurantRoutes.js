const express = require('express');
const upload = require('../middleware/upload');
const { getRestaurant, getPartnerReviews, createPartnerReview } = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', getRestaurant);
router.get('/:partnerId/reviews', getPartnerReviews);
router.post('/:partnerId/reviews', upload.array('reviewPhotos', 6), createPartnerReview);

module.exports = router;
