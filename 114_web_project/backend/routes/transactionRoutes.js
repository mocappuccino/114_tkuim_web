const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// 取得所有資料 (Read)
router.get('/', async (req, res) => {
  try {
    const data = await Transaction.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 新增資料 (Create)
router.post('/', async (req, res) => {
  const item = new Transaction(req.body);
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 更新資料 (Update)
router.put('/:id', async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // 回傳更新後的資料
    );
    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;