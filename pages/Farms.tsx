import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Tractor, Leaf, Users, MapPin, Layers, Check, X, ClipboardList, Info, Calendar, ChevronDown, ChevronUp, FileText, Edit3, History, Building, DollarSign } from 'lucide-react';
import { Farm, Crop, Harvest, CropStatus, FarmingType } from '../types';

export default function Farms() {
  const { farms, addFarm, crops, addCrop, updateCropStatus, user, staff, harvests, addHarvest, updateHarvest } = useApp();
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showAddHarvest, setShowAddHarvest] = useState(false);
  const [showEditHarvest, setShowEditHarvest] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState<Partial<Harvest>>({});
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  
  // Production Cost State for Harvest
  const [harvestCost, setHarvestCost] = useState<number>(0);
  const [harvestPaymentMethod, setHarvestPaymentMethod] = useState<'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY'>('CASH');

  // Form State
  const [newFarm, setNewFarm] = useState<Partial<Farm>>({ 
      farmingType: 'CROP',
      staffIds: [],
      initialAssets: [],
      size: '',
      notes: ''
  });

  const [newCrop, setNewCrop] = useState<Partial<Crop>>({
      variety: '',
      name: '',
      status: 'PLANTED'
  });
  
  const [newHarvest, setNewHarvest] = useState<Partial<Harvest>>({ 
      unit: 'kg',
      status: 'STORED',
      date: new Date().toISOString().slice(0, 16)
  });

  // Visibility filtering
  const visibleFarms = user?.role === 'STAFF' && user?.assignedFarmIds
    ? farms.filter(f => user.assignedFarmIds?.includes(f.id)) 
    : farms;

  const visibleCrops = user?.role === 'STAFF' && user?.assignedFarmIds
    ? crops.filter(c => user.assignedFarmIds?.includes(c.farmId))
    : crops;

  const toggleNotes = (id: string) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddFarm = () => {
    if (newFarm.name && newFarm.location && newFarm.size) {
        addFarm({ 
            ...newFarm, 
            id: 'f-' + Math.random().toString(36).substr(2, 9),
            staffIds: newFarm.staffIds || [],
            initialAssets: newFarm.initialAssets || [],
            farmingType: newFarm.farmingType || 'CROP'
        } as Farm);
        setShowAddFarm(false);
        setNewFarm({ farmingType: 'CROP', staffIds: [], initialAssets: [], size: '', notes: '' });
    } else {
        alert("CRITICAL ERROR: Farm Name, Location, and Operating Size are mandatory.");
    }
  };

  const handleAddCrop = () => {
    if (newCrop.name && newCrop.farmId) {
        addCrop({ 
            ...newCrop, 
            id: 'c-' + Math.random().toString(36).substr(2, 9), 
            status: newCrop.status || 'PLANTED', 
            plantedDate: new Date().toISOString() 
        } as Crop);
        setShowAddCrop(false);
        setNewCrop({ name: '', variety: '', status: 'PLANTED' });
    } else {
        alert("Please select a production unit and enter crop details.");
    }
  };

  const handleLogHarvest = () => {
      if (newHarvest.cropId && newHarvest.quantity && newHarvest.quantity > 0) {
          const crop = crops.find(c => c.id === newHarvest.cropId);
          if (crop) {
              addHarvest({
                  ...newHarvest,
                  id: 'h-' + Math.random().toString(36).substr(2, 9),
                  cropName: crop.name,
                  farmId: crop.farmId,
                  date: newHarvest.date || new Date().toISOString()
              } as Harvest, {
                  cost: harvestCost,
                  method: harvestPaymentMethod
              });
              setShowAddHarvest(false);
              setNewHarvest({ unit: 'kg', status: 'COLLECTED', date: new Date().toISOString().slice(0, 16) });
              setHarvestCost(0);
          }
      } else {
          alert("Please select an active production lot and enter a valid net yield.");
      }
  };

  const openEditHarvest = (harvest: Harvest) => {
      setEditingHarvest({ ...harvest });
      setShowEditHarvest(true);
  };

  const handleUpdateHarvest = () => {
      if (editingHarvest.id && editingHarvest.quantity && editingHarvest.quantity > 0) {
          updateHarvest(editingHarvest as Harvest);
          setShowEditHarvest(false);
          setEditingHarvest({});
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Production Units & Crops</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Governance of your farming and operational sectors.</p>
        </div>
        <div className="flex flex-wrap gap-3">
            <button 
                onClick={() => setShowAddHarvest(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center"
            >
                <ClipboardList size={16} className="mr-2" /> Log Yield
            </button>
            <button 
                onClick={() => setShowAddCrop(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center"
            >
                <Plus size={16} className="mr-2" /> Register Crop
            </button>
            {user?.role === 'ADMIN' && (
                <button 
                    onClick={() => setShowAddFarm(true)}
                    className="bg-slate-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center"
                >
                    <Plus size={16} className="mr-2" /> Register Unit
                </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {visibleFarms.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                <Tractor size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest">No assigned production units found.</p>
            </div>
        ) : visibleFarms.map(farm => (
            <div key={farm.id} className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all hover:shadow-xl">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">{farm.name}</h3>
                        <div className="flex flex-wrap gap-2 items-center text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">
                            <span className="flex items-center bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border dark:border-slate-700"><MapPin size={12} className="mr-1 text-primary-500"/> {farm.location}</span>
                            <span className="flex items-center bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border dark:border-slate-700"><Layers size={12} className="mr-1 text-blue-500"/> {farm.size}</span>
                            <span className="bg-primary-600 text-white px-2 py-1 rounded-lg uppercase tracking-tighter shadow-sm">{farm.farmingType}</span>
                        </div>
                    </div>
                    {farm.notes && (
                        <button 
                            onClick={() => toggleNotes(farm.id)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${expandedNotes[farm.id] ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            title="View Operational Notes"
                        >
                            <FileText size={20} />
                        </button>
                    )}
                </div>

                {expandedNotes[farm.id] && farm.notes && (
                    <div className="px-8 py-4 bg-primary-50/30 dark:bg-primary-900/10 border-b border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2">
                        <div className="flex items-start">
                            <Info size={16} className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-primary-700 dark:text-primary-400 uppercase tracking-widest mb-1">Operational Brief</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">"{farm.notes}"</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 tracking-widest border-b dark:border-slate-800 pb-2">
                            <span>Cultivations & Assets</span>
                            <button 
                                onClick={() => { setNewCrop({ ...newCrop, farmId: farm.id }); setShowAddCrop(true); }}
                                className="text-primary-600 hover:text-primary-700 transition-colors font-bold">+ New Production Lot</button>
                        </div>
                        {crops.filter(c => c.farmId === farm.id).length === 0 ? (
                            <p className="text-sm text-slate-400 italic py-2 text-center">No active production lots registered for this unit.</p>
                        ) : crops.filter(c => c.farmId === farm.id).map(crop => (
                            <div key={crop.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-primary-200 dark:hover:border-primary-800 transition-all">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center mr-4 text-primary-600 shadow-sm border border-slate-100 dark:border-slate-600">
                                        <Leaf size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white text-sm">{crop.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{crop.variety || 'Unspecified Variety'}</p>
                                    </div>
                                </div>
                                <select 
                                    className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-[10px] rounded-xl font-bold border border-slate-200 dark:border-slate-700 outline-none cursor-pointer shadow-sm focus:ring-2 focus:ring-emerald-500"
                                    value={crop.status}
                                    onChange={(e) => updateCropStatus(crop.id, e.target.value as CropStatus)}
                                >
                                    <option value="PLANTED">Planted</option>
                                    <option value="GROWING">Growing</option>
                                    <option value="READY">Ready</option>
                                    <option value="HARVESTED">Harvested</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center uppercase tracking-widest">
                  <ClipboardList size={22} className="mr-3 text-emerald-600" /> Audited Production Logs
              </h2>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 px-4 py-1.5 rounded-full text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-[0.2em] shadow-sm">Audit History</span>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <tr>
                          <th className="px-8 py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Crop & Grading</th>
                          <th className="px-8 py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Source Entity</th>
                          <th className="px-8 py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Net Yield</th>
                          <th className="px-8 py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Production Chain</th>
                          <th className="px-8 py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {harvests.length === 0 ? (
                          <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-300 italic font-medium uppercase tracking-widest">No audited production data logged.</td></tr>
                      ) : harvests.slice().reverse().map(harvest => {
                          const farm = farms.find(f => f.id === harvest.farmId);
                          return (
                              <tr key={harvest.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                  <td className="px-8 py-5">
                                      <p className="font-bold text-slate-900 dark:text-white text-base">{harvest.cropName}</p>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{harvest.grade || 'Standard Grade'}</p>
                                  </td>
                                  <td className="px-8 py-5">
                                      <div className="flex items-center space-x-2">
                                          <Building size={14} className="text-emerald-500" />
                                          <span className="font-bold text-slate-800 dark:text-slate-200">{farm?.name || 'Assigned Farm'}</span>
                                      </div>
                                      <p className="text-[9px] text-slate-400 flex items-center ml-5 uppercase tracking-widest mt-0.5"><MapPin size={10} className="mr-1"/> {farm?.location}</p>
                                  </td>
                                  <td className="px-8 py-5">
                                      <span className="font-black text-emerald-600 text-xl tracking-tighter">{harvest.quantity.toLocaleString()} {harvest.unit}</span>
                                  </td>
                                  <td className="px-8 py-5">
                                      {harvest.history && harvest.history.length > 0 ? (
                                          <div className="space-y-1.5">
                                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight italic max-w-xs truncate">{harvest.history[harvest.history.length-1].description}</p>
                                              <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400 tracking-widest">
                                                  <span className="flex items-center text-primary-600"><Users size={10} className="mr-1" /> {harvest.history[harvest.history.length-1].changedBy}</span>
                                                  <span className="flex items-center"><Calendar size={10} className="mr-1" /> {new Date(harvest.history[harvest.history.length-1].timestamp).toLocaleDateString()}</span>
                                              </div>
                                          </div>
                                      ) : <span className="text-slate-300 italic text-xs uppercase tracking-widest">No audited history chain</span>}
                                  </td>
                                  <td className="px-8 py-5 text-right">
                                      <button 
                                          onClick={() => openEditHarvest(harvest)}
                                          className="p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                                          title="Audit production logs"
                                      >
                                          <History size={18} />
                                      </button>
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
          </div>
      </div>

      {/* MODALS */}
      {showAddFarm && (
          <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[110] p-4 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] w-full max-w-3xl shadow-2xl transition-colors border border-white/10 my-auto overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="flex justify-between items-start mb-10 shrink-0">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Register Operational Unit</h3>
                        <p className="text-slate-500 mt-3 font-medium text-sm">Define unit infrastructure and assign management directives.</p>
                    </div>
                    <button onClick={() => setShowAddFarm(false)} className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={24}/></button>
                  </div>
                  
                  <div className="space-y-8 overflow-y-auto pr-2 scrollbar-thin flex-1 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Entity Identifier Name</label>
                                <input className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-6 rounded-[2rem] outline-none focus:ring-4 focus:ring-emerald-500/20 font-black shadow-inner" placeholder="e.g. Blue Highlands Plantation" value={newFarm.name || ''} onChange={e => setNewFarm({...newFarm, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Primary Production Logic</label>
                                <select 
                                    className="w-full border-none bg-slate-50 dark:bg-slate-900 dark:text-white p-6 rounded-[2rem] outline-none focus:ring-4 focus:ring-emerald-500/20 font-black uppercase tracking-widest text-sm shadow-inner"
                                    value={newFarm.farmingType}
                                    onChange={e => setNewFarm({...newFarm, farmingType: e.target.value as FarmingType})}
                                >
                                    <option value="CROP">Crop Specialization</option>
                                    <option value="LIVESTOCK">Livestock & Dairy Assets</option>
                                    <option value="MIXED">Mixed Multi-Sector Logic</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Geographic Coordination</label>
                                <input className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-6 rounded-[2rem] outline-none focus:ring-4 focus:ring-emerald-500/20 font-bold shadow-inner" placeholder="e.g. Nakuru Regional Hub" value={newFarm.location || ''} onChange={e => setNewFarm({...newFarm, location: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Net Operating Size</label>
                                <input className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-6 rounded-[2rem] outline-none focus:ring-4 focus:ring-emerald-500/20 font-black shadow-inner" placeholder="e.g. 2,500 Hectares" value={newFarm.size || ''} onChange={e => setNewFarm({...newFarm, size: e.target.value})} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Operating Directives & Notes</label>
                            <textarea 
                                className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-7 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-emerald-500/20 h-32 font-medium text-lg shadow-inner leading-relaxed" 
                                placeholder="Specify detailed governance notes, soil metrics, or maintenance cycles..." 
                                value={newFarm.notes || ''}
                                onChange={e => setNewFarm({...newFarm, notes: e.target.value})} 
                            />
                        </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 shrink-0">
                      <button onClick={() => setShowAddFarm(false)} className="px-10 py-5 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-50 rounded-3xl transition-all">Cancel</button>
                      <button onClick={handleAddFarm} className="px-14 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all text-xs">Confirm Unit Architecture</button>
                  </div>
              </div>
          </div>
      )}

      {/* NEW LOT MODAL */}
      {showAddCrop && (
          <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[110] p-4 backdrop-blur-xl animate-in zoom-in duration-300">
              <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[4rem] w-full max-w-2xl shadow-2xl border border-white/10 overflow-hidden">
                   <div className="flex justify-between items-center mb-10">
                    <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">New Production Lot</h3>
                    <button onClick={() => setShowAddCrop(false)} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={24}/></button>
                  </div>
                  <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 block mb-2">Target Production Unit</label>
                            <select 
                                className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-6 rounded-[2rem] font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm uppercase tracking-widest"
                                value={newCrop.farmId || ''}
                                onChange={e => setNewCrop({...newCrop, farmId: e.target.value})}
                            >
                                <option value="">-- Choose Assigned Sector --</option>
                                {visibleFarms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 block">Commodity Name</label>
                                <input className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-6 rounded-[2rem] font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" placeholder="e.g. Arabica Coffee" value={newCrop.name || ''} onChange={e => setNewCrop({...newCrop, name: e.target.value})} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 block">Genetic Variety</label>
                                <input className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-6 rounded-[2rem] font-bold outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" placeholder="e.g. SL28 Hybrid" value={newCrop.variety || ''} onChange={e => setNewCrop({...newCrop, variety: e.target.value})} />
                             </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 block mb-2">Initial Lifecycle Status</label>
                            <select 
                                className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-6 rounded-[2rem] font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm uppercase tracking-widest"
                                value={newCrop.status}
                                onChange={e => updateCropStatus(newCrop.id!, e.target.value as CropStatus)}
                            >
                                <option value="PLANTED">Newly Planted</option>
                                <option value="GROWING">Active Growth</option>
                                <option value="READY">Ready for Collection</option>
                            </select>
                        </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                      <button onClick={() => setShowAddCrop(false)} className="px-10 py-5 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-50 rounded-3xl transition-all">Cancel</button>
                      <button onClick={handleAddCrop} className="px-14 py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all text-xs">Initialize Lot</button>
                  </div>
              </div>
          </div>
      )}

      {/* LOG HARVEST MODAL */}
      {showAddHarvest && (
          <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[110] p-4 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[4rem] w-full max-w-2xl shadow-2xl border border-white/10 overflow-hidden my-auto flex flex-col max-h-[95vh]">
                  <div className="flex justify-between items-start mb-10 shrink-0">
                      <div>
                          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase tracking-tighter">Production Output Audit</h3>
                          <p className="text-slate-500 mt-3 font-medium text-sm">Audit final net yield and associate with warehouse inventory chain.</p>
                      </div>
                      <button onClick={() => setShowAddHarvest(false)} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={24}/></button>
                  </div>

                  <div className="space-y-8 overflow-y-auto pr-2 scrollbar-thin flex-1 pb-4">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 block">Source Production Lot</label>
                          <select 
                              className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-7 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-emerald-500/20 font-black uppercase shadow-inner text-sm tracking-widest"
                              onChange={e => setNewHarvest({...newHarvest, cropId: e.target.value})}
                              value={newHarvest.cropId || ''}
                          >
                              <option value="">-- Associate Production Lot --</option>
                              {visibleCrops.map(crop => {
                                  const farm = farms.find(f => f.id === crop.farmId);
                                  return (
                                      <option key={crop.id} value={crop.id}>
                                          {crop.name} [{farm?.name || 'Unit'}]
                                      </option>
                                  );
                              })}
                          </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 block">Gross Audited Yield</label>
                              <div className="flex bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] shadow-inner overflow-hidden border border-transparent focus-within:ring-4 focus-within:ring-emerald-500/20 transition-all">
                                  <input 
                                      type="number" 
                                      className="w-full bg-transparent border-none p-7 outline-none font-black text-3xl dark:text-white"
                                      placeholder="0.00"
                                      onChange={e => setNewHarvest({...newHarvest, quantity: parseFloat(e.target.value)})}
                                  />
                                  <div className="bg-slate-100 dark:bg-slate-800 px-8 flex items-center justify-center text-slate-500 dark:text-slate-400 font-black uppercase text-xs tracking-widest border-l dark:border-white/5">{newHarvest.unit}</div>
                              </div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 block">Commercial Grade</label>
                              <input 
                                  className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-7 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-emerald-500/20 font-black shadow-inner placeholder:font-normal uppercase text-sm tracking-widest"
                                  placeholder="e.g. Export AA Grade"
                                  value={newHarvest.grade || ''}
                                  onChange={e => setNewHarvest({...newHarvest, grade: e.target.value})}
                              />
                          </div>
                      </div>

                      {/* Production Cost Section */}
                      <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-inner space-y-6">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4 flex items-center"><DollarSign size={14} className="mr-2 text-emerald-500"/> Production / Processing Cost</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 block">Labor & Logistics Cost ($)</label>
                                  <input 
                                    type="number"
                                    className="w-full border-none bg-white dark:bg-slate-900 p-5 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold dark:text-white shadow-sm"
                                    placeholder="0.00"
                                    value={harvestCost || ''}
                                    onChange={e => setHarvestCost(parseFloat(e.target.value))}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 block">Payment Channel</label>
                                  <select 
                                    className="w-full border-none bg-white dark:bg-slate-900 p-5 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-black text-xs uppercase tracking-widest dark:text-white shadow-sm"
                                    value={harvestPaymentMethod}
                                    onChange={e => setHarvestPaymentMethod(e.target.value as any)}
                                  >
                                      <option value="CASH">Liquid Cash</option>
                                      <option value="BANK_TRANSFER">Corporate Transfer</option>
                                      <option value="MOBILE_MONEY">Digital Remit</option>
                                  </select>
                              </div>
                          </div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Linked to Global Ledger automatically</p>
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 block">Audit Timestamp</label>
                          <input 
                              type="datetime-local"
                              className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-7 rounded-[2.5rem] outline-none focus:ring-4 focus:ring-emerald-500/20 font-black shadow-inner uppercase text-sm"
                              value={newHarvest.date || ''}
                              onChange={e => setNewHarvest({...newHarvest, date: e.target.value})}
                          />
                      </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 shrink-0">
                      <button onClick={() => setShowAddHarvest(false)} className="px-10 py-5 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-50 rounded-3xl transition-all">Cancel</button>
                      <button onClick={handleLogHarvest} className="px-14 py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all text-xs">Record Audited Yield</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}