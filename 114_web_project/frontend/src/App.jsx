import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis } from 'recharts';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('餐飲');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // 介面狀態控制
  const [showStats, setShowStats] = useState(false); // 控制側邊欄
  const [showAll, setShowAll] = useState(false);     // 控制顯示全部
  const [filterDate, setFilterDate] = useState('');   // 日期挑選
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [editId, setEditId] = useState(null);

  const categories = type === 'expense' ? ['餐飲', '交通', '購物', '娛樂', '其他'] : ['薪資', '獎金', '投資', '其他'];
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const fetchItems = async () => {
    const res = await axios.get('http://localhost:5000/api/transactions');
    setTransactions(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  useEffect(() => { fetchItems(); }, []);

  // --- 資料過濾邏輯 ---
  // 1. 根據日期挑選或顯示全部
  let displayList = transactions;
  if (filterDate) {
    displayList = transactions.filter(t => t.date.startsWith(filterDate));
  } else if (!showAll) {
    displayList = transactions.slice(0, 3); // 僅顯示近期3筆
  }

  // 2. 統計數據 (側邊欄用)
  const filteredByMonth = transactions.filter(t => t.date.startsWith(selectedMonth));
  const monthlyStats = [
    { name: '收入', value: filteredByMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) },
    { name: '支出', value: filteredByMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) }
  ];
  const pieData = categories.map(cat => ({
    name: cat, value: filteredByMonth.filter(t => t.type === 'expense' && t.category === cat).reduce((sum, t) => sum + t.amount, 0)
  })).filter(d => d.value > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/transactions', { title, amount: Number(amount), type, category, date: new Date(date) });
    setTitle(''); setAmount(''); fetchItems();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans flex overflow-hidden">
      
      {/* --- 左側統計抽屜 (Sidebar) --- */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${showStats ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">數據分析</h2>
            <button onClick={() => setShowStats(false)} className="text-slate-400 text-2xl">✕</button>
          </div>
          
          <input type="month" className="w-full p-3 mb-6 bg-slate-50 rounded-xl outline-none" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />

          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase">收支對比</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats}><XAxis dataKey="name" hide /><Tooltip cursor={{fill: 'transparent'}} /><Bar dataKey="value" radius={[10, 10, 0, 0]}>{monthlyStats.map((e,i)=><Cell key={i} fill={i===0?'#10b981':'#ef4444'}/>)}</Bar></BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase">支出佔比</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">{pieData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* --- 主畫面 --- */}
      <main className="flex-1 p-6 h-screen overflow-y-auto">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => setShowStats(true)} className="bg-white p-2 rounded-lg shadow-sm text-sm font-medium">📊 分析統計</button>
            <h1 className="text-xl font-bold">簡潔記帳</h1>
            <div className="w-20"></div> {/* 佔位平衡 */}
          </div>

          {/* 新增表單 */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 text-xs font-bold">
              <button type="button" onClick={() => setType('expense')} className={`flex-1 py-2 rounded-xl ${type === 'expense' ? 'bg-white' : 'text-slate-400'}`}>支出</button>
              <button type="button" onClick={() => setType('income')} className={`flex-1 py-2 rounded-xl ${type === 'income' ? 'bg-white' : 'text-slate-400'}`}>收入</button>
            </div>
            <input className="w-full p-4 mb-3 bg-slate-50 rounded-2xl outline-none" placeholder="項目" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <div className="grid grid-cols-2 gap-2 mb-3">
              <input className="p-4 bg-slate-50 rounded-2xl outline-none" placeholder="金額" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} />
              <select className="p-4 bg-slate-50 rounded-2xl outline-none text-sm" value={category} onChange={(e)=>setCategory(e.target.value)}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <input type="date" className="w-full p-4 mb-4 bg-slate-50 rounded-2xl outline-none text-sm" value={date} onChange={(e) => setDate(e.target.value)} />
            <button className={`w-full p-4 rounded-2xl font-bold text-white ${type === 'expense' ? 'bg-slate-900' : 'bg-emerald-500'}`}>儲存紀錄</button>
          </form>

          {/* 紀錄顯示區 */}
          <div className="flex justify-between items-end mb-4 px-2">
            <h2 className="font-bold">{filterDate ? `${filterDate} 的紀錄` : (showAll ? '全部紀錄' : '近期紀錄')}</h2>
            <div className="flex gap-2 items-center">
              <input type="date" className="bg-transparent text-[10px] outline-none border-b border-slate-200" onChange={(e) => {setFilterDate(e.target.value); setShowAll(true);}} />
              <button onClick={() => {setShowAll(!showAll); setFilterDate('');}} className="text-[10px] text-blue-500 font-bold">{showAll ? '收起' : '顯示全部'}</button>
            </div>
          </div>

          <div className="space-y-3">
            {displayList.map(t => (
              <div key={t._id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm text-slate-700">{t.title} <span className="text-[8px] bg-slate-100 px-2 py-0.5 rounded text-slate-400">{t.category}</span></p>
                  <p className="text-[9px] text-slate-300 font-mono">{new Date(t.date).toLocaleDateString()}</p>
                </div>
                <span className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 點擊側邊欄外區域關閉 */}
      {showStats && <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setShowStats(false)}></div>}
    </div>
  );
}
export default App;