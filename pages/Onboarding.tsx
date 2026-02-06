
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, InventoryItem, Farm } from '../types';
// Fixed: Added missing ArrowRight icon import
import { ChevronRight, Check, Package, Users, Building, Flag, Phone, Mail, Hash, Globe, Scale, Landmark, ShieldCheck, UserCheck, AlertCircle, FileText, X, ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const { user, completeOnboarding, addFarm, updateUser } = useApp();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [companyDetails, setCompanyDetails] = useState({
      name: user?.companyName || '',
      address: '',
      email: user?.email || '',
      phone: '',
      regNumber: '',
      tin: '',
      directors: '',
      businessSize: 'Small (1-10 Employees)',
      ucdaNumber: ''
  });
  
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  
  const handleFinish = async () => {
    // Comprehensive update of extended user profile
    await updateUser({
        companyName: companyDetails.name,
        companyAddress: companyDetails.address,
        contactEmail: companyDetails.email,
        phone: companyDetails.phone,
        regNumber: companyDetails.regNumber,
        tin: companyDetails.tin,
        directors: companyDetails.directors,
        businessSize: companyDetails.businessSize,
        ucdaNumber: companyDetails.ucdaNumber,
        setupComplete: true
    });
    completeOnboarding();
  };

  const handleAddFarm = () => {
    if (farmName) {
        addFarm({
            id: Math.random().toString(),
            name: farmName,
            location: farmLocation || 'Main Hub',
            size: 'N/A',
            farmingType: 'CROP',
            staffIds: [],
            initialAssets: []
        });
        setFarmName('');
        setFarmLocation('');
    }
  };

  const StepIndicator = () => (
    <div className="flex justify-between items-center mb-16 px-4 md:px-12 relative">
      <div className="absolute left-12 right-12 top-5 h-0.5 bg-slate-100 dark:bg-slate-700 -z-10"></div>
      {[1, 2, 3, 4].map(s => (
        <div key={s} className="flex flex-col items-center bg-white dark:bg-slate-900 z-10 px-4">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 shadow-sm ${
            step >= s 
            ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-xl scale-110' 
            : 'bg-slate-50 text-slate-300 dark:bg-slate-800'
          }`}>
            {step > s ? <Check size={20} /> : s}
          </div>
          <p className={`text-[9px] font-black uppercase tracking-widest mt-4 ${step >= s ? 'text-slate-900 dark:text-white' : 'text-slate-300'}`}>
             {s === 1 && 'Corporate'}
             {s === 2 && 'Fiscal'}
             {s === 3 && 'Operating'}
             {s === 4 && 'Complete'}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] md:rounded-[4rem] shadow-2xl w-full max-w-5xl overflow-hidden transition-all border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row min-h-[700px]">
        
        {/* Branding Sidebar */}
        <div className="md:w-1/3 bg-slate-900 p-10 md:p-14 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-12 opacity-10"><Building size={200} /></div>
            <div className="relative z-10">
                <ShieldCheck size={40} className="text-emerald-500 mb-8" />
                <h1 className="text-4xl font-black tracking-tighter leading-tight mb-4">Account Integrity Setup</h1>
                <p className="text-slate-400 font-medium leading-relaxed">Mandatory identity verification for agricultural enterprise nodes in the Uganda region.</p>
            </div>
            <div className="relative z-10 pt-12 space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Secured Layer Established</span>
                </div>
            </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 p-8 md:p-16 flex flex-col overflow-y-auto max-h-[90vh] scrollbar-thin">
            <StepIndicator />

            {/* STEP 1: Corporate Profile */}
            {step === 1 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 flex-1">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Corporate Profile</h2>
                        <p className="text-slate-500 font-medium">Verify your legal business identity.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Legal Business Entity Name</label>
                            <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-black outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" 
                                value={companyDetails.name} 
                                onChange={e => setCompanyDetails({...companyDetails, name: e.target.value})} 
                                placeholder="Global Agri Partners Ltd" 
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Primary Operating Address</label>
                            <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-bold outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" 
                                value={companyDetails.address} 
                                onChange={e => setCompanyDetails({...companyDetails, address: e.target.value})} 
                                placeholder="Plots 14-16, Kampala Business Park" 
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Official Contact Email</label>
                             <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-bold outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" 
                                value={companyDetails.email} 
                                onChange={e => setCompanyDetails({...companyDetails, email: e.target.value})} 
                                placeholder="hq@company.com" 
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Corporate Phone</label>
                             <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-bold outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" 
                                value={companyDetails.phone} 
                                onChange={e => setCompanyDetails({...companyDetails, phone: e.target.value})} 
                                placeholder="+256 700..." 
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: Fiscal Identity */}
            {step === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 flex-1">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Fiscal Identity</h2>
                        <p className="text-slate-500 font-medium">Statutory registration and tax identification.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Business Registration (BRN)</label>
                            <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-black outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner tracking-widest" 
                                value={companyDetails.regNumber} 
                                onChange={e => setCompanyDetails({...companyDetails, regNumber: e.target.value})} 
                                placeholder="8002XXXX" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Tax ID (TIN)</label>
                            <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-black outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner tracking-widest" 
                                value={companyDetails.tin} 
                                onChange={e => setCompanyDetails({...companyDetails, tin: e.target.value})} 
                                placeholder="101XXXXXXX" 
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Director / Owner Names</label>
                            <input 
                                className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-bold outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" 
                                value={companyDetails.directors} 
                                onChange={e => setCompanyDetails({...companyDetails, directors: e.target.value})} 
                                placeholder="Full names separated by commas" 
                            />
                        </div>

                        {/* Uganda-Specific Validation Logic */}
                        {user?.businessType?.toLowerCase().includes('coffee export') && (
                            <div className="md:col-span-2 bg-amber-50 dark:bg-amber-900/10 p-8 rounded-[2rem] border border-amber-100 dark:border-amber-800 animate-in zoom-in duration-300">
                                <div className="flex items-center space-x-3 mb-6">
                                    <ShieldCheck className="text-amber-600" />
                                    <h4 className="text-[10px] font-black text-amber-800 dark:text-amber-500 uppercase tracking-widest">UCDA Compliance required</h4>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-[0.4em] px-4">UCDA Registration Number</label>
                                    <input 
                                        required
                                        className="w-full border-none bg-white dark:bg-slate-950 p-5 rounded-2xl dark:text-white font-black outline-none shadow-sm focus:ring-4 focus:ring-amber-500/10" 
                                        value={companyDetails.ucdaNumber} 
                                        onChange={e => setCompanyDetails({...companyDetails, ucdaNumber: e.target.value})} 
                                        placeholder="EXP/XXXX/2024" 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 3: Operating Logic */}
            {step === 3 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500 flex-1">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Operating Framework</h2>
                        <p className="text-slate-500 font-medium">Define your initial operational assets.</p>
                    </div>
                    <div className="space-y-8">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Initial Production Unit Name</label>
                            <input className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-black outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" placeholder="e.g. Masaka Regional Hub" value={farmName} onChange={e => setFarmName(e.target.value)} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Facility Location</label>
                            <input className="w-full border-none bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl dark:text-white font-bold outline-none focus:ring-4 focus:ring-slate-900/5 shadow-inner" placeholder="e.g. Bukakata, Masaka District" value={farmLocation} onChange={e => setFarmLocation(e.target.value)} />
                         </div>
                         <button onClick={handleAddFarm} className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest py-6 rounded-2xl hover:bg-slate-100 transition-all">
                            + Initialize Faciltiy Node
                         </button>
                    </div>
                </div>
            )}
            
            {/* STEP 4: Activation */}
             {step === 4 && (
                <div className="space-y-8 text-center animate-in zoom-in duration-500 flex-1 flex flex-col justify-center">
                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-emerald-600 shadow-2xl border-4 border-white dark:border-slate-800">
                        <UserCheck size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Configuration Ready</h2>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                        Your corporate infrastructure for <span className="font-black text-slate-900 dark:text-white">{companyDetails.name}</span> is ready for deployment.
                    </p>
                    <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 text-left max-w-sm mx-auto w-full">
                         <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Fiscal Summary</h4>
                         <div className="space-y-3">
                             <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                 <span>TIN Identified</span>
                                 <Check size={14} className="text-emerald-500"/>
                             </div>
                             <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                 <span>Registry Linked</span>
                                 <Check size={14} className="text-emerald-500"/>
                             </div>
                         </div>
                    </div>
                </div>
            )}

            <div className="mt-16 pt-8 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center shrink-0">
                {step > 1 ? (
                    <button onClick={() => setStep(step - 1)} className="px-10 py-4 text-slate-400 font-black uppercase tracking-widest hover:text-slate-900 transition-colors text-[10px]">
                        Prev Stage
                    </button>
                ) : <div></div>}
                
                {step < totalSteps ? (
                    <button onClick={() => setStep(step + 1)} className="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center">
                        Proceed <ArrowRight size={16} className="ml-2" />
                    </button>
                ) : (
                    <button onClick={handleFinish} className="px-16 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all text-xs">
                        Inject Corporate Stack
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
