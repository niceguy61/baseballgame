const Inventory = require('../models/Inventory');

// 인벤토리 정보 조회
exports.getInventory = async (req, res) => {
  const inventory = await Inventory.find({ userId: req.user.id });
  if (!inventory.length) {
    return res.status(404).json({ error: 'No items in inventory' });
  }
  res.json(inventory);
};
