
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { NexaLogo } from '../components/NexaLogo';
import { 
    Users, ShieldCheck, UserMinus, CheckCircle2, XCircle, 
    Smartphone, Mail, Hash, Building, Globe, Filter, 
    Search, LogOut, RefreshCw, Trash2, Ban, Settings, Activity, 
    Wallet, Landmark, UserPlus, X, Shield, Lock, ChevronRight, 
    LayoutDashboard, Briefcase, Plus, SendHorizontal, MoreHorizontal,
    FileText, Download, TrendingUp, AlertTriangle
} from 'lucide-react';
import { User, PendingSignup, Sector, ActivationStatus } from '../types';

export default function AdminPortal() {
    const { logout, pendingSignups, approveSignup, rejectSignup, getAllUsers, deleteUser, changeUserStatus, register } = useApp();
    const [activeView, setActiveView] = useState<'USERS' | 'REQUESTS' | 'AUDIT'>('REQUESTS');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
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
        const loadData = async () => {
            setIsLoading(true);
            // Simulate API fetch delay for skeleton loading
            await new Promise(r => setTimeout(r, 800));
            setUsers(getAllUsers());
            setIsLoading(false);
        };
        loadData();
    }, [pendingSignups, activeView, getAllUsers]);

    const filteredUsers = useMemo(() => 
        users.filter(u => 
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        ), [users, searchTerm]);

    const filteredRequests = useMemo(() => 
        pendingSignups.filter(r => 
            r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            r.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
        ), [pendingSignups, searchTerm]);

    const handleProvision = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProvisioning(true);
        try {
            const res = await register(
                provisionForm.email,
                provisionForm.password,
                {
                  full_name: provisionForm.name,
                  company_name: provisionForm.companyName,
                  business_type: provisionForm.businessType,
                  sector: provisionForm.sector,
                  role: provisionForm.role,
                  activationStatus: 'ACTIVE',
                  setupComplete: false 
                }
            );
            if (res.success) {
                setShowProvisionModal(false);
                setProvisionForm({ name: '', email: '', password: '', companyName: '', businessType: 'General Agriculture', sector: 'GENERAL', role: 'ADMIN' });
                setActiveView('USERS');
            } else {
                alert(res.error || "Provisioning failed.");
            }
        } finally {
            setIsProvisioning(false);
        }
    };

    const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
        <div className="bg-slate-900 border border-white/5 p-6 rounded-[2.5rem] flex flex-col justify-between group hover:border-white/10 transition-all hover:bg-slate-900/80">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
                    <Icon size={20} className={color.replace('bg-', 'text-')} />
                </div>
                {trend && (
                    <div className="flex items-center space-x-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                        <TrendingUp size={10} />
                        <span className="text-[10px] font-black">{trend}</span>
                    </div>
                )}
            </div>
            <div className="mt-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                <h4 className="text-4xl font-black text-white tracking-tighter">{isLoading ? "..." : value}</h4>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-slate-300 font-sans selection:bg-emerald-500/30 flex flex-col">
            {/* Executive Header */}
            <header className="h-24 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl px-6 md:px-12 flex items-center justify-between sticky top-0 z-[100]">
                <div className="flex items-center space-x-8">
                    <NexaLogo className="h-8 md:h-10" light />
                    <div className="hidden lg:flex flex-col">
                        <h2 className="text-white font-black uppercase tracking-[0.3em] text-[10px]">Cloud Infrastructure</h2>
                        <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Instance: Active</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="hidden md:flex items-center space-x-3 px-6 py-2.5 bg-white/5 rounded-2xl border border-white/10">
                        <Activity size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audit Mode: Restricted</span>
                    </div>
                    <button onClick={logout} className="group flex items-center space-x-3 px-6 py-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/5">
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
                    </button>
                </div>
            </header>

            <main className="p-6 md:p-12 max-w-[1600px] mx-auto space-y-10 w-full flex-1">
                {/* Real-time KPI Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Total Nodes" value={users.length} icon={Globe} color="bg-blue-500" trend="+12%" />
                    <StatCard label="Audit Queue" value={pendingSignups.length} icon={ShieldCheck} color="bg-amber-500" />
                    <StatCard label="Production Load" value="High" icon={Activity} color="bg-purple-500" />
                    <StatCard label="System Integrity" value="99.9%" icon={Shield} color="bg-emerald-500" />
                </div>

                {/* Interface Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/30 p-2 rounded-[3rem] border border-white/5 backdrop-blur-sm">
                    <div className="flex wrap p-1 gap-1">
                        {[
                            { id: 'REQUESTS', label: 'Audit Pipeline', icon: ShieldCheck, count: pendingSignups.length },
                            { id: 'USERS', label: 'Cloud Directory', icon: Users, count: users.length },
                            { id: 'AUDIT', label: 'System Logs', icon: Activity }
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveView(tab.id as any)}
                                className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center group ${activeView === tab.id ? 'bg-white text-black shadow-2xl' : 'text-slate-500 hover:text-white'}`}
                            >
                                <tab.icon size={16} className={`mr-3 ${activeView === tab.id ? 'text-emerald-600' : 'text-slate-600 group-hover:text-slate-400'}`} />
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span className={`ml-3 px-2 py-0.5 rounded-full text-[9px] ${activeView === tab.id ? 'bg-black text-white' : 'bg-white/5 text-slate-500'}`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4 px-3 flex-1 lg:max-w-xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                            <input 
                                className="w-full pl-14 pr-6 py-4 bg-black border border-white/5 rounded-[2rem] outline-none font-bold text-sm text-white focus:border-emerald-500/30 transition-all placeholder:text-slate-800"
                                placeholder={`Filter ${activeView === 'REQUESTS' ? 'audits' : 'nodes'} in database...`}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setShowProvisionModal(true)}
                            className="bg-emerald-600 text-white px-10 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center whitespace-nowrap hover:bg-emerald-500"
                        >
                            <Plus size={18} className="mr-2" /> Inject Node
                        </button>
                    </div>
                </div>

                {/* View Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeView === 'REQUESTS' ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {filteredRequests.length === 0 ? (
                                <div className="col-span-full py-40 text-center bg-slate-950/50 border border-white/5 rounded-[4rem] border-dashed">
                                    <Activity size={60} className="mx-auto text-slate-900 mb-8" />
                                    <p className="text-slate-700 font-black uppercase tracking-[0.6em] text-[10px]">No Authorization Requests Pending</p>
                                </div>
                            ) : filteredRequests.map(req => (
                                <div key={req.id} className="bg-slate-900 border border-white/5 p-10 md:p-14 rounded-[4rem] hover:border-emerald-500/20 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck size={200} /></div>
                                    <div className="flex flex-col md:flex-row justify-between items-start mb-12 relative z-10 gap-6">
                                        <div>
                                            <h3 className="text-4xl font-black text-white tracking-tighter leading-none mb-4">{req.userName}</h3>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center text-slate-500 space-x-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                                                    <Mail size={12} className="text-emerald-500" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{req.userEmail}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl flex flex-col items-center justify-center">
                                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Awaiting Key</p>
                                            <p className="text-xl font-black text-white tracking-tighter">LEVEL 1</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
                                        <div className="bg-black/50 p-6 rounded-3xl border border-white/5 shadow-inner">
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center"><Hash size={10} className="mr-1.5" /> Core Token</p>
                                            <p className="text-xs font-black text-slate-300 font-mono tracking-tighter truncate">{req.transactionId}</p>
                                        </div>
                                        <div className="bg-black/50 p-6 rounded-3xl border border-white/5 shadow-inner">
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center"><Smartphone size={10} className="mr-1.5" /> Origin Link</p>
                                            <p className="text-xs font-black text-slate-300">{req.paymentPhone}</p>
                                        </div>
                                        <div className="bg-black/50 p-6 rounded-3xl border border-white/5 shadow-inner">
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center"><Activity size={10} className="mr-1.5" /> Log Date</p>
                                            <p className="text-xs font-black text-slate-500 uppercase">{new Date(req.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 relative z-10 pt-10 border-t border-white/5">
                                        <button 
                                            onClick={() => approveSignup(req.id)}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center group active:scale-95"
                                        >
                                            Authorize Access <CheckCircle2 size={18} className="ml-3 group-hover:scale-125 transition-transform" />
                                        </button>
                                        <button 
                                            onClick={() => rejectSignup(req.id)}
                                            className="px-12 bg-white/5 hover:bg-red-500/20 text-slate-600 hover:text-red-500 py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest transition-all border border-white/5 flex items-center justify-center group"
                                        >
                                            Reject <XCircle size={18} className="ml-3 opacity-50 group-hover:opacity-100" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activeView === 'USERS' ? (
                        <div className="bg-slate-900/50 border border-white/5 rounded-[4rem] overflow-hidden backdrop-blur-md">
                            <div className="overflow-x-auto scrollbar-thin">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950 border-b border-white/5">
                                        <tr>
                                            <th className="px-10 py-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Entity & Identity</th>
                                            <th className="px-10 py-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Sector Remit</th>
                                            <th className="px-10 py-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Synch Status</th>
                                            <th className="px-10 py-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Protocol Role</th>
                                            <th className="px-10 py-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {isLoading ? (
                                            [1,2,3,4,5].map(i => (
                                                <tr key={i} className="animate-pulse">
                                                    <td colSpan={5} className="px-10 py-10"><div className="h-10 bg-white/5 rounded-2xl w-full" /></td>
                                                </tr>
                                            ))
                                        ) : filteredUsers.length === 0 ? (
                                            <tr><td colSpan={5} className="px-10 py-40 text-center text-slate-700 font-bold uppercase tracking-[0.4em]">No database entries matched the query</td></tr>
                                        ) : filteredUsers.map(u => (
                                            <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-10 py-10">
                                                    <div className="flex items-center space-x-6">
                                                        <div className="w-14 h-14 bg-slate-800 rounded-3xl border border-white/10 flex items-center justify-center text-white font-black text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-2xl">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-white text-lg tracking-tight leading-none mb-2">{u.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-10">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                            <Building size={14} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-200 text-xs tracking-tighter uppercase">{u.companyName || 'N/A'}</p>
                                                            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1">{u.businessType || u.sector}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-10">
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`w-2 h-2 rounded-full ${u.setupComplete ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${u.setupComplete ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                            {u.setupComplete ? 'Synchronized' : 'Incomplete'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-10">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border ${u.role === 'ADMIN' ? 'border-purple-500/30 text-purple-500 bg-purple-500/5' : 'border-slate-500/30 text-slate-500 bg-slate-500/5'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-10 text-right">
                                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => changeUserStatus(u.id, u.activationStatus === 'ACTIVE' ? 'PENDING' : 'ACTIVE')}
                                                            className="p-3 text-slate-500 hover:bg-slate-500/10 rounded-2xl transition-all" 
                                                            title="Toggle Node Status"
                                                        >
                                                            <Ban size={18}/>
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteUser(u.id)} 
                                                            className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all" 
                                                            title="Purge Node"
                                                        >
                                                            <Trash2 size={18}/>
                                                        </button>
                                                        <button className="p-3 text-white hover:bg-white/10 rounded-2xl transition-all">
                                                            <MoreHorizontal size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 bg-slate-900/50 rounded-[4rem] border border-white/5 p-12">
                                <h3 className="text-2xl font-black text-white tracking-tight mb-10 flex items-center">
                                    <Activity size={24} className="mr-4 text-emerald-500" /> Administrative Feed
                                </h3>
                                <div className="space-y-8">
                                    {[1,2,3,4,5].map(i => (
                                        <div key={i} className="flex space-x-6 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-4 h-4 rounded-full border-2 border-emerald-500 bg-black group-hover:bg-emerald-500 transition-all shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                <div className="w-0.5 h-full bg-white/5 mt-2" />
                                            </div>
                                            <div className="flex-1 pb-8 border-b border-white/5">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Entry #{2024 + i}</p>
                                                <p className="text-white font-bold text-lg mb-2">Cloud Node {i * 12} Provisioned</p>
                                                <p className="text-slate-500 text-sm leading-relaxed mb-4">Manual administrative injection completed by root user. Authorization token: NX-00{i}-BASE.</p>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-[10px] font-bold text-slate-600 bg-white/5 px-3 py-1 rounded-lg">ID: 0x442{i}</span>
                                                    <span className="text-[10px] font-bold text-slate-600">14:2{i} PM</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-10">
                                <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><Activity size={160} /></div>
                                    <h4 className="text-xl font-black mb-4 relative z-10">Global Integrity</h4>
                                    <p className="text-emerald-100 text-sm leading-relaxed mb-8 relative z-10">All cloud instances are currently synchronized with the Uganda-Central database cluster.</p>
                                    <div className="relative z-10 flex items-center justify-between bg-black/20 p-4 rounded-2xl backdrop-blur-md">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Database Latency</span>
                                        <span className="font-bold font-mono">4.2ms</span>
                                    </div>
                                </div>
                                <div className="bg-slate-900 border border-white/5 p-10 rounded-[3rem]">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Security Protocols</h4>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'TLS v3 Protection', active: true },
                                            { label: 'Cloudflare Proxying', active: true },
                                            { label: 'UCDA Compliance', active: true },
                                            { label: 'Auto-Encryption', active: false },
                                        ].map(p => (
                                            <div key={p.label} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                                                <span className="text-xs font-bold text-slate-300">{p.label}</span>
                                                {p.active ? <CheckCircle2 size={16} className="text-emerald-500" /> : <RefreshCw size={16} className="text-slate-700 animate-spin" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* PROVISION MODAL */}
            {showProvisionModal && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] p-4 backdrop-blur-3xl animate-in fade-in duration-500">
                    <div className="bg-slate-900 border border-white/10 rounded-[4rem] w-full max-w-4xl shadow-[0_0_150px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[95vh]">
                        <div className="p-12 border-b border-white/5 flex justify-between items-start bg-slate-950/50">
                            <div>
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="p-3 bg-emerald-600/10 rounded-2xl text-emerald-600">
                                        <Shield size={28} />
                                    </div>
                                    <h3 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">Manual Node Provisioning</h3>
                                </div>
                                <p className="text-slate-500 font-medium text-lg">Administrative injection of organizational identities into the global registry.</p>
                            </div>
                            <button onClick={() => setShowProvisionModal(false)} className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:rotate-90 transition-all hover:bg-white/10"><X size={32}/></button>
                        </div>

                        <form onSubmit={handleProvision} className="p-12 space-y-12 overflow-y-auto scrollbar-thin flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] px-6">Administrative Contact</label>
                                    <div className="space-y-4">
                                        <input required className="w-full bg-black border border-white/5 p-6 rounded-[2rem] text-white font-black outline-none focus:border-emerald-500/50 transition-all shadow-inner text-lg" placeholder="Legal Full Name" value={provisionForm.name} onChange={e => setProvisionForm({...provisionForm, name: e.target.value})} />
                                        <input required type="email" className="w-full bg-black border border-white/5 p-6 rounded-[2rem] text-white font-black outline-none focus:border-emerald-500/50 transition-all shadow-inner text-lg" placeholder="email@nexus.ug" value={provisionForm.email} onChange={e => setProvisionForm({...provisionForm, email: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] px-6">Corporate Identity</label>
                                    <div className="space-y-4">
                                        <input required className="w-full bg-black border border-white/5 p-6 rounded-[2rem] text-white font-black outline-none focus:border-emerald-500/50 transition-all shadow-inner text-lg" placeholder="Company Legal Entity" value={provisionForm.companyName} onChange={e => setProvisionForm({...provisionForm, companyName: e.target.value})} />
                                        <input required type="password" className="w-full bg-black border border-white/5 p-6 rounded-[2rem] text-white font-black outline-none focus:border-emerald-500/50 transition-all shadow-inner text-lg tracking-widest" placeholder="Set Temporary Access Key" value={provisionForm.password} onChange={e => setProvisionForm({...provisionForm, password: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] px-6">Market Vertical</label>
                                    <select className="w-full bg-black border border-white/5 p-6 rounded-[2rem] text-white font-black outline-none focus:border-emerald-500/50 transition-all shadow-inner uppercase tracking-widest text-[11px] appearance-none" value={provisionForm.sector} onChange={e => setProvisionForm({...provisionForm, sector: e.target.value as Sector})}>
                                        <option value="GENERAL">General Agriculture Hub</option>
                                        <option value="EXPORT">Global Export Terminal</option>
                                        <option value="FARMING">Primary Production Node</option>
                                        <option value="LIVESTOCK">Livestock Data Control</option>
                                        <option value="PROCESSING">Value Addition Unit</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] px-6">Authority Level</label>
                                    <select className="w-full bg-black border border-white/5 p-6 rounded-[2rem] text-white font-black outline-none focus:border-emerald-500/50 transition-all shadow-inner uppercase tracking-widest text-[11px] appearance-none" value={provisionForm.role} onChange={e => setProvisionForm({...provisionForm, role: e.target.value as any})}>
                                        <option value="ADMIN">Root Administrator</option>
                                        <option value="STAFF">Standard Operational Node</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-10 flex flex-col sm:flex-row items-center justify-end gap-6">
                                <button type="button" onClick={() => setShowProvisionModal(false)} className="px-12 py-6 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Discard Draft</button>
                                <button 
                                    type="submit" 
                                    disabled={isProvisioning}
                                    className="bg-emerald-600 text-white px-20 py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center disabled:opacity-50 min-w-[320px] justify-center hover:bg-emerald-500"
                                >
                                    {isProvisioning ? <><RefreshCw size={22} className="mr-4 animate-spin" /> Finalizing Node...</> : <><SendHorizontal size={22} className="mr-4" /> Authorize & Provision</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <footer className="h-20 flex items-center justify-center border-t border-white/5 bg-slate-950/50 backdrop-blur-xl">
                <p className="text-slate-800 text-[9px] font-black uppercase tracking-[0.8em]">
                    Enterprise Management Architecture • Layer 4 Security • © 2026 NexaAgri Intelligence
                </p>
            </footer>
        </div>
    );
}
