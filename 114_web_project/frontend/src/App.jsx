import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  // 1. 取得資料 (Read)
  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error("讀取失敗", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 2. 新增資料 (Create)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return alert("請填寫內容");
    try {
      await axios.post('http://localhost:5000/api/transactions', {
        title,
        amount: Number(amount),
        type: 'expense'
      });
      setTitle('');
      setAmount('');
      fetchItems(); // 重新整理清單
    } catch (err) {
      alert("新增失敗");
    }
  };

  // 3. 刪除資料 (Delete)
  const deleteItem = async (id) => {
    if (window.confirm("確定要刪除嗎？")) {
      try {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`);
        fetchItems();
      } catch (err) {
        alert("刪除失敗");
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8 text-slate-800">簡潔記帳本</h1>
        
        {/* 輸入卡片 */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <input 
            className="w-full p-3 mb-3 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-blue-100 transition"
            placeholder="支出項目"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input 
            className="w-full p-3 mb-4 bg-slate-50 rounded-xl outline-none focus:ring-2 ring-blue-100 transition"
            placeholder="金額"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="w-full bg-slate-800 text-white p-3 rounded-xl font-medium hover:bg-slate-700 transition">
            儲存紀錄
          </button>
        </form>

        {/* 帳目清單 */}
        <div className="space-y-3">
          {transactions.map(t => (
            <div key={t._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-50 flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-700">{t.title}</p>
                <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-800">${t.amount}</span>
                <button 
                  onClick={() => deleteItem(t._id)}
                  className="text-slate-300 hover:text-red-400 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;