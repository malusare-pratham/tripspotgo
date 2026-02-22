const Partner = require('../models/Partner');
const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Bill = require('../models/Bill');

const buildImageUrl = (req, rawPath) => {
    if (!rawPath) return null;

    const normalized = String(rawPath)
        .replace(/\\/g, '/')
        .replace(/^\.?\//, '')
        .replace(/^backend\//i, '');

    const publicPath = normalized.startsWith('uploads/')
        ? normalized
        : `uploads/${normalized.split('/').pop()}`;

    return `${req.protocol}://${req.get('host')}/${publicPath}`;
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
            partnerData.resImage = req.file.path;
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
        const shapedPartners = partners.map((partner) => {
            const item = partner.toObject();
            item.imageUrl = buildImageUrl(req, item.resImage);
            return item;
        });
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
