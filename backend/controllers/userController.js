const User = require('../models/User');

// 사용자 생성
exports.createUser = async (req, res) => {
  const { username, password, isAdmin } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const user = new User({ username, isAdmin });
  user.setPassword(password);

  await user.save();
  res.json({ username: user.username, isAdmin: user.isAdmin });
};

// 골드 추가
exports.addGold = async (req, res) => {
  const { amount } = req.body;
  const parsedAmount = parseInt(amount, 10);

  if (isNaN(parsedAmount) || parsedAmount < 0) {
    return res.status(400).json({ error: 'Invalid amount value' });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.gold += parsedAmount;
  await user.save();
  res.json(user);
};

// 사용자 정보 조회
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ username: user.username, gold: user.gold, isAdmin: user.isAdmin });
};

// 로그인 검증
exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !user.validPassword(password)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: jwtExpiresIn });

  res.json({
    username: user.username,
    isAdmin: user.isAdmin,
    accessToken: token
  });
};
