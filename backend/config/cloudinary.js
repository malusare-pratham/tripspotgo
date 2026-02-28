const { v2: cloudinary } = require('cloudinary');

const cloudinaryUrl = String(process.env.CLOUDINARY_URL || '').trim();
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const hasSplitConfig = Boolean(cloudName && apiKey && apiSecret);
const hasUrlConfig = cloudinaryUrl.startsWith('cloudinary://');
const isCloudinaryConfigured = hasSplitConfig || hasUrlConfig;

if (isCloudinaryConfigured) {
    if (hasSplitConfig) {
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });
    } else {
        const match = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
        if (match) {
            cloudinary.config({
                cloud_name: decodeURIComponent(match[3]),
                api_key: decodeURIComponent(match[1]),
                api_secret: decodeURIComponent(match[2])
            });
        }
    }
}

module.exports = { cloudinary, isCloudinaryConfigured };
