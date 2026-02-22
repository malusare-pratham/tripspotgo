const express = require('express');
const { listMemberships } = require('../controllers/membershipController');

const router = express.Router();

router.get('/', listMemberships);

module.exports = router;
