const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const upload = require('../middleware/upload');

router.post('/login', adminController.adminLogin);
router.post('/partner-login', adminController.partnerLogin);
router.get('/dashboard-stats', adminController.getAdminDashboardStats);

router.get('/partner-transactions/:partnerId', adminController.getPartnerTransactions);
router.put('/partner-business-status/:id', adminController.updatePartnerBusinessStatus);
router.get('/partner-info/:id', adminController.getPartnerInfo);
router.put('/partner-info/:id', upload.any(), adminController.upsertPartnerInfo);

router.post('/add-partner', upload.single('resImage'), adminController.addPartner);
router.get('/partners', adminController.getAllPartners);
router.put('/update-status/:id', adminController.updateStatus);
router.delete('/delete-partner/:id', adminController.deletePartner);

module.exports = router;
