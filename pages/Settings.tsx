import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, Shield, Users, Building, Monitor, Lock, HelpCircle, CreditCard, ExternalLink, RefreshCw, Ship, Anchor, Globe, Plus, Trash2, CheckCircle2, X, Palette, Layout } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { DashboardTheme } from '../types';

export default function Settings() {
  const { user, theme, toggleTheme, replayTutorial, updateDashboardTheme, updateUser } = useApp();

  const THEME_OPTIONS: { id: DashboardTheme, label: string, color: string }[] = [
    { id: 'emerald', label: 'Emerald Growth', color: 'bg-emerald-500' },
    { id: 'blue', label: 'Ocean Export', color: 'bg-blue-500' },
    { id: 'indigo', label: 'Deep Indigo', color: 'bg-indigo-500' },
    { id: 'rose', label: 'Crimson Rose', color: 'bg-rose-500' },
    { id: 'amber', label: 'Golden Harvest', color: 'bg-amber-500' },
    { id: 'slate', label: 'Corporate Slate', color: 'bg-slate-700' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-2">
      <div className="mb-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Configuration</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Global platform preferences and governance controls.</p>
      </div>

      {/* Personalization Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 p-8 md:p-12 transition-colors">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
              <Palette size={22} className="mr-3 text-emerald-600" /> Interface Personalization
          </h2>
          
          <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mb-2">Visual Style Mode</p>
                      <p className="text-sm text-slate-500 font-medium mb-6">Switch between platform optimization modes.</p>
                      <button 
                        onClick={toggleTheme}
                        className={`flex items-center space-x-4 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
                            theme === 'dark' 
                            ? 'bg-white text-black hover:scale-105' 
                            : 'bg-slate-900 text-white hover:scale-105'
                        }`}
                      >
                          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                          <span>{theme === 'dark' ? 'Standard Light' : 'Deep Dark'}</span>
                      </button>
                  </div>
                  <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mb-2">Interactive Walkthrough</p>
                      <p className="text-sm text-slate-500 font-medium mb-6">Refresh your platform operational knowledge.</p>
                      <button 
                        onClick={replayTutorial}
                        className="flex items-center space-x-4 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 active:scale-95 transition-all shadow-sm"
                      >
                          <HelpCircle size={18} />
                          <span>Re-launch Tutorial</span>
                      </button>
                  </div>
              </div>

              <div className="pt-10 border-t border-slate-50 dark:border-slate-800">
                  <p className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center">
                      <Layout size={18} className="mr-2 text-primary-500" /> Organizational Brand Color
                  </p>
                  <p className="text-sm text-slate-500 font-medium mb-8">Select the primary accent color for your business dashboard.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {THEME_OPTIONS.map(opt => (
                          <button 
                            key={opt.id}
                            onClick={() => updateDashboardTheme(opt.id)}
                            className={`p-6 rounded-[1.5rem] border-2 transition-all flex items-center space-x-4 ${user?.dashboardTheme === opt.id ? 'border-emerald-500 bg-emerald-50/10 shadow-lg scale-[1.02]' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}`}
                          >
                              <div className={`w-10 h-10 rounded-xl ${opt.color} shadow-sm shadow-black/20`} />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${user?.dashboardTheme === opt.id ? 'text-emerald-600' : 'text-slate-500'}`}>{opt.label}</span>
                              {user?.dashboardTheme === opt.id && <CheckCircle2 size={16} className="ml-auto text-emerald-500" />}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* Governance Controls */}
      {user?.role === 'ADMIN' && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 p-8 md:p-12 transition-colors">
               <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
                  <Shield size={22} className="mr-3 text-red-500" /> Administrative Governance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link to="/app/staff" className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] hover:shadow-2xl transition-all group border border-transparent hover:border-primary-200 shadow-inner">
                      <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-blue-500 shadow-md mb-6 group-hover:scale-110 transition-transform">
                          <Users size={28} />
                      </div>
                      <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight uppercase tracking-widest">Team Hierarchy</p>
                      <p className="text-sm text-slate-500 mt-3 font-medium leading-relaxed">Manage departments, define granular access tokens, and track personnel performance.</p>
                  </Link>

                  <Link to="/app/profile" className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] hover:shadow-2xl transition-all group border border-transparent hover:border-emerald-200 shadow-inner">
                      <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-emerald-500 shadow-md mb-6 group-hover:scale-110 transition-transform">
                          <Building size={28} />
                      </div>
                      <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight uppercase tracking-widest">Corporate Profile</p>
                      <p className="text-sm text-slate-500 mt-3 font-medium leading-relaxed">Maintain statutory registration data, TIN synchronization, and legal entity identifiers.</p>
                  </Link>
              </div>
          </div>
      )}
    </div>
  );
}