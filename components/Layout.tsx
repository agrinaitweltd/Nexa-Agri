import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, useNavigate, Outlet } = ReactRouterDOM as any;
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Warehouse, Ship, DollarSign, LogOut, 
  Menu, Bell, X, Cat, Users, Briefcase, Settings, HelpCircle, FileStack, MessageSquare, BarChart3, Search, Clock, ShieldAlert, ChevronRight, Wallet, CheckCircle2, User as UserIcon, Tractor, FlaskConical, Palette
} from 'lucide-react';
import { NexaLogo } from './NexaLogo';

export default function Layout() {
  const { user, logout, notifications, markNotificationRead, markAllNotificationsRead, theme, balance, formatCurrency, messages } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadMsgs = messages.filter(m => !m.read && m.type === 'INBOX').length;
  
  const isLivestock = user?.sector === 'LIVESTOCK' || user?.businessType?.toLowerCase().includes('livestock');
  const isAdmin = user?.role === 'ADMIN';

  const hasPermission = (perm: string) => {
    if (isAdmin) return true;
    return user?.permissions?.includes(perm as any) || false;
  };

  // Preset Theme Colors Mapping with safe fallbacks
  const themeColors: Record<string, string> = {
      emerald: 'bg-emerald-600 shadow-emerald-600/30 text-emerald-600',
      blue: 'bg-blue-600 shadow-blue-600/30 text-blue-600',
      indigo: 'bg-indigo-600 shadow-indigo-600/30 text-indigo-600',
      rose: 'bg-rose-600 shadow-rose-600/30 text-rose-600',
      amber: 'bg-amber-600 shadow-amber-600/30 text-amber-600',
      slate: 'bg-slate-700 shadow-slate-700/30 text-slate-700'
  };

  const activeThemeColor = user?.dashboardTheme || 'emerald';
  const colorString = themeColors[activeThemeColor] || themeColors.emerald;
  const activeBgClass = colorString.split(' ')[0];
  const activeShadowClass = colorString.split(' ')[1];
  const activeTextClass = colorString.split(' ')[2];

  const NavItem = ({ to, icon: Icon, label, badge }: { to: string, icon: any, label: string, badge?: number }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive 
            ? `${activeBgClass} text-white shadow-lg ${activeShadowClass} translate-x-1` 
            : `text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:${activeTextClass} hover:translate-x-1`
        }`}
      >
        <div className="flex items-center space-x-3">
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </div>
        {badge ? (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">{badge}</span>
        ) : null}
      </Link>
    );
  };

  const handleNotificationClick = (note: any) => {
      markNotificationRead(note.id);
      if (note.link) navigate(note.link);
      setShowNotifications(false);
  };

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors ${theme}`}>
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none border-r border-slate-200 dark:border-slate-800 ${
          isSidebarOpen ? 'translate-x-0' : '-x-full'
        } ${!isSidebarOpen && 'md:translate-x-0'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center">
            <NexaLogo className="h-10" />
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500 dark:text-slate-400 p-1 hover:bg-slate-50 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1.5 mt-2 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-hide">
          <NavItem to="/app" icon={LayoutDashboard} label="Dashboard" />
          {(isAdmin || hasPermission('LOG_HARVEST')) && (
             <NavItem to="/app/farms" icon={Tractor} label="Crops & Farms" />
          )}
          {isLivestock && (
             <NavItem to="/app/animals" icon={Cat} label="Livestock & Animals" />
          )}
          <NavItem to="/app/inventory" icon={Warehouse} label="Inventory" />
          <NavItem to="/app/exports" icon={Ship} label="Mission Control" />
          <NavItem to="/app/vault" icon={FileStack} label="Vault & Documents" />
          <NavItem to="/app/communication" icon={MessageSquare} label="Communication" badge={unreadMsgs} />
          <NavItem to="/app/staff" icon={Users} label="Staff & Teams" />
          <NavItem to="/app/finance" icon={DollarSign} label="Finance & Audit" />
          <NavItem to="/app/reports" icon={BarChart3} label="Intelligence" />
          
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
             <NavItem to="/app/settings" icon={Settings} label="Settings" />
             <NavItem to="/app/help" icon={HelpCircle} label="Help & FAQs" />
          </div>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
           <div className="p-4">
                <button 
                onClick={logout}
                className="flex items-center space-x-3 px-4 py-2.5 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all text-sm font-bold active:scale-95"
                >
                <LogOut size={18} />
                <span>Sign Out</span>
                </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white dark:bg-slate-900 h-24 flex items-center shadow-sm z-40 transition-colors border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex-1 flex flex-col justify-center px-6 md:px-10">
            <div className="flex items-center space-x-3">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight truncate">
                    Hello, {user?.name?.split(' ')[0] || 'User'}!
                </h2>
            </div>
            <div className="flex items-center space-x-2 mt-1">
                <p className="text-slate-400 dark:text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest truncate">
                  {user?.companyName || 'Your Business'}
                </p>
                <ChevronRight size={12} className="text-slate-300" />
                <span className={`${activeTextClass} text-[10px] md:text-xs font-bold uppercase tracking-widest`}>{user?.sector || 'General'}</span>
            </div>
          </div>

          <div className="flex items-center pr-6 md:pr-10 space-x-2 md:space-x-4">
            <div className="hidden lg:flex flex-col items-end mr-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Balance</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(balance)}</span>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                   <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                     <h3 className="font-bold text-slate-700 dark:text-white text-sm">Notifications</h3>
                     <button onClick={markAllNotificationsRead} className="text-[10px] font-bold uppercase tracking-widest">Clear</button>
                   </div>
                   <div className="max-h-64 overflow-y-auto">
                     {notifications.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 italic text-sm">No new alerts</div>
                     ) : (
                        notifications.slice().reverse().map(note => (
                            <div 
                                key={note.id} 
                                onClick={() => handleNotificationClick(note)}
                                className={`p-4 border-b border-slate-50 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-all ${!note.read ? 'bg-emerald-50/40 dark:bg-emerald-900/10' : ''}`}
                            >
                                <p className={`text-sm leading-tight ${!note.read ? 'font-bold text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{note.message}</p>
                                <p className="text-[9px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">{new Date(note.date).toLocaleString()}</p>
                            </div>
                        ))
                     )}
                   </div>
                </div>
              )}
            </div>

            <Link to="/app/profile" className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                <UserIcon size={20} />
            </Link>
            
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 ml-1">
              <Menu size={24} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-10 transition-colors scrollbar-thin bg-slate-50/50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}