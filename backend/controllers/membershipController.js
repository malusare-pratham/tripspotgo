const Membership = require('../models/Membership');
const asyncHandler = require('../middleware/asyncHandler');

const listMemberships = asyncHandler(async (_req, res) => {
    const plans = await Membership.find({ isActive: true })
        .sort({ price: 1, createdAt: 1 })
        .lean();

    res.status(200).json({
        success: true,
        count: plans.length,
        data: plans
    });
});

module.exports = { listMemberships };
