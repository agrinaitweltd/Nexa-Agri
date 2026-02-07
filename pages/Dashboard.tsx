import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  DollarSign, Wallet, Warehouse, Activity, Settings, Check, Palette, Clock, ChevronRight, ChevronLeft, X, ShieldCheck, UserPlus, CheckCircle2, Ban
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { WidgetType, DashboardTheme, DashboardWidget } from '../types';

export default function Dashboard() {
  const { user, companyData, inventory, transactions, formatCurrency, balance, updateCloudData } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  // Derived data
  const revenue = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
  
  const stockData = inventory.map(item => ({
    name: item.productName,
    value: item.quantity
  })).slice(0, 5);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {companyData?.company_name || user?.companyName || 'Operational Hub'}
            </h1>
            <div className="flex items-center space-x-2 text-slate-400 mt-2">
                <Clock size={14} className="text-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Cloud Synchronized • {new Date().toLocaleDateString()}</p>
            </div>
        </div>
        
        <button 
           onClick={() => setIsEditing(!isEditing)}
           className="px-8 py-3.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-800 shadow-lg active:scale-95 transition-all"
        >
           {isEditing ? 'Save Layout' : 'Customize Hub'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* Financial Overview */}
        <div className="xl:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5"><DollarSign size={120}/></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Aggregate Liquid Capital</p>
             <h2 className="text-5xl font-black tracking-tighter mb-10">{formatCurrency(balance)}</h2>
             <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                     <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Inflow</p>
                     <p className="font-bold">{formatCurrency(revenue)}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                     <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest mb-1">Outflow</p>
                     <p className="font-bold">{formatCurrency(expenses)}</p>
                 </div>
             </div>
        </div>

        {/* Stock Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Inventory</p>
                <Warehouse size={18} className="text-blue-500" />
            </div>
            <div className="h-32">
                {stockData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={stockData} innerRadius={30} outerRadius={45} dataKey="value" stroke="none">
                                {stockData.map((_, i) => <Cell key={i} fill={['#10b981','#3b82f6','#6366f1','#f43f5e'][i%4]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : <div className="h-full flex items-center justify-center text-[10px] font-black text-slate-300 uppercase italic">No Stock Data</div>}
            </div>
            <p className="text-center font-black text-slate-900 dark:text-white">{inventory.length} Stock Units</p>
        </div>

        {/* Sync Status */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                 <CheckCircle2 size={32} />
             </div>
             <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px] mb-2">Cloud Integrity</h3>
             <p className="text-xs text-slate-400 font-medium">All local nodes synchronized with Supabase main-chain.</p>
        </div>
      </div>
    </div>
  );
}