const Partner = require('../models/Partner');
const PartnersInfo = require('../models/PartnersInfo');
const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Bill = require('../models/Bill');
const fs = require('fs/promises');
const path = require('path');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const buildImageUrl = (req, rawPath) => {
    if (!rawPath) return null;
    const stringPath = String(rawPath).trim();
    if (/^https?:\/\//i.test(stringPath)) return stringPath;

    const normalized = stringPath
        .replace(/\\/g, '/')
        .replace(/^\.?\//, '')
        .replace(/^backend\//i, '');

    const publicPath = normalized.startsWith('uploads/')
        ? normalized
        : `uploads/${normalized.split('/').pop()}`;

    return `${req.protocol}://${req.get('host')}/${publicPath}`;
};

const removeLocalFile = async (filePath) => {
    if (!filePath) return;
    try {
        await fs.unlink(filePath);
    } catch (_error) {
        // Best effort cleanup only.
    }
};

const toUploadedUrl = async (req, file) => {
    if (!file) return null;
    const filePath = file.path;

    if (isCloudinaryConfigured && filePath) {
        try {
            const uploaded = await cloudinary.uploader.upload(filePath, {
                folder: 'magicpoint',
                resource_type: 'auto'
            });
            return uploaded?.secure_url || uploaded?.url || null;
        } finally {
            await removeLocalFile(filePath);
        }
    }

    return buildImageUrl(req, filePath);
};

const toAbsoluteUploadPath = (rawPath) => {
    const normalized = String(rawPath || '')
        .trim()
        .replace(/\\/g, '/')
        .replace(/^\.?\//, '')
        .replace(/^backend\//i, '');
    const relative = normalized.startsWith('uploads/')
        ? normalized
        : `uploads/${normalized.split('/').pop()}`;
    return path.resolve(__dirname, '..', relative);
};

const migrateLocalImageToCloud = async (rawPath) => {
    if (!rawPath || /^https?:\/\//i.test(String(rawPath))) return rawPath;
    if (!isCloudinaryConfigured) return null;

    const absolutePath = toAbsoluteUploadPath(rawPath);
    try {
        await fs.access(absolutePath);
    } catch (_error) {
        return null;
    }

    const uploaded = await cloudinary.uploader.upload(absolutePath, {
        folder: 'magicpoint',
        resource_type: 'auto'
    });
    return uploaded?.secure_url || uploaded?.url || null;
};

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Admin Login Successful',
            token,
            admin: { id: admin._id, username: admin.username, email: admin.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.partnerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const partner = await Partner.findOne({ email });

        if (!partner) {
            return res.status(401).json({ message: 'Partner not found' });
        }

        if (partner.status !== 'Active') {
            return res.status(403).json({ message: 'Your account is not active. Please contact admin.' });
        }

        const isMatch = await bcrypt.compare(password, partner.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: partner._id, role: 'partner' },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Partner Login Successful',
            token,
            partner: {
                id: partner._id,
                name: partner.restaurantName,
                email: partner.email,
                businessStatus: partner.businessStatus
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.addPartner = async (req, res) => {
    try {
        const partnerData = req.body;
        if (!partnerData.password) {
            return res.status(400).json({ message: 'Password is required for partner login' });
        }

        const salt = await bcrypt.genSalt(10);
        partnerData.password = await bcrypt.hash(partnerData.password, salt);

        if (req.file) {
            partnerData.resImage = await toUploadedUrl(req, req.file);
        }

        const newPartner = new Partner(partnerData);
        await newPartner.save();
        res.status(201).json({ message: 'Partner added successfully', newPartner });
    } catch (error) {
        res.status(400).json({ message: 'Error adding partner', error: error.message });
    }
};

exports.getAllPartners = async (req, res) => {
    try {
        const partners = await Partner.find();
        const shapedPartners = await Promise.all(partners.map(async (partner) => {
            const item = partner.toObject();
            const migratedUrl = await migrateLocalImageToCloud(item.resImage);
            if (migratedUrl && migratedUrl !== item.resImage) {
                item.resImage = migratedUrl;
                await Partner.findByIdAndUpdate(partner._id, { $set: { resImage: migratedUrl } });
            }
            item.imageUrl = buildImageUrl(req, item.resImage);
            return item;
        }));
        res.status(200).json(shapedPartners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching partners' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedPartner = await Partner.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ message: `Partner is now ${status}`, updatedPartner });
    } catch (error) {
        res.status(400).json({ message: 'Error updating status' });
    }
};

exports.deletePartner = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPartner = await Partner.findByIdAndDelete(id);

        if (!deletedPartner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting partner' });
    }
};

exports.getPartnerTransactions = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const transactions = await Bill.find({ partnerId }).sort({ createdAt: -1 });

        let totalRevenue = 0;
        let totalDiscount = 0;

        transactions.forEach((bill) => {
            totalRevenue += Number(bill.billAmount) || 0;
            totalDiscount += Number(bill.discountAmount) || 0;
        });

        res.status(200).json({
            transactions,
            stats: {
                revenue: totalRevenue,
                discounts: totalDiscount,
                customers: transactions.length,
                avgBill: transactions.length > 0 ? Math.round(totalRevenue / transactions.length) : 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
};

exports.updatePartnerBusinessStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { businessStatus } = req.body;

        if (!['OPEN', 'CLOSED'].includes(businessStatus)) {
            return res.status(400).json({ message: 'businessStatus must be OPEN or CLOSED' });
        }

        const updatedPartner = await Partner.findByIdAndUpdate(
            id,
            { businessStatus },
            { new: true }
        );

        if (!updatedPartner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        res.status(200).json({
            message: `Business status updated to ${businessStatus}`,
            partner: {
                id: updatedPartner._id,
                name: updatedPartner.restaurantName,
                email: updatedPartner.email,
                businessStatus: updatedPartner.businessStatus
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating business status', error: error.message });
    }
};

const toArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (_error) {
            return [];
        }
    }
    return [];
};

const toStringOrUndefined = (value) => {
    if (value === undefined || value === null) return undefined;
    const str = String(value).trim();
    return str.length ? str : '';
};

const toNumberOrUndefined = (value) => {
    if (value === undefined || value === null || value === '') return undefined;
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
};

const resolveUploadedFiles = async (req) => {
    const files = Array.isArray(req.files) ? req.files : [];
    const byField = {};
    for (const file of files) {
        const key = String(file.fieldname || '').trim();
        if (!key) continue;
        if (!byField[key]) byField[key] = [];
        const uploadedUrl = await toUploadedUrl(req, file);
        if (uploadedUrl) byField[key].push(uploadedUrl);
    }
    return byField;
};

const mapMenuItems = (items, uploadedByField) =>
    toArray(items).map((entry) => {
        const item = entry && typeof entry === 'object' ? { ...entry } : {};
        const imageValue = String(item.image || '').trim();
        if (imageValue.startsWith('upload:')) {
            const uploadKey = imageValue.slice('upload:'.length);
            const uploaded = uploadedByField[uploadKey];
            item.image = Array.isArray(uploaded) && uploaded.length ? uploaded[0] : '';
        }
        return item;
    });

exports.getPartnerInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const info = await PartnersInfo.findOne({ partnerId: id }).lean();

        if (!info) {
            return res.status(200).json({ success: true, data: null });
        }

        return res.status(200).json({ success: true, data: info });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching partner info', error: error.message });
    }
};

exports.upsertPartnerInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const uploadedByField = await resolveUploadedFiles(req);
        const existingPhotos = toArray(req.body.photos);
        const existingVideos = toArray(req.body.videos);
        const uploadedPhotos = uploadedByField.photoFiles || [];
        const uploadedVideos = uploadedByField.videoFiles || [];

        const payload = {
            logo: (uploadedByField.logoFile && uploadedByField.logoFile[0]) || toStringOrUndefined(req.body.logo),
            email: toStringOrUndefined(req.body.email),
            memberSince: toStringOrUndefined(req.body.memberSince),
            restaurantName: toStringOrUndefined(req.body.restaurantName),
            subtitle: toStringOrUndefined(req.body.subtitle),
            foodType: toStringOrUndefined(req.body.foodType),
            description: toStringOrUndefined(req.body.description),
            rating: toNumberOrUndefined(req.body.rating),
            location: toStringOrUndefined(req.body.location),
            openTime: toStringOrUndefined(req.body.openTime),
            closeTime: toStringOrUndefined(req.body.closeTime),
            callNumber: toStringOrUndefined(req.body.callNumber),
            directionLink: toStringOrUndefined(req.body.directionLink),
            menu: {
                vegMenu: mapMenuItems(req.body?.menu?.vegMenu ?? req.body.vegMenu, uploadedByField),
                nonVegMenu: mapMenuItems(req.body?.menu?.nonVegMenu ?? req.body.nonVegMenu, uploadedByField),
                cafeMenu: mapMenuItems(req.body?.menu?.cafeMenu ?? req.body.cafeMenu, uploadedByField)
            },
            photos: [...existingPhotos, ...uploadedPhotos],
            videos: [...existingVideos, ...uploadedVideos]
        };

        const cleanedPayload = Object.fromEntries(
            Object.entries(payload).filter(([, value]) => value !== undefined)
        );

        const doc = await PartnersInfo.findOneAndUpdate(
            { partnerId: id },
            { $set: cleanedPayload, $setOnInsert: { partnerId: id } },
            { new: true, upsert: true, runValidators: true }
        );

        const partnerSyncPayload = {};
        if (Object.prototype.hasOwnProperty.call(cleanedPayload, 'restaurantName')) {
            partnerSyncPayload.restaurantName = cleanedPayload.restaurantName;
        }
        if (Object.prototype.hasOwnProperty.call(cleanedPayload, 'foodType')) {
            partnerSyncPayload.foodType = cleanedPayload.foodType;
        }
        if (Object.prototype.hasOwnProperty.call(cleanedPayload, 'openTime')) {
            partnerSyncPayload.openTime = cleanedPayload.openTime;
        }
        if (Object.prototype.hasOwnProperty.call(cleanedPayload, 'closeTime')) {
            partnerSyncPayload.closeTime = cleanedPayload.closeTime;
        }
        if (Object.prototype.hasOwnProperty.call(cleanedPayload, 'directionLink')) {
            partnerSyncPayload.locationLink = cleanedPayload.directionLink;
        }

        if (Object.keys(partnerSyncPayload).length > 0) {
            await Partner.findByIdAndUpdate(id, { $set: partnerSyncPayload });
        }

        return res.status(200).json({ success: true, data: doc });
    } catch (error) {
        return res.status(400).json({ message: 'Error saving partner info', error: error.message });
    }
};

exports.getAdminDashboardStats = async (req, res) => {
    try {
        const users = await User.find({
            $or: [
                { lastLoginAt: { $ne: null } },
                { membershipActivatedAt: { $ne: null } }
            ]
        })
            .sort({ lastLoginAt: -1, membershipActivatedAt: -1, createdAt: -1 })
            .select('name email mobileNumber membershipPlan lastLoginAt membershipActivatedAt createdAt')
            .lean();

        const revenueAgg = await Bill.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $ifNull: ['$billAmount', 0] } },
                    totalDiscount: { $sum: { $ifNull: ['$discountAmount', 0] } },
                    totalTransactions: { $sum: 1 }
                }
            }
        ]);

        const totals = revenueAgg[0] || {
            totalRevenue: 0,
            totalDiscount: 0,
            totalTransactions: 0
        };

        res.status(200).json({
            stats: {
                loggedInUsers: users.length,
                totalRevenue: totals.totalRevenue,
                totalDiscount: totals.totalDiscount,
                netRevenue: totals.totalRevenue - totals.totalDiscount,
                totalTransactions: totals.totalTransactions
            },
            users: users.map((user) => ({
                id: user._id,
                name: user.name,
                email: user.email || '-',
                mobile: user.mobileNumber,
                membershipPlan: user.membershipPlan,
                lastLoginAt: user.lastLoginAt || user.membershipActivatedAt || user.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin dashboard stats', error: error.message });
    }
};
