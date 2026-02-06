import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { NexaLogo } from '../components/NexaLogo';
import { 
    Users, ShieldCheck, UserMinus, CheckCircle2, XCircle, 
    Smartphone, Mail, Hash, Building, Globe, Filter, 
    Search, LogOut, RefreshCw, Trash2, Ban, Settings, Activity, Wallet, Landmark, UserPlus, X, Shield, Lock, ChevronRight, LayoutDashboard, Briefcase, Plus, SendHorizontal
} from 'lucide-react';
import { User, PendingSignup, Sector } from '../types';

export default function AdminPortal() {
    const { logout, pendingSignups, approveSignup, rejectSignup, getAllUsers, deleteUser, changeUserStatus, register } = useApp();
    const [activeView, setActiveView] = useState<'USERS' | 'REQUESTS' | 'PROVISION'>('REQUESTS');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    
    // Provision User Form
    const [showProvisionModal, setShowProvisionModal] = useState(false);
    const [provisionForm, setProvisionForm] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
        businessType: 'General Agriculture',
        sector: 'GENERAL' as Sector,
        role: 'ADMIN' as 'ADMIN' | 'STAFF'
    });
    const [isProvisioning, setIsProvisioning] = useState(false);

    useEffect(() => {
        setUsers(getAllUsers());
    }, [pendingSignups, activeView]);

    const handleProvision = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProvisioning(true);
        try {
            const res = await register({
                ...provisionForm,
                activationStatus: 'ACTIVE',
                setupComplete: false // Force them through onboarding
            });
            if (res.success) {
                setShowProvisionModal(false);
                setProvisionForm({ name: '', email: '', password: '', companyName: '', businessType: 'General Agriculture', sector: 'GENERAL', role: 'ADMIN' });
                setActiveView('USERS');
            } else {
                alert(res.message);
            }
        } finally {
            setIsProvisioning(false);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRequests = pendingSignups.filter(r => 
        r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StatCard = ({ label, value, icon: Icon, color }: any) => (
        <div className="bg-slate-900 border border-white/5 p-6 rounded-[2rem] flex flex-col justify-between group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
                <div className={`p-2 rounded-lg bg-opacity-10 ${color}`}>
                    <Icon size={14} className={color.replace('bg-', 'text-')} />
                </div>
            </div>
            <h4 className="text-3xl font-black text-white mt-4 tracking-tighter">{value}</h4>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-slate-300 font-sans selection:bg-primary-500/30 flex flex-col">
            {/* Admin Header */}
            <header className="h-20 border-b border-white/5 bg-slate-950 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center space-x-6">
                    <NexaLogo className="h-8 md:h-10" light />
                    <div className="hidden md:block w-px h-6 bg-white/10" />
                    <div className="hidden md:block">
                        <h2 className="text-white font-black uppercase tracking-widest text-[9px]">Executive Terminal</h2>
                        <p className="text-[9px] text-emerald-500 font-black tracking-tighter">Identity: Alinaitwe.Root</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="hidden lg:flex items-center space-x-3 px-5 py-2 bg-white/5 rounded-2xl border border-white/5">
                        <Activity size={12} className="text-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Node Latency: 4ms</span>
                    </div>
                    <button onClick={logout} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <main className="p-6 md:p-12 max-w-[1600px] mx-auto space-y-10 w-full flex-1">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    <StatCard label="Cloud Identities" value={users.length} icon={Building} color="bg-blue-500" />
                    <StatCard label="Audit Queue" value={pendingSignups.length} icon={ShieldCheck} color="bg-amber-500" />
                    <StatCard label="Active Nodes" value={users.filter(u => u.activationStatus === 'ACTIVE').length} icon={CheckCircle2} color="bg-emerald-500" />
                    <StatCard label="Global Integrity" value="High" icon={Activity} color="bg-purple-500" />
                </div>

                {/* Main Navigation & Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/40 p-2 rounded-[2.5rem] border border-white/5">
                    <div className="flex space-x-1 p-1">
                        <button 
                            onClick={() => setActiveView('REQUESTS')}
                            className={`px-6 py-4 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all flex items-center ${activeView === 'REQUESTS' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            <ShieldCheck size={14} className="mr-2" /> Audit Queue ({pendingSignups.length})
                        </button>
                        <button 
                            onClick={() => setActiveView('USERS')}
                            className={`px-6 py-4 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all flex items-center ${activeView === 'USERS' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Users size={14} className="mr-2" /> Cloud Directory
                        </button>
                    </div>

                    <div className="flex items-center space-x-4 px-2">
                        <div className="relative flex-1 lg:min-w-[300px]">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                            <input 
                                className="w-full pl-12 pr-4 py-4 bg-black border border-white/5 rounded-[1.5rem] outline-none font-bold text-xs text-white focus:border-white/20 transition-all placeholder:text-slate-700"
                                placeholder={`Filter ${activeView === 'REQUESTS' ? 'audits' : 'identities'}...`}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setShowProvisionModal(true)}
                            className="bg-emerald-600 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center whitespace-nowrap"
                        >
                            <UserPlus size={16} className="mr-2" /> Provision Node
                        </button>
                    </div>
                </div>

                {/* View Content */}
                {activeView === 'REQUESTS' ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {filteredRequests.length === 0 ? (
                            <div className="col-span-full py-40 text-center bg-slate-950/50 border border-white/5 rounded-[4rem]">
                                <Activity size={80} className="mx-auto text-slate-900 mb-8" />
                                <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">No Signal Detected in Pipeline</p>
                            </div>
                        ) : filteredRequests.map(req => (
                            <div key={req.id} className="bg-slate-900 border border-white/5 p-12 rounded-[3.5rem] hover:border-emerald-500/20 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-5"><ShieldCheck size={160} /></div>
                                <div className="flex justify-between items-start mb-10 relative z-10">
                                    <div>
                                        <h3 className="text-3xl font-black text-white tracking-tighter leading-none mb-2">{req.userName}</h3>
                                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{req.userEmail}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[8px] font-black px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full uppercase tracking-widest">Audit Required</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12 relative z-10">
                                    <div className="bg-black/50 p-6 rounded-[1.5rem] border border-white/5">
                                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Gate Token</p>
                                        <p className="text-xs font-black text-slate-300 font-mono tracking-tighter">{req.transactionId}</p>
                                    </div>
                                    <div className="bg-black/50 p-6 rounded-[1.5rem] border border-white/5">
                                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Origin Phone</p>
                                        <p className="text-xs font-black text-slate-300">{req.paymentPhone}</p>
                                    </div>
                                    <div className="bg-black/50 p-6 rounded-[1.5rem] border border-white/5">
                                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Log Date</p>
                                        <p className="text-xs font-black text-slate-500 uppercase">{new Date(req.date).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-4 relative z-10 pt-6 border-t border-white/5">
                                    <button 
                                        onClick={() => approveSignup(req.id)}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center active:scale-95"
                                    >
                                        <CheckCircle2 size={18} className="mr-3" /> Authorize Entry
                                    </button>
                                    <button 
                                        onClick={() => rejectSignup(req.id)}
                                        className="px-10 bg-white/5 hover:bg-red-500/20 text-slate-600 hover:text-red-500 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border border-white/5"
                                    >
                                        Purge
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-white/5 rounded-[4rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-black border-b border-white/5">
                                    <tr>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">Entity Signature</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">Sector Remit</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">Onboarding Status</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">Fiscal Health</th>
                                        <th className="px-10 py-8 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Node Protocol</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredUsers.length === 0 ? (
                                        <tr><td colSpan={5} className="px-10 py-32 text-center text-slate-700 font-bold uppercase tracking-[0.3em]">No registered nodes matched the query</td></tr>
                                    ) : filteredUsers.map(u => (
                                        <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-5">
                                                    <div className="w-12 h-12 bg-black rounded-2xl border border-white/10 flex items-center justify-center text-emerald-500 font-black text-xl group-hover:scale-110 transition-transform">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white text-base tracking-tight">{u.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-600">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <p className="font-black text-slate-300 text-xs tracking-tighter uppercase">{u.companyName || 'Corporate Node'}</p>
                                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1.5">{u.businessType || u.sector}</p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${u.setupComplete ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-amber-500/20 text-amber-500 bg-amber-500/5'}`}>
                                                    {u.setupComplete ? 'Synchronized' : 'Incomplete'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{u.activationStatus}</span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => deleteUser(u.id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all" title="Purge Node"><Trash2 size={18}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* PROVISION MODAL */}
            {showProvisionModal && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] p-4 backdrop-blur-3xl animate-in fade-in duration-500">
                    <div className="bg-slate-900 border border-white/10 rounded-[4rem] w-full max-w-4xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-12 border-b border-white/5 flex justify-between items-start">
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <Shield size={24} className="text-emerald-500" />
                                    <h3 className="text-3xl font-black text-white tracking-tighter leading-none uppercase">Manual Node Provisioning</h3>
                                </div>
                                <p className="text-slate-500 font-medium text-lg">Direct administrative injection of organizational identities.</p>
                            </div>
                            <button onClick={() => setShowProvisionModal(false)} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:rotate-90 transition-all"><X size={24}/></button>
                        </div>

                        <form onSubmit={handleProvision} className="p-12 space-y-12 overflow-y-auto scrollbar-thin">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Primary Administrator Name</label>
                                    <input required className="w-full bg-black border border-white/10 p-6 rounded-[1.5rem] text-white font-black outline-none focus:border-emerald-500/50 transition-all shadow-inner" placeholder="Full Name" value={provisionForm.name} onChange={e => setProvisionForm({...provisionForm, name: e.target.value})} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Authorized Work Email</label>
                                    <input required type="email" className="w-full bg-black border border-white/10 p-6 rounded-[1.5rem] text-white font-black outline-none focus:border-emerald-500/50 transition-all shadow-inner" placeholder="email@address.ug" value={provisionForm.email} onChange={e => setProvisionForm({...provisionForm, email: e.target.value})} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Corporate Legal Entity</label>
                                    <input required className="w-full bg-black border border-white/10 p-6 rounded-[1.5rem] text-white font-black outline-none focus:border-emerald-500/50 transition-all shadow-inner" placeholder="Company Name" value={provisionForm.companyName} onChange={e => setProvisionForm({...provisionForm, companyName: e.target.value})} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Initial Security Key</label>
                                    <input required type="password" className="w-full bg-black border border-white/10 p-6 rounded-[1.5rem] text-white font-black outline-none focus:border-emerald-500/50 transition-all shadow-inner tracking-widest" placeholder="Set Password" value={provisionForm.password} onChange={e => setProvisionForm({...provisionForm, password: e.target.value})} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Business Vertical</label>
                                    <select className="w-full bg-black border border-white/10 p-6 rounded-[1.5rem] text-white font-black outline-none focus:border-emerald-500/50 transition-all shadow-inner uppercase tracking-widest text-[11px]" value={provisionForm.sector} onChange={e => setProvisionForm({...provisionForm, sector: e.target.value as Sector})}>
                                        <option value="GENERAL">General Agriculture</option>
                                        <option value="EXPORT">Export Hub</option>
                                        <option value="FARMING">Primary Production</option>
                                        <option value="LIVESTOCK">Livestock Control</option>
                                        <option value="PROCESSING">Value Addition</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Node Authorization Role</label>
                                    <select className="w-full bg-black border border-white/10 p-6 rounded-[1.5rem] text-white font-black outline-none focus:border-emerald-500/50 transition-all shadow-inner uppercase tracking-widest text-[11px]" value={provisionForm.role} onChange={e => setProvisionForm({...provisionForm, role: e.target.value as any})}>
                                        <option value="ADMIN">Corporate Admin</option>
                                        <option value="STAFF">Standard Staff Node</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-white/5 flex justify-end gap-6">
                                <button type="button" onClick={() => setShowProvisionModal(false)} className="px-12 py-5 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Discard</button>
                                <button 
                                    type="submit" 
                                    disabled={isProvisioning}
                                    className="bg-emerald-600 text-white px-20 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center disabled:opacity-50"
                                >
                                    {isProvisioning ? <><RefreshCw size={18} className="mr-3 animate-spin" /> Provisioning...</> : <><SendHorizontal size={18} className="mr-3" /> Authorize & Inject Node</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <footer className="p-8 text-center text-slate-800 text-[9px] font-black uppercase tracking-[0.6em] shrink-0 border-t border-white/5">
                Executive Command Hub • Layers of Authority • Built for UG-Central • © 2026
            </footer>
        </div>
    );
}