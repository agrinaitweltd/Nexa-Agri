
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM as any;
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, Package, AlertCircle, Tractor, FileStack, MessageSquare,
  Activity, DollarSign, Settings, Plus, X, ArrowUp, ArrowDown, CheckSquare, Wallet, ChevronRight, ChevronLeft, Check, Ban, BarChart3, Globe, Zap, ArrowRight, ShieldCheck, Warehouse, Briefcase,
  Sprout, FileText, Users, CloudRain, Wind, Sun, PieChart as PieChartIcon, ListChecks, History, CheckCircle2, Ship, Smartphone, UserPlus, Palette, ArrowUpRight, Clock
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { DashboardWidget, WidgetType, DashboardTheme } from '../types';

// --- ENHANCED WIDGET COMPONENTS ---

const FinancialStatsWidget = () => {
  const { transactions, formatCurrency, balance } = useApp();
  const revenue = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

  const chartData = transactions.length > 0 ? [
      { name: 'Income', value: revenue },
      { name: 'Expense', value: expenses }
  ] : [];

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 h-full transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><DollarSign size={100}/></div>
        <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center text-xs uppercase tracking-[0.2em] relative z-10">
            <Wallet size={18} className="mr-2 text-emerald-500"/> Financial Standing
        </h3>
        
        <div className="space-y-6 relative z-10">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Available Capital</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter truncate">{formatCurrency(balance)}</p>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                    <div className="flex items-center text-emerald-600 mb-1">
                        <ArrowUpRight size={14} className="mr-1" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Inflow</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 dark:text-white truncate">{formatCurrency(revenue)}</p>
                </div>
                <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-800/50">
                    <div className="flex items-center text-rose-600 mb-1">
                        <ArrowDown size={14} className="mr-1" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Outflow</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 dark:text-white truncate">{formatCurrency(expenses)}</p>
                </div>
             </div>
        </div>

        {transactions.length > 0 && (
            <div className="h-24 w-full mt-6 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: -30 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} style={{fontSize: '9px', fontWeight: 900, fill: '#94a3b8', textTransform: 'uppercase'}} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" barSize={12} radius={[0, 10, 10, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f43f5e'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )}
    </div>
  );
};

const StockDistributionWidget = () => {
  const { inventory } = useApp();
  
  const stockData = inventory.map(item => ({
    name: item.productName,
    value: item.quantity
  })).slice(0, 5);

  const COLORS = ['#10b981', '#3b82f6', '#6366f1', '#f43f5e', '#f59e0b'];

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 h-full transition-all relative overflow-hidden group">
      <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center text-xs uppercase tracking-[0.2em]">
          <Warehouse size={18} className="mr-2 text-blue-500"/> Stock Distribution
      </h3>
      
      {inventory.length > 0 ? (
        <div className="flex items-center h-48">
          <div className="flex-1 h-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={stockData}
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {stockData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {stockData.map((item, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                <span className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-tighter">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-slate-300 italic text-xs border-2 border-dashed rounded-3xl">
          No Inventory Data
        </div>
      )}
    </div>
  );
};

const QuickActionsWidget = () => {
    const navigate = useNavigate();
    const actions = [
        { label: 'Register Unit', icon: Sprout, path: '/app/farms', color: 'bg-emerald-600' },
        { label: 'Corporate Vault', icon: FileStack, path: '/app/vault', color: 'bg-blue-600' },
        { label: 'Launch Mission', icon: Ship, path: '/app/exports', color: 'bg-indigo-600' },
        { label: 'Team Portal', icon: MessageSquare, path: '/app/communication', color: 'bg-rose-600' },
    ];

    return (
        <div className="bg-slate-900 dark:bg-white p-8 rounded-[2.5rem] shadow-xl h-full transition-all flex flex-col justify-between border border-white/5 dark:border-slate-100">
             <h3 className="font-bold text-white dark:text-slate-900 mb-6 flex items-center text-xs uppercase tracking-[0.2em] opacity-80">
                <Settings size={18} className="mr-2" /> Action Dashboard
            </h3>
            <div className="grid grid-cols-2 gap-4">
                {actions.map((act, i) => (
                    <button 
                        key={i}
                        onClick={() => navigate(act.path)}
                        className="bg-white/10 dark:bg-slate-50 hover:scale-105 dark:hover:bg-slate-100 p-5 rounded-[2rem] flex flex-col items-center justify-center space-y-3 transition-all active:scale-95 group shadow-sm"
                    >
                        <div className={`p-3 rounded-2xl text-white ${act.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                            <act.icon size={20} />
                        </div>
                        <span className="text-[9px] font-black text-white dark:text-slate-800 uppercase tracking-widest text-center">{act.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const RecentActivityWidget = () => {
    const { exports, harvests, notifications } = useApp();
    
    // Mix and match recent events
    const activities = [
        ...exports.map(e => ({ title: `Mission Launched: ${e.shipmentNumber}`, time: e.date, icon: Ship, color: 'text-indigo-500' })),
        ...harvests.map(h => ({ title: `Yield Logged: ${h.cropName}`, time: h.date, icon: Sprout, color: 'text-emerald-500' })),
    ].sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 h-full relative overflow-hidden">
            <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center text-xs uppercase tracking-[0.2em]">
                <Activity size={18} className="mr-2 text-amber-500"/> Activity Stream
            </h3>
            <div className="space-y-5">
                {activities.length === 0 ? (
                    <div className="py-12 text-center text-slate-300 italic text-xs uppercase font-bold tracking-widest">No Recent Activity</div>
                ) : activities.map((act, i) => (
                    <div key={i} className="flex items-start space-x-4">
                        <div className={`mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${act.color}`}>
                            <act.icon size={14} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">{act.title}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{new Date(act.time).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AVAILABLE_WIDGETS: { type: WidgetType, title: string, defaultTitle: string, desc: string }[] = [
    { type: 'FINANCIAL_STATS', title: 'Financials', defaultTitle: 'Financial Overview', desc: 'Cash flow tracking' },
    { type: 'PRODUCTION_OVERVIEW', title: 'Stock Distribution', defaultTitle: 'Stock Health', desc: 'Inventory visualization' },
    { type: 'RECENT_ACTIVITY', title: 'Activity Logs', defaultTitle: 'Recent Activity', desc: 'Sync of all operations' },
    { type: 'QUICK_ACTIONS', title: 'Toolbox', defaultTitle: 'Quick Actions', desc: 'Workflow navigation' },
    { type: 'ACTIVATION_REQUESTS', title: 'Pending Audits', defaultTitle: 'Activation Pipeline', desc: 'Account verification audit' },
];

const THEME_OPTIONS: { id: DashboardTheme, color: string }[] = [
    { id: 'emerald', color: 'bg-emerald-500' },
    { id: 'blue', color: 'bg-blue-500' },
    { id: 'indigo', color: 'bg-indigo-500' },
    { id: 'rose', color: 'bg-rose-500' },
    { id: 'amber', color: 'bg-amber-500' },
    { id: 'slate', color: 'bg-slate-700' },
];

export default function Dashboard() {
  const { user, updateDashboardWidgets, updateDashboardTheme, pendingSignups } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  
  const defaultWidgets: DashboardWidget[] = [
    { id: 'w1', type: 'FINANCIAL_STATS', title: 'Financials' },
    { id: 'w2', type: 'QUICK_ACTIONS', title: 'Toolbox' },
    { id: 'w3', type: 'PRODUCTION_OVERVIEW', title: 'Stock Distribution' },
    { id: 'w4', type: 'RECENT_ACTIVITY', title: 'Activity Logs' },
  ];

  const myWidgets = user?.dashboardWidgets || defaultWidgets;

  const handleRemoveWidget = (id: string) => {
      updateDashboardWidgets(myWidgets.filter(w => w.id !== id));
  };

  const handleAddWidget = (type: WidgetType) => {
      const def = AVAILABLE_WIDGETS.find(w => w.type === type);
      const newWidget: DashboardWidget = {
          id: Math.random().toString(),
          type,
          title: def?.defaultTitle || 'Widget'
      };
      updateDashboardWidgets([...myWidgets, newWidget]);
  };

  const handleMoveWidget = (index: number, direction: 'LEFT' | 'RIGHT') => {
      const newWidgets = [...myWidgets];
      if (direction === 'LEFT' && index > 0) {
          [newWidgets[index], newWidgets[index - 1]] = [newWidgets[index - 1], newWidgets[index]];
      } else if (direction === 'RIGHT' && index < newWidgets.length - 1) {
          [newWidgets[index], newWidgets[index + 1]] = [newWidgets[index + 1], newWidgets[index]];
      }
      updateDashboardWidgets(newWidgets);
  };

  const renderWidgetContent = (type: WidgetType) => {
      switch(type) {
          case 'FINANCIAL_STATS': return <FinancialStatsWidget />;
          case 'QUICK_ACTIONS': return <QuickActionsWidget />;
          case 'ACTIVATION_REQUESTS': return <ActivationRequestsWidget />;
          case 'PRODUCTION_OVERVIEW': return <StockDistributionWidget />;
          case 'RECENT_ACTIVITY': return <RecentActivityWidget />;
          default: return <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">{type} Module (Empty)</div>;
      }
  };

  return (
    <div className="space-y-8 pb-20 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{user?.role === 'ADMIN' ? 'Corporate Command' : 'Operational Hub'}</h1>
            <div className="flex items-center space-x-2 text-slate-400">
                <Clock size={14} className="text-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Real-time synchronization active • {new Date().toLocaleDateString()}</p>
            </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
             <div className="relative">
                <button 
                    onClick={() => setShowThemePicker(!showThemePicker)}
                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:scale-105 transition-all shadow-sm"
                    title="Change Dashboard Theme"
                >
                    <Palette size={20} className="text-slate-500" />
                </button>
                {showThemePicker && (
                    <div className="absolute right-0 mt-3 p-3 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 grid grid-cols-3 gap-2 z-50 animate-in zoom-in duration-200">
                        {THEME_OPTIONS.map(opt => (
                            <button 
                                key={opt.id} 
                                onClick={() => { updateDashboardTheme(opt.id); setShowThemePicker(false); }}
                                className={`w-8 h-8 rounded-full ${opt.color} ${user?.dashboardTheme === opt.id ? 'ring-4 ring-slate-200 dark:ring-slate-600 scale-90' : 'hover:scale-110'} transition-all`}
                            />
                        ))}
                    </div>
                )}
             </div>
             
             <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center transition-all shadow-lg active:scale-95 ${isEditing ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'}`}
             >
                {isEditing ? <Check size={18} className="mr-2" /> : <Settings size={18} className="mr-2" />}
                {isEditing ? 'Commit Configuration' : 'Customize Hub'}
             </button>
        </div>
      </div>

      {isEditing && (
        <div className="p-6 bg-slate-100 dark:bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Available Hub Components</p>
             <div className="flex flex-wrap justify-center gap-2">
                {AVAILABLE_WIDGETS.filter(aw => !myWidgets.find(mw => mw.type === aw.type)).map(aw => (
                    <button key={aw.type} onClick={() => handleAddWidget(aw.type)} className="px-5 py-2.5 bg-white dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm hover:scale-105 active:scale-95 transition-all text-slate-600 dark:text-slate-300">
                        + {aw.title}
                    </button>
                ))}
                {AVAILABLE_WIDGETS.filter(aw => !myWidgets.find(mw => mw.type === aw.type)).length === 0 && (
                    <p className="text-xs text-slate-400 font-medium italic">All available hub components are currently active.</p>
                )}
             </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {myWidgets.map((widget, index) => (
              <div 
                key={widget.id} 
                className={`relative transition-all duration-300 ${isEditing ? 'ring-4 ring-emerald-500/20 rounded-[2.5rem] p-2 bg-slate-100/30 scale-[0.98]' : ''} ${widget.type === 'FINANCIAL_STATS' || widget.type === 'QUICK_ACTIONS' ? 'xl:col-span-2' : 'col-span-1'}`}
              >
                  {isEditing && (
                      <div className="absolute -top-4 -right-2 flex space-x-1 z-10 animate-in fade-in zoom-in">
                          <button onClick={() => handleMoveWidget(index, 'LEFT')} className="bg-white p-3 rounded-2xl shadow-xl border hover:text-emerald-600 transition-all"><ChevronLeft size={16} /></button>
                          <button onClick={() => handleMoveWidget(index, 'RIGHT')} className="bg-white p-3 rounded-2xl shadow-xl border hover:text-emerald-600 transition-all"><ChevronRight size={16} /></button>
                          <button onClick={() => handleRemoveWidget(widget.id)} className="bg-red-500 text-white p-3 rounded-2xl shadow-xl hover:bg-red-600 transition-all"><X size={16} /></button>
                      </div>
                  )}
                  {renderWidgetContent(widget.type)}
              </div>
          ))}
      </div>
    </div>
  );
}

const ActivationRequestsWidget = () => {
    const { pendingSignups, approveSignup, rejectSignup } = useApp();
    if (!pendingSignups) return null;
    
    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border-2 border-emerald-500/20 h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><UserPlus size={100}/></div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center text-xs uppercase tracking-[0.2em] relative z-10">
                <ShieldCheck size={18} className="mr-2 text-emerald-500"/> Verification Queue
            </h3>
            <div className="space-y-4 relative z-10 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                {pendingSignups.length === 0 ? (
                    <div className="py-12 text-center">
                        <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2 opacity-30" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Queue Clear</p>
                    </div>
                ) : (
                    pendingSignups.map(req => (
                        <div key={req.id} className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div className="min-w-0 pr-2">
                                    <p className="font-black text-sm text-slate-900 dark:text-white truncate">{req.userName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate">{req.userEmail}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                <button onClick={() => approveSignup(req.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center transition-all shadow-md active:scale-95">Verify</button>
                                <button onClick={() => rejectSignup(req.id)} className="px-4 bg-white dark:bg-slate-700 border text-red-500 rounded-xl hover:bg-red-50 transition-colors"><Ban size={16}/></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
