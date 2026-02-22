const asyncHandler = require('../middleware/asyncHandler');

const getRestaurant = asyncHandler(async (_req, res) => {
    const restaurant = {
        name: 'Pizza Hut',
        cuisine: 'Quick Bites',
        costForTwo: 350,
        address: 'Janpath, Connaught Place (CP), New Delhi',
        rating: 4.2,
        visits: 2319,
        contact: '+91 9643967088',
        vouchers: [
            { title: 'Gift Voucher worth Rs. 2000', price: 1840, save: '8%', soldOut: false },
            { title: 'Gift Voucher worth Rs. 1000', price: 920, save: '8%', soldOut: false },
            { title: 'Gift Voucher worth Rs. 500', price: 0, save: '0%', soldOut: true }
        ],
        popularItem: {
            name: 'Classic Onion Capsicum',
            description: 'Pizza topped with our classic pan sauce, crunchy onion...',
            price: 109
        }
    };

    res.status(200).json({
        success: true,
        data: restaurant
    });
});

module.exports = { getRestaurant };
