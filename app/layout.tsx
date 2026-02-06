
// Fixed: Added React import to resolve 'Cannot find namespace React' error for React.ReactNode
import React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AppProvider } from "../context/AppContext";

export const metadata: Metadata = {
  title: "NexaAgri Enterprise | Managed Agriculture",
  description: "Cloud-based management platform for Agricultural businesses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="antialiased">
        <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <AppProvider>
            {children}
          </AppProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
