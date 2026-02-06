import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { 
  ShieldCheck, 
  Globe2, 
  BarChart3, 
  Warehouse, 
  Users, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Menu,
  X,
  Ship,
  DollarSign,
  Tractor,
  Layers,
  Leaf,
  ClipboardCheck,
  Building2,
  Briefcase
} from 'lucide-react';
import { NexaLogo } from '../components/NexaLogo';

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: "Active Export Hubs", value: "120+" },
    { label: "Ugandan Districts", value: "45+" },
    { label: "Volume Tracked", value: "25k+ Tons" },
    { label: "Compliance Rate", value: "99.9%" }
  ];

  const features = [
    {
      icon: Tractor,
      title: "Farm Management",
      desc: "Complete oversight of production units, soil metrics, and labor allocations for primary producers."
    },
    {
      icon: Leaf,
      title: "Crop Lifecycle Tracking",
      desc: "Real-time monitoring from planting to harvest with yield forecasting and quality grading."
    },
    {
      icon: Ship,
      title: "Export & Logistics",
      desc: "End-to-end shipment manifests with built-in UCDA compliance and global logistics tracking."
    },
    {
      icon: Users,
      title: "Staff & Departments",
      desc: "Manage personnel across multiple business units with granular role-based access protocols."
    },
    {
      icon: DollarSign,
      title: "Financial Auditing",
      desc: "Integrated fiscal ledger for tracking production costs, requisition approvals, and export revenues."
    },
    {
      icon: ClipboardCheck,
      title: "Compliance Manager",
      desc: "Automated handling of UCDA registrations, tax IDs (TIN), and statutory agribusiness requirements."
    }
  ];

  const targetAudience = [
    {
      title: "Coffee Exporters",
      desc: "Specialized tools for Uganda's primary export sector including UCDA manifest automation.",
      icon: Globe2
    },
    {
      title: "Agricultural Companies",
      desc: "Enterprise-grade infrastructure for large-scale operations and value-addition factories.",
      icon: Building2
    },
    {
      title: "Commercial Farm Owners",
      desc: "Direct production management for large-scale crop and livestock enterprises.",
      icon: Tractor
    },
    {
      title: "Production Managers",
      desc: "Day-to-day operational tools for managing field staff and inventory workflows.",
      icon: Briefcase
    }
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div id="top" className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm' : 'bg-transparent py-6 md:py-10'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={scrollToTop}>
            <NexaLogo className="h-8 md:h-10" />
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <a href="#top" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-600 transition-colors">Home</a>
            <a href="#features" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-600 transition-colors">Features</a>
            <a href="#audience" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-600 transition-colors">About</a>
            <div className="flex items-center space-x-4 ml-6 border-l border-slate-200 pl-8">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:text-emerald-600 transition-colors">Sign In</Link>
                <Link 
                    to="/login" 
                    className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all active:scale-95"
                >
                    Sign Up
                </Link>
            </div>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-900 bg-slate-100 rounded-xl">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-8 space-y-10 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
            <div className="space-y-6">
                <a href="#top" onClick={() => setIsMenuOpen(false)} className="block text-xl font-black uppercase tracking-tighter text-slate-900">Home</a>
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-xl font-black uppercase tracking-tighter text-slate-900">Features</a>
                <a href="#audience" onClick={() => setIsMenuOpen(false)} className="block text-xl font-black uppercase tracking-tighter text-slate-900">About</a>
            </div>
            <div className="space-y-4 pt-6 border-t">
                <Link to="/login" className="block w-full text-center py-4 text-slate-500 font-black uppercase tracking-widest text-xs">Sign In</Link>
                <Link 
                  to="/login" 
                  className="block w-full bg-slate-900 text-white text-center py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
                >
                  Sign Up
                </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-60 md:pb-40 px-6 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="md:max-w-4xl space-y-8 md:space-y-12">
              <div className="inline-flex items-center space-x-3 bg-emerald-100 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-emerald-800">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Agricultural Management Platform</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-slate-950 tracking-tighter leading-[0.95]">
                Manage Your Farms, Crops, and <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">Agricultural Exports.</span>
              </h1>
              <p className="text-slate-500 text-lg md:text-2xl font-medium leading-relaxed max-w-3xl">
                The high-performance cloud platform engineered for Ugandan agribusiness. Centralize your production logs, logistics manifests, and corporate auditing on one secure dashboard.
              </p>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                <Link 
                  to="/login" 
                  className="w-full sm:w-auto bg-slate-900 text-white px-12 py-7 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center group"
                >
                  Get Started <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link 
                  to="/login" 
                  className="w-full sm:w-auto px-10 py-7 text-slate-500 font-black text-xs uppercase tracking-[0.3em] hover:text-slate-900 transition-all flex items-center justify-center"
                >
                  Sign Up
                </Link>
              </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section id="audience" className="py-24 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-20 space-y-4 text-center">
              <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.8em]">Built For</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">Regional Sector Leaders.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {targetAudience.map((item, i) => (
                  <div key={i} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 mb-8 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          <item.icon size={24} />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 mb-4">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
              ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 md:py-40 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-24 space-y-6">
             <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.8em]">Core Features</h2>
             <h3 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">Total Command Over <br/>Your Assets.</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {features.map((f, i) => (
              <div key={i} className="p-10 md:p-12 bg-white/5 rounded-[3.5rem] border border-white/10 hover:border-emerald-500/30 transition-all hover:bg-white/10 group">
                <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-6 tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24 space-y-4">
                  <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.8em]">How It Works</h2>
                  <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">Seamless Digital Transition.</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                  {[
                      { step: "01", title: "Sign Up", desc: "Define your company profile including TIN and registration identifiers." },
                      { step: "02", title: "Add Farms & Crops", desc: "Digitize your production units and active crop lifecycles." },
                      { step: "03", title: "Track Production", desc: "Audit yields, processing costs, and real-time inventory updates." },
                      { step: "04", title: "Manage Exports", desc: "Execute global supply missions with automated compliance manifests." }
                  ].map((item, i) => (
                      <div key={i} className="relative">
                          <div className="text-6xl font-black text-slate-100 absolute -top-8 -left-4 z-0">{item.step}</div>
                          <div className="relative z-10 space-y-4">
                              <h4 className="text-xl font-black text-slate-900">{item.title}</h4>
                              <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-slate-50 py-20 px-6 md:px-12 border-y border-slate-100">
          <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center md:text-left space-y-2">
                            <p className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter">{s.value}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                        </div>
                    ))}
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-20 md:py-32 bg-white border-t border-slate-100 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20 md:mb-32">
            <div className="col-span-1 md:col-span-2 space-y-8">
                <NexaLogo className="h-8 md:h-10" />
                <p className="text-slate-500 text-xl max-w-sm font-medium leading-relaxed">
                    Uganda's premier management architecture for agricultural exports, value addition, and commercial production.
                </p>
            </div>
            <div className="space-y-8">
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">About</h5>
                <ul className="space-y-5 text-sm font-bold text-slate-600 uppercase tracking-widest">
                    <li><Link to="/login" className="hover:text-emerald-600 transition-colors">Sign In</Link></li>
                    <li><Link to="/login" className="hover:text-emerald-600 transition-colors">Pricing</Link></li>
                    <li><Link to="/app/help" className="hover:text-emerald-600 transition-colors">Support</Link></li>
                </ul>
            </div>
            <div className="space-y-8">
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Legal</h5>
                <ul className="space-y-5 text-sm font-bold text-slate-600 uppercase tracking-widest">
                    <li><Link to="/app/help" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
                    <li><Link to="/app/help" className="hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
                </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-16 border-t border-slate-200 gap-8">
            <div className="space-y-2 text-center md:text-left">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">© 2026 NexaAgri Intelligence Ltd. All Rights Reserved.</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Built and Powered By <a href="https://www.agrinaitwe.site" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Agrinaitwe Technologies</a>
                </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}