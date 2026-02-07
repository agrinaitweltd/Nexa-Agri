import React, { useState, useEffect } from 'react';
import { useApp, MOCK_AUTH } from '../context/AppContext';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, useLocation, Link } = ReactRouterDOM as any;
import { Eye, EyeOff, Search, ChevronDown, ArrowRight, Globe2, Mail, Lock, Building, AlertCircle, CheckCircle2, FlaskConical, ShieldAlert, Sparkles, RefreshCw, Smartphone, Landmark, ClipboardCheck, Phone, X, Shield, Lock as LockIcon, Home } from 'lucide-react';
import { BUSINESS_CATEGORIES, mapTypeToSector } from '../services/businessCategories';
import { NexaLogo } from '../components/NexaLogo';
import { User } from '../types';

const AFRICAN_COUNTRIES = [
    "Kenya", "Uganda", "Tanzania", "Nigeria", "Ghana", "South Africa", "Rwanda", "Ethiopia", 
    "Egypt", "Morocco", "Mauritius", "Zambia", "Botswana", "Namibia", "Senegal", "Ivory Coast"
].sort();

const UG_BANKS = ["Stanbic Bank", "Equity Bank", "Absa Bank", "Centenary Bank", "Standard Chartered", "DFCU Bank", "KCB Bank"];

type AuthView = 'LOGIN' | 'SIGNUP' | 'PAYMENT' | 'VERIFICATION' | 'AWAITING' | 'REJECTED' | 'LIMIT';

