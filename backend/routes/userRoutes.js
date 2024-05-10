const express = require('express');
const {
  createUser,
  addGold,
  getUserById,
  login
} = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', createUser);
router.post('/login', login);
router.post('/add-gold', authenticateToken, addGold);
router.get('/me', authenticateToken, getUserById);

module.exports = router;
