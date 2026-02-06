import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExportOrder } from '../types';
import { FileText, Ship, CheckCircle, AlertCircle, Plus, UploadCloud, User, DollarSign, Download, Phone, Mail, MapPin, Anchor, Landmark, Globe, Warehouse, FileCheck, FileArchive, Eye, X, Truck, Navigation, ChevronDown, Wallet, Calendar, Plane, Activity, Clock, Box, ShoppingBag, ArrowRight, RefreshCw } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function Exports() {
  const { exports, createExport, updateExportPayment, updateExportStatus, inventory, clients, user, formatCurrency } = useApp();
  
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  
  const [selectedExport, setSelectedExport] = useState<ExportOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [missionType, setMissionType] = useState<'EXPORT' | 'LOCAL' | null>(null);

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');

  const [newOrder, setNewOrder] = useState<Partial<ExportOrder>>({
    unit: 'tonnes',
    status: 'PENDING',
    amountPaid: 0,
    pricePerUnit: 0,
    shippingCost: 0,
    transportMethod: 'SEA',
    transitPorts: '',
    originLocation: '',
    portOfExit: '',
    destinationPort: '',
    destinationCountry: ''
  });

  const [initialPayment, setInitialPayment] = useState<number>(0);
  const [selectedStockId, setSelectedStockId] = useState<string>('');

  const calculateTotal = (qty: number, price: number, ship: number) => {
      return (qty * price) + ship;
  };

  const handleTypeSelect = (type: 'EXPORT' | 'LOCAL') => {
      setMissionType(type);
      setShowTypeSelector(false);
      setShowModal(true);
      setNewOrder(prev => ({ 
          ...prev, 
          missionType: type,
          transportMethod: type === 'EXPORT' ? 'SEA' : 'ROAD' 
      }));
  };

  const handleCreate = async () => {
    setError(null);
    if (!selectedStockId) {
        setError("Please select source stock from current inventory.");
        return;
    }
    
    const stockItem = inventory.find(i => i.id === selectedStockId);
    if (!stockItem) return;

    if (!newOrder.quantity || newOrder.quantity <= 0) {
        setError("Please specify a valid shipment quantity.");
        return;
    }

    if (newOrder.quantity > stockItem.quantity) {
        setError(`INSUFFICIENT STOCK: Available: ${stockItem.quantity} ${stockItem.unit}`);
        return;
    }

    if (!newOrder.buyerName || !newOrder.originLocation) {
        setError("Missing basic mission parameters (Buyer or Origin Hub).");
        return;
    }

    const totalValue = calculateTotal(newOrder.quantity || 0, newOrder.pricePerUnit || 0, newOrder.shippingCost || 0);
    const order = {
        ...newOrder,
        id: Math.random().toString(),
        missionType,
        productName: stockItem.productName,
        grade: stockItem.grade,
        date: new Date().toISOString(),
        totalValue,
        amountPaid: initialPayment,
        shipmentNumber: `${missionType === 'EXPORT' ? 'EXP' : 'LOC'}-${Math.floor(Math.random() * 900000) + 100000}`
    } as ExportOrder;

    const success = await createExport(order, initialPayment, paymentMethod);
    
    if (success) {
        setShowModal(false);
        setInitialPayment(0);
        setMissionType(null);
        setNewOrder({ unit: 'tonnes', status: 'PENDING', amountPaid: 0, pricePerUnit: 0, shippingCost: 0, transportMethod: 'SEA' });

        if (confirm(`${missionType === 'EXPORT' ? 'Export' : 'Supply'} mission launched! Download manifest/invoice?`)) {
            generateMissionPDF(order);
        }
    }
  };

  const generateMissionPDF = (order: ExportOrder) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFillColor(10, 10, 26);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setTextColor(0, 194, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text("NEXA", 15, 25);
    doc.setTextColor(0, 223, 130);
    doc.text("AGRI", 45, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`${order.missionType === 'EXPORT' ? 'International Trade' : 'Local Supply'} Manifest`, 15, 33);
    
    doc.setFontSize(12);
    doc.text(`REF: ${order.shipmentNumber}`, pageWidth - 15, 25, { align: 'right' });
    
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.text("PROVIDER:", 15, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(user?.companyName || 'NexaAgri Unit', 15, 70);

    doc.setFont('helvetica', 'bold');
    doc.text("RECEIVER:", pageWidth / 2, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(order.buyerName, pageWidth / 2, 70);

    let y = 90;
    doc.setFillColor(245, 245, 245);
    doc.rect(15, y, pageWidth - 30, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text("Description", 20, y + 7);
    doc.text("Qty", 110, y + 7, { align: 'right' });
    doc.text("Rate", 145, y + 7, { align: 'right' });
    doc.text("Total", pageWidth - 20, y + 7, { align: 'right' });

    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`${order.productName} (${order.grade})`, 20, y + 8);
    doc.text(`${order.quantity} ${order.unit}`, 110, y + 8, { align: 'right' });
    doc.text(formatCurrency(order.pricePerUnit || 0), 145, y + 8, { align: 'right' });
    doc.text(formatCurrency((order.quantity || 0) * (order.pricePerUnit || 0)), pageWidth - 20, y + 8, { align: 'right' });

    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.text("GRAND TOTAL:", 120, y);
    doc.text(formatCurrency(order.totalValue), pageWidth - 20, y, { align: 'right' });

    doc.save(`Mission_${order.shipmentNumber}.pdf`);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Mission Control</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Unified command for Global Export and Local Supply chains.</p>
        </div>
        <button 
            onClick={() => setShowTypeSelector(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center"
        >
            <Plus size={18} className="mr-2" />
            <span>Initialize Mission</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-20">
        {exports.length === 0 ? (
             <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                <Ship size={64} className="mx-auto text-slate-200 dark:text-slate-700 mb-6" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em]">No Supply Missions Logged</p>
             </div>
        ) : exports.slice().reverse().map(order => (
          <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 p-8 transition-all hover:shadow-2xl hover:border-emerald-500 group relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  {order.missionType === 'EXPORT' ? <Globe size={120} /> : <Truck size={120} />}
              </div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                      <div className="flex items-center space-x-2">
                           <h3 className="font-bold text-xl text-slate-900 dark:text-white truncate max-w-[200px]">{order.buyerName}</h3>
                           <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${order.missionType === 'EXPORT' ? 'border-blue-500 text-blue-500' : 'border-emerald-500 text-emerald-500'}`}>
                               {order.missionType || 'EXPORT'}
                           </span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center space-x-2 mt-1 font-bold uppercase tracking-widest">
                          <MapPin size={10} className="text-emerald-500" />
                          <span>{order.destinationCountry || order.buyerCountry}</span>
                          <span>•</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded tracking-tighter">{order.shipmentNumber}</span>
                      </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => generateMissionPDF(order)} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-emerald-600 transition-all shadow-sm"><Download size={18} /></button>
                    <select 
                        className={`pl-4 pr-10 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm outline-none cursor-pointer border-none transition-all appearance-none bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300`}
                        value={order.status}
                        onChange={(e) => updateExportStatus(order.id, e.target.value as any)}
                    >
                        <option value="PENDING">Processing</option>
                        <option value="IN_TRANSIT">In-Transit</option>
                        <option value="DELIVERED">Complete</option>
                        <option value="PAID">Settled</option>
                    </select>
                  </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Port</p>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{order.destinationPort || 'Local Hub'}</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Provider</p>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{order.transportProvider || 'Internal'}</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Origin</p>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{order.originLocation || 'Dispatch'}</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Weight</p>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{order.quantity} {order.unit}</span>
                  </div>
              </div>

              <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-6">
                  <div className="flex justify-between items-end mb-4">
                      <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Mission Value</p>
                          <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{formatCurrency(order.totalValue)}</p>
                      </div>
                      <div className="text-right">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Settled</p>
                          <p className="text-lg font-bold text-emerald-600 leading-none mt-1">{formatCurrency(order.amountPaid)}</p>
                      </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (order.amountPaid / order.totalValue) * 100)}%` }} />
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2">Outstanding: {formatCurrency(order.totalValue - order.amountPaid)}</p>
              </div>

              <div className="flex space-x-3 relative z-10">
                  <button 
                      onClick={() => setSelectedExport(order)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest shadow-sm transition-all"
                  >
                      <FileArchive size={14} />
                      <span>Documentation</span>
                  </button>
                  
                  {user?.role === 'ADMIN' && order.amountPaid < order.totalValue && (
                       <button 
                          onClick={() => { setSelectedExport(order); setPaymentAmount(order.totalValue - order.amountPaid); setShowPayModal(true); }}
                          className="flex-1 flex items-center justify-center space-x-2 bg-emerald-600 text-white py-3.5 rounded-2xl hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                      >
                          <DollarSign size={14} />
                          <span>Record Payment</span>
                      </button>
                  )}
              </div>
          </div>
        ))}
      </div>

      {/* TYPE SELECTOR MODAL */}
      {showTypeSelector && (
          <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[120] p-6 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="w-full max-w-4xl space-y-10">
                  <div className="text-center space-y-4">
                      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Mission Scoping</h2>
                      <p className="text-slate-400 text-lg font-medium">Do you want to create an Export Plan or a Local Supply Plan?</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <button 
                        onClick={() => handleTypeSelect('EXPORT')}
                        className="group bg-slate-900 border border-white/10 p-12 rounded-[4rem] text-left hover:border-nexa-blue hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-2xl relative overflow-hidden"
                      >
                          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Globe size={160}/></div>
                          <div className="w-16 h-16 bg-nexa-blue rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl"><Ship size={32}/></div>
                          <h3 className="text-3xl font-black text-white mb-4">Export Plan</h3>
                          <p className="text-slate-400 font-medium mb-8 leading-relaxed">International trade manifest with maritime logistics, customs parameters, and SWIFT settlement logic.</p>
                          <div className="flex items-center text-nexa-blue font-black uppercase text-[10px] tracking-widest">Initialize Global Chain <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" /></div>
                      </button>

                      <button 
                        onClick={() => handleTypeSelect('LOCAL')}
                        className="group bg-slate-900 border border-white/10 p-12 rounded-[4rem] text-left hover:border-nexa-green hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-2xl relative overflow-hidden"
                      >
                          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Truck size={160}/></div>
                          <div className="w-16 h-16 bg-nexa-green rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl"><Box size={32}/></div>
                          <h3 className="text-3xl font-black text-white mb-4">Local Supply Plan</h3>
                          <p className="text-slate-400 font-medium mb-8 leading-relaxed">Domestic fulfillment for regional clients, optimized for ground transport and standard invoice settlement.</p>
                          <div className="flex items-center text-nexa-green font-black uppercase text-[10px] tracking-widest">Initialize Domestic Chain <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" /></div>
                      </button>
                  </div>

                  <div className="text-center pt-8">
                      <button onClick={() => setShowTypeSelector(false)} className="text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Discard Planning Phase</button>
                  </div>
              </div>
          </div>
      )}

      {/* CREATE MISSION MODAL */}
      {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4 md:p-8 backdrop-blur-md overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-6xl shadow-2xl transition-all border border-white/5 my-auto flex flex-col max-h-[95vh]">
                  <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                      <div>
                          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{missionType === 'EXPORT' ? 'Export' : 'Supply'} Mission Builder</h2>
                          <p className="text-slate-500 dark:text-slate-400 font-medium">Define logistical routing and stock allocation for this trade manifest.</p>
                      </div>
                      <button onClick={() => {setShowModal(false); setMissionType(null);}} className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={24}/></button>
                  </div>
                  
                  <div className="p-8 md:p-10 space-y-12 overflow-y-auto scrollbar-thin">
                      {error && (
                          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-6 rounded-[1.5rem] flex items-center space-x-4 text-sm font-bold animate-in slide-in-from-top-4 duration-300 border border-red-100 dark:border-red-900/50">
                              <AlertCircle size={24} />
                              <span>{error}</span>
                          </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                          <div className="space-y-10">
                              <section className="space-y-6">
                                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center border-b dark:border-slate-800 pb-3">
                                      <Box size={14} className="mr-2 text-primary-500" /> Core Asset Allocation
                                  </h3>
                                  <div className="space-y-4">
                                      <div className="space-y-2">
                                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Warehouse Lot Allocation</label>
                                          <select 
                                              className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/20 font-black dark:text-white shadow-inner text-sm uppercase tracking-widest"
                                              onChange={e => setSelectedStockId(e.target.value)}
                                              value={selectedStockId}
                                          >
                                              <option value="">-- Choose Stock Lot --</option>
                                              {inventory.map(item => (
                                                  <option key={item.id} value={item.id}>{item.productName} ({item.grade}) • {item.quantity} {item.unit} available</option>
                                              ))}
                                          </select>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Shipment Quantity</label>
                                              <input 
                                                  type="number"
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/20 font-black dark:text-white shadow-inner"
                                                  placeholder="0.00"
                                                  value={newOrder.quantity || ''}
                                                  onChange={e => setNewOrder({...newOrder, quantity: parseFloat(e.target.value)})}
                                              />
                                          </div>
                                          <div className="space-y-2">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Rate Per Unit ($)</label>
                                              <input 
                                                  type="number"
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/20 font-black dark:text-white shadow-inner"
                                                  placeholder="0.00"
                                                  value={newOrder.pricePerUnit || ''}
                                                  onChange={e => setNewOrder({...newOrder, pricePerUnit: parseFloat(e.target.value)})}
                                              />
                                          </div>
                                      </div>
                                  </div>
                              </section>

                              <section className="space-y-6">
                                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center border-b dark:border-slate-800 pb-3">
                                      <User size={14} className="mr-2 text-primary-500" /> Buyer Identity
                                  </h3>
                                  <div className="space-y-4">
                                      <div className="space-y-2">
                                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Recipient Entity Name</label>
                                          <input 
                                              className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/20 font-bold dark:text-white shadow-inner"
                                              placeholder="e.g. Global Exports Ltd"
                                              value={newOrder.buyerName || ''}
                                              onChange={e => setNewOrder({...newOrder, buyerName: e.target.value})}
                                          />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Contact Email</label>
                                              <input 
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder="logistics@buyer.com"
                                                  value={newOrder.buyerEmail || ''}
                                                  onChange={e => setNewOrder({...newOrder, buyerEmail: e.target.value})}
                                              />
                                          </div>
                                          <div className="space-y-2">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Phone (Optional)</label>
                                              <input 
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder="+256..."
                                                  value={newOrder.buyerPhone || ''}
                                                  onChange={e => setNewOrder({...newOrder, buyerPhone: e.target.value})}
                                              />
                                          </div>
                                      </div>
                                  </div>
                              </section>
                          </div>

                          <div className="space-y-10">
                              <section className="space-y-6">
                                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center border-b dark:border-slate-800 pb-3">
                                      <Navigation size={14} className="mr-2 text-blue-500" /> Logistical Route & Manifest
                                  </h3>
                                  <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Origin Hub / Location</label>
                                              <input 
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder="e.g. Masaka Hub"
                                                  value={newOrder.originLocation || ''}
                                                  onChange={e => setNewOrder({...newOrder, originLocation: e.target.value, originWarehouse: e.target.value})}
                                              />
                                          </div>
                                          <div className="space-y-2">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Port of Exit</label>
                                              <input 
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder="e.g. Mombasa Port"
                                                  value={newOrder.portOfExit || ''}
                                                  onChange={e => setNewOrder({...newOrder, portOfExit: e.target.value})}
                                              />
                                          </div>
                                      </div>
                                      <div className="space-y-2">
                                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Transit Ports / Hubs</label>
                                          <input 
                                              className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner"
                                              placeholder="e.g. Dubai, Rotterdam"
                                              value={newOrder.transitPorts || ''}
                                              onChange={e => setNewOrder({...newOrder, transitPorts: e.target.value})}
                                          />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Destination Port</label>
                                              <input 
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder="e.g. Antwerp Port"
                                                  value={newOrder.destinationPort || ''}
                                                  onChange={e => setNewOrder({...newOrder, destinationPort: e.target.value})}
                                              />
                                          </div>
                                          <div className="space-y-2">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Destination Country</label>
                                              <input 
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder="e.g. Belgium"
                                                  value={newOrder.destinationCountry || ''}
                                                  onChange={e => setNewOrder({...newOrder, destinationCountry: e.target.value, buyerCountry: e.target.value})}
                                              />
                                          </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Transport Mode</label>
                                              <select 
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 font-black dark:text-white shadow-inner uppercase tracking-widest text-xs"
                                                  value={newOrder.transportMethod}
                                                  onChange={e => setNewOrder({...newOrder, transportMethod: e.target.value as any})}
                                              >
                                                  <option value="SEA">Maritime (Sea)</option>
                                                  <option value="AIR">Aviation (Air)</option>
                                                  <option value="ROAD">Ground (Road)</option>
                                                  <option value="RAIL">Ground (Rail)</option>
                                              </select>
                                          </div>
                                          <div className="space-y-2">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Est. Logistics Cost ($)</label>
                                              <input 
                                                  type="number"
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder="0.00"
                                                  value={newOrder.shippingCost || ''}
                                                  onChange={e => setNewOrder({...newOrder, shippingCost: parseFloat(e.target.value)})}
                                              />
                                          </div>
                                      </div>
                                  </div>
                              </section>
                          </div>
                      </div>

                      <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-12 opacity-10"><DollarSign size={200} /></div>
                          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center justify-between">
                              <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 flex items-center"><Wallet size={14} className="mr-2"/> Financial Audit Summary</p>
                                  <div className="space-y-1">
                                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aggregate Mission Value</p>
                                      <p className="text-6xl font-black tracking-tighter leading-none">{formatCurrency(calculateTotal(newOrder.quantity || 0, newOrder.pricePerUnit || 0, newOrder.shippingCost || 0))}</p>
                                  </div>
                              </div>
                              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 w-full md:w-auto">
                                  <label className="text-[10px] font-black text-primary-500 uppercase tracking-widest block mb-4">Immediate Advance Settlement</label>
                                  <div className="flex items-center bg-white/10 rounded-2xl px-6 py-4 shadow-inner">
                                      <span className="text-xl font-black text-white/40 mr-4">$</span>
                                      <input 
                                          type="number" 
                                          className="w-full md:w-48 bg-transparent border-none font-black text-white text-3xl outline-none" 
                                          value={initialPayment} 
                                          onChange={e => setInitialPayment(parseFloat(e.target.value))} 
                                      />
                                  </div>
                                  <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-wider italic">Reflected in organization ledger immediately.</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="p-8 md:p-10 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-6 shrink-0">
                      <button onClick={() => {setShowModal(false); setMissionType(null);}} className="px-10 py-5 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 rounded-3xl transition-all">Discard Plan</button>
                      <button 
                        onClick={handleCreate} 
                        className="px-14 py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                          Deploy Mission Manifest
                      </button>
                  </div>
              </div>
          </div>
      )}
      
      {/* RECORD PAYMENT MODAL */}
      {showPayModal && selectedExport && (
          <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[150] p-4 backdrop-blur-xl animate-in zoom-in duration-300">
              <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] w-full max-w-2xl shadow-2xl border border-white/10">
                   <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Record Settlement</h3>
                        <p className="text-slate-500 mt-2 font-medium">Update financial progress for mission {selectedExport.shipmentNumber}.</p>
                    </div>
                    <button onClick={() => setShowPayModal(false)} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={24}/></button>
                  </div>
                  
                  <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border shadow-inner">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Value</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(selectedExport.totalValue)}</p>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 shadow-inner">
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Received</p>
                                <p className="text-xl font-black text-emerald-600">{formatCurrency(selectedExport.amountPaid)}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] px-4 block">Installment Amount ($)</label>
                                <input 
                                    type="number" 
                                    className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-7 rounded-[2rem] font-black text-4xl outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" 
                                    value={paymentAmount} 
                                    onChange={e => setPaymentAmount(parseFloat(e.target.value))} 
                                />
                                <div className="flex justify-between px-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max Remittance: {formatCurrency(selectedExport.totalValue - selectedExport.amountPaid)}</span>
                                    <button 
                                        onClick={() => setPaymentAmount(selectedExport.totalValue - selectedExport.amountPaid)}
                                        className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline"
                                    >
                                        Settle Remaining
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] px-4 block">Settlement Channel</label>
                                <select 
                                    className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-6 rounded-[2rem] font-black uppercase outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm tracking-widest appearance-none" 
                                    onChange={e => setPaymentMethod(e.target.value)}
                                    value={paymentMethod}
                                >
                                    <option value="BANK_TRANSFER">Corporate SWIFT / Bank Transfer</option>
                                    <option value="MOBILE_MONEY">Digital Wallet / Momo</option>
                                    <option value="CASH">Liquid Cash</option>
                                    <option value="CHEQUE">Corporate Cheque</option>
                                </select>
                            </div>
                        </div>
                  </div>

                  <div className="flex justify-end gap-6 mt-12 pt-10 border-t border-slate-100 dark:border-slate-800">
                      <button onClick={() => setShowPayModal(false)} className="px-10 py-5 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 rounded-3xl transition-all">Cancel</button>
                      <button 
                        onClick={() => { updateExportPayment(selectedExport.id, paymentAmount, paymentMethod); setShowPayModal(false); }} 
                        className="px-14 py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-700 active:scale-95 transition-all text-xs flex items-center"
                      >
                          Confirm Remittance <RefreshCw size={18} className="ml-3" />
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}