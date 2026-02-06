import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { InventoryItem, Client } from '../types';
import { Search, PlusCircle, Truck, DollarSign, Hash, User, Settings2, Trash2, MapPin, AlertTriangle, Check, X, ChevronRight } from 'lucide-react';

export default function Inventory() {
  const { inventory, addToInventory, bulkUpdateInventory, deleteInventoryItems, user, clients } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Bulk actions UI
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkLocation, setBulkLocation] = useState('');
  const [bulkThreshold, setBulkThreshold] = useState<number | ''>('');

  // Stock In Form
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    unit: user?.sector === 'EXPORT' ? 'tonnes' : 'kg'
  });
  
  // Expense Tracking
  const [isExpense, setIsExpense] = useState(false);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [costAmount, setCostAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [referenceNum, setReferenceNum] = useState<string>('');

  const filteredInventory = inventory.filter(item => 
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define suppliers by filtering clients by type 'SUPPLIER'
  const suppliers = clients.filter(c => c.type === 'SUPPLIER');

  useEffect(() => {
    if (unitPrice && newItem.quantity) {
        setCostAmount(unitPrice * newItem.quantity);
    }
  }, [unitPrice, newItem.quantity]);

  const handleStockIn = () => {
    if (newItem.productName && newItem.quantity) {
        const supplier = clients.find(c => c.id === selectedSupplierId);
        
        addToInventory({
            ...newItem,
            id: Math.random().toString(),
            lastUpdated: new Date().toISOString(),
            location: newItem.location || 'Main Warehouse',
            costPerUnit: unitPrice > 0 ? unitPrice : undefined
        } as InventoryItem, isExpense ? { 
            cost: costAmount, 
            method: paymentMethod, 
            supplierName: supplier?.name, 
            reference: referenceNum 
        } : undefined);
        
        setShowModal(false);
        setNewItem({ unit: user?.sector === 'EXPORT' ? 'tonnes' : 'kg' });
        setIsExpense(false);
        setCostAmount(0);
        setUnitPrice(0);
        setSelectedSupplierId('');
        setReferenceNum('');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredInventory.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredInventory.map(i => i.id)));
    }
  };

  const toggleSelectItem = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkUpdateLocation = () => {
    if (bulkLocation) {
      bulkUpdateInventory(Array.from(selectedIds), { location: bulkLocation });
      setBulkLocation('');
      setSelectedIds(new Set());
      setShowBulkActions(false);
    }
  };

  const handleBulkSetLowStock = () => {
    if (bulkThreshold !== '') {
      bulkUpdateInventory(Array.from(selectedIds), { lowStockThreshold: Number(bulkThreshold) });
      setBulkThreshold('');
      setSelectedIds(new Set());
      setShowBulkActions(false);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} items?`)) {
      deleteInventoryItems(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const getProductOptions = () => {
    if (user?.sector === 'EXPORT') {
        return ['Arabica Coffee', 'Robusta Coffee', 'Tea', 'Avocado', 'Mangoes', 'Macadamia'];
    }
    return ['Maize', 'Beans', 'Fertilizer', 'Seeds', 'Pesticides'];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory Management</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Track stock levels and perform bulk warehouse operations.</p>
        </div>
        <div className="flex space-x-3">
            <button 
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 active:scale-95"
            >
                <PlusCircle size={18} />
                <span>Restock Inventory</span>
            </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center space-x-4">
                  <span className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">{selectedIds.size}</span>
                  <p className="font-bold text-sm">Items Selected</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                  <div className="flex bg-white/10 dark:bg-slate-100 rounded-xl overflow-hidden border border-white/10">
                      <input 
                        type="text" 
                        placeholder="New Location..." 
                        className="bg-transparent px-4 py-2 text-xs outline-none w-32 placeholder:text-slate-400"
                        value={bulkLocation}
                        onChange={e => setBulkLocation(e.target.value)}
                      />
                      <button 
                        onClick={handleBulkUpdateLocation}
                        className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Update Location
                      </button>
                  </div>
                  <div className="flex bg-white/10 dark:bg-slate-100 rounded-xl overflow-hidden border border-white/10">
                      <input 
                        type="number" 
                        placeholder="Min Threshold..." 
                        className="bg-transparent px-4 py-2 text-xs outline-none w-32 placeholder:text-slate-400"
                        value={bulkThreshold}
                        onChange={e => setBulkThreshold(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                      <button 
                        onClick={handleBulkSetLowStock}
                        className="bg-amber-500 text-white px-4 py-2 text-xs font-bold hover:bg-amber-600 transition-colors"
                      >
                        Set Low Stock
                      </button>
                  </div>
                  <button 
                    onClick={handleBulkDelete}
                    className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    title="Delete Selected"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={() => setSelectedIds(new Set())}
                    className="p-2 text-slate-400 hover:text-white dark:hover:text-slate-900"
                  >
                    <X size={18} />
                  </button>
              </div>
          </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center space-x-4 transition-colors">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search products, grades..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <select className="border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg px-4 py-2 text-slate-600 outline-none focus:border-primary-500 transition-colors">
            <option>All Locations</option>
            <option>Main Warehouse</option>
            <option>Cold Storage</option>
            <option>Farm Storage</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th className="px-6 py-4 w-10">
                            <input 
                              type="checkbox" 
                              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
                              checked={filteredInventory.length > 0 && selectedIds.size === filteredInventory.length}
                              onChange={toggleSelectAll}
                            />
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Grade/Variety</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredInventory.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                <div className="flex flex-col items-center">
                                    <Truck size={40} className="mb-2 opacity-20" />
                                    <p>No stock items found. Add some stock to get started.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filteredInventory.map(item => {
                            const isLow = item.quantity < (item.lowStockThreshold || 500);
                            return (
                                <tr key={item.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${selectedIds.has(item.id) ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input 
                                          type="checkbox" 
                                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
                                          checked={selectedIds.has(item.id)}
                                          onChange={() => toggleSelectItem(item.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                                        {item.productName}
                                        {item.lowStockThreshold && (
                                            <p className="text-[9px] text-slate-400 uppercase font-medium mt-0.5">Threshold: {item.lowStockThreshold} {item.unit}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-600 uppercase tracking-wider">
                                            {item.grade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${isLow ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                            {item.quantity.toLocaleString()} {item.unit}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {isLow ? (
                                            <div className="flex items-center text-red-500 font-bold text-[10px] uppercase tracking-widest bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full w-fit">
                                                <AlertTriangle size={10} className="mr-1" /> Low Stock
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-emerald-500 font-bold text-[10px] uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full w-fit">
                                                <Check size={10} className="mr-1" /> Healthy
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">
                                        <div className="flex items-center">
                                            <MapPin size={12} className="mr-1 text-slate-400" />
                                            {item.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-xs font-bold uppercase tracking-widest">Details</button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Stock In Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transition-colors">
                <div className="bg-slate-50 dark:bg-slate-700/50 px-8 py-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 dark:text-white">Restock Inventory</h3>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Manual Acquisition Entry</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-2xl">&times;</button>
                </div>
                
                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Product Type</label>
                            <select 
                                className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                                onChange={e => setNewItem({...newItem, productName: e.target.value})}
                            >
                                <option value="">Select Product</option>
                                {getProductOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Grade / Quality</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                                placeholder="e.g. Premium Grade A"
                                onChange={e => setNewItem({...newItem, grade: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Restock Quantity</label>
                            <div className="flex">
                                <input 
                                    type="number" 
                                    className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-l-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none font-bold"
                                    placeholder="0.00"
                                    onChange={e => setNewItem({...newItem, quantity: parseFloat(e.target.value)})}
                                />
                                <span className="bg-slate-100 dark:bg-slate-700 border border-l-0 border-slate-200 dark:border-slate-600 rounded-r-xl px-4 py-3 text-slate-500 dark:text-slate-300 font-bold text-sm flex items-center">
                                    {newItem.unit}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Storage</label>
                            <input 
                                 type="text" 
                                 className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                                 placeholder="Location"
                                 onChange={e => setNewItem({...newItem, location: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Expense Tracking Section */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold text-slate-700 dark:text-white flex items-center">
                                <DollarSign size={16} className="mr-1 text-emerald-500" /> Link to Finance Module
                            </h4>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isExpense} onChange={e => setIsExpense(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                <span className="ml-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Record Expense</span>
                            </label>
                        </div>

                        {isExpense && (
                            <div className="space-y-4 pt-2 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
                                            <User size={10} className="mr-1"/> Supplier
                                        </label>
                                        <select 
                                            className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm"
                                            value={selectedSupplierId}
                                            onChange={e => setSelectedSupplierId(e.target.value)}
                                        >
                                            <option value="">-- Choose Supplier --</option>
                                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
                                            <Hash size={10} className="mr-1"/> Invoice / Ref #
                                        </label>
                                        <input 
                                            type="text"
                                            className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm"
                                            placeholder="INV-XXXX"
                                            value={referenceNum}
                                            onChange={e => setReferenceNum(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Unit Price ($)</label>
                                        <input 
                                            type="number"
                                            className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm font-bold"
                                            placeholder="0.00"
                                            value={unitPrice || ''}
                                            onChange={e => setUnitPrice(parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Total Acquisition Cost ($)</label>
                                        <input 
                                            type="number"
                                            className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-100 dark:text-slate-900 rounded-lg px-3 py-2 text-sm font-bold text-emerald-600"
                                            value={costAmount || ''}
                                            readOnly={unitPrice > 0}
                                            onChange={e => setCostAmount(parseFloat(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Payment Method</label>
                                    <select 
                                        className="w-full border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm"
                                        onChange={e => setPaymentMethod(e.target.value)}
                                        value={paymentMethod}
                                    >
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                        <option value="CASH">Petty Cash</option>
                                        <option value="MOBILE_MONEY">Mobile Money</option>
                                        <option value="CHEQUE">Cheque</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-700/50 px-8 py-6 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-700 rounded-b-3xl">
                    <button onClick={() => setShowModal(false)} className="px-6 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold transition-colors">Cancel</button>
                    <button onClick={handleStockIn} className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                        Confirm Acquisition
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}