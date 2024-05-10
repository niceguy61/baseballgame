const express = require('express');
const { getInventory } = require('../controllers/inventoryController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getInventory);

module.exports = router;
