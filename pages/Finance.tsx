import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Requisition, Transaction } from '../types';
import { DollarSign, Check, X, Download, TrendingUp, TrendingDown, Wallet, Building, Calendar, Plus, AlertCircle, FileCheck, Sprout, User, ArrowRight, Hash, Filter, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function Finance() {
  const { transactions, balance, requisitions, updateRequisitionStatus, user, addRequisition, addTransaction, purchaseOrders, approvePurchaseOrder, exports, farms, formatCurrency } = useApp();
  const [showReqModal, setShowReqModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [newReq, setNewReq] = useState<Partial<Requisition>>({ category: 'OTHER', priority: 'STANDARD' });
  const [newTx, setNewTx] = useState<Partial<Transaction>>({ type: 'INCOME', paymentMethod: 'CASH' });
  const [reportFilter, setReportFilter] = useState<'ALL' | 'TODAY' | 'MONTH' | 'YEAR'>('ALL');

  const filteredTransactions = transactions.filter(tx => {
    const d = new Date(tx.date);
    const now = new Date();
    if (reportFilter === 'TODAY') return d.toDateString() === now.toDateString();
    if (reportFilter === 'MONTH') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (reportFilter === 'YEAR') return d.getFullYear() === now.getFullYear();
    return true;
  }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleReqSubmit = () => {
    if(newReq.amount && newReq.reason) {
        addRequisition({
            ...newReq,
            id: Math.random().toString(),
            staffId: user?.id || 'unknown',
            staffName: user?.name || 'Unknown',
            status: 'PENDING',
            date: new Date().toISOString()
        } as Requisition);
        setShowReqModal(false);
        setNewReq({ category: 'OTHER', priority: 'STANDARD' });
    }
  };

  const handleTxSubmit = () => {
    if (newTx.amount && newTx.category) {
        addTransaction({
            ...newTx,
            id: Math.random().toString(),
            date: new Date().toISOString(),
            description: newTx.description || 'Manual Ledger Entry',
        } as Transaction);
        setShowTxModal(false);
        setNewTx({ type: 'INCOME', paymentMethod: 'CASH' });
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(10, 10, 26);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(0, 194, 255);
    doc.setFontSize(24);
    doc.text("NEXA AGRI", 15, 25);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`Financial Audit Report - ${reportFilter}`, 15, 33);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 15, 25, { align: 'right' });

    // Summary Box
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 50, pageWidth - 30, 30, 'F');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Summary:`, 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const totalIn = filteredTransactions.filter(t => t.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
    const totalOut = filteredTransactions.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
    
    doc.text(`Total Income: ${formatCurrency(totalIn)}`, 20, 70);
    doc.text(`Total Expenses: ${formatCurrency(totalOut)}`, pageWidth / 2, 70);
    doc.text(`Net Cashflow: ${formatCurrency(totalIn - totalOut)}`, 20, 76);

    // Table Header
    let y = 95;
    doc.setFillColor(50, 50, 50);
    doc.rect(15, y, pageWidth - 30, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("Date", 20, y + 7);
    doc.text("Description", 50, y + 7);
    doc.text("Category", 120, y + 7);
    doc.text("Amount", pageWidth - 20, y + 7, { align: 'right' });

    // Rows
    y += 10;
    doc.setTextColor(50, 50, 50);
    filteredTransactions.forEach((tx, i) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        if (i % 2 === 0) {
            doc.setFillColor(252, 252, 252);
            doc.rect(15, y, pageWidth - 30, 10, 'F');
        }
        doc.text(new Date(tx.date).toLocaleDateString(), 20, y + 7);
        doc.text(tx.description.substring(0, 35), 50, y + 7);
        doc.text(tx.category, 120, y + 7);
        const prefix = tx.type === 'INCOME' ? '+' : '-';
        doc.setTextColor(tx.type === 'INCOME' ? 0 : 200, tx.type === 'INCOME' ? 150 : 0, 0);
        doc.text(`${prefix}${formatCurrency(tx.amount)}`, pageWidth - 20, y + 7, { align: 'right' });
        doc.setTextColor(50, 50, 50);
        y += 10;
    });

    doc.save(`NexaAgri_Report_${reportFilter}_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Consolidated Liquidity</p>
             <h1 className="text-5xl font-black tracking-tighter">{formatCurrency(balance)}</h1>
             <div className="absolute right-4 top-4 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign size={160} /></div>
         </div>
         <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 text-slate-800 dark:text-white shadow-xl relative overflow-hidden group border border-slate-100 dark:border-slate-800">
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Operational Outflow</p>
             <h1 className="text-5xl font-black tracking-tighter text-red-600">{formatCurrency(transactions.filter(t => t.type === 'EXPENSE').reduce((a,b)=>a+b.amount, 0))}</h1>
             <div className="absolute right-4 bottom-4 opacity-5 group-hover:rotate-12 transition-transform"><TrendingDown size={120} /></div>
         </div>
         <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group hidden xl:block">
             <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Contract Asset Value</p>
             <h1 className="text-5xl font-black tracking-tighter">{formatCurrency(exports.reduce((a,b)=>a+b.totalValue, 0))}</h1>
             <div className="absolute right-4 bottom-4 opacity-10 group-hover:-rotate-12 transition-transform"><TrendingUp size={120} /></div>
         </div>
      </div>

      {user?.role === 'ADMIN' && requisitions.filter(r => r.status === 'PENDING').length > 0 && (
          <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4 flex items-center">
                  <AlertCircle size={14} className="mr-2 text-amber-500" /> Pending Authorizations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requisitions.filter(r => r.status === 'PENDING').map(req => (
                      <div key={req.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border-2 border-amber-500/20 shadow-sm relative overflow-hidden">
                          {req.priority === 'HIGH' && <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black uppercase px-4 py-1.5 rounded-bl-2xl tracking-widest">Urgent</div>}
                          <div className="flex justify-between items-start mb-4">
                              <div className="min-w-0 pr-2">
                                  <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{req.reason}</p>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{req.staffName} • {farms.find(f => f.id === req.farmId)?.name || 'General'}</p>
                              </div>
                              <span className="font-black text-amber-600 text-lg whitespace-nowrap">{formatCurrency(req.amount)}</span>
                          </div>
                          <div className="flex space-x-2">
                              <button onClick={() => updateRequisitionStatus(req.id, 'APPROVED')} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"><Check size={14} className="mr-1.5"/> Approve</button>
                              <button onClick={() => updateRequisitionStatus(req.id, 'REJECTED')} className="px-4 bg-slate-50 dark:bg-slate-700 border text-red-500 rounded-xl hover:bg-red-50 transition-colors"><X size={18}/></button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r dark:border-slate-800 flex items-center h-8">
                <Filter size={12} className="mr-2" /> Report Scope
              </div>
              {['ALL', 'TODAY', 'MONTH', 'YEAR'].map(k => (
                  <button key={k} onClick={() => setReportFilter(k as any)} className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all uppercase ${reportFilter === k ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}>
                    {k}
                  </button>
              ))}
          </div>
          <div className="flex space-x-3 w-full md:w-auto">
              <button 
                onClick={exportToPDF}
                className="flex items-center space-x-2 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                  <Download size={14} className="text-blue-500" />
                  <span>Generate Report</span>
              </button>
              <button onClick={() => setShowReqModal(true)} className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"><Plus size={14} className="text-emerald-600" /> <span>Request Fund</span></button>
              {user?.role === 'ADMIN' && <button onClick={() => setShowTxModal(true)} className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-slate-900 dark:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:opacity-90 active:scale-95 transition-all"><Plus size={14} /> <span>Manual Entry</span></button>}
          </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="font-black text-slate-900 dark:text-white text-xl tracking-tight uppercase tracking-widest flex items-center">
                <FileText size={22} className="mr-3 text-primary-500" /> Global Fiscal Ledger
            </h2>
            <div className="flex items-center space-x-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">{filteredTransactions.length} Audit Items Found</span>
            </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto scrollbar-thin">
            {filteredTransactions.length === 0 ? <div className="p-20 text-center text-slate-300 italic font-medium uppercase tracking-widest">No ledger data found for this period.</div> :
                filteredTransactions.map(tx => (
                    <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                        <div className="flex items-center space-x-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${tx.type === 'INCOME' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'}`}>
                                {tx.type === 'INCOME' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white text-base leading-tight mb-1">{tx.description}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center"><Calendar size={10} className="mr-1.5"/> {new Date(tx.date).toLocaleDateString()} • {tx.paymentMethod.replace('_', ' ')} • <span className="text-emerald-600 ml-1.5">{tx.category}</span></p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`font-black text-2xl tracking-tighter ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>{tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}</span>
                            {tx.reference && <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">REF: {tx.reference}</p>}
                        </div>
                    </div>
                ))
            }
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showTxModal && (
          <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[150] p-4 backdrop-blur-xl animate-in zoom-in duration-300">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] w-full max-w-xl shadow-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Ledger Record</h3>
                    <button onClick={() => setShowTxModal(false)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={20}/></button>
                  </div>
                  <div className="space-y-6">
                      <div className="flex space-x-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl shadow-inner border dark:border-slate-800">
                          <button onClick={() => setNewTx({...newTx, type: 'INCOME'})} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${newTx.type === 'INCOME' ? 'bg-white dark:bg-slate-800 shadow-md text-emerald-600' : 'text-slate-400'}`}>Credit (+)</button>
                          <button onClick={() => setNewTx({...newTx, type: 'EXPENSE'})} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${newTx.type === 'EXPENSE' ? 'bg-white dark:bg-slate-800 shadow-md text-red-600' : 'text-slate-400'}`}>Debit (-)</button>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Gross Value ({user?.preferredCurrency})</label>
                          <input type="number" className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-5 rounded-[1.5rem] font-black text-3xl outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" placeholder="0.00" onChange={e => setNewTx({...newTx, amount: parseFloat(e.target.value)})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                            <input className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm" placeholder="e.g. Rent, Bonus" onChange={e => setNewTx({...newTx, category: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Channel</label>
                            <select className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm" onChange={e => setNewTx({...newTx, paymentMethod: e.target.value as any})}>
                                <option value="CASH">Liquid Cash</option>
                                <option value="BANK_TRANSFER">Bank/SWIFT</option>
                                <option value="MOBILE_MONEY">Digital Wallet</option>
                            </select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Official Memo</label>
                          <input className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-5 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner font-medium text-lg" placeholder="Purpose of transaction..." onChange={e => setNewTx({...newTx, description: e.target.value})} />
                      </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-10">
                      <button onClick={() => setShowTxModal(false)} className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                      <button onClick={handleTxSubmit} className="px-10 py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl text-xs active:scale-95 transition-all">Post Entry</button>
                  </div>
              </div>
          </div>
      )}

      {/* Fund Requisition Modal */}
      {showReqModal && (
          <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[150] p-4 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] w-full max-w-2xl shadow-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Fund Requisition</h3>
                    <button onClick={() => setShowReqModal(false)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={20}/></button>
                  </div>
                  <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Project Sector</label>
                              <select className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm" onChange={e => setNewReq({...newReq, farmId: e.target.value})}>
                                  <option value="">General Org</option>
                                  {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                              </select>
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Priority Level</label>
                              <select className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm" onChange={e => setNewReq({...newReq, priority: e.target.value as any})}>
                                  <option value="STANDARD">Standard</option>
                                  <option value="HIGH">Critical / Urgent</option>
                              </select>
                          </div>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Requested Value ({user?.preferredCurrency})</label>
                          <input type="number" className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-5 rounded-[1.5rem] font-black text-3xl text-emerald-600 outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" placeholder="0.00" onChange={e => setNewReq({...newReq, amount: parseFloat(e.target.value)})} />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Business Narrative</label>
                          <textarea className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-5 rounded-2xl h-32 outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner font-medium text-lg leading-relaxed" placeholder="Detailed purpose for fund use..." onChange={e => setNewReq({...newReq, reason: e.target.value})} />
                      </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-10">
                      <button onClick={() => setShowReqModal(false)} className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-all">Cancel</button>
                      <button onClick={handleReqSubmit} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 text-xs active:scale-95 transition-all">Submit Request</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}