export default function Login() {
  const { login, register, submitVerification, resetUserStatus } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isAdminLogin = queryParams.get('mode') === 'admin';

  const [view, setView] = useState<AuthView>('LOGIN');
  
  // States
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Comprehensive Signup State
  const [name, setName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Uganda');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Password Strength State
  const [strength, setStrength] = useState({ score: 0, label: 'Weak', color: 'bg-red-500' });

  // Verification Form State
  const [txId, setTxId] = useState('');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [payMethod, setPayMethod] = useState<'MTN' | 'AIRTEL' | 'BANK'>('MTN');
  const [selectedBank, setSelectedBank] = useState(UG_BANKS[0]);
  const [accountName, setAccountName] = useState('');

  useEffect(() => {
      calculateStrength(newPassword);
  }, [newPassword]);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;

    let label = 'Weak';
    let color = 'bg-red-500';

    if (score === 2 || score === 3) {
        label = 'Moderate';
        color = 'bg-yellow-500';
    } else if (score === 4) {
        label = 'Strong';
        color = 'bg-emerald-500';
    }

    setStrength({ score, label, color });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const result = await login(email, password);
        if (result === true) {
            navigate('/app', { replace: true });
        } else if (result === 'PENDING') {
            setView('AWAITING');
            setIsLoading(false);
        } else if (result === 'REJECTED') {
            setView('REJECTED');
            setIsLoading(false);
        } else if (result === 'LIMIT_REACHED') {
            setView('LIMIT');
            setIsLoading(false);
        } else if (result === 'INVALID') {
            setError("Incorrect email or password. Please try again.");
            setIsLoading(false);
        } else {
            setError("Network authentication failure.");
            setIsLoading(false);
        }
    } catch (err) {
        setError("System error during authentication.");
        setIsLoading(false);
    }
  };

  const handleInitialSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (strength.label !== 'Strong') {
        setError("Password safety protocols not met. Strength must be 'Strong'.");
        return;
    }

    if (!name || !newEmail || !companyName || !selectedType) {
        setError("All fields are required to initialize your corporate account.");
        return;
    }

    setIsLoading(true);
    const sector = mapTypeToSector(selectedType || '', selectedCategory || '');
    
    try {
        const result = await register({
            name,
            email: newEmail,
            password: newPassword,
            companyName,
            businessCategory: selectedCategory || "General",
            businessType: selectedType,
            sector,
            role: 'ADMIN',
            preferredCurrency: 'UGX',
            location: selectedCountry
        });

        if (result.success && result.user) {
            setPendingUser(result.user);
            setView('PAYMENT');
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    } catch (err) {
        setError("Sign up failed.");
        setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!txId || !paymentPhone) {
          setError("Please provide all transaction verification details.");
          return;
      }

      if (paymentPhone.length > 11) {
          setError("Payment phone number must not exceed 11 characters.");
          return;
      }
      
      setIsLoading(true);
      await submitVerification({
          userId: pendingUser?.id || '',
          userName: pendingUser?.name || '',
          userEmail: pendingUser?.email || '',
          transactionId: txId,
          paymentPhone,
          paymentMethod: payMethod,
          bankName: payMethod === 'BANK' ? selectedBank : undefined,
          accountName: payMethod === 'BANK' ? accountName : undefined
      });
      
      setView('AWAITING');
      setIsLoading(false);
  };

  const filteredCategories = BUSINESS_CATEGORIES.map(cat => ({
      ...cat,
      types: cat.types.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(cat => cat.types.length > 0 || cat.category.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Branding Side - Left */}
      <div className="hidden lg:flex lg:w-1/2 bg-nexa-dark flex-col justify-between p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nexa-blue rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-nexa-green rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 opacity-20"></div>

        <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-12">
              <NexaLogo className="h-12" light />
              <div className="w-px h-8 bg-white/20 mx-2"></div>
              <h2 className="text-2xl font-black tracking-tighter text-white uppercase tracking-widest">{isAdminLogin ? 'Executive' : 'Enterprise'}</h2>
            </div>
            <h1 className="text-6xl font-black tracking-tighter mb-6 leading-[0.9] text-white">Digitize Your <br/>Value Chain.</h1>
            <p className="text-nexa-blue text-xl opacity-90 font-medium max-w-md">The modern mission-critical operating system for the global agricultural market.</p>
        </div>

        <div className="relative z-10 space-y-12">
            <div className="grid grid-cols-2 gap-12">
                <div className="space-y-3">
                    <CheckCircle2 className="text-nexa-green" size={28} />
                    <h4 className="font-black uppercase tracking-widest text-xs">Real-time Stock</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">End-to-end inventory monitoring across multiple warehouse hubs.</p>
                </div>
                <div className="space-y-3">
                    <CheckCircle2 className="text-nexa-blue" size={28} />
                    <h4 className="font-black uppercase tracking-widest text-xs">Export Control</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">International manifest automation and real-time shipment tracking.</p>
                </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/5 w-fit px-8 py-4 rounded-[2.5rem] backdrop-blur-3xl border border-white/10 shadow-2xl">
                <Globe2 className="text-nexa-blue" size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Regional Market Integrity</span>
            </div>
        </div>
      </div>

      {/* Form Side - Right */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-16 overflow-y-auto bg-slate-50/50 relative">
        {/* Back to Homepage Button */}
        <div className="absolute top-8 left-8 z-20">
            <Link 
                to="/" 
                className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all active:scale-95"
            >
                <Home size={14} />
                <span>Back to Home</span>
            </Link>
        </div>

        <div className="w-full max-w-lg space-y-10 animate-in fade-in zoom-in duration-500 py-20 flex flex-col min-h-full">
            
            {/* LOGIN VIEW */}
            {view === 'LOGIN' && (
                <div className="flex-1">
                    <div className="mb-12 lg:hidden flex justify-center">
                        <NexaLogo className="h-12" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">{isAdminLogin ? 'Sign In' : 'Sign In'}</h2>
                        <p className="text-slate-500 font-medium text-lg">{isAdminLogin ? 'Authorized Executive Credentials Required.' : 'Secure verification for enterprise hub entry.'}</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 mt-12">
                        {error && (
                            <div className="p-6 bg-red-50 text-red-600 text-xs rounded-[1.5rem] flex items-start animate-in shake duration-300 font-black uppercase tracking-widest border border-red-100">
                                <AlertCircle size={20} className="mr-3 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-6">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        className="w-full border-none rounded-[2.5rem] pl-18 pr-8 py-5 text-slate-900 placeholder-slate-400 focus:ring-8 focus:ring-nexa-green/5 outline-none transition-all bg-white shadow-xl shadow-slate-200/50 font-bold" 
                                        placeholder={isAdminLogin ? "oliver.amanya1@gmail.com" : "admin@company.com"} 
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-6">Password</label>
                                    <button type="button" className="text-[9px] font-black text-slate-300 cursor-not-allowed uppercase tracking-[0.2em] px-6">Recovery Mode</button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        className="w-full border-none rounded-[2.5rem] pl-18 pr-18 py-5 text-slate-900 placeholder-slate-400 focus:ring-8 focus:ring-nexa-green/5 outline-none transition-all bg-white shadow-xl shadow-slate-200/50 font-bold" 
                                        placeholder="••••••••" 
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                        {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-nexa-dark text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex items-center justify-center group active:scale-95 text-xs disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : isAdminLogin ? 'Sign In' : 'Sign In'} 
                            {!isLoading && <ArrowRight size={20} className="ml-4 group-hover:translate-x-2 transition-transform" />}
                        </button>
                        
                        {!isAdminLogin && (
                            <div className="text-center pt-6">
                                <p className="text-sm text-slate-500 font-medium">
                                    No account? <button type="button" onClick={() => setView('SIGNUP')} className="text-nexa-green font-black hover:underline uppercase text-xs tracking-[0.1em] ml-2">Sign Up</button>
                                </p>
                            </div>
                        )}
                        {isAdminLogin && (
                            <div className="text-center pt-6">
                                <button type="button" onClick={() => navigate('/login')} className="text-slate-400 font-black uppercase text-[9px] tracking-widest hover:text-slate-900">User Sign In</button>
                            </div>
                        )}
                    </form>
                </div>
            )}

            {/* SIGNUP VIEW */}
            {view === 'SIGNUP' && (
                <div className="flex-1">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">Sign Up</h2>
                        <p className="text-slate-500 font-medium text-lg">Create your corporate account on the NexaAgri cloud.</p>
                    </div>

                    <form onSubmit={handleInitialSignup} className="space-y-8 mt-12 pb-16">
                        {error && (
                            <div className="p-6 bg-red-50 text-red-600 text-xs rounded-[1.5rem] flex items-start animate-in shake duration-300 font-black uppercase tracking-widest border border-red-100">
                                <AlertCircle size={20} className="mr-3 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest px-6">Full Name</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-none bg-white rounded-[1.5rem] px-8 py-5 text-sm font-bold shadow-sm focus:ring-8 focus:ring-nexa-green/5 transition-all outline-none" placeholder="e.g. Samuel Kiptoo" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest px-6">Jurisdiction</label>
                                    <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className="w-full border-none bg-white rounded-[1.5rem] px-8 py-5 text-sm font-bold shadow-sm focus:ring-8 focus:ring-nexa-green/5 transition-all outline-none">
                                        {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest px-6">Email Address</label>
                                    <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full border-none bg-white rounded-[1.5rem] px-8 py-5 text-sm font-bold shadow-sm focus:ring-8 focus:ring-nexa-green/5 transition-all outline-none" placeholder="office@company.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest px-6">Password</label>
                                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border-none bg-white rounded-[1.5rem] px-8 py-5 text-sm font-bold shadow-sm focus:ring-8 focus:ring-nexa-green/5 transition-all outline-none" placeholder="Secure Password" />
                                </div>
                            </div>

                            <div className="px-6 space-y-4 bg-slate-100/50 p-6 rounded-[2rem] border border-slate-200">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strength: <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span></p>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`h-1.5 w-10 rounded-full transition-all duration-700 ${strength.score >= i ? strength.color : 'bg-slate-300'}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                     <div className={`flex items-center text-[9px] font-black uppercase tracking-tighter ${newPassword.length >= 8 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                         <CheckCircle2 size={10} className="mr-1.5" /> 8+ Characters
                                     </div>
                                     <div className={`flex items-center text-[9px] font-black uppercase tracking-tighter ${/[A-Z]/.test(newPassword) ? 'text-emerald-500' : 'text-slate-400'}`}>
                                         <CheckCircle2 size={10} className="mr-1.5" /> Uppercase Let.
                                     </div>
                                     <div className={`flex items-center text-[9px] font-black uppercase tracking-tighter ${/[0-9]/.test(newPassword) ? 'text-emerald-500' : 'text-slate-400'}`}>
                                         <CheckCircle2 size={10} className="mr-1.5" /> Number (0-9)
                                     </div>
                                     <div className={`flex items-center text-[9px] font-black uppercase tracking-tighter ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-emerald-500' : 'text-slate-400'}`}>
                                         <CheckCircle2 size={10} className="mr-1.5" /> Special Char.
                                     </div>
                                </div>
                            </div>

                            <div className="p-8 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-white shadow-inner space-y-8">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center px-4"><Building size={16} className="mr-4 text-nexa-blue" /> Business Identity</h4>
                                <div className="space-y-2">
                                    <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest px-6">Company Name</label>
                                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full border-none bg-white rounded-[1.5rem] px-8 py-5 text-sm font-bold shadow-sm focus:ring-8 focus:ring-nexa-blue/5 transition-all outline-none" placeholder="Global Trade Partners Ltd" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-[0.4em] px-8">Vertical Allocation</label>
                                    <div className="relative">
                                        <div className="w-full bg-white rounded-[2.5rem] px-10 py-6 text-sm cursor-pointer flex justify-between items-center shadow-xl shadow-slate-200/50 hover:ring-12 hover:ring-nexa-green/5 transition-all" onClick={() => setShowDropdown(true)}>
                                            <span className={`truncate font-black uppercase tracking-widest ${selectedType ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {selectedType || 'Select Agriculture Type'}
                                            </span>
                                            <ChevronDown className="text-slate-400 flex-shrink-0 ml-4" size={24} />
                                        </div>
                                        {showDropdown && (
                                            <div className="absolute z-20 left-0 w-full mt-4 bg-white rounded-[3rem] shadow-2xl border border-slate-100 max-h-96 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                                                <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                                                    <div className="flex items-center bg-white border border-slate-200 rounded-[1.5rem] px-6 py-4">
                                                        <Search size={20} className="text-slate-400 mr-4"/>
                                                        <input autoFocus className="w-full text-sm outline-none font-bold placeholder:font-medium" placeholder="Filter types..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="overflow-y-auto p-6 scrollbar-thin">
                                                    {filteredCategories.map((cat, idx) => (
                                                        <div key={idx} className="mb-8 last:mb-0">
                                                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] px-6 py-2 mb-4 border-l-4 border-slate-100">
                                                                {cat.category}
                                                            </div>
                                                            <div className="space-y-2">
                                                                {cat.types.map(t => (
                                                                    <div key={t} onClick={() => { setSelectedCategory(cat.category); setSelectedType(t); setShowDropdown(false); }} className="px-8 py-4 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-nexa-green rounded-[1.5rem] cursor-pointer transition-all">
                                                                        {t}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading || strength.label !== 'Strong'}
                            className="w-full bg-nexa-green text-white py-8 rounded-[3rem] font-black uppercase tracking-[0.4em] hover:bg-emerald-600 transition-all shadow-[0_30px_60px_-15px_rgba(0,223,130,0.4)] hover:scale-[1.02] active:scale-95 text-xs disabled:opacity-50 disabled:grayscale flex items-center justify-center"
                        >
                            {isLoading ? (
                                <><RefreshCw className="animate-spin mr-3" size={18} /> Initializing Account...</>
                            ) : (
                                <><Sparkles className="mr-3" size={18} /> Sign Up</>
                            )}
                        </button>
                        
                        <div className="text-center pt-2">
                            <p className="text-sm text-slate-500 font-medium">
                                Already have an account? <button type="button" onClick={() => setView('LOGIN')} className="text-nexa-green font-black uppercase text-xs tracking-[0.2em] ml-4 hover:underline">Sign In</button>
                            </p>
                        </div>
                    </form>
                </div>
            )}

            {/* PAYMENT INSTRUCTIONS VIEW */}
            {view === 'PAYMENT' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white mb-8 shadow-2xl">
                        <LockIcon size={32} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-none">Account Activation</h2>
                    <p className="text-slate-500 font-medium mb-10 max-w-sm">Initialization of your secure agricultural hub requires a monthly activation fee of <span className="font-black text-slate-900 underline">10,000 UGX</span>.</p>
                    
                    {/* Re-designed Card Layout */}
                    <div className="w-full perspective-1000 group">
                        <div className="w-full bg-gradient-to-br from-slate-900 to-black rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 text-white text-left overflow-hidden relative transition-all duration-700 hover:rotate-y-2 hover:scale-[1.02]">
                            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700"><Smartphone size={180}/></div>
                            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-nexa-blue rounded-full blur-[120px] opacity-10"></div>
                            
                            <div className="flex justify-between items-start mb-12">
                                <p className="text-[10px] font-black text-nexa-blue uppercase tracking-[0.4em]">Activation ID #9912</p>
                                <Globe2 size={24} className="text-nexa-blue opacity-50" />
                            </div>
                            
                            <div className="space-y-12 relative z-10">
                                <div>
                                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Mobile Money Recipient</p>
                                    <div className="flex items-center space-x-6">
                                        <div className="w-16 h-16 bg-amber-400 rounded-3xl flex items-center justify-center text-slate-900 font-black text-2xl shadow-xl">MTN</div>
                                        <div>
                                            <p className="text-3xl font-black text-white tracking-tighter leading-none">+256 768 638225</p>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">Nexa Intelligence Hub</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-end border-t border-white/5 pt-8">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Routing</p>
                                        <p className="font-bold text-nexa-green uppercase text-xs">Direct Activation • 10,000 UGX</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</p>
                                        <p className="font-black text-white uppercase text-xs animate-pulse">Awaiting Signal</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setView('VERIFICATION')}
                        className="w-full mt-10 bg-nexa-dark text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-emerald-600 transition-all hover:scale-[1.02] active:scale-95 text-xs"
                    >
                        Continue
                    </button>
                    <button onClick={() => setView('SIGNUP')} className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">Discard Request</button>
                </div>
            )}

            {/* VERIFICATION FORM VIEW */}
            {view === 'VERIFICATION' && (
                <div className="flex-1">
                    <button onClick={() => setView('PAYMENT')} className="mb-8 text-slate-400 flex items-center font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-all"><X size={16} className="mr-2"/> Instructions</button>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Verification</h2>
                    <p className="text-slate-500 font-medium mb-10 text-lg">Send your activation details to our team.</p>

                    <form onSubmit={handleVerificationSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-100 rounded-[1.5rem]">
                                {['MTN', 'AIRTEL', 'BANK'].map(m => (
                                    <button 
                                        key={m}
                                        type="button"
                                        onClick={() => setPayMethod(m as any)}
                                        className={`py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${payMethod === m ? 'bg-white text-nexa-dark shadow-md' : 'text-slate-400'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Transaction ID</label>
                                <input type="text" required value={txId} onChange={e => setTxId(e.target.value)} className="w-full border-none bg-white rounded-2xl px-8 py-5 font-black shadow-sm outline-none focus:ring-8 focus:ring-emerald-500/5 text-lg" placeholder="TX-882192" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Source Phone (Max 11 Chars)</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="tel" 
                                        required 
                                        maxLength={11}
                                        value={paymentPhone} 
                                        onChange={e => setPaymentPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} 
                                        className="w-full border-none bg-white rounded-2xl pl-14 pr-8 py-5 font-black shadow-sm outline-none focus:ring-8 focus:ring-emerald-500/5 text-lg" 
                                        placeholder="07XX XXX XXX" 
                                    />
                                </div>
                            </div>

                            {payMethod === 'BANK' && (
                                <div className="space-y-6 animate-in slide-in-from-top-4 duration-300 bg-slate-50 p-6 rounded-[2rem] border border-slate-200">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Select Bank</label>
                                        <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} className="w-full border-none bg-white rounded-2xl px-8 py-4 font-bold shadow-sm outline-none">
                                            {UG_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Account Name Used</label>
                                        <input type="text" required value={accountName} onChange={e => setAccountName(e.target.value)} className="w-full border-none bg-white rounded-2xl px-8 py-4 font-bold shadow-sm outline-none" placeholder="Account Holder Name" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center disabled:opacity-50 text-xs"
                        >
                            {isLoading ? 'Submitting...' : 'Verify Activation'}
                        </button>
                    </form>
                </div>
            )}

            {/* AWAITING APPROVAL VIEW */}
            {view === 'AWAITING' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-8 shadow-2xl animate-pulse">
                        <ClipboardCheck size={52} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-6">In Review</h2>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mb-12">Your account is currently in the review queue. We will notify you once our team activates your access.</p>
                    
                    <div className="p-10 bg-white rounded-[3rem] border border-blue-50 shadow-sm w-full relative">
                         <div className="flex items-center justify-center space-x-3 text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] mb-3">
                             <RefreshCw size={14} className="animate-spin" /> <span>Account Review Active</span>
                         </div>
                         <p className="text-xs text-slate-400 font-medium tracking-tight">Average response time: 2-4 business hours.</p>
                    </div>

                    <button 
                        onClick={() => { setView('LOGIN'); setEmail(''); setPassword(''); }}
                        className="mt-14 text-slate-400 hover:text-nexa-green font-black uppercase text-xs tracking-[0.2em] transition-colors flex items-center"
                    >
                        <ArrowRight size={18} className="mr-3 rotate-180" /> Back to Sign In
                    </button>
                </div>
            )}

            {/* REJECTED VIEW */}
            {view === 'REJECTED' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center animate-in shake duration-500">
                    <div className="w-24 h-24 bg-red-100 rounded-[2.5rem] flex items-center justify-center text-red-600 mb-8 shadow-xl">
                        <ShieldAlert size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-6">Access Denied</h2>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mb-12">Your sign up request was declined. Please check your verification details and try again.</p>
                    
                    <button 
                        onClick={() => {
                            if (email) resetUserStatus(email);
                            setView('SIGNUP');
                            setError('');
                        }}
                        className="w-full bg-nexa-dark text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-emerald-600 transition-all active:scale-95 text-xs"
                    >
                        Try Again
                    </button>
                    
                    <button onClick={() => setView('LOGIN')} className="mt-10 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors">Back to Sign In</button>
                </div>
            )}

            {/* LIMIT REACHED VIEW */}
            {view === 'LIMIT' && (
                <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-slate-950 rounded-[2.5rem] flex items-center justify-center text-red-500 mb-8 shadow-2xl">
                        <Shield size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-6">Blocked</h2>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mb-12">You have reached the maximum number of sign up attempts.</p>
                    
                    <div className="p-10 bg-red-50 rounded-[3rem] border border-red-100 shadow-sm w-full mb-12">
                         <p className="text-[11px] text-red-600 font-black uppercase tracking-[0.3em] mb-3">Account Blocked</p>
                         <p className="text-xs text-slate-600 font-medium leading-relaxed">Security protocols have restricted further attempts from this email. Please contact support for assistance.</p>
                    </div>

                    <button 
                        onClick={() => navigate('/app/help')}
                        className="w-full bg-nexa-dark text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-xl text-xs"
                    >
                        Contact Support
                    </button>
                    
                    <button onClick={() => setView('LOGIN')} className="mt-10 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors">Return Home</button>
                </div>
            )}

            {/* Attribution Footer */}
            <div className="pt-16 border-t border-slate-100 text-center mt-auto">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-2">
                    © 2026 NexaAgri Intelligence Ltd. All Rights Reserved.
                </p>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
                    Made and Powered By <a href="https://www.agrinaitwe.site" target="_blank" rel="noopener noreferrer" className="text-nexa-green hover:underline hover:text-emerald-600 transition-colors">Agrinaitwe Technologies</a>
                </p>
            </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
        }
        .animate-in.shake {
            animation: shake 0.4s ease-in-out;
        }
        .pl-18 { padding-left: 4.5rem; }
        .pr-18 { padding-right: 4.5rem; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}