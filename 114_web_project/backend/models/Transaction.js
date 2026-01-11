const transactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true }, // 區分收入支出
  category: { type: String, default: '其他' }, // 儲存分類
  date: { type: Date, default: Date.now }
}, { timestamps: true });