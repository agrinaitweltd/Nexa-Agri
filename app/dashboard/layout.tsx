
import React from 'react';
import Layout from '../../components/Layout';
import SyncUser from '../../components/SyncUser';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SyncUser />
      {/* Layout component uses Outlet internally, so we render children separately or let Outlet handle it */}
      <Layout />
      {children}
    </>
  );
}
