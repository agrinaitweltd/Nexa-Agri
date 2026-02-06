import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Download, Calendar, Filter, TrendingUp, DollarSign, Package } from 'lucide-react';

export default function Reports() {
  const { transactions, harvests, inventory, exports, user } = useApp();
  const [activeTab, setActiveTab] = useState<'FINANCIAL' | 'HARVEST' | 'INVENTORY'>('FINANCIAL');

  // --- Financial Data Prep ---
  const financialData = transactions.reduce((acc: any[], curr) => {
      const date = new Date(curr.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const existing = acc.find(i => i.date === date);
      if (existing) {
          if (curr.type === 'INCOME') existing.income += curr.amount;
          else existing.expense += curr.amount;
      } else {
          acc.push({
              date,
              income: curr.type === 'INCOME' ? curr.amount : 0,
              expense: curr.type === 'EXPENSE' ? curr.amount : 0
          });
      }
      return acc;
  }, []).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-10);

  // --- Harvest Data Prep ---
  const harvestData = harvests.reduce((acc: any[], curr) => {
      const existing = acc.find(i => i.name === curr.cropName);
      if (existing) {
          existing.value += curr.quantity;
      } else {
          acc.push({ name: curr.cropName, value: curr.quantity });
      }
      return acc;
  }, []);

  // --- Inventory Data Prep ---
  const inventoryData = inventory.map(i => ({
      name: i.productName,
      value: i.quantity
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const TabButton = ({ id, label, icon: Icon }: any) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-medium transition-colors ${
            activeTab === id 
            ? 'border-primary-600 text-primary-600' 
            : 'border-transparent text-slate-500 hover:text-slate-800'
        }`}
      >
          <Icon size={18} />
          <span>{label}</span>
      </button>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Reports & Analytics</h1>
              <p className="text-slate-500 dark:text-slate-400">Deep dive into your business performance.</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
              <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
                  <Calendar size={16} className="mr-2" /> This Month
              </button>
              <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 shadow-md shadow-primary-600/20">
                  <Download size={16} className="mr-2" /> Export PDF
              </button>
          </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex overflow-x-auto border-b border-slate-100 dark:border-slate-700">
              <TabButton id="FINANCIAL" label="Financials" icon={DollarSign} />
              <TabButton id="HARVEST" label="Production & Harvest" icon={TrendingUp} />
              <TabButton id="INVENTORY" label="Stock Levels" icon={Package} />
          </div>

          <div className="p-6">
              {/* FINANCIAL REPORTS */}
              {activeTab === 'FINANCIAL' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Income vs Expenses (Recent)</h3>
                              <div className="h-72">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={financialData}>
                                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                                          <YAxis stroke="#94a3b8" fontSize={12} />
                                          <Tooltip 
                                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                          />
                                          <Legend />
                                          <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                                          <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
                                      </BarChart>
                                  </ResponsiveContainer>
                              </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Profit Trend</h3>
                              <div className="h-72">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <AreaChart data={financialData}>
                                          <defs>
                                              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                              </linearGradient>
                                          </defs>
                                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                                          <YAxis stroke="#94a3b8" fontSize={12} />
                                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                          <Tooltip />
                                          <Area type="monotone" dataKey="income" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIncome)" />
                                      </AreaChart>
                                  </ResponsiveContainer>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* HARVEST REPORTS */}
              {activeTab === 'HARVEST' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Production Volume by Crop</h3>
                              <div className="h-72">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                          <Pie
                                              data={harvestData}
                                              cx="50%"
                                              cy="50%"
                                              innerRadius={60}
                                              outerRadius={100}
                                              fill="#8884d8"
                                              paddingAngle={5}
                                              dataKey="value"
                                              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                          >
                                              {harvestData.map((entry, index) => (
                                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                              ))}
                                          </Pie>
                                          <Tooltip />
                                          <Legend verticalAlign="bottom" height={36}/>
                                      </PieChart>
                                  </ResponsiveContainer>
                              </div>
                          </div>
                          
                          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
                              <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Production Insights</h3>
                              <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                                  Based on your current data, <strong>{harvestData.sort((a,b) => b.value - a.value)[0]?.name}</strong> is your top producing crop.
                              </p>
                              <div className="space-y-3">
                                  {harvestData.map((h, i) => (
                                      <div key={i} className="flex justify-between items-center text-sm border-b border-blue-200 dark:border-blue-800/50 pb-2 last:border-0">
                                          <span className="font-medium text-slate-700 dark:text-slate-300">{h.name}</span>
                                          <span className="font-bold text-slate-800 dark:text-white">{h.value.toLocaleString()} units</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* INVENTORY REPORTS */}
              {activeTab === 'INVENTORY' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                      <div className="h-80 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Current Stock Levels</h3>
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={inventoryData} layout="vertical" margin={{ left: 20 }}>
                                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                  <XAxis type="number" stroke="#94a3b8" />
                                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                                  <Tooltip cursor={{fill: 'transparent'}} />
                                  <Bar dataKey="value" fill="#8884d8" barSize={20} radius={[0, 4, 4, 0]}>
                                      {inventoryData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))}
                                  </Bar>
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}