const mongoose = require('mongoose');

// 這就是我們的「帳單格式」設計圖
const transactionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, '請輸入消費項目名稱'] // 這是必填欄位
  },
  amount: { 
    type: Number, 
    required: [true, '請輸入金額'] 
  },
  type: { 
    type: String, 
    enum: ['income', 'expense'], // 只能是「收入」或「支出」
    required: true 
  },
  category: { 
    type: String, 
    default: '其他' // 如果沒選分類，預設就是其他
  },
  date: { 
    type: Date, 
    default: Date.now // 如果沒選日期，預設就是今天
  }
}, { 
  timestamps: true // 這會自動幫你記錄這筆資料是什麼時候「建立」跟「修改」的
});

module.exports = mongoose.model('Transaction', transactionSchema);