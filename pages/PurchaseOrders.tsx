import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PurchaseOrder, POItem, Client, InventoryItem } from '../types';
import { ShoppingBag, Plus, Search, CheckCircle, DollarSign, Package, ChevronDown, Trash2, Calendar, User, Briefcase, FileText, X, AlertTriangle, Download, RefreshCw, Wallet } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function PurchaseOrders() {
  const { purchaseOrders, addPurchaseOrder, updatePurchaseOrderStatus, payPurchaseOrder, clients, user, formatCurrency, inventory } = useApp();
  
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'CLIENTS'>('ORDERS');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [searchTerm, setSearchTerm] = useState('');

  const [orderItems, setOrderItems] = useState<POItem[]>([]);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>('');
  const [newItemDetails, setNewItemDetails] = useState({ quantity: 1, unitPrice: 0 });
  const [newOrder, setNewOrder] = useState<Partial<PurchaseOrder>>({ supplierId: '', amountPaid: 0 });

  const buyers = clients.filter(c => c.type === 'BUYER');
  const selectedStock = inventory.find(i => i.id === selectedInventoryId);

  const handleAddItem = () => {
      if (selectedStock && newItemDetails.quantity > 0 && newItemDetails.unitPrice > 0) {
          if (newItemDetails.quantity > selectedStock.quantity) {
              alert(`INSUFFICIENT STOCK: Only ${selectedStock.quantity} ${selectedStock.unit} available for ${selectedStock.productName}.`);
              return;
          }
          const item: POItem = {
              productName: `${selectedStock.productName} (${selectedStock.grade})`,
              quantity: newItemDetails.quantity,
              unit: selectedStock.unit,
              unitPrice: newItemDetails.unitPrice,
              totalPrice: newItemDetails.quantity * newItemDetails.unitPrice
          };
          setOrderItems([...orderItems, item]);
          setSelectedInventoryId('');
          setNewItemDetails({ quantity: 1, unitPrice: 0 });
      }
  };

  const removeItem = (idx: number) => setOrderItems(orderItems.filter((_, i) => i !== idx));

  const handleCreateOrder = async () => {
      if (newOrder.supplierId && orderItems.length > 0) {
          const client = clients.find(c => c.id === newOrder.supplierId);
          const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
          
          const createdOrder = {
              id: 'po-' + Math.random().toString(36).substr(2, 9),
              supplierId: newOrder.supplierId,
              supplierName: client?.name || 'Client',
              date: new Date().toISOString(),
              expectedDate: newOrder.expectedDate,
              status: user?.role === 'STAFF' ? 'PENDING_APPROVAL' : 'ORDERED',
              items: orderItems,
              totalAmount,
              amountPaid: newOrder.amountPaid || 0,
              paymentStatus: (newOrder.amountPaid || 0) >= totalAmount ? 'PAID' : ((newOrder.amountPaid || 0) > 0 ? 'PARTIAL' : 'UNPAID'),
              orderNumber: `SLS-${Math.floor(100000 + Math.random() * 900000)}`,
              notes: newOrder.notes
          } as PurchaseOrder;

          const success = await addPurchaseOrder(createdOrder, newOrder.amountPaid || 0, paymentMethod);
          
          if (success) {
              setShowOrderModal(false);
              setOrderItems([]);
              if (confirm("Sale booked successfully! Download the PDF invoice?")) {
                  generateInvoice(createdOrder);
              }
          }
      }
  };

  const generateInvoice = (order: PurchaseOrder) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      doc.setFillColor(10, 10, 26);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      doc.setTextColor(0, 194, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.text("NEXA", 15, 25);
      doc.setTextColor(0, 223, 130);
      doc.text("AGRI", 45, 25);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text("Global Agribusiness Management Platform", 15, 33);
      
      doc.setFontSize(12);
      doc.text(`INVOICE: ${order.orderNumber}`, pageWidth - 15, 25, { align: 'right' });
      doc.setFontSize(10);
      doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, pageWidth - 15, 33, { align: 'right' });

      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      doc.text("FROM:", 15, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(user?.companyName || 'NexaAgri Unit', 15, 65);
      doc.text(user?.companyAddress || '', 15, 70);

      doc.setFont('helvetica', 'bold');
      doc.text("BILL TO:", pageWidth / 2, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(order.supplierName, pageWidth / 2, 65);

      let y = 90;
      doc.setFillColor(245, 245, 245);
      doc.rect(15, y, pageWidth - 30, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text("Description", 20, y + 7);
      doc.text("Qty", 110, y + 7, { align: 'right' });
      doc.text("Rate", 145, y + 7, { align: 'right' });
      doc.text("Total", pageWidth - 20, y + 7, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      y += 10;
      order.items.forEach((item, index) => {
          doc.text(item.productName, 20, y + 8);
          doc.text(`${item.quantity} ${item.unit}`, 110, y + 8, { align: 'right' });
          doc.text(formatCurrency(item.unitPrice), 145, y + 8, { align: 'right' });
          doc.text(formatCurrency(item.totalPrice), pageWidth - 20, y + 8, { align: 'right' });
          y += 12;
      });

      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.text("GRAND TOTAL:", 120, y);
      doc.text(formatCurrency(order.totalAmount), pageWidth - 20, y, { align: 'right' });

      doc.save(`Invoice_${order.orderNumber}.pdf`);
  };

  const filteredOrders = purchaseOrders.filter(po => 
    po.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    po.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none">Local Sales Manifests</h1>
            <p className="text-slate-500 mt-3 font-medium">Domestic trade fulfillment synchronized with warehouse stock and organizational ledger.</p>
        </div>
        <div className="flex space-x-2">
            <button onClick={() => setActiveTab('ORDERS')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ORDERS' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border dark:bg-slate-800'}`}>Sales Records</button>
            <button onClick={() => setActiveTab('CLIENTS')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'CLIENTS' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border dark:bg-slate-800'}`}>Active Buyers</button>
        </div>
      </div>

      {activeTab === 'ORDERS' && (
          <>
            <div className="flex flex-col lg:flex-row justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input className="w-full pl-14 pr-4 py-4 border-none bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] outline-none font-bold shadow-inner" placeholder="Find manifest by ID or Client..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <button onClick={() => setShowOrderModal(true)} className="w-full lg:w-auto bg-emerald-600 text-white px-10 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center"><Plus size={18} className="mr-2" /> Book New Sale</button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {filteredOrders.length === 0 ? (
                    <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-[3.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <ShoppingBag size={64} className="mx-auto text-slate-200 dark:text-slate-800 mb-6" />
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em]">No Sales Manifests Found</p>
                    </div>
                ) : filteredOrders.slice().reverse().map(po => (
                    <div key={po.id} className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all relative group flex flex-col">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                            <div>
                                <div className="flex items-center space-x-4 mb-2">
                                    <h3 className="font-black text-3xl text-slate-900 dark:text-white tracking-tighter leading-none">{po.supplierName}</h3>
                                    <span className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-[8px] px-3 py-1.5 rounded-full font-black uppercase tracking-[0.3em] border border-slate-100 dark:border-slate-700">{po.orderNumber}</span>
                                </div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center"><Calendar size={14} className="mr-2 text-emerald-500"/> Booked: {new Date(po.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-3 self-end md:self-auto">
                                <button onClick={() => generateInvoice(po)} className="p-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl text-slate-500 hover:text-emerald-600 transition-all shadow-sm" title="Print Invoice"><Download size={20} /></button>
                                <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${po.status === 'RECEIVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-800'}`}>{po.status === 'RECEIVED' ? 'Finalized & Delivered' : po.status.replace('_', ' ')}</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 md:p-10 mb-10 border border-slate-50 dark:border-slate-800 shadow-inner">
                            <div className="space-y-6">
                                {po.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 group/item">
                                        <div className="flex flex-col">
                                            <span className="text-slate-800 dark:text-slate-200 font-black text-xl tracking-tight leading-none mb-1">{item.productName}</span>
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Weight: {item.quantity} {item.unit} • Unit @ {formatCurrency(item.unitPrice)}</span>
                                        </div>
                                        <span className="font-black text-slate-900 dark:text-white text-2xl tracking-tighter">{formatCurrency(item.totalPrice)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10 flex justify-between items-end font-black border-t border-slate-100 dark:border-slate-800 pt-10">
                                <div>
                                    <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400">Total Aggregate Valuation</span>
                                    <p className="text-5xl tracking-tighter text-emerald-600 mt-2 leading-none">{formatCurrency(po.totalAmount)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Status</p>
                                    <p className={`text-sm font-black uppercase tracking-[0.2em] ${po.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}`}>{po.paymentStatus}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border shadow-sm flex flex-col justify-center">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Receipted</span>
                                    <span className="text-xl font-black text-emerald-600">{formatCurrency(po.amountPaid)}</span>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border shadow-sm flex flex-col justify-center">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Outstanding</span>
                                    <span className={`text-xl font-black ${po.totalAmount - po.amountPaid > 0 ? 'text-red-500' : 'text-slate-400'}`}>{formatCurrency(po.totalAmount - po.amountPaid)}</span>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4">
                                {po.paymentStatus !== 'PAID' && user?.role === 'ADMIN' && (
                                    <button onClick={() => { setSelectedOrder(po); setPaymentAmount(po.totalAmount - po.amountPaid); setShowPayModal(true); }} className="flex-1 lg:flex-none px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center shadow-xl"><DollarSign size={16} className="mr-2" /> Record Remittance</button>
                                )}
                                {po.status === 'ORDERED' && (
                                    <button onClick={() => updatePurchaseOrderStatus(po.id, 'RECEIVED')} className="flex-1 lg:flex-none px-10 py-5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center">Confirm Fulfillment</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </>
      )}

      {/* UPDATE PAYMENT MODAL */}
      {showPayModal && selectedOrder && (
          <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[150] p-4 backdrop-blur-xl animate-in zoom-in duration-300">
              <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] w-full max-w-xl shadow-2xl transition-all border border-white/10">
                   <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Record Remittance</h3>
                        <p className="text-slate-500 mt-2 font-medium">Update financial progress for sale {selectedOrder.orderNumber}.</p>
                    </div>
                    <button onClick={() => setShowPayModal(false)} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={24}/></button>
                  </div>
                  <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl shadow-inner border border-slate-100 dark:border-slate-800">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Manifest Balance</p>
                                 <p className="font-black text-2xl text-slate-900 dark:text-white">{formatCurrency(selectedOrder.totalAmount - selectedOrder.amountPaid)}</p>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl shadow-inner border border-emerald-100 dark:border-emerald-800/50">
                                 <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Settlement</p>
                                 <p className="font-black text-2xl text-emerald-600">{formatCurrency(selectedOrder.amountPaid)}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] px-4 block mb-2">Remittance Amount ($)</label>
                                <input type="number" className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-7 rounded-[2rem] font-black text-4xl outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" value={paymentAmount} onChange={e => setPaymentAmount(parseFloat(e.target.value))} />
                                <div className="flex justify-between px-4 mt-2">
                                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Max Remittance: {formatCurrency(selectedOrder.totalAmount - selectedOrder.amountPaid)}</span>
                                     <button onClick={() => setPaymentAmount(selectedOrder.totalAmount - selectedOrder.amountPaid)} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Full Settle</button>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] px-4 block mb-2">Remittance Channel</label>
                                <select className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-6 rounded-[2rem] font-black uppercase outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm tracking-widest appearance-none" onChange={e => setPaymentMethod(e.target.value)} value={paymentMethod}>
                                    <option value="BANK_TRANSFER">Corporate SWIFT / Bank Transfer</option>
                                    <option value="MOBILE_MONEY">Digital Wallet / Momo</option>
                                    <option value="CASH">Liquid Cash</option>
                                </select>
                            </div>
                        </div>
                  </div>
                  <div className="flex justify-end gap-6 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                      <button onClick={() => setShowPayModal(false)} className="px-10 py-5 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-50 rounded-3xl transition-all">Cancel</button>
                      <button onClick={() => { payPurchaseOrder(selectedOrder.id, paymentAmount, paymentMethod); setShowPayModal(false); }} className="px-14 py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all text-xs flex items-center justify-center">Authorize Remittance <RefreshCw size={18} className="ml-3" /></button>
                  </div>
              </div>
          </div>
      )}

      {/* CREATE ORDER MODAL */}
      {showOrderModal && (
          <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[110] p-4 backdrop-blur-xl animate-in zoom-in duration-300 overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 rounded-[4rem] w-full max-w-4xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[95vh]">
                  <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase tracking-tighter">Sale Manifest Construction</h3>
                        <p className="text-slate-500 mt-3 font-medium text-sm">Allocate authorized inventory lots to a legal sales agreement.</p>
                    </div>
                    <button onClick={() => setShowOrderModal(false)} className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={24}/></button>
                  </div>
                  <div className="p-10 space-y-10 overflow-y-auto scrollbar-thin flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] px-4 block">Select Buyer Identity</label>
                              <select className="w-full border-none bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] dark:text-white font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm tracking-widest uppercase" value={newOrder.supplierId} onChange={e => setNewOrder({...newOrder, supplierId: e.target.value})}>
                                  <option value="">-- Choose Authorized Buyer --</option>
                                  {buyers.map(b => <option key={b.id} value={b.id}>{b.name} ({b.country})</option>)}
                              </select>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] px-4 block">Target Fulfillment Date</label>
                              <input type="date" className="w-full border-none bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] dark:text-white font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" onChange={e => setNewOrder({...newOrder, expectedDate: e.target.value})} />
                          </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/80 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 px-4 flex items-center"><Package size={14} className="mr-2"/> Stock Allocation Chain</h4>
                          <div className="grid grid-cols-12 gap-4 mb-8">
                              <div className="col-span-12 md:col-span-6">
                                  <select className="w-full bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] text-xs font-black dark:text-white border-none outline-none shadow-sm" value={selectedInventoryId} onChange={e => setSelectedInventoryId(e.target.value)}>
                                      <option value="">-- Associate Warehouse Lot --</option>
                                      {inventory.filter(i => i.quantity > 0).map(i => <option key={i.id} value={i.id}>{i.productName} ({i.grade}) • {i.quantity} {i.unit} available</option>)}
                                  </select>
                              </div>
                              <div className="col-span-6 md:col-span-2">
                                  <input type="number" className="w-full bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] text-xs font-black dark:text-white border-none outline-none shadow-sm text-center" placeholder="Qty" value={newItemDetails.quantity} onChange={e => setNewItemDetails({...newItemDetails, quantity: parseFloat(e.target.value)})} />
                              </div>
                              <div className="col-span-6 md:col-span-3">
                                  <input type="number" className="w-full bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] text-xs font-black dark:text-white border-none outline-none shadow-sm" placeholder="Rate / Unit" value={newItemDetails.unitPrice || ''} onChange={e => setNewItemDetails({...newItemDetails, unitPrice: parseFloat(e.target.value)})} />
                              </div>
                              <button onClick={handleAddItem} className="col-span-12 md:col-span-1 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[1.5rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl py-6 md:py-0"><Plus size={24}/></button>
                          </div>
                          
                          {orderItems.length > 0 && (
                              <div className="space-y-4">
                                  {orderItems.map((item, idx) => (
                                      <div key={idx} className="flex justify-between items-center p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm group border border-transparent hover:border-emerald-500/20 transition-all">
                                          <div>
                                            <span className="font-black text-slate-800 dark:text-white text-lg uppercase tracking-tight">{item.productName}</span>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Allocation: {item.quantity} {item.unit} • @{formatCurrency(item.unitPrice)}</p>
                                          </div>
                                          <div className="flex items-center space-x-6">
                                              <span className="font-black text-emerald-600 text-2xl tracking-tighter">{formatCurrency(item.totalPrice)}</span>
                                              <button onClick={() => removeItem(idx)} className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"><Trash2 size={20} /></button>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>

                      <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-12 opacity-10"><DollarSign size={160} /></div>
                          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 flex items-center relative z-10"><Wallet size={14} className="mr-2 text-emerald-500"/> Financial Architecture</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 block">Immediate Deposit Receipted ($)</label>
                                        <input type="number" className="w-full border-none bg-white/5 backdrop-blur-md p-6 rounded-[2rem] text-white font-black text-4xl placeholder:text-white/20 outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" placeholder="0.00" onChange={e => setNewOrder({...newOrder, amountPaid: parseFloat(e.target.value)})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 block">Settlement Channel</label>
                                        <select className="w-full border-none bg-white/5 backdrop-blur-md p-5 rounded-[1.5rem] text-white font-black text-xs uppercase tracking-widest outline-none shadow-inner appearance-none" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                                            <option value="BANK_TRANSFER">Bank SWIFT</option>
                                            <option value="MOBILE_MONEY">Momo Remit</option>
                                            <option value="CASH">Liquid Cash</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Aggregate Manifest Valuation</p>
                                    <p className="text-6xl font-black tracking-tighter leading-none text-emerald-500">{formatCurrency(orderItems.reduce((acc, i) => acc + i.totalPrice, 0))}</p>
                                    <p className="text-[9px] font-bold text-slate-500 mt-4 uppercase tracking-[0.2em] italic">Linked to Global Ledger automatically</p>
                                </div>
                          </div>
                      </div>
                  </div>
                  <div className="p-10 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-6 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                      <button onClick={() => setShowOrderModal(false)} className="px-10 py-5 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 rounded-3xl transition-all">Discard Draft</button>
                      <button onClick={handleCreateOrder} className="px-14 py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all text-xs flex items-center justify-center">Authorize & Inject Manifest <RefreshCw size={18} className="ml-3" /></button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}