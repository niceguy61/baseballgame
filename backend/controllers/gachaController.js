const { v4: uuidv4 } = require('uuid');
const GachaSet = require('../models/GachaSet');
const GachaLog = require('../models/GachaLog');
const RareItemLog = require('../models/RareItemLog');
const User = require('../models/User');
const Inventory = require('../models/Inventory');

// 기본 가챠 설정
const defaultGrades = [
  { name: 'A', probability: 0.01, value: 1000000 },
  { name: 'B', probability: 0.05, value: 100000 },
  { name: 'C', probability: 0.14, value: 50000 },
  { name: 'D', probability: 0.30, value: 10000 },
  { name: 'E', probability: 0.50, value: 500 }
];

const classes = ['Warrior', 'Mage', 'Archer', 'Rogue', 'Blacksmith'];

// 기본 가챠 세트 생성
const createDefaultGachaSet = async () => {
  const items = [];

  for (const grade of defaultGrades) {
    for (const cls of classes) {
      items.push({
        grade: grade.name,
        class: cls,
        value: grade.value,
        probability: grade.probability
      });
    }
  }

  const setId = uuidv4();
  const gachaSet = new GachaSet({ setId, name: 'default', items });
  await gachaSet.save();
};

const findOrCreateDefaultGachaSet = async () => {
  let gachaSet = await GachaSet.findOne({ name: 'default' });
  if (!gachaSet) {
    await createDefaultGachaSet();
    gachaSet = await GachaSet.findOne({ name: 'default' });
  }
  return gachaSet;
};

const drawItemFromSet = (items) => {
  const random = Math.random();
  let cumulativeProbability = 0;

  for (const item of items) {
    cumulativeProbability += item.probability;
    if (random < cumulativeProbability) {
      return item;
    }
  }
  return null;
};

const logRareItem = async (userId, gachaId, item) => {
  if (['A', 'B'].includes(item.grade)) {
    const rareLog = new RareItemLog({ gachaId, userId, item });
    await rareLog.save();
  }
};

const addToInventory = async (userId, item) => {
  const existingItem = await Inventory.findOne({
    userId,
    grade: item.grade,
    class: item.class
  });

  if (existingItem) {
    existingItem.quantity += 1;
    await existingItem.save();
  } else {
    const newItem = new Inventory({
      userId,
      grade: item.grade,
      class: item.class,
      value: item.value,
      quantity: 1
    });
    await newItem.save();
  }
};

// 컨트롤러 함수들
exports.createGachaSet = async (req, res) => {
  const { name, items } = req.body;

  // 모든 확률의 합이 1이어야 함을 검증
  const totalProbability = items.reduce((acc, item) => acc + item.probability, 0);
  if (totalProbability !== 1) {
    return res.status(400).json({ error: 'Total probability should equal 1' });
  }

  const setId = uuidv4();
  const gachaSet = new GachaSet({ setId, name, items });
  await gachaSet.save();
  res.json(gachaSet);
};

exports.drawGacha = async (req, res) => {
  const { setName } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const gachaSet = setName
    ? await GachaSet.findOne({ name: setName })
    : await findOrCreateDefaultGachaSet();

  const item = drawItemFromSet(gachaSet.items);

  if (user.gold < item.value) {
    return res.status(400).json({ error: 'Insufficient gold' });
  }

  const gachaId = uuidv4();
  user.gold -= item.value;
  user.gachaLogs.push({ gachaId, item });
  await user.save();

  const gachaLog = new GachaLog({ gachaId, userId: user._id, item });
  await gachaLog.save();
  await logRareItem(user._id, gachaId, item);
  await addToInventory(user._id, item);

  res.json({ gachaId, item });
};

exports.getGachaLogs = async (req, res) => {
  const logs = await GachaLog.find({ userId: req.user.id });
  res.json(logs);
};

exports.getRareItemLogs = async (req, res) => {
  const logs = await RareItemLog.find({ userId: req.user.id });
  res.json(logs);
};

exports.initializeDefaultGachaSet = async () => {
  await findOrCreateDefaultGachaSet();
};
