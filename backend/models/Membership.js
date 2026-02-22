const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            minlength: 2,
            maxlength: 120
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        features: {
            type: [String],
            default: []
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Membership', membershipSchema);
