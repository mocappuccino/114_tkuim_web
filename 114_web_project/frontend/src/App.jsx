import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  
  // 編輯模式專用的狀態
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');

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
      fetchItems();
    } catch (err) {
      alert("新增失敗");
    }
  };

  // 3. 進入編輯模式
  const startEdit = (t) => {
    setEditId(t._id);
    setEditTitle(t.title);
    setEditAmount(t.amount);
  };

  // 4. 送出更新 (Update)
  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/transactions/${id}`, {
        title: editTitle,
        amount: Number(editAmount)
      });
      setEditId(null); // 關閉編輯模式
      fetchItems();
    } catch (err) {
      alert("更新失敗");
    }
  };

  // 5. 刪除資料 (Delete)
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
    <div className="min-h-screen p-6 bg-slate-50 text-slate-700">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">白色簡潔記帳本</h1>
        
        {/* 新增表單 */}
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
            <div key={t._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-50 transition-all">
              {editId === t._id ? (
                // --- 編輯狀態介面 ---
                <div className="flex flex-col gap-2">
                  <input 
                    className="p-2 bg-slate-50 rounded-lg outline-none ring-1 ring-slate-200"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input 
                    className="p-2 bg-slate-50 rounded-lg outline-none ring-1 ring-slate-200"
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleUpdate(t._id)} className="flex-1 bg-blue-500 text-white p-2 rounded-lg text-sm">確認修改</button>
                    <button onClick={() => setEditId(null)} className="flex-1 bg-slate-100 p-2 rounded-lg text-sm">取消</button>
                  </div>
                </div>
              ) : (
                // --- 一般顯示介面 ---
                <div className="flex justify-between items-center">
                  <div onClick={() => startEdit(t)} className="cursor-pointer flex-1">
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
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;