const express = require('express');
// const { recentData, SendData } = require('../Controllers/LiveStats');
const {recentData,CheckedIn,CheckedOUT} = require('../Controllers/LiveStats')
const { authenticateToken }= require('../middlewares/auth')
// const app = express.Router();
const router = express.Router();

// CheckedOUT
router.get('/recentData', recentData);
router.post('/recentData', authenticateToken,CheckedIn);
router.put('/recentData', authenticateToken,CheckedOUT);
module.exports = router;