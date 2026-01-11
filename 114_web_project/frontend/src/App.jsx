import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 預設支出
  const [category, setCategory] = useState('餐飲');
  
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const categories = type === 'expense' 
    ? ['餐飲', '交通', '購物', '娛樂', '其他'] 
    : ['薪資', '獎金', '投資', '其他'];

  const fetchItems = async () => {
    const res = await axios.get('http://localhost:5000/api/transactions');
    setTransactions(res.data);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/transactions', {
      title, amount: Number(amount), type, category
    });
    setTitle(''); setAmount(''); fetchItems();
  };

  const deleteItem = async (id) => {
    if (window.confirm("確定刪除？")) {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      fetchItems();
    }
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/api/transactions/${id}`, {
      title: editTitle, amount: Number(editAmount)
    });
    setEditId(null); fetchItems();
  };

  // 計算總餘額
  const totalBalance = transactions.reduce((acc, curr) => 
    curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);

  return (
    <div className="min-h-screen p-6 bg-slate-50 text-slate-700">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-2">簡潔記帳本</h1>
        <p className="text-center mb-8 font-mono text-xl">
          總餘額: <span className={totalBalance >= 0 ? 'text-green-500' : 'text-red-500'}>
            ${totalBalance}
          </span>
        </p>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
          {/* 收支切換按鈕 */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
            <button type="button" onClick={() => {setType('expense'); setCategory('餐飲');}} 
              className={`flex-1 py-2 rounded-lg text-sm transition ${type === 'expense' ? 'bg-white shadow-sm' : ''}`}>支出</button>
            <button type="button" onClick={() => {setType('income'); setCategory('薪資');}} 
              className={`flex-1 py-2 rounded-lg text-sm transition ${type === 'income' ? 'bg-white shadow-sm' : ''}`}>收入</button>
          </div>

          <input className="w-full p-3 mb-3 bg-slate-50 rounded-xl outline-none" placeholder="項目" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <div className="flex gap-2 mb-4">
            <input className="flex-1 p-3 bg-slate-50 rounded-xl outline-none" placeholder="金額" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} />
            <select className="p-3 bg-slate-50 rounded-xl outline-none text-sm" value={category} onChange={(e)=>setCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button className={`w-full p-3 rounded-xl font-medium text-white transition ${type === 'expense' ? 'bg-slate-800' : 'bg-green-600'}`}>儲存紀錄</button>
        </form>

        <div className="space-y-3">
          {transactions.map(t => (
            <div key={t._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-50 flex justify-between items-center">
              {editId === t._id ? (
                <div className="flex-1 flex gap-2"><input className="flex-1 p-1 bg-slate-50 border rounded" value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} /><button onClick={()=>handleUpdate(t._id)} className="text-blue-500">✔</button></div>
              ) : (
                <>
                  <div onClick={() => {setEditId(t._id); setEditTitle(t.title); setEditAmount(t.amount);}} className="cursor-pointer">
                    <p className="font-medium">{t.title} <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full ml-1">{t.category}</span></p>
                    <p className="text-[10px] text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount}
                    </span>
                    <button onClick={() => deleteItem(t._id)} className="text-slate-300 hover:text-red-400">✕</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;