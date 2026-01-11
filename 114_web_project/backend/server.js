const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 中間層 (Middleware)
app.use(cors()); // 允許跨來源請求
app.use(express.json()); // 解析 JSON

// 連接 MongoDB 資料庫
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB 連線成功'))
  .catch(err => console.log('❌ 連線失敗：', err));

// 串接路由
const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api/transactions', transactionRoutes); // 所有的 API 都會以 /api/transactions 開頭

// 啟動伺服器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 伺服器跑在 http://localhost:${PORT}`);
});