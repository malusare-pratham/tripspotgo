const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    restaurantName: { type: String, required: true },
    ownerName: { type: String, required: true },
    resMobile: { type: String, required: true },
    ownerMobile: { type: String, required: true },
    foodType: { type: String, enum: ['Veg', 'Non-Veg', 'Both'], required: true },
    resImage: { type: String },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },
    businessStatus: { type: String, default: 'OPEN', enum: ['OPEN', 'CLOSED'] },
    businessCategory: {
        type: String,
        enum: ['Food & Dining', 'Activities & Adventure', 'Local Stores & Gift House', 'Stay & Hotels'],
        default: 'Food & Dining'
    },

    address: { type: String, required: true },
    locationLink: { type: String },
    pincode: { type: String, required: true },
    area: { type: String, required: true },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Active', 'Blocked'] }
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
