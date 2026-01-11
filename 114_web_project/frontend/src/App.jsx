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
  
  const [showStats, setShowStats] = useState(false); 
  const [showAll, setShowAll] = useState(false);     
  const [filterDate, setFilterDate] = useState('');   
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); 
  
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const categories = type === 'expense' ? ['餐飲', '交通', '購物', '娛樂', '其他'] : ['薪資', '獎金', '投資', '其他'];
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(res.data);
    } catch (err) { console.error("讀取失敗", err); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !date) return alert("請完整填寫項目、金額與日期");
    try {
      await axios.post('http://localhost:5000/api/transactions', { 
        title, amount: Number(amount), type, category, date: new Date(date) 
      });
      setTitle(''); setAmount(''); fetchItems();
    } catch (err) { alert("儲存失敗"); }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/transactions/${id}`, { title: editTitle, amount: Number(editAmount) });
      setEditId(null); fetchItems();
    } catch (err) { alert("更新失敗"); }
  };

  const deleteItem = async (id) => {
    if (window.confirm("確定刪除此紀錄？")) {
      try {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`);
        fetchItems();
      } catch (err) { alert("刪除失敗"); }
    }
  };

  let displayList = [];
  if (filterDate) {
    displayList = transactions.filter(t => t.date.startsWith(filterDate)).sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (!showAll) {
    displayList = [...transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  } else {
    displayList = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const filteredByMonth = transactions.filter(t => t.date.startsWith(selectedMonth));
  const monthlyStats = [
    { name: '收入', value: filteredByMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) },
    { name: '支出', value: filteredByMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) }
  ];
  const pieData = categories.map(cat => ({
    name: cat, value: filteredByMonth.filter(t => t.type === 'expense' && t.category === cat).reduce((sum, t) => sum + t.amount, 0)
  })).filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans flex overflow-hidden">
      
      {/* 側邊統計抽屜 */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${showStats ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-800">數據分析</h2>
            <button onClick={() => setShowStats(false)} className="text-slate-300 hover:text-slate-600">✕</button>
          </div>
          <input type="month" className="w-full p-3 mb-6 bg-slate-50 rounded-xl outline-none border border-slate-100 font-bold" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
          <div className="mb-8">
            <h3 className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">當月收支對比</h3>
            <div className="h-40"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyStats}><XAxis dataKey="name" hide /><Tooltip cursor={{fill: 'transparent'}} /><Bar dataKey="value" radius={[10, 10, 0, 0]}>{monthlyStats.map((e,i)=><Cell key={i} fill={i===0?'#10b981':'#ef4444'}/>)}</Bar></BarChart></ResponsiveContainer></div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">支出分類佔比</h3>
            <div className="h-40"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">{pieData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
          </div>
        </div>
      </div>

      <main className="flex-1 p-6 h-screen overflow-y-auto relative">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => setShowStats(true)} className="bg-white px-4 py-2 rounded-xl shadow-sm text-xs font-bold border border-slate-100 hover:shadow-md transition">📊 分析</button>
            {/* 名稱更改為「記帳小幫手」 */}
            <h1 className="text-xl font-black tracking-tighter text-slate-800">記帳小幫手</h1>
            <div className="w-12"></div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 text-[10px] font-black uppercase tracking-widest">
              <button type="button" onClick={() => setType('expense')} className={`flex-1 py-2 rounded-xl transition ${type === 'expense' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>支出</button>
              <button type="button" onClick={() => setType('income')} className={`flex-1 py-2 rounded-xl transition ${type === 'income' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>收入</button>
            </div>
            <input className="w-full p-4 mb-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-slate-100 transition" placeholder="項目內容" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <div className="grid grid-cols-2 gap-2 mb-3">
              <input className="p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-slate-100 transition" placeholder="金額" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} />
              <select className="p-4 bg-slate-50 rounded-2xl outline-none text-xs font-bold" value={category} onChange={(e)=>setCategory(e.target.value)}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <input type="date" className="w-full p-4 mb-4 bg-slate-50 rounded-2xl outline-none text-xs font-bold text-slate-500" value={date} onChange={(e) => setDate(e.target.value)} />
            <button className={`w-full p-4 rounded-2xl font-bold text-white shadow-lg transition transform active:scale-95 ${type === 'expense' ? 'bg-slate-900 shadow-slate-200' : 'bg-emerald-500 shadow-emerald-100'}`}>儲存紀錄</button>
          </form>

          <div className="flex justify-between items-end mb-4 px-2">
            <div>
              <h2 className="font-bold text-lg">{filterDate ? '日期搜尋' : (showAll ? '歷史紀錄' : '近期新增')}</h2>
              {!showAll && !filterDate && <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest font-mono">Top 3 Recent Entries</p>}
            </div>
            <div className="flex gap-2 items-center">
              <input type="date" className="bg-transparent text-[10px] outline-none border-b border-slate-200 text-slate-400" onChange={(e) => {setFilterDate(e.target.value); setShowAll(true);}} />
              {/* 按鈕更改為「顯示全部」 */}
              <button onClick={() => {setShowAll(!showAll); setFilterDate('');}} className="text-[10px] text-indigo-500 font-black uppercase hover:underline tracking-tight">
                {showAll ? '收起' : '顯示全部'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {displayList.map(t => (
              <div key={t._id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-50 flex justify-between items-center group hover:shadow-md transition-all">
                {editId === t._id ? (
                  <div className="flex flex-col gap-2 w-full">
                    <input className="p-2 bg-slate-50 rounded-lg outline-none text-sm border border-slate-100" value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} />
                    <input className="p-2 bg-slate-50 rounded-lg outline-none text-sm border border-slate-100" type="number" value={editAmount} onChange={(e)=>setEditAmount(e.target.value)} />
                    <div className="flex gap-2"><button onClick={()=>handleUpdate(t._id)} className="flex-1 bg-slate-900 text-white p-2 rounded-lg text-[10px] font-bold">確認</button><button onClick={()=>setEditId(null)} className="flex-1 bg-slate-100 p-2 rounded-lg text-[10px] font-bold">取消</button></div>
                  </div>
                ) : (
                  <>
                    <div onClick={() => {setEditId(t._id); setEditTitle(t.title); setEditAmount(t.amount);}} className="cursor-pointer">
                      <p className="font-bold text-sm text-slate-700">{t.title} <span className="text-[8px] bg-slate-50 px-2 py-0.5 rounded text-slate-400 ml-1 uppercase">{t.category}</span></p>
                      <p className="text-[9px] text-slate-300 font-mono mt-1">{new Date(t.date).toLocaleDateString()} {!showAll && !filterDate && `• Added at ${new Date(t.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-black text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>{t.type === 'income' ? '+' : '-'}${t.amount}</span>
                      <button onClick={() => deleteItem(t._id)} className="opacity-0 group-hover:opacity-100 text-slate-200 hover:text-rose-500 transition-all">✕</button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {displayList.length === 0 && <div className="text-center py-10"><p className="text-slate-300 text-xs font-bold uppercase tracking-widest">No Records Found</p></div>}
          </div>
        </div>
      </main>

      {showStats && <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-40" onClick={() => setShowStats(false)}></div>}
    </div>
  );
}

export default App;