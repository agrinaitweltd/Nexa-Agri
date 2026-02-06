
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StaffMember, StaffPayment, Permission, StaffTask, Department } from '../types';
// Fixed: Added missing UserPlus icon import
import { Plus, Users, Wallet, Phone, Mail, UserCheck, Calendar, Shield, Check, ListChecks, ChevronRight, CheckCircle2, Circle, Eye, EyeOff, Settings2, Trash2, X, ShieldCheck, AlertCircle, Building2, Briefcase, ChevronDown, UserPlus } from 'lucide-react';
import { checkPasswordStrength, isPasswordStrong, PasswordRules } from '../lib/security';

export default function Staff() {
  const { staff, addStaff, payStaff, staffPayments, farms, assignTask, updateStaffPermissions, user, departments, addDepartment, deleteDepartment } = useApp();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStep, setAddStep] = useState<'DETAILS' | 'SUCCESS'>('DETAILS');
  const [showPayModal, setShowPayModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  
  const [viewMode, setViewMode] = useState<'LIST' | 'DEPARTMENTS' | 'PERMISSIONS'>('LIST');

  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    frequency: 'MONTHLY',
    status: 'ACTIVE',
    currency: 'UGX',
    permissions: ['LOG_HARVEST']
  });
  const [newDept, setNewDept] = useState<Partial<Department>>({});
  const [staffPassword, setStaffPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentPeriod, setPaymentPeriod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY'>('BANK_TRANSFER');

  const handleAddStaff = async () => {
    if (newStaff.name && newStaff.email && staffPassword) {
      setIsSubmitting(true);
      try {
        await addStaff({
          ...newStaff,
          id: Math.random().toString(),
          joinedDate: new Date().toISOString(),
          tasks: [],
          salary: newStaff.salary || 0
        } as StaffMember, staffPassword);
        setAddStep('SUCCESS');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCreateDept = async () => {
      if (newDept.name) {
          await addDepartment({
              ...newDept,
              id: Math.random().toString()
          } as Department);
          setShowDeptModal(false);
          setNewDept({});
      }
  };

  const handlePayStaff = () => {
    const member = staff.find(s => s.id === selectedStaffId);
    if (member && paymentAmount > 0) {
      payStaff({
        id: Math.random().toString(),
        staffId: member.id,
        staffName: member.name,
        amount: paymentAmount,
        date: new Date().toISOString(),
        period: paymentPeriod || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
        method: paymentMethod
      });
      setShowPayModal(false);
      setPaymentAmount(0);
      setPaymentPeriod('');
    }
  };

  // Fixed: Added closeAddModal function to manage modal state and cleanup
  const closeAddModal = () => {
    setShowAddModal(false);
    setAddStep('DETAILS');
    setNewStaff({
      frequency: 'MONTHLY',
      status: 'ACTIVE',
      currency: 'UGX',
      permissions: ['LOG_HARVEST']
    });
    setStaffPassword('');
    setShowPassword(false);
  };

  const AVAILABLE_PERMISSIONS: {key: Permission, label: string, desc: string}[] = [
      { key: 'MANAGE_INVENTORY', label: 'Inventory Control', desc: 'Add/Remove stock items' },
      { key: 'MANAGE_FINANCE', label: 'Financial Control', desc: 'Approve requisitions and view full balances' },
      { key: 'VIEW_FINANCE', label: 'View Finance Only', desc: 'See reports but cannot approve spend' },
      { key: 'MANAGE_STAFF', label: 'Staff Admin', desc: 'Manage other staff members' },
      { key: 'LOG_HARVEST', label: 'Log Production', desc: 'Create harvest and farm records' },
      { key: 'MANAGE_EXPORTS', label: 'Export Manager', desc: 'Manage shipments and orders' },
      { key: 'APPROVE_ORDERS', label: 'Approve Orders', desc: 'Finalize and approve export orders' },
      { key: 'VIEW_REPORTS', label: 'Reports Access', desc: 'Access analytics and business reporting' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Team Architecture</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Orchestrate your departments and employee access nodes.</p>
        </div>
        <div className="flex flex-wrap gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex p-1 shadow-sm overflow-hidden">
                 <button 
                    onClick={() => setViewMode('LIST')} 
                    className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'LIST' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-inner' : 'text-slate-400'}`}
                 >
                    Personnel
                 </button>
                 <button 
                    onClick={() => setViewMode('DEPARTMENTS')} 
                    className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'DEPARTMENTS' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-inner' : 'text-slate-400'}`}
                 >
                    Departments
                 </button>
            </div>
            
            <button 
                onClick={() => setShowAddModal(true)}
                className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all text-[10px]"
            >
                <UserPlus size={16} className="mr-2 inline" />
                Register Staff
            </button>
        </div>
      </div>

      {viewMode === 'LIST' && (
          <div className="grid grid-cols-1 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                      <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs flex items-center">
                          <Users size={18} className="mr-3 text-emerald-500" /> Organizational Roster
                      </h3>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{staff.length} Active Identifiers</span>
                  </div>
                  
                  {staff.length === 0 ? (
                      <div className="py-24 text-center">
                          <Users size={64} className="mx-auto text-slate-200 mb-6" />
                          <p className="text-slate-400 font-bold uppercase tracking-[0.2em]">No Operational Staff Registered</p>
                      </div>
                  ) : (
                      <div className="divide-y divide-slate-50 dark:divide-slate-800">
                          {staff.map(member => (
                              <div key={member.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div className="flex items-center space-x-6">
                                      <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center text-2xl font-black text-slate-300 shadow-sm">
                                          {member.name.charAt(0)}
                                      </div>
                                      <div>
                                          <h4 className="font-black text-lg text-slate-900 dark:text-white leading-none mb-2">{member.name}</h4>
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                              <Briefcase size={12} className="mr-1.5 text-blue-500" /> {member.role} • 
                                              <span className="text-emerald-500 ml-1.5">{departments.find(d => d.id === member.departmentId)?.name || 'General Org'}</span>
                                          </p>
                                          <p className="text-[10px] text-slate-400 mt-1 font-bold">{member.email}</p>
                                      </div>
                                  </div>

                                  <div className="flex items-center space-x-3">
                                      <div className="text-right mr-6 hidden xl:block">
                                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Status</p>
                                          <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">Active Access</span>
                                      </div>
                                      <button 
                                        onClick={() => { setSelectedStaffId(member.id); setPaymentAmount(member.salary); setShowPayModal(true); }}
                                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
                                      >
                                          Post Payroll
                                      </button>
                                      <button className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                                          <Trash2 size={20} />
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      )}

      {viewMode === 'DEPARTMENTS' && (
          <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase tracking-tighter">Business Units</h3>
                      <button onClick={() => setShowDeptModal(true)} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 flex items-center">
                          <Plus size={16} className="mr-2" /> New Department
                      </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {departments.length === 0 ? (
                          <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                              <Building2 size={48} className="mx-auto text-slate-200 mb-4" />
                              <p className="text-slate-400 font-bold uppercase tracking-widest">No Departments Defined</p>
                          </div>
                      ) : departments.map(dept => (
                          <div key={dept.id} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group">
                              <div className="flex justify-between items-start mb-6">
                                  <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-110 transition-transform">
                                      <Building2 size={24} />
                                  </div>
                                  <button onClick={() => deleteDepartment(dept.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                              </div>
                              <h4 className="font-black text-xl text-slate-900 dark:text-white mb-2">{dept.name}</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-8">{dept.description || 'Core organizational business unit.'}</p>
                              <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Size</span>
                                  <span className="font-black text-slate-900 dark:text-white text-lg">{staff.filter(s => s.departmentId === dept.id).length}</span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* DEPARTMENT MODAL */}
      {showDeptModal && (
          <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[150] p-4 backdrop-blur-xl animate-in zoom-in duration-300">
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] w-full max-w-lg shadow-2xl border border-white/10">
                   <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">New Department</h3>
                    <button onClick={() => setShowDeptModal(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={20}/></button>
                  </div>
                  <div className="space-y-6">
                      <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Department Header</label>
                          <input className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-5 rounded-[1.5rem] font-bold outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" placeholder="e.g. Export Logistics" onChange={e => setNewDept({...newDept, name: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Operational Remit</label>
                          <textarea className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-5 rounded-[1.5rem] font-medium outline-none h-32 focus:ring-4 focus:ring-emerald-500/20 shadow-inner resize-none" placeholder="Description of responsibilities..." onChange={e => setNewDept({...newDept, description: e.target.value})} />
                      </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-10">
                      <button onClick={() => setShowDeptModal(false)} className="px-8 py-3 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100 rounded-2xl">Cancel</button>
                      <button onClick={handleCreateDept} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl text-xs active:scale-95 transition-all">Initialize Unit</button>
                  </div>
              </div>
          </div>
      )}

      {/* STAFF MODAL */}
      {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[150] p-4 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[95vh]">
                  <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase tracking-tighter">Staff Provisioning</h3>
                        <p className="text-slate-500 mt-2 font-medium text-sm">Issue authorized access tokens to new team members.</p>
                    </div>
                    <button onClick={closeAddModal} className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={24}/></button>
                  </div>
                  
                  {addStep === 'DETAILS' ? (
                      <div className="p-10 space-y-10 overflow-y-auto scrollbar-thin flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4">Legal Name</label>
                                    <input className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner" placeholder="Samuel Kiptoo" onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4">Work Email (Login ID)</label>
                                    <input className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner" placeholder="samuel@nexa.ug" onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
                                </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4">Primary Position</label>
                                    <input className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl font-bold dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner" placeholder="Senior Agronomist" onChange={e => setNewStaff({...newStaff, role: e.target.value})} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4">Department Allocation</label>
                                    <select className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl font-black dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner text-[10px] uppercase tracking-widest" onChange={e => setNewStaff({...newStaff, departmentId: e.target.value})}>
                                        <option value="">No Allocation (General)</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                          </div>

                          <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4">Temporary Security Key</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl font-black dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner tracking-widest" placeholder="Set temporary password" value={staffPassword} onChange={e => setStaffPassword(e.target.value)} />
                                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
                                </div>
                          </div>

                          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                               <div className="absolute top-0 right-0 p-8 opacity-10"><Wallet size={120} /></div>
                               <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 px-2">Remuneration Logic</h4>
                               <div className="grid grid-cols-2 gap-6 relative z-10">
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-2">Gross Monthly Rate ({user?.preferredCurrency})</label>
                                        <input type="number" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white font-black outline-none focus:bg-white/10 transition-colors" placeholder="0" onChange={e => setNewStaff({...newStaff, salary: parseFloat(e.target.value)})} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-2">Frequency</label>
                                        <select className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white font-black text-[10px] uppercase tracking-widest outline-none focus:bg-white/10 transition-colors appearance-none" onChange={e => setNewStaff({...newStaff, frequency: e.target.value as any})}>
                                            <option value="MONTHLY">Monthly Audit</option>
                                            <option value="WEEKLY">Weekly Cycle</option>
                                            <option value="DAILY">Daily Log</option>
                                        </select>
                                    </div>
                               </div>
                          </div>
                      </div>
                  ) : (
                      <div className="p-20 text-center space-y-8 animate-in zoom-in duration-500">
                          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-2xl border-4 border-white dark:border-slate-800">
                              <ShieldCheck size={48} />
                          </div>
                          <div className="space-y-2">
                              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase tracking-tighter leading-none">Token Initialized</h2>
                              <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">Staff account for <span className="text-slate-900 dark:text-white font-bold">{newStaff.email}</span> is now provisioned with high-integrity security protocols.</p>
                          </div>
                          <button onClick={closeAddModal} className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">Return to Directory</button>
                      </div>
                  )}

                  {addStep === 'DETAILS' && (
                      <div className="p-10 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-4 bg-slate-50/50">
                          <button onClick={closeAddModal} className="px-10 py-5 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100 rounded-3xl transition-all">Discard Draft</button>
                          <button 
                            onClick={handleAddStaff}
                            disabled={isSubmitting || !newStaff.name || !newStaff.email || !staffPassword}
                            className="px-14 py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all text-xs disabled:opacity-50 disabled:grayscale"
                          >
                            {isSubmitting ? 'Securing Node...' : 'Inject Identifier'}
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
}
