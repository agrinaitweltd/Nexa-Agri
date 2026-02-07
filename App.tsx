
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { BrowserRouter, Routes, Route, Navigate } = ReactRouterDOM as any;
import { AppProvider, useApp, MOCK_AUTH } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import Inventory from './pages/Inventory';
import Exports from './pages/Exports';
import Finance from './pages/Finance';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Animals from './pages/Animals';
import Staff from './pages/Staff';
import Clients from './pages/Clients';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Reports from './pages/Reports';
import Landing from './pages/Landing';
import Vault from './pages/Vault';
import Communication from './pages/Communication';
import AdminPortal from './pages/AdminPortal';
import SubscriptionModal from './components/SubscriptionModal';

const ProtectedRoute = ({ children, requireSuperAdmin = false }: { children?: React.ReactNode, requireSuperAdmin?: boolean }) => {
  const { user, loading } = useApp();

  if (loading) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-slate-950">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Initializing Hub...</p>
          </div>
      );
  }

  if (!user) return <Navigate to="/login" replace />;

  const isSuperAdmin = user.id === 'oliver-001';

  if (requireSuperAdmin && !isSuperAdmin) return <Navigate to="/app" replace />;
  if (!requireSuperAdmin && isSuperAdmin) return <Navigate to="/admin" replace />;

  if (!user.setupComplete && !isSuperAdmin) return <Onboarding />; 
  
  return (
    <>
      {!MOCK_AUTH && user.setupComplete && !user.subscriptionPlan && user.role === 'ADMIN' && <SubscriptionModal />}
      {children}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                
                <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="farms" element={<Farms />} />
                    <Route path="animals" element={<Animals />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="exports" element={<Exports />} />
                    <Route path="vault" element={<Vault />} />
                    <Route path="communication" element={<Communication />} />
                    <Route path="finance" element={<Finance />} />
                    <Route path="staff" element={<Staff />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="help" element={<Help />} />
                    <Route path="reports" element={<Reports />} />
                </Route>

                <Route path="/admin" element={<ProtectedRoute requireSuperAdmin><AdminPortal /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </AppProvider>
  );
}
