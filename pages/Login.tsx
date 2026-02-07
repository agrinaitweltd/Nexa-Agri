import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, Link } = ReactRouterDOM as any;
import { Eye, EyeOff, Mail, Lock, Building, AlertCircle, Sparkles, RefreshCw, Smartphone, Home, ArrowRight } from 'lucide-react';
import { NexaLogo } from '../components/NexaLogo';

type AuthView = 'LOGIN' | 'SIGNUP' | 'AWAITING';

export default function Login() {
  const { login, register } = useApp();
  const navigate = useNavigate();

  const [view, setView] = useState<AuthView>('LOGIN');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (view === 'LOGIN') {
        const res = await login(email, password);
        if (res.success) navigate('/app');
        else setError(res.error || 'Authentication failed.');
      } else {
        const res = await register(email, password, { full_name: name, company_name: companyName });
        if (res.success) setView('AWAITING');
        else setError(res.error || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Branding Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-nexa-dark flex-col justify-between p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nexa-blue rounded-full blur-[140px] opacity-20"></div>
        <div className="relative z-10">
          <NexaLogo className="h-12" light />
          <h1 className="text-6xl font-black tracking-tighter mt-12 mb-6 leading-none">The Cloud for<br/>Agribusiness.</h1>
          <p className="text-nexa-blue text-xl font-medium max-w-md">Enterprise resource management for farming and export sectors.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-16 bg-slate-50 relative">
        <div className="absolute top-8 left-8">
            <Link to="/" className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Home size={14} /> <span>Home</span>
            </Link>
        </div>

        <div className="w-full max-w-md space-y-10 animate-in fade-in duration-500">
            {view === 'AWAITING' ? (
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verify Email</h2>
                    <p className="text-slate-500 leading-relaxed">We sent an activation link to {email}. Please check your inbox.</p>
                    <button onClick={() => setView('LOGIN')} className="text-emerald-600 font-bold hover:underline">Back to Sign In</button>
                </div>
            ) : (
                <>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                            {view === 'LOGIN' ? 'Sign In' : 'Get Started'}
                        </h2>
                        <p className="text-slate-500 text-lg">Secure access to your enterprise hub.</p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 text-xs rounded-2xl flex items-center border border-red-100">
                                <AlertCircle size={18} className="mr-2 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {view === 'SIGNUP' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Full Name</label>
                                        <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border-none rounded-[1.5rem] px-6 py-4 bg-white shadow-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Company Name</label>
                                        <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full border-none rounded-[1.5rem] px-6 py-4 bg-white shadow-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none" placeholder="Acme Agri Ltd" />
                                    </div>
                                </>
                            )}
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Email Address</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border-none rounded-[1.5rem] px-6 py-4 bg-white shadow-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none" placeholder="admin@company.com" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="w-full border-none rounded-[1.5rem] px-6 py-4 bg-white shadow-sm font-bold focus:ring-4 focus:ring-emerald-500/5 outline-none" placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={isLoading}
                            className="w-full bg-nexa-dark text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center group"
                        >
                            {isLoading ? <RefreshCw className="animate-spin" size={20} /> : view === 'LOGIN' ? 'Sign In' : 'Sign Up'}
                            {!isLoading && <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />}
                        </button>

                        <div className="text-center text-sm font-medium text-slate-500">
                            {view === 'LOGIN' ? (
                                <>No account? <button type="button" onClick={() => setView('SIGNUP')} className="text-emerald-600 font-bold ml-1">Register Hub</button></>
                            ) : (
                                <>Existing hub? <button type="button" onClick={() => setView('LOGIN')} className="text-emerald-600 font-bold ml-1">Sign In</button></>
                            )}
                        </div>
                    </form>
                </>
            )}
        </div>
      </div>
    </div>
  );
}