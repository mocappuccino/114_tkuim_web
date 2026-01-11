import React, { useState, useEffect } from 'react';
import axios from 'axios';
// 引入圖表組件
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('餐飲');
  const [editId, setEditId] = useState(null);

  const categories = type === 'expense' ? ['餐飲', '交通', '購物', '娛樂', '其他'] : ['薪資', '獎金', '投資', '其他'];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const fetchItems = async () => {
    const res = await axios.get('http://localhost:5000/api/transactions');
    setTransactions(res.data);
  };

  useEffect(() => { fetchItems(); }, []);

  // 1. 準備圓餅圖數據 (按分類加總支出)
  const pieData = categories.map(cat => ({
    name: cat,
    value: transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
  })).filter(d => d.value > 0);

  // 2. 準備月份統計數據
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  // ... (handleSubmit, deleteItem, handleUpdate 跟之前一樣) ...
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/transactions', { title, amount: Number(amount), type, category });
    setTitle(''); setAmount(''); fetchItems();
  };

  const deleteItem = async (id) => {
    if (window.confirm("確定刪除？")) {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      fetchItems();
    }
  };

  return (
    <div className="min-h-screen p-4 bg-slate-50 text-slate-700 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">數據化記帳本</h1>

        {/* --- 統計圖表區 --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 h-64">
            <h2 className="text-sm font-semibold mb-2">支出分類比例</h2>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <div className="mb-4">
              <p className="text-slate-400 text-sm">總餘額</p>
              <p className={`text-3xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                ${totalIncome - totalExpense}
              </p>
            </div>
            <div className="flex gap-4">
              <div><p className="text-xs text-slate-400">總收入</p><p className="text-lg font-semibold text-emerald-500">+${totalIncome}</p></div>
              <div><p className="text-xs text-slate-400">總支出</p><p className="text-lg font-semibold text-red-400">-${totalExpense}</p></div>
            </div>
          </div>
        </div>

        {/* --- 輸入與列表區 (保持原本的簡潔) --- */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs">
              <button type="button" onClick={() => {setType('expense'); setCategory('餐飲');}} className={`flex-1 py-2 rounded-lg ${type === 'expense' ? 'bg-white shadow-sm' : ''}`}>支出</button>
              <button type="button" onClick={() => {setType('income'); setCategory('薪資');}} className={`flex-1 py-2 rounded-lg ${type === 'income' ? 'bg-white shadow-sm' : ''}`}>收入</button>
            </div>
            <input className="w-full p-3 mb-3 bg-slate-50 rounded-xl outline-none" placeholder="項目" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <div className="flex gap-2 mb-4">
              <input className="flex-1 p-3 bg-slate-50 rounded-xl outline-none" placeholder="金額" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} />
              <select className="p-3 bg-slate-50 rounded-xl outline-none text-xs" value={category} onChange={(e)=>setCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button className={`w-full p-3 rounded-xl font-medium text-white ${type === 'expense' ? 'bg-slate-800' : 'bg-emerald-600'}`}>新增紀錄</button>
          </form>

          <div className="space-y-3">
            {transactions.map(t => (
              <div key={t._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-50 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">{t.title} <span className="text-[10px] bg-slate-50 px-2 py-0.5 rounded text-slate-400">{t.category}</span></p>
                  <p className="text-[10px] text-slate-300">{new Date(t.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount}
                  </span>
                  <button onClick={() => deleteItem(t._id)} className="text-slate-200 hover:text-red-300">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;