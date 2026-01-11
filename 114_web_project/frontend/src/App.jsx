import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('餐飲');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // 篩選月份狀態 (格式: YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  // 編輯模式狀態
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const categories = type === 'expense' ? ['餐飲', '交通', '購物', '娛樂', '其他'] : ['薪資', '獎金', '投資', '其他'];
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const fetchItems = async () => {
    const res = await axios.get('http://localhost:5000/api/transactions');
    setTransactions(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  useEffect(() => { fetchItems(); }, []);

  // 1. 篩選當月資料
  const filteredData = transactions.filter(t => t.date.startsWith(selectedMonth));

  // 2. 準備圖表數據
  const monthlyStats = [
    { name: '收入', value: filteredData.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) },
    { name: '支出', value: filteredData.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) }
  ];

  const pieData = categories.map(cat => ({
    name: cat,
    value: filteredData.filter(t => t.type === 'expense' && t.category === cat).reduce((sum, t) => sum + t.amount, 0)
  })).filter(d => d.value > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/transactions', { title, amount: Number(amount), type, category, date: new Date(date) });
    setTitle(''); setAmount(''); fetchItems();
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/api/transactions/${id}`, { title: editTitle, amount: Number(editAmount) });
    setEditId(null); fetchItems();
  };

  const deleteItem = async (id) => {
    if (window.confirm("確定刪除？")) {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      fetchItems();
    }
  };

  return (
    <div className="min-h-screen p-4 bg-slate-50 text-slate-700 pb-20 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">月份數據分析</h1>

        {/* --- 月份切換與統計 --- */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm">
          <input 
            type="month" 
            className="outline-none font-medium text-lg bg-transparent"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <div className="text-right">
            <p className="text-xs text-slate-400">當月結餘</p>
            <p className={`text-xl font-bold ${monthlyStats[0].value - monthlyStats[1].value >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              ${monthlyStats[0].value - monthlyStats[1].value}
            </p>
          </div>
        </div>

        {/* --- 圖表區 --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-3xl shadow-sm h-64 border border-slate-50">
            <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase">收支對比</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm h-64 border border-slate-50">
            <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase">支出分佈</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {/* --- 新增表單 --- */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
              <button type="button" onClick={() => {setType('expense'); setCategory('餐飲');}} className={`flex-1 py-2 rounded-xl text-sm transition ${type === 'expense' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>支出</button>
              <button type="button" onClick={() => {setType('income'); setCategory('薪資');}} className={`flex-1 py-2 rounded-xl text-sm transition ${type === 'income' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>收入</button>
            </div>
            <input className="w-full p-4 mb-3 bg-slate-50 rounded-2xl outline-none" placeholder="項目內容" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <div className="grid grid-cols-2 gap-2 mb-3">
              <input className="p-4 bg-slate-50 rounded-2xl outline-none" placeholder="金額" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} />
              <select className="p-4 bg-slate-50 rounded-2xl outline-none text-sm" value={category} onChange={(e)=>setCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <input type="date" className="w-full p-4 mb-4 bg-slate-50 rounded-2xl outline-none text-sm" value={date} onChange={(e) => setDate(e.target.value)} />
            <button className={`w-full p-4 rounded-2xl font-bold text-white transition shadow-lg ${type === 'expense' ? 'bg-slate-900 shadow-slate-200' : 'bg-emerald-500 shadow-emerald-100'}`}>新增紀錄</button>
          </form>

          {/* --- 列表與編輯 --- */}
          <div className="space-y-3">
            {filteredData.map(t => (
              <div key={t._id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50 transition-all hover:shadow-md">
                {editId === t._id ? (
                  <div className="flex flex-col gap-3">
                    <input className="p-3 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-200" value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} />
                    <input className="p-3 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-200" type="number" value={editAmount} onChange={(e)=>setEditAmount(e.target.value)} />
                    <div className="flex gap-2">
                      <button onClick={()=>handleUpdate(t._id)} className="flex-1 bg-slate-900 text-white p-3 rounded-xl text-sm">更新</button>
                      <button onClick={()=>setEditId(null)} className="flex-1 bg-slate-100 p-3 rounded-xl text-sm">取消</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center group">
                    <div onClick={() => {setEditId(t._id); setEditTitle(t.title); setEditAmount(t.amount);}} className="cursor-pointer">
                      <p className="font-semibold text-slate-800">{t.title}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount}
                      </span>
                      <button onClick={() => deleteItem(t._id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all">✕</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filteredData.length === 0 && <p className="text-center text-slate-400 py-10">這個月還沒有紀錄喔！</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;