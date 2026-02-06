import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Check, ShieldCheck, Zap, Star, Rocket, CreditCard, X, Lock, Info, Landmark, Phone, ArrowRight, Loader2, Smartphone, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { SubscriptionPlanId } from '../types';

type PaymentType = 'CARD' | 'MOMO';
type MomoProvider = 'MTN' | 'AIRTEL';
type TransactionStatus = 'IDLE' | 'INITIATING' | 'AWAITING_PIN' | 'VERIFYING' | 'SUCCESS' | 'FAILED';

export default function SubscriptionModal() {
  const { user, selectSubscription, formatCurrency } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType>('MOMO');
  const [momoProvider, setMomoProvider] = useState<MomoProvider>('MTN');
  const [txStatus, setTxStatus] = useState<TransactionStatus>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [phone, setPhone] = useState('');
  const [cardDetails, setCardDetails] = useState({
      cardholderName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
      country: user?.location || '',
      city: '',
      address: '',
      postalCode: ''
  });

  if (!user || user.subscriptionPlan || user.role === 'STAFF') return null;

  const plans: { id: SubscriptionPlanId; name: string; price: number; priceStr: string; period: string; icon: any; color: string; desc: string }[] = [
    { 
        id: 'MONTHLY', 
        name: 'Flexible Monthly', 
        price: 5,
        priceStr: 'USD 5', 
        period: '/ month', 
        icon: Zap, 
        color: 'text-emerald-500',
        desc: 'Entry tier for small operations.'
    },
    { 
        id: 'QUARTERLY', 
        name: 'Growth Quarterly', 
        price: 14.99,
        priceStr: 'USD 14.99', 
        period: '/ 3 months', 
        icon: Star, 
        color: 'text-blue-500',
        desc: 'Balanced tier for expansion.'
    },
    { 
        id: 'YEARLY', 
        name: 'Enterprise Yearly', 
        price: 55,
        priceStr: 'USD 55', 
        period: '/ year', 
        icon: Rocket, 
        color: 'text-purple-500',
        desc: 'Ultimate value for corporations.'
    },
  ];

  const currentPlan = plans.find(p => p.id === selectedPlan);

  const handleSelectPlan = (planId: SubscriptionPlanId) => {
      setSelectedPlan(planId);
      setShowCheckout(true);
      setTxStatus('IDLE');
      setPhone(user?.phone || '');
  };

  const validateUgandaPhone = (num: string) => {
      const clean = num.replace(/\D/g, '');
      return (clean.length === 9 || clean.length === 10 || clean.length === 12);
  };

  const handleMomoPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !validateUgandaPhone(phone)) {
        setErrorMessage("Please enter a valid Ugandan mobile number (MTN or Airtel).");
        return;
    }
    
    setErrorMessage('');
    setTxStatus('INITIATING');

    setTimeout(() => {
        setTxStatus('AWAITING_PIN');
        setTimeout(() => {
            setTxStatus('VERIFYING');
            setTimeout(() => {
                if (Math.random() < 0.05) {
                    setTxStatus('FAILED');
                    setErrorMessage("Insufficient balance or transaction timed out. Please try again.");
                } else {
                    setTxStatus('SUCCESS');
                    setTimeout(() => {
                        if (selectedPlan) selectSubscription(selectedPlan);
                    }, 2000);
                }
            }, 3000);
        }, 3000);
    }, 1500);
  };

  const handleCardPayment = (e: React.FormEvent) => {
      e.preventDefault();
      setTxStatus('VERIFYING');
      setTimeout(() => {
          setTxStatus('SUCCESS');
          setTimeout(() => {
              if (selectedPlan) selectSubscription(selectedPlan);
          }, 1500);
      }, 2500);
  };

  const getStatusConfig = () => {
    switch (txStatus) {
        case 'INITIATING': return { label: 'Contacting Provider...', desc: `Connecting to ${momoProvider} Secure Gateway`, color: 'text-blue-500', icon: <RefreshCw className="animate-spin" /> };
        case 'AWAITING_PIN': return { label: 'Authorize on Phone', desc: `Check your phone for a PIN request on ${phone}`, color: 'text-amber-500', icon: <Smartphone className="animate-bounce" /> };
        case 'VERIFYING': return { label: 'Verifying Settlement', desc: 'Awaiting network finalization...', color: 'text-blue-600', icon: <Loader2 className="animate-spin" /> };
        case 'SUCCESS': return { label: 'Activation Successful', desc: 'Account verified! Provisioning your workspace...', color: 'text-emerald-500', icon: <CheckCircle2 className="animate-in zoom-in duration-500" /> };
        case 'FAILED': return { label: 'Activation Failed', desc: errorMessage || 'The network returned an error.', color: 'text-red-500', icon: <AlertCircle /> };
        default: return null;
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="fixed inset-0 bg-slate-900/95 flex items-center justify-center z-[110] p-4 md:p-8 backdrop-blur-md overflow-y-auto">
      
      {!showCheckout && (
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] w-full max-w-5xl shadow-2xl flex flex-col transition-colors border border-white/5 my-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="p-8 md:p-12 text-center bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-t-[2rem] md:rounded-t-[3rem]">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-emerald-500/30">
                    <ShieldCheck size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">Activate Your Workspace</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-medium">
                    Choose a subscription plan to unlock full organizational management capabilities.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-6 pb-12 md:px-12 md:pb-12 pt-4">
                {plans.map((plan) => {
                    const PlanIcon = plan.icon;
                    return (
                        <div 
                            key={plan.id} 
                            className="group relative bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:border-emerald-500 transition-all hover:shadow-2xl flex flex-col"
                        >
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl mb-6 flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm ${plan.color}`}>
                                <PlanIcon size={24} />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6">{plan.desc}</p>
                            
                            <div className="mb-8">
                                <span className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{plan.priceStr}</span>
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest ml-1">{plan.period}</span>
                            </div>

                            <div className="space-y-3 mb-10 flex-1">
                                {['Unlimited Data Nodes', 'Enterprise Analytics', 'Uganda Mobile Money', 'Audit Ready Logs'].map((feature, i) => (
                                    <div key={i} className="flex items-center text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium">
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 text-emerald-600 shrink-0">
                                            <Check size={12} />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => handleSelectPlan(plan.id)}
                                className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-bold transition-all hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:scale-[1.02] shadow-lg active:scale-95"
                            >
                                Activate Plan
                            </button>
                        </div>
                    );
                })}
            </div>
            
            <div className="p-6 md:p-8 text-center bg-slate-100/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 rounded-b-[2rem] md:rounded-b-[3rem]">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Secure Gateway • Regional Currency Support • Enterprise Grade Security</p>
            </div>
          </div>
      )}

      {showCheckout && currentPlan && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden my-auto animate-in zoom-in duration-300 border border-white/5 relative">
              
              <div className="hidden md:flex md:w-1/3 bg-slate-50 dark:bg-slate-800/50 p-10 flex-col justify-between border-r border-slate-100 dark:border-slate-800">
                  <div>
                      <button 
                        onClick={() => { setShowCheckout(false); setTxStatus('IDLE'); }} 
                        className="mb-8 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center font-bold text-xs uppercase tracking-widest transition-colors"
                      >
                          <X size={16} className="mr-2"/> Back
                      </button>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Order Details</h3>
                      <div className="space-y-6">
                           <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-emerald-500">
                                    <currentPlan.icon size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{currentPlan.name}</p>
                                    <p className="text-xs text-slate-500">{currentPlan.desc}</p>
                                </div>
                           </div>
                           <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-3">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-400">Recurring Amount</span>
                                    <span className="text-slate-900 dark:text-white">{currentPlan.priceStr}</span>
                                </div>
                           </div>
                      </div>
                  </div>
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                      <div className="flex items-start space-x-3">
                          <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                              Activation is immediate following payment confirmation from the provider.
                          </p>
                      </div>
                  </div>
              </div>

              <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[85vh] scrollbar-thin flex flex-col">
                   <div className="flex justify-between items-center mb-8">
                       <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Checkout</h2>
                       <div className="flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                           <Lock size={12} className="mr-2" /> Secure Checkout
                       </div>
                   </div>

                   <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-10">
                        <button 
                            onClick={() => { setPaymentType('MOMO'); setTxStatus('IDLE'); }}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${paymentType === 'MOMO' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
                        >
                            <Smartphone size={16} />
                            <span>Mobile Money</span>
                        </button>
                        <button 
                            onClick={() => { setPaymentType('CARD'); setTxStatus('IDLE'); }}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${paymentType === 'CARD' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
                        >
                            <CreditCard size={16} />
                            <span>Card Payment</span>
                        </button>
                   </div>

                   {txStatus !== 'IDLE' && statusConfig && (
                       <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-12 animate-in fade-in zoom-in duration-300">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${statusConfig.color} bg-opacity-10 shadow-inner relative`}>
                                <div className="text-4xl">{statusConfig.icon}</div>
                            </div>
                            <div className="space-y-2">
                                <h3 className={`text-2xl font-black ${statusConfig.color}`}>{statusConfig.label}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                                    {statusConfig.desc}
                                </p>
                            </div>
                            {txStatus === 'FAILED' && (
                                <button 
                                    onClick={() => setTxStatus('IDLE')} 
                                    className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                                >
                                    Retry Transaction
                                </button>
                            )}
                       </div>
                   )}

                   {txStatus === 'IDLE' && (
                       <>
                           {paymentType === 'MOMO' ? (
                               <form onSubmit={handleMomoPayment} className="space-y-8 flex-1 flex flex-col">
                                    <div className="space-y-8">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-4">Select Provider</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button 
                                                    type="button"
                                                    onClick={() => setMomoProvider('MTN')}
                                                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center space-y-3 group ${momoProvider === 'MTN' ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 shadow-lg scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 grayscale opacity-60'}`}
                                                >
                                                    <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center text-slate-900 font-black text-2xl shadow-md group-hover:scale-110 transition-transform">MTN</div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">MTN Mobile Money</span>
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => setMomoProvider('AIRTEL')}
                                                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center space-y-3 group ${momoProvider === 'AIRTEL' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 grayscale opacity-60'}`}
                                                >
                                                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md italic group-hover:scale-110 transition-transform">airtel</div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Airtel Money</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Account Phone Number</label>
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center space-x-2 pr-4 border-r border-slate-200 dark:border-slate-700">
                                                    <span className="text-sm font-black text-slate-400">+256</span>
                                                </div>
                                                <input 
                                                    required 
                                                    type="tel"
                                                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 pl-24 pr-4 py-5 rounded-[1.5rem] font-black text-xl shadow-inner dark:text-white outline-none transition-all" 
                                                    placeholder="772 000 000" 
                                                    value={phone} 
                                                    onChange={e => setPhone(e.target.value)} 
                                                />
                                            </div>
                                            {errorMessage && <div className="flex items-center text-[10px] font-bold text-red-500 px-2 space-x-1 animate-pulse"><AlertCircle size={12} /> <span>{errorMessage}</span></div>}
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-slate-100 dark:border-slate-800 mt-auto">
                                        <button 
                                            type="submit"
                                            className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all hover:scale-[1.02] active:scale-95 text-xs flex items-center justify-center group"
                                        >
                                            Authorize Payment <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                               </form>
                           ) : (
                               <form onSubmit={handleCardPayment} className="space-y-8 flex-1 flex flex-col">
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 flex items-center"><CreditCard size={14} className="mr-2 text-nexa-blue" /> Card Details</h4>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Name on Card</label>
                                                <input required className="w-full bg-slate-50 dark:bg-slate-950 border-none p-5 rounded-2xl font-bold shadow-inner dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10" placeholder="Cardholder Name" value={cardDetails.cardholderName} onChange={e => setCardDetails({...cardDetails, cardholderName: e.target.value})} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Number</label>
                                                <input required maxLength={19} className="w-full bg-slate-50 dark:bg-slate-950 border-none p-5 rounded-2xl font-black shadow-inner dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 tracking-[0.15em]" placeholder="0000 0000 0000 0000" value={cardDetails.cardNumber} onChange={e => setCardDetails({...cardDetails, cardNumber: e.target.value})} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Expiry</label>
                                                    <input required maxLength={5} className="w-full bg-slate-50 dark:bg-slate-950 border-none p-5 rounded-2xl font-bold shadow-inner dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10" placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">CVV</label>
                                                    <input required maxLength={4} type="password" className="w-full bg-slate-50 dark:bg-slate-950 border-none p-5 rounded-2xl font-bold shadow-inner dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10" placeholder="•••" value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-10 border-t border-slate-100 dark:border-slate-800 mt-auto">
                                        <button type="submit" className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 text-xs transition-all">Submit Payment</button>
                                    </div>
                               </form>
                           )}
                       </>
                   )}
              </div>
          </div>
      )}
    </div>
  );
